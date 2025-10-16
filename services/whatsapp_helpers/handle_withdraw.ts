import {
  withdrawMethodMessageTemplate,
  withdrawAmountMessageTemplate,
  withdrawNumberMessageTemplate,
  withdrawUnsupportedNumberMessageTemplate,
  withdrawDifferentNumberMessageTemplate,
  withdrawConfirmMessageTemplate,
  withdrawSuccessMessageTemplate,
  withdrawFailedMessageTemplate,
} from '@/lib/whapi_message_template';
import * as monimeService from '@/services/monime_service';
import * as walletService from '@/services/wallet_service';
import * as currencyService from '@/services/currency_service';
import { convertFromUSD } from '@/lib/helpers';
import { sendButtonMessage, sendTextMessage } from '@/lib/whapi';
import { updateBotIntent } from '@/services/bot_intent_service';
import { startTransaction, commitTransaction, abortTransaction } from '@/lib/db_transaction';
import {
  isValidAmount,
  isValidPhoneNumber,
  normalizePhoneNumber,
  extractButtonId,
  extractListId,
  extractTextInput,
  sendValidationError,
  handleInvalidInput,
  handleComingSoonFeature,
  isComingSoonFeature,
} from '@/lib/whatsapp_utils';
import { lookupMobileOperator, isLookupSuccess } from 'mobile-operator-lookup';
import type { MobileOperatorResult } from 'mobile-operator-lookup';

export async function handleWithdraw(message: any, botIntent: any, method?: any, user?: any) {
  const session = await startTransaction();
  const mobile = `+${message.from}`;

  try {
    // Send withdraw method options
    if (botIntent.intent === 'start') {
      await updateBotIntent(
        botIntent._id,
        {
          intent: 'withdraw',
          step: 1,
        },
        session
      );
      const ctx = await withdrawMethodMessageTemplate(message.from);
      await sendButtonMessage(ctx);
    } else if (botIntent.intent === 'withdraw') {
      console.log('botIntent.intent', botIntent.intent);
       console.log('method', method);
      
      // Handle case where method is null and we need to show method selection
      if (!method && (botIntent.step === 0 || botIntent.step === 1)) {
        const ctx = await withdrawMethodMessageTemplate(message.from);
        await sendButtonMessage(ctx);
        await updateBotIntent(
          botIntent._id,
          {
            step: 1,
          },
          session
        );
      } else if (method === 'ListV3:wo1' || botIntent.intent_option === 'mobile_money') {
       
        // Mobile Money withdraw flow
        if (method) {
          await updateBotIntent(
            botIntent._id,
            {
              intent_option: 'mobile_money',
            },
            session
          );
        }

        if (botIntent.step === 0 || botIntent.step === 1) {
          // Ask for amount
          const ctx = await withdrawAmountMessageTemplate(user);
          await sendTextMessage(message.from, ctx);

          await updateBotIntent(
            botIntent._id,
            {
              step: 2,
            },
            session
          );
        } else if (botIntent.step === 2) {
          // Validate and store amount
          const amt = extractTextInput(message);

          if (!amt || !isValidAmount(amt)) {
            await sendValidationError('amount', message.from);
            await commitTransaction(session);
            return;
          }

          // Check if user has sufficient balance
          const userCurrency = await currencyService.getCurrency(user);
          const walletBalance = await walletService.getWalletBalance(user);
          const fiatBalance = await convertFromUSD(walletBalance.balance, userCurrency, 'withdrawal');
          
          if (fiatBalance < parseFloat(amt)) {
            await sendTextMessage(
              message.from,
              `Dear ${user.name}, your withdrawal of ${amt} ${userCurrency} cannot be processed due to insufficient balance. Your current balance is ${fiatBalance.toFixed(2)} ${userCurrency}. Please top up your account and try again. Thank you.`
            );
            await commitTransaction(session);
            return;
          }

          await updateBotIntent(
            botIntent._id,
            {
              step: 3,
              amount: amt,
            },
            session
          );
          //lookup the user's number 
          const result: MobileOperatorResult = lookupMobileOperator(`+${message.from}`);
          if (!isLookupSuccess(result)) {
            await sendValidationError('phone', message.from);
            await commitTransaction(session);
            return;
          }
          const providerCode = result.monime_code;

          // Check if the provider code is supported for mobile money withdrawal
          if (providerCode === 'm13' || !providerCode) {
            // Send unsupported number message with only "Different number" option
            const ctx = await withdrawUnsupportedNumberMessageTemplate(message.from);
            await sendButtonMessage(ctx);
          } else {
            // Ask if withdrawing to self or different number (normal flow)
            const ctx = await withdrawNumberMessageTemplate(message.from);
            await sendButtonMessage(ctx);
          }

        } else if (botIntent.step === 3) {
          // Handle recipient selection
          const fundingAcct = extractButtonId(message);
          
          if (fundingAcct === 'ButtonsV3:self') {
            const ctx = await withdrawConfirmMessageTemplate(
              message.from_name,
              message.from,
              `+${message.from}`,
              botIntent.amount
            );
            await sendButtonMessage(ctx);
            
            await updateBotIntent(
              botIntent._id,
              {
                step: 4,
                payer: 'self',
                number: `+${message.from}`,
              },
              session
            );
          } else if (
            fundingAcct === 'ButtonsV3:different_number' ||
            botIntent.payer === 'different_number'
          ) {
            if (fundingAcct === 'ButtonsV3:different_number') {
              await updateBotIntent(
                botIntent._id,
                {
                  payer: 'different_number',
                },
                session
              );
              const ctx = await withdrawDifferentNumberMessageTemplate();
              await sendTextMessage(message.from, ctx);
            } else if (botIntent.payer === 'different_number' && botIntent.number === null) {
              const number = extractTextInput(message);
              
              if (!number || !isValidPhoneNumber(number)) {
                await sendValidationError('phone', message.from);
                await commitTransaction(session);
                return;
              }

              const normalizedNumber = normalizePhoneNumber(number);

              // Validate the different number for mobile money support
              const differentNumberResult: MobileOperatorResult = lookupMobileOperator(normalizedNumber);
              if (!isLookupSuccess(differentNumberResult)) {
                await sendValidationError('phone', message.from);
                await commitTransaction(session);
                return;
              }
              
              const differentProviderCode = differentNumberResult.monime_code;
              if (differentProviderCode === 'm13' || !differentProviderCode) {
                // The different number is also unsupported, show error and ask for another number
                const ctx = await withdrawUnsupportedNumberMessageTemplate(message.from);
                await sendButtonMessage(ctx);
                await commitTransaction(session);
                return;
              }

              const ctx = await withdrawConfirmMessageTemplate(
                message.from_name,
                message.from,
                normalizedNumber,
                botIntent.amount
              );
              await sendButtonMessage(ctx);
              
              await updateBotIntent(
                botIntent._id,
                {
                  step: 4,
                  number: normalizedNumber,
                },
                session
              );
            } else {
              await handleInvalidInput(message, 'button');
              await commitTransaction(session);
              return;
            }
          } else {
            await handleInvalidInput(message, 'button');
            await commitTransaction(session);
            return;
          }
        } else if (botIntent.step === 4) {
          // Handle confirmation
          const confirmBtn = extractButtonId(message);
          
          if (confirmBtn === 'ButtonsV3:w_confirm') {
            try {
              // Process withdrawal
              await monimeService.withdraw(
                user,
                {
                  amount: botIntent.amount,
                  receiving_number: botIntent.number,
                  platform: 'whatsapp',
                },
                session
              );

              // Send success message
              const successMsg = await withdrawSuccessMessageTemplate(
                message.from_name,
                message.from,
                botIntent.amount,
                'Le'
              );
              await sendTextMessage(message.from, successMsg);

              await updateBotIntent(
                botIntent._id,
                {
                  step: 5,
                  status: 'success',
                },
                session
              );
            } catch (error) {
              console.error('Withdrawal failed:', error);
              
              // Send failure message
              const failureMsg = await withdrawFailedMessageTemplate(
                message.from_name,
                message.from,
                botIntent.amount,
                'Le'
              );
              await sendTextMessage(message.from, failureMsg);

              await updateBotIntent(
                botIntent._id,
                {
                  step: 5,
                  status: 'failed',
                },
                session
              );
            }

            // Reset bot intent to start state for next interaction
            await updateBotIntent(
              botIntent._id,
              {
                intent: 'start',
                status: 'pending',
                step: 0,
                amount: null,
                currency: null,
                number: null,
                payer: null,
                intent_option: null,
                ussd: "",
              },
              session
            );
          } else if (confirmBtn === 'ButtonsV3:cancel') {
            // Reset to main menu after cancel
            await updateBotIntent(
              botIntent._id,
              {
                intent: 'start',
                step: 0,
              },
              session
            );
            
            // Send cancellation message and main menu
            const { operationCancelledMessageTemplate, mainMenuMessageTemplate } = await import('../../lib/whapi_message_template');
            const { sendTextMessage, sendButtonMessage } = await import('../../lib/whapi');
            
            const cancelMessage = await operationCancelledMessageTemplate(message.from);
            await sendTextMessage(message.from, cancelMessage);
            
            const menuTemplate = await mainMenuMessageTemplate(message.from_name, message.from);
            await sendButtonMessage(menuTemplate);
          } else {
            await handleInvalidInput(message, 'button');
            await commitTransaction(session);
            return;
          }
        }
      } else if (method === 'ListV3:wo2' || botIntent.intent_option === 'moneygram') {
        // MoneyGram coming soon
        if (isComingSoonFeature('wo2') || method === 'ListV3:wo2') {
          await handleComingSoonFeature('wo2', message, session);
          
          // Reset to main menu
          await updateBotIntent(
            botIntent._id,
            {
              intent: 'start',
              step: 0,
            },
            session
          );
        }
      } else {
        await handleInvalidInput(message, 'list');
        await commitTransaction(session);
        return;
      }
    }

    await commitTransaction(session);
  } catch (error) {
    console.error('Error in handleWithdraw:', error);
    await abortTransaction(session);
    throw error;
  }
}
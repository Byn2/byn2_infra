import {
  depositMethodMessageTemplate,
  mmDepositMessageTemplate1,
  mmDepositMessageTemplateAmount,
  mmDepositMessageTemplateConfirm,
  mmDepositMessageTemplateDifferentNumber,
  mmDepositMessageTemplateUSSD,
  mmDepositMessageTemplateUSSDDifferentNumber,
} from '@/lib/whapi_message_template';
import * as monimeService from '@/services/monime_service';
import { sendButtonMessage, sendTextMessage } from '@/lib/whapi';
import { updateBotIntent } from '@/services/bot_intent_service';
import { startTransaction, commitTransaction, abortTransaction } from '@/lib/db_transaction';
import {
  isValidAmount,
  isValidPhoneNumber,
  extractButtonId,
  extractListId,
  extractTextInput,
  sendValidationError,
  handleInvalidInput
} from '@/lib/whatsapp_utils';

export async function handleDeposit(message: any, botIntent: any, method?: any, user?: any) {
  const session = await startTransaction();
  const mobile = `+${message.from}`;
  //update bot intent

  //send deposit option
  if (botIntent.intent === 'start') {
    await updateBotIntent(
      botIntent._id,
      {
        intent: 'deposit',
        step: 1,
      },
      session
    );
    const ctx = await depositMethodMessageTemplate(message.from);
    await sendButtonMessage(ctx);
  } else if (botIntent.intent === 'deposit') {
    if (method === 'ListV3:do1' || botIntent.intent_option === 'mobile_money') {
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
        // who is funding the transaction
        const ctx = await mmDepositMessageTemplate1(message.from);
        await sendButtonMessage(ctx);

        //update bot step
        await updateBotIntent(
          botIntent._id,
          {
            step: 2,
          },
          session
        );
      } else if (botIntent.step === 2) {
        const fundingAcct = extractButtonId(message);
        if (fundingAcct === 'ButtonsV3:self') {
          const ctx = await mmDepositMessageTemplateAmount();
          await sendTextMessage(message.from, ctx);
          await updateBotIntent(
            botIntent._id,
            {
              step: 3,
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
            const ctx = await mmDepositMessageTemplateDifferentNumber();
            await sendTextMessage(message.from, ctx);
          } else if (botIntent.payer === 'different_number' && botIntent.number === null) {
            const number = extractTextInput(message);
            
            if (!number || !isValidPhoneNumber(number)) {
              await sendValidationError('phone', message.from);
              return;
            }

            const ctx = await mmDepositMessageTemplateAmount();
            await sendTextMessage(message.from, ctx);
            await updateBotIntent(
              botIntent._id,
              {
                step: 3,
                number: number,
              },
              session
            );
          } else {
            await handleInvalidInput(message, 'button');
          }
        } else {
          await handleInvalidInput(message, 'button');
        }
        // amount to deposit
      } else if (botIntent.step === 3) {
        const amt = extractTextInput(message);

        if (!amt || !isValidAmount(amt)) {
          await sendValidationError('amount', message.from);
          return;
        }

        await updateBotIntent(
          botIntent._id,
          {
            step: 4,
            amount: amt,
          },
          session
        );

        const ctx = await mmDepositMessageTemplateConfirm(
          message.from_name,
          message.from,
          botIntent.number,
          amt
        );
        await sendButtonMessage(ctx);
        //confirmation
      } else if (botIntent.step === 4) {
        const confirmBtn = extractButtonId(message);
        if (confirmBtn === 'ButtonsV3:mm_confirm') {
          const payload = await monimeService.deposit(
            user,
            {
              amount: botIntent.amount,
              depositing_number: botIntent.number,
              platform: 'whatsapp',
            },
            session
          );

          await updateBotIntent(
            botIntent._id,
            {
              step: 4,
              ussd: payload,
              status: 'success',
            },
            session
          );

          if (botIntent.payer === 'self') {
            const ctx = await mmDepositMessageTemplateUSSD(message.from, payload);
            await sendButtonMessage(ctx);
          } else if (botIntent.payer === 'different_number') {
            const ctx = await mmDepositMessageTemplateUSSDDifferentNumber(message.from, payload);
            await sendButtonMessage(ctx);
          }

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
        } else {
          await handleInvalidInput(message, 'button');
        }
        //generate USSD and send
      }
    } else if (method === 'ListV3:do2' || botIntent.intent_option === 'crypto') {
    } else if (method === 'ListV3:do3' || botIntent.intent_option === 'bank_transfer') {
    } else {
    }
  }

  await commitTransaction(session);
}

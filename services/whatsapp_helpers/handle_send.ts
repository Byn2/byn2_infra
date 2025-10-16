import { sendButtonMessage, sendTextMessage } from '@/lib/whapi';
import { updateBotIntent } from '@/services/bot_intent_service';
import { startTransaction, commitTransaction, abortTransaction } from '@/lib/db_transaction';
import * as walletService from '@/services/wallet_service';
import * as currencyService from '@/services/currency_service';
import { convertFromUSD } from '@/lib/helpers';
import {
  transferMessageTemplateConfirmLocal,
  transferMessageTemplateConfirmUSD,
  transferMessageTemplateNumber,
  transfertMessageTemplateAmountLocal,
  transfertMessageTemplateStatusSender,
} from '@/lib/whapi_message_template';
import {
  isValidAmount,
  isValidPhoneNumber,
  normalizePhoneNumber,
  extractButtonId,
  extractTextInput,
  sendValidationError,
  handleInvalidInput,
} from '@/lib/whatsapp_utils';

export async function handleSend(message: any, botIntent: any, currency?: any, user?: any) {
  const session = await startTransaction();
  const mobile = `+${message.from}`;

  if (botIntent.intent === 'start') {
    const ctx = await transfertMessageTemplateAmountLocal();
    await sendTextMessage(message.from, ctx);
    await updateBotIntent(
      botIntent._id,
      {
        intent: 'transfer',
        currency: 'local',
        step: 1,
      },
      session
    );
  } else if (botIntent.intent === 'transfer') {
    // Handle step 0 - ask for amount (when called from warning dialog)
    if (botIntent.step === 0) {
      const ctx = await transfertMessageTemplateAmountLocal();
      await sendTextMessage(message.from, ctx);
      await updateBotIntent(
        botIntent._id,
        {
          currency: 'local',
          step: 1,
        },
        session
      );
    // Step 1: Amount input
    } else if (botIntent.step === 1) {
      const amount = extractTextInput(message);

      if (!amount || !isValidAmount(amount)) {
        await sendValidationError('amount', message.from);
        return;
      }

      // Check if user has sufficient balance
      const userCurrency = await currencyService.getCurrency(user);
      const walletBalance = await walletService.getWalletBalance(user);
      const fiatBalance = await convertFromUSD(walletBalance.balance, userCurrency, 'withdrawal');
      
      if (fiatBalance < parseFloat(amount)) {
        await sendTextMessage(
          message.from,
          `Dear ${user.name}, your transfer of ${amount} ${userCurrency} cannot be processed due to insufficient balance. Your current balance is ${fiatBalance.toFixed(2)} ${userCurrency}. Please top up your account and try again. Thank you.`
        );
        return;
      }

      const ctx = await transferMessageTemplateNumber();
      await sendTextMessage(message.from, ctx);
      await updateBotIntent(
        botIntent._id,
        {
          amount: parseFloat(amount),
          step: 2,
        },
        session
      );

      // Step 2: Phone number input
    } else if (botIntent.step === 2) {
      const number = extractTextInput(message);

      if (!number || !isValidPhoneNumber(number)) {
        await sendValidationError('phone', message.from);
        return;
      }

      const normalizedNumber = normalizePhoneNumber(number);

      // Send appropriate confirmation message based on currency
      let ctx;
      if (botIntent.currency === 'local') {
        ctx = await transferMessageTemplateConfirmLocal(
          message.from_name,
          message.from,
          normalizedNumber,
          botIntent.amount
        );
      } else {
        ctx = await transferMessageTemplateConfirmUSD(
          message.from_name,
          message.from,
          normalizedNumber,
          botIntent.amount
        );
      }

      await sendButtonMessage(ctx);
      await updateBotIntent(
        botIntent._id,
        {
          number: normalizedNumber,
          step: 3,
        },
        session
      );

      // Step 3: Confirmation
    } else if (botIntent.step === 3) {
      const confirmBtn = extractButtonId(message);

      if (confirmBtn === 'ButtonsV3:tt_confirm') {

        await updateBotIntent(
          botIntent._id,
          {
            status: 'success',
          },
          session
        );

        try {
          const result = await walletService.transfer(
            user,
            {
              identifier: botIntent.number,
              amount: botIntent.amount,
              platform: 'whatsapp',
            },
            session
          );
          const ctx = await transfertMessageTemplateStatusSender(
            message.from_name,
            botIntent.currency === 'local' ? 'Le' : '$',
            botIntent.amount,
            'true',
            botIntent.number
          );
          await sendTextMessage(message.from, ctx);
        } catch (e) {
          const ctx = await transfertMessageTemplateStatusSender(
            message.from_name,
            botIntent.currency === 'local' ? 'Le' : '$',
            botIntent.amount,
            'false',
            botIntent.number
          );
          await sendTextMessage(message.from, ctx);
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
            ussd: ""
          },
          session
        );
      } else if (confirmBtn === 'ButtonsV3:tt_cancel') {
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
    }
  }

  await commitTransaction(session);
}

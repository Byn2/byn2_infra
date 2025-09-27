import { sendButtonMessage, sendTextMessage } from '@/lib/whapi';
import { updateBotIntent } from '@/services/bot_intent_service';
import { startTransaction, commitTransaction, abortTransaction } from '@/lib/db_transaction';
import * as walletService from '@/services/wallet_service';
import {
  transferMessageTemplateConfirmLocal,
  transferMessageTemplateConfirmUSD,
  transferMessageTemplateCurrency,
  transferMessageTemplateNumber,
  transfertMessageTemplateAmountLocal,
  transfertMessageTemplateAmountUSD,
  transfertMessageTemplateStatusSender,
} from '@/lib/whapi_message_template';
import {
  isValidAmount,
  isValidPhoneNumber,
  extractButtonId,
  extractTextInput,
  sendValidationError,
  handleInvalidInput
} from '@/lib/whatsapp_utils';

export async function handleSend(message: any, botIntent: any, currency?: any, user?: any) {
  const session = await startTransaction();
  const mobile = `+${message.from}`;
 
  if (botIntent.intent === 'start') {
    const ctx = await transferMessageTemplateCurrency(message.from);
    await sendButtonMessage(ctx);
    await updateBotIntent(
      botIntent._id,
      {
        intent: 'transfer',
        step: 1,
      },
      session
    );
  } else if (botIntent.intent === 'transfer') {
    if (currency === 'ButtonsV3:tt_local' || botIntent.currency === 'local') {
      if (currency) {
        await updateBotIntent(
          botIntent._id,
          {
            currency: 'local',
          },
          session
        );
      }
      if (botIntent.step === 0 || botIntent.step === 1) {
        const ctx = await transfertMessageTemplateAmountLocal();
        await sendTextMessage(message.from, ctx);
        await updateBotIntent(
          botIntent._id,
          {
            step: 2,
          },
          session
        );
      } else if (botIntent.step === 2) {
        const amt = extractTextInput(message);

        if (!amt || !isValidAmount(amt)) {
          await sendValidationError('amount', message.from);
          return;
        }

        const ctx = await transferMessageTemplateNumber();
        await sendTextMessage(message.from, ctx );

        await updateBotIntent(
          botIntent._id,
          {
            amount: amt,
            step: 3,
          },
          session
        );
      } else if (botIntent.step === 3) {
        const number = extractTextInput(message);

        if (!number || !isValidPhoneNumber(number)) {
          await sendValidationError('phone', message.from);
          return;
        }

        const ctx = await transferMessageTemplateConfirmLocal(
          message.from_name,
          message.from,
          number,
          botIntent.amount
        );
        await sendButtonMessage(ctx);
        await updateBotIntent(
          botIntent._id,
          {
            number: number,
            step: 4,
          },
          session
        );
      } else if (botIntent.step === 4) {
        const confirmBtn = extractButtonId(message);
        if (confirmBtn === 'ButtonsV3:tt_confirm') {
  
          await updateBotIntent(botIntent._id,{
            status: 'success',
          }, session)
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
              'Le',
              botIntent.amount,
              'true',
              botIntent.number
            );
            await sendTextMessage(message.from, ctx);
          } catch (e) {
            const ctx = await transfertMessageTemplateStatusSender(
                message.from_name,
                'Le',
                botIntent.amount,
                'false',
                botIntent.number
              );
            await sendTextMessage(message.from, ctx);
          }
        } else if (confirmBtn === 'ButtonsV3:tt_cancel') {
          console.log('cancel transfer');
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
      } else {
      }
    } else if (currency === 'ButtonsV3:tt_usd' || botIntent.currency === 'usd') {
        if (currency) {
            await updateBotIntent(
              botIntent._id,
              {
                currency: 'usd',
              },
              session
            );
          }
          if (botIntent.step === 0 || botIntent.step === 1) {
            const ctx = await transfertMessageTemplateAmountUSD();
            await sendTextMessage(message.from, ctx );
            await updateBotIntent(
              botIntent._id,
              {
                step: 2,
              },
              session
            );
          } else if (botIntent.step === 2) {
            const amt = extractTextInput(message);

            if (!amt || !isValidAmount(amt)) {
              await sendValidationError('amount', message.from);
              return;
            }
    
            const ctx = await transferMessageTemplateNumber();
            await sendTextMessage(message.from, ctx );
    
            await updateBotIntent(
              botIntent._id,
              {
                amount: amt,
                step: 3,
              },
              session
            );
          } else if (botIntent.step === 3) {
            const number = extractTextInput(message);

            if (!number || !isValidPhoneNumber(number)) {
              await sendValidationError('phone', message.from);
              return;
            }
    
            const ctx = await transferMessageTemplateConfirmUSD(
              message.from_name,
              message.from,
              number,
              botIntent.amount
            );
            await sendButtonMessage(ctx);
            await updateBotIntent(
              botIntent._id,
              {
                number: number,
                step: 4,
              },
              session
            );
          } else if (botIntent.step === 4) {
            const confirmBtn = extractButtonId(message);
            if (confirmBtn === 'ButtonsV3:tt_confirm') {
              console.log('confirm transfer');
              try {
                const result = await walletService.transfer(
                  user,
                  {
                    identifier: botIntent.number,
                    amount: botIntent.amount,
                  },
                  session
                );
                const ctx = await transfertMessageTemplateStatusSender(
                  message.from_name,
                  '$',
                  botIntent.amount,
                  'true',
                  botIntent.number
                );
                await sendTextMessage(message.from, ctx );
              } catch (e) {
                const ctx = await transfertMessageTemplateStatusSender(
                    message.from_name,
                    '$',
                    botIntent.amount,
                    'false',
                    botIntent.number
                  );
                  await sendTextMessage(message.from, ctx );
              }
            } else if (confirmBtn === 'ButtonsV3:tt_cancel') {
              console.log('cancel transfer');
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
          } else {
          }
    } else {
      await handleInvalidInput(message, 'button');
    }
  } else {
  }

  await commitTransaction(session);
}

import {
  depositMethodMessageTemplate,
  mmDepositMessageTemplate1,
  mmDepositMessageTemplateAmount,
  mmDepositMessageTemplateConfirm,
  mmDepositMessageTemplateUSSD,
} from '@/lib/whapi_message_template';
import * as monimeService from "@/services/monime_service";
import { sendButtonMessage, sendTextMessage } from '@/lib/whapi';
import { updateBotIntent } from '@/services/bot_intent_service';
import { startTransaction, commitTransaction, abortTransaction } from '@/lib/db_transaction';


export async function handleDeposit(message: any, botIntent: any, method?: any, user?: any) {
  const session = await startTransaction();
  const mobile = `+${message.from}`;
  //update bot intent

  //send deposit option
  if (botIntent.intent === 'start') {
    const ctx = await depositMethodMessageTemplate(message.from_name, message.from);
    await sendButtonMessage(ctx);

    await updateBotIntent(
      botIntent._id,
      {
        intent: 'deposit',
      },
      session
    );
  } else if (botIntent.intent === 'deposit') {
    if (method === 'ListV3:do1' || botIntent.intent_option === 'mobile_money') {
      console.log('Deposit with mobile money');
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
        const ctx = await mmDepositMessageTemplate1(message.from_name, message.from);
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
        const fundingAcct = message.reply?.buttons_reply?.id;
        if(fundingAcct === 'ButtonsV3:self'){
            const ctx = await mmDepositMessageTemplateAmount(message.from_name, message.from);
            await sendTextMessage(message.from, ctx)
            await updateBotIntent(
                botIntent._id,
                {
                  step: 3,
                  number: `+${message.from}`
                },
                session
              );
        }else if(fundingAcct === ''){

        }else{

        }
        // amount to deposit
      } else if (botIntent.step === 3) {
        const amt = message.text?.body

        await updateBotIntent(
            botIntent._id,
            {
              step: 4,
              amount: amt
            },
            session
        );

        const ctx = await mmDepositMessageTemplateConfirm(message.from_name, message.from, botIntent.number, amt);
        await sendButtonMessage(ctx);
        //confirmation
      } else if (botIntent.step === 4) {
        const confirmBtn = message.reply?.buttons_reply?.id;
        console.log('confirm', confirmBtn);
        if(confirmBtn === 'ButtonsV3:mm_confirm'){
            const payload = await monimeService.deposit(user, {
                amount: botIntent.amount,
                depositing_number: botIntent.number
            }, session)

            await updateBotIntent(
                botIntent._id,
                {
                  step: 4,
                  ussd: payload,
                  status: 'success'
                },
                session
            ); 

            const ctx = await mmDepositMessageTemplateUSSD(message.from_name, message.from, payload);
            await sendButtonMessage(ctx);

            console.log('You confirm payment')
        }else if(confirmBtn === 'ButtonsV3:cancel'){
            console.log('You cancel payment')
        }else{
            console.log('Invalid selection')
        }
        //generate USSD and send
      }

      console.log(method);
     
    } else if (method === 'ListV3:do2' || botIntent.intent_option === 'crypto') {
      console.log('Crypto selected');
    } else if (method === 'ListV3:do3' || botIntent.intent_option === 'bank_transfer') {
      console.log('Bank transfer selected');
    } else {
    }
  }

  await commitTransaction(session);
}

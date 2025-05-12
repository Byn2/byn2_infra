import { sendTextMessage, sendImageMessage, sendButtonMessage } from '@/lib/whapi';
import { initialMessageTemplate, mainMenuMessageTemplate } from '@/lib/whapi_message_template';
import * as userService from '@/services/user_service';
import { handleAuth } from './whatsapp_helpers/handle_auth';
import { handleDeposit } from './whatsapp_helpers/handle_deposit';
import { handleCheckBalance } from './whatsapp_helpers/handle_check_balance';
import { connectDB } from '@/lib/db';
import { handleSend } from './whatsapp_helpers/handle_send';
import { handleWithdraw } from './whatsapp_helpers/handle_withdraw';

export async function init(body: any) {
  await connectDB();
  const message = body.messages?.[0];

  const authResult = await handleAuth(message);

  if (!authResult.success) {
    console.log('Auth failed');
  }


  //get bot intent
  if (authResult.botIntent.intent === 'start' && authResult.botIntent.step === 0) {
    const ctx = await mainMenuMessageTemplate(message.from_name, message.from);
    await sendButtonMessage(ctx);

    const mainMenuBtn = message.reply?.list_reply?.id;

    if (mainMenuBtn === 'ListV3:d1') {
      await handleDeposit(message, authResult.botIntent);
    } else if (mainMenuBtn === 'ListV3:t1') {
      await handleSend(message, authResult.botIntent);
    } else if (mainMenuBtn === 'ListV3:w1') {
      await handleWithdraw(message, authResult.botIntent);
    } else if (mainMenuBtn === 'ListV3:c1') {
      console.log('check balance');
      await handleCheckBalance(message);
    }
  }else if(authResult.botIntent.intent === 'deposit'){
    
    const depositMethod = message.reply?.list_reply?.id;
    await handleDeposit(message, authResult.botIntent, depositMethod, authResult.user);
  }else if(authResult.botIntent.intent === 'transfer'){
    const currency = message.reply?.buttons_reply?.id;
    await handleSend(message, authResult.botIntent, currency, authResult.user);
  }else if(authResult.botIntent.intent === 'withdraw'){
    //const checkBalanceMethod = message.reply?.list_reply?.id;
    await handleWithdraw(message, authResult.botIntent, '', authResult.user);
  }else if(authResult.botIntent.intent === 'check_balance'){
    //const checkBalanceMethod = message.reply?.list_reply?.id;
  }
}

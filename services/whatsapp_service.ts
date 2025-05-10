import { sendTextMessage, sendImageMessage, sendButtonMessage } from '@/lib/whapi';
import { initialMessageTemplate, mainMenuMessageTemplate } from '@/lib/whapi_message_template';
import * as userService from '@/services/user_service';
import { handleAuth } from './whatsapp_helpers/handle_auth';
import { handleDeposit } from './whatsapp_helpers/handle_deposit';
import { handleCheckBalance } from './whatsapp_helpers/handle_check_balance';
import { connectDB } from '@/lib/db';

export async function init(body) {
  await connectDB();
  const message = body.messages?.[0];

  const authResult = await handleAuth(message);

  if (!authResult.success) {
    console.log('Auth failed');
  }
  console.log(authResult.botIntent.intent);
  console.log("User: ", authResult.user)

  //get bot intent
  if (authResult.botIntent.intent === 'start') {
    const ctx = await mainMenuMessageTemplate(message.from_name, message.from);
    await sendButtonMessage(ctx);

    const mainMenuBtn = message.reply?.list_reply?.id;

    if (mainMenuBtn === 'ListV3:d1') {
      console.log('deposit');
      await handleDeposit(message, authResult.botIntent);
    } else if (mainMenuBtn === 'ListV3:t1') {
      console.log('transfer');
    } else if (mainMenuBtn === 'ListV3:w1') {
      console.log('withdraw');
    } else if (mainMenuBtn === 'ListV3:c1') {
      console.log('check balance');
      await handleCheckBalance(message);
    }
  }else if(authResult.botIntent.intent === 'deposit'){
    
    const depositMethod = message.reply?.list_reply?.id;
    await handleDeposit(message, authResult.botIntent, depositMethod, authResult.user);
    // console.log(depositMethod);
    // console.log('deposit handler');
  }else if(authResult.botIntent.intent === 'transfer'){
    //const checkBalanceMethod = message.reply?.list_reply?.id;
  }else if(authResult.botIntent.intent === 'withdraw'){
    //const checkBalanceMethod = message.reply?.list_reply?.id;
  }else if(authResult.botIntent.intent === 'check_balance'){
    //const checkBalanceMethod = message.reply?.list_reply?.id;
  }

  // //deposit options
  // if (mainMenuBtn === 'ListV3:do1') {
  //     console.log("Deposit with mobile money")
  // }else if(mainMenuBtn === 'ListV3:do2'){
  //     console.log("Deposit with crypto")
  // }else if(mainMenuBtn === 'ListV3:do3'){
  //     console.log("Deposit with bank transfer")
  // }
}

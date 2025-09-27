import * as userService from '@/services/user_service';
import * as authService from '@/services/auth_service';
import {
  initialMessageTemplate,
  congratulationsMessageTemplate,
  mainMenuMessageTemplate,
} from '@/lib/whapi_message_template';
import { sendButtonMessage } from '@/lib/whapi';
import jwt from 'jsonwebtoken';
import { getBotIntentBySession, storeBotIntent } from '@/services/bot_intent_service';
import { startTransaction, commitTransaction, abortTransaction } from '@/lib/db_transaction';

export async function handleAuth(message: any) {
  const session = await startTransaction();
  const mobile = `+${message.from}`;
  let fetchedUser = await userService.fetchUserByMobileBot(mobile);
  let botIntent;

  //console.log(fetchedUser);
  if (!fetchedUser.success) {
    const botToken = await generate3DayToken(mobile);
    const sessionToken = await generate5MinToken(mobile);
    //create user
    const newUser = await authService.botLogin(
      {
        mobile_number: mobile,
        name: message.from_name,
        bot_token: botToken,
        bot_session: sessionToken,
      },
      session
    );

    await storeBotIntent(
      {
        bot_session: sessionToken,
        intent: 'start',
      },
      session
    );

    await commitTransaction(session);

    const ctx = await initialMessageTemplate(message.from_name, message.from);
    await sendButtonMessage(ctx);
  } else {
    const user = fetchedUser.data;
    const botToken = await verifyToken(user.bot_token);
    const sessionToken = await verifyToken(user.bot_session);

    //check for valid bot token
    if (botToken.valid) {
      if (sessionToken.valid) {
        botIntent = await getBotIntentBySession(user.bot_session); // <-- move this here
        if (botIntent?.status === 'pending') {
          console.log('Session token is valid');

          const getStartedButton = message.reply?.buttons_reply?.id;
          if (getStartedButton === 'ButtonsV3:get_started') {
            console.log('sending congrats message');
            const ctx = await congratulationsMessageTemplate(message.from_name, message.from);
            console.log(ctx);
            await sendButtonMessage(ctx);
          }
        }
      } else {
        console.log('Session token is invalid or intent not pending');
        // regenerate token + store new intent
        const newSessionToken = await generate5MinToken(mobile);

        await userService.updateUser(
          user._id,
          {
            bot_session: newSessionToken,
          },
          session
        );

        botIntent = await storeBotIntent(
          {
            bot_session: newSessionToken,
            intent: 'start',
          },
          session
        );

        await commitTransaction(session);
        // const ctx = await mainMenuMessageTemplate(message.from_name, message.from);
        // await sendButtonMessage(ctx);
      }
    } else {
      const botToken = await generate3DayToken(mobile);

      await userService.updateUser(
        user._id,
        {
          bot_token: botToken,
        },
        session
      );

      botIntent = await storeBotIntent(
        {
          bot_token: botToken,
          intent: 'start',
        },
        session
      );

      await commitTransaction(session);
      fetchedUser = await userService.fetchUserByMobileBot(mobile);
      // i think i should comment this lines of code below
      const ctx = await mainMenuMessageTemplate(message.from_name, message.from);
      await sendButtonMessage(ctx);
    }
  }

  return { success: true, botIntent, user: fetchedUser.data };
}

export const generate3DayToken = async (mobile_number: string) => {
  return jwt.sign(
    { mobile: mobile_number },
    process.env.SECRET_ACCESS_TOKEN || 'your-secret-key',
    { expiresIn: '3d' } // 3 days
  );
};

export const generate5MinToken = async (mobile_number: string) => {
  return jwt.sign(
    { mobile: mobile_number },
    process.env.SECRET_ACCESS_TOKEN || 'your-secret-key',
    { expiresIn: '5m' } // 5 minutes
  );
};

export const verifyToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN || 'your-secret-key');
    return { valid: true, expired: false, decoded };
  } catch (err: any) {
    return {
      valid: false,
      expired: err.name === 'TokenExpiredError',
      decoded: null,
      message: err.message,
    };
  }
};

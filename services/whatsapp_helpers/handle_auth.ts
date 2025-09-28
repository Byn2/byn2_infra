import * as userService from '@/services/user_service';
import * as authService from '@/services/auth_service';
import {
  initialMessageTemplate,
  congratulationsMessageTemplate,
  mainMenuMessageTemplate,
  welcomeNewUserMessageTemplate,
  newUserCongratulationsMessageTemplate,
  recipientOnboardingCompleteTemplate,
} from '@/lib/whapi_message_template';
import { sendButtonMessage } from '@/lib/whapi';
import jwt from 'jsonwebtoken';
import {
  getBotIntentBySession,
  getBotIntentByMobile,
  storeBotIntent,
  updateBotIntent,
} from '@/services/bot_intent_service';
import { cleanupPendingIntents } from '@/repositories/bot_intent_repo';
import { startTransaction, commitTransaction, abortTransaction } from '@/lib/db_transaction';
import { extractButtonId, isValidPhoneNumber } from '@/lib/whatsapp_utils';

export async function handleAuth(message: any) {
  const session = await startTransaction();

  // Validate message has required fields
  if (!message || !message.from) {
    console.error('Invalid message object: missing from field');
    await abortTransaction(session);
    return { success: false, botIntent: null, user: null };
  }

  const mobile = `+${message.from}`;

  // Validate phone number format
  if (!isValidPhoneNumber(mobile)) {
    console.error(`Invalid phone number format: ${mobile}`);
    await abortTransaction(session);
    return { success: false, botIntent: null, user: null };
  }
  let fetchedUser = await userService.fetchUserByMobileBot(mobile);
  let botIntent;

  try {
    // Check if this is a welcome flow completion
    const pendingIntent = await getBotIntentByMobile(mobile);
    const getStartedButton = extractButtonId(message);

    if (
      pendingIntent &&
      ((pendingIntent.intent === 'welcome_pending' &&
        getStartedButton === 'ButtonsV3:welcome_get_started') ||
        (pendingIntent.intent === 'recipient_pending' &&
          getStartedButton === 'ButtonsV3:recipient_get_started'))
    ) {
      // Check if user already exists to prevent duplicate creation
      if (fetchedUser.success) {
        console.log(`[AUTH] User already exists for ${mobile}, skipping duplicate creation`);
        await commitTransaction(session);
        return { success: true, botIntent: null, user: fetchedUser.data };
      }

      const botToken = await generate3DayToken(mobile);
      const newSessionToken = await generate5MinToken(mobile);

      const newUser = await authService.botLogin(
        {
          mobile_number: mobile,
          name: message.from_name,
          bot_token: botToken,
          bot_session: newSessionToken,
        },
        session
      );

      // Update the existing welcome_pending intent to start state
      await updateBotIntent(
        pendingIntent._id,
        {
          bot_session: newSessionToken,
          intent: 'start',
          step: 1,
          status: 'pending',
        },
        session
      );

      await commitTransaction(session);

      // Send appropriate congratulations message based on flow type
      try {
        if (pendingIntent.intent === 'welcome_pending') {
          const ctx = await newUserCongratulationsMessageTemplate(message.from_name, message.from);
          await sendButtonMessage(ctx);
        } else if (pendingIntent.intent === 'recipient_pending') {
          // Send recipient onboarding completion message
          const ctx = await recipientOnboardingCompleteTemplate(
            message.from_name,
            message.from,
            pendingIntent.received_currency,
            pendingIntent.received_amount,
            pendingIntent.sender_name
          );
          await sendButtonMessage(ctx);
        }
        
      } catch (messageError) {
        console.error(`[AUTH] Failed to send congratulations message to ${mobile}:`, messageError);
        // Don't fail the entire flow if message sending fails
      }

      // Get the updated bot intent and return the new user
      botIntent = await getBotIntentBySession(newSessionToken);

      return { success: true, botIntent, user: newUser };
    }

    if (!fetchedUser.success) {

      // Clean up any existing pending intents for this mobile number to prevent duplicates
      await cleanupPendingIntents(mobile, { session });
    
      // Send welcome message to new users first (without creating user yet)
      const ctx = await welcomeNewUserMessageTemplate(message.from_name, message.from);
      await sendButtonMessage(ctx);
      // Create a temporary bot intent to track the welcome state
      const sessionToken = await generate5MinToken(mobile);

      botIntent = await storeBotIntent(
        {
          bot_session: sessionToken,
          intent: 'welcome_pending',
          step: 0,
          mobile_number: mobile,
          name: message.from_name,
          status: 'pending',
        },
        session
      );

      await commitTransaction(session);

      return { success: true, botIntent: null, user: null };
    } else {
      const user = fetchedUser.data;
      const botToken = await verifyToken(user.bot_token);
      const sessionToken = await verifyToken(user.bot_session);

      //check for valid bot token
      if (botToken.valid) {
        if (sessionToken.valid) {
          botIntent = await getBotIntentBySession(user.bot_session); // <-- move this here
          if (botIntent?.status === 'pending') {
            const getStartedButton = extractButtonId(message);
            if (getStartedButton === 'ButtonsV3:get_started') {
              const ctx = await congratulationsMessageTemplate(message.from_name, message.from);
              await sendButtonMessage(ctx);
            }
          }
        } else {
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
              step: 0,
            },
            session
          );

          await commitTransaction(session);
          // Menu will be sent by main service, not here to prevent duplicates
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
            step: 0,
          },
          session
        );

        await commitTransaction(session);
        fetchedUser = await userService.fetchUserByMobileBot(mobile);
        // Menu will be sent by main service, not here to prevent duplicates
      }
    }

    return { success: true, botIntent, user: fetchedUser.data };
  } catch (error) {
    await abortTransaction(session);
    return { success: false, botIntent: null, user: null };
  }
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

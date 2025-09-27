import { sendTextMessage, sendImageMessage, sendButtonMessage } from '../lib/whapi';
import { initialMessageTemplate, mainMenuMessageTemplate } from '../lib/whapi_message_template';
import * as userService from './user_service';
import { handleAuth } from './whatsapp_helpers/handle_auth';
import { handleDeposit } from './whatsapp_helpers/handle_deposit';
import { handleCheckBalance } from './whatsapp_helpers/handle_check_balance';
import { connectDB } from '../lib/db';
import { handleSend } from './whatsapp_helpers/handle_send';
import { handleWithdraw } from './whatsapp_helpers/handle_withdraw';
import { 
  isGlobalCommand, 
  handleGlobalCommand, 
  extractTextInput,
  extractButtonId,
  extractListId,
  handleInvalidInput,
  isComingSoonFeature,
  handleComingSoonFeature
} from '../lib/whatsapp_utils';
import { startTransaction, commitTransaction } from '../lib/db_transaction';

export async function init(body: any) {
  await connectDB();
  const message = body.messages?.[0];
  const session = await startTransaction();

  try {
    const authResult = await handleAuth(message);

    if (!authResult.success) {
      console.log('Auth failed');
      return;
    }

    // Check for global commands first (works at any step)
    const textInput = extractTextInput(message);
    if (textInput && isGlobalCommand(textInput)) {
      const handled = await handleGlobalCommand(textInput, message, authResult.user, session);
      if (handled) {
        await commitTransaction(session);
        return;
      }
    }

    // Handle conversation flow based on current intent and step
    const botIntent = authResult.botIntent;
    
    if (botIntent.intent === 'start' && botIntent.step === 0) {
      // Send main menu only if not already sent by auth handler
      const ctx = await mainMenuMessageTemplate(message.from_name, message.from);
      await sendButtonMessage(ctx);

      // Check if user selected from main menu
      const mainMenuBtn = extractListId(message);
      if (mainMenuBtn) {
        if (mainMenuBtn === 'ListV3:d1') {
          await handleDeposit(message, botIntent);
        } else if (mainMenuBtn === 'ListV3:t1') {
          await handleSend(message, botIntent);
        } else if (mainMenuBtn === 'ListV3:w1') {
          await handleWithdraw(message, botIntent);
        } else if (mainMenuBtn === 'ListV3:c1') {
          await handleCheckBalance(message, botIntent);
        } else if (mainMenuBtn === 'ListV3:csoon') {
          await handleComingSoonFeature('csoon', message, session);
        } else {
          // Invalid main menu selection
          await handleInvalidInput(message, 'list');
        }
      }

      // Handle "back to menu" button from coming soon message
      const backToMenuBtn = extractButtonId(message);
      if (backToMenuBtn === 'ButtonsV3:back_to_menu') {
        const ctx = await mainMenuMessageTemplate(message.from_name, message.from);
        await sendButtonMessage(ctx);
      }
    } else if (botIntent.intent === 'deposit') {
      const depositMethod = extractListId(message);
      await handleDeposit(message, botIntent, depositMethod, authResult.user);
    } else if (botIntent.intent === 'transfer') {
      const currency = extractButtonId(message);
      await handleSend(message, botIntent, currency, authResult.user);
    } else if (botIntent.intent === 'withdraw') {
      await handleWithdraw(message, botIntent, '', authResult.user);
    } else if (botIntent.intent === 'check_balance') {
      await handleCheckBalance(message, botIntent);
    } else {
      // Unknown intent or step
      console.log('Unknown intent or step:', botIntent);
      await handleInvalidInput(message, 'selection');
    }

    await commitTransaction(session);
  } catch (error) {
    console.error('Error in WhatsApp service:', error);
    await session.abortTransaction();
    throw error;
  }
}

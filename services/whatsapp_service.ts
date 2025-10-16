import { sendButtonMessage } from '../lib/whapi';
import { mainMenuMessageTemplate } from '../lib/whapi_message_template';

import { handleAuth } from './whatsapp_helpers/handle_auth';
import { handleDeposit } from './whatsapp_helpers/handle_deposit';
import { handleCheckBalance } from './whatsapp_helpers/handle_check_balance';
import { handleSend } from './whatsapp_helpers/handle_send';
import { handleWithdraw } from './whatsapp_helpers/handle_withdraw';
import {
  isGlobalCommand,
  handleGlobalCommand,
  extractTextInput,
  extractButtonId,
  extractListId,
  handleInvalidInput,
  handleComingSoonFeature,
  isInActiveOperation,
  isNewOperationSelection,
  getOperationFromSelection,
  handleOperationInProgressWarning,
  getOperationDisplayName,
  restoreOperationStep,
} from '../lib/whatsapp_utils';
import { startTransaction, commitTransaction } from '../lib/db_transaction';
import { updateBotIntent } from './bot_intent_service';

export async function init(body: any) {
  const message = body.messages?.[0];
  const session = await startTransaction();

  try {
    const authResult = await handleAuth(message);

    if (!authResult.success) {
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

    // If botIntent is null (e.g., during welcome flow), skip conversation handling
    if (!botIntent) {
      await commitTransaction(session);
      return;
    }

    // Check if user is in warning state (step -1)
   
    if (botIntent.step === -1) {
      
      const warningButtonId = extractButtonId(message);
      
      
      if (warningButtonId) {
        
        const handled = await handleWarningResponse(warningButtonId, message, botIntent, session, authResult.user);
        
        
        if (handled) {
          
          await commitTransaction(session);
          return;
        } else {
         
        }
      } else {
       
      }
      // If no valid warning response, ignore the message
   
      await commitTransaction(session);
      return;
    } else {
      console.log('🚨 User NOT in warning stat:');
    }

    
    const isInActive = isInActiveOperation(botIntent);
    
    
    if (isInActive) {
      // Check both list and button selections for new operations
      const listSelection = extractListId(message);
      const buttonSelection = extractButtonId(message);
      const mainMenuSelection = listSelection || buttonSelection;
      
      
      if (mainMenuSelection) {
        const isNewOperation = isNewOperationSelection(mainMenuSelection);
        
        if (isNewOperation) {
          const requestedOperation = getOperationFromSelection(mainMenuSelection);
          
          if (requestedOperation && requestedOperation !== botIntent.intent) {
            
            await handleOperationInProgressWarning(
              botIntent.intent,
              requestedOperation,
              message,
              botIntent,
              session
            );
            await commitTransaction(session);
            return;
          } else {
           
          }
        } else {
         
        }
      } else {
        
      }
    } else {
     
    }
    

    if (botIntent.intent === 'start' && botIntent.step === 0) {
      // Check if user selected from main menu first
      const mainMenuBtn = extractListId(message);
      if (mainMenuBtn) {
        if (mainMenuBtn === 'ListV3:d1') {
          await handleDeposit(message, botIntent, null, authResult.user);
        } else if (mainMenuBtn === 'ListV3:t1') {
          await handleSend(message, botIntent, null, authResult.user);
        } else if (mainMenuBtn === 'ListV3:w1') {
          await handleWithdraw(message, botIntent, null, authResult.user);
        } else if (mainMenuBtn === 'ListV3:c1') {
          await handleCheckBalance(message, botIntent);
        } else if (mainMenuBtn === 'ListV3:csoon') {
          await handleComingSoonFeature('csoon', message, session);
        } else {
          // Invalid main menu selection
          await handleInvalidInput(message, 'list');
        }
      } else {
        // Only send main menu if no selection was made
        const ctx = await mainMenuMessageTemplate(message.from_name, message.from);
        await sendButtonMessage(ctx);
      }

      // Handle "back to menu" button from coming soon message
      const backToMenuBtn = extractButtonId(message);
      if (backToMenuBtn === 'ButtonsV3:back_to_menu') {
        const ctx = await mainMenuMessageTemplate(message.from_name, message.from);
        await sendButtonMessage(ctx);
      }
    } else if (botIntent.intent === 'start' && botIntent.step === 1) {
      // Menu already sent in congratulations message, just handle selections
      const mainMenuBtn = extractListId(message);
      if (mainMenuBtn) {
        if (mainMenuBtn === 'ListV3:d1') {
          await handleDeposit(message, botIntent, null, authResult.user);
        } else if (mainMenuBtn === 'ListV3:t1') {
          await handleSend(message, botIntent, null, authResult.user);
        } else if (mainMenuBtn === 'ListV3:w1') {
          await handleWithdraw(message, botIntent, null, authResult.user);
        } else if (mainMenuBtn === 'ListV3:c1') {
          await handleCheckBalance(message, botIntent);
        } else if (mainMenuBtn === 'ListV3:csoon') {
          await handleComingSoonFeature('csoon', message, session);
        } else {
          // Invalid main menu selection
          await handleInvalidInput(message, 'list');
        }
      }
      // No else clause - don't send another menu since congratulations already has one

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
      await handleSend(message, botIntent, null, authResult.user);
    } else if (botIntent.intent === 'withdraw') {
      const withdrawMethod = extractListId(message);
     
      await handleWithdraw(message, botIntent, withdrawMethod, authResult.user);
    } else if (botIntent.intent === 'check_balance') {
      await handleCheckBalance(message, botIntent);
    } else {
      // Unknown intent or step
      await handleInvalidInput(message, 'button');
    }

    await commitTransaction(session);
  } catch (error) {
    console.error('Error in WhatsApp service:', error);
    await session.abortTransaction();
    throw error;
  }
}

// Helper function to handle warning button responses
async function handleWarningResponse(
  buttonId: string,
  message: any,
  botIntent: any,
  session: any,
  user?: any
): Promise<boolean> {
  
  
  const requestedOperation = botIntent.pending_operation; // Stored during warning
  console.log('🚨 handleWarningResponse - original botIntent:', JSON.stringify(botIntent, null, 2));
  
  if (buttonId === 'ButtonsV3:continue_current') {
    console.log('🚨 Continue current operation - botIntent.intent:', botIntent.intent);
    console.log('🚨 Continue current operation - botIntent.original_step:', botIntent.original_step);
    
    // User wants to continue current operation - restore previous state
    await updateBotIntent(
      botIntent._id,
      { 
        step: botIntent.original_step || 0, // Restore to original step
        pending_operation: null, // Clear the requested operation
        original_step: null // Clear the stored original step
      },
      session
    );
    
    // Create updated botIntent object for restoration
    const restoredBotIntent = {
      ...botIntent.toObject(),
      step: botIntent.original_step || 0,
      pending_operation: null,
      original_step: null
    };
    
    console.log('🚨 restoredBotIntent created:', JSON.stringify(restoredBotIntent, null, 2));
    console.log('🚨 restoredBotIntent.intent:', restoredBotIntent.intent);
    
    // Restore user to their exact step with the appropriate message
    await restoreOperationStep(restoredBotIntent, message, user);
    
    
    return true;

  } else if (buttonId === 'ButtonsV3:start_new') {
   
    
    // First, update the botIntent to the new operation
    await updateBotIntent(
      botIntent._id,
      { 
        intent: requestedOperation,
        step: 0, // Start from beginning of new operation
        pending_operation: null, // Clear the requested operation
        original_step: null // Clear the stored original step
      },
      session
    );
  
    
    // Create updated botIntent object for handlers
    const updatedBotIntent = {
      ...botIntent.toObject(),
      intent: requestedOperation,
      step: 0,
      pending_operation: null,
      original_step: null
    };
    
    // User wants to start new operation - proceed with the requested operation
    // Call handlers the same way as fresh operations from main menu
    if (requestedOperation === 'deposit') {
     
      await handleDeposit(message, updatedBotIntent, null, user);
    } else if (requestedOperation === 'transfer') {
    
      await handleSend(message, updatedBotIntent, null, user);
    } else if (requestedOperation === 'withdraw') {
     
      await handleWithdraw(message, updatedBotIntent, null, user);
    } else if (requestedOperation === 'check_balance') {
     
      await handleCheckBalance(message, updatedBotIntent);
    } else {
      
    }
    return true;

  } else if (buttonId === 'ButtonsV3:back_to_menu') {
   
    
    // User wants to go back to main menu
    await updateBotIntent(
      botIntent._id,
      { 
        intent: 'start',
        step: 0,
        pending_operation: null,
        original_step: null
      },
      session
    );

    const menuTemplate = await mainMenuMessageTemplate(
      message.from_name,
      message.from
    );
    await sendButtonMessage(menuTemplate);
   
    return true;
  } else {
    console.log('🚨 UNKNOWN BUTTON ID:', buttonId);
  }

 
  return false;
}

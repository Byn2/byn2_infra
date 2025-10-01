import { sendTextMessage, sendButtonMessage } from './whapi';
import {
  helpMessageTemplate,
  sessionResetMessageTemplate,
  mainMenuMessageTemplate,
  invalidSelectionMessageTemplate,
  invalidAmountMessageTemplate,
  invalidPhoneNumberMessageTemplate,
  operationCancelledMessageTemplate,
  comingSoonMessageTemplate,
} from './whapi_message_template';
import { storeBotIntent, updateBotIntent } from '@/services/bot_intent_service';
import { generate5MinToken } from '@/services/whatsapp_helpers/handle_auth';
import * as userService from '@/services/user_service';
import { startTransaction, commitTransaction } from '@/lib/db_transaction';

// Global command detection
export function isGlobalCommand(text: string): boolean {
  if (!text) return false;
  const command = text.toLowerCase().trim();
  return ['menu', 'restart', 'help', 'cancel', 'balance'].includes(command);
}

// Handle global commands
export async function handleGlobalCommand(
  command: string,
  message: any,
  user: any,
  session: any
): Promise<boolean> {
  const mobile = `+${message.from}`;
  const commandLower = command.toLowerCase().trim();

  switch (commandLower) {
    case 'help':
      const helpTemplate = await helpMessageTemplate(message.from);
      await sendButtonMessage(helpTemplate);
      return true;

    case 'menu':
    case 'restart':
      // Reset session and show main menu
      const newSessionToken = await generate5MinToken(mobile);
      
      await userService.updateUser(
        user._id,
        { bot_session: newSessionToken },
        session
      );

      await storeBotIntent(
        {
          bot_session: newSessionToken,
          intent: 'start',
          step: 0,
        },
        session
      );

      if (commandLower === 'restart') {
        const resetTemplate = await sessionResetMessageTemplate(message.from_name, message.from);
        await sendButtonMessage(resetTemplate);
      } else {
        const menuTemplate = await mainMenuMessageTemplate(message.from_name, message.from);
        await sendButtonMessage(menuTemplate);
      }
      return true;

    case 'cancel':
      // Cancel current operation and return to menu
      const cancelTemplate = await operationCancelledMessageTemplate(message.from);
      await sendTextMessage(message.from, cancelTemplate);
      
      // Reset to main menu
      const cancelSessionToken = await generate5MinToken(mobile);
      
      await userService.updateUser(
        user._id,
        { bot_session: cancelSessionToken },
        session
      );

      await storeBotIntent(
        {
          bot_session: cancelSessionToken,
          intent: 'start',
          step: 0,
        },
        session
      );

      const menuTemplate = await mainMenuMessageTemplate(message.from_name, message.from);
      await sendButtonMessage(menuTemplate);
      return true;

    default:
      return false;
  }
}

// Input validation functions
export function isValidAmount(amount: string): boolean {
  if (!amount) return false;
  const num = parseFloat(amount.trim());
  return !isNaN(num) && num > 0 && num <= 1000000; // reasonable limits
}

export function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return false;
  // Basic validation for international format
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function isValidButtonReply(buttonId: string, expectedIds: string[]): boolean {
  return expectedIds.includes(buttonId);
}

export function isValidListReply(listId: string, expectedIds: string[]): boolean {
  return expectedIds.includes(listId);
}

// Send validation error messages
export async function sendValidationError(
  type: 'amount' | 'phone' | 'selection',
  mobile: string
): Promise<void> {
  switch (type) {
    case 'amount':
      const amountError = await invalidAmountMessageTemplate(mobile);
      await sendTextMessage(mobile, amountError);
      break;
    case 'phone':
      const phoneError = await invalidPhoneNumberMessageTemplate(mobile);
      await sendTextMessage(mobile, phoneError);
      break;
    case 'selection':
      const selectionError = await invalidSelectionMessageTemplate(mobile);
      await sendButtonMessage(selectionError);
      break;
  }
}

// Centralized error handling
export async function handleInvalidInput(
  message: any,
  expectedInputType: 'button' | 'list' | 'text' | 'amount' | 'phone'
): Promise<void> {
  const mobile = `+${message.from}`;
  
  // Check if it's a global command first
  const textInput = message.text?.body;
  if (textInput && isGlobalCommand(textInput)) {
    // Global commands will be handled by the main service
    return;
  }

  // Send appropriate error message based on expected input type
  switch (expectedInputType) {
    case 'amount':
      await sendValidationError('amount', message.from);
      break;
    case 'phone':
      await sendValidationError('phone', message.from);
      break;
    default:
      await sendValidationError('selection', message.from);
      break;
  }
}

// Helper to extract clean button/list IDs
export function extractButtonId(message: any): string | null {
  return message.reply?.buttons_reply?.id || null;
}

export function extractListId(message: any): string | null {
  return message.reply?.list_reply?.id || null;
}

export function extractTextInput(message: any): string | null {
  return message.text?.body?.trim() || null;
}

// Coming soon feature handler
export async function handleComingSoonFeature(
  featureId: string,
  message: any,
  session: any
): Promise<void> {
  const featureMap: Record<string, string> = {
    'csoon': 'Invest in Stocks',
    'wo2': 'MoneyGram Withdrawal',
    // Add more coming soon features here as needed
  };

  const featureName = featureMap[featureId] || 'This Feature';
  const comingSoonTemplate = await comingSoonMessageTemplate(featureName, message.from);
  await sendButtonMessage(comingSoonTemplate);
}

// Check if a selection is a coming soon feature
export function isComingSoonFeature(selectionId: string): boolean {
  const comingSoonFeatures = ['csoon', 'wo2'];
  return comingSoonFeatures.includes(selectionId);
}
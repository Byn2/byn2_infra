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
  operationInProgressWarningTemplate,
} from './whapi_message_template';
import { storeBotIntent } from '@/services/bot_intent_service';
import { generate5MinToken } from '@/services/whatsapp_helpers/handle_auth';
import * as userService from '@/services/user_service';
import { number } from 'zod';

// Global command detection
export function isGlobalCommand(text: string): boolean {
  if (!text) return false;
  const command = text.toLowerCase().trim();
  return ['menu', 'start', 'restart', 'help', 'cancel'].includes(command);
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
      await sendTextMessage(message.from, helpTemplate.body.text);
      return true;

    case 'menu':
    case 'restart':
    case 'start':
      // Reset session and show main menu
      const newSessionToken = await generate5MinToken(mobile);

      await userService.updateUser(user._id, { bot_session: newSessionToken }, session);

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

      await userService.updateUser(user._id, { bot_session: cancelSessionToken }, session);

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

export function normalizePhoneNumber(phone: string): string {
  if (!phone) return phone;

  // Remove any whitespace
  const cleaned = phone.replace(/\s/g, '');

  // If it already starts with +, return as is
  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  // Add + prefix if it doesn't exist
  return `+${cleaned}`;
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
  const result = message.reply?.buttons_reply?.id || null;
  return result;
}

export function extractListId(message: any): string | null {
  const result = message.reply?.list_reply?.id || null;
  return result;
}

export function extractTextInput(message: any): string | null {
  const result = message.text?.body?.trim() || null;
  return result;
}

// Coming soon feature handler
export async function handleComingSoonFeature(
  featureId: string,
  message: any,
  session: any
): Promise<void> {
  const featureMap: Record<string, string> = {
    csoon: 'Invest in Stocks',
    wo2: 'MoneyGram Withdrawal',
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

// Check if user is in an active operation (not at start menu)
export function isInActiveOperation(botIntent: any): boolean {
  if (!botIntent) {
    return false;
  }

  // User is in active operation if they're in any operation flow
  // (deposit, transfer, withdraw, check_balance) but NOT in start/menu
  const activeOperations = ['deposit', 'transfer', 'withdraw', 'check_balance'];
  const result = activeOperations.includes(botIntent.intent);

  return result;
}

// Get human-readable operation name
export function getOperationDisplayName(intent: string): string {
  if (!intent) {
    console.error('🚨 getOperationDisplayName called with undefined/null intent');
    return 'Operation';
  }
  
  const operationNames: Record<string, string> = {
    deposit: 'Deposit',
    transfer: 'Transfer',
    withdraw: 'Withdraw',
    check_balance: 'Check Balance',
  };
  return operationNames[intent] || intent;
}

// Check if a menu selection would start a new operation
export function isNewOperationSelection(selectionId: string): boolean {
  const operationSelections = ['ListV3:d1', 'ListV3:t1', 'ListV3:w1', 'ListV3:c1'];
  const result = operationSelections.includes(selectionId);

  return result;
}

// Get operation intent from menu selection
export function getOperationFromSelection(selectionId: string): string | null {
  const selectionMap: Record<string, string> = {
    'ListV3:d1': 'deposit',
    'ListV3:t1': 'transfer',
    'ListV3:w1': 'withdraw',
    'ListV3:c1': 'check_balance',
  };
  const result = selectionMap[selectionId] || null;

  return result;
}

// Handle operation in progress warning
export async function handleOperationInProgressWarning(
  currentOperation: string,
  requestedOperation: string,
  message: any,
  botIntent: any,
  session: any
): Promise<void> {
  // Update bot intent to track the pending operation change
  const { updateBotIntent } = require('@/services/bot_intent_service');

  await updateBotIntent(
    botIntent._id,
    {
      step: -1, // Special step to indicate warning state
      pending_operation: requestedOperation, // Store requested operation in separate field
      original_step: botIntent.step, // Store original step to restore later
    },
    session
  );

  // Send warning message
  const warningTemplate = await operationInProgressWarningTemplate(
    getOperationDisplayName(currentOperation),
    getOperationDisplayName(requestedOperation),
    message.from
  );
  await sendButtonMessage(warningTemplate);
}

// Restore user to their exact step in an operation
export async function restoreOperationStep(
  botIntent: any,
  message: any,
  user?: any
): Promise<void> {
  console.log('🔄 restoreOperationStep called with botIntent:', JSON.stringify(botIntent, null, 2));
  console.log('🔄 restoreOperationStep - botIntent.intent:', botIntent.intent);
  console.log('🔄 restoreOperationStep - botIntent.step:', botIntent.step);
  
  const { 
    depositMethodMessageTemplate,
    mmDepositMessageTemplate1,
    mmDepositMessageTemplateAmount,
    withdrawMethodMessageTemplate,
    withdrawAmountMessageTemplate,
    withdrawNumberMessageTemplate,
    transfertMessageTemplateAmountLocal,
    transferMessageTemplateNumber,
    checkBalanceMessageTemplate
  } = await import('./whapi_message_template');

  try {
    console.log('🔄 About to switch on intent:', botIntent.intent);
    switch (botIntent.intent) {
      case 'deposit':
        await restoreDepositStep(botIntent, message, user);
        break;
      case 'withdraw':
        await restoreWithdrawStep(botIntent, message, user);
        break;
      case 'transfer':
        await restoreTransferStep(botIntent, message, user);
        break;
      case 'check_balance':
        await restoreCheckBalanceStep(botIntent, message, user);
        break;
      default:
        // Fallback to operation start
        await sendTextMessage(message.from, `✅ Continuing your ${getOperationDisplayName(botIntent.intent)} operation...`);
    }
  } catch (error) {
    console.error('🔄 Error restoring operation step:', error);
    // Fallback to generic message
    await sendTextMessage(message.from, `✅ Continuing your ${getOperationDisplayName(botIntent.intent)} operation...`);
  }
}

async function restoreDepositStep(botIntent: any, message: any, user?: any): Promise<void> {
  const { 
    depositMethodMessageTemplate,
    mmDepositMessageTemplate1,
    mmDepositMessageTemplateAmount,
    mmDepositMessageTemplateDifferentNumber,
    mmDepositMessageTemplateConfirm,
    mmDepositMessageTemplateUSSD,
    mmDepositMessageTemplateUSSDDifferentNumber,
    cryptoDepositMessageTemplate
  } = await import('./whapi_message_template');

  const { intent_option, payer, amount, number, depositing_number } = botIntent;
  console.log('restoring deposit step', botIntent);

  // Handle crypto deposit flow
  if (intent_option === 'crypto') {
    // Crypto is single-step, show wallet address
    if (user?.wallet_address) {
      const cryptoTemplate = await cryptoDepositMessageTemplate(message.from, user.wallet_address, user.qr_code_url);
      await sendButtonMessage(cryptoTemplate);
    } else {
      await sendTextMessage(message.from, '✅ Continuing your Crypto Deposit...');
    }
    return;
  }

  // Handle mobile money deposit flow
  if (intent_option === 'mobile_money') {
    switch (botIntent.step) {
      case 0:
        // Show deposit method selection
        const methodTemplate = await depositMethodMessageTemplate(message.from);
        await sendButtonMessage(methodTemplate);
        break;
        
      case 1:
        // Show self/different number selection
        const selfTemplate = await mmDepositMessageTemplate1(message.from);
        await sendButtonMessage(selfTemplate);
        break;
        
      case 2:
        // Handle different sub-flows based on payer selection
        if (payer === 'different_number' && !depositing_number) {
          // User selected different number but hasn't entered it yet
          const diffNumberMessage = await mmDepositMessageTemplateDifferentNumber();
          await sendTextMessage(message.from, diffNumberMessage);
        } else if (!amount) {
          // User hasn't entered amount yet
          const amountMessage = await mmDepositMessageTemplateAmount(user);
          await sendTextMessage(message.from, amountMessage);
        } else {
          // User has amount, show confirmation
          const confirmTemplate = await mmDepositMessageTemplateConfirm(
            user?.name || message.from_name || 'User',
            message.from,
            depositing_number || message.from,
            amount
          );
          await sendButtonMessage(confirmTemplate);
        }
        break;
        
      case 3:
        // Handle confirmation or USSD display
        if (amount && (depositing_number || message.from)) {
          const confirmTemplate = await mmDepositMessageTemplateConfirm(
            user?.name || message.from_name || 'User',
            message.from,
            depositing_number || message.from,
            amount
          );
          await sendButtonMessage(confirmTemplate);
        } else {
          // Show amount input if missing
          const amountMessage = await mmDepositMessageTemplateAmount(user);
          await sendTextMessage(message.from, amountMessage);
        }
        break;
        
      case 4:
        // USSD generation step - show appropriate USSD message
        if (botIntent.ussd_code) {
          if (payer === 'different_number' && depositing_number) {
            const ussdTemplate = await mmDepositMessageTemplateUSSDDifferentNumber(message.from, botIntent.ussd_code);
            await sendButtonMessage(ussdTemplate);
          } else {
            const ussdTemplate = await mmDepositMessageTemplateUSSD(message.from, botIntent.ussd_code);
            await sendButtonMessage(ussdTemplate);
          }
        } else {
          // Fallback to confirmation if no USSD
          const confirmTemplate = await mmDepositMessageTemplateConfirm(
            user?.name || message.from_name || 'User',
            message.from,
            depositing_number || message.from,
            amount || 0
          );
          await sendButtonMessage(confirmTemplate);
        }
        break;
        
      default:
        await sendTextMessage(message.from, '✅ Continuing your Mobile Money Deposit...');
    }
    return;
  }

  // Handle initial step (no intent_option set yet)
  if (!intent_option || botIntent.step === 0) {
    const methodTemplate = await depositMethodMessageTemplate(message.from);
    await sendButtonMessage(methodTemplate);
    return;
  }

  // Fallback for unknown states
  await sendTextMessage(message.from, '✅ Continuing your Deposit operation...');
}

async function restoreWithdrawStep(botIntent: any, message: any, user?: any): Promise<void> {
  const { 
    withdrawMethodMessageTemplate,
    withdrawAmountMessageTemplate,
    withdrawNumberMessageTemplate,
    withdrawUnsupportedNumberMessageTemplate,
    withdrawDifferentNumberMessageTemplate,
    withdrawConfirmMessageTemplate
  } = await import('./whapi_message_template');

  console.log('restoring withdraw step', botIntent);

  const { intent_option, payer, amount, number } = botIntent;

  // Handle mobile money withdrawal flow
  if (intent_option === 'mobile_money') {
    switch (botIntent.step) {
      case 0:
      case 1:
        // Show withdraw method selection
        const methodTemplate = await withdrawMethodMessageTemplate(message.from);
        await sendButtonMessage(methodTemplate);
        break;
        
      case 2:
        // Show amount input
        const amountMessage = await withdrawAmountMessageTemplate(user);
        await sendTextMessage(message.from, amountMessage);
        break;
        
      case 3:
        // Handle number selection based on operator support
        if (!payer) {
          // Check user's own number operator support
          try {
            const { lookupMobileOperator, isLookupSuccess } = await import('mobile-operator-lookup');
            const result = lookupMobileOperator(`+${message.from}`);
            
            if (!isLookupSuccess(result) || result.monime_code === 'm13' || !result.monime_code) {
              // User's number is unsupported, show unsupported message
              const unsupportedTemplate = await withdrawUnsupportedNumberMessageTemplate(message.from);
              await sendButtonMessage(unsupportedTemplate);
            } else {
              // User's number is supported, show normal selection
              const numberTemplate = await withdrawNumberMessageTemplate(message.from);
              await sendButtonMessage(numberTemplate);
            }
          } catch (error) {
            // Fallback to normal selection if lookup fails
            const numberTemplate = await withdrawNumberMessageTemplate(message.from);
            await sendButtonMessage(numberTemplate);
          }
        } else if (payer === 'different_number' && !number) {
          // User selected different number but hasn't entered it yet
          const diffNumberMessage = await withdrawDifferentNumberMessageTemplate();
          await sendTextMessage(message.from, diffNumberMessage);
        } else if (payer && amount) {
          // User has selected payer and amount, show confirmation
          const confirmTemplate = await withdrawConfirmMessageTemplate(
            user?.name || message.from_name || 'User',
            message.from,
            number || `+${message.from}`,
            amount
          );
          await sendButtonMessage(confirmTemplate);
        } else {
          // Show amount input if missing
          const amountMessage = await withdrawAmountMessageTemplate(user);
          await sendTextMessage(message.from, amountMessage);
        }
        break;
        
      case 4:
        // Confirmation step - show confirmation with stored data
        if (amount && (number || message.from)) {
          const confirmTemplate = await withdrawConfirmMessageTemplate(
            user?.name || message.from_name || 'User',
            message.from,
            number || `+${message.from}`,
            amount
          );
          await sendButtonMessage(confirmTemplate);
        } else {
          // Fallback to number selection if data is missing
          const numberTemplate = await withdrawNumberMessageTemplate(message.from);
          await sendButtonMessage(numberTemplate);
        }
        break;
        
      case 5:
        // Final step - withdrawal processed, show generic continuation
        await sendTextMessage(message.from, '✅ Your withdrawal has been processed.');
        break;
        
      default:
        await sendTextMessage(message.from, '✅ Continuing your Mobile Money Withdrawal...');
    }
    return;
  }

  // Handle initial step (no intent_option set yet)
  if (!intent_option || botIntent.step === 0 || botIntent.step === 1) {
    const methodTemplate = await withdrawMethodMessageTemplate(message.from);
    await sendButtonMessage(methodTemplate);
    return;
  }

  // Fallback for unknown states
  await sendTextMessage(message.from, '✅ Continuing your Withdraw operation...');
}

async function restoreTransferStep(botIntent: any, message: any, user?: any): Promise<void> {
  const { 
    transfertMessageTemplateAmountLocal,
    transfertMessageTemplateAmountUSD,
    transferMessageTemplateNumber,
    transferMessageTemplateConfirmLocal,
    transferMessageTemplateConfirmUSD,
    transferMessageTemplateCurrency
  } = await import('./whapi_message_template');

  const { currency, amount, number } = botIntent;

  switch (botIntent.step) {
    case 0:
      // For transfer, we start with currency selection if not set, otherwise amount
      if (!currency) {
        // Show currency selection (though current implementation goes straight to local)
        const currencyTemplate = await transferMessageTemplateCurrency(message.from);
        await sendButtonMessage(currencyTemplate);
      } else {
        // Show amount input based on currency
        let amountMessage;
        if (currency === 'usd') {
          amountMessage = await transfertMessageTemplateAmountUSD();
        } else {
          amountMessage = await transfertMessageTemplateAmountLocal();
        }
        await sendTextMessage(message.from, amountMessage);
      }
      break;
      
    case 1:
      // Amount input step
      if (!amount) {
        // Show amount input based on currency
        let amountMessage;
        if (currency === 'usd') {
          amountMessage = await transfertMessageTemplateAmountUSD();
        } else {
          amountMessage = await transfertMessageTemplateAmountLocal();
        }
        await sendTextMessage(message.from, amountMessage);
      } else {
        // User has amount, show phone number input
        const numberMessage = await transferMessageTemplateNumber();
        await sendTextMessage(message.from, numberMessage);
      }
      break;
      
    case 2:
      // Phone number input step
      if (!number) {
        const numberMessage = await transferMessageTemplateNumber();
        await sendTextMessage(message.from, numberMessage);
      } else if (amount) {
        // User has both amount and number, show confirmation
        let confirmTemplate;
        if (currency === 'usd') {
          confirmTemplate = await transferMessageTemplateConfirmUSD(
            user?.name || message.from_name || 'User',
            message.from,
            number,
            amount
          );
        } else {
          confirmTemplate = await transferMessageTemplateConfirmLocal(
            user?.name || message.from_name || 'User',
            message.from,
            number,
            amount
          );
        }
        await sendButtonMessage(confirmTemplate);
      } else {
        // Show amount input if missing
        let amountMessage;
        if (currency === 'usd') {
          amountMessage = await transfertMessageTemplateAmountUSD();
        } else {
          amountMessage = await transfertMessageTemplateAmountLocal();
        }
        await sendTextMessage(message.from, amountMessage);
      }
      break;
      
    case 3:
      // Confirmation step - show confirmation with stored data
      if (amount && number) {
        let confirmTemplate;
        if (currency === 'usd') {
          confirmTemplate = await transferMessageTemplateConfirmUSD(
            user?.name || message.from_name || 'User',
            message.from,
            number,
            amount
          );
        } else {
          confirmTemplate = await transferMessageTemplateConfirmLocal(
            user?.name || message.from_name || 'User',
            message.from,
            number,
            amount
          );
        }
        await sendButtonMessage(confirmTemplate);
      } else {
        // Fallback to number input if data is missing
        const numberMessage = await transferMessageTemplateNumber();
        await sendTextMessage(message.from, numberMessage);
      }
      break;
      
    default:
      await sendTextMessage(message.from, '✅ Continuing your Transfer operation...');
  }
}

async function restoreCheckBalanceStep(botIntent: any, message: any, user?: any): Promise<void> {
  // Check balance is a single-step operation, just show balance
  if (user) {
    try {
      const { checkBalanceMessageTemplate } = await import('./whapi_message_template');
      const { getCurrency } = await import('../services/currency_service');
      const { getWalletBalance } = await import('../services/wallet_service');
      const { convertFromUSD } = await import('./helpers');
      
      const currency = await getCurrency(user);
      const wallet = await getWalletBalance(user);
      const fiat = await convertFromUSD(wallet.balance, currency, 'withdrawal');
      
      const balanceMessage = await checkBalanceMessageTemplate(
        user.name || 'User',
        message.from,
        wallet.balance,
        fiat
      );
      await sendTextMessage(message.from, balanceMessage);
    } catch (error) {
      console.error('Error restoring check balance:', error);
      await sendTextMessage(message.from, '✅ Continuing your Check Balance operation...');
    }
  } else {
    await sendTextMessage(message.from, '✅ Continuing your Check Balance operation...');
  }
}

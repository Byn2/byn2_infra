// @ts-nocheck
import BotIntent from '../models/bot_intent';

const projection = {
  bot_session: 1,
  intent: 1,
  intent_option: 1,
  payer: 1,
  amount: 1,
  number: 1,
  currency: 1,
  step: 1,
  status: 1,
  ussd: 1,
  mobile_number: 1,
  name: 1,
  received_amount: 1,
  received_currency: 1,
  sender_name: 1,
  // Dynamic fields used for operation restoration
  pending_operation: 1,
  original_step: 1,
  ussd_code: 1,
  depositing_number: 1,
};

export async function getBotIntentBySession(session: String) {
  //@ts-ignore
  return await BotIntent.findOne({ bot_session: session }, projection);
}

export async function getBotIntentByMobile(mobile: String) {
  return await BotIntent.findOne({ mobile_number: mobile }, projection);
}

export async function storeBotIntent(data: any, options = {}) {
  const botIntent = new BotIntent(data);
  await botIntent.save(options);
  return botIntent;
}

export async function updateBotIntent(id: String, data: any, options = {}) {
  //@ts-ignore
  const result = await BotIntent.findByIdAndUpdate(id, data, { ...options, new: true });
  return result;
}

export async function cleanupPendingIntents(mobile: String, options = {}) {
  //@ts-ignore
  const result = await BotIntent.deleteMany({ 
    mobile_number: mobile, 
    intent: { $in: ['welcome_pending', 'recipient_pending'] }
  }, options);
  return result;
}

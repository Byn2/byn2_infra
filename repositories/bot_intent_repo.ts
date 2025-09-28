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
};

export async function getBotIntentBySession(session: String) {
  //@ts-ignore
  return await BotIntent.findOne({ bot_session: session }, projection);
}

export async function storeBotIntent(data: any, options = {}) {
  const botIntent = new BotIntent(data);
  await botIntent.save(options);
  return botIntent;
}

export async function updateBotIntent(id: String, data: any, options = {}) {
  //@ts-ignore
  await BotIntent.updateOne({ _id: id }, data, options);
}

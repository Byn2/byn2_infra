import * as BotIntentRepo from "../repositories/bot_intent_repo";
import { ensureConnection } from '../lib/db';

export async function getBotIntentBySession(session: String){
    await ensureConnection();
    return await BotIntentRepo.getBotIntentBySession(session);
}

export async function getBotIntentByMobile(mobile: String){
    await ensureConnection();
    return await BotIntentRepo.getBotIntentByMobile(mobile);
    
}

export async function storeBotIntent(data: any, session: any){
    await ensureConnection();
    return await BotIntentRepo.storeBotIntent(data, session);
}

export async function updateBotIntent(id: any, data: any, session: any){
    await ensureConnection();
    return await BotIntentRepo.updateBotIntent(id, data, session);
}

export async function cleanupPendingIntents(mobile: String, session: any){
    await ensureConnection();
    return await BotIntentRepo.cleanupPendingIntents(mobile, session);
}

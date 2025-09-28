import * as BotIntentRepo from "../repositories/bot_intent_repo";

export async function getBotIntentBySession(session: String){
    return await BotIntentRepo.getBotIntentBySession(session);
}

export async function getBotIntentByMobile(mobile: String){
    return await BotIntentRepo.getBotIntentByMobile(mobile);
}

export async function storeBotIntent(data: any, session: any){
    return await BotIntentRepo.storeBotIntent(data, session);
}

export async function updateBotIntent(id: any, data: any, session: any){
    return await BotIntentRepo.updateBotIntent(id, data, session);
}

export async function cleanupPendingIntents(mobile: String, session: any){
    return await BotIntentRepo.cleanupPendingIntents(mobile, session);
}

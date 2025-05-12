import * as monimeService from '@/services/monime_service';
import { sendButtonMessage, sendTextMessage } from '@/lib/whapi';
import { updateBotIntent } from '@/services/bot_intent_service';
import { startTransaction, commitTransaction, abortTransaction } from '@/lib/db_transaction';

export async function handleWithdraw(message: any, botIntent: any, method?: any, user?: any) {
    const session = await startTransaction();
  const mobile = `+${message.from}`;
}
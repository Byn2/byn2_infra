//@ts-nocheck
//@ts-ignore
import * as userService from "@/services/user_service"
import * as walletService from "@/services/wallet_service"
import * as currecyService from "@/services/currency_service"
import { convertFromUSD } from "@/lib/helpers";
import {checkBalanceMessageTemplate} from "@/lib/whapi_message_template"
import {sendTextMessage} from "@/lib/whapi"
import { updateBotIntent } from '@/services/bot_intent_service';
import { startTransaction, commitTransaction, abortTransaction } from '@/lib/db_transaction';


export async function handleCheckBalance(message: any) {
    const session = await startTransaction();
    const mobile = `+${message.from}`
    const fetchedUser = await userService.fetchUserByMobileBot(mobile);
    
    if (!fetchedUser.success ) {
        return;
    }
    const user = fetchedUser.data;
    const currency = await currecyService.getCurrency(user);
    
    const wallet = await walletService.getWalletBalance(user);
    const fiat = await convertFromUSD(wallet.balance, currency);

    await updateBotIntent(
        user.botIntent._id,
        {
            intent: 'check_balance',
            status: 'success',
            step: 1,
        },
        session
    );

    await commitTransaction(session);

    const ctx = await checkBalanceMessageTemplate(message.from_name, message.from, wallet.balance, fiat)
    await sendTextMessage(message.from ,ctx);
    
}
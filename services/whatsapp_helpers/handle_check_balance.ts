import * as userService from '../user_service';
import * as walletService from '../wallet_service';
import * as currencyService from '../currency_service';
import { convertFromUSD } from '../../lib/helpers';
import { checkBalanceMessageTemplate } from '../../lib/whapi_message_template';
import { sendTextMessage } from '../../lib/whapi';
import { updateBotIntent } from '../bot_intent_service';
import { startTransaction, commitTransaction, abortTransaction } from '../../lib/db_transaction';

export async function handleCheckBalance(message: any, botIntent: any): Promise<void> {
  const session = await startTransaction();

  try {
    const mobile = `+${message.from}`;
    const fetchedUser = await userService.fetchUserByMobileBot(mobile);

    if (!fetchedUser.success) {
      await abortTransaction(session);
      return;
    }

    const user = fetchedUser.data;
    const currency = await currencyService.getCurrency(user);
    const wallet = await walletService.getWalletBalance(user);
    const fiat = await convertFromUSD(wallet.balance, currency, 'withdrawal');
    console.log('wallet', wallet.balance.toFixed(2));
    console.log('fiat', fiat.toFixed(2));

    // Update bot intent to success status first
    await updateBotIntent(
      botIntent._id,
      {
        intent: 'check_balance',
        status: 'success',
        step: 1,
      },
      session
    );

    // Send balance message
    const ctx = await checkBalanceMessageTemplate(
      message.from_name,
      message.from,
      parseFloat(wallet.balance.toFixed(2)),
      parseFloat(fiat.toFixed(2))
    );

    await sendTextMessage(message.from, ctx);

    // Reset bot intent to start state for next interaction
    await updateBotIntent(
      botIntent._id,
      {
        intent: 'start',
        status: 'pending',
        step: 0,
        amount: null,
        currency: null,
        number: null,
        payer: null,
        intent_option: null,
        ussd: '',
      },
      session
    );

    await commitTransaction(session);
  } catch (error) {
    console.error('Error in handleCheckBalance:', error);
    await abortTransaction(session);

    // Send error message to user
    await sendTextMessage(
      message.from,
      'Sorry, we encountered an error while checking your balance. Please try again later.'
    );
  }
}

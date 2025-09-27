import * as transactionService from '../services/transaction_service';
import * as userService from '../services/user_service';
import * as walletService from '../services/wallet_service';
import { convertToUSD, currencyConverter } from '../lib/helpers';
import * as currencyService from '../services/currency_service';
import {
  notifyTopUp,
  notifyTopUpFailure,
  notifyWithdrawal,
  notifyFailedWithdrawal,
} from '../notifications/fcm_notification';
// import { walletUpdateSocket } from '../lib/websocket_server';
// import lookupMobileOperator from 'mobile-operator-lookup';

// TypeScript interfaces for Monime API
interface MonimeAmount {
  currency: string;
  value: number;
}

interface MonimeCustomer {
  name: string;
}

interface MonimePaymentCodeRequest {
  name: string;
  mode: string;
  enable: boolean;
  amount: MonimeAmount;
  duration: string;
  customer: MonimeCustomer;
  reference: string;
  authorizedProviders: string[];
  authorizedPhoneNumber: string;
  metadata: Record<string, any>;
}

interface MonimePayoutRequest {
  amount: MonimeAmount;
  destination: {
    providerCode: string;
    accountId: string;
  };
  metadata: Record<string, any>;
}

interface MonimeWebhookPayload {
  status: string;
  customer_target: {
    reference: string;
  };
}

const monime_space_id = process.env.MONIME_SPACE_ID;
const monime_api_key = process.env.MONIME_AUTH_TOKEN;
const monime_kyc_key = process.env.MONIME_KYC_TOKEN;

export async function deposit(
  user: any,
  body: { amount: number; depositing_number?: string },
  session: any
): Promise<string> {
  const { amount, depositing_number } = body;

  const deposit_number = depositing_number || user.mobile_number;
  const deposit_type = depositing_number ? 'direct_deposit' : 'deposit';

  const Idkey = deposit_number + Date.now().toString();

  // create a transaction record
  const userCurrency = await currencyService.getCurrency(user);
  let convertedAmount = amount;

  convertedAmount = await currencyConverter(amount, userCurrency, userCurrency);

  const transactionData = {
    from_id: user._id,
    to_id: null,
    amount: amount,
    currency: userCurrency,
    reason: 'deposit',
    status: 'pending',
    provider: 'monime',
    type: deposit_type,
    fee: {
      amount: '0',
      currency: userCurrency,
    },
    exchange_rate: {
      from: {
        currency: userCurrency,
        amount: amount,
      },
      to: {
        currency: 'USD',
        amount: convertedAmount,
      },
    },
    amount_received: convertedAmount,
    received_currency: userCurrency,
    receiving_number: depositing_number || '',
  };
  // Store the transaction
  const transaction = await transactionService.storeTransations(transactionData, session);

  const transaction_id = transaction._id;

  const options = {
    method: 'POST',
    headers: {
      'Monime-Space-Id': monime_space_id,
      'Idempotency-Key': Idkey,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${monime_api_key}`,
    },
    body: JSON.stringify({
      name: 'Deposit - Byn2',
      mode: 'one_time',
      enable: true,
      amount: { currency: 'SLE', value: amount * 100 },
      duration: '1h30m',
      customer: {
        name: user.name,
      },
      reference: transaction_id,
      authorizedProviders: ['m17', 'm18'],
      //authorizedPhoneNumber: deposit_number,
      metadata: {},
    }),
  };

  const response = await fetch('https://api.monime.io/v1/payment-codes', options);

  const data = await response.json();

  const ussdCode = data.result.ussdCode;
  
  await transactionService.updateTransaction(transaction_id, { ussd: ussdCode }, session);

  return ussdCode;
}

export async function generateUSSDCode(
  user: any,
  body: { depositing_number?: string; transaction_id: string },
  session: any
): Promise<string> {
  const { depositing_number, transaction_id } = body;
  console.log(body);

  const deposit_number = depositing_number || user.mobile_number;

  const Idkey = deposit_number + Date.now().toString();

  // let convertedAmount = amount;

  // convertedAmount = await currencyConverter(amount, userCurrency, userCurrency);

  const transaction = await transactionService.fetchByID(transaction_id);

  const options = {
    method: 'POST',
    headers: {
      'Monime-Space-Id': monime_space_id,
      'Idempotency-Key': Idkey,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${monime_api_key}`,
    },
    body: JSON.stringify({
      name: 'Deposit - Byn2',
      mode: 'one_time',
      enable: true,
      amount: { currency: 'SLE', value: transaction.amount * 100 },
      duration: '1h30m',
      customer: {
        name: user.name,
      },
      reference: transaction._id,
      authorizedProviders: ['m17', 'm18'],
      authorizedPhoneNumber: deposit_number,
      metadata: {},
    }),
  };

  const response = await fetch('https://api.monime.io/v1/payment-codes', options);

  const data = await response.json();

  const ussdCode = data.result.ussdCode;

  await transactionService.updateTransaction(transaction_id, { ussd: ussdCode }, session);

  return ussdCode;
}

// export async function withdraw(user, body, session) {
//   const { amount, receiving_number } = body;

//   const withdraw_number = receiving_number || user.mobile_number;
//   const withdraw_type = receiving_number ? 'direct_transfer' : 'withdraw';

//   const Idkey = withdraw_number + Date.now().toString();

//   // create a transaction record
//   const userCurrency = await currencyService.getCurrency(user);
//   let convertedAmount = amount;

//   convertedAmount = await currencyConverter(amount, userCurrency, userCurrency);

//   const transactionData = {
//     from_id: user._id,
//     to_id: null,
//     amount: amount,
//     currency: userCurrency,
//     reason: 'withdraw',
//     status: 'completed',
//     provider: 'monime',
//     type: withdraw_type,
//     fee: {
//       amount: 0,
//       currency: userCurrency,
//     },
//     exchange_rate: {
//       from: {
//         currency: userCurrency,
//         amount: amount,
//       },
//       to: {
//         currency: 'USD',
//         amount: convertedAmount,
//       },
//     },
//     amount_received: convertedAmount,
//     received_currency: userCurrency,
//     receiving_number: receiving_number || '',
//   };

//   // Store the transaction
//   const transaction = await transactionService.storeTransations(
//     transactionData,
//     session
//   );

//   const transaction_id = transaction._id;

//   // withdraw usdc from users account

//   await walletService.withdraw(user, { amount }, session, transaction.status);

//   const options = {
//     method: 'POST',
//     headers: {
//       'Monime-Space-Id': monime_space_id,
//       'Idempotency-Key': Idkey,
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${monime_api_key}`,
//     },
//     body: JSON.stringify({
//       amount: { currency: 'SLE', value: body.amount * 100 },
//       destination: { providerCode: 'm17', accountId: withdraw_number },
//       //source: { financialAccountId: '<string>' },
//       metadata: {
//         transactionId: transaction_id,
//       },
//     }),
//   };

//   const response = await fetch('https://api.monime.io/payouts', options);
//   const data = await response.json();

//   console.log(data);
// }

export async function withdraw(
  user: any,
  body: { amount: number; receiving_number?: string },
  session: any
): Promise<void> {
  const { amount, receiving_number } = body;

  const withdraw_number = receiving_number || user.mobile_number;
  const withdraw_type = receiving_number ? 'direct_transfer' : 'withdraw';
  const Idkey = withdraw_number + Date.now().toString();

  // Get user's currency
  const userCurrency = await currencyService.getCurrency(user);
  const convertedAmount = await currencyConverter(amount, userCurrency, userCurrency);

  // Prepare transaction data
  const transactionData = {
    from_id: user._id,
    to_id: null,
    amount,
    currency: userCurrency,
    reason: 'withdraw',
    status: 'pending', // Initially set as pending
    provider: 'monime',
    type: withdraw_type,
    fee: { amount: 0, currency: userCurrency },
    exchange_rate: {
      from: { currency: userCurrency, amount },
      to: { currency: 'USD', amount: convertedAmount },
    },
    amount_received: convertedAmount,
    received_currency: userCurrency,
    receiving_number: receiving_number || '',
  };

  // Store the transaction
  const transaction = await transactionService.storeTransations(transactionData, session);
  const transaction_id = transaction._id;

  try {
    // Withdraw USDC from the user's account
    await walletService.withdraw(user, { amount }, session, 'pending');

    const options = {
      method: 'POST',
      headers: {
        'Monime-Space-Id': monime_space_id,
        'Idempotency-Key': Idkey,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${monime_api_key}`,
      },
      body: JSON.stringify({
        amount: { currency: 'SLE', value: body.amount * 100 },
        destination: { providerCode: 'm17', accountId: withdraw_number },
        metadata: { transactionId: transaction_id },
      }),
    };

    const response = await fetch('https://api.monime.io/v1/payouts', options);
    const data = await response.json();

    if (data.success) {
      // Update transaction status to completed
      await transactionService.updateTransaction(transaction_id, { status: 'completed' }, session);
      if (receiving_number === null) {
        await notifyWithdrawal(user, amount, transaction.currency, session);
      }
    } else {
      // Update transaction status to failed
      await transactionService.updateTransaction(transaction_id, { status: 'failed' }, session);

      await notifyFailedWithdrawal(user, amount, transaction.currency, session);
    }
  } catch (error) {
    console.error('Withdrawal failed:', error);
    // Update transaction status to failed in case of an error
    await transactionService.updateTransaction(transaction_id, { status: 'failed' }, session);
  }
}

export async function webhook(body: MonimeWebhookPayload, session: any): Promise<void> {
  const { status, customer_target } = body;

  // find the transaction
  const txt = await transactionService.fetchByID(customer_target.reference);
  if (!txt) {
    return;
  }
  const amount = txt.amount;
  const user = await userService.fetchUserById(txt.from_id);

  if (txt) {
    if (status === 'completed' && txt.status !== 'completed') {
      await walletService.deposit(user, { amount }, session, status);

      //update the transaction
      await transactionService.updateTransaction(txt._id, { status: status }, session);
      //send push notification

      console.log('Make teh websocket:', user._d);

      // await walletUpdateSocket(user._d, { amount: 0, recipient: 0 });

      console.log('Make the notification after web socket');

      await notifyTopUp(user, amount, txt.currency, session);
    } else if (status === 'processing' && txt.status == 'pending') {
      await transactionService.updateTransaction(txt._id, { status: status }, session);
    } else if (status === 'failed' || status === 'expired') {
      await transactionService.updateTransaction(txt._id, { status: status }, session);
      //send push notification
      await notifyTopUpFailure(user, amount, txt.currency, session);
    } else {
      await transactionService.updateTransaction(txt._id, { status: status }, session);
    }
  } else {
    console.log('No transaction found');
  }
}

// export async function kycVerify(user, number, session) {
//   const accountID = number || user.mobile_number;
//   const { monime_code } = lookupMobileOperator(accountID);
//   const providerCode = monime_code;

//   const options = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${monime_kyc_key}`,
//     },
//   };

//   try {
//     const response = await fetch(
//       `https://api.monime.io/kyc-verifications/${providerCode}?accountId=${accountID}`,
//       options
//     );

//     const data = await response.json();

//     if (data.success && !number) {
//       await userService.updateUser(
//         user._id,
//         { mobile_kyc_verified_at: new Date() },
//         session
//       );
//     }

//     return data;
//   } catch (error) {
//     console.error('Error fetching KYC verification:', error);
//     throw error;
//   }
// }

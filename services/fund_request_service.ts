//@ts-check
import * as fundRequestRepo from '../repositories/fund_request_repo';
import * as userService from './user_service';
import * as currencyService from './currency_service';
import * as walletService from './wallet_service';
import { currencyConverter } from '../lib/helpers';
import {
  notifyFundRequest,
  notifyFundRequestStatus,
} from '../notifications/fcm_notification.js';

export async function fetchById(id) {
  const fundRequest = await fundRequestRepo.fetchById(id);
  return fundRequest;
}

export async function fetchByFromIDOrToID(user) {
  const currency_code = await currencyService.getCurrency(user);
  const fundRequests = await fundRequestRepo.fetchByFromIDOrToID(user._id);

  const convertedRequests = await Promise.all(
    fundRequests.map(async (request) => {
      const convertedAmount = await currencyConverter(
        request.amount,
        request.base_currency,
        currency_code
      );

      return {
        ...request.toObject(), // convert Mongoose document to plain object
        amount: convertedAmount,
      };
    })
  );

  return convertedRequests;
}

export async function storeFundRequest(user, data, session) {
  const { tag, amount, reason } = data;

  if (!tag || typeof tag !== 'string' || isNaN(amount) || amount <= 0) {
    return { success: false, error: 'Tag, Amount and Reason are required' };
  }

  const toUser = await userService.fetchUserByTag(tag);

  if (!toUser) {
    return { success: false, error: 'User not found' };
  }

  //get currency
  const sendCurrency = await currencyService.getCurrency(user);
  const toCurrency = await currencyService.getCurrency(toUser);

  await fundRequestRepo.storeFundRequest(
    {
      from_id: user._id,
      to_id: toUser._id,
      base_currency: sendCurrency,
      reason: reason,
      amount: amount,
    },
    { session }
  );

  //convert the amount to receiver base currency
  const convertedAmount = await currencyConverter(
    amount,
    sendCurrency,
    toCurrency
  );

  // // //send notification
  await notifyFundRequest(user, toUser, convertedAmount, toCurrency, session);

  return { success: true, message: 'Fund request sent successfully' };
}

export async function updateFundRequest(user, data, session) {
  const { id, status } = data;
  
  const fundRequest = await fundRequestRepo.fetchById(id);

  if (!fundRequest) {
    return { success: false, error: 'Fund Request not found' };
  }

  // if (
  //   user._id !== fundRequest.from_id._id ||
  //   user._id !== fundRequest.to_id._id
  // ) {
  //   return { success: false, error: 'Unauthorized' };
  // }


  if (fundRequest.status !== 'pending') {
    return { success: false, error: 'Request already processed' };
  }

  //sender is the user who sent the request
  const sender = await userService.fetchUserById(fundRequest.from_id._id);

  if (!sender) return { success: false, error: 'Sender not found' };

  //get currency
  const senderCurrency = await currencyService.getCurrency(sender);
  const userCurrency = await currencyService.getCurrency(user);

  if (status === 'accepted') {
    await walletService.transfer(
      user,
      {
        tag: sender.tag,
        amount: fundRequest.amount,
        reason: fundRequest.reason,
      },
      { session }
    );

    await fundRequestRepo.updateFundRequest(
      id,
      { status: 'accepted' },
      { session }
    );

    //send push notification
    // await notifyFundRequestStatus(
    //   user,
    //   sender,
    //   fundRequest.amount,
    //   senderCurrency,
    //   'accepted',
    //   session
    // );

    return { success: true, message: 'Request accepted' };
  } else {
    await fundRequestRepo.updateFundRequest(
      id,
      { status: 'rejected' },
      session
    );
    //send push notification
    await notifyFundRequestStatus(
      user,
      sender,
      fundRequest.amount,
      userCurrency,
      'ignored'
    );
    return { success: true, message: 'Request ignored' };
  }
}

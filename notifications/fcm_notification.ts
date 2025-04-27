//@ts-check
import * as fcm from '../lib/fcm';
import * as notificationService from '../services/notification_service';
import { formatNumber } from '../lib/helpers';

export async function notifyTransfer(
  sender,
  recipient,
  amount,
  currency,
  session
) {
  const fAmount = await formatNumber(amount);
  const title = '🚀 Transfer Successful';
  const body = `${currency} ${fAmount}  was sent to ${recipient.name}`;
  await sendPushNotification(sender.fcm_token, title, body, 'wallet');
  await createNotification(sender._id, 'User', title, body, session);
}

export async function notifyRecipient(
  sender,
  recipient,
  amount,
  currency,
  session
) {
  const fAmount = await formatNumber(amount);
  const title = "💸 You've Got Money!";
  const body = `You've received ${currency} ${fAmount} from ${sender.name}`;
  await sendPushNotification(recipient.fcm_token, title, body, 'wallet');
  await createNotification(recipient._id, 'User', title, body, session);
}

export async function notifyTopUp(user, amount, currency, session) {
  const fAmount = await formatNumber(amount);
  const title = '🎉 Top-up Successful';
  const body = `Yeay! ${currency} ${fAmount} has been added to your account`;
  await sendPushNotification(user.fcm_token, title, body, 'wallet');
  await createNotification(user._id, 'User', title, body, session);
}

export async function notifyTopUpFailure(user, amount, currency, session) {
  const fAmount = await formatNumber(amount);
  const title = '❌ Top-up Failed';
  const body = `Oops! There was an issue adding ${currency} ${fAmount} to your account. Please try again.`;
  await sendPushNotification(user.fcm_token, title, body, 'wallet');
  await createNotification(user._id, 'User', title, body, session);
}

export async function notifyWithdrawal(user, amount, currency, session) {
  const fAmount = await formatNumber(amount);
  const title = '💸 Withdrawal Complete';
  const body = `You’ve withdrawn ${fAmount} ${currency}. Check your balance for updates.`;
  await sendPushNotification(user.fcm_token, title, body, 'wallet');
  await createNotification(user._id, 'User', title, body, session);
}

export async function notifyFailedWithdrawal(user, amount, currency, session) {
  const fAmount = await formatNumber(amount);
  const title = '❌ Withdrawal Failed';
  const body = `Your withdrawal of ${fAmount} ${currency} was unsuccessful. Please try again later.`;

  await sendPushNotification(user.fcm_token, title, body, 'wallet');
  await createNotification(user._id, 'User', title, body, session);
}

export async function notifyStakingDeposit(user, amount, currency, session) {
  const fAmount = await formatNumber(amount);
  const title = '🔒 Staking Confirmed';
  const body = `${currency} ${fAmount}has been staked successfully.`;
  await sendPushNotification(user.fcm_token, title, body, 'staking');
  await createNotification(user._id, 'User', title, body, session);
}

export async function notifyStakingWithdrawal(user, amount, currency, session) {
  const fAmount = await formatNumber(amount);
  const title = '✅ Staking Withdrawal Complete';
  const body = `You’ve unstaked ${currency} ${fAmount}. It’s now available in your balance.`;
  await sendPushNotification(user.fcm_token, title, body, 'staking');
  await createNotification(user._id, 'User', title, body, session);
}

export async function notifyFundRequest(
  sender,
  recipient,
  amount,
  currency,
  session
) {
  const fAmount = await formatNumber(amount);
  const title = '😉 Fund Request';
  const body = `${sender.name} sent you a fund request of ${currency} ${fAmount} `;
  await sendPushNotification(recipient.fcm_token, title, body, 'fund_request');
  await createNotification(recipient._id, 'User', title, body, session);
}

export async function notifyFundRequestStatus(
  user,
  recipient,
  amount,
  currency,
  status,
  session
) {
  const fAmount = await formatNumber(amount);
  const title = '🫢 Fund Request';
  const body = `${user.name}, ${status} your fund request of ${currency} ${fAmount}`;
  await this.sendPushNotification(
    recipient.fcm_token,
    title,
    body,
    'fund_request'
  );
  await createNotification(recipient._id, 'User', title, body, session);
}

async function createNotification(
  notifiableId,
  notifiableType,
  title,
  message,
  session
) {
  const notification = await notificationService.storeNotification(
    {
      title,
      message,
      notifiable: {
        type: notifiableType,
        id: notifiableId,
      },
    },
    session
  );
}

async function sendPushNotification(token, title, body, type) {
  try {
    //check if there is a token
    if (!token) {
      return;
    }
    await fcm.sendNotification(title, body, token, type);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

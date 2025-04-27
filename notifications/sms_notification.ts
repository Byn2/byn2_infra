//@ts-check
import { sendSMS } from '../lib/vonage';

export async function sendSMSNotification(to, text) {
  await sendSMS(to, text);
}

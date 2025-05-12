//@ts-nocheck
import { Vonage } from '@vonage/server-sdk';

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

const from = 'Byn2';

export async function sendSMS(to, text) {
  await vonage.sms
    .send({ to, from, text })
    .then((resp) => {})
    .catch((err) => {
      console.log('There was an error sending the messages.');
      console.error(err);
    });
}

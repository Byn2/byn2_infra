// import { sendButtonMessage, sendTextMessage } from '@/lib/whapi';
// import { updateBotIntent } from '@/services/bot_intent_service';
// import { startTransaction, commitTransaction, abortTransaction } from '@/lib/db_transaction';
// import * as walletService from '@/services/wallet_service';
// import {
//   transferMessageTemplateConfirmLocal,
//   transferMessageTemplateConfirmUSD,
//   transferMessageTemplateCurrency,
//   transferMessageTemplateNumber,
//   transfertMessageTemplateAmountLocal,
//   transfertMessageTemplateAmountUSD,
//   transfertMessageTemplateStatusSender,
// } from '@/lib/whapi_message_template';
// import {
//   isValidAmount,
//   isValidPhoneNumber,
//   extractButtonId,
//   extractTextInput,
//   sendValidationError,
//   handleInvalidInput,
// } from '@/lib/whatsapp_utils';

// export async function handleSend(message: any, botIntent: any, currency?: any, user?: any) {
//   const session = await startTransaction();
//   const mobile = `+${message.from}`;

//   if (botIntent.intent === 'start') {
//     const ctx = await transferMessageTemplateCurrency(message.from);
//     await sendButtonMessage(ctx);
//     await updateBotIntent(
//       botIntent._id,
//       {
//         intent: 'transfer',
//         step: 1,
//       },
//       session
//     );
//   } else if (botIntent.intent === 'transfer') {
//     // Step 1: Currency selection
//     if (botIntent.step === 1) {
//       const currencyBtn = extractButtonId(message);

//       if (currencyBtn === 'ButtonsV3:tt_local') {
//         const ctx = await transfertMessageTemplateAmountLocal();
//         await sendTextMessage(message.from, ctx);
//         await updateBotIntent(
//           botIntent._id,
//           {
//             currency: 'local',
//             step: 2,
//           },
//           session
//         );
//       } else if (currencyBtn === 'ButtonsV3:tt_usd') {
//         const ctx = await transfertMessageTemplateAmountUSD();
//         await sendTextMessage(message.from, ctx);
//         await updateBotIntent(
//           botIntent._id,
//           {
//             currency: 'usd',
//             step: 2,
//           },
//           session
//         );
//       } else {
//         await handleInvalidInput(message, 'button');
//       }

//       // Step 2: Amount input
//     } else if (botIntent.step === 2) {
//       const amount = extractTextInput(message);

//       if (!amount || !isValidAmount(amount)) {
//         await sendValidationError('amount', message.from);
//         return;
//       }

//       const ctx = await transferMessageTemplateNumber();
//       await sendTextMessage(message.from, ctx);
//       await updateBotIntent(
//         botIntent._id,
//         {
//           amount: parseFloat(amount),
//           step: 3,
//         },
//         session
//       );

//       // Step 3: Phone number input
//     } else if (botIntent.step === 3) {
//       const number = extractTextInput(message);

//       if (!number || !isValidPhoneNumber(number)) {
//         await sendValidationError('phone', message.from);
//         return;
//       }

//       // Send appropriate confirmation message based on currency
//       let ctx;
//       if (botIntent.currency === 'local') {
//         ctx = await transferMessageTemplateConfirmLocal(
//           message.from_name,
//           message.from,
//           number,
//           botIntent.amount
//         );
//       } else {
//         ctx = await transferMessageTemplateConfirmUSD(
//           message.from_name,
//           message.from,
//           number,
//           botIntent.amount
//         );
//       }

//       await sendButtonMessage(ctx);
//       await updateBotIntent(
//         botIntent._id,
//         {
//           number: number,
//           step: 4,
//         },
//         session
//       );

//       // Step 4: Confirmation
//     } else if (botIntent.step === 4) {
//       const confirmBtn = extractButtonId(message);

//       if (confirmBtn === 'ButtonsV3:tt_confirm') {

//         await updateBotIntent(
//           botIntent._id,
//           {
//             status: 'success',
//           },
//           session
//         );

//         try {
//           const result = await walletService.transfer(
//             user,
//             {
//               identifier: botIntent.number,
//               amount: botIntent.amount,
//               platform: 'whatsapp',
//             },
//             session
//           );
//           const ctx = await transfertMessageTemplateStatusSender(
//             message.from_name,
//             botIntent.currency === 'local' ? 'Le' : '$',
//             botIntent.amount,
//             'true',
//             botIntent.number
//           );
//           await sendTextMessage(message.from, ctx);
//         } catch (e) {
//           const ctx = await transfertMessageTemplateStatusSender(
//             message.from_name,
//             botIntent.currency === 'local' ? 'Le' : '$',
//             botIntent.amount,
//             'false',
//             botIntent.number
//           );
//           await sendTextMessage(message.from, ctx);
//         }

//         // Reset bot intent to start state for next interaction
//         await updateBotIntent(
//           botIntent._id,
//           {
//             intent: 'start',
//             status: 'pending',
//             step: 0,
//             amount: null,
//             currency: null,
//             number: null,
//             payer: null,
//             intent_option: null,
//             ussd: ""
//           },
//           session
//         );
//       } else if (confirmBtn === 'ButtonsV3:tt_cancel') {
//         await updateBotIntent(
//           botIntent._id,
//           {
//             intent: 'start',
//             step: 0,
//           },
//           session
//         );
//       } else {
//         await handleInvalidInput(message, 'button');
//       }
//     }
//   }

//   await commitTransaction(session);
// }

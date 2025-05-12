//@ts-nocheck
//@ts-ignore
import { getOrCreateUserTokenAccount } from "../lib/solana";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import {
  transferUSDC,
  sendUSDC,
  makeDeposit,
  makeWithdraw,
  retrieveUSDC,
} from "../lib/transfer-spl";
import * as currencyService from "./currency_service";
import * as userService from "./user_service";
import * as transactionService from "./transaction_service";
import { convertToUSD, currencyConverter } from "../lib/helpers";
import {
  notifyRecipient,
  notifyTransfer,
} from "../notifications/fcm_notification";
import { sendTextMessage } from "@/lib/whapi"; 
import {transfertMessageTemplateAmountStatusReceiver} from "@/lib/whapi_message_template";

import * as stakingService from "./liquidity_providers_service";
import { IUser } from "@/types/user";

const cluster = process.env.CONNECTION_URL || "devnet";
const connection = new Connection(clusterApiUrl(cluster), "confirmed");

export async function getWalletBalance(data: any) {
  const address = await getOrCreateUserTokenAccount(data.mobile_number);

  const balance = await connection.getTokenAccountBalance(address);

  return {
    balance: balance.value.uiAmount,
    address: address.toBase58(),
  };
}

export async function createWallet(data: any) {
  await getOrCreateUserTokenAccount(data);
}

async function processTransaction({
  user,
  data,
  session,
  type,
  identifier = null,
  reason = null,
  externalStatus = "",
  platform = null,
}) {
  try {
    const { amount } = data;

    // Validate input
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Invalid amount");
    }

    const userCurrency = await currencyService.getCurrency(user);
    const amountInUSDC = await convertToUSD(amount, userCurrency);

    let recipientUser = null;
    let recipientCurrency = null;
    let convertedAmount = amount;

    if (identifier) {
      recipientUser = await userService.fetchUserByTagOrMobile(identifier);
      recipientCurrency = await currencyService.getCurrency(recipientUser);
      convertedAmount = await currencyConverter(
        amount,
        userCurrency,
        recipientCurrency
      );
    }

    let status = "pending";

    // Handle transaction based on type
    switch (type) {
      case "transfer":
      case "payment":
        await transferUSDC(
          user.mobile_number,
          recipientUser.mobile_number,
          amountInUSDC
        );
        status = "completed";

        break;
      case "deposit":
        // Assume deposit is processed asynchronously via webhook
        status = externalStatus;
        if (status == "completed") {
          await makeDeposit(user.mobile_number, amountInUSDC);
        }
        break;
      case "withdraw":
        // Assume withdrawal is processed asynchronously via webhook
        status = externalStatus;
        if (status == "pending") {
          await makeWithdraw(user.mobile_number, amountInUSDC);
        }
        break;
      default:
        throw new Error("Invalid transaction type");
    }

    if (type != "deposit" && type != "withdraw" && type != "payment") {
      // Prepare transaction data
      const transactionData = {
        from_id: user._id,
        to_id: recipientUser ? recipientUser._id : null,
        amount: amount,
        currency: userCurrency,
        reason: reason || type.charAt(0).toUpperCase() + type.slice(1),
        status: status,
        type: type,
        fee: {
          amount: 0,
          currency: userCurrency,
        },
        exchange_rate: {
          from: {
            currency: userCurrency,
            amount: amount,
          },
          to: {
            currency: recipientCurrency || "USD",
            amount: convertedAmount,
          },
        },
        platform: platform,
        amount_received: convertedAmount,
        received_currency: recipientCurrency || userCurrency,
      };

      // Store the transaction
      await transactionService.storeTransations(
        transactionData,
        session
      );
    }

    console.log("Transaction processed successfully");

    //Send notifications if applicable
    if (type === "transfer" && recipientUser && platform != "whatsapp") {
      await notifyTransfer(user, recipientUser, amount, userCurrency, session);
      await notifyRecipient(user, recipientUser, amount, userCurrency, session);
      
    }

    if(platform === "whatsapp"){
      console.log("Sending recipient msg");
      const sanitizedNumber = recipientUser.mobile_number.replace('+', '');
      const ctx = await transfertMessageTemplateAmountStatusReceiver(recipientUser.name, recipientUser.mobile_number, 'Le', amount, user.name);
      console.log("ctx", ctx);
      console.log("sanitizedNumber", sanitizedNumber);
      await sendTextMessage(sanitizedNumber, ctx);
    }

    return {
      status,
      amount_received: convertedAmount,
    };
  } catch (error) {

    if (error instanceof Error) {
      throw new Error(`Transaction failed: ${error.message}`);
    }
    throw new Error('Transaction failed: An unknown error occurred');
  }
}

export async function transfer(user: any, data: any, session: any) {
  // console.log(data);
  // const result = await stakingService.useStakedFunds(
  //   { amount: data.amount, requestingUserId: user._id },
  //   session
  // );

  // return result;
  return processTransaction({
    user,
    data,
    session,
    type: data.type || "transfer",
    identifier: data.identifier,
    reason: data.reason || "Transfer",
    platform: data.platform || "web",
  });
}

export async function deposit(user: any, data: any, session: any, externalStatus: any) {
  return await processTransaction({
    user,
    data,
    session,
    type: "deposit",
    externalStatus,
  });
}

export async function withdraw(user: any, data: any, session: any, externalStatus: any) {
  return await processTransaction({
    user,
    data,
    session,
    type: "withdraw",
    externalStatus,
  });
}

export async function transferToPubKey(user: any, data: any, session: any) {
  const { publicKey, amount } = data;

  if (!publicKey || typeof publicKey !== "string") {
    throw new Error("Invalid public key");
  }

  if (isNaN(amount) || amount <= 0) {
    throw new Error("Invalid amount");
  }

  const userCurrency = await currencyService.getCurrency(user);

  const amountInUSDC = await convertToUSD(amount, userCurrency);

  await sendUSDC(user.mobile_number, publicKey, amountInUSDC);

  // create transaction
  const transactionData = {
    from_id: user._id,
    to_id: null,
    amount: amount,
    currency: userCurrency,
    reason: "Deposit",
    status: "completed",
    type: "crypto",
    fee: {
      amount: 0,
      currency: userCurrency,
    },
    exchange_rate: {
      from: {
        currency: userCurrency,
        amount: amount,
      },
      to: {
        currency: "USD",
        amount: amountInUSDC,
      },
    },
    amount_received: amountInUSDC,
    received_currency: userCurrency,
  };

  // Store the transaction
  await transactionService.storeTransations(transactionData, session);
}

export async function retriveUSDC() {
  const users = await userService.fetchAllUsers();
  for (const user of users) {
    const address = await getOrCreateUserTokenAccount(user.mobile_number);

    const balance = await connection.getTokenAccountBalance(address);

    //console.log('Balance:', balance.balance.uiAmount);

    await retrieveUSDC(user.mobile_number, balance.value.uiAmount);
  }
}

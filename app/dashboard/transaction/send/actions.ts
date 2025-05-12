"use server";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "@/lib/middleware/get-auth-user";
import { transfer } from "@/services/wallet_service";
import {
  startTransaction,
  commitTransaction,
  abortTransaction,
} from "@/lib/db_transaction";

// Types for our transfer functions
interface Byn2TransferParams {
  amount: number;
  currency: string;
  notes: string;
  recipient: string;
}

interface BankTransferParams {
  amount: number;
  currency: string;
  bankAddress: string;
  bankName: string;
  accountNumber: string;
  ibanNumber: string;
  transferType: string;
  recipient: string;
}

// Server action for Byn2 transfers
export async function sendByn2Transfer(data: Byn2TransferParams) {
  const authUser = await getAuthenticatedUser();

  //@ts-ignore
  if ("user" in authUser === false) return authUser;
  const session = await startTransaction();
  try {
    // Validate the data
    if (!data.recipient) {
      return { error: "Recipient is required" };
    }

    if (!data.amount || data.amount <= 0) {
      return { error: "Valid amount is required" };
    }
    console.log(data);

    await transfer(authUser.user, data, session);

    // Here you would connect to your database or external API
    // For example with MongoDB or any other database

    // Example implementation:
    // const db = await connectToDatabase()
    // const result = await db.collection("transactions").insertOne({
    //   type: "byn2",
    //   amount: data.amount,
    //   currency: data.currency,
    //   notes: data.notes,
    //   recipient: data.recipient,
    //   status: "completed",
    //   createdAt: new Date()
    // })

    await commitTransaction(session);

    // Revalidate the transactions page to show the new transaction
    revalidatePath("/dashboard/transaction/history");

    return { success: true, transactionId: "byn2_" + Date.now() };
  } catch (error) {
    await abortTransaction(session);
    console.error("Error processing Byn2 transfer:", error);
    //@ts-ignore
    return { error: error.message || "Failed to process Byn2 transfer" };
  }
}

// Server action for bank transfers
export async function sendBankTransfer(data: BankTransferParams) {
  try {
    // Validate the data
    if (!data.recipient) {
      return { error: "Recipient is required" };
    }

    if (!data.amount || data.amount <= 0) {
      return { error: "Valid amount is required" };
    }

    if (!data.bankName) {
      return { error: "Bank name is required" };
    }

    if (!data.accountNumber) {
      return { error: "Account number is required" };
    }

    if (data.transferType === "international" && !data.ibanNumber) {
      return { error: "IBAN number is required for international transfers" };
    }

    // Here you would connect to your database or external API
    // For example with MongoDB or any other database

    // Example implementation:
    // const db = await connectToDatabase()
    // const result = await db.collection("transactions").insertOne({
    //   type: "bank",
    //   amount: data.amount,
    //   currency: data.currency,
    //   bankAddress: data.bankAddress,
    //   bankName: data.bankName,
    //   accountNumber: data.accountNumber,
    //   ibanNumber: data.ibanNumber,
    //   transferType: data.transferType,
    //   recipient: data.recipient,
    //   status: "pending",
    //   createdAt: new Date()
    // })

    // For now, we'll simulate a successful transaction
    console.log("Processing bank transfer:", data);

    // Wait for 1 second to simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Revalidate the transactions page to show the new transaction
    revalidatePath("/dashboard/transaction/history");

    return { success: true, transactionId: "bank_" + Date.now() };
  } catch (error) {
    console.error("Error processing bank transfer:", error);
    //@ts-ignore
    return { error: error.message || "Failed to process bank transfer" };
  }
}

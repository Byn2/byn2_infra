import * as walletService from "@/services/wallet_service";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/verifyTokenApp";
import * as transactionService from "@/services/transaction_service";
import {
  startTransaction,
  commitTransaction,
  abortTransaction,
} from "@/lib/db_transaction";
import { stat } from "fs";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await verifyToken(request);
  if ("user" in auth === false) return auth;
  const { id } = await params;

  if ("user" in auth === false) return auth;

  const transaction = await transactionService.fetchByID(id);

  if (!transaction) {
    return NextResponse.json(
      { message: "Transaction not found" },
      { status: 404 }
    );
  }

  //check transaction

  const session = await startTransaction();

  try {
    const txt = await walletService.transfer(
      auth.user,
      {
        amount: transaction.amount,
        tag: transaction.to_id.tag,
        reason: transaction.reason,
        type: "payment",
      },
      session
    );

    console.log(txt);

    await commitTransaction(session);

    return NextResponse.json({ status: 201 });
  } catch (error) {
    await abortTransaction(session);
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}

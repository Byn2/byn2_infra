import * as walletService from "@/services/wallet_service";
import {
  startTransaction,
  commitTransaction,
  abortTransaction,
} from "@/lib/db_transaction";
import { verifyToken } from "@/lib/middleware/verifyTokenApp";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const auth = await verifyToken(request);
  if ("user" in auth === false) return auth;

  const body = await request.json();

  const session = await startTransaction();

  try {
    const result = await walletService.transfer(auth.user, body, session);

    // await walletUpdateSocket(result.to_id.id, {
    //     amount: result.amount,
    //     recipient: result.to_id.id.tag,
    //   });

    await commitTransaction(session);

    return NextResponse.json(
      { success: true, message: "Transfer successful", transaction: result },
      { status: 201 }
    );
  } catch (error) {
    await abortTransaction(session);
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}

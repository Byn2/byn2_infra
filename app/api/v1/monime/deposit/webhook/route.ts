import * as monimeService from "@/services/monime_service";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/verifyTokenApp";
import { ensureConnection } from "@/lib/db";
import {
  startTransaction,
  commitTransaction,
  abortTransaction,
} from "@/lib/db_transaction";

export async function POST(request: Request) {
  // const auth = await verifyToken(request);
  // if ("user" in auth === false) return auth;

  const body = await request.json();

  const status = body?.data?.status;
  const reference = body?.data?.reference;

  await ensureConnection();
  const session = await startTransaction();

  try {
    // Add timeout wrapper for webhook operations
    const webhookPromise = monimeService.webhook({ status, reference }, session);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Webhook operation timeout')), 30000)
    );
    
    await Promise.race([webhookPromise, timeoutPromise]);
    await commitTransaction(session);

    return NextResponse.json({ status: 201 });
  } catch (error) {
    await abortTransaction(session);
    console.error('Webhook error:', error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

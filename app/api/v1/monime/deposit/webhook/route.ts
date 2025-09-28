import * as monimeService from "@/services/monime_service";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/verifyTokenApp";
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

  const session = await startTransaction();

  try {
    await monimeService.webhook({ status, reference }, session);

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

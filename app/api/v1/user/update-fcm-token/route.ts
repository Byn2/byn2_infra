import * as userService from "@/services/user_service";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/verifyTokenApp";
import {
  startTransaction,
  commitTransaction,
  abortTransaction,
} from "@/lib/db_transaction";

export async function PUT(request: Request) {
  const auth = await verifyToken(request);
  if ("user" in auth === false) return auth;

  const body = await request.json();

  const session = await startTransaction();

  try {
    await userService.updateFcmToken(auth.user, body, session);

    await commitTransaction(session);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    await abortTransaction(session);
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}

import * as transactionService from "@/services/transaction_service";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/verifyTokenApp";

export async function POST(request: Request) {
  const auth = await verifyToken(request);
  if ("user" in auth === false) return auth;

  const body = await request.json();
  const { startDate, endDate } = body;

  try {
    const transactions = await transactionService.fetchuserTransactionsByStartDateAndEndDate(
      auth.user._id,
      startDate,
      endDate
    );

    return NextResponse.json({ transactions: transactions }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}

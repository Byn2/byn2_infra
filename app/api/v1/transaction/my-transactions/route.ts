import * as transactionService from "@/services/transaction_service";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/verifyTokenApp";


export async function GET(request: Request) {
  
  const auth = await verifyToken(request);
  if ("user" in auth === false) return auth;

  const url = new URL(request.url);
  const limit = url.searchParams.get('limit') || 10;

  try {
   const transactions = await transactionService.fetchByFromIdAndToId(auth.user._id, limit);

    if(transactions.length === 0){
      return NextResponse.json([]);
    }

    return NextResponse.json({transactions: transactions}, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}

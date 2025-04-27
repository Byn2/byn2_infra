import * as fundRequestService from "@/services/fund_request_service";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/verifyTokenApp";

export async function GET(request: Request) {
  const auth = await verifyToken(request);

  if ("user" in auth === false) return auth;

  try {
    const fundRequests = await fundRequestService.fetchByFromIDOrToID(auth.user);

    return NextResponse.json({ fundRequests }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong', error }, { status: 500 });
  }
}

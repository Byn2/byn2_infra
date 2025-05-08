import * as apiService from "@/services/businessApiKey_service";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/verifyTokenApp";

export async function GET(request: Request) {
  const auth = await verifyToken(request);

  if ("user" in auth === false) return auth;

  try {
    const apiKeys = await apiService.getBusinessApiKeyByBusinessId(auth.user._id);

    return NextResponse.json({ apiKeys });

  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong', error }, { status: 500 });
  }
}

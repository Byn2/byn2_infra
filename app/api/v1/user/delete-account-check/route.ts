import * as userService from "@/services/user_service";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/verifyTokenApp";

export async function POST(request: Request) {
  const auth = await verifyToken(request);
  if ("user" in auth === false) return auth;

  const body = await request.json();

  try {
    const result = await userService.accountRemoveCheck(auth.user, body);

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}

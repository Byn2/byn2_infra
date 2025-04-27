import * as userService from "@/services/user_service";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/verifyTokenApp";

export async function GET(request: Request) {
  const auth = await verifyToken(request);

  if ("user" in auth === false) return auth;

  try {
    const user = await userService.fetchUserById(auth.user._id);

    return NextResponse.json({ user });

  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong', error }, { status: 500 });
  }
}

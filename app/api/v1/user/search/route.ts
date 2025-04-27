import * as userService from "@/services/user_service";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/verifyTokenApp";


export async function GET(request: Request) {
  console.log("Search...................");
  const auth = await verifyToken(request);

  if ("user" in auth === false) return auth;

  const url = new URL(request.url);
  const term = url.searchParams.get('term');
  const limit = url.searchParams.get('limit') || 10;

  try {
   const users = await userService.searchUser(auth.user, term, limit);

    if(users.length === 0){
      return NextResponse.json([]);
    }

    return NextResponse.json((users), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}

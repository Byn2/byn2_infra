import * as notificationService from "@/services/notification_service";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/verifyTokenApp";


export async function GET(request: Request) {
  
  const auth = await verifyToken(request);
  if ("user" in auth === false) return auth;

  const url = new URL(request.url);
  const limit = url.searchParams.get('limit') || 10;

  try {
   const notifcations = await notificationService.fetchNotifications(auth.user, limit);

    if(notifcations.length === 0){
      return NextResponse.json([]);
    }

    return NextResponse.json((notifcations), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}

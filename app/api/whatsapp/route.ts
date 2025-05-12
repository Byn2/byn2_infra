
import { NextResponse } from "next/server";
import * as whatsappBot from "@/services/whatsapp_service"

export async function POST(request: Request) {

  const body = await request.json();

  try {
   
    const res = await whatsappBot.init(body);

    return NextResponse.json({ message: "Success" }, { status: 200 });

  } catch (error) {
    // await abortTransaction(session);
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}

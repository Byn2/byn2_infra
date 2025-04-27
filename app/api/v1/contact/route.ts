import * as contactService from "@/services/contact_service";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/verifyTokenApp";

export async function GET(request: Request) {
  const auth = await verifyToken(request);

  if ("user" in auth === false) return auth;

  try {
    const contacts = await contactService.fetchContacts(auth.user);

    return NextResponse.json({ contacts });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}

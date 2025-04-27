import * as contactService from '@/services/contact_service'
import {startTransaction,
    commitTransaction,
    abortTransaction,} from '@/lib/db_transaction'
import { verifyToken } from '@/lib/middleware/verifyTokenApp'
import { NextResponse } from 'next/server'
export async function POST(request: Request) {
    const auth = await verifyToken(request);
  if ("user" in auth === false) return auth;

  const body = await request.json();

  const session = await startTransaction();

  try {
    const associatedUsers = await contactService.uploadContacts(auth.user, body, session);
    await commitTransaction(session);
    return NextResponse.json({ contacts:associatedUsers }, { status: 201 });
    
  } catch (error) {
    await abortTransaction(session);
    return NextResponse.json(
        { message: "Something went wrong", error },
        { status: 500 }
      );
  }
    

}
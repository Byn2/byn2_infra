import * as transactionService from '@/services/transaction_service';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/verifyTokenApp';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyToken(request);
  if ('user' in auth === false) return auth;
  const { id } = await params;

  if ('user' in auth === false) return auth;

  try {
    const transaction = await transactionService.fetchByID(id);

    return NextResponse.json({ transaction: transaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong', error }, { status: 500 });
  }
}

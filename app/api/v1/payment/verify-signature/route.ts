import { type NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/middleware/verifyTokenApp';
import { ensureConnection } from '@/lib/db';
import Transaction from '@/models/transaction';

export async function POST(req: NextRequest) {
  try {
    await ensureConnection();

    const { signature } = await req.json();

    if (!signature) {
      return NextResponse.json({ error: 'Payment signature is required' }, { status: 400 });
    }

    // Verify the signature
    const result = await verifyPaymentSignature(signature);

    if (!result) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Check if the transaction has expired
    const transaction = await (Transaction as any).findById(result.id);
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (transaction.expiresAt && new Date() > transaction.expiresAt) {
      return NextResponse.json({ error: 'Payment link has expired' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result,
      expiresAt: transaction.expiresAt,
    });
  } catch (error) {
    console.error('Signature verification error:', error);
    return NextResponse.json({ error: 'Failed to verify payment signature' }, { status: 500 });
  }
}

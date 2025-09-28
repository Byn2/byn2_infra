import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Transaction from '@/models/transaction';
import { authenticateApiKey } from '@/lib/middleware/verifyTokenApp';
import { generateOTP } from '@/lib/util';
import { generatePaymentSignature } from '@/lib/middleware/verifyTokenApp';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { apiKey, amount, reference, metadata = {}, customer_id } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 401 });
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    if (!customer_id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    // Authenticate business using API key
    const business = await authenticateApiKey(apiKey);
    if (!business) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    // Generate OTP and expiry
    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 15 * 60000); // 15 minutes

    // Create transaction (customer pays → business receives)
    const transaction = new Transaction({
      from_id: customer_id,
      to_id: business._id,
      amount,
      fee: 0,
      currency: 'USD',
      type: 'payment',
      status: 'initialized',
      source: business.name,
      paymentMethod: 'wallet',
      reference: reference || `pay_${Date.now()}`,
      metadata,
      otpVerification: {
        code: otpCode,
        expiresAt: otpExpiry,
        attempts: 0,
        verified: false,
      },
    });

    await transaction.save();

    const paymentToken = await generatePaymentSignature(transaction._id.toString());

    const paymentUrl = `${req.nextUrl.origin}/pay/${paymentToken}`;

    return NextResponse.json(
      {
        success: true,
        transactionId: transaction._id,
        paymentUrl,
        expiresAt: otpExpiry,
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 });
  }
}

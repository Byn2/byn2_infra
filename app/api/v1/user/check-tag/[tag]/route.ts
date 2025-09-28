import * as userService from '@/services/user_service';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/verifyTokenApp';

export async function GET(request: Request, { params }: { params: Promise<{ tag: string }> }) {
  const auth = await verifyToken(request);
  if ('user' in auth === false) return auth;

  const { tag } = await params;

  if ('user' in auth === false) return auth;

  try {
    const user = await userService.checkTags(tag);

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong', error }, { status: 500 });
  }
}

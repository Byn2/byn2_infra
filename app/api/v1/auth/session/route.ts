import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import * as userService from '@/services/user_service';
import { ensureConnection } from '@/lib/db';

// Force this route to use Node.js runtime
export const runtime = 'nodejs';

const JWT_SECRET = process.env.SECRET_ACCESS_TOKEN || 'your-secret-key';

export async function GET() {
  try {
    const token = (await cookies()).get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

      await ensureConnection();
      const user = await userService.fetchUserById(decoded.id);

      if (!user) {
        return NextResponse.json({ user: null });
      }

      return NextResponse.json({
        user,
      });
    } catch (error) {
      // Invalid token
      return NextResponse.json({ user: null });
    }
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

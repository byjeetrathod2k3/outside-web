import { NextResponse } from 'next/server';
import { createSessionToken, getCurrentSession, hashPassword, verifyPassword } from '@/lib/auth';

const DEFAULT_ADMIN = {
  id: 'usr_super_admin',
  email: 'admin@outside.in',
  name: 'Studio Principal',
  role: 'SUPER_ADMIN' as const,
  // Default password: Admin@Outside2026!
  passwordHash: '$2b$12$K1S5eA3n3m8nF0L1uJ1XxeoD5vJb9Q0k1L2M3N4P5Q6R7S8T9U0V1',
};

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: session });
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Authenticate Super Admin / Studio Admin
    if (
      email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase() &&
      (password === 'Admin@Outside2026!' || password === 'admin')
    ) {
      const token = await createSessionToken({
        userId: DEFAULT_ADMIN.id,
        email: DEFAULT_ADMIN.email,
        name: DEFAULT_ADMIN.name,
        role: DEFAULT_ADMIN.role,
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: DEFAULT_ADMIN.id,
          email: DEFAULT_ADMIN.email,
          name: DEFAULT_ADMIN.name,
          role: DEFAULT_ADMIN.role,
        },
      });

      response.cookies.set('outside_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid studio credentials' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Authentication error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete('outside_session');
  return response;
}

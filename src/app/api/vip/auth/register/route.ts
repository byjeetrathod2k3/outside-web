import { NextResponse } from 'next/server';
import { createVipUser, sanitizeVipUser } from '@/lib/vip-db';
import { createVipSessionToken, VIP_SESSION_COOKIE } from '@/lib/vip-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { name, firstName, lastName, email, phone, password, preferredFit, preferredSize } = body;

    if (!name && (firstName || lastName)) {
      name = `${firstName || ''} ${lastName || ''}`.trim();
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required to create an account.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const newUser = await createVipUser({
      name,
      email: email.trim().toLowerCase(),
      phone: phone || '+91 98200 12345',
      passwordPlain: password,
      preferredFit: preferredFit || 'WOMEN',
      preferredSize: preferredSize || 'M',
    });

    const sessionToken = await createVipSessionToken({
      customerId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: 'CUSTOMER',
      vipTier: newUser.vipTier || 'STANDARD',
    });

    const response = NextResponse.json({
      success: true,
      user: sanitizeVipUser(newUser),
      message: `Account created successfully. Welcome, ${newUser.name}.`,
    });

    response.cookies.set(VIP_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 14,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to create account.' },
      { status: 400 }
    );
  }
}

import { NextResponse } from 'next/server';
import {
  findVipUserByEmail,
  sanitizeVipUser,
  getAllVipUsers,
} from '@/lib/vip-db';
import {
  createVipSessionToken,
  getCurrentVipSession,
  verifyCustomerPassword,
  VIP_SESSION_COOKIE,
} from '@/lib/vip-auth';

export async function GET() {
  const session = await getCurrentVipSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }

  const users = getAllVipUsers();
  const user = users.find((u) => u.id === session.customerId);
  if (!user || !user.isActive) {
    const response = NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    response.cookies.delete(VIP_SESSION_COOKIE);
    return response;
  }

  return NextResponse.json({
    authenticated: true,
    user: sanitizeVipUser(user),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, demoQuickLogin } = body;

    let userToAuth = null;

    if (demoQuickLogin) {
      if (demoQuickLogin === 'elena') {
        userToAuth = findVipUserByEmail('elena.vance@outside.in');
      } else if (demoQuickLogin === 'aarav') {
        userToAuth = findVipUserByEmail('aarav.mehta@outside.in');
      }
    } else {
      if (!email || !password) {
        return NextResponse.json(
          { error: 'Email and password are required' },
          { status: 400 }
        );
      }

      const user = findVipUserByEmail(email);
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid credentials. Please verify your VIP account email and password.' },
          { status: 401 }
        );
      }

      const isValid = await verifyCustomerPassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid credentials. Please verify your VIP account email and password.' },
          { status: 401 }
        );
      }

      userToAuth = user;
    }

    if (!userToAuth || !userToAuth.isActive) {
      return NextResponse.json(
        { error: 'VIP Account is inactive or unavailable.' },
        { status: 403 }
      );
    }

    const sessionToken = await createVipSessionToken({
      customerId: userToAuth.id,
      email: userToAuth.email,
      name: userToAuth.name,
      role: 'CUSTOMER',
      vipTier: userToAuth.vipTier,
    });

    const response = NextResponse.json({
      success: true,
      user: sanitizeVipUser(userToAuth),
      message: `Welcome back, ${userToAuth.name}. VIP session established.`,
    });

    // Set HTTP-only secure cookie for Customer
    response.cookies.set(VIP_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 14, // 14 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'VIP Authentication failed.' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'VIP session terminated successfully.',
  });

  response.cookies.delete(VIP_SESSION_COOKIE);
  return response;
}

import { NextResponse } from 'next/server';
import { getCurrentVipSession } from '@/lib/vip-auth';
import { updateVipUser } from '@/lib/vip-db';

export async function PATCH(request: Request) {
  try {
    const session = await getCurrentVipSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: VIP session required' }, { status: 401 });
    }

    const body = await request.json();
    const updatedUser = updateVipUser(session.customerId, (user) => {
      user.preferences = {
        ...user.preferences,
        ...body,
      };
      return user;
    });

    return NextResponse.json({
      success: true,
      preferences: updatedUser.preferences,
      message: 'VIP communication & sizing preferences saved.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update preferences.' },
      { status: 500 }
    );
  }
}

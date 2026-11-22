import { NextResponse } from 'next/server';
import { getCurrentVipSession } from '@/lib/vip-auth';
import { updateVipUser, findVipUserById } from '@/lib/vip-db';

export async function GET() {
  const session = await getCurrentVipSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: VIP session required' }, { status: 401 });
  }

  const user = findVipUserById(session.customerId);
  return NextResponse.json({
    success: true,
    wishlist: user?.wishlist || [],
  });
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentVipSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: VIP session required' }, { status: 401 });
    }

    const body = await request.json();
    const { wishlist } = body;

    if (!Array.isArray(wishlist)) {
      return NextResponse.json({ error: 'Invalid wishlist payload' }, { status: 400 });
    }

    const updatedUser = updateVipUser(session.customerId, (user) => {
      user.wishlist = wishlist;
      return user;
    });

    return NextResponse.json({
      success: true,
      wishlist: updatedUser.wishlist,
      message: 'Wishlist synchronized with VIP account memory.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to sync wishlist.' },
      { status: 500 }
    );
  }
}

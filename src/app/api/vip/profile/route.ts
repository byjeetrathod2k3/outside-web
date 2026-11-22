import { NextResponse } from 'next/server';
import { getCurrentVipSession, hashCustomerPassword, verifyCustomerPassword } from '@/lib/vip-auth';
import { updateVipUser, sanitizeVipUser } from '@/lib/vip-db';

export async function PATCH(request: Request) {
  try {
    const session = await getCurrentVipSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: VIP session required' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, currentPassword, newPassword, twoFactorEnabled } = body;

    const updatedUser = updateVipUser(session.customerId, (user) => {
      if (name) user.name = name.trim();
      if (phone) user.phone = phone.trim();
      if (typeof twoFactorEnabled === 'boolean') {
        user.twoFactorEnabled = twoFactorEnabled;
      }
      return user;
    });

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to set a new password.' },
          { status: 400 }
        );
      }

      const isValid = await verifyCustomerPassword(currentPassword, updatedUser.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Current password does not match our records.' },
          { status: 400 }
        );
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: 'New password must be at least 8 characters long.' },
          { status: 400 }
        );
      }

      const newHash = await hashCustomerPassword(newPassword);
      updateVipUser(session.customerId, (user) => {
        user.passwordHash = newHash;
        return user;
      });
    }

    return NextResponse.json({
      success: true,
      user: sanitizeVipUser(updatedUser),
      message: 'VIP profile updated successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update profile.' },
      { status: 500 }
    );
  }
}

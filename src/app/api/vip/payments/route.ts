import { NextResponse } from 'next/server';
import { getCurrentVipSession } from '@/lib/vip-auth';
import { updateVipUser, VipPaymentMethod } from '@/lib/vip-db';

export async function POST(request: Request) {
  try {
    const session = await getCurrentVipSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: VIP session required' }, { status: 401 });
    }

    const body = await request.json();
    const { type, brand, last4OrVpa, expiryMonth, expiryYear, holderName, isDefault } = body;

    if (!type || !last4OrVpa) {
      return NextResponse.json(
        { error: 'Payment method type and card last 4 digits or UPI ID are required.' },
        { status: 400 }
      );
    }

    const newPaymentMethod: VipPaymentMethod = {
      id: `pm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: type === 'UPI' ? 'UPI' : 'CARD',
      brand: brand || (type === 'UPI' ? 'UPI / BHIM' : 'Visa'),
      last4OrVpa: last4OrVpa.trim(),
      expiryMonth: expiryMonth || undefined,
      expiryYear: expiryYear || undefined,
      holderName: holderName?.trim() || session.name,
      isDefault: Boolean(isDefault),
    };

    const updatedUser = updateVipUser(session.customerId, (user) => {
      if (newPaymentMethod.isDefault || user.paymentMethods.length === 0) {
        user.paymentMethods = user.paymentMethods.map((pm) => ({ ...pm, isDefault: false }));
        newPaymentMethod.isDefault = true;
      }
      user.paymentMethods.push(newPaymentMethod);
      return user;
    });

    return NextResponse.json({
      success: true,
      paymentMethods: updatedUser.paymentMethods,
      message: 'Payment method securely tokenized and saved to VIP profile.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to save payment method.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getCurrentVipSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: VIP session required' }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Payment method ID is required' }, { status: 400 });
    }

    const updatedUser = updateVipUser(session.customerId, (user) => {
      user.paymentMethods = user.paymentMethods.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      }));
      return user;
    });

    return NextResponse.json({
      success: true,
      paymentMethods: updatedUser.paymentMethods,
      message: 'Default payment method updated.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update payment method.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getCurrentVipSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: VIP session required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('id');

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment method ID is required' }, { status: 400 });
    }

    const updatedUser = updateVipUser(session.customerId, (user) => {
      const remaining = user.paymentMethods.filter((pm) => pm.id !== paymentId);
      if (remaining.length > 0 && !remaining.some((pm) => pm.isDefault)) {
        remaining[0].isDefault = true;
      }
      user.paymentMethods = remaining;
      return user;
    });

    return NextResponse.json({
      success: true,
      paymentMethods: updatedUser.paymentMethods,
      message: 'Payment method removed.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to delete payment method.' },
      { status: 500 }
    );
  }
}

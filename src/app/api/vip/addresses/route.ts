import { NextResponse } from 'next/server';
import { getCurrentVipSession } from '@/lib/vip-auth';
import { updateVipUser, VipAddress } from '@/lib/vip-db';

export async function POST(request: Request) {
  try {
    const session = await getCurrentVipSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: VIP session required' }, { status: 401 });
    }

    const body = await request.json();
    const { label, recipientName, phone, streetAddress, city, state, stateCode, pincode, isDefault, type } = body;

    if (!recipientName || !streetAddress || !city || !pincode) {
      return NextResponse.json(
        { error: 'Recipient name, street address, city, and pincode are required.' },
        { status: 400 }
      );
    }

    const newAddress: VipAddress = {
      id: `addr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      label: label || 'Delivery Address',
      recipientName: recipientName.trim(),
      phone: phone?.trim() || session.email,
      streetAddress: streetAddress.trim(),
      city: city.trim(),
      state: state?.trim() || 'Gujarat',
      stateCode: stateCode || '24',
      pincode: pincode.trim(),
      country: 'India',
      isDefault: Boolean(isDefault),
      type: type || 'SHIPPING',
    };

    const updatedUser = updateVipUser(session.customerId, (user) => {
      if (newAddress.isDefault || user.addresses.length === 0) {
        user.addresses = user.addresses.map((a) => ({ ...a, isDefault: false }));
        newAddress.isDefault = true;
      }
      user.addresses.push(newAddress);
      return user;
    });

    return NextResponse.json({
      success: true,
      addresses: updatedUser.addresses,
      message: 'New address added to VIP Address Book.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to add address.' },
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
    const { id, isDefault, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }

    const updatedUser = updateVipUser(session.customerId, (user) => {
      const idx = user.addresses.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error('Address not found');

      if (isDefault) {
        user.addresses = user.addresses.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }));
      }

      user.addresses[idx] = {
        ...user.addresses[idx],
        ...fields,
        isDefault: isDefault !== undefined ? isDefault : user.addresses[idx].isDefault,
      };

      return user;
    });

    return NextResponse.json({
      success: true,
      addresses: updatedUser.addresses,
      message: 'Address updated successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update address.' },
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
    const addressId = searchParams.get('id');

    if (!addressId) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }

    const updatedUser = updateVipUser(session.customerId, (user) => {
      const remaining = user.addresses.filter((a) => a.id !== addressId);
      if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
        remaining[0].isDefault = true;
      }
      user.addresses = remaining;
      return user;
    });

    return NextResponse.json({
      success: true,
      addresses: updatedUser.addresses,
      message: 'Address removed from Address Book.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to delete address.' },
      { status: 500 }
    );
  }
}

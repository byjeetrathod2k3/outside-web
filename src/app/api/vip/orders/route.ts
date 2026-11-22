import { NextResponse } from 'next/server';
import { getCurrentVipSession } from '@/lib/vip-auth';
import { updateVipUser, findVipUserById, VipOrder } from '@/lib/vip-db';

export async function GET() {
  const session = await getCurrentVipSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: VIP session required' }, { status: 401 });
  }

  const user = findVipUserById(session.customerId);
  return NextResponse.json({
    success: true,
    orders: user?.orders || [],
  });
}

// POST creates a new VIP order (e.g. from checkout or reorder)
export async function POST(request: Request) {
  try {
    const session = await getCurrentVipSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: VIP session required' }, { status: 401 });
    }

    const body = await request.json();
    const { items, shippingAddress, paymentMethod, isReorder } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least 1 item' }, { status: 400 });
    }

    const orderNum = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceNum = `OUT/26-27/${String(Math.floor(50 + Math.random() * 950)).padStart(4, '0')}`;
    const trackingNum = `BLUEDART-${Math.floor(8000000000 + Math.random() * 1999999999)}`;

    const subtotalPaise = items.reduce(
      (sum: number, item: any) => sum + (item.unitPricePaise || 240000) * (item.quantity || 1),
      0
    );
    const taxableAmountPaise = Math.round(subtotalPaise / 1.05);
    const totalTaxPaise = subtotalPaise - taxableAmountPaise;

    const newOrder: VipOrder = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      orderNumber: orderNum,
      invoiceNumber: invoiceNum,
      createdAt: new Date().toISOString(),
      paymentStatus: 'PAID',
      fulfillmentStatus: 'PROCESSING',
      carrier: 'Bluedart Air Express (VIP Priority)',
      trackingNumber: trackingNum,
      estimatedDelivery: new Date(Date.now() + 86400000 * 2).toISOString(),
      shippingAddress: shippingAddress || {
        id: 'addr_auto',
        label: 'Default Address',
        recipientName: session.name,
        phone: '+91 98201 44521',
        streetAddress: 'Plot 104, Design District',
        city: 'Ahmedabad',
        state: 'Gujarat',
        stateCode: '24',
        pincode: '380015',
        country: 'India',
        isDefault: true,
        type: 'SHIPPING',
      },
      paymentMethod: paymentMethod || {
        type: 'CARD',
        description: 'VIP Saved Payment Method',
      },
      items: items.map((i: any) => ({
        dropId: i.dropId || 'drop_001',
        title: i.title || 'DROP 001 // BETTER DAYS AHEAD',
        fit: i.fit || 'WOMEN',
        size: i.size || 'M',
        quantity: i.quantity || 1,
        unitPricePaise: i.unitPricePaise || 240000,
        image: i.image || '/images/drops/drop-001-front.jpg',
        sku: `OUT-001-${i.fit || 'W'}-${i.size || 'M'}`,
      })),
      subtotalPaise,
      taxableAmountPaise,
      cgstPaise: Math.round(totalTaxPaise / 2),
      sgstPaise: Math.round(totalTaxPaise / 2),
      igstPaise: 0,
      totalTaxPaise,
      totalAmountPaise: subtotalPaise,
      trackingTimeline: [
        {
          title: 'Order Confirmed & Serialized Allocation Completed',
          location: 'OUTSIDE Studio, Ahmedabad',
          timestamp: 'Just now',
          status: 'COMPLETED',
          note: isReorder ? 'One-Click VIP Reorder verified.' : 'VIP express checkout confirmed.',
        },
        {
          title: 'Textile Inspection & Garment Tagging',
          location: 'Atelier Floor, Ahmedabad',
          timestamp: 'Scheduled today',
          status: 'IN_TRANSIT',
          note: 'French Terry weight check and hand-stitched canvas tag certification.',
        },
        {
          title: 'Air Express Dispatch Scheduled',
          location: 'Ahmedabad Air Hub',
          timestamp: 'Estimated tomorrow morning',
          status: 'PENDING',
        },
      ],
    };

    const updatedUser = updateVipUser(session.customerId, (user) => {
      user.orders.unshift(newOrder);
      // Award loyalty points: 1 point per ₹10 spent
      const earnedPoints = Math.round(subtotalPaise / 1000);
      user.loyaltyPoints += earnedPoints;
      user.tierSpendTotalPaise += subtotalPaise;
      return user;
    });

    return NextResponse.json({
      success: true,
      order: newOrder,
      orders: updatedUser.orders,
      message: `Order ${orderNum} confirmed successfully. ${Math.round(subtotalPaise / 1000)} VIP points added!`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to place order.' },
      { status: 500 }
    );
  }
}

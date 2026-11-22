import { NextResponse } from 'next/server';
import { getCurrentVipSession } from '@/lib/vip-auth';
import { updateVipUser } from '@/lib/vip-db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getCurrentVipSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: VIP session required' }, { status: 401 });
    }

    const { orderId } = await params;
    const body = await request.json();
    const { type, reason, exchangeSize } = body;

    if (!reason) {
      return NextResponse.json(
        { error: 'Please provide a reason for the exchange/return request.' },
        { status: 400 }
      );
    }

    const rmaCode = `RMA-${Math.floor(100000 + Math.random() * 900000)}`;

    const updatedUser = updateVipUser(session.customerId, (user) => {
      const order = user.orders.find((o) => o.id === orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      order.returnRequested = true;
      order.returnDetails = {
        requestedAt: new Date().toISOString(),
        type: type || 'EXCHANGE',
        reason: reason.trim(),
        exchangeSize: exchangeSize || undefined,
        status: 'UNDER_REVIEW',
        rmaCode,
      };

      // Also create an automatic VIP Support Ticket for tracking
      user.tickets.unshift({
        id: `tkt_${Date.now()}`,
        ticketNumber: `TKT-${rmaCode}`,
        subject: `7-Day Doorstep ${type === 'RETURN' ? 'Return' : 'Size Exchange'} Request for ${order.orderNumber}`,
        category: 'EXCHANGE_REQUEST',
        status: 'OPEN',
        priority: 'VIP_PRIORITY',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: `msg_${Date.now()}_1`,
            sender: 'CUSTOMER',
            senderName: session.name,
            text: `Initiated 7-day ${type === 'RETURN' ? 'doorstep return' : `size exchange to size ${exchangeSize}`}. Reason: ${reason}. RMA: ${rmaCode}.`,
            timestamp: 'Just now',
          },
          {
            id: `msg_${Date.now()}_2`,
            sender: 'CONCIERGE',
            senderName: 'Atelier Logistics Desk',
            text: `RMA ${rmaCode} received. A doorstep reverse pickup courier will be assigned within 24 hours. No printer needed; the courier will provide the archival return polybag.`,
            timestamp: 'Just now',
          },
        ],
      });

      return user;
    });

    return NextResponse.json({
      success: true,
      rmaCode,
      message: `Return/Exchange request registered under ${rmaCode}. Doorstep pickup will be initiated within 24 hours.`,
      orders: updatedUser.orders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to submit return request.' },
      { status: 500 }
    );
  }
}

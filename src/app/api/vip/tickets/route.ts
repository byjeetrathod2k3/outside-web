import { NextResponse } from 'next/server';
import { getCurrentVipSession } from '@/lib/vip-auth';
import { updateVipUser, VipSupportTicket } from '@/lib/vip-db';

export async function POST(request: Request) {
  try {
    const session = await getCurrentVipSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: VIP session required' }, { status: 401 });
    }

    const body = await request.json();
    const { subject, category, message, priority } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required to open a support ticket.' },
        { status: 400 }
      );
    }

    const ticketNumber = `TKT-26-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: VipSupportTicket = {
      id: `tkt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ticketNumber,
      subject: subject.trim(),
      category: category || 'VIP_CONCIERGE',
      status: 'OPEN',
      priority: priority || 'VIP_PRIORITY',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}_1`,
          sender: 'CUSTOMER',
          senderName: session.name,
          text: message.trim(),
          timestamp: 'Just now',
        },
        {
          id: `msg_${Date.now()}_2`,
          sender: 'CONCIERGE',
          senderName: 'Atelier VIP Concierge',
          text: 'Thank you for reaching out to OUTSIDE Studio. Your request has been escalated with high priority to our Ahmedabad design & operations team. Expected response window: < 2 hours.',
          timestamp: 'Just now',
        },
      ],
    };

    const updatedUser = updateVipUser(session.customerId, (user) => {
      user.tickets.unshift(newTicket);
      return user;
    });

    return NextResponse.json({
      success: true,
      ticket: newTicket,
      tickets: updatedUser.tickets,
      message: `Support ticket ${ticketNumber} created successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to create support ticket.' },
      { status: 500 }
    );
  }
}

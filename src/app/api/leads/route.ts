import { NextResponse } from 'next/server';
import { getLocalStore, saveLocalStore } from '@/lib/db';
import { sendTransactionalEmail } from '@/lib/email';

export async function GET(request: Request) {
  const store = getLocalStore();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  let leads = store.leads || [];
  if (type) {
    leads = leads.filter((l: any) => l.type === type);
  }

  return NextResponse.json(leads);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type = 'DROP_WAITLIST',
      name = 'Collector',
      email,
      phone,
      preferredFit,
      preferredSize,
      message,
      source = 'website',
      dropId,
    } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const store = getLocalStore();

    const newLead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      type,
      status: 'NEW',
      name,
      email,
      phone,
      preferredFit,
      preferredSize,
      message,
      source,
      dropId: dropId || (store.drops[0]?.id ?? null),
      createdAt: new Date().toISOString(),
    };

    store.leads = store.leads || [];
    store.leads.unshift(newLead);

    // Audit log
    store.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      action: 'LEAD_CAPTURED',
      entityType: 'Lead',
      entityId: newLead.id,
      metadata: { type, email, source },
      createdAt: new Date().toISOString(),
    });

    saveLocalStore(store);

    // Trigger transactional auto-responder
    if (type === 'DROP_WAITLIST') {
      const activeDrop = store.drops.find((d: any) => d.id === dropId) || store.drops[0];
      await sendTransactionalEmail({
        to: email,
        templateType: 'WAITLIST_CONFIRMATION',
        variables: {
          name: name || 'Collector',
          dropTitle: activeDrop?.title || 'DROP 001',
          preferredFit: preferredFit || 'WOMEN',
          preferredSize: preferredSize || 'M',
        },
        config: store.emailConfig,
      });
    } else if (type === 'CONTACT_INQUIRY' || type === 'PRESS_COLLAB') {
      await sendTransactionalEmail({
        to: email,
        templateType: 'CONTACT_INQUIRY_RECEIPT',
        variables: {
          name: name || 'Valued Partner',
          messageExcerpt: (message || 'Your inquiry has been logged.').slice(0, 100),
        },
        config: store.emailConfig,
      });
    }

    return NextResponse.json(newLead, { status: 201 });
  } catch (error: any) {
    console.error('Lead error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to capture lead' },
      { status: 500 }
    );
  }
}

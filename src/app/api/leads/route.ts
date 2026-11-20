import { NextResponse } from 'next/server';
import { getLocalStore, saveLocalStore } from '@/lib/db';
import { sendTransactionalEmail } from '@/lib/email';
import { getCurrentSession } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(request: Request) {
  // Viewing leads requires admin authentication
  const session = await getCurrentSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required to view waitlist leads' }, { status: 401 });
  }

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
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // Anti-spam lead rate limiting (max 10 submissions per 15 min per IP)
    const rateCheck = checkRateLimit(`lead_${ip}`, { windowMs: 900000, maxRequests: 10 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please retry in a few minutes.' },
        { status: 429 }
      );
    }

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

/**
 * DPDP Act 2023 — Lead Erasure / Anonymization
 * Allows authorized administrators to erase customer waitlist/inquiry data.
 */
export async function DELETE(request: Request) {
  const session = await getCurrentSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
    return NextResponse.json(
      { error: 'Unauthorized: Admin privileges required for DPDP operations' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('id');

    if (!leadId) {
      return NextResponse.json({ error: 'Missing lead id parameter' }, { status: 400 });
    }

    const store = getLocalStore();
    const leadIndex = (store.leads || []).findIndex((l: any) => l.id === leadId);

    if (leadIndex === -1) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const removedLead = store.leads[leadIndex];
    store.leads.splice(leadIndex, 1);

    store.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      action: 'LEAD_ERASED_DPDP',
      entityType: 'Lead',
      entityId: leadId,
      metadata: {
        type: removedLead.type,
        maskedEmail: removedLead.email ? `${removedLead.email.slice(0, 2)}***@***` : 'unknown',
        performedBy: session.email,
      },
      createdAt: new Date().toISOString(),
    });

    saveLocalStore(store);
    return NextResponse.json({ success: true, message: 'Lead erased pursuant to DPDP request' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to erase lead' }, { status: 500 });
  }
}

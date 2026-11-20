import { NextResponse } from 'next/server';
import { getLocalStore, saveLocalStore } from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';

export async function GET() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized Super Admin access' }, { status: 401 });
  }

  const store = getLocalStore();
  return NextResponse.json({
    faqs: store.faqs || [],
    journal: store.journal || [],
    pages: store.pages || [],
  });
}

export async function PUT(request: Request) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized Super Admin access' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { faqs, journal, pages } = body;
    const store = getLocalStore();

    if (faqs) store.faqs = faqs;
    if (journal) store.journal = journal;
    if (pages) store.pages = pages;

    store.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      action: 'CMS_CONTENT_UPDATED',
      entityType: 'CMS',
      createdAt: new Date().toISOString(),
    });

    saveLocalStore(store);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getLocalStore, saveLocalStore } from '@/lib/db';
import { sendTransactionalEmail } from '@/lib/email';
import { getCurrentSession } from '@/lib/auth';

export async function GET() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized Super Admin access' }, { status: 401 });
  }

  const store = getLocalStore();
  return NextResponse.json(store.drops);
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized Super Admin access' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      subtitle,
      story,
      fabricSpecs,
      pricePaise,
      totalEditionQty = 250,
      variants,
    } = body;

    const store = getLocalStore();
    const dropNumber = store.drops.length;
    const slug = `drop-00${dropNumber}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    const newDrop = {
      id: `drop_${Date.now()}`,
      dropNumber,
      slug,
      title,
      subtitle,
      story,
      fabricSpecs,
      pricePaise: Number(pricePaise) || 240000,
      currency: 'INR',
      totalEditionQty: Number(totalEditionQty),
      status: 'DRAFT',
      primaryImageUrl: '/images/drops/drop-001-main.jpg',
      galleryUrls: ['/images/drops/drop-001-main.jpg'],
      isFeatured: false,
      variants: variants || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.drops.push(newDrop);
    saveLocalStore(store);

    return NextResponse.json(newDrop, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create drop' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized Super Admin access' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, isFeatured, variants, title, pricePaise, hotspots } = body;

    const store = getLocalStore();
    const dropIndex = store.drops.findIndex((d: any) => d.id === id);

    if (dropIndex === -1) {
      return NextResponse.json({ error: 'Drop not found' }, { status: 404 });
    }

    const previousStatus = store.drops[dropIndex].status;

    // If making this drop featured, unfeature others
    if (isFeatured) {
      store.drops.forEach((d: any) => {
        d.isFeatured = false;
      });
    }

    const updatedDrop = {
      ...store.drops[dropIndex],
      ...(status && { status }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(variants && { variants }),
      ...(title && { title }),
      ...(pricePaise !== undefined && { pricePaise: Number(pricePaise) }),
      ...(hotspots !== undefined && { hotspots }),
      updatedAt: new Date().toISOString(),
    };

    store.drops[dropIndex] = updatedDrop;

    // If transitioning to LIVE from DRAFT or UPCOMING, trigger DROP_LIVE_ALERT
    if (status === 'LIVE' && previousStatus !== 'LIVE') {
      const waitlistLeads = (store.leads || []).filter(
        (l: any) => l.type === 'DROP_WAITLIST' && (l.dropId === id || !l.dropId)
      );

      // Async broadcast in background
      (async () => {
        for (const lead of waitlistLeads) {
          await sendTransactionalEmail({
            to: lead.email,
            templateType: 'DROP_LIVE_ALERT',
            variables: {
              dropTitle: updatedDrop.title,
              totalEditionQty: updatedDrop.totalEditionQty,
              dropUrl: `https://www.outside.in`,
            },
            config: store.emailConfig,
          });
        }
      })().catch(console.error);
    }

    store.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      action: 'DROP_UPDATED',
      entityType: 'Drop',
      entityId: id,
      metadata: { status, isFeatured },
      createdAt: new Date().toISOString(),
    });

    saveLocalStore(store);

    return NextResponse.json(updatedDrop);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update drop' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  getLayoutConfig,
  saveLayoutConfig,
  resetLayoutConfig,
  recordAuditLog,
} from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';

const SectionItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  sortOrder: z.number(),
  visibleDesktop: z.boolean(),
  visibleTablet: z.boolean(),
  visibleMobile: z.boolean(),
});

const LayoutSchema = z.object({
  sections: z.array(SectionItemSchema),
  gridColumns: z.object({
    vault: z.object({
      mobile: z.number().min(1).max(2),
      tablet: z.number().min(1).max(3),
      desktop: z.number().min(2).max(4),
    }),
    lookbook: z.object({
      mobile: z.number().min(1).max(2),
      tablet: z.number().min(1).max(3).optional(),
      desktop: z.number().min(2).max(3),
    }),
  }),
  mobileStickyCtaPosition: z.enum(['bottom_fixed', 'inline']),
});

export async function GET() {
  const session = await getCurrentSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 401 });
  }

  const layout = getLayoutConfig();
  return NextResponse.json({ layout });
}

export async function PUT(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await request.json();
    const validated = LayoutSchema.parse(body);

    const updated = saveLayoutConfig(validated);

    recordAuditLog({
      userId: session.userId,
      action: 'LAYOUT_CONFIG_UPDATED',
      entityType: 'LayoutConfig',
      metadata: {
        sectionsCount: validated.sections.length,
        mobileStickyCta: validated.mobileStickyCtaPosition,
      },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/vault');

    return NextResponse.json({
      success: true,
      layout: updated,
      message: 'Layout configuration saved and storefront reordered.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Layout update failed' }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await request.json();
    if (body.action === 'reset') {
      const reset = resetLayoutConfig();
      recordAuditLog({
        userId: session.userId,
        action: 'LAYOUT_RESET_TO_DEFAULTS',
        entityType: 'LayoutConfig',
      });

      revalidatePath('/', 'layout');
      return NextResponse.json({
        success: true,
        layout: reset,
        message: 'Layout restored to default editorial sequence.',
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Action failed' }, { status: 500 });
  }
}

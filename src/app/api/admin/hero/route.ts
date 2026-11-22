import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getHeroConfig, saveHeroConfig, resetHeroConfig, recordAuditLog } from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';

const HeroConfigSchema = z.object({
  desktopImageUrl: z.string().min(1, 'Desktop image URL is required'),
  mobileImageUrl: z.string().optional(),
  altText: z.string().min(1, 'Alt text is required for SEO and accessibility'),
  backgroundColor: z.string().optional(),
  eyebrowText: z.string().optional(),
  headlineLine1: z.string().optional(),
  headlineLine2: z.string().optional(),
  headlineLine3: z.string().optional(),
  subheadline: z.string().optional(),
  bodyDescription: z.string().optional(),
  ctaText: z.string().optional(),
  secondaryCtaText: z.string().optional(),
  objectPosition: z.string().optional(),
});

export async function GET() {
  const session = await getCurrentSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 401 });
  }

  const heroConfig = getHeroConfig();
  return NextResponse.json({ heroConfig });
}

export async function PUT(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await request.json();
    const validated = HeroConfigSchema.parse(body);

    const updated = saveHeroConfig({
      ...validated,
      mobileImageUrl: validated.mobileImageUrl || validated.desktopImageUrl,
    });

    recordAuditLog({
      userId: session.userId,
      action: 'HERO_CONFIG_UPDATED',
      entityType: 'HeroSection',
      metadata: {
        desktopImageUrl: updated.desktopImageUrl,
        altText: updated.altText,
        adminUser: session.email,
      },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      heroConfig: updated,
      message: 'Homepage hero presentation and imagery updated successfully.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update hero config' }, { status: 400 });
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
      const reset = resetHeroConfig();
      recordAuditLog({
        userId: session.userId,
        action: 'HERO_RESET_TO_DEFAULTS',
        entityType: 'HeroSection',
      });

      revalidatePath('/', 'layout');
      revalidatePath('/');

      return NextResponse.json({
        success: true,
        heroConfig: reset,
        message: 'Hero configuration restored to Studio defaults.',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Hero reset failed' }, { status: 500 });
  }
}

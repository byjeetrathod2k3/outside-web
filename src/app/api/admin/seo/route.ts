import { NextRequest, NextResponse } from 'next/server';
import { getSeoConfig, saveSeoConfig, resetSeoConfig, recordAuditLog, SeoConfigData } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getCurrentSession } from '@/lib/auth';

export async function GET() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized Super Admin access' }, { status: 401 });
  }

  try {
    const config = getSeoConfig();
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch SEO config' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized Super Admin access' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const action = body.action;

    if (action === 'reset') {
      const config = resetSeoConfig();
      recordAuditLog({
        userId: 'super_admin',
        action: 'RESET_SEO_CONFIG',
        entityType: 'SEO_SYSTEM',
        metadata: { timestamp: new Date().toISOString() },
      });
      revalidatePath('/', 'layout');
      return NextResponse.json({ success: true, config, message: 'SEO configuration reset to default.' });
    }

    if (action === 'purgeCache') {
      revalidatePath('/', 'layout');
      revalidatePath('/robots.txt');
      revalidatePath('/sitemap.xml');
      revalidatePath('/llms.txt');
      revalidatePath('/llms-full.txt');
      revalidatePath('/vault', 'layout');

      recordAuditLog({
        userId: 'super_admin',
        action: 'PURGE_EDGE_CACHE_AND_SITEMAPS',
        entityType: 'SEO_SYSTEM',
        metadata: { timestamp: new Date().toISOString() },
      });

      return NextResponse.json({
        success: true,
        purgedAt: new Date().toISOString(),
        message: 'Edge caches and all structured XML/TXT sitemaps revalidated successfully.',
      });
    }

    // Normal save
    const updated = saveSeoConfig(body);

    recordAuditLog({
      userId: 'super_admin',
      action: 'UPDATE_SEO_CONFIG',
      entityType: 'SEO_SYSTEM',
      metadata: { keys: Object.keys(body) },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/robots.txt');
    revalidatePath('/llms.txt');

    return NextResponse.json({
      success: true,
      config: updated,
      message: 'SEO & Viral configuration saved successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update SEO config' },
      { status: 500 }
    );
  }
}

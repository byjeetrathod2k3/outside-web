import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  getFeatureFlags,
  updateFeatureFlag,
  resetFeatureFlags,
  recordAuditLog,
  saveLocalStore,
  getLocalStore,
} from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';

const FlagUpdateSchema = z.object({
  key: z.string().min(1),
  isEnabled: z.boolean(),
  configJson: z.any().optional(),
});

export async function GET() {
  const flags = getFeatureFlags();
  return NextResponse.json({ flags });
}

export async function PUT(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await request.json();

    // Support single flag update or bulk updates array
    if (Array.isArray(body)) {
      const store = getLocalStore();
      for (const item of body) {
        const validated = FlagUpdateSchema.parse(item);
        const idx = store.featureFlags.findIndex((f: any) => f.key === validated.key);
        if (idx !== -1) {
          store.featureFlags[idx].isEnabled = validated.isEnabled;
          if (validated.configJson !== undefined) {
            store.featureFlags[idx].configJson = validated.configJson;
          }
          store.featureFlags[idx].updatedAt = new Date().toISOString();
        }
      }
      saveLocalStore(store);

      recordAuditLog({
        userId: session.userId,
        action: 'FEATURE_FLAGS_BULK_UPDATED',
        entityType: 'FeatureFlag',
        metadata: { updatedCount: body.length },
      });
    } else {
      const validated = FlagUpdateSchema.parse(body);
      updateFeatureFlag(validated.key, validated.isEnabled, validated.configJson);

      recordAuditLog({
        userId: session.userId,
        action: 'FEATURE_FLAG_UPDATED',
        entityType: 'FeatureFlag',
        entityId: validated.key,
        metadata: {
          key: validated.key,
          isEnabled: validated.isEnabled,
          configJson: validated.configJson,
        },
      });
    }

    // Revalidate live storefront
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/vault');
    revalidatePath('/journal');

    return NextResponse.json({
      success: true,
      flags: getFeatureFlags(),
      message: 'Feature flags updated and live storefront synchronized.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update feature flags' }, { status: 400 });
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
      const reset = resetFeatureFlags();
      recordAuditLog({
        userId: session.userId,
        action: 'FEATURE_FLAGS_RESET_TO_DEFAULTS',
        entityType: 'FeatureFlag',
      });

      revalidatePath('/', 'layout');
      return NextResponse.json({
        success: true,
        flags: reset,
        message: 'All feature flags restored to factory defaults.',
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Action failed' }, { status: 500 });
  }
}

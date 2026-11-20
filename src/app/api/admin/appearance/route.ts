import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  getThemeConfig,
  saveThemeConfig,
  resetThemeConfig,
  recordAuditLog,
} from '@/lib/db';
import { evaluateWcagCompliance } from '@/lib/contrast';
import { getCurrentSession } from '@/lib/auth';

const ThemeSchema = z.object({
  canvasColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  surfaceColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  elevatedColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  borderColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  inkPrimaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  inkSecondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  accentPrimaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  accentSecondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  hairlineGrid: z.boolean().optional(),
  borderRadius: z.enum(['0px', '2px', '4px', '8px']).optional(),
  glassmorphism: z.boolean().optional(),
  logoUrl: z.string().optional(),
  logoDarkUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  ogImageUrl: z.string().optional(),
  presets: z.array(z.any()).optional(),
  bypassContrastGuard: z.boolean().optional(),
});

export async function GET() {
  const session = await getCurrentSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 401 });
  }

  const theme = getThemeConfig();

  // Evaluate real-time WCAG 2.2 AA Contrast Pairs
  const evaluations = {
    primaryTextOnCanvas: evaluateWcagCompliance(theme.inkPrimaryColor, theme.canvasColor),
    secondaryTextOnCanvas: evaluateWcagCompliance(theme.inkSecondaryColor, theme.canvasColor),
    primaryTextOnSurface: evaluateWcagCompliance(theme.inkPrimaryColor, theme.surfaceColor),
    accentOnCanvas: evaluateWcagCompliance(theme.accentPrimaryColor, theme.canvasColor),
    whiteOnAccent: evaluateWcagCompliance('#FFFFFF', theme.accentPrimaryColor),
    whiteOnInkPrimary: evaluateWcagCompliance('#FFFFFF', theme.inkPrimaryColor),
  };

  return NextResponse.json({
    theme,
    evaluations,
    wcagPass:
      evaluations.primaryTextOnCanvas.normalTextAA &&
      evaluations.secondaryTextOnCanvas.largeTextAA,
  });
}

export async function PUT(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await request.json();
    const validated = ThemeSchema.parse(body);

    // WCAG 2.2 AA Guard Enforcement
    const primaryContrast = evaluateWcagCompliance(
      validated.inkPrimaryColor,
      validated.canvasColor
    );

    if (!primaryContrast.normalTextAA && !validated.bypassContrastGuard) {
      return NextResponse.json(
        {
          error: `WCAG 2.2 AA Contrast Guard Blocked Save: Primary text to canvas ratio is ${primaryContrast.ratio}:1 (Minimum required: 4.5:1). Please adjust ink or canvas color, or explicitly bypass.`,
          evaluation: primaryContrast,
        },
        { status: 400 }
      );
    }

    const previous = getThemeConfig();
    const updated = saveThemeConfig(validated);

    recordAuditLog({
      userId: session.userId,
      action: 'THEME_UPDATED',
      entityType: 'ThemeConfig',
      entityId: updated.id,
      metadata: {
        previousColors: {
          canvas: previous.canvasColor,
          ink: previous.inkPrimaryColor,
          accent: previous.accentPrimaryColor,
        },
        newColors: {
          canvas: updated.canvasColor,
          ink: updated.inkPrimaryColor,
          accent: updated.accentPrimaryColor,
        },
      },
    });

    // Instant Zero-FOUC Cache Revalidation
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/vault');
    revalidatePath('/journal');

    return NextResponse.json({
      success: true,
      theme: updated,
      message: 'Visual theme saved and revalidated across storefront.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Theme update failed' },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await request.json();
    const action = body.action;

    if (action === 'reset') {
      const reset = resetThemeConfig();
      recordAuditLog({
        userId: session.userId,
        action: 'THEME_RESET_TO_DEFAULTS',
        entityType: 'ThemeConfig',
      });
      revalidatePath('/', 'layout');
      return NextResponse.json({
        success: true,
        theme: reset,
        message: 'Theme restored to Sun-Bleached Gallery default baseline.',
      });
    }

    if (action === 'save_preset') {
      const { presetName } = body;
      if (!presetName) {
        return NextResponse.json({ error: 'Preset name is required' }, { status: 400 });
      }
      const current = getThemeConfig();
      const presets = current.presets || [];
      const newPreset = {
        id: `preset_${Date.now()}`,
        name: presetName,
        isDefault: false,
        canvasColor: current.canvasColor,
        surfaceColor: current.surfaceColor,
        elevatedColor: current.elevatedColor,
        borderColor: current.borderColor,
        inkPrimaryColor: current.inkPrimaryColor,
        inkSecondaryColor: current.inkSecondaryColor,
        accentPrimaryColor: current.accentPrimaryColor,
        accentSecondaryColor: current.accentSecondaryColor,
        hairlineGrid: current.hairlineGrid,
        borderRadius: current.borderRadius,
        glassmorphism: current.glassmorphism,
      };
      presets.push(newPreset);
      saveThemeConfig({ presets });

      return NextResponse.json({
        success: true,
        presets,
        message: `Theme preset "${presetName}" saved successfully.`,
      });
    }

    if (action === 'apply_preset') {
      const { presetId } = body;
      const current = getThemeConfig();
      const target = (current.presets || []).find((p: any) => p.id === presetId);
      if (!target) {
        return NextResponse.json({ error: 'Preset not found' }, { status: 404 });
      }

      const updated = saveThemeConfig({
        canvasColor: target.canvasColor,
        surfaceColor: target.surfaceColor,
        elevatedColor: target.elevatedColor,
        borderColor: target.borderColor,
        inkPrimaryColor: target.inkPrimaryColor,
        inkSecondaryColor: target.inkSecondaryColor,
        accentPrimaryColor: target.accentPrimaryColor,
        accentSecondaryColor: target.accentSecondaryColor,
        hairlineGrid: target.hairlineGrid,
        borderRadius: target.borderRadius,
        glassmorphism: target.glassmorphism,
      });

      recordAuditLog({
        userId: session.userId,
        action: 'THEME_PRESET_APPLIED',
        entityType: 'ThemeConfig',
        metadata: { presetId, presetName: target.name },
      });

      revalidatePath('/', 'layout');
      return NextResponse.json({
        success: true,
        theme: updated,
        message: `Applied theme preset: ${target.name}`,
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Operation failed' }, { status: 500 });
  }
}

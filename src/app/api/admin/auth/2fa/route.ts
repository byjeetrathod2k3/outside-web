import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getSuperAdminSecurity, saveSuperAdminSecurity, recordAuditLog } from '@/lib/db';
import { generateTotpSecret, generateQrCodeSvg, generateQrCodeDataUrl, verifyTotpToken } from '@/lib/totp';

export async function GET() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized Super Admin access' }, { status: 401 });
  }

  const currentSecurity = getSuperAdminSecurity();

  // If already enabled, return status
  if (currentSecurity.totpEnabled) {
    return NextResponse.json({
      enabled: true,
      message: 'Two-Factor Authentication is currently active.',
    });
  }

  // Generate a new secret and QR SVG/DataURL for setup
  const { secret, otpauthUri } = generateTotpSecret(session.email, 'OUTSIDE');
  const qrSvg = await generateQrCodeSvg(otpauthUri);
  const qrDataUrl = await generateQrCodeDataUrl(otpauthUri);

  return NextResponse.json({
    enabled: false,
    secret,
    otpauthUri,
    qrSvg,
    qrDataUrl,
  });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized Super Admin access' }, { status: 401 });
  }

  try {
    const { secret, token } = await request.json();

    if (!secret || !token) {
      return NextResponse.json(
        { error: 'Secret and verification passcode are required' },
        { status: 400 }
      );
    }

    // Verify token with drift window of 2 (±60 seconds)
    const isValid = verifyTotpToken(secret, token, 2);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid 6-digit confirmation code. Please ensure your device clock is synchronized and retry.' },
        { status: 400 }
      );
    }

    // Enable 2FA on Super Admin profile
    saveSuperAdminSecurity({
      totpSecret: secret,
      totpEnabled: true,
    });

    recordAuditLog({
      userId: session.userId,
      action: 'TOTP_2FA_ENABLED',
      entityType: 'SECURITY_AUTH',
      metadata: { email: session.email },
    });

    return NextResponse.json({
      success: true,
      message: 'Two-Factor Authentication has been successfully enabled.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to verify TOTP token' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized Super Admin access' }, { status: 401 });
  }

  saveSuperAdminSecurity({
    totpSecret: null,
    totpEnabled: false,
  });

  recordAuditLog({
    userId: session.userId,
    action: 'TOTP_2FA_DISABLED',
    entityType: 'SECURITY_AUTH',
    metadata: { email: session.email },
  });

  return NextResponse.json({
    success: true,
    message: 'Two-Factor Authentication has been disabled.',
  });
}

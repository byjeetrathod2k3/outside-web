import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getSuperAdminSecurity,
  saveSuperAdminSecurity,
  getSecurityLockouts,
  clearSecurityLockouts,
  getAdminBasePath,
  updateStealthAdminPath,
  recordAuditLog,
} from '@/lib/db';

export async function GET() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized Super Admin access' }, { status: 401 });
  }

  const security = getSuperAdminSecurity();
  const lockouts = getSecurityLockouts();
  const stealthAdminPath = getAdminBasePath();

  return NextResponse.json({
    success: true,
    is2faEnabled: Boolean(security.totpEnabled),
    stealthAdminPath,
    lockouts,
    rateLimitPolicy: {
      maxFailedAttempts: 5,
      lockoutDurationMinutes: 15,
      description: '5 failed attempts locks out IP address for 15 minutes',
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized Super Admin access' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const action = body.action;

    if (action === 'updateStealthPath') {
      const newPath = body.path?.trim();
      if (!newPath || !newPath.startsWith('/') || newPath.length < 3) {
        return NextResponse.json(
          { error: 'Valid URL path starting with "/" is required (e.g. /sys-admin-gate, /outside-studio-ops)' },
          { status: 400 }
        );
      }

      const updated = updateStealthAdminPath(newPath);
      recordAuditLog({
        userId: session.userId,
        action: 'STEALTH_ADMIN_PATH_UPDATED',
        entityType: 'SECURITY_AUTH',
        metadata: { newPath: updated },
      });

      return NextResponse.json({
        success: true,
        stealthAdminPath: updated,
        message: `Stealth admin gateway path updated to ${updated}.`,
      });
    }

    if (action === 'clearLockouts') {
      const ip = body.ip;
      clearSecurityLockouts(ip);
      recordAuditLog({
        userId: session.userId,
        action: 'SECURITY_LOCKOUTS_CLEARED',
        entityType: 'SECURITY_AUTH',
        metadata: { targetIp: ip || 'ALL' },
      });

      return NextResponse.json({
        success: true,
        lockouts: getSecurityLockouts(),
        message: ip ? `Lockout cleared for IP ${ip}.` : 'All IP lockouts and failed attempts reset successfully.',
      });
    }

    return NextResponse.json({ error: 'Invalid action requested' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Security action failed' },
      { status: 500 }
    );
  }
}

import { describe, it, expect } from 'vitest';
import {
  createSessionToken,
  verifySessionToken,
  create2faChallengeToken,
  verify2faChallengeToken,
  hasRequiredRole,
} from '../src/lib/auth';
import {
  generateTotpSecret,
  generateTotpToken,
  verifyTotpToken,
  generateQrCodeSvg,
  generateQrCodeDataUrl,
} from '../src/lib/totp';

describe('Admin Security & Double Verification (2FA / TOTP)', () => {
  it('enforces RBAC role hierarchy correctly', () => {
    expect(hasRequiredRole('SUPER_ADMIN', 'SUPER_ADMIN')).toBe(true);
    expect(hasRequiredRole('SUPER_ADMIN', 'ADMIN')).toBe(true);
    expect(hasRequiredRole('SUPER_ADMIN', 'EDITOR')).toBe(true);
    expect(hasRequiredRole('ADMIN', 'SUPER_ADMIN')).toBe(false);
    expect(hasRequiredRole('EDITOR', 'ADMIN')).toBe(false);
    expect(hasRequiredRole('VIEWER', 'EDITOR')).toBe(false);
  });

  it('creates and verifies valid SUPER_ADMIN session tokens', async () => {
    const payload = {
      userId: 'usr_super_admin',
      email: 'admin@outside.in',
      name: 'Studio Principal (Super Admin)',
      role: 'SUPER_ADMIN' as const,
    };

    const token = await createSessionToken(payload);
    expect(token).toBeDefined();

    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(payload.userId);
    expect(verified?.email).toBe(payload.email);
    expect(verified?.role).toBe('SUPER_ADMIN');
  });

  it('generates and verifies 2FA challenge pre-auth tokens', async () => {
    const payload = {
      userId: 'usr_super_admin',
      email: 'admin@outside.in',
      role: 'SUPER_ADMIN' as const,
    };

    const challengeToken = await create2faChallengeToken(payload);
    expect(challengeToken).toBeDefined();

    const verified = await verify2faChallengeToken(challengeToken);
    expect(verified).not.toBeNull();
    expect(verified?.type).toBe('2fa_challenge');
    expect(verified?.email).toBe('admin@outside.in');
    expect(verified?.role).toBe('SUPER_ADMIN');

    // Tampered token must fail
    expect(await verify2faChallengeToken('invalid.token.here')).toBeNull();
  });

  it('generates working QR code SVG and DataURL with valid otpauth URI', async () => {
    const { secret, otpauthUri } = generateTotpSecret('admin@outside.in', 'OUTSIDE');
    expect(secret).toBeDefined();
    expect(otpauthUri).toContain('otpauth://totp/OUTSIDE:admin%40outside.in');

    const svg = await generateQrCodeSvg(otpauthUri);
    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox');

    const dataUrl = await generateQrCodeDataUrl(otpauthUri);
    expect(dataUrl.startsWith('data:image/png;base64,')).toBe(true);

    // Verify TOTP token generated from the secret works
    const token = generateTotpToken(secret);
    expect(verifyTotpToken(secret, token, 2)).toBe(true);
  });
});

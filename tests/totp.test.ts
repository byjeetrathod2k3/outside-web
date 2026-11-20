import { describe, it, expect } from 'vitest';
import {
  base32Encode,
  base32Decode,
  generateTotpSecret,
  generateTotpToken,
  verifyTotpToken,
} from '../src/lib/totp';

describe('RFC 6238 TOTP Engine', () => {
  it('encodes and decodes Base32 without data loss', () => {
    const original = Buffer.from('OUTSIDE APPAREL STUDIO 2026 GUJARAT');
    const encoded = base32Encode(original);
    const decoded = base32Decode(encoded);

    expect(decoded.toString()).toBe(original.toString());
  });

  it('generates a valid Base32 secret and otpauth URI', () => {
    const { secret, otpauthUri } = generateTotpSecret('admin@outside.in', 'OUTSIDE');

    expect(secret).toBeDefined();
    expect(secret.length).toBeGreaterThanOrEqual(16);
    expect(otpauthUri).toContain('otpauth://totp/OUTSIDE:admin%40outside.in');
    expect(otpauthUri).toContain(`secret=${secret}`);
  });

  it('generates and verifies 6-digit TOTP tokens accurately', () => {
    const { secret } = generateTotpSecret('admin@outside.in');
    const now = Math.floor(Date.now() / 1000);

    const token = generateTotpToken(secret, 0, now);
    expect(token).toMatch(/^\d{6}$/);

    // Current token must verify
    expect(verifyTotpToken(secret, token, 1, now)).toBe(true);

    // Drift within ±1 step (30 seconds) must verify
    expect(verifyTotpToken(secret, token, 1, now + 25)).toBe(true);
    expect(verifyTotpToken(secret, token, 1, now - 25)).toBe(true);

    // Completely expired or invalid tokens must fail
    expect(verifyTotpToken(secret, token, 1, now + 120)).toBe(false);
    expect(verifyTotpToken(secret, '000000', 1, now)).toBe(false);
    expect(verifyTotpToken(secret, 'invalid', 1, now)).toBe(false);
  });

  it('rejects tampered tokens', () => {
    const { secret } = generateTotpSecret('admin@outside.in');
    const now = Math.floor(Date.now() / 1000);
    const validToken = generateTotpToken(secret, 0, now);

    const tampered = (parseInt(validToken, 10) + 1).toString().padStart(6, '0');
    if (tampered !== validToken) {
      expect(verifyTotpToken(secret, tampered, 0, now)).toBe(false);
    }
  });

  it('generates real scannable QR Code SVG and DataURL', async () => {
    const { otpauthUri } = generateTotpSecret('admin@outside.in', 'OUTSIDE');
    const { generateQrCodeSvg, generateQrCodeDataUrl, generateSimpleQrSvg } = await import('../src/lib/totp');

    const svg = await generateQrCodeSvg(otpauthUri);
    expect(svg).toBeDefined();
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg.length).toBeGreaterThan(500);

    const dataUrl = await generateQrCodeDataUrl(otpauthUri);
    expect(dataUrl).toBeDefined();
    expect(dataUrl.startsWith('data:image/png;base64,')).toBe(true);
    expect(dataUrl.length).toBeGreaterThan(500);

    const simpleSvg = await generateSimpleQrSvg(otpauthUri);
    expect(simpleSvg).toBeDefined();
    expect(simpleSvg).toContain('<svg');
  });
});

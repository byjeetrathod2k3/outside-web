/**
 * OUTSIDE — RFC 6238 Cryptographic TOTP Engine (Two-Factor Authentication)
 * Pure Node.js crypto implementation with zero external dependencies.
 */

import crypto from 'crypto';
import QRCode from 'qrcode';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * Encodes a buffer to a Base32 string (RFC 4648).
 */
export function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Decodes a Base32 string to a Buffer (RFC 4648).
 */
export function base32Decode(str: string): Buffer {
  const cleanStr = str.toUpperCase().replace(/[\s=-]/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < cleanStr.length; i++) {
    const char = cleanStr[i];
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) {
      continue; // Skip invalid characters
    }

    value = (value << 5) | index;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

/**
 * Generates a cryptographically secure 20-byte (160-bit) Base32 TOTP secret.
 */
export function generateTotpSecret(email: string, issuer: string = 'OUTSIDE'): {
  secret: string;
  otpauthUri: string;
} {
  const randomBytes = crypto.randomBytes(20);
  const secret = base32Encode(randomBytes);
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedEmail = encodeURIComponent(email);
  const otpauthUri = `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;

  return { secret, otpauthUri };
}

/**
 * Generates a 6-digit TOTP token for a given counter or timestamp offset.
 *
 * @param secret - Base32 encoded secret key
 * @param timeStepOffset - Offset in 30-second steps (e.g., -1 for previous, +1 for next)
 * @param timeInSeconds - Optional fixed timestamp in seconds (defaults to now)
 */
export function generateTotpToken(
  secret: string,
  timeStepOffset: number = 0,
  timeInSeconds: number = Math.floor(Date.now() / 1000)
): string {
  const secretBuffer = base32Decode(secret);
  const counter = Math.floor(timeInSeconds / 30) + timeStepOffset;

  // Convert counter to 8-byte Big Endian buffer
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(counter));

  // Compute HMAC-SHA1
  const hmac = crypto.createHmac('sha1', secretBuffer);
  hmac.update(counterBuffer);
  const digest = hmac.digest();

  // Dynamic Truncation
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, '0');
}

/**
 * Verifies a 6-digit TOTP token with a configurable drift window (default ±1 step = ±30s).
 */
export function verifyTotpToken(
  secret: string,
  token: string,
  window: number = 1,
  timeInSeconds: number = Math.floor(Date.now() / 1000)
): boolean {
  if (!token || token.length !== 6 || !/^\d{6}$/.test(token)) {
    return false;
  }

  for (let offset = -window; offset <= window; offset++) {
    const expected = generateTotpToken(secret, offset, timeInSeconds);
    if (crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))) {
      return true;
    }
  }

  return false;
}

/**
 * Generates a valid scannable SVG representation of a QR Code for an otpauth URI.
 */
export async function generateQrCodeSvg(data: string): Promise<string> {
  return QRCode.toString(data, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 1,
    color: {
      dark: '#111110',
      light: '#FFFFFF',
    },
  });
}

/**
 * Generates a valid scannable PNG Data URL of a QR Code for an otpauth URI.
 */
export async function generateQrCodeDataUrl(data: string): Promise<string> {
  return QRCode.toDataURL(data, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 240,
    color: {
      dark: '#111110',
      light: '#FFFFFF',
    },
  });
}

/**
 * Generates an SVG representation of a QR Code for an otpauth URI (RFC 6238).
 */
export async function generateSimpleQrSvg(data: string): Promise<string> {
  return generateQrCodeSvg(data);
}

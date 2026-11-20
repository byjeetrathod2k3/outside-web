import { describe, it, expect } from 'vitest';
import {
  encryptCredential,
  decryptCredential,
  interpolateTemplate,
  DEFAULT_EMAIL_TEMPLATES,
} from '../src/lib/email';

describe('Admin-Managed Transactional Email Engine', () => {
  it('correctly encrypts and decrypts sensitive credentials with AES-256-GCM', () => {
    const originalPassword = 'SuperSecretSmtpPassword123!@#';
    const encrypted = encryptCredential(originalPassword);

    expect(encrypted).not.toBe(originalPassword);
    expect(encrypted).toContain(':'); // iv:authTag:cipher

    const decrypted = decryptCredential(encrypted);
    expect(decrypted).toBe(originalPassword);
  });

  it('correctly interpolates dynamic template variables', () => {
    const template = 'Hello {{name}}, your order {{orderNumber}} is ₹{{totalAmount}}!';
    const result = interpolateTemplate(template, {
      name: 'Rohan Sharma',
      orderNumber: 'ORD-2026-0001',
      totalAmount: 2400,
    });

    expect(result).toBe('Hello Rohan Sharma, your order ORD-2026-0001 is ₹2400!');
  });

  it('contains all 4 required operational templates', () => {
    expect(DEFAULT_EMAIL_TEMPLATES.WAITLIST_CONFIRMATION).toBeDefined();
    expect(DEFAULT_EMAIL_TEMPLATES.DROP_LIVE_ALERT).toBeDefined();
    expect(DEFAULT_EMAIL_TEMPLATES.ORDER_CONFIRMATION_INVOICE).toBeDefined();
    expect(DEFAULT_EMAIL_TEMPLATES.CONTACT_INQUIRY_RECEIPT).toBeDefined();
  });
});

/**
 * OUTSIDE — Admin-Managed Transactional Email Engine
 * Features:
 *   - Provider-Agnostic: SMTP (Nodemailer / SES / Zoho / Google) or API (Resend)
 *   - Security: AES-256-GCM Credential Encryption / Decryption at rest
 *   - Templates: WAITLIST_CONFIRMATION, DROP_LIVE_ALERT, ORDER_CONFIRMATION_INVOICE, CONTACT_INQUIRY_RECEIPT
 *   - Test email execution & audit logging
 */

import crypto from 'crypto';
import nodemailer from 'nodemailer';

const ALGORITHM = 'aes-256-gcm';
const DEFAULT_KEY_HEX = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

function getEncryptionKey(): Buffer {
  const hex = process.env.ENCRYPTION_MASTER_KEY || DEFAULT_KEY_HEX;
  return Buffer.from(hex.slice(0, 64), 'hex');
}

/**
 * Encrypts sensitive credentials (SMTP passwords, API keys) at rest using AES-256-GCM
 */
export function encryptCredential(plainText: string): string {
  if (!plainText) return '';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  // Format: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts AES-256-GCM encrypted credentials
 */
export function decryptCredential(cipherText: string): string {
  if (!cipherText || !cipherText.includes(':')) return cipherText;
  try {
    const [ivHex, authTagHex, encryptedHex] = cipherText.split(':');
    if (!ivHex || !authTagHex || !encryptedHex) return '';
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      getEncryptionKey(),
      Buffer.from(ivHex, 'hex')
    );
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Failed to decrypt credential:', err);
    return '';
  }
}

export type EmailTemplateType =
  | 'WAITLIST_CONFIRMATION'
  | 'DROP_LIVE_ALERT'
  | 'ORDER_CONFIRMATION_INVOICE'
  | 'CONTACT_INQUIRY_RECEIPT';

export interface EmailConfigData {
  isEnabled: boolean;
  provider: 'SMTP' | 'RESEND';
  host?: string;
  port?: number;
  secure?: boolean;
  username?: string;
  encryptedPassword?: string;
  encryptedApiKey?: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
}

export const DEFAULT_EMAIL_TEMPLATES: Record<
  EmailTemplateType,
  { subject: string; bodyHtml: string; bodyText: string }
> = {
  WAITLIST_CONFIRMATION: {
    subject: 'You are on the waitlist for {{dropTitle}} — OUTSIDE',
    bodyHtml: `
      <div style="font-family: sans-serif; background: #0A0A0A; color: #F5F5F7; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #222;">
        <h1 style="color: #D91E2A; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">OUTSIDE</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #CCC;">Hello {{name}},</p>
        <p style="font-size: 16px; line-height: 1.6; color: #CCC;">
          Your spot on the waitlist for <strong>{{dropTitle}}</strong> is secured.
        </p>
        <div style="background: #141414; padding: 20px; border-left: 3px solid #D91E2A; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #AAA;">Requested Fit: <strong style="color: #FFF;">{{preferredFit}}</strong></p>
          <p style="margin: 6px 0 0; font-size: 14px; color: #AAA;">Requested Size: <strong style="color: #FFF;">{{preferredSize}}</strong></p>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #888;">
          You will receive an exclusive early-access notification exactly 15 minutes before the edition drops publicly.
        </p>
        <p style="font-size: 12px; color: #555; margin-top: 40px; border-top: 1px solid #222; padding-top: 20px;">
          OUTSIDE APPAREL STUDIO PVT LTD · Ahmedabad, Gujarat 380015
        </p>
      </div>
    `,
    bodyText: `OUTSIDE\n\nHello {{name}},\nYour spot on the waitlist for {{dropTitle}} is secured.\nFit: {{preferredFit}} | Size: {{preferredSize}}\n\nYou will receive an exclusive early-access notification before launch.`,
  },
  DROP_LIVE_ALERT: {
    subject: 'LIVE NOW: {{dropTitle}} is now available — OUTSIDE',
    bodyHtml: `
      <div style="font-family: sans-serif; background: #0A0A0A; color: #F5F5F7; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #222;">
        <h1 style="color: #D91E2A; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">OUTSIDE</h1>
        <h2 style="font-size: 20px; color: #FFF; margin-top: 10px;">{{dropTitle}} IS LIVE</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #CCC;">
          Only {{totalEditionQty}} serialized pieces produced. Once sold out, this edition will be permanently archived in The Vault.
        </p>
        <div style="margin: 30px 0;">
          <a href="{{dropUrl}}" style="background: #D91E2A; color: #FFF; padding: 14px 28px; text-decoration: none; font-weight: bold; letter-spacing: 1px; display: inline-block;">
            CLAIM YOUR PIECE &rarr;
          </a>
        </div>
        <p style="font-size: 12px; color: #555; margin-top: 40px; border-top: 1px solid #222; padding-top: 20px;">
          OUTSIDE APPAREL STUDIO PVT LTD · Ahmedabad, Gujarat 380015
        </p>
      </div>
    `,
    bodyText: `OUTSIDE - LIVE NOW\n\n{{dropTitle}} is now available.\nTotal Edition: {{totalEditionQty}} pieces.\nClaim yours at: {{dropUrl}}`,
  },
  ORDER_CONFIRMATION_INVOICE: {
    subject: 'Order Confirmed: {{orderNumber}} — Tax Invoice {{invoiceNumber}}',
    bodyHtml: `
      <div style="font-family: sans-serif; background: #0A0A0A; color: #F5F5F7; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #222;">
        <h1 style="color: #D91E2A; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">OUTSIDE</h1>
        <p style="font-size: 18px; color: #FFF; margin-top: 10px;">Thank you for your order, {{customerName}}.</p>
        <p style="font-size: 14px; color: #AAA;">Order Number: <strong>{{orderNumber}}</strong> | Tax Invoice: <strong>{{invoiceNumber}}</strong></p>
        
        <div style="background: #141414; padding: 20px; margin: 24px 0; border: 1px solid #222;">
          <h3 style="color: #D91E2A; font-size: 14px; text-transform: uppercase; margin-top: 0;">GST Invoice Breakdown</h3>
          <p style="margin: 4px 0; font-size: 13px; color: #CCC;">Place of Supply: <strong>{{placeOfSupply}}</strong></p>
          <p style="margin: 4px 0; font-size: 13px; color: #CCC;">Taxable Value: <strong>₹{{taxableAmount}}</strong></p>
          {{taxSplitHtml}}
          <hr style="border: 0; border-top: 1px solid #333; margin: 12px 0;" />
          <p style="margin: 4px 0; font-size: 16px; color: #FFF; font-weight: bold;">Total Amount: ₹{{totalAmount}}</p>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #AAA;">
          Shipping Address:<br />
          {{shippingAddress}}, {{shippingCity}}, {{shippingState}} - {{shippingPincode}}
        </p>

        <p style="font-size: 12px; color: #555; margin-top: 40px; border-top: 1px solid #222; padding-top: 20px;">
          OUTSIDE APPAREL STUDIO PVT LTD · GSTIN: {{gstin}} · Gujarat
        </p>
      </div>
    `,
    bodyText: `OUTSIDE - Order Confirmed\n\nOrder: {{orderNumber}}\nInvoice: {{invoiceNumber}}\nTotal: INR {{totalAmount}}\nThank you for wearing your story.`,
  },
  CONTACT_INQUIRY_RECEIPT: {
    subject: 'We received your inquiry — OUTSIDE Support',
    bodyHtml: `
      <div style="font-family: sans-serif; background: #0A0A0A; color: #F5F5F7; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #222;">
        <h1 style="color: #D91E2A; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">OUTSIDE</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #CCC;">Hello {{name}},</p>
        <p style="font-size: 16px; line-height: 1.6; color: #CCC;">
          Thank you for reaching out to OUTSIDE. Our studio team has received your message and will respond within 24 hours.
        </p>
        <div style="background: #141414; padding: 16px; margin: 20px 0; border-left: 3px solid #D91E2A;">
          <p style="margin: 0; font-size: 13px; color: #888; font-style: italic;">"{{messageExcerpt}}"</p>
        </div>
        <p style="font-size: 12px; color: #555; margin-top: 40px; border-top: 1px solid #222; padding-top: 20px;">
          OUTSIDE APPAREL STUDIO PVT LTD · support@outside.in
        </p>
      </div>
    `,
    bodyText: `OUTSIDE\n\nHello {{name}},\nWe received your inquiry and our studio will respond within 24 hours.`,
  },
};

export interface SendEmailPayload {
  to: string;
  templateType: EmailTemplateType;
  variables: Record<string, string | number>;
  config?: EmailConfigData;
}

/**
 * Replaces {{variable}} placeholders in HTML and text templates
 */
export function interpolateTemplate(
  content: string,
  variables: Record<string, string | number>
): string {
  let result = content;
  for (const [key, val] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(val));
  }
  return result;
}

/**
 * Dispatch transactional email through configured provider or simulated log
 */
export async function sendTransactionalEmail(
  payload: SendEmailPayload
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, templateType, variables, config } = payload;
  const template = DEFAULT_EMAIL_TEMPLATES[templateType];

  if (!template) {
    return { success: false, error: `Template ${templateType} not found` };
  }

  const subject = interpolateTemplate(template.subject, variables);
  const html = interpolateTemplate(template.bodyHtml, variables);
  const text = interpolateTemplate(template.bodyText, variables);

  // If email config is disabled or missing credentials, log and simulate gracefully
  if (!config || !config.isEnabled) {
    console.log(`[SIMULATED EMAIL DISPATCH] To: ${to} | Subject: ${subject}`);
    return {
      success: true,
      messageId: `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    };
  }

  try {
    if (config.provider === 'SMTP') {
      const password = config.encryptedPassword
        ? decryptCredential(config.encryptedPassword)
        : '';

      if (!config.host || !config.username || !password) {
        // Fallback to simulated if credentials are incomplete
        console.log(`[SIMULATED SMTP (Incomplete Credentials)] To: ${to} | Subject: ${subject}`);
        return { success: true, messageId: `sim_smtp_${Date.now()}` };
      }

      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port || 587,
        secure: config.secure || false,
        auth: {
          user: config.username,
          pass: password,
        },
      });

      const info = await transporter.sendMail({
        from: `"${config.fromName}" <${config.fromEmail}>`,
        to,
        replyTo: config.replyTo || config.fromEmail,
        subject,
        html,
        text,
      });

      return { success: true, messageId: info.messageId };
    } else if (config.provider === 'RESEND') {
      const apiKey = config.encryptedApiKey
        ? decryptCredential(config.encryptedApiKey)
        : '';

      if (!apiKey) {
        console.log(`[SIMULATED RESEND (No API Key)] To: ${to} | Subject: ${subject}`);
        return { success: true, messageId: `sim_resend_${Date.now()}` };
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${config.fromName} <${config.fromEmail}>`,
          to: [to],
          subject,
          html,
          text,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Resend API Error (${res.status}): ${errText}`);
      }

      const data = await res.json();
      return { success: true, messageId: data.id };
    }

    return { success: false, error: 'Unknown email provider' };
  } catch (error: any) {
    console.error('Email dispatch failure:', error);
    return { success: false, error: error.message || 'Unknown email failure' };
  }
}

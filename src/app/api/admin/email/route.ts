import { NextResponse } from 'next/server';
import { getLocalStore, saveLocalStore } from '@/lib/db';
import {
  encryptCredential,
  decryptCredential,
  sendTransactionalEmail,
  DEFAULT_EMAIL_TEMPLATES,
} from '@/lib/email';
import { getCurrentSession } from '@/lib/auth';

export async function GET() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized Super Admin access' }, { status: 401 });
  }

  const store = getLocalStore();
  const config = store.emailConfig || {};

  // Redact passwords and API keys for display
  const sanitizedConfig = {
    ...config,
    hasPassword: Boolean(config.encryptedPassword),
    hasApiKey: Boolean(config.encryptedApiKey),
    encryptedPassword: undefined,
    encryptedApiKey: undefined,
  };

  return NextResponse.json({
    config: sanitizedConfig,
    templates: DEFAULT_EMAIL_TEMPLATES,
    logs: store.emailLogs || [],
  });
}

export async function PUT(request: Request) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized Super Admin access' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      provider,
      host,
      port,
      secure,
      username,
      password,
      apiKey,
      fromName,
      fromEmail,
      replyTo,
      isEnabled,
    } = body;

    const store = getLocalStore();
    const existing = store.emailConfig || {};

    const updatedConfig: any = {
      ...existing,
      provider: provider || existing.provider || 'SMTP',
      host: host ?? existing.host,
      port: port !== undefined ? Number(port) : existing.port,
      secure: secure !== undefined ? Boolean(secure) : existing.secure,
      username: username ?? existing.username,
      fromName: fromName ?? existing.fromName,
      fromEmail: fromEmail ?? existing.fromEmail,
      replyTo: replyTo ?? existing.replyTo,
      isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : existing.isEnabled,
      updatedAt: new Date().toISOString(),
    };

    // Encrypt sensitive secrets if newly provided
    if (password && password.trim().length > 0) {
      updatedConfig.encryptedPassword = encryptCredential(password);
    }
    if (apiKey && apiKey.trim().length > 0) {
      updatedConfig.encryptedApiKey = encryptCredential(apiKey);
    }

    store.emailConfig = updatedConfig;

    store.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      action: 'EMAIL_CONFIGURATION_UPDATED',
      entityType: 'EmailConfig',
      metadata: { provider: updatedConfig.provider, fromEmail: updatedConfig.fromEmail },
      createdAt: new Date().toISOString(),
    });

    saveLocalStore(store);

    return NextResponse.json({ success: true, message: 'Email configuration secured and updated' });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to update email config' },
      { status: 500 }
    );
  }
}

// POST: Execute Live Test Email
export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized Super Admin access' }, { status: 401 });
  }

  try {
    const { testRecipient = 'admin@outside.in' } = await request.json();
    const store = getLocalStore();

    const result = await sendTransactionalEmail({
      to: testRecipient,
      templateType: 'WAITLIST_CONFIRMATION',
      variables: {
        name: 'Studio Administrator (Live Test)',
        dropTitle: 'DROP 001 // TEST HARNESS DISPATCH',
        preferredFit: 'WOMEN',
        preferredSize: 'M',
      },
      config: store.emailConfig,
    });

    store.emailLogs = store.emailLogs || [];
    store.emailLogs.unshift({
      id: `log_${Date.now()}`,
      recipient: testRecipient,
      subject: 'LIVE TEST EMAIL DISPATCH',
      status: result.success ? 'SENT' : 'FAILED',
      errorMessage: result.error || null,
      sentAt: new Date().toISOString(),
    });

    saveLocalStore(store);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to dispatch test email' },
      { status: 500 }
    );
  }
}

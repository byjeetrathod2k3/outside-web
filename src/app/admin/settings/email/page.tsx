'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Save, Send, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

export default function AdminEmailSettingsPage() {
  const [config, setConfig] = useState<any>({
    provider: 'SMTP',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    username: 'drops@outside.in',
    fromName: 'OUTSIDE',
    fromEmail: 'drops@outside.in',
    replyTo: 'support@outside.in',
    isEnabled: true,
  });

  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [templates, setTemplates] = useState<any>({});
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'config' | 'templates' | 'logs'>('config');

  const [testEmail, setTestEmail] = useState('admin@outside.in');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEmailSettings() {
      try {
        const res = await fetch('/api/admin/email');
        if (res.ok) {
          const data = await res.json();
          if (data.config) setConfig(data.config);
          if (data.templates) setTemplates(data.templates);
          if (data.logs) setLogs(data.logs);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadEmailSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const payload: any = { ...config };
      if (password) payload.password = password;
      if (apiKey) payload.apiKey = apiKey;

      const res = await fetch('/api/admin/email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save configuration');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setPassword('');
      setApiKey('');
    } catch (err: any) {
      setError(err.message || 'Saving failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/admin/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testRecipient: testEmail }),
      });

      const data = await res.json();
      setTestResult(data);

      // Refresh logs
      const updated = await fetch('/api/admin/email');
      if (updated.ok) {
        const updateData = await updated.json();
        if (updateData.logs) setLogs(updateData.logs);
      }
    } catch (err: any) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-8 font-mono">
      
      {/* Header */}
      <div className="border-b border-outside-border pb-6 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase text-outside-crimson font-bold tracking-[0.25em]">
            TRANSACTIONAL DISPATCH ARCHITECTURE
          </span>
          <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight mt-1">
            Email Provider &amp; Templates Manager
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-outside-muted">
          <Shield className="w-4 h-4 text-outside-crimson" />
          <span>AES-256-GCM ENCRYPTED AT REST</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outside-border text-xs">
        <button
          onClick={() => setActiveTab('config')}
          className={`px-6 py-3 border-b-2 uppercase tracking-wider font-bold transition-all ${
            activeTab === 'config'
              ? 'border-outside-crimson text-white bg-outside-surface/60'
              : 'border-transparent text-outside-muted hover:text-white'
          }`}
        >
          PROVIDER CONFIGURATION
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-6 py-3 border-b-2 uppercase tracking-wider font-bold transition-all ${
            activeTab === 'templates'
              ? 'border-outside-crimson text-white bg-outside-surface/60'
              : 'border-transparent text-outside-muted hover:text-white'
          }`}
        >
          BUILT-IN TEMPLATES
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-6 py-3 border-b-2 uppercase tracking-wider font-bold transition-all ${
            activeTab === 'logs'
              ? 'border-outside-crimson text-white bg-outside-surface/60'
              : 'border-transparent text-outside-muted hover:text-white'
          }`}
        >
          DISPATCH LOGS ({logs.length})
        </button>
      </div>

      {success && (
        <div className="p-4 bg-outside-surface border border-outside-crimson text-white text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-outside-crimson" />
          <span>EMAIL CONFIGURATION &amp; SECRETS ENCRYPTED AND SAVED.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-outside-surface border border-outside-crimson text-white text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-outside-crimson" />
          <span>{error}</span>
        </div>
      )}

      {/* Tab 1: Provider Config */}
      {activeTab === 'config' && (
        <div className="space-y-8">
          <form onSubmit={handleSave} className="bg-outside-surface border border-outside-border p-8 space-y-6">
            
            {/* Toggle */}
            <div className="flex items-center justify-between p-4 bg-outside-card border border-outside-border">
              <div>
                <span className="text-xs font-bold text-white uppercase block">
                  ENABLE AUTOMATED TRANSACTIONAL EMAILS
                </span>
                <p className="text-[11px] text-outside-muted mt-0.5">
                  Sends invoices, waitlist access codes, and live drop notifications.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.isEnabled}
                onChange={(e) => setConfig({ ...config, isEnabled: e.target.checked })}
                className="w-5 h-5 accent-outside-crimson cursor-pointer"
              />
            </div>

            {/* Provider Switcher */}
            <div>
              <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                DISPATCH ENGINE PROVIDER
              </label>
              <div className="grid grid-cols-2 gap-4">
                {(['SMTP', 'RESEND'] as const).map((prov) => (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => setConfig({ ...config, provider: prov })}
                    className={`py-3 px-4 border text-xs font-bold uppercase transition-all ${
                      config.provider === prov
                        ? 'bg-outside-card border-outside-crimson text-white'
                        : 'bg-outside-surface border-outside-border text-outside-muted hover:text-white'
                    }`}
                  >
                    {prov === 'SMTP' ? 'SMTP (Zoho / Google / SES)' : 'RESEND API'}
                  </button>
                ))}
              </div>
            </div>

            {/* SMTP Fields */}
            {config.provider === 'SMTP' ? (
              <div className="space-y-4 pt-4 border-t border-outside-border/80">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                      SMTP HOST
                    </label>
                    <input
                      type="text"
                      value={config.host || ''}
                      onChange={(e) => setConfig({ ...config, host: e.target.value })}
                      placeholder="smtp.gmail.com or smtp.zoho.in"
                      className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                      PORT
                    </label>
                    <input
                      type="number"
                      value={config.port || 587}
                      onChange={(e) => setConfig({ ...config, port: Number(e.target.value) })}
                      className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                      SMTP USERNAME
                    </label>
                    <input
                      type="text"
                      value={config.username || ''}
                      onChange={(e) => setConfig({ ...config, username: e.target.value })}
                      className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                      SMTP PASSWORD {config.hasPassword && <span className="text-outside-crimson">(ENCRYPTED)</span>}
                    </label>
                    <input
                      type="password"
                      placeholder={config.hasPassword ? '••••••••••••••••' : 'Enter SMTP password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Resend Fields */
              <div className="space-y-4 pt-4 border-t border-outside-border/80">
                <div>
                  <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                    RESEND API KEY {config.hasApiKey && <span className="text-outside-crimson">(ENCRYPTED)</span>}
                  </label>
                  <input
                    type="password"
                    placeholder={config.hasApiKey ? '••••••••••••••••' : 're_123456789...'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Sender Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-outside-border/80">
              <div>
                <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                  SENDER NAME
                </label>
                <input
                  type="text"
                  value={config.fromName || 'OUTSIDE'}
                  onChange={(e) => setConfig({ ...config, fromName: e.target.value })}
                  className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                  FROM EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={config.fromEmail || 'drops@outside.in'}
                  onChange={(e) => setConfig({ ...config, fromEmail: e.target.value })}
                  className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                  REPLY-TO EMAIL
                </label>
                <input
                  type="email"
                  value={config.replyTo || 'support@outside.in'}
                  onChange={(e) => setConfig({ ...config, replyTo: e.target.value })}
                  className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-outside-border/80 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-outside-crimson hover:bg-outside-crimsonBright text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'SECURING...' : 'ENCRYPT & SAVE SETTINGS'}</span>
              </button>
            </div>
          </form>

          {/* Test Email Section */}
          <div className="p-6 bg-outside-surface border border-outside-border space-y-4">
            <h3 className="text-xs uppercase text-white font-bold tracking-wider">
              LIVE EMAIL VERIFICATION HARNESS
            </h3>
            <p className="text-xs text-outside-muted">
              Sends an immediate authenticated test transmission to verify SMTP handshake or API authorization.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="admin@outside.in"
                className="flex-1 bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={testing}
                className="px-6 py-2.5 bg-outside-card border border-outside-border hover:border-outside-crimson text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-outside-crimson" />
                <span>{testing ? 'DISPATCHING...' : 'SEND TEST EMAIL'}</span>
              </button>
            </div>

            {testResult && (
              <div
                className={`p-3 border text-xs ${
                  testResult.success
                    ? 'bg-outside-card border-outside-crimson text-white'
                    : 'bg-outside-surface border-red-500 text-red-400'
                }`}
              >
                {testResult.success ? (
                  <span>DISPATCH SUCCEEDED. Message ID: {testResult.messageId}</span>
                ) : (
                  <span>DISPATCH FAILED: {testResult.error}</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Templates Preview */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          {Object.entries(templates).map(([key, tpl]: any) => (
            <div key={key} className="p-6 bg-outside-surface border border-outside-border space-y-3">
              <div className="flex justify-between items-center border-b border-outside-border/80 pb-2">
                <span className="text-xs font-bold text-outside-crimson">{key}</span>
                <span className="text-[10px] text-outside-muted">SYSTEM TEMPLATE</span>
              </div>
              <p className="text-xs text-white">
                <strong>Subject:</strong> {tpl.subject}
              </p>
              <div className="bg-outside-card p-3 border border-outside-border text-[11px] text-outside-muted font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                {tpl.bodyText}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Delivery Logs */}
      {activeTab === 'logs' && (
        <div className="bg-outside-surface border border-outside-border overflow-hidden">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-xs text-outside-muted">
              NO TRANSACTIONAL DISPATCH LOGS YET. TEST EMAILS AND CUSTOMER INVOICES WILL RECORD HERE.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-outside-card border-b border-outside-border text-outside-muted text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Recipient</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outside-border/40">
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="p-3 font-bold text-white">{log.recipient}</td>
                      <td className="p-3 text-outside-chalkDim">{log.subject}</td>
                      <td className="p-3">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 border ${
                            log.status === 'SENT'
                              ? 'bg-outside-card border-outside-crimson text-white'
                              : 'bg-outside-surface border-outside-border text-outside-muted'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3 text-right text-[10px] text-outside-muted">
                        {new Date(log.sentAt).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

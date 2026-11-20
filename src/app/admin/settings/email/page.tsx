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
      <div className="border-b border-[#DCD7CC] pb-6 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase text-[#B82328] font-bold tracking-[0.25em]">
            TRANSACTIONAL DISPATCH ARCHITECTURE
          </span>
          <h1 className="text-2xl font-display font-black text-[#111110] uppercase tracking-tight mt-1">
            Email Provider &amp; Templates Manager
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#3F4E44] bg-[#3F4E44]/10 border border-[#3F4E44]/30 px-3 py-1 font-bold">
          <Shield className="w-4 h-4 text-[#3F4E44]" />
          <span>AES-256-GCM ENCRYPTED AT REST</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#DCD7CC] text-xs">
        <button
          onClick={() => setActiveTab('config')}
          className={`px-6 py-3 border-b-2 uppercase tracking-wider font-bold transition-all cursor-pointer ${
            activeTab === 'config'
              ? 'border-[#B82328] text-[#111110] bg-[#FCFBF8]'
              : 'border-transparent text-[#52504B] hover:text-[#111110]'
          }`}
        >
          PROVIDER CONFIGURATION
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-6 py-3 border-b-2 uppercase tracking-wider font-bold transition-all cursor-pointer ${
            activeTab === 'templates'
              ? 'border-[#B82328] text-[#111110] bg-[#FCFBF8]'
              : 'border-transparent text-[#52504B] hover:text-[#111110]'
          }`}
        >
          BUILT-IN TEMPLATES
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-6 py-3 border-b-2 uppercase tracking-wider font-bold transition-all cursor-pointer ${
            activeTab === 'logs'
              ? 'border-[#B82328] text-[#111110] bg-[#FCFBF8]'
              : 'border-transparent text-[#52504B] hover:text-[#111110]'
          }`}
        >
          DISPATCH LOGS ({logs.length})
        </button>
      </div>

      {success && (
        <div className="p-4 bg-[#3F4E44]/10 border border-[#3F4E44] text-[#3F4E44] text-xs flex items-center gap-2 font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#3F4E44]" />
          <span>EMAIL CONFIGURATION &amp; SECRETS ENCRYPTED AND SAVED.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-[#B82328]/10 border border-[#B82328] text-[#B82328] text-xs flex items-center gap-2 font-bold">
          <AlertCircle className="w-4 h-4 text-[#B82328]" />
          <span>{error}</span>
        </div>
      )}

      {/* Tab 1: Provider Config */}
      {activeTab === 'config' && (
        <div className="space-y-8">
          <form onSubmit={handleSave} className="bg-[#FCFBF8] border border-[#DCD7CC] p-8 space-y-6 shadow-editorial">
            
            {/* Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#EDEAE2]/40 border border-[#DCD7CC]">
              <div>
                <span className="text-xs font-bold text-[#111110] uppercase block">
                  ENABLE AUTOMATED TRANSACTIONAL EMAILS
                </span>
                <p className="text-[11px] text-[#52504B] mt-0.5">
                  Sends invoices, waitlist access codes, and live drop notifications.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.isEnabled}
                onChange={(e) => setConfig({ ...config, isEnabled: e.target.checked })}
                className="w-5 h-5 accent-[#B82328] cursor-pointer"
              />
            </div>

            {/* Provider Switcher */}
            <div>
              <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                DISPATCH ENGINE PROVIDER
              </label>
              <div className="grid grid-cols-2 gap-4">
                {(['SMTP', 'RESEND'] as const).map((prov) => (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => setConfig({ ...config, provider: prov })}
                    className={`py-3 px-4 border text-xs font-bold uppercase transition-all cursor-pointer ${
                      config.provider === prov
                        ? 'bg-[#EDEAE2] border-[#111110] text-[#111110] shadow-sm'
                        : 'bg-[#FCFBF8] border-[#DCD7CC] text-[#52504B] hover:text-[#111110]'
                    }`}
                  >
                    {prov === 'SMTP' ? 'SMTP (Zoho / Google / SES)' : 'RESEND API'}
                  </button>
                ))}
              </div>
            </div>

            {/* SMTP Fields */}
            {config.provider === 'SMTP' ? (
              <div className="space-y-4 pt-4 border-t border-[#DCD7CC]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                      SMTP HOST
                    </label>
                    <input
                      type="text"
                      value={config.host || ''}
                      onChange={(e) => setConfig({ ...config, host: e.target.value })}
                      placeholder="smtp.gmail.com or smtp.zoho.in"
                      className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                      PORT
                    </label>
                    <input
                      type="number"
                      value={config.port || 587}
                      onChange={(e) => setConfig({ ...config, port: Number(e.target.value) })}
                      className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                      SMTP USERNAME
                    </label>
                    <input
                      type="text"
                      value={config.username || ''}
                      onChange={(e) => setConfig({ ...config, username: e.target.value })}
                      className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                      SMTP PASSWORD {config.hasPassword && <span className="text-[#B82328] font-normal">(ENCRYPTED)</span>}
                    </label>
                    <input
                      type="password"
                      placeholder={config.hasPassword ? '••••••••••••••••' : 'Enter SMTP password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Resend Fields */
              <div className="space-y-4 pt-4 border-t border-[#DCD7CC]">
                <div>
                  <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                    RESEND API KEY {config.hasApiKey && <span className="text-[#B82328] font-normal">(ENCRYPTED)</span>}
                  </label>
                  <input
                    type="password"
                    placeholder={config.hasApiKey ? '••••••••••••••••' : 're_123456789...'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Sender Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#DCD7CC]">
              <div>
                <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                  SENDER NAME
                </label>
                <input
                  type="text"
                  value={config.fromName || 'OUTSIDE'}
                  onChange={(e) => setConfig({ ...config, fromName: e.target.value })}
                  className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                  FROM EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={config.fromEmail || 'drops@outside.in'}
                  onChange={(e) => setConfig({ ...config, fromEmail: e.target.value })}
                  className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                  REPLY-TO EMAIL
                </label>
                <input
                  type="email"
                  value={config.replyTo || 'support@outside.in'}
                  onChange={(e) => setConfig({ ...config, replyTo: e.target.value })}
                  className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#DCD7CC] flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-[#111110] hover:bg-[#B82328] text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'SECURING...' : 'ENCRYPT & SAVE SETTINGS'}</span>
              </button>
            </div>
          </form>

          {/* Test Email Section */}
          <div className="p-6 bg-[#FCFBF8] border border-[#DCD7CC] space-y-4 shadow-editorial">
            <h3 className="text-xs uppercase text-[#111110] font-bold tracking-wider">
              LIVE EMAIL VERIFICATION HARNESS
            </h3>
            <p className="text-xs text-[#52504B]">
              Sends an immediate authenticated test transmission to verify SMTP handshake or API authorization.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="admin@outside.in"
                className="flex-1 bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none transition-colors font-mono"
              />
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={testing}
                className="px-6 py-2.5 bg-[#EDEAE2] border border-[#DCD7CC] hover:border-[#111110] text-[#111110] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#B82328]" />
                <span>{testing ? 'DISPATCHING...' : 'SEND TEST EMAIL'}</span>
              </button>
            </div>

            {testResult && (
              <div
                className={`p-3 border text-xs ${
                  testResult.success
                    ? 'bg-[#3F4E44]/10 border-[#3F4E44] text-[#3F4E44] font-bold'
                    : 'bg-[#B82328]/10 border-[#B82328] text-[#B82328] font-bold'
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
            <div key={key} className="p-6 bg-[#FCFBF8] border border-[#DCD7CC] space-y-3 shadow-editorial">
              <div className="flex justify-between items-center border-b border-[#DCD7CC] pb-2">
                <span className="text-xs font-bold text-[#B82328] uppercase">{key}</span>
                <span className="text-[10px] text-[#52504B] font-mono">SYSTEM TEMPLATE</span>
              </div>
              <p className="text-xs text-[#111110]">
                <strong>Subject:</strong> {tpl.subject}
              </p>
              <div className="bg-[#EDEAE2]/30 p-3 border border-[#DCD7CC] text-[11px] text-[#52504B] font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                {tpl.bodyText}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Delivery Logs */}
      {activeTab === 'logs' && (
        <div className="bg-[#FCFBF8] border border-[#DCD7CC] overflow-hidden shadow-editorial">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#52504B]">
              NO TRANSACTIONAL DISPATCH LOGS YET. TEST EMAILS AND CUSTOMER INVOICES WILL RECORD HERE.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EDEAE2]/50 border-b border-[#DCD7CC] text-[#52504B] text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Recipient</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCD7CC]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#EDEAE2]/30 transition-colors">
                      <td className="p-3 font-bold text-[#111110]">{log.recipient}</td>
                      <td className="p-3 text-[#52504B]">{log.subject}</td>
                      <td className="p-3">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 border font-bold uppercase tracking-wider ${
                            log.status === 'SENT'
                              ? 'bg-[#3F4E44]/10 border-[#3F4E44]/30 text-[#3F4E44]'
                              : 'bg-[#52504B]/10 border-[#52504B]/30 text-[#52504B]'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3 text-right text-[10px] text-[#52504B] font-mono">
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

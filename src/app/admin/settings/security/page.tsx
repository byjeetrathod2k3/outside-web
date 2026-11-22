'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Smartphone,
  Lock,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Unlock,
  Eye,
  EyeOff,
  Radio,
  Server,
} from 'lucide-react';

export default function AdminSecurityPage() {
  const [loading, setLoading] = useState(true);
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [setupData, setSetupData] = useState<{ secret: string; otpauthUri: string; qrSvg: string; qrDataUrl?: string } | null>(null);
  const [confirmCode, setConfirmCode] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Stealth Gateway & Rate Limit State
  const [stealthAdminPath, setStealthAdminPath] = useState('/sys-admin-gate');
  const [customPathInput, setCustomPathInput] = useState('/sys-admin-gate');
  const [lockouts, setLockouts] = useState<any[]>([]);
  const [rateLimitPolicy, setRateLimitPolicy] = useState<any>(null);

  const handleCopyKey = () => {
    if (!setupData?.secret) return;
    navigator.clipboard.writeText(setupData.secret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleCopySecretUrl = () => {
    const fullUrl = `${window.location.origin}${stealthAdminPath}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const fetchSecurityStatus = async () => {
    setLoading(true);
    try {
      // 1. Fetch 2FA status
      const res2fa = await fetch('/api/admin/auth/2fa');
      const data2fa = await res2fa.json();
      setIs2faEnabled(data2fa.enabled || false);
      if (!data2fa.enabled && data2fa.secret) {
        setSetupData(data2fa);
      } else {
        setSetupData(null);
      }

      // 2. Fetch Stealth Gate & Lockouts
      const resSec = await fetch('/api/admin/security');
      const dataSec = await resSec.json();
      if (resSec.ok) {
        setStealthAdminPath(dataSec.stealthAdminPath || '/sys-admin-gate');
        setCustomPathInput(dataSec.stealthAdminPath || '/sys-admin-gate');
        setLockouts(dataSec.lockouts || []);
        setRateLimitPolicy(dataSec.rateLimitPolicy);
      }
    } catch (err: any) {
      setStatusMessage({ text: 'Failed to retrieve complete security status', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityStatus();
  }, []);

  const handleStartSetup = async () => {
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/auth/2fa');
      const data = await res.json();
      setSetupData(data);
    } catch {
      setStatusMessage({ text: 'Failed to initiate 2FA setup.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyAndEnable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupData || confirmCode.length !== 6) return;

    setActionLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/auth/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: setupData.secret,
          token: confirmCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setIs2faEnabled(true);
      setSetupData(null);
      setConfirmCode('');
      setStatusMessage({ text: 'Two-Factor Authentication is now active on your Super Admin profile.', type: 'success' });
    } catch (err: any) {
      setStatusMessage({ text: err.message, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisable2fa = async () => {
    if (!confirm('Are you sure you want to disable 2FA? This lowers Super Admin account security.')) {
      return;
    }

    setActionLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/auth/2fa', { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to disable 2FA');

      setIs2faEnabled(false);
      setSetupData(null);
      setStatusMessage({ text: 'Two-Factor Authentication has been disabled.', type: 'success' });
    } catch (err: any) {
      setStatusMessage({ text: err.message, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStealthPath = async (newPath: string) => {
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateStealthPath', path: newPath }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update stealth path');

      setStealthAdminPath(data.stealthAdminPath);
      setCustomPathInput(data.stealthAdminPath);
      setStatusMessage({ text: data.message || 'Stealth admin path saved.', type: 'success' });
    } catch (err: any) {
      setStatusMessage({ text: err.message, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearLockouts = async (targetIp?: string) => {
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clearLockouts', ip: targetIp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to clear lockouts');

      setLockouts(data.lockouts || []);
      setStatusMessage({ text: data.message || 'Lockouts reset successfully.', type: 'success' });
    } catch (err: any) {
      setStatusMessage({ text: err.message, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Top Header */}
      <div className="border-b border-[#DCD7CC] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#52504B] tracking-[0.25em] uppercase font-bold block mb-1">
            STEALTH SUPER ADMIN GOVERNANCE
          </span>
          <h1 className="text-2xl font-black text-[#111110] uppercase tracking-tight font-display">
            Admin Security &amp; Stealth URL Protection
          </h1>
        </div>

        <button
          type="button"
          onClick={fetchSecurityStatus}
          disabled={loading || actionLoading}
          className="px-4 py-2 bg-[#EDEAE2] border border-[#DCD7CC] hover:border-[#111110] text-[#111110] text-xs uppercase tracking-wider flex items-center gap-2 font-semibold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>REFRESH AUDIT</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 border text-xs flex items-center gap-3 ${
            statusMessage.type === 'success'
              ? 'bg-[#3F4E44]/10 border-[#3F4E44] text-[#3F4E44]'
              : 'bg-[#B82328]/10 border-[#B82328] text-[#B82328]'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="font-bold">{statusMessage.text}</span>
        </div>
      )}

      {/* Grid: 2FA & Stealth URL Governance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col (7 Cols): Stealth URL & 2FA Setup */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Stealth Gateway URL Shield */}
          <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-5 shadow-editorial">
            <div className="flex items-center justify-between border-b border-[#DCD7CC] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#111110] text-white flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111110] uppercase tracking-wider">
                    Stealth Admin Gateway URL
                  </h3>
                  <p className="text-xs text-[#52504B]">Hidden login entry shielded from crawlers &amp; brute-force scans</p>
                </div>
              </div>

              <span className="text-[10px] uppercase font-bold px-3 py-1 bg-[#3F4E44]/10 border border-[#3F4E44] text-[#3F4E44]">
                404 CLOAKING ACTIVE
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#52504B] block mb-1.5">
                  Current Secret Admin Gateway URL:
                </span>
                <div className="flex items-center gap-2">
                  <div className="p-3 bg-[#F7F5F0] border border-[#DCD7CC] font-mono text-xs font-bold text-[#111110] tracking-wider flex-1 overflow-x-auto select-all">
                    {typeof window !== 'undefined' ? `${window.location.origin}${stealthAdminPath}` : stealthAdminPath}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopySecretUrl}
                    className="px-4 py-3 bg-[#111110] hover:bg-[#B82328] text-white text-[11px] uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap shadow-sm flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedUrl ? 'COPIED!' : 'COPY URL'}</span>
                  </button>
                </div>
              </div>

              {/* Cloaking Explanation */}
              <div className="p-3.5 bg-[#EDEAE2]/40 border border-[#DCD7CC] text-[11px] space-y-1.5 text-[#52504B]">
                <div className="flex items-center gap-1.5 font-bold text-[#111110]">
                  <ShieldCheck className="w-4 h-4 text-[#3F4E44]" />
                  <span>HOW THE STEALTH URL WORKS:</span>
                </div>
                <p>
                  Any unauthenticated visitor or malicious bot attempting to visit <code className="bg-white px-1 border border-[#DCD7CC]">/admin</code> or <code className="bg-white px-1 border border-[#DCD7CC]">/admin/*</code> directly is immediately returned an HTTP <strong>404 Not Found</strong> page.
                </p>
                <p>
                  Only your designated secret path above serves the authenticated Super Admin entrance, completely preventing route enumeration and password attacks.
                </p>
              </div>

              {/* Fast Presets & Custom Path Changer */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] uppercase font-bold text-[#52504B] block">
                  Quick Gateway Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  {['/sys-admin-gate', '/outside-studio-ops', '/portal-auth-9x2k'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleUpdateStealthPath(preset)}
                      disabled={actionLoading || stealthAdminPath === preset}
                      className={`px-3 py-1.5 text-[11px] border font-mono transition-colors cursor-pointer ${
                        stealthAdminPath === preset
                          ? 'bg-[#111110] text-white border-[#111110] font-bold'
                          : 'bg-white border-[#DCD7CC] text-[#111110] hover:border-[#111110]'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Two-Factor Authentication (TOTP) */}
          <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-6 shadow-editorial">
            <div className="flex items-center justify-between border-b border-[#DCD7CC] pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 flex items-center justify-center ${
                    is2faEnabled ? 'bg-[#3F4E44] text-white' : 'bg-[#EDEAE2] text-[#B82328]'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111110] uppercase tracking-wider">
                    Two-Factor Authentication (TOTP)
                  </h3>
                  <p className="text-xs text-[#52504B]">RFC 6238 Time-Based One-Time Password Standard</p>
                </div>
              </div>

              <span
                className={`text-[10px] uppercase font-bold px-3 py-1 border ${
                  is2faEnabled
                    ? 'bg-[#3F4E44]/10 border-[#3F4E44] text-[#3F4E44]'
                    : 'bg-[#B82328]/10 border-[#B82328] text-[#B82328]'
                }`}
              >
                {is2faEnabled ? 'ENFORCED & ACTIVE' : 'INACTIVE'}
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-[#52504B]">Checking security cryptographic profile...</div>
            ) : is2faEnabled ? (
              <div className="space-y-4">
                <div className="p-4 bg-[#3F4E44]/5 border border-[#3F4E44]/20 text-xs text-[#3F4E44] space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>SUPER ADMIN ACCOUNT IS CRYPTOGRAPHICALLY SECURED</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#52504B]">
                    Every login attempt to the studio requires your master password plus a dynamic 6-digit passcode
                    generated by your Authenticator app.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleDisable2fa}
                    disabled={actionLoading}
                    className="py-2.5 px-4 bg-[#FCFBF8] border border-[#B82328] hover:bg-[#B82328] text-[#B82328] hover:text-white text-xs uppercase tracking-wider font-bold transition-all cursor-pointer"
                  >
                    {actionLoading ? 'PROCESSING...' : 'DISABLE TWO-FACTOR AUTH'}
                  </button>
                </div>
              </div>
            ) : setupData ? (
              <form onSubmit={handleVerifyAndEnable} className="space-y-6 animate-fade-in">
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-[#111110] uppercase tracking-wider block">
                    STEP 1: SCAN QR CODE OR ENTER SECRET KEY
                  </span>
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-white border border-[#DCD7CC] shadow-sm">
                    <div className="w-52 h-52 bg-white border border-[#111110] p-2 flex items-center justify-center flex-shrink-0">
                      {setupData.qrDataUrl ? (
                        <img
                          src={setupData.qrDataUrl}
                          alt="Scan with Authenticator App"
                          className="w-48 h-48 object-contain"
                        />
                      ) : (
                        <div
                          className="w-48 h-48 flex items-center justify-center"
                          dangerouslySetInnerHTML={{ __html: setupData.qrSvg }}
                        />
                      )}
                    </div>
                    <div className="space-y-3.5 flex-1 overflow-hidden text-xs">
                      <p className="text-[#52504B] text-[11px] leading-relaxed">
                        Scan this QR code using <strong>Google Authenticator</strong>, <strong>Apple Passwords</strong>, <strong>1Password</strong>, or <strong>Microsoft Authenticator</strong>.
                      </p>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#52504B] block mb-1">
                          Manual Base32 Setup Secret:
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="p-2.5 bg-[#F7F5F0] border border-[#DCD7CC] font-mono text-xs font-bold text-[#111110] tracking-wider flex-1 overflow-x-auto select-all">
                            {setupData.secret}
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyKey}
                            className="px-3.5 py-2.5 bg-[#111110] hover:bg-[#B82328] text-white text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap shadow-sm"
                          >
                            {copiedSecret ? 'COPIED!' : 'COPY KEY'}
                          </button>
                        </div>
                      </div>
                      <p className="text-[10px] text-[#52504B]">
                        Account: <strong className="text-[#111110]">admin@outside.in</strong> · Issuer: <strong className="text-[#111110]">OUTSIDE</strong> · RFC 6238 TOTP (SHA1, 30s)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-[#111110] uppercase tracking-wider block">
                    STEP 2: VERIFY 6-DIGIT TOTP TOKEN
                  </span>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="123456"
                      value={confirmCode}
                      onChange={(e) => setConfirmCode(e.target.value.replace(/\D/g, ''))}
                      className="w-48 bg-[#FCFBF8] border border-[#111110] px-4 py-3 text-lg font-mono font-bold tracking-[0.4em] text-center text-[#111110] focus:border-[#B82328] focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={actionLoading || confirmCode.length !== 6}
                      className="py-3 px-6 bg-[#111110] hover:bg-[#B82328] text-white text-xs uppercase tracking-wider font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {actionLoading ? 'VERIFYING...' : 'CONFIRM & ENFORCE 2FA'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-[#52504B] leading-relaxed">
                  Protect the single Super Admin account against credential compromise by requiring a dynamic 6-digit
                  passcode generated by an Authenticator app.
                </p>
                <button
                  type="button"
                  onClick={handleStartSetup}
                  disabled={actionLoading}
                  className="py-3 px-5 bg-[#111110] hover:bg-[#B82328] text-white text-xs uppercase tracking-wider font-bold transition-all cursor-pointer"
                >
                  {actionLoading ? 'INITIALIZING...' : 'CONFIGURE TWO-FACTOR AUTH (RFC 6238)'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Col (5 Cols): Rate Limit Monitor & Rules */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 3: Login Security & Rate Limit Monitor */}
          <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-4 shadow-editorial">
            <div className="flex items-center justify-between border-b border-[#DCD7CC] pb-3">
              <h3 className="text-xs uppercase text-[#111110] font-bold tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#B82328]" />
                <span>BRUTE FORCE RATE LIMIT MONITOR</span>
              </h3>
              <span className="text-[10px] text-[#3F4E44] font-bold">5 FAILS / 15 MIN</span>
            </div>

            <p className="text-xs text-[#52504B] leading-relaxed">
              Any IP exceeding 5 consecutive failed login attempts is placed into a 15-minute freeze window.
            </p>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs p-3 bg-white border border-[#DCD7CC]">
                <span className="text-[#52504B]">Active Blocked IP Entities:</span>
                <span className="font-bold text-[#111110]">
                  {lockouts.filter((l: any) => l.lockedUntil && new Date(l.lockedUntil).getTime() > Date.now()).length} Locked
                </span>
              </div>

              {lockouts.length > 0 && (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pt-1">
                  {lockouts.map((entry: any, idx: number) => {
                    const isLocked = entry.lockedUntil && new Date(entry.lockedUntil).getTime() > Date.now();
                    return (
                      <div
                        key={idx}
                        className="p-2.5 bg-[#F7F5F0] border border-[#DCD7CC] flex items-center justify-between text-[11px]"
                      >
                        <div>
                          <span className="font-bold text-[#111110] block">{entry.ip}</span>
                          <span className="text-[#52504B]">Failed: {entry.failedAttempts} attempts</span>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-bold ${isLocked ? 'bg-[#B82328] text-white' : 'bg-[#DCD7CC] text-[#111110]'}`}>
                          {isLocked ? 'LOCKED' : 'TRACKING'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleClearLockouts()}
                  disabled={actionLoading}
                  className="w-full py-2.5 bg-[#EDEAE2] hover:bg-[#111110] hover:text-white border border-[#DCD7CC] text-[#111110] text-[11px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5 text-[#B82328]" />
                  <span>RESET FAILED COUNTERS / UNLOCK ALL IPS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: Security Architecture Checklist */}
          <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-4 shadow-editorial">
            <h3 className="text-xs font-bold text-[#111110] uppercase tracking-wider border-b border-[#DCD7CC] pb-3">
              Stealth Hardening Architecture
            </h3>
            <ul className="text-xs text-[#52504B] space-y-3 font-mono">
              <li className="flex items-start gap-2.5">
                <span className="text-[#3F4E44] font-bold">✓</span>
                <span>
                  <strong className="text-[#111110]">Zero Public Exposure:</strong> The studio route is never exposed in
                  sitemaps, header navigation, or robots.txt.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#3F4E44] font-bold">✓</span>
                <span>
                  <strong className="text-[#111110]">Strict HTTP 404 Cloaking:</strong> Visiting `/admin` unauthenticated returns 404 Not Found to cloak presence.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#3F4E44] font-bold">✓</span>
                <span>
                  <strong className="text-[#111110]">Edge Crawler Isolation:</strong> Secret gate injects <code className="text-[#111110] bg-[#EDEAE2] px-1">X-Robots-Tag: noindex, nofollow</code>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#3F4E44] font-bold">✓</span>
                <span>
                  <strong className="text-[#111110]">Session Hardening:</strong> HTTP-only cookies with{' '}
                  <code className="text-[#111110] bg-[#EDEAE2] px-1">SameSite=Strict</code> and 256-bit JWT verification.
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}

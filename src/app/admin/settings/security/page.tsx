'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, KeyRound, Smartphone, Lock, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminSecurityPage() {
  const [loading, setLoading] = useState(true);
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [setupData, setSetupData] = useState<{ secret: string; otpauthUri: string; qrSvg: string } | null>(null);
  const [confirmCode, setConfirmCode] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const fetchSecurityStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth/2fa');
      const data = await res.json();
      setIs2faEnabled(data.enabled || false);
      if (!data.enabled && data.secret) {
        setSetupData(data);
      } else {
        setSetupData(null);
      }
    } catch (err: any) {
      setStatusMessage({ text: 'Failed to retrieve 2FA status', type: 'error' });
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

  return (
    <div className="space-y-8 font-mono">
      {/* Top Header */}
      <div className="border-b border-[#DCD7CC] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#52504B] tracking-[0.25em] uppercase font-bold block mb-1">
            STEALTH SUPER ADMIN GOVERNANCE
          </span>
          <h1 className="text-2xl font-black text-[#111110] uppercase tracking-tight font-display">
            2FA Security &amp; Access Controls
          </h1>
        </div>
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

      {/* 2FA Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-6 shadow-sm">
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
                    <span>SUPER ADMIN ACCOUNT IS SECURED</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#52504B]">
                    Every login attempt to the studio requires the master password plus a dynamic 6-digit passcode
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
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-[#EDEAE2]/50 border border-[#DCD7CC]">
                    <div
                      className="w-48 h-48 bg-white border border-[#DCD7CC] p-2 flex items-center justify-center flex-shrink-0"
                      dangerouslySetInnerHTML={{ __html: setupData.qrSvg }}
                    />
                    <div className="space-y-3 overflow-hidden text-xs">
                      <p className="text-[#52504B] text-[11px] leading-relaxed">
                        Scan this QR code in Google Authenticator, 1Password, or Apple Keychain. Alternatively, enter
                        the manual setup key:
                      </p>
                      <div className="p-3 bg-[#FCFBF8] border border-[#DCD7CC] select-all">
                        <span className="font-mono text-xs font-bold text-[#111110] break-all">{setupData.secret}</span>
                      </div>
                      <p className="text-[10px] text-[#52504B]">Account: admin@outside.in · Issuer: OUTSIDE</p>
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

        {/* Security Rules & Policy Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-[#111110] uppercase tracking-wider border-b border-[#DCD7CC] pb-3">
              Stealth Super Admin Hardening
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
                  <strong className="text-[#111110]">Dynamic Stealth Mount:</strong> Configurable base path via{' '}
                  <code className="text-[#111110] bg-[#EDEAE2] px-1">ADMIN_BASE_PATH</code>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#3F4E44] font-bold">✓</span>
                <span>
                  <strong className="text-[#111110]">Strict Rate Limiting:</strong> 5 failed attempts locks out client
                  IP for 15 minutes.
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

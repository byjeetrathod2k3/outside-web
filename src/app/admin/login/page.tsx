'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck, AlertCircle, KeyRound, Smartphone, RefreshCw } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPath = searchParams.get('from');

  const adminBasePath = process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || '/outside-studio-ops';

  const [email, setEmail] = useState('admin@outside.in');
  const [password, setPassword] = useState('Admin@Outside2026!');
  const [totpCode, setTotpCode] = useState('');
  const [require2fa, setRequire2fa] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          totpCode: require2fa ? totpCode : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication rejected');
      }

      if (data.require2fa) {
        setRequire2fa(true);
        setLoading(false);
        return;
      }

      // Successful login redirect to stealth admin path or target
      const targetUrl = fromPath || adminBasePath;
      router.push(targetUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Access denied');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#FCFBF8] border border-[#DCD7CC] p-8 space-y-6 shadow-sm relative">
      {/* Header */}
      <div className="text-center space-y-2 border-b border-[#DCD7CC] pb-6">
        <div className="inline-flex p-3 rounded-none bg-[#EDEAE2] border border-[#DCD7CC] text-[#B82328] mb-2">
          {require2fa ? <Smartphone className="w-6 h-6 animate-pulse" /> : <Lock className="w-6 h-6" />}
        </div>
        <h1 className="text-xl font-display font-black text-[#111110] uppercase tracking-wider">
          {require2fa ? 'TWO-FACTOR VERIFICATION' : 'STUDIO COMMAND ACCESS'}
        </h1>
        <p className="text-xs text-[#52504B]">
          {require2fa
            ? 'ENTER 6-DIGIT PASSCODE FROM AUTHENTICATOR APP'
            : 'RESTRICTED ENTRY // OUTSIDE APPAREL STUDIO AHMEDABAD'}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-[#B82328]/10 border border-[#B82328] text-[#B82328] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#B82328] flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        {!require2fa ? (
          <>
            <div>
              <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                OPERATOR IDENTITY (EMAIL)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                AUTHENTICATION PASSCODE
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none transition-colors"
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold flex items-center justify-between">
              <span>AUTHENTICATOR 6-DIGIT TOTP CODE</span>
              <span className="text-[#3F4E44] flex items-center gap-1 font-mono text-[10px]">
                <KeyRound className="w-3 h-3" /> RFC 6238
              </span>
            </label>
            <input
              type="text"
              required
              autoFocus
              maxLength={6}
              placeholder="123456"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-[#FCFBF8] border-2 border-[#111110] px-3.5 py-3 text-lg text-center tracking-[0.5em] font-mono text-[#111110] focus:border-[#B82328] focus:outline-none transition-colors"
            />
            <p className="text-[10px] text-[#52504B] mt-2">
              Open Google Authenticator, 1Password, or your device key to retrieve the current token.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (require2fa && totpCode.length !== 6)}
          className="w-full py-3.5 bg-[#111110] hover:bg-[#B82328] text-white text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
        >
          <span>
            {loading
              ? 'VERIFYING CREDENTIALS...'
              : require2fa
              ? 'VERIFY TOTP TOKEN'
              : 'ACCESS STUDIO CONSOLE'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {require2fa && (
          <button
            type="button"
            onClick={() => {
              setRequire2fa(false);
              setTotpCode('');
              setError(null);
            }}
            className="w-full text-center text-[10px] text-[#52504B] hover:text-[#111110] transition-colors uppercase tracking-wider py-1 cursor-pointer"
          >
            &larr; BACK TO PASSWORD LOGIN
          </button>
        )}
      </form>

      <div className="pt-4 border-t border-[#DCD7CC] text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-[10px] text-[#3F4E44] bg-[#3F4E44]/10 border border-[#3F4E44]/30 px-2.5 py-1 uppercase tracking-widest font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>STEALTH SUPER ADMIN // RBAC ENFORCED</span>
        </div>
        <p className="text-[10px] text-[#52504B]">
          Demo credentials: <span className="font-bold text-[#111110]">admin@outside.in</span> /{' '}
          <span className="font-bold text-[#111110]">Admin@Outside2026!</span>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-4 font-mono antialiased">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-[#FCFBF8] border border-[#DCD7CC] p-8 flex items-center justify-center gap-2 text-xs text-[#52504B]">
            <RefreshCw className="w-4 h-4 animate-spin text-[#B82328]" />
            <span>INITIALIZING SECURITY PROTOCOLS...</span>
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}

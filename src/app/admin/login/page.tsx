'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@outside.in');
  const [password, setPassword] = useState('Admin@Outside2026!');
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
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Authentication rejected');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Access denied');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-outside-black flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-md bg-outside-charcoal border border-outside-border p-8 space-y-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="text-center space-y-2 border-b border-outside-border/80 pb-6">
          <div className="inline-flex p-3 rounded-full bg-outside-surface border border-outside-border text-outside-crimson mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-display font-black text-white uppercase tracking-wider">
            STUDIO COMMAND ACCESS
          </h1>
          <p className="text-xs text-outside-muted">
            RESTRICTED ENTRY // OUTSIDE APPAREL STUDIO AHMEDABAD
          </p>
        </div>

        {error && (
          <div className="p-3 bg-outside-surface border border-outside-crimson text-white text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-outside-crimson flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
              OPERATOR IDENTITY (EMAIL)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-outside-surface border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
              AUTHENTICATION PASSCODE
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-outside-surface border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-outside-crimson hover:bg-outside-crimsonBright text-white text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'VERIFYING CREDENTIALS...' : 'ACCESS STUDIO CONSOLE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Autofill Note */}
        <div className="pt-4 border-t border-outside-border/60 text-[10px] text-outside-muted space-y-1">
          <p className="text-outside-chalkDim font-bold uppercase">DEVELOPMENT CREDENTIALS:</p>
          <p>Email: <span className="text-white">admin@outside.in</span></p>
          <p>Passcode: <span className="text-white">Admin@Outside2026!</span></p>
        </div>

      </div>
    </div>
  );
}

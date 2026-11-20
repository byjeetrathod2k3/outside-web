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
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-4 font-mono antialiased">
      <div className="w-full max-w-md bg-[#FCFBF8] border border-[#DCD7CC] p-8 space-y-6 shadow-sm relative">
        
        {/* Header */}
        <div className="text-center space-y-2 border-b border-[#DCD7CC] pb-6">
          <div className="inline-flex p-3 rounded-none bg-[#EDEAE2] border border-[#DCD7CC] text-[#B82328] mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-display font-black text-[#111110] uppercase tracking-wider">
            STUDIO COMMAND ACCESS
          </h1>
          <p className="text-xs text-[#52504B]">
            RESTRICTED ENTRY // OUTSIDE APPAREL STUDIO AHMEDABAD
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#B82328]/10 border border-[#B82328] text-[#B82328] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#B82328] flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#111110] hover:bg-[#B82328] text-white text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <span>{loading ? 'VERIFYING CREDENTIALS...' : 'ACCESS STUDIO CONSOLE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#DCD7CC] text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[10px] text-[#3F4E44] bg-[#3F4E44]/10 border border-[#3F4E44]/30 px-2.5 py-1 uppercase tracking-widest font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-BIT SESSION RBAC ENFORCED</span>
          </div>
          <p className="text-[10px] text-[#52504B]">
            Demo credentials pre-loaded: <span className="font-bold text-[#111110]">admin@outside.in</span> / <span className="font-bold text-[#111110]">Admin@Outside2026!</span>
          </p>
        </div>

      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useVipAuth } from '@/context/vip-auth-context';
import { User, ArrowRight, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { customer, login, quickLogin, isLoading } = useVipAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (customer) {
      router.push('/account');
    }
  }, [customer, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Authentication denied. Please check your credentials.');
    } else {
      router.push('/account');
    }
  };

  const handleQuick = async (demo: 'elena' | 'aarav') => {
    setError(null);
    const result = await quickLogin(demo);
    if (!result.success) {
      setError(result.error || 'Quick login failed');
    } else {
      router.push('/account');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-[#F7F5F0] font-mono">
      <div className="w-full max-w-md bg-[#FCFBF8] border border-[#DCD7CC] p-8 sm:p-10 shadow-editorial space-y-6">
        
        {/* Brand & Login Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-[#EDEAE2] border border-[#DCD7CC] text-[#B82328] mb-2 rounded-full">
            <User className="w-6 h-6" />
          </div>
          <span className="text-[10px] text-[#B82328] uppercase tracking-[0.25em] font-bold block">
            OUTSIDE STOREFRONT
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[#111110]">
            Customer Sign In
          </h1>
          <p className="text-xs text-[#52504B] font-sans leading-relaxed">
            Access your orders, real-time shipment tracking, persistent cart, and saved delivery addresses.
          </p>
        </div>

        {/* Quick 1-Click Demo Profiles */}
        <div className="p-3.5 bg-[#EDEAE2]/60 border border-[#DCD7CC] space-y-2">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#52504B]">
            <span className="font-bold text-[#111110]">Test Credentials (1-Click Fill):</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuick('elena')}
              className="p-2 bg-[#FCFBF8] hover:bg-white border border-[#DCD7CC] text-left transition-all cursor-pointer shadow-xs"
            >
              <span className="text-[11px] font-bold text-[#111110] block">Elena Vance</span>
              <p className="text-[10px] text-[#52504B] truncate">elena.vance@outside.in</p>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuick('aarav')}
              className="p-2 bg-[#FCFBF8] hover:bg-white border border-[#DCD7CC] text-left transition-all cursor-pointer shadow-xs"
            >
              <span className="text-[11px] font-bold text-[#111110] block">Aarav Mehta</span>
              <p className="text-[10px] text-[#52504B] truncate">aarav.mehta@outside.in</p>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-[#B82328]/10 border border-[#B82328] text-[#B82328] text-xs">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#52504B] block font-bold">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-[#DCD7CC] text-xs text-[#111110] placeholder-[#A8A59D] focus:border-[#111110] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-wider text-[#52504B] font-bold">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Demo account default password is: Password123!')}
                className="text-[10px] text-[#52504B] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-[#DCD7CC] text-xs text-[#111110] placeholder-[#A8A59D] focus:border-[#111110] focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52504B] hover:text-[#111110]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#52504B] pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[#111110]"
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#111110] hover:bg-[#B82328] text-white text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md"
          >
            <span>{isLoading ? 'SIGNING IN...' : 'SIGN IN'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="pt-2 text-center text-xs text-[#52504B]">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#B82328] font-bold hover:underline">
              Create an account &rarr;
            </Link>
          </div>
        </form>

        <div className="pt-4 border-t border-[#DCD7CC] flex items-center justify-center gap-2 text-[10px] text-[#52504B]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted Session · Strict Per-User Data Isolation</span>
        </div>

      </div>
    </div>
  );
}

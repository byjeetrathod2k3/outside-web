'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useVipAuth } from '@/context/vip-auth-context';
import { UserPlus, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { customer, register, isLoading } = useVipAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [preferredFit, setPreferredFit] = useState<'WOMEN' | 'MEN' | 'UNISEX'>('WOMEN');
  const [preferredSize, setPreferredSize] = useState('M');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (customer) {
      router.push('/account');
    }
  }, [customer, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreeTerms) {
      setError('Please agree to the Terms of Service to register.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!fullName) {
      setError('Please enter your full name.');
      return;
    }

    const result = await register({
      name: fullName,
      email: email.trim(),
      phone: phone.trim() || '+91 98200 12345',
      password,
      preferredFit,
      preferredSize,
    });

    if (!result.success) {
      setError(result.error || 'Failed to create account.');
    } else {
      router.push('/account');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-[#F7F5F0] font-mono">
      <div className="w-full max-w-lg bg-[#FCFBF8] border border-[#DCD7CC] p-8 sm:p-10 shadow-editorial space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-[#EDEAE2] border border-[#DCD7CC] text-[#B82328] mb-2 rounded-full">
            <UserPlus className="w-6 h-6" />
          </div>
          <span className="text-[10px] text-[#B82328] uppercase tracking-[0.25em] font-bold block">
            CREATE CUSTOMER ACCOUNT
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[#111110]">
            Sign Up
          </h1>
          <p className="text-xs text-[#52504B] font-sans leading-relaxed">
            Create your personal customer profile. Save wishlist items, manage delivery addresses, and track orders across all your devices.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-[#B82328]/10 border border-[#B82328] text-[#B82328] text-xs">
              {error}
            </div>
          )}

          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#52504B] block font-bold">
                First Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maya"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FCFBF8] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#52504B] block font-bold">
                Last Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sharma"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FCFBF8] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#52504B] block font-bold">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="maya.sharma@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FCFBF8] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
            />
          </div>

          {/* Mobile Phone */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#52504B] block font-bold">
              Mobile Number (+91)
            </label>
            <input
              type="tel"
              placeholder="+91 98200 12345"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FCFBF8] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
            />
          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#52504B] block font-bold">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FCFBF8] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#52504B]"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#52504B] block font-bold">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FCFBF8] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
              />
            </div>
          </div>

          {/* Sizing & Fit Preference */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#52504B] block font-bold">
                Fit Preference
              </label>
              <select
                value={preferredFit}
                onChange={(e: any) => setPreferredFit(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FCFBF8] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
              >
                <option value="WOMEN">Women-First Oversized</option>
                <option value="MEN">Men Classic Boxy</option>
                <option value="UNISEX">Unisex Relaxed</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#52504B] block font-bold">
                Primary Size
              </label>
              <select
                value={preferredSize}
                onChange={(e) => setPreferredSize(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FCFBF8] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
          </div>

          {/* Terms Agreement */}
          <label className="flex items-start gap-2 pt-1 text-xs text-[#52504B] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 accent-[#111110]"
            />
            <span>
              I agree to the Terms of Service and Privacy Policy. My account information is protected under India's Digital Personal Data Protection Act (DPDP 2023).
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#111110] hover:bg-[#B82328] text-white text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md"
          >
            <span>{isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="text-center pt-2 text-xs text-[#52504B]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#B82328] font-bold hover:underline">
              Sign in to your account &rarr;
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

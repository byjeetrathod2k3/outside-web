'use client';

import React, { useState, useEffect } from 'react';
import { useVipAuth } from '@/context/vip-auth-context';
import { X, User, ArrowRight, Eye, EyeOff, ShieldCheck, CheckCircle2, Lock, UserPlus } from 'lucide-react';

export function VipAuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login, quickLogin, register, isLoading } = useVipAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sign Up Form (Full Flow)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regFit, setRegFit] = useState<'WOMEN' | 'MEN' | 'UNISEX'>('WOMEN');
  const [regSize, setRegSize] = useState('M');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState(false);
  const [passwordHint, setPasswordHint] = useState(false);

  useEffect(() => {
    if (authModalMode) {
      setTab(authModalMode);
    }
    setLoginError(null);
    setRegError(null);
  }, [authModalMode, isAuthModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    if (isAuthModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const result = await login(loginEmail, loginPassword);
    if (!result.success) {
      setLoginError(result.error || 'Invalid email or password.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!agreeTerms) {
      setRegError('Please agree to the Terms of Service to create an account.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    if (regPassword.length < 8) {
      setRegError('Password must be at least 8 characters long.');
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!fullName) {
      setRegError('Please provide your name.');
      return;
    }

    const result = await register({
      name: fullName,
      email: regEmail.trim(),
      phone: regPhone.trim() || '+91 98200 12345',
      password: regPassword,
      preferredFit: regFit,
      preferredSize: regSize,
    });

    if (!result.success) {
      setRegError(result.error || 'Failed to create account.');
    } else {
      setRegSuccess(true);
    }
  };

  const handleQuickDemo = async (demo: 'elena' | 'aarav') => {
    setLoginError(null);
    const result = await quickLogin(demo);
    if (!result.success) {
      setLoginError(result.error || 'Demo login failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-outside-ink/80 backdrop-blur-sm transition-opacity"
        onClick={closeAuthModal}
      />

      {/* Modal Dialog Container */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg bg-outside-elevated border border-outside-border shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        
        {/* Top Header Strip */}
        <div className="bg-outside-ink text-outside-elevated px-6 py-4 flex items-center justify-between border-b border-outside-border">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-outside-accent" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold">
              OUTSIDE CUSTOMER ACCOUNT
            </span>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-outside-inkSecondary hover:text-white p-1 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Log In / Sign Up */}
        <div className="grid grid-cols-2 border-b border-outside-border bg-outside-surface/50 text-xs font-mono uppercase tracking-wider">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setLoginError(null);
            }}
            className={`py-3.5 text-center font-bold transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-outside-elevated text-outside-ink border-b-2 border-outside-ink'
                : 'text-outside-inkSecondary hover:text-outside-ink'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setRegError(null);
            }}
            className={`py-3.5 text-center font-bold transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-outside-elevated text-outside-ink border-b-2 border-outside-ink'
                : 'text-outside-inkSecondary hover:text-outside-ink'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[82vh] overflow-y-auto font-mono">
          
          {tab === 'login' ? (
            /* ========================================================
               LOG IN FORM
               ======================================================== */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-[#B82328]/10 border border-[#B82328] text-[#B82328] text-xs">
                  {loginError}
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
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-[#DCD7CC] text-xs text-[#111110] placeholder-[#A8A59D] focus:border-[#111110] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] uppercase tracking-wider text-outside-inkSecondary font-bold">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginPassword('Password123!');
                      setPasswordHint(true);
                      setTimeout(() => setPasswordHint(false), 3500);
                    }}
                    className="text-[10px] text-outside-accent hover:underline font-bold cursor-pointer"
                  >
                    Demo Password (Auto-fill)
                  </button>
                </div>
                {passwordHint && (
                  <p className="text-[10px] text-outside-moss font-bold animate-fade-in">
                    ✓ Demo password auto-filled: Password123!
                  </p>
                )}
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-outside-elevated border border-outside-border text-xs text-outside-ink placeholder-outside-inkSecondary/50 focus:border-outside-accent focus:ring-1 focus:ring-outside-accent focus:outline-none pr-10 min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outside-inkSecondary hover:text-outside-ink p-1 min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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

              {/* Demo Account Quick Access Helper */}
              <div className="pt-2 border-t border-[#DCD7CC] space-y-2">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#52504B]">
                  <span>Or test with a pre-saved demo account:</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleQuickDemo('elena')}
                    className="p-2 bg-[#EDEAE2]/50 hover:bg-[#EDEAE2] border border-[#DCD7CC] text-left transition-all cursor-pointer text-xs"
                  >
                    <span className="font-bold text-[#111110] block">Elena Vance</span>
                    <span className="text-[10px] text-[#52504B]">elena.vance@outside.in</span>
                  </button>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleQuickDemo('aarav')}
                    className="p-2 bg-[#EDEAE2]/50 hover:bg-[#EDEAE2] border border-[#DCD7CC] text-left transition-all cursor-pointer text-xs"
                  >
                    <span className="font-bold text-[#111110] block">Aarav Mehta</span>
                    <span className="text-[10px] text-[#52504B]">aarav.mehta@outside.in</span>
                  </button>
                </div>
              </div>

              <div className="text-center pt-2 text-xs text-[#52504B]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-[#B82328] font-bold hover:underline"
                >
                  Create one now &rarr;
                </button>
              </div>
            </form>
          ) : (
            /* ========================================================
               SIGN UP FORM (COMPLETE NORMAL REGISTRATION FLOW)
               ======================================================== */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regError && (
                <div className="p-3 bg-[#B82328]/10 border border-[#B82328] text-[#B82328] text-xs">
                  {regError}
                </div>
              )}

              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-3">
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
                    className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
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
                    className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
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
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
                />
              </div>

              {/* Mobile Phone Number */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#52504B] block font-bold">
                  Mobile Number (+91)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98200 12345"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
                />
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#52504B] block font-bold">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="Min 8 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#52504B]"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#52504B] block font-bold">
                    Confirm Password
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
                  />
                </div>
              </div>

              {/* Optional Fit & Size Preference */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#52504B] block font-bold">
                    Fit Preference
                  </label>
                  <select
                    value={regFit}
                    onChange={(e: any) => setRegFit(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
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
                    value={regSize}
                    onChange={(e) => setRegSize(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
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

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2 pt-1 text-xs text-[#52504B] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 accent-[#111110]"
                />
                <span>
                  I agree to the Terms of Service and Privacy Policy. My account data is kept isolated and secure.
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#111110] hover:bg-[#B82328] text-white text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
              </button>

              <div className="text-center pt-2 text-xs text-[#52504B]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-[#B82328] font-bold hover:underline"
                >
                  Sign in here &rarr;
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-[#EDEAE2]/80 border-t border-[#DCD7CC] text-[10px] font-mono text-[#52504B] flex items-center justify-between">
          <span>OUTSIDE APPAREL STUDIO · AHMEDABAD</span>
          <span>SECURE ENCRYPTED SESSIONS</span>
        </div>
      </div>
    </div>
  );
}

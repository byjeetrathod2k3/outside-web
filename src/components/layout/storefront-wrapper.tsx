'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface StorefrontWrapperProps {
  children: React.ReactNode;
  maintenanceMode: boolean;
  maintenanceConfig?: {
    headline?: string;
    subline?: string;
  };
}

export function StorefrontWrapper({
  children,
  maintenanceMode,
  maintenanceConfig,
}: StorefrontWrapperProps) {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // If path is inside /admin or maintenance mode is OFF, render normal children
  if (!maintenanceMode || pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'DROP_WAITLIST',
          email,
          source: 'maintenance-screen',
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-outside-canvas text-outside-ink flex flex-col justify-between p-6 sm:p-12 font-mono selection:bg-outside-accent selection:text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-outside-border pb-6">
        <div className="relative h-12 w-12">
          <Image
            src="/images/OUTSIDE_icon.png"
            alt="OUTSIDE"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-outside-accent tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-outside-accent animate-pulse" />
          <span>STUDIO ATELIER CALIBRATION</span>
        </div>
      </div>

      {/* Main Editorial Hero */}
      <div className="max-w-2xl my-auto py-12 space-y-6">
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-outside-accent font-bold">
          LIMITED-EDITION RELEASE ARCHITECTURE // GUJARAT 24
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-outside-ink uppercase tracking-tight leading-tight">
          {maintenanceConfig?.headline || 'ATELIER IS CALIBRATING THE NEXT DROP'}
        </h1>
        <p className="text-xs sm:text-sm text-outside-inkSecondary font-sans leading-relaxed">
          {maintenanceConfig?.subline || 'DROP 002 PREPARATION UNDERWAY // AHMEDABAD STUDIO'} — Single-drop luxury streetwear produced in strictly serialized runs. The storefront is temporarily gated while inventory and pattern cutters synchronize.
        </p>

        {submitted ? (
          <div className="p-4 bg-outside-surface border border-outside-border text-xs text-outside-ink flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-outside-accent" />
            <span>YOU ARE REGISTERED FOR VIP TRANSMISSION BEFORE STOREFRONT RE-OPENS.</span>
          </div>
        ) : (
          <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3 pt-2">
            <input
              type="email"
              required
              placeholder="ENTER YOUR EMAIL FOR EARLY INVITATION"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-outside-elevated border border-outside-border px-4 py-3 text-xs text-outside-ink focus:border-outside-accent focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-outside-ink hover:bg-outside-accent text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>NOTIFY ME</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Footer Details */}
      <div className="pt-6 border-t border-outside-border flex flex-col sm:flex-row items-center justify-between text-[10px] text-outside-inkSecondary gap-3">
        <span>&copy; {new Date().getFullYear()} OUTSIDE APPAREL STUDIO PVT LTD · AHMEDABAD, GUJARAT</span>
        <Link href="/admin" className="hover:text-outside-ink font-bold uppercase tracking-widest flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-outside-accent" />
          <span>ADMIN ACCESS &rarr;</span>
        </Link>
      </div>
    </div>
  );
}

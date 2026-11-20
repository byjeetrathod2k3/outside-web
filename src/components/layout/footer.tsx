'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function GlobalFooter() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Suppress public footer in admin dashboard
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'DROP_WAITLIST',
          email,
          source: 'global-footer',
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-outside-charcoal border-t border-outside-border text-outside-chalkDim font-sans">
      
      {/* Top VIP Drop Alerts Bar */}
      <div className="border-b border-outside-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-outside-crimson font-bold">
              EARLY ACCESS CLUB // THE ARCHIVE LIST
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight uppercase">
              Never Miss A 250-Piece Serialized Drop.
            </h3>
            <p className="text-sm text-outside-muted max-w-xl leading-relaxed">
              Editions sell out within minutes. Subscribers receive direct SMS/Email early entry access 15 minutes prior to public launch. Zero marketing spam.
            </p>
          </div>

          <div className="lg:col-span-5">
            {submitted ? (
              <div className="p-4 bg-outside-surface border border-outside-crimson/50 text-white flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-outside-crimson" />
                <span className="text-xs font-mono tracking-wider">
                  SPOT SECURED. YOU WILL RECEIVE EARLY VIP ACCESS CODES.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="ENTER YOUR WORK OR PERSONAL EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-outside-surface border border-outside-border px-4 py-3.5 text-xs font-mono text-white placeholder-outside-muted focus:border-outside-crimson focus:outline-none rounded-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3.5 bg-outside-crimson hover:bg-outside-crimsonBright text-white text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <span>{loading ? 'JOINING...' : 'JOIN WAITLIST'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links & Legal Matrix */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative h-9 w-40">
            <Image
              src="/images/OUTSIDE_logo_transparent.png"
              alt="OUTSIDE"
              fill
              className="object-contain object-left invert"
            />
          </div>
          <p className="text-xs text-outside-muted leading-relaxed max-w-sm">
            Architectural silhouettes, heavyweight organic cotton, and zero overproduction. Crafted in Gujarat, India with rigorous tailoring and transparent single-drop releases.
          </p>
          <div className="pt-2 font-mono text-[11px] text-outside-muted space-y-1">
            <p>LEGAL: OUTSIDE APPAREL STUDIO PVT LTD</p>
            <p>GSTIN: 24AABCO1234F1Z5 · ORIGIN GUJARAT (24)</p>
            <p>HSN CLASSIFICATION: 61091000 (KNITTED COTTON)</p>
          </div>
        </div>

        {/* Drops & Archive */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white">COLLECTIONS</h4>
          <ul className="space-y-2.5 text-xs font-mono">
            <li>
              <Link href="/" className="hover:text-outside-crimson transition-colors">
                ACTIVE DROP // 001
              </Link>
            </li>
            <li>
              <Link href="/vault" className="hover:text-outside-crimson transition-colors">
                THE VAULT (ARCHIVE)
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-outside-crimson transition-colors">
                WOMEN-FIRST PHILOSOPHY
              </Link>
            </li>
            <li>
              <Link href="/journal" className="hover:text-outside-crimson transition-colors">
                THE OUTSIDE JOURNAL
              </Link>
            </li>
          </ul>
        </div>

        {/* Studio & Transparency */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white">STUDIO &amp; CRAFT</h4>
          <ul className="space-y-2.5 text-xs font-mono">
            <li>
              <Link href="/about" className="hover:text-outside-crimson transition-colors">
                FABRIC STANDARDS (280 GSM)
              </Link>
            </li>
            <li>
              <Link href="/size-guide" className="hover:text-outside-crimson transition-colors">
                FIT &amp; SIZE MATRIX
              </Link>
            </li>
            <li>
              <Link href="/shipping-returns" className="hover:text-outside-crimson transition-colors">
                EXPRESS SHIPPING &amp; RETURNS
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-outside-crimson transition-colors">
                CONCIERGE &amp; PRESS
              </Link>
            </li>
          </ul>
        </div>

        {/* Compliance & Legal */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white">GOVERNANCE</h4>
          <ul className="space-y-2.5 text-xs font-mono">
            <li>
              <Link href="/privacy-policy" className="hover:text-outside-crimson transition-colors">
                PRIVACY POLICY
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-outside-crimson transition-colors">
                TERMS OF SERVICE
              </Link>
            </li>
            <li>
              <Link href="/gst-compliance" className="hover:text-outside-crimson transition-colors">
                INDIAN GST INVOICING
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-outside-crimson transition-colors">
                STUDIO ADMIN PORTAL
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="border-t border-outside-border/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-mono text-outside-muted">
          <p>© {new Date().getFullYear()} OUTSIDE APPAREL STUDIO PVT LTD. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <span>CRAWLERS: GOOGLEBOT · BINGBOT · OAI-SEARCH · PERPLEXITY</span>
            <span className="text-white">MADE WITH INTENTION IN GUJARAT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

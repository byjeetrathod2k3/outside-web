'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, ArrowUpRight } from 'lucide-react';
import { useCart } from '@/context/cart-context';

export function GlobalHeader() {
  const pathname = usePathname();
  const { openCart, totalItemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Suppress public header in admin dashboard
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { label: 'ACTIVE DROP', href: '/' },
    { label: 'THE VAULT', href: '/vault' },
    { label: 'JOURNAL', href: '/journal' },
    { label: 'ABOUT', href: '/about' },
    { label: 'CONTACT', href: '/contact' },
  ];

  return (
    <>
      {/* Top Velocity Ticker Bar */}
      <div className="bg-outside-crimson text-white text-[11px] font-mono uppercase tracking-widest py-1.5 px-4 text-center flex items-center justify-center gap-3 overflow-hidden select-none">
        <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
        <span>DROP 001 LIVE // LIMITED TO 250 SERIALIZED PIECES · GUJARAT STUDIO CRAFT</span>
        <span className="hidden md:inline text-white/70">|</span>
        <span className="hidden md:inline text-white/90">FREE EXPRESS SHIPPING ACROSS INDIA</span>
      </div>

      <header className="sticky top-0 z-40 w-full bg-outside-black/90 backdrop-blur-md border-b border-outside-border/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo with transparent PNG */}
          <Link href="/" className="relative flex items-center gap-3 group focus:outline-none">
            <div className="relative h-10 w-36 sm:w-44 transition-transform group-hover:scale-[1.02]">
              <Image
                src="/images/OUTSIDE_logo_transparent.png"
                alt="OUTSIDE Luxury Apparel Studio"
                fill
                priority
                className="object-contain object-left invert"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-mono uppercase tracking-[0.2em] transition-colors ${
                    isActive
                      ? 'text-outside-crimson font-bold'
                      : 'text-outside-chalkDim hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs: Admin & Cart */}
          <div className="flex items-center gap-5">
            <Link
              href="/admin"
              className="hidden lg:flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-outside-muted hover:text-white transition-colors"
              title="Studio Admin Access"
            >
              <span>STUDIO</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              aria-label="Open Shopping Bag"
              className="relative p-2.5 rounded-full bg-outside-surface hover:bg-outside-card border border-outside-border text-white transition-all hover:border-outside-crimson flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-outside-crimson"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-outside-crimson text-white text-[10px] font-bold font-mono h-5 w-5 rounded-full flex items-center justify-center animate-fade-in shadow-lg">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
              className="md:hidden p-2 text-white hover:text-outside-crimson transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Slide-Down */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-outside-black/98 border-b border-outside-border px-6 py-8 animate-slide-down">
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-mono uppercase tracking-[0.25em] ${
                    pathname === link.href ? 'text-outside-crimson' : 'text-outside-chalk'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-6 border-t border-outside-border/60 flex items-center justify-between text-xs font-mono text-outside-muted">
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">
                  STUDIO ADMIN &rarr;
                </Link>
                <span>AHMEDABAD, GUJARAT</span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

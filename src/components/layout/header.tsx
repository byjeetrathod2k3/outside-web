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
      {/* Top Velocity Ticker Bar (Swiss Architectural Hairline) */}
      <div className="bg-outside-ink text-outside-elevated text-[11px] font-mono uppercase tracking-[0.2em] py-2 px-4 text-center flex items-center justify-center gap-3 select-none border-b border-outside-border">
        <span className="inline-block w-2 h-2 rounded-full bg-outside-accent animate-pulse" />
        <span className="font-bold">DROP 001 LIVE // BETTER DAYS AHEAD · 250 SERIALIZED PIECES</span>
        <span className="hidden md:inline text-outside-elevated/40">|</span>
        <span className="hidden md:inline text-outside-elevated/80 font-normal">GUJARAT ATELIER CRAFT · FREE DOMESTIC EXPRESS SHIPPING</span>
      </div>

      <header className="sticky top-0 z-40 w-full frosted-alabaster transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Standalone Brand Emblem (Pure Icon Mark) */}
          <Link href="/" className="relative flex items-center group focus:outline-none" aria-label="OUTSIDE Home">
            <div className="relative h-11 w-11 sm:h-12 sm:w-12 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/OUTSIDE_icon.png"
                alt="OUTSIDE"
                fill
                priority
                className="object-contain"
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
                  className={`text-xs font-mono uppercase tracking-[0.2em] transition-all relative py-1 ${
                    isActive
                      ? 'text-outside-ink font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-outside-accent'
                      : 'text-outside-inkSecondary hover:text-outside-ink'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs: Studio Portal & Cart Bag */}
          <div className="flex items-center gap-5">
            <Link
              href="/admin"
              className="hidden lg:flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-outside-inkSecondary hover:text-outside-ink transition-colors"
              title="Studio Command Console"
            >
              <span>STUDIO</span>
              <ArrowUpRight className="w-3 h-3 text-outside-accent" />
            </Link>

            {/* Shopping Bag Trigger */}
            <button
              onClick={openCart}
              aria-label="Open Shopping Bag"
              className="relative p-2.5 rounded-none bg-outside-surface hover:bg-outside-elevated text-outside-ink border border-outside-border transition-all hover:border-outside-ink flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-outside-accent"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-outside-accent text-white text-[10px] font-bold font-mono h-5 w-5 flex items-center justify-center shadow-xs">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
              className="md:hidden p-2 text-outside-ink hover:text-outside-accent transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-outside-elevated border-b border-outside-border px-6 py-8 animate-slide-down shadow-gallery">
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-mono uppercase tracking-[0.25em] ${
                    pathname === link.href ? 'text-outside-accent font-bold' : 'text-outside-ink'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-6 border-t border-outside-border flex items-center justify-between text-xs font-mono text-outside-inkSecondary">
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="hover:text-outside-ink font-bold">
                  STUDIO COMMAND &rarr;
                </Link>
                <span>AHMEDABAD, GUJARAT (24)</span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

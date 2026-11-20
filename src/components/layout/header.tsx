'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';

interface GlobalHeaderProps {
  initialTheme?: any;
  initialFlags?: any[];
}

export function GlobalHeader({ initialTheme, initialFlags }: GlobalHeaderProps) {
  const pathname = usePathname();
  const { totalItemsCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Suppress public header in admin dashboard
  if (pathname.startsWith('/admin')) {
    return null;
  }

  // Resolve dynamic feature flags & theme
  const announcementFlag = initialFlags?.find((f: any) => f.key === 'enable_announcement_bar');
  const showAnnouncement = announcementFlag ? announcementFlag.isEnabled : true;
  const announcementText =
    announcementFlag?.configJson?.text ||
    'DROP 001 LIVE // BETTER DAYS AHEAD · 250 SERIALIZED PIECES · FREE DOMESTIC EXPRESS SHIPPING';
  const announcementLink = announcementFlag?.configJson?.link || '/';

  const showVault = initialFlags?.find((f: any) => f.key === 'enable_vault_archive')?.isEnabled !== false;
  const showJournal = initialFlags?.find((f: any) => f.key === 'enable_journal')?.isEnabled !== false;

  const logoUrl = initialTheme?.logoUrl || '/images/OUTSIDE_icon.png';
  const isGlass = initialTheme?.glassmorphism !== false;

  const navLinks = [
    { label: 'ACTIVE DROP', href: '/' },
    ...(showVault ? [{ label: 'THE VAULT', href: '/vault' }] : []),
    ...(showJournal ? [{ label: 'JOURNAL', href: '/journal' }] : []),
    { label: 'ABOUT', href: '/about' },
    { label: 'CONTACT', href: '/contact' },
  ];

  return (
    <>
      {/* Top Velocity Ticker Bar (Swiss Architectural Hairline) */}
      {showAnnouncement && (
        <div className="bg-outside-ink text-outside-elevated text-[11px] font-mono uppercase tracking-[0.2em] py-2 px-4 text-center flex items-center justify-center gap-3 select-none border-b border-outside-border">
          <span className="inline-block w-2 h-2 rounded-full bg-outside-accent animate-pulse" />
          <Link href={announcementLink} className="hover:underline flex items-center gap-2">
            <span className="font-bold">{announcementText}</span>
          </Link>
        </div>
      )}

      <header
        className={`sticky top-0 z-40 w-full transition-all ${
          isGlass
            ? 'bg-outside-canvas/90 backdrop-blur-md border-b border-outside-border'
            : 'bg-outside-canvas border-b border-outside-border'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Standalone Brand Emblem (Pure Icon Mark) */}
          <Link href="/" className="relative flex items-center group focus:outline-none" aria-label="OUTSIDE Home">
            <div className="relative h-11 w-11 sm:h-12 sm:w-12 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={logoUrl}
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

          {/* Action Utilities */}
          <div className="flex items-center gap-4">
            
            {/* Shopping Bag Trigger */}
            <button
              onClick={openCart}
              aria-label="Open Shopping Bag"
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-outside-ink hover:text-outside-accent transition-colors group focus:outline-none cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-105" />
              {totalItemsCount > 0 && (
                <span className="absolute top-1 right-1 bg-outside-accent text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center animate-fade-in shadow-sm">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-outside-ink hover:text-outside-accent transition-colors cursor-pointer"
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

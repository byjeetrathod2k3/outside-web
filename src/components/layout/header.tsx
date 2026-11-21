'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { ShoppingBag, Menu, X, ArrowRight, MapPin, ChevronDown } from 'lucide-react';
import { PincodeModal } from '@/components/commerce/pincode-modal';
import { estimateDelivery } from '@/lib/pincode';
import ShinyText from '@/components/reactbits/ShinyText/ShinyText';

interface GlobalHeaderProps {
  initialTheme?: any;
  initialFlags?: any[];
}

export function GlobalHeader({ initialTheme, initialFlags }: GlobalHeaderProps) {
  const pathname = usePathname();
  const { totalItemsCount, openCart, buyerPincode, openPincodeModal } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const deliveryInfo = buyerPincode ? estimateDelivery(buyerPincode) : null;
  const shortCity = deliveryInfo?.city ? deliveryInfo.city.split('/')[0].trim() : 'Ahmedabad';

  const adminBasePath = process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || '/outside-studio-ops';

  // Suppress public header in admin dashboard (both /admin and stealth base path)
  if (pathname.startsWith('/admin') || pathname.startsWith(adminBasePath)) {
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
    { label: 'LOOKBOOK', href: '/lookbook' },
    { label: 'THE CRAFT', href: '/craft' },
    ...(showVault ? [{ label: 'THE VAULT', href: '/vault' }] : []),
    ...(showJournal ? [{ label: 'JOURNAL', href: '/journal' }] : []),
    { label: 'FIT ROOM', href: '/size-guide' },
    { label: 'TRACK', href: '/track' },
  ];

  return (
    <>
      {/* Top Velocity Ticker Bar (Swiss Architectural Hairline) */}
      {showAnnouncement && (
        <div className="bg-outside-ink text-outside-elevated text-[11px] font-mono uppercase tracking-[0.2em] py-2 px-4 text-center flex items-center justify-center gap-3 select-none border-b border-outside-border">
          <span className="inline-block w-2 h-2 rounded-full bg-outside-accent animate-pulse" />
          <Link href={announcementLink} className="hover:underline flex items-center gap-2">
            <ShinyText
              text={announcementText}
              speed={3.5}
              color="#EDEAE2"
              shineColor="#FFFFFF"
              className="font-bold tracking-[0.2em]"
            />
          </Link>
        </div>
      )}

      <header
        className={`sticky top-0 z-40 w-full transition-all ${
          isGlass
            ? 'bg-outside-canvas/98 backdrop-blur-md border-b border-outside-border'
            : 'bg-outside-canvas border-b border-outside-border'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* 1. Left: Brand Emblem */}
          <div className="shrink-0 flex items-center">
            <Link
              href="/"
              className="relative flex items-center group focus:outline-none shrink-0"
              aria-label="OUTSIDE Home"
            >
              <div className="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0">
                <Image
                  src={logoUrl}
                  alt="OUTSIDE"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* 2. Center: Desktop Navigation (Balanced & Equidistant) */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8 shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] xl:text-xs font-mono uppercase tracking-[0.16em] xl:tracking-[0.2em] whitespace-nowrap transition-colors relative py-1.5 ${
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

          {/* 3. Right: Action Utilities */}
          <div className="shrink-0 flex items-center gap-2.5 sm:gap-3.5">
            {/* Delivery Location Pill */}
            <button
              onClick={openPincodeModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-outside-border bg-outside-surface/60 hover:bg-outside-surface text-[10px] sm:text-[11px] font-mono text-outside-inkSecondary hover:text-outside-ink transition-colors cursor-pointer group shrink-0"
              title="Change Delivery Location"
            >
              <MapPin className="w-3.5 h-3.5 text-outside-accent shrink-0" />
              <span className="font-bold text-outside-ink underline underline-offset-2 decoration-outside-border group-hover:decoration-outside-accent">
                {shortCity}
              </span>
              <span className="hidden sm:inline text-[10px] text-outside-inkSecondary">
                ({buyerPincode || '380015'})
              </span>
              <ChevronDown className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>

            {/* Shopping Bag Trigger */}
            <button
              onClick={openCart}
              aria-label="Open Shopping Bag"
              className="relative min-w-[40px] min-h-[40px] flex items-center justify-center p-2 text-outside-ink hover:text-outside-accent transition-colors focus:outline-none cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute top-1 right-1 bg-outside-accent text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile / Tablet Hamburger Trigger (Visible below lg) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
              className="lg:hidden min-w-[40px] min-h-[40px] flex items-center justify-center p-2 text-outside-ink hover:text-outside-accent transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Navigation Drawer (Visible below lg) */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-outside-elevated border-b border-outside-border px-6 py-8 animate-slide-down shadow-gallery">
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-mono uppercase tracking-[0.25em] flex items-center justify-between py-1.5 transition-colors ${
                    pathname === link.href ? 'text-outside-accent font-bold' : 'text-outside-ink hover:text-outside-accent'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 opacity-40" />
                </Link>
              ))}
              <div className="pt-6 border-t border-outside-border flex items-center justify-between text-xs font-mono text-outside-inkSecondary">
                <span className="font-bold tracking-wider text-outside-ink">WEAR YOUR STORY // INDIA</span>
                <span>AHMEDABAD, INDIA</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Upfront Delivery Pincode Modal */}
      <PincodeModal />
    </>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { useVipAuth } from '@/context/vip-auth-context';
import {
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  MapPin,
  ChevronDown,
  Heart,
  Search,
  Crown,
  User,
  Package,
  MapPinned,
  CreditCard,
  Sliders,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { PincodeModal } from '@/components/commerce/pincode-modal';
import { SearchModal } from '@/components/commerce/search-modal';
import { estimateDelivery } from '@/lib/pincode';

interface GlobalHeaderProps {
  initialTheme?: any;
  initialFlags?: any[];
}

export function GlobalHeader({ initialTheme, initialFlags }: GlobalHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItemsCount, openCart, buyerPincode, openPincodeModal, wishlistCount, openWishlist } = useCart();
  const { customer, logout, openAuthModal } = useVipAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const deliveryInfo = buyerPincode ? estimateDelivery(buyerPincode) : null;
  const shortCity = deliveryInfo?.city ? deliveryInfo.city.split('/')[0].trim() : 'Ahmedabad';

  const adminBasePath = process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || '/sys-admin-gate';

  // Suppress public header in admin dashboard
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith(adminBasePath) ||
    pathname.startsWith('/outside-studio-ops') ||
    pathname.startsWith('/portal-auth-9x2k')
  ) {
    return null;
  }

  const logoUrl = initialTheme?.logoUrl || '/images/OUTSIDE_icon.png';
  const isGlass = initialTheme?.glassmorphism !== false;

  const desktopNavLinks = [
    { label: 'ACTIVE DROP', href: '/' },
    { label: 'LOOKBOOK', href: '/lookbook' },
    { label: 'THE CRAFT', href: '/craft' },
    { label: 'THE VAULT', href: '/vault' },
  ];

  const mobileNavLinks = [
    { label: 'Active Drop', href: '/' },
    { label: 'Lookbook', href: '/lookbook' },
    { label: 'The Craft', href: '/craft' },
    { label: 'The Vault', href: '/vault' },
    { label: 'Journal', href: '/journal' },
    { label: 'Fit Room & Sizing', href: '/size-guide' },
    { label: 'Track Shipment', href: '/track' },
  ];

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    await logout();
    router.push('/');
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'GOLD':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'BLACK_EDITION':
        return 'bg-[#111110] text-[#EDEAE2] border-[#383632]';
      case 'SILVER':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      default:
        return 'bg-[#EDEAE2] text-[#111110] border-[#DCD7CC]';
    }
  };

  return (
    <>
      {/* Main Navigation Header (Single-Row Luxury Minimal) */}
      <header
        className={`sticky top-0 z-40 w-full transition-all ${
          isGlass
            ? 'bg-outside-elevated/95 backdrop-blur-md border-b border-outside-border'
            : 'bg-outside-elevated border-b border-outside-border'
        }`}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          
          {/* Left Column: Mobile Hamburger & Desktop Brand Emblem (Balanced flex-1) */}
          <div className="flex items-center justify-start lg:flex-1">
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 text-outside-ink hover:text-outside-accent transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Brand Logo (Centered on mobile via absolute, left-docked on desktop) */}
            <div className="flex items-center absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <Link
                href="/"
                className="relative flex items-center group focus:outline-none shrink-0"
                aria-label="OUTSIDE Home"
              >
                <div className="relative h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-105">
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
          </div>

          {/* Center Column: Desktop Navigation Links (True Optical & Mathematical Centering) */}
          <nav className="hidden lg:flex items-center justify-center gap-8 xl:gap-10 shrink-0 font-mono">
            {desktopNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] xl:text-xs uppercase tracking-[0.2em] whitespace-nowrap transition-all pb-1 ${
                    isActive
                      ? 'text-outside-ink font-bold border-b-2 border-outside-accent'
                      : 'text-outside-inkSecondary hover:text-outside-ink border-b-2 border-transparent hover:border-outside-ink/30'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Column: Action Utilities (Balanced flex-1) */}
          <div className="flex items-center justify-end lg:flex-1 gap-1.5 sm:gap-2.5">
            {/* Desktop Only: Search Drops Trigger */}
            <button
              onClick={() => setSearchModalOpen(true)}
              aria-label="Search Drops"
              title="Search Drops (ESC)"
              className="hidden lg:flex min-w-[40px] min-h-[40px] items-center justify-center p-2 rounded-full text-outside-ink hover:text-outside-accent hover:bg-outside-surface/60 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Desktop Only: Wishlist Icon with badge */}
            <button
              onClick={openWishlist}
              aria-label="Saved Pieces"
              title="Saved Wishlist"
              className="hidden lg:flex relative min-w-[40px] min-h-[40px] items-center justify-center p-2 rounded-full text-outside-ink hover:text-outside-accent hover:bg-outside-surface/60 transition-colors cursor-pointer"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-outside-accent text-white text-[9px] font-mono font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Icon with badge */}
            <button
              onClick={openCart}
              aria-label="Shopping Bag"
              title="Shopping Bag"
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full text-outside-ink hover:text-outside-accent hover:bg-outside-surface/60 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItemsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-outside-accent text-white text-[9px] font-mono font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Account Entry Point: Customer Dropdown or VIP Login Button */}
            {customer ? (
              /* Authenticated Customer: Personalized User Menu Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-outside-border bg-outside-elevated hover:bg-outside-surface text-xs font-mono font-bold text-outside-ink transition-colors cursor-pointer shadow-xs min-h-[40px]"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-5 h-5 rounded-full bg-outside-ink text-outside-elevated flex items-center justify-center text-[10px] font-bold">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[11px] font-bold truncate max-w-[100px]">
                    {customer.name.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-outside-inkSecondary transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-outside-elevated border border-outside-border shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden font-mono">
                    
                    {/* Header Summary Card */}
                    <div className="p-4 bg-outside-surface/70 border-b border-outside-border space-y-1">
                      <span className="text-[10px] text-outside-accent uppercase tracking-widest font-bold block">
                        MY ACCOUNT
                      </span>
                      <p className="text-xs font-bold text-outside-ink truncate">{customer.name}</p>
                      <p className="text-[11px] text-outside-inkSecondary truncate">{customer.email}</p>
                      {customer.vipTier && (
                        <div className="pt-1.5 flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5 text-amber-500" />
                          <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${getTierColor(customer.vipTier)}`}>
                            {customer.vipTier.replace('_', ' ')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quick Navigation Links */}
                    <div className="py-1 text-xs">
                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-outside-surface text-outside-ink transition-colors"
                      >
                        <User className="w-4 h-4 text-outside-inkSecondary" />
                        <span>Account Overview</span>
                      </Link>

                      <Link
                        href="/account?tab=orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-outside-surface text-outside-ink transition-colors"
                      >
                        <Package className="w-4 h-4 text-outside-inkSecondary" />
                        <span>Orders &amp; Dispatches</span>
                      </Link>

                      <Link
                        href="/account?tab=addresses"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-outside-surface text-outside-ink transition-colors"
                      >
                        <MapPinned className="w-4 h-4 text-outside-inkSecondary" />
                        <span>Saved Addresses</span>
                      </Link>

                      <Link
                        href="/account?tab=preferences"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-outside-surface text-outside-ink transition-colors"
                      >
                        <Sliders className="w-4 h-4 text-outside-inkSecondary" />
                        <span>Style Preferences</span>
                      </Link>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-2 border-t border-outside-border bg-outside-surface/40">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-outside-accent hover:bg-outside-surface transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Desktop VIP Login Pill Button (Reference Mockup) */
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-outside-ink hover:bg-outside-ink/90 text-outside-elevated text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs ml-1 min-h-[40px]"
                aria-label="VIP Login"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>VIP LOGIN</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile / Tablet Full-Screen Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-outside-elevated border-b border-outside-border px-6 py-6 animate-in slide-in-from-top-4 duration-200 shadow-xl font-mono max-h-[calc(100vh-56px)] overflow-y-auto">
            <div className="flex flex-col gap-4">
              
              {/* Mobile Account Status Card */}
              {customer ? (
                <div className="p-4 bg-outside-surface/80 border border-outside-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-outside-accent uppercase font-bold tracking-widest">
                      LOGGED IN
                    </span>
                    <span className="text-[10px] text-outside-inkSecondary font-mono">
                      {customer.email}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-outside-ink">{customer.name}</div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-outside-border">
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-outside-accent font-bold hover:underline"
                    >
                      View Account &rarr;
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-outside-inkSecondary hover:text-outside-ink"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-outside-surface/60 border border-outside-border flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-outside-ink">VIP CUSTOMER ACCESS</div>
                    <div className="text-[10px] text-outside-inkSecondary">Saved pieces, orders, and addresses</div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="min-h-[44px] px-4 py-2 bg-outside-ink text-outside-elevated text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:bg-outside-accent transition-colors"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>LOG IN</span>
                  </button>
                </div>
              )}

              {/* Pincode & Delivery Selector in Mobile Drawer */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openPincodeModal();
                }}
                className="min-h-[44px] w-full flex items-center justify-between px-3.5 py-2.5 bg-outside-surface/40 border border-outside-border text-xs text-outside-ink text-left cursor-pointer hover:border-outside-ink"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-outside-accent" />
                  <span>
                    {buyerPincode ? `Delivering to ${shortCity} (${buyerPincode})` : 'Check Delivery Pincode'}
                  </span>
                </div>
                <span className="text-[10px] text-outside-accent font-bold uppercase">Change</span>
              </button>

              {/* Search Drops Button in Mobile Drawer */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchModalOpen(true);
                }}
                className="min-h-[44px] w-full flex items-center gap-2.5 px-3.5 py-2.5 bg-outside-surface/40 border border-outside-border text-xs text-outside-inkSecondary text-left cursor-pointer hover:text-outside-ink"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Drops &amp; Archives...</span>
              </button>

              {/* Navigation Links */}
              <div className="space-y-1 pt-1">
                {mobileNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`min-h-[44px] text-sm font-mono uppercase tracking-[0.2em] flex items-center justify-between px-2 border-b border-outside-border/40 transition-colors ${
                      pathname === link.href ? 'text-outside-accent font-bold' : 'text-outside-ink hover:text-outside-accent'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-40" />
                  </Link>
                ))}
              </div>

              {/* Saved Items Link in Mobile Drawer */}
              <div className="pt-2 flex items-center justify-between text-xs text-outside-inkSecondary border-t border-outside-border">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openWishlist();
                  }}
                  className="min-h-[44px] flex items-center gap-1.5 hover:text-outside-ink cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 text-outside-accent" />
                  <span>SAVED PIECES ({wishlistCount})</span>
                </button>
                <span className="text-[10px] uppercase tracking-wider">AHMEDABAD, INDIA</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Upfront Delivery Pincode Modal */}
      <PincodeModal />

      {/* Catalog Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}

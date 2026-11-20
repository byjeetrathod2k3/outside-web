'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Users,
  Settings,
  Mail,
  FileText,
  LogOut,
  ExternalLink,
  Palette,
  Sliders,
  Grid,
  Menu,
  X,
  Globe,
  ShieldCheck,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const base = process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || '/outside-studio-ops';

  const mainNav = [
    { label: 'OVERVIEW', href: `${base}`, icon: LayoutDashboard },
    { label: 'DROP MANAGER', href: `${base}/drops`, icon: Layers },
    { label: 'ORDERS & INVOICES', href: `${base}/orders`, icon: ShoppingBag },
    { label: 'WAITLIST & CRM', href: `${base}/leads`, icon: Users },
    { label: 'HEADLESS CMS', href: `${base}/cms`, icon: FileText },
  ];

  const designNav = [
    { label: 'APPEARANCE & THEME', href: `${base}/appearance`, icon: Palette },
    { label: 'FEATURE FLAGS', href: `${base}/features`, icon: Sliders },
    { label: 'LAYOUT & DENSITY', href: `${base}/layout`, icon: Grid },
    { label: 'SEO, AEO & VIRAL', href: `${base}/seo`, icon: Globe },
  ];

  const settingsNav = [
    { label: 'GST (GUJARAT 24)', href: `${base}/settings/gst`, icon: Settings },
    { label: 'EMAIL ENGINE', href: `${base}/settings/email`, icon: Mail },
    { label: '2FA & SECURITY', href: `${base}/settings/security`, icon: ShieldCheck },
  ];

  const isItemActive = (href: string) => {
    if (pathname === href) return true;
    if (pathname === href.replace(base, '/admin')) return true;
    if (href === base && (pathname === '/admin' || pathname === base)) return true;
    return false;
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push(`${base}/login`);
      router.refresh();
    } catch {
      router.push(`${base}/login`);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Top Bar (< 768px) */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between p-4 bg-[#EDEAE2] border-b border-[#DCD7CC] w-full">
        <Link href="/" target="_blank" className="flex items-center gap-2">
          <div className="relative w-7 h-7 flex-shrink-0">
            <Image
              src="/images/OUTSIDE_icon.png"
              alt="OUTSIDE"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-[#111110] font-black tracking-widest text-sm font-display uppercase">
            STUDIO COMMAND
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation Drawer"
          className="w-11 h-11 flex items-center justify-center bg-[#FCFBF8] border border-[#DCD7CC] text-[#111110] cursor-pointer hover:bg-[#EDEAE2] transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Sidebar (Desktop fixed / Mobile collapsible modal drawer) */}
      <aside
        className={`${
          mobileOpen ? 'block fixed inset-x-0 top-[73px] bottom-0 z-50 overflow-y-auto bg-[#EDEAE2]' : 'hidden'
        } md:static md:flex md:top-auto md:bottom-auto md:overflow-y-visible w-full md:w-64 bg-[#EDEAE2] border-r border-[#DCD7CC] flex-col justify-between flex-shrink-0 z-30 transition-all`}
      >
        <div className="overflow-y-auto">
          {/* Logo & Studio Identifier (Desktop) */}
          <div className="hidden md:block p-6 border-b border-[#DCD7CC] bg-[#EDEAE2]">
            <Link href="/" target="_blank" className="flex items-center gap-2.5 group">
              <div className="relative w-6 h-6 flex-shrink-0">
                <Image
                  src="/images/OUTSIDE_icon.png"
                  alt="OUTSIDE"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[#111110] font-black tracking-widest text-base font-display uppercase">
                OUTSIDE
              </span>
              <span className="px-1.5 py-0.5 bg-[#FCFBF8] border border-[#DCD7CC] text-[9px] text-[#52504B] uppercase tracking-widest font-mono">
                OPS v1.0
              </span>
              <ExternalLink className="w-3 h-3 text-[#52504B] group-hover:text-[#111110] transition-colors" />
            </Link>
            <p className="text-[10px] text-[#52504B] mt-1.5 uppercase tracking-wider font-mono">
              STEALTH // SUPER_ADMIN
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs">
            <span className="px-3 text-[10px] text-[#52504B] uppercase tracking-widest block mb-2 font-bold">
              COMMERCE &amp; RELEASES
            </span>
            {mainNav.map((item) => {
              const active = isItemActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 min-h-[44px] transition-colors font-medium border ${
                    active
                      ? 'bg-[#FCFBF8] border-[#111110] text-[#111110] font-bold shadow-sm'
                      : 'border-transparent text-[#52504B] hover:text-[#111110] hover:bg-[#FCFBF8]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#B82328]' : 'text-[#52504B]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Design & Dynamic Governance */}
            <div className="pt-4 mt-4 border-t border-[#DCD7CC]">
              <span className="px-3 text-[10px] text-[#52504B] uppercase tracking-widest block mb-2 font-bold">
                DESIGN &amp; DYNAMIC GOVERNANCE
              </span>
              {designNav.map((item) => {
                const active = isItemActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 min-h-[44px] transition-colors font-medium border ${
                      active
                        ? 'bg-[#FCFBF8] border-[#111110] text-[#111110] font-bold shadow-sm'
                        : 'border-transparent text-[#52504B] hover:text-[#111110] hover:bg-[#FCFBF8]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#B82328]' : 'text-[#52504B]'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Compliance & Settings */}
            <div className="pt-4 mt-4 border-t border-[#DCD7CC]">
              <span className="px-3 text-[10px] text-[#52504B] uppercase tracking-widest block mb-2 font-bold">
                COMPLIANCE &amp; SECURITY
              </span>
              {settingsNav.map((item) => {
                const active = isItemActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 min-h-[44px] transition-colors font-medium border ${
                      active
                        ? 'bg-[#FCFBF8] border-[#111110] text-[#111110] font-bold shadow-sm'
                        : 'border-transparent text-[#52504B] hover:text-[#111110] hover:bg-[#FCFBF8]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#B82328]' : 'text-[#52504B]'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* User Session & Logout */}
        <div className="p-4 border-t border-[#DCD7CC] bg-[#EDEAE2] space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-none bg-[#111110] text-[#FCFBF8] font-bold flex items-center justify-center text-xs flex-shrink-0">
              SA
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold text-[#111110] truncate">admin@outside.in</p>
              <p className="text-[9px] text-[#52504B]">SUPER_ADMIN · AHMEDABAD</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2 px-3 bg-[#FCFBF8] border border-[#DCD7CC] hover:border-[#B82328] hover:bg-[#EDEAE2] text-[10px] text-[#52504B] hover:text-[#111110] uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? 'TERMINATING...' : 'TERMINATE SESSION'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

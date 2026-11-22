'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '919876543210';
const DEFAULT_MESSAGE =
  'Hello OUTSIDE, I have a question regarding DROP 001 sizing, fabric drape or express delivery to my city.';

export function WhatsAppConcierge() {
  const pathname = usePathname();
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const adminBasePath = process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || '/outside-studio-ops';

  useEffect(() => {
    const handleScroll = () => {
      // FIX 5: Hero section is 580px - 640px high. Hide chat widget while user is in the hero fold
      // to eliminate any overlap with right-edge macro detail cards or hero artwork.
      const threshold = pathname === '/' ? 520 : 100;
      setScrolledPastHero(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Do not render on admin, checkout, or while inside the hero fold
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith(adminBasePath) ||
    !scrolledPastHero
  ) {
    return null;
  }

  const encodedMsg = encodeURIComponent(DEFAULT_MESSAGE);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 font-mono select-none group transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
      {/* Sleek Hover Tooltip */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-outside-ink/95 backdrop-blur-md text-outside-surface border border-outside-inkSecondary/40 shadow-luxury opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
        <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
        <span className="text-[10px] uppercase tracking-wider font-bold">Studio Stylist · Online Now</span>
      </div>

      {/* Main WhatsApp Trigger: Compact Circular Floating Button at bottom-5 right-5 */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with OUTSIDE Stylist on WhatsApp"
        className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-outside-ink hover:bg-[#25D366] text-outside-surface hover:text-white border border-outside-inkSecondary/40 shadow-luxury flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
        title="Chat with OUTSIDE Stylist on WhatsApp"
      >
        {/* Pulsing Online Ping */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366] border border-outside-ink" />
        </span>

        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current stroke-none" />
      </a>
    </div>
  );
}
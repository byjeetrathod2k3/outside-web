'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Sparkles, ArrowUpRight } from 'lucide-react';

const WHATSAPP_NUMBER = '919876543210';
const DEFAULT_MESSAGE =
  'Hello OUTSIDE Concierge, I have a question regarding DROP 001 sizing, fabric drape or express delivery to my city.';

export function WhatsAppConcierge() {
  const pathname = usePathname();
  const [isTooltipOpen, setIsTooltipOpen] = useState(true);
  const adminBasePath = process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || '/outside-studio-ops';

  // Do not render on admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith(adminBasePath)) {
    return null;
  }

  const encodedMsg = encodeURIComponent(DEFAULT_MESSAGE);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 font-mono select-none">
      
      {/* Floating Guidance Balloon / Tooltip */}
      {isTooltipOpen && (
        <div className="relative max-w-xs bg-outside-elevated border border-outside-border p-3.5 shadow-2xl rounded-lg animate-slide-up text-left">
          <button
            onClick={() => setIsTooltipOpen(false)}
            className="absolute top-2 right-2 p-1 text-outside-inkSecondary hover:text-outside-ink transition-colors rounded cursor-pointer"
            aria-label="Dismiss concierge prompt"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1.5 text-outside-accent text-[10px] font-bold tracking-widest uppercase mb-1">
            <Sparkles className="w-3 h-3" />
            <span>ATELIER CONCIERGE</span>
          </div>
          <p className="text-[11px] text-outside-ink leading-snug font-sans pr-4">
            Need help deciding between Women-First and Men silhouette? Speak directly with our Ahmedabad stylists.
          </p>
          <div className="mt-2 pt-2 border-t border-outside-border/60 flex items-center justify-between text-[10px] text-outside-inkSecondary">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-outside-moss animate-pulse" />
              <span>Online Now (10am–10pm)</span>
            </span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-outside-accent font-bold hover:underline flex items-center gap-0.5"
            >
              <span>Chat</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Main WhatsApp Trigger Pill (Nykaa Luxe Benchmark) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with OUTSIDE Concierge on WhatsApp"
        className="group flex items-center gap-2.5 px-4 py-2.5 bg-outside-elevated hover:bg-outside-surface border border-outside-border shadow-luxury hover:border-outside-ink rounded-full transition-all cursor-pointer"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-outside-moss opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-outside-moss" />
        </span>

        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase tracking-wider text-outside-inkSecondary font-medium leading-none">
            OUTSIDE INDIA
          </span>
          <span className="text-xs font-bold text-outside-ink leading-tight">
            WhatsApp Concierge
          </span>
        </div>

        <div className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center ml-1 group-hover:scale-105 transition-transform shadow-xs">
          <MessageCircle className="w-4 h-4 fill-white stroke-none" />
        </div>
      </a>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ShieldCheck, X } from 'lucide-react';

export function CookieConsent() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('outside_cookie_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('outside_cookie_consent', 'accepted');
    setVisible(false);
  };

  if (!visible || pathname.startsWith('/checkout') || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <aside
      aria-label="Privacy and cookies consent"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 bg-outside-elevated border border-outside-border p-4 shadow-gallery font-mono text-xs animate-slide-up"
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-outside-accent flex-shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1">
          <p className="text-outside-ink font-bold uppercase tracking-wider text-[11px]">
            EDITORIAL PRIVACY &amp; SESSIONS
          </p>
          <p className="text-[11px] text-outside-inkSecondary leading-relaxed font-sans">
            We use essential session tokens and anonymous telemetry to ensure drop serialization, ACID tax calculations, and cart reservations. Zero cross-site ad trackers.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleAccept}
              className="px-3 py-1.5 bg-outside-ink hover:bg-outside-accent text-white text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
            >
              ACCEPT ENCRYPTED
            </button>
            <button
              onClick={() => setVisible(false)}
              className="px-2 py-1.5 text-[10px] text-outside-inkSecondary hover:text-outside-ink uppercase tracking-wider transition-colors cursor-pointer"
            >
              DISMISS
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

interface MarqueeTickerProps {
  text?: string;
  link?: string;
}

export function MarqueeTicker({
  text = 'DROP 001 LIVE // BETTER DAYS AHEAD · LIMITED TO 250 PIECES · 280 GSM 100% ORGANIC COTTON · FREE ALL-INDIA EXPRESS DELIVERY · 100% GST INCLUSIVE',
  link = '/',
}: MarqueeTickerProps) {
  const items = [
    'DROP 001 LIVE // BETTER DAYS AHEAD',
    'LIMITED TO 250 NUMBERED PIECES ONLY',
    '280 GSM HEAVYWEIGHT ORGANIC COTTON',
    'MADE IN INDIA · 100% PURE COMBED YARN',
    'OVERSIZED BOXY FIT FOR WOMEN & MEN',
    'FREE ALL-INDIA AIR EXPRESS DELIVERY (2-4 DAYS)',
    '100% OFFICIAL GST TAX INVOICE',
    'CASH ON DELIVERY & INSTANT UPI AVAILABLE',
  ];

  return (
    <div className="bg-[#111110] text-[#FCFBF8] border-b border-[#111110] py-2 overflow-hidden select-none font-mono text-[10px] sm:text-[11px] tracking-widest font-bold uppercase relative z-30">
      <div className="flex w-max animate-marquee space-x-8">
        {[...items, ...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center space-x-6 flex-shrink-0">
            <span className="hover:text-[#B82328] transition-colors">{item}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B82328]" />
          </div>
        ))}
      </div>
    </div>
  );
}

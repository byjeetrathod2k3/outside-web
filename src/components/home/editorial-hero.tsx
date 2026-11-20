'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Flame,
  Layers,
  Compass,
  Zap,
} from 'lucide-react';

interface EditorialHeroProps {
  dropTitle: string;
  dropNumber: number;
  pricePaise: number;
  totalPieces: number;
  remainingPieces: number;
}

const HERO_PERSPECTIVES = [
  {
    id: 'front',
    label: '01 · FRONT EMBROIDERY',
    sublabel: 'Tactile Floral Relief',
    src: '/images/drops/drop-001-front.jpg',
  },
  {
    id: 'back',
    label: '02 · BACK MANIFESTO',
    sublabel: 'Same Girl Brighter Days',
    src: '/images/drops/drop-001-back.jpg',
  },
  {
    id: 'macro',
    label: '03 · MACRO CRAFT',
    sublabel: '12,400 Hand Stitches',
    src: '/images/drops/drop-001-detail1.jpg',
  },
];

export function EditorialHero({
  dropTitle,
  dropNumber,
  pricePaise,
  totalPieces,
  remainingPieces,
}: EditorialHeroProps) {
  const [activePerspective, setActivePerspective] = useState(0);

  const scrollToDrop = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('active-drop');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentView = HERO_PERSPECTIVES[activePerspective];

  return (
    <section className="relative overflow-hidden bg-outside-canvas border-b border-outside-border">
      
      {/* Background Architectural Grid Accent */}
      <div className="absolute inset-0 bg-subtle-grid opacity-60 pointer-events-none" />

      {/* Atmospheric Top Coordinates Bar */}
      <div className="relative border-b border-outside-border/70 py-2.5 px-4 sm:px-8 bg-outside-surface/40 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-outside-inkSecondary">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-outside-accent animate-pulse" />
          <span className="font-bold text-outside-ink tracking-widest uppercase">
            DROP 00{dropNumber} NOW LIVE // 250 PIECES ONLY
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span>AHMEDABAD DESIGN STUDIO</span>
          <span>•</span>
          <span>MADE IN INDIA · 100% ORGANIC COTTON</span>
          <span>•</span>
          <span className="text-outside-moss font-bold">100% GST INCLUDED · FREE SHIPPING</span>
        </div>
      </div>

      {/* Main 12-Column Hero Canvas */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Monolithic Brand Manifesto & CTAs (7 Cols) */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* Editorial Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-outside-surface border border-outside-border text-outside-accent text-xs font-mono font-bold tracking-[0.25em] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LIMITED EDITION APPAREL · MADE IN INDIA</span>
            </div>

            {/* Giant Monolithic Display Headline */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-display font-black tracking-tighter text-outside-ink uppercase leading-[0.92]">
                WEAR YOUR <br />
                <span className="text-outside-ink relative inline-block">
                  STORY<span className="text-outside-accent">.</span>
                </span>
              </h1>
              <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-outside-inkSecondary pt-2">
                EXCLUSIVE DROP · 250 PIECES ONLY · NEVER RESTOCKED
              </p>
            </div>

            {/* Editorial Paragraph */}
            <p className="max-w-xl text-sm sm:text-base text-outside-inkSecondary font-sans leading-relaxed">
              We reject cheap fast-fashion. Every drop is crafted in India from custom-milled <strong className="text-outside-ink font-semibold">280 GSM combed organic cotton</strong> in a single, strictly limited run of 250 numbered pieces. When piece 250 is claimed, this design is retired forever into The Vault.
            </p>

            {/* Live Scarcity Callout Bar */}
            <div className="p-4 bg-outside-surface/70 border border-outside-border rounded-lg max-w-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-outside-ink font-bold flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-outside-accent" />
                  <span>ACTIVE RUN // DROP 001</span>
                </span>
                <span className="text-outside-accent font-bold">
                  {remainingPieces} OF {totalPieces} PIECES REMAINING
                </span>
              </div>
              <div className="w-full bg-outside-elevated h-2 rounded-full overflow-hidden border border-outside-border">
                <div
                  className="bg-outside-accent h-full transition-all duration-1000"
                  style={{ width: `${Math.round(((totalPieces - remainingPieces) / totalPieces) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-outside-inkSecondary pt-0.5">
                <span>SERIAL #OUT-001-001</span>
                <span className="font-bold text-outside-ink">318 SHOPPERS VIEWING NOW</span>
                <span>SERIAL #OUT-001-250</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
              {/* Primary: Jump to Buy Console */}
              <button
                onClick={scrollToDrop}
                className="group px-8 py-4 bg-outside-ink hover:bg-black text-outside-elevated text-xs font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-3 transition-all rounded shadow-luxury cursor-pointer"
              >
                <span>ORDER NOW (₹{(pricePaise / 100).toLocaleString('en-IN')})</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>

              {/* Secondary: Lookbook */}
              <Link
                href="/lookbook"
                className="px-6 py-4 bg-outside-elevated hover:bg-outside-surface border border-outside-border text-outside-ink text-xs font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all rounded cursor-pointer"
              >
                <span>VIEW LOOKBOOK</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Micro 5% UPI Hook & Free Shipping */}
            <div className="flex items-center gap-4 text-xs font-mono text-outside-inkSecondary pt-1 flex-wrap">
              <span className="flex items-center gap-1.5 text-outside-moss font-bold">
                <Zap className="w-3.5 h-3.5 text-outside-moss" />
                <span>5% Instant UPI Discount: Pay ₹{Math.round((pricePaise * 0.95) / 100).toLocaleString('en-IN')} (Code: OUTSIDE5)</span>
              </span>
              <span>•</span>
              <span>Free Express Delivery (2-4 Days All India)</span>
            </div>
          </div>

          {/* Right Column: Sculptural Garment Stage with Interactive Angle Dial (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Primary Visual Showcase Card */}
            <div className="relative aspect-[4/5] bg-outside-elevated border border-outside-border rounded-lg overflow-hidden shadow-2xl group">
              
              {/* Active Image */}
              <Image
                src={currentView.src}
                alt={currentView.label}
                fill
                priority
                className="object-contain p-6 transition-all duration-700 group-hover:scale-105"
              />

              {/* Top Status Overlays */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <span className="px-2.5 py-1 bg-outside-elevated/95 backdrop-blur-md border border-outside-border rounded text-[10px] font-mono text-outside-ink font-bold shadow-xs">
                  DROP 00{dropNumber} // {currentView.label}
                </span>
                <span className="px-2.5 py-1 bg-outside-surface/90 backdrop-blur-md border border-outside-border/70 rounded text-[9px] font-mono text-outside-inkSecondary">
                  {currentView.sublabel}
                </span>
              </div>

              {/* Live Scarcity Serial Hologram Tag */}
              <div className="absolute bottom-4 left-4 right-4 bg-outside-elevated/95 backdrop-blur-md border border-outside-border p-3 rounded shadow-lg flex items-center justify-between font-mono">
                <div>
                  <span className="text-[10px] text-outside-inkSecondary block leading-none">
                    100% ORIGINAL DESIGNER PIECE
                  </span>
                  <span className="text-xs font-bold text-outside-ink mt-0.5 block">
                    NUMBERED EDITION #OUT-001-075
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-outside-moss font-bold px-2 py-0.5 rounded bg-outside-moss/10 border border-outside-moss/20">
                    IN STOCK · SHIPS IN 24H
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive 3-Angle Dial (Changes Image on Hover/Click) */}
            <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
              {HERO_PERSPECTIVES.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActivePerspective(idx)}
                  className={`p-2.5 rounded border transition-all text-left flex flex-col justify-between cursor-pointer ${
                    activePerspective === idx
                      ? 'border-outside-ink bg-outside-ink text-outside-elevated font-bold shadow-xs'
                      : 'border-outside-border bg-outside-surface/60 text-outside-inkSecondary hover:text-outside-ink hover:border-outside-inkSecondary'
                  }`}
                >
                  <span className="text-[9px] opacity-80 uppercase block">{p.id === 'front' ? 'VIEW 01' : p.id === 'back' ? 'VIEW 02' : 'VIEW 03'}</span>
                  <span className="font-bold uppercase tracking-wider truncate block mt-0.5">
                    {p.id === 'front' ? 'Front Cut' : p.id === 'back' ? 'Back Print' : 'Macro Stitch'}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Sizing Guidance Link */}
            <div className="pt-1 flex items-center justify-between text-xs font-mono text-outside-inkSecondary">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-outside-moss" />
                <span>Relaxed Oversized Boxy Fit for Women & Men</span>
              </span>
              <Link href="/size-guide" className="text-outside-accent hover:underline font-bold text-[11px]">
                Fit Room &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Architectural Bento Metrics Bar */}
      <div className="border-t border-outside-border bg-outside-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono">
            
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-widest text-outside-accent font-bold">
                01 // TEXTILE DENSITY
              </div>
              <div className="text-sm font-bold text-outside-ink">
                280 GSM Heavyweight Terry
              </div>
              <div className="text-xs text-outside-inkSecondary">
                100% Combed Organic Cotton
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-widest text-outside-accent font-bold">
                02 // HARD EDITION LIMIT
              </div>
              <div className="text-sm font-bold text-outside-ink">
                250 Numbered Units
              </div>
              <div className="text-xs text-outside-inkSecondary">
                Limited Stock · No Reprints
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-widest text-outside-accent font-bold">
                03 // SILHOUETTE FIT
              </div>
              <div className="text-sm font-bold text-outside-ink">
                Oversized Drop-Shoulder
              </div>
              <div className="text-xs text-outside-inkSecondary">
                Calibrated Boxy Silhouette
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-widest text-outside-accent font-bold">
                04 // MADE IN INDIA
              </div>
              <div className="text-sm font-bold text-outside-ink">
                Ahmedabad Studio, India
              </div>
              <div className="text-xs text-outside-inkSecondary">
                Express Air Delivery Across India
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
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
  Truck,
  RotateCcw,
  CreditCard,
  ShoppingBag,
  Star,
  Check,
} from 'lucide-react';
import BlurText from '@/components/reactbits/BlurText/BlurText';
import ShinyText from '@/components/reactbits/ShinyText/ShinyText';
import DecryptedText from '@/components/reactbits/DecryptedText/DecryptedText';
import CountUp from '@/components/reactbits/CountUp/CountUp';
import ClickSpark from '@/components/reactbits/ClickSpark/ClickSpark';

interface EditorialHeroProps {
  dropTitle: string;
  dropNumber: number;
  pricePaise: number;
  totalPieces: number;
  remainingPieces: number;
  allDrops?: any[];
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
  allDrops,
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
      <div className="relative border-b border-outside-border/70 py-2.5 px-4 sm:px-8 bg-outside-surface/40 flex flex-wrap items-center justify-between gap-3 text-[10px] sm:text-[11px] font-mono text-outside-inkSecondary">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-outside-accent animate-pulse" />
          <span className="font-bold text-outside-ink tracking-widest uppercase">
            HEADLINER: DROP 00{dropNumber} // {remainingPieces} PIECES LEFT
          </span>
        </div>

        {/* Multi-Drop Rotation Pills */}
        {allDrops && allDrops.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="hidden lg:inline text-[10px] uppercase tracking-wider text-outside-inkSecondary font-bold">
              THE ROTATION:
            </span>
            <div className="flex items-center gap-1.5">
              {allDrops.slice(0, 3).map((d: any) => {
                const isSelected = d.dropNumber === dropNumber;
                return (
                  <a
                    key={d.id}
                    href={isSelected ? '#active-drop' : '#all-drops'}
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                      isSelected
                        ? 'bg-outside-ink text-outside-elevated border-outside-ink shadow-xs'
                        : 'bg-outside-elevated text-outside-ink border-outside-border hover:border-outside-ink'
                    }`}
                  >
                    DROP 00{d.dropNumber}
                  </a>
                );
              })}
              <a
                href="#all-drops"
                className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-outside-accent hover:underline"
              >
                + ALL ({allDrops.length}) &rarr;
              </a>
            </div>
          </div>
        )}

        <div className="hidden md:flex items-center gap-6">
          <DecryptedText text="AHMEDABAD DESIGN STUDIO" speed={40} maxIterations={8} animateOn="view" />
          <span>•</span>
          <span>DISPATCH: 24H EXPRESS</span>
        </div>
      </div>

      <ClickSpark sparkColor={['#B82328', '#111110', '#DCD7CC']} sparkSize={10} sparkRadius={30} sparkCount={8} duration={400}>
      {/* Main 12-Column Hero Canvas */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Monolithic Brand Manifesto & CTAs (7 Cols) */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* Editorial Badge & Social Proof */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-outside-surface border border-outside-border text-xs font-mono font-bold tracking-[0.25em] uppercase">
                <Sparkles className="w-3.5 h-3.5 text-outside-accent" />
                <ShinyText text="LIMITED EDITION APPAREL · MADE IN INDIA" speed={3} color="#B82328" shineColor="#FFFFFF" className="text-xs font-mono font-bold tracking-[0.25em]" />
              </div>
              <a href="#reviews" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-outside-elevated border border-outside-border text-[11px] font-mono text-outside-ink hover:border-outside-accent transition-colors shadow-xs">
                <span className="text-amber-500 font-bold">★★★★★</span>
                <span className="font-bold">4.98</span>
                <span className="text-outside-inkSecondary">(142 Collector Reviews)</span>
              </a>
            </div>

            {/* Giant Monolithic Display Headline */}
            <div className="space-y-2">
              <BlurText
                text="WEAR YOUR STORY."
                delay={120}
                animateBy="words"
                direction="top"
                className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-display font-black tracking-tighter text-outside-ink uppercase leading-[0.92]"
              />
              <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-outside-inkSecondary pt-2">
                EXCLUSIVE DROP · 250 PIECES ONLY · NEVER RESTOCKED
              </p>
            </div>

            {/* Editorial Paragraph */}
            <p className="max-w-xl text-sm sm:text-base text-outside-inkSecondary font-sans leading-relaxed">
              We reject cheap fast-fashion. Every drop is crafted in India from custom-milled <strong className="text-outside-ink font-semibold">280 GSM combed organic cotton</strong> in a single, strictly limited run of 250 numbered pieces. When piece 250 is claimed, this design is retired forever into The Vault.
            </p>

            {/* Architectural Highlights Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 max-w-xl text-[11px] font-mono text-outside-inkSecondary">
              <div className="p-3 bg-outside-surface border border-outside-border rounded space-y-1">
                <span className="text-[10px] text-outside-accent font-bold block">01 // TEXTILE</span>
                <span className="font-bold text-outside-ink">280 GSM COTTON</span>
              </div>
              <div className="p-3 bg-outside-surface border border-outside-border rounded space-y-1">
                <span className="text-[10px] text-outside-accent font-bold block">02 // ALLOCATION</span>
                <span className="font-bold text-outside-ink">{remainingPieces} / {totalPieces} LEFT</span>
              </div>
              <div className="p-3 bg-outside-surface border border-outside-border rounded space-y-1">
                <span className="text-[10px] text-outside-moss font-bold block">03 // TAX &amp; DUTY</span>
                <span className="font-bold text-outside-ink">5% GST INCLUDED</span>
              </div>
              <div className="p-3 bg-outside-surface border border-outside-border rounded space-y-1">
                <span className="text-[10px] text-outside-accent font-bold block">04 // DISPATCH</span>
                <span className="font-bold text-outside-ink">FREE AIR 2-4 DAYS</span>
              </div>
            </div>

            {/* Editorial CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href="#active-drop"
                onClick={scrollToDrop}
                className="px-8 py-4 bg-outside-accent hover:bg-outside-accent/90 text-white text-xs font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-3 transition-colors rounded shadow-luxury cursor-pointer group"
              >
                <span>SECURE YOUR PIECE · ₹{(pricePaise / 100).toLocaleString('en-IN')}</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </a>

              <Link
                href="/lookbook"
                className="px-6 py-4 bg-outside-elevated hover:bg-outside-surface text-outside-ink border border-outside-border text-xs font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-colors rounded cursor-pointer"
              >
                <span>VIEW LOOKBOOK</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/size-guide"
                className="px-5 py-4 text-outside-inkSecondary hover:text-outside-ink text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>FIT ROOM</span>
                <span className="text-outside-accent">&rarr;</span>
              </Link>
            </div>

            {/* Micro 5% UPI Hook & Free Shipping Strip */}
            <div className="flex items-center gap-4 text-xs font-mono text-outside-inkSecondary pt-1 flex-wrap">
              <span className="flex items-center gap-1.5 text-outside-moss font-bold">
                <Zap className="w-3.5 h-3.5 text-outside-moss" />
                <span>5% Instant UPI Discount: Pay ₹{Math.round((pricePaise * 0.95) / 100).toLocaleString('en-IN')} (Code: OUTSIDE5)</span>
              </span>
              <span>•</span>
              <span>Zero-Cost 7-Day Doorstep Exchanges</span>
            </div>

            {/* Commercial Trust Signals */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 max-w-xl text-[10px] font-mono text-outside-inkSecondary">
              <div className="p-2 bg-outside-surface border border-outside-border rounded flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-outside-accent shrink-0" />
                <span>BLUEDART EXPRESS AIR</span>
              </div>
              <div className="p-2 bg-outside-surface border border-outside-border rounded flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-outside-moss shrink-0" />
                <span>100% GST INCLUDED</span>
              </div>
              <div className="p-2 bg-outside-surface border border-outside-border rounded flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-outside-accent shrink-0" />
                <span>7-DAY DOORSTEP EXCH</span>
              </div>
              <div className="p-2 bg-outside-surface border border-outside-border rounded flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-outside-moss shrink-0" />
                <span>COD &amp; INSTANT UPI</span>
              </div>
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
                    <DecryptedText text="NUMBERED EDITION #OUT-001-075" speed={30} maxIterations={8} animateOn="view" />
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
      </ClickSpark>

      {/* Signature Architectural Bento Metrics Bar */}
      <div className="border-t border-outside-border bg-outside-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono">
            
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-widest text-outside-accent font-bold">
                01 // TEXTILE DENSITY
              </div>
              <div className="text-sm font-bold text-outside-ink">
                <CountUp to={280} duration={1} /> GSM Heavyweight Terry
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
                <CountUp to={250} duration={1.2} /> Numbered Units
              </div>
              <div className="text-xs text-outside-inkSecondary">
                Limited Stock · No Reprints
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-widest text-outside-accent font-bold">
                03 // FIT &amp; CUT
              </div>
              <div className="text-sm font-bold text-outside-ink">
                Oversized Drop-Shoulder
              </div>
              <div className="text-xs text-outside-inkSecondary">
                Structured Boxy Cut
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
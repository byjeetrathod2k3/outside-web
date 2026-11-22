'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, Zap, Check, X } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { CottonIcon, IndiaIcon, BoxExchangeIcon, LaurelWreathBadge } from '@/components/ui/hero-icons';

interface EditorialHeroProps {
  dropTitle: string;
  dropNumber: number;
  pricePaise: number;
  totalPieces: number;
  remainingPieces: number;
  allDrops?: any[];
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

const DETAIL_CARDS = [
  {
    id: 'embroidery',
    title: 'Floral Relief',
    subtitle: '12,400 Hand Stitches',
    description: 'Raised multi-threaded chain-stitch floral embroidery in rose-pink and umber brown, hand-finished in our Ahmedabad studio to resist wash distortion.',
    src: '/images/hero-detail-embroidery.webp',
  },
  {
    id: 'fabric',
    title: 'Organic Weave',
    subtitle: '280 GSM French Terry',
    description: 'Custom-milled in India from 100% long-staple combed organic cotton. Double bio-washed for structural stability and zero shrinkage.',
    src: '/images/hero-detail-fabric.webp',
  },
  {
    id: 'tag',
    title: 'Tethered Tag',
    subtitle: 'Debossed Signature',
    description: 'Dimensional raw canvas tag tethered via braided cord knot debossed with "for a kinder you" and subtle heart emblem.',
    src: '/images/hero-detail-tag.webp',
  },
];

export function EditorialHero({
  dropTitle,
  dropNumber,
  pricePaise,
  totalPieces,
  remainingPieces,
  allDrops = [],
}: EditorialHeroProps) {
  const [selectedFit] = useState<'WOMEN' | 'MEN'>('WOMEN');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [justAdded, setJustAdded] = useState(false);
  const [activeModalDetail, setActiveModalDetail] = useState<typeof DETAIL_CARDS[0] | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModalDetail(null);
    };
    if (activeModalDetail) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeModalDetail]);

  const { addItem, openCart } = useCart();

  const activeDrop = allDrops.find((d: any) => d.dropNumber === dropNumber) || allDrops[0] || {};
  const activeDropId = activeDrop.id || 'drop_001';

  const priceRupees = pricePaise / 100;
  const formattedPrice = `₹${priceRupees.toLocaleString('en-IN')}`;

  const handleHeroAddToCart = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const matchedVariant = activeDrop.variants?.find(
      (v: any) => v.fit === selectedFit && v.size === selectedSize
    ) || activeDrop.variants?.[0];

    addItem({
      dropId: activeDropId,
      variantId: matchedVariant?.id || `${activeDropId}-${selectedFit}-${selectedSize}`,
      title: `${dropTitle || 'DROP 001 // BETTER DAYS AHEAD'} (${selectedFit})`,
      fit: selectedFit,
      size: selectedSize,
      quantity: 1,
      unitPricePaise: pricePaise,
      maxStock: matchedVariant?.currentStock || remainingPieces || 75,
      image: '/images/outside_hero_final.png',
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2200);
    openCart();
  };

  const scrollToCatalog = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('all-drops') || document.getElementById('active-drop');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero-active-drop"
      aria-label="Active Drop Showcase"
      className="relative w-full overflow-hidden bg-[#F6F2EB] border-b border-[#DCD7CC]"
    >
      {/* ===================================================================== */}
      {/* 1. UPPER HERO EDITORIAL CANVAS (Untouched Background, Seamless Fit)   */}
      {/* ===================================================================== */}
      <div className="relative w-full min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden bg-[#EAE2D8]">
        
        {/* Full-Height Studio Background Image Layer Anchored Flush to the Right */}
        <div className="hidden md:block absolute inset-y-0 right-0 -right-[2px] w-full lg:w-[75%] xl:w-[78%] h-full z-0 pointer-events-none overflow-hidden bg-[#EAE2D8]">
          <img
            src="/images/outside_hero_final.png"
            alt="DROP 001 Better Days Ahead Heavyweight T-Shirt"
            className="w-full h-full object-cover object-right select-none"
            style={{ objectPosition: 'right center' }}
            loading="eager"
            decoding="sync"
            // @ts-ignore
            fetchPriority="high"
          />
        </div>

        {/* Seamless Left-Edge Blending Gradient Overlay */}
        <div
          className="hidden md:block absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#F6F2EB] via-[#F6F2EB]/95 via-[30%] to-transparent to-[48%]"
          aria-hidden="true"
        />

        {/* Rebuilt "LIMITED TO 250 PIECES" Circular Seal SVG */}
        <div className="hidden md:flex absolute top-[22%] left-[37%] lg:left-[38%] z-10">
          <LaurelWreathBadge totalPieces={totalPieces} />
        </div>

        {/* Right-Edge Macro Detail Cards (Flush inside right margin) */}
        <div className="hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-10 flex-col gap-3.5">
          {DETAIL_CARDS.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => setActiveModalDetail(card)}
              className="w-28 h-28 xl:w-36 xl:h-36 rounded-2xl border-2 border-white/95 shadow-lg overflow-hidden bg-[#F5F1EB] hover:scale-[1.03] transition-transform duration-300 cursor-pointer group text-left relative"
              title={`Inspect ${card.title} · Click for craft details`}
            >
              <Image
                src={card.src}
                alt={card.title}
                fill
                sizes="(max-width: 1280px) 112px, 144px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 p-1.5 bg-[#111111]/70 backdrop-blur-xs text-white text-[9px] font-mono uppercase tracking-wider text-center opacity-0 group-hover:opacity-100 transition-opacity">
                {card.title}
              </div>
            </button>
          ))}
        </div>

        {/* Left Editorial Column: 5 Stacked Elements */}
        <div className="hidden md:block relative z-10 max-w-[440px] pl-8 lg:pl-14 py-12">
          {/* Element 1: Eyebrow */}
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase text-[#111111]">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="text-[#B91C1C]">✦</span>
              <span>DROP 00{dropNumber}</span>
            </span>
            <span className="w-14 h-[1px] bg-[#B91C1C]/70 inline-block" />
            <span className="text-[#3A3A3A] font-semibold">LIMITED EDITION</span>
          </div>

          {/* Element 2: Headline */}
          <h1 className="font-black text-[#111111] text-6xl lg:text-[76px] leading-[0.88] tracking-[-0.03em] uppercase select-none mt-5">
            WEAR<br />
            YOUR<br />
            STORY<span className="inline-block w-3.5 h-3.5 rounded-full bg-[#B91C1C] ml-1 align-baseline" />
          </h1>

          {/* Element 3: Sub-label */}
          <p className="font-mono text-[11px] tracking-[0.22em] text-[#3A3A3A] mt-4 uppercase">
            EXCLUSIVE APPAREL • MADE IN INDIA
          </p>

          {/* Element 4: Body Copy */}
          <p className="text-sm text-[#3A3A3A] leading-relaxed max-w-[340px] mt-4">
            A limited run of {totalPieces} pieces, crafted from{' '}
            <strong className="text-[#111111] font-bold">280 GSM organic cotton</strong>.
            Thoughtfully designed, ethically made, and built to last.
          </p>

          {/* Element 5: Vertically Stacked CTAs */}
          <div className="flex flex-col items-start gap-3 mt-7">
            <button
              type="button"
              onClick={handleHeroAddToCart}
              className="w-[280px] h-11 rounded-md bg-[#B91C1C] hover:bg-[#991B1B] text-white font-mono text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2.5 shadow-sm transition-colors cursor-pointer active:scale-[0.99]"
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>CLAIMED ✓ IN YOUR BAG</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>CLAIM DROP 00{dropNumber} — {formattedPrice} →</span>
                </>
              )}
            </button>

            <a
              href="#all-drops"
              onClick={scrollToCatalog}
              className="w-[225px] h-10 rounded-md bg-white/60 hover:bg-white border border-black/15 text-[#111111] font-mono text-[11px] tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.99]"
            >
              <span>EXPLORE THE COLLECTION ▸</span>
            </a>
          </div>
        </div>

        {/* Responsive Mobile Stack (< 768px) */}
        <div className="md:hidden flex flex-col w-full">
          {/* Full-width Hero Product Visual */}
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#F6F2EB]">
            <img
              src="/images/outside_hero_final.png"
              alt="DROP 001 Better Days Ahead Heavyweight T-Shirt"
              className="w-full h-full object-cover object-[65%_center] select-none"
              loading="eager"
              decoding="sync"
              // @ts-ignore
              fetchPriority="high"
            />
            <div className="absolute top-4 left-4 z-10">
              <LaurelWreathBadge totalPieces={totalPieces} className="w-20 h-20" />
            </div>
          </div>

          {/* 3 Macro Detail Cards in Balanced 3-Column Grid */}
          <div className="grid grid-cols-3 gap-2.5 px-4 -mt-6 relative z-10">
            {DETAIL_CARDS.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => setActiveModalDetail(card)}
                className="relative aspect-square w-full rounded-2xl border-2 border-white/95 shadow-md overflow-hidden bg-[#F5F1EB] hover:scale-[1.03] transition-transform duration-300 cursor-pointer group text-left"
                title={`Inspect ${card.title}`}
              >
                <Image
                  src={card.src}
                  alt={card.title}
                  fill
                  sizes="33vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 py-0.5 px-1 bg-[#111111]/70 backdrop-blur-xs text-white text-[8px] font-mono uppercase tracking-wider text-center truncate">
                  {card.title}
                </div>
              </button>
            ))}
          </div>

          {/* Mobile Editorial Column */}
          <div className="px-5 py-8 flex flex-col">
            <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] uppercase text-[#111111]">
              <span className="flex items-center gap-1 font-bold">
                <span className="text-[#B91C1C]">✦</span>
                <span>DROP 00{dropNumber}</span>
              </span>
              <span className="w-10 sm:w-14 h-[1px] bg-[#B91C1C]/70 inline-block" />
              <span className="text-[#3A3A3A] font-semibold">LIMITED EDITION</span>
            </div>

            <h1 className="font-black text-[#111111] text-5xl sm:text-6xl leading-[0.88] tracking-[-0.03em] uppercase select-none mt-4">
              WEAR<br />
              YOUR<br />
              STORY<span className="inline-block w-3 h-3 rounded-full bg-[#B91C1C] ml-1 align-baseline" />
            </h1>

            <p className="font-mono text-[11px] tracking-[0.22em] text-[#3A3A3A] mt-4 uppercase">
              EXCLUSIVE APPAREL • MADE IN INDIA
            </p>

            <p className="text-sm text-[#3A3A3A] leading-relaxed max-w-[340px] mt-4">
              A limited run of {totalPieces} pieces, crafted from{' '}
              <strong className="text-[#111111] font-bold">280 GSM organic cotton</strong>.
              Thoughtfully designed, ethically made, and built to last.
            </p>

            <div className="flex flex-col items-stretch gap-3 mt-7 w-full">
              <button
                type="button"
                onClick={handleHeroAddToCart}
                className="w-full h-11 rounded-md bg-[#B91C1C] hover:bg-[#991B1B] text-white font-mono text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2.5 shadow-sm transition-colors cursor-pointer active:scale-[0.99]"
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>CLAIMED ✓ IN YOUR BAG</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-white" />
                    <span>CLAIM DROP 00{dropNumber} — {formattedPrice} →</span>
                  </>
                )}
              </button>

              <a
                href="#all-drops"
                onClick={scrollToCatalog}
                className="w-full h-10 rounded-md bg-white/60 hover:bg-white border border-black/15 text-[#111111] font-mono text-[11px] tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.99]"
              >
                <span>EXPLORE THE COLLECTION ▸</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 2. CREATIVE ATELIER CRAFT & DIRECT PURCHASE CONSOLE RIBBON            */}
      {/* ===================================================================== */}
      <div className="border-t border-[#DCD7CC] bg-[#FAF8F5]/95 backdrop-blur-md py-3 sm:py-3.5 relative z-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 xl:gap-8 font-mono">
            
            {/* --------------------------------------------------------------- */}
            {/* Left: 4 Luxury Craft Signifiers (Separated by Hairline Dividers) */}
            {/* --------------------------------------------------------------- */}
            <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-6 lg:gap-7 overflow-x-auto no-scrollbar py-1">
              
              {/* Pillar 1: 280 GSM Organic Cotton */}
              <div className="flex items-center gap-2.5 shrink-0 group">
                <div className="w-8 h-8 rounded-full bg-[#EDEAE2]/80 border border-[#DCD7CC]/80 flex items-center justify-center shrink-0 group-hover:border-[#111110] transition-colors shadow-2xs">
                  <CottonIcon className="w-4 h-4 text-[#111110]" />
                </div>
                <div className="text-left leading-tight space-y-0.5">
                  <span className="block text-[11px] font-bold text-[#111110] uppercase tracking-[0.14em]">
                    280 GSM
                  </span>
                  <span className="block text-[9px] text-[#736F68] font-sans uppercase tracking-wider">
                    Organic Cotton
                  </span>
                </div>
              </div>

              <div className="h-6 w-px bg-[#DCD7CC]/80 shrink-0 hidden sm:block" />

              {/* Pillar 2: Made in India */}
              <div className="flex items-center gap-2.5 shrink-0 group">
                <div className="w-8 h-8 rounded-full bg-[#EDEAE2]/80 border border-[#DCD7CC]/80 flex items-center justify-center shrink-0 group-hover:border-[#111110] transition-colors shadow-2xs">
                  <IndiaIcon className="w-4 h-4 text-[#111110]" />
                </div>
                <div className="text-left leading-tight space-y-0.5">
                  <span className="block text-[11px] font-bold text-[#111110] uppercase tracking-[0.14em]">
                    Made In
                  </span>
                  <span className="block text-[9px] text-[#736F68] font-sans uppercase tracking-wider">
                    India · Studio
                  </span>
                </div>
              </div>

              <div className="h-6 w-px bg-[#DCD7CC]/80 shrink-0 hidden sm:block" />

              {/* Pillar 3: Free Express Delivery */}
              <div className="flex items-center gap-2.5 shrink-0 group">
                <div className="w-8 h-8 rounded-full bg-[#EDEAE2]/80 border border-[#DCD7CC]/80 flex items-center justify-center shrink-0 group-hover:border-[#111110] transition-colors shadow-2xs">
                  <Zap className="w-4 h-4 text-[#111110]" />
                </div>
                <div className="text-left leading-tight space-y-0.5">
                  <span className="block text-[11px] font-bold text-[#111110] uppercase tracking-[0.14em]">
                    Free Express
                  </span>
                  <span className="block text-[9px] text-[#736F68] font-sans uppercase tracking-wider">
                    Air Dispatch
                  </span>
                </div>
              </div>

              <div className="h-6 w-px bg-[#DCD7CC]/80 shrink-0 hidden sm:block" />

              {/* Pillar 4: Zero-Cost 7-Day Exchange */}
              <div className="flex items-center gap-2.5 shrink-0 group">
                <div className="w-8 h-8 rounded-full bg-[#EDEAE2]/80 border border-[#DCD7CC]/80 flex items-center justify-center shrink-0 group-hover:border-[#111110] transition-colors shadow-2xs">
                  <BoxExchangeIcon className="w-4 h-4 text-[#111110]" />
                </div>
                <div className="text-left leading-tight space-y-0.5">
                  <span className="block text-[11px] font-bold text-[#111110] uppercase tracking-[0.14em]">
                    Zero-Cost
                  </span>
                  <span className="block text-[9px] text-[#736F68] font-sans uppercase tracking-wider">
                    7-Day Doorstep
                  </span>
                </div>
              </div>

            </div>

            {/* --------------------------------------------------------------- */}
            {/* Right: Unified Luxury Atelier Purchase Pod                      */}
            {/* --------------------------------------------------------------- */}
            <div className="w-full xl:w-auto flex flex-wrap sm:flex-nowrap items-center justify-between xl:justify-end gap-2.5 sm:gap-4 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/95 border border-[#DCD7CC] shadow-xs">
              
              {/* Product Micro-Preview & Pricing */}
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="relative w-9 h-9 rounded-md overflow-hidden border border-[#DCD7CC]/80 bg-[#EDEAE2] shrink-0">
                  <Image
                    src="/images/drops/drop-001-front.jpg"
                    alt="DROP 001 Floral Relief Preview"
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
                <div className="text-left leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-[#111110] uppercase tracking-wider whitespace-nowrap">
                      DROP 00{dropNumber} · FLORAL RELIEF
                    </span>
                    <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#B91C1C] animate-pulse" />
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-xs font-mono font-black text-[#B91C1C]">
                      {formattedPrice}
                    </span>
                    <span className="text-[8px] font-mono font-semibold text-[#736F68] uppercase tracking-wider">
                      GST INCL.
                    </span>
                  </div>
                </div>
              </div>

              {/* Hairline Divider */}
              <div className="h-6 w-px bg-[#DCD7CC] shrink-0 hidden sm:block" />

              {/* Tactile Segmented Size Control Bar */}
              <div className="flex items-center gap-0.5 bg-[#EDEAE2]/70 p-0.5 rounded-lg border border-[#DCD7CC]/70 shrink-0">
                {AVAILABLE_SIZES.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`w-7 sm:w-8 h-7 rounded text-[11px] font-mono font-bold uppercase transition-all flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#111110] text-[#FAF8F5] shadow-xs scale-[1.02]'
                          : 'text-[#52504B] hover:text-[#111110] hover:bg-white/70'
                      }`}
                      title={`Select size ${size}`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {/* Instant Add-to-Bag Action Pill */}
              <button
                type="button"
                onClick={handleHeroAddToCart}
                title="Add selected size to cart"
                aria-label={`Claim DROP 00${dropNumber} in size ${selectedSize}`}
                className="h-8 px-3.5 rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] active:scale-95 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>ADDED ✓</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-white" />
                    <span className="hidden sm:inline">ADD</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </>
                )}
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. MACRO CRAFT DETAIL MODAL                                           */}
      {/* ===================================================================== */}
      {activeModalDetail && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111110]/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveModalDetail(null)}
        >
          <div
            className="relative max-w-lg w-full bg-[#FCFBF8] border border-[#DCD7CC] rounded-2xl shadow-2xl p-6 space-y-4 font-mono"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#DCD7CC]">
              <div>
                <span className="text-[10px] text-[#B91C1C] font-bold uppercase tracking-widest block">
                  CRAFT SPECIFICATION
                </span>
                <h3 id="detail-modal-title" className="text-lg font-bold text-[#111110] uppercase">
                  {activeModalDetail.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalDetail(null)}
                aria-label="Close detail modal"
                className="p-2 rounded-full hover:bg-[#EDEAE2] text-[#111110] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#DCD7CC] bg-[#EDEAE2]">
              <Image
                src={activeModalDetail.src}
                alt={activeModalDetail.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#111110]">
                {activeModalDetail.subtitle}
              </span>
              <p className="text-xs font-sans text-[#52504B] leading-relaxed">
                {activeModalDetail.description}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModalDetail(null)}
                className="px-4 py-2 rounded-md bg-[#111110] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2A2825] cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

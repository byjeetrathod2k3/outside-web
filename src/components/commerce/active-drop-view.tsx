'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Check,
  Layers,
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Variant {
  id: string;
  sku: string;
  fit: 'WOMEN' | 'MEN' | 'UNISEX';
  size: string;
  initialStock: number;
  currentStock: number;
  reservedStock: number;
}

interface DropData {
  id: string;
  dropNumber: number;
  slug: string;
  title: string;
  subtitle: string;
  story: string;
  fabricSpecs: string;
  pricePaise: number;
  currency: string;
  totalEditionQty: number;
  status: 'LIVE' | 'UPCOMING' | 'SOLD_OUT';
  primaryImageUrl: string;
  galleryUrls: string[];
  variants: Variant[];
}

export function ActiveDropView({ drop }: { drop: DropData }) {
  const { addItem } = useCart();
  const [selectedFit, setSelectedFit] = useState<'WOMEN' | 'MEN'>('WOMEN');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  // Filter variants by selected fit
  const availableVariants = drop.variants.filter((v) => v.fit === selectedFit);
  const currentVariant =
    availableVariants.find((v) => v.size === selectedSize) || availableVariants[0];

  const currentStock = currentVariant ? currentVariant.currentStock : 0;
  const isOutOfStock = currentStock <= 0;

  // Total remaining stock across all variants
  const totalStockRemaining = drop.variants.reduce((acc, v) => acc + v.currentStock, 0);
  const percentClaimed = Math.round(
    ((drop.totalEditionQty - totalStockRemaining) / drop.totalEditionQty) * 100
  );

  const gallery =
    drop.galleryUrls && drop.galleryUrls.length > 0
      ? drop.galleryUrls
      : [drop.primaryImageUrl || '/images/drops/drop-001-front.jpg'];

  const handleAddToCart = () => {
    if (!currentVariant || isOutOfStock) return;

    addItem({
      dropId: drop.id,
      variantId: currentVariant.id,
      title: `${drop.title} (${selectedFit})`,
      fit: selectedFit,
      size: selectedSize,
      quantity: 1,
      unitPricePaise: drop.pricePaise,
      maxStock: currentStock,
      image: gallery[0],
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'DROP_WAITLIST',
          email: waitlistEmail,
          preferredFit: selectedFit,
          preferredSize: selectedSize,
          dropId: drop.id,
          source: 'active-drop-stock-gate',
        }),
      });
      setWaitlistSuccess(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      
      {/* Velocity / Scarcity Badge (Light Luxury) */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-outside-border shadow-sm">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-outside-crimson animate-ping" />
          <span className="text-xs font-mono font-bold text-outside-text tracking-widest uppercase">
            DROP 00{drop.dropNumber} // SERIALIZED EDITION OF {drop.totalEditionQty}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-outside-muted">
            CLAIMED: <strong className="text-outside-text">{percentClaimed}%</strong>
          </span>
          <span className="text-outside-border">|</span>
          <span className="text-outside-crimson font-bold">
            REMAINING PIECES: {totalStockRemaining}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left: Product Showcase Gallery with User Uploaded Real Photos */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/5] w-full bg-white border border-outside-border overflow-hidden group shadow-luxury">
            <Image
              src={gallery[activeImageIndex] || gallery[0]}
              alt={`${drop.title} angle ${activeImageIndex + 1}`}
              fill
              priority
              className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* View angle badge */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 border border-outside-border font-mono text-[10px] text-outside-text font-bold tracking-widest uppercase shadow-sm">
              {activeImageIndex === 0 ? 'FRONT // EMBROIDERY SPEC' : 'BACK // SAME GIRL MANIFESTO'}
            </div>

            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 border border-outside-border font-mono text-[11px] text-outside-crimson font-bold tracking-widest shadow-sm">
              EDITION: #OUT-00{drop.dropNumber}
            </div>
          </div>

          {/* Thumbnail Selector Strip */}
          <div className="grid grid-cols-4 gap-3">
            {gallery.map((url, idx) => (
              <button
                key={url + idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-square bg-white border transition-all overflow-hidden p-1 ${
                  activeImageIndex === idx
                    ? 'border-outside-crimson ring-2 ring-outside-crimson/20 shadow-sm'
                    : 'border-outside-border hover:border-outside-muted opacity-80 hover:opacity-100'
                }`}
              >
                <Image
                  src={url}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-contain"
                />
                <span className="absolute bottom-1 left-1 text-[8px] font-mono font-bold px-1 bg-white/90 text-outside-text">
                  {idx === 0 ? 'FRONT' : 'BACK'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Garment Specifications & Purchasing Console */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Header & Pricing */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-mono text-outside-crimson uppercase tracking-[0.25em] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL SINGLE-DROP RELEASE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-outside-text uppercase">
              {drop.title}
            </h1>
            <p className="text-sm font-sans text-outside-muted leading-relaxed">
              {drop.subtitle}
            </p>

            {/* Price & GST Transparency */}
            <div className="pt-4 border-t border-outside-border flex items-baseline gap-4">
              <span className="text-3xl font-mono font-black text-outside-text tracking-tight">
                ₹{(drop.pricePaise / 100).toLocaleString('en-IN')}
              </span>
              <div className="text-left font-mono text-[11px] text-outside-muted">
                <p className="text-outside-text font-semibold">INCLUSIVE OF ALL TAXES (5% GST)</p>
                <p className="text-[10px] text-outside-muted">HSN: 61091000 · ZERO HIDDEN FEES</p>
              </div>
            </div>
          </div>

          {/* Fit Selector (Women-First Philosophy) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono uppercase tracking-[0.2em] text-outside-text font-bold flex items-center gap-2">
                <span>SELECT SILHOUETTE FIT</span>
                <span className="text-[10px] text-outside-crimson font-bold">// WOMEN-FIRST</span>
              </label>
              <a
                href="#fit-philosophy"
                className="text-[11px] font-mono text-outside-muted hover:text-outside-text underline decoration-outside-border underline-offset-4"
              >
                FIT PHILOSOPHY
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(['WOMEN', 'MEN'] as const).map((fit) => (
                <button
                  key={fit}
                  onClick={() => setSelectedFit(fit)}
                  className={`py-3.5 px-4 font-mono text-xs uppercase tracking-widest border transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedFit === fit
                      ? 'bg-outside-text text-white border-outside-text font-bold shadow-md'
                      : 'bg-white border-outside-border text-outside-muted hover:text-outside-text hover:border-outside-text'
                  }`}
                >
                  <span>{fit === 'WOMEN' ? 'WOMEN SILHOUETTE' : 'MEN SILHOUETTE'}</span>
                  <span className={`text-[10px] ${selectedFit === fit ? 'text-white/70' : 'text-outside-muted'}`}>
                    {fit === 'WOMEN' ? 'Ergonomic Boxy Cut' : 'Relaxed Structured Cut'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Matrix & Stock Availability */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="uppercase tracking-wider text-outside-text font-bold">CHOOSE SIZE</span>
              <span>
                {currentStock > 0 ? (
                  <span className="text-outside-crimson font-bold">
                    {currentStock <= 5 ? `ONLY ${currentStock} LEFT IN STOCK` : `${currentStock} AVAILABLE`}
                  </span>
                ) : (
                  <span className="text-outside-crimson font-bold">SOLD OUT</span>
                )}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {availableVariants.map((v) => {
                const isSelected = selectedSize === v.size;
                const isSoldOut = v.currentStock <= 0;

                return (
                  <button
                    key={v.size}
                    disabled={isSoldOut}
                    onClick={() => setSelectedSize(v.size)}
                    className={`py-3 font-mono text-xs uppercase tracking-wider border relative transition-all ${
                      isSelected
                        ? 'bg-outside-crimson text-white font-bold border-outside-crimson shadow-md'
                        : isSoldOut
                        ? 'bg-outside-cardSubtle border-outside-border text-outside-muted/40 cursor-not-allowed line-through'
                        : 'bg-white border-outside-border text-outside-text hover:border-outside-text'
                    }`}
                  >
                    <span>{v.size}</span>
                    {v.currentStock > 0 && v.currentStock <= 5 && !isSelected && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-outside-crimson" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Purchase Actions */}
          <div className="space-y-3 pt-2">
            {isOutOfStock ? (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setWaitlistModalOpen(true)}
                className="w-full border-outside-crimson text-outside-crimson hover:bg-outside-crimson hover:text-white"
              >
                <AlertCircle className="w-4 h-4" />
                <span>SIZE SOLD OUT — JOIN WAITLIST</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                className="w-full text-xs tracking-[0.25em]"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ADDED TO BAG</span>
                  </>
                ) : (
                  <>
                    <span>CLAIM PIECE NOW &rarr;</span>
                    <span className="text-[10px] opacity-90 font-normal ml-2">
                      (₹{(drop.pricePaise / 100).toLocaleString('en-IN')})
                    </span>
                  </>
                )}
              </Button>
            )}

            <div className="grid grid-cols-3 gap-3 pt-4 text-center font-mono text-[10px] text-outside-muted">
              <div className="p-3 bg-white border border-outside-border shadow-sm">
                <Truck className="w-4 h-4 mx-auto mb-1 text-outside-text" />
                <span>BLUEDART 2-4 DAYS</span>
              </div>
              <div className="p-3 bg-white border border-outside-border shadow-sm">
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-outside-text" />
                <span>100% GST INVOICE</span>
              </div>
              <div className="p-3 bg-white border border-outside-border shadow-sm">
                <RotateCcw className="w-4 h-4 mx-auto mb-1 text-outside-text" />
                <span>7-DAY EXCHANGE</span>
              </div>
            </div>
          </div>

          {/* Garment Technical Specs */}
          <div className="p-5 bg-white border border-outside-border space-y-3 font-mono text-xs shadow-sm">
            <div className="flex items-center gap-2 text-outside-text font-bold uppercase tracking-wider">
              <Layers className="w-4 h-4 text-outside-crimson" />
              <span>GARMENT TECHNICAL SPECIFICATIONS</span>
            </div>
            <p className="text-outside-muted leading-relaxed font-sans text-xs">
              {drop.fabricSpecs}
            </p>
          </div>
        </div>
      </div>

      {/* Waitlist Modal */}
      {waitlistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-outside-border max-w-md w-full p-8 relative shadow-2xl">
            <h3 className="text-lg font-mono uppercase tracking-wider text-outside-text font-bold mb-2">
              JOIN {selectedFit} · SIZE {selectedSize} WAITLIST
            </h3>
            <p className="text-xs text-outside-muted leading-relaxed mb-6">
              If an allocation opens up or another collector updates their order, you will receive an instant priority reservation notification.
            </p>

            {waitlistSuccess ? (
              <div className="p-4 bg-outside-cardSubtle border border-outside-crimson text-outside-text text-xs font-mono flex items-center gap-3">
                <Check className="w-5 h-5 text-outside-crimson" />
                <span>YOU HAVE BEEN REGISTERED ON THE PRIORITY QUEUE.</span>
              </div>
            ) : (
              <form onSubmit={handleJoinWaitlist} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="ENTER YOUR EMAIL ADDRESS"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  className="w-full bg-white border border-outside-border px-4 py-3 text-xs font-mono text-outside-text focus:border-outside-crimson focus:outline-none"
                />
                <div className="flex gap-3">
                  <Button type="submit" variant="primary" className="flex-1">
                    CONFIRM WAITLIST SPOT
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setWaitlistModalOpen(false)}
                  >
                    CLOSE
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

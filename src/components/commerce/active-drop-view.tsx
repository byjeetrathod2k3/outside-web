'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Check,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ViralShare } from '@/components/commerce/viral-share';
import { InteractiveGarmentStage } from '@/components/commerce/interactive-garment-stage';
import { estimateDelivery, DeliveryEstimateResult } from '@/lib/pincode';
import { MapPin, Search } from 'lucide-react';

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

const FIT_SPECS = {
  WOMEN: {
    label: 'WOMEN SILHOUETTE',
    tagline: 'Ergonomic Boxy Cut · Calibrated Dropped Shoulder · Split-Hem Fluidity',
    measurements: {
      XS: { chest: '38-40"', length: '25.5"', shoulder: '19.5"' },
      S: { chest: '41-43"', length: '26.5"', shoulder: '20.5"' },
      M: { chest: '44-46"', length: '27.5"', shoulder: '21.5"' },
      L: { chest: '47-49"', length: '28.5"', shoulder: '22.5"' },
    },
  },
  MEN: {
    label: 'MEN SILHOUETTE',
    tagline: 'Structured Relaxed Cut · Broadened Shoulder Yoke · Architectural Torso',
    measurements: {
      S: { chest: '42-44"', length: '27.5"', shoulder: '21.0"' },
      M: { chest: '45-47"', length: '28.5"', shoulder: '22.0"' },
      L: { chest: '48-50"', length: '29.5"', shoulder: '23.0"' },
      XL: { chest: '51-53"', length: '30.5"', shoulder: '24.0"' },
    },
  },
};

export function ActiveDropView({ drop, featureFlags }: { drop: DropData; featureFlags?: any[] }) {
  const { addItem } = useCart();

  // Dynamic Feature Flag Resolvers
  const flags = featureFlags || [];
  const enableCountdown = flags.find((f: any) => f.key === 'enable_countdown_timer')?.isEnabled !== false;
  const enableStockCounter = flags.find((f: any) => f.key === 'enable_live_stock_counter')?.isEnabled !== false;
  const lowStockThreshold = flags.find((f: any) => f.key === 'low_stock_threshold')?.configJson?.threshold ?? 10;
  const enableFitToggle = flags.find((f: any) => f.key === 'enable_fit_toggle')?.isEnabled !== false;
  const defaultFit = (flags.find((f: any) => f.key === 'enable_fit_toggle')?.configJson?.defaultFit as 'WOMEN' | 'MEN') || 'WOMEN';
  const enableStickyBar = flags.find((f: any) => f.key === 'enable_sticky_drop_bar')?.isEnabled !== false;
  const enableCheckout = flags.find((f: any) => f.key === 'enable_checkout_flow')?.isEnabled !== false;
  const enableWaitlist = flags.find((f: any) => f.key === 'enable_waitlist_capture')?.isEnabled !== false;

  const [selectedFit, setSelectedFit] = useState<'WOMEN' | 'MEN'>(defaultFit);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  // Indian Pincode Delivery Estimator
  const [pincodeInput, setPincodeInput] = useState('380015');
  const [deliveryResult, setDeliveryResult] = useState<DeliveryEstimateResult | null>(() => estimateDelivery('380015'));
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    setPincodeError(null);
    const res = estimateDelivery(pincodeInput);
    if (!res.valid) {
      setPincodeError(res.error || 'Please enter a valid 6-digit PIN code.');
    } else {
      setDeliveryResult(res);
    }
  };

  // Monitor scroll for the sticky minimal "Active Drop Bar"
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 480) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const currentFitSpec = FIT_SPECS[selectedFit];
  const currentMeasurements = (currentFitSpec.measurements as any)[selectedSize] || {
    chest: '44-46"',
    length: '27.5"',
    shoulder: '21.5"',
  };

  const handleAddToCart = () => {
    if (!currentVariant || isOutOfStock) return;

    if (!enableCheckout) {
      setWaitlistModalOpen(true);
      return;
    }

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
    <>
      {/* ========================================== */}
      {/* 1. STICKY MINIMAL ACTIVE DROP BAR (ON SCROLL) */}
      {/* ========================================== */}
      {enableStickyBar && (
        <div
          className={`fixed top-20 left-0 right-0 z-30 frosted-alabaster border-b border-outside-border px-4 py-2.5 transition-all duration-300 transform ${
            showStickyBar ? 'translate-y-0 opacity-100 shadow-editorial' : '-translate-y-full opacity-0 pointer-events-none'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 font-mono">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-outside-accent animate-pulse" />
              <span className="text-xs font-bold text-outside-ink uppercase">
                DROP 00{drop.dropNumber} // {drop.title}
              </span>
              <span className="hidden sm:inline text-xs text-outside-inkSecondary">
                ₹{(drop.pricePaise / 100).toLocaleString('en-IN')} (Inc. 5% GST)
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Quick Size Dropdown */}
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="bg-outside-elevated border border-outside-border px-2.5 py-1 text-xs text-outside-ink font-mono focus:border-outside-accent focus:outline-none"
              >
                {availableVariants.map((v) => (
                  <option key={v.size} value={v.size} disabled={v.currentStock <= 0}>
                    {selectedFit} · {v.size} {v.currentStock <= 0 ? '(SOLD OUT)' : `(${v.currentStock} left)`}
                  </option>
                ))}
              </select>

              <Button
                variant="primary"
                size="sm"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="text-[10px]"
              >
                {isOutOfStock ? 'WAITLIST' : 'RESERVE PIECE'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. MAIN ACTIVE DROP SHOWCASE & LOOKBOOK */}
      {/* ========================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        
        {/* Adidas Confirmed-Style Drop Scarcity & Allocation Velocity Meter */}
        <div className="mb-8 p-5 bg-[#FCFBF8] border border-[#DCD7CC] shadow-editorial space-y-3 font-mono">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B82328] animate-ping" />
              <span className="text-xs uppercase font-bold text-[#111110] tracking-wider">
                DROP 00{drop.dropNumber} // SERIAL ALLOCATION PROTOCOL
              </span>
              <span className="text-[10px] text-[#52504B] uppercase bg-[#EDEAE2] px-2 py-0.5 border border-[#DCD7CC]">
                STRICT CAPPED RUN
              </span>
            </div>
            <div className="text-xs font-bold">
              <span className="text-[#B82328]">{percentClaimed}% ALLOCATED</span>
              <span className="text-[#DCD7CC] mx-2">|</span>
              <span className="text-[#111110]">{totalStockRemaining} OF {drop.totalEditionQty} PIECES REMAINING</span>
            </div>
          </div>

          {/* Visual Segmented Progress Bar */}
          <div className="w-full bg-[#EDEAE2] h-2.5 overflow-hidden border border-[#DCD7CC]">
            <div
              className="bg-[#B82328] h-full transition-all duration-1000 ease-out"
              style={{ width: `${percentClaimed}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-[#52504B]">
            <span>SERIAL #OUT-001-001</span>
            <span className="font-bold text-[#111110]">NO RE-ISSUES OR RESTOCKS ONCE CLAIMED</span>
            <span>SERIAL #OUT-001-250</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left: Hyper-Tactile Interactive Garment Stage with Hotspots & Lens Zoom */}
          <div className="lg:col-span-7">
            <InteractiveGarmentStage
              primaryImageUrl={drop.primaryImageUrl}
              galleryUrls={drop.galleryUrls}
              dropTitle={drop.title}
              dropNumber={drop.dropNumber}
            />
          </div>

          {/* Right: Architectural Garment Details & Purchasing Console */}
          <div className="lg:col-span-5 space-y-7">
            
            {/* Header & Pricing */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-editorial-label text-outside-accent font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OFFICIAL SINGLE-DROP RELEASE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tighter text-outside-ink uppercase">
                {drop.title}
              </h1>
              <p className="text-sm font-sans text-outside-inkSecondary leading-relaxed">
                {drop.subtitle}
              </p>

              {/* Price & GST Transparency */}
              <div className="pt-4 border-t border-outside-border flex items-baseline gap-4">
                <span className="text-3xl font-mono font-black text-outside-ink tracking-tight">
                  ₹{(drop.pricePaise / 100).toLocaleString('en-IN')}
                </span>
                <div className="text-left font-mono text-[11px] text-outside-inkSecondary">
                  <p className="text-outside-ink font-semibold">INCLUSIVE OF ALL TAXES (5% GST)</p>
                  <p className="text-[10px] text-outside-inkSecondary">HSN: 61091000 · ZERO HIDDEN SURCHARGES</p>
                </div>
              </div>
            </div>

            {/* Interactive Women / Men Fit Toggle (Dynamically Updates) */}
            <div className="space-y-3 p-4 bg-outside-surface border border-outside-border">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono uppercase tracking-[0.2em] text-outside-ink font-bold flex items-center gap-2">
                  <span>SILHOUETTE SPECIFICATION</span>
                </label>
                <Badge variant="moss" className="text-[9px]">
                  {selectedFit === 'WOMEN' ? 'PRIMARY FIT' : 'RELAXED'}
                </Badge>
              </div>

              {/* Fit Toggle Buttons (Governed by enable_fit_toggle Flag) */}
              {enableFitToggle ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {(['WOMEN', 'MEN'] as const).map((fit) => (
                    <button
                      key={fit}
                      onClick={() => setSelectedFit(fit)}
                      className={`py-3 px-3 font-mono text-xs uppercase tracking-wider border transition-all flex flex-col items-center justify-center gap-0.5 ${
                        selectedFit === fit
                          ? 'bg-outside-ink text-outside-elevated border-outside-ink font-bold shadow-editorial'
                          : 'bg-outside-elevated border-outside-border text-outside-inkSecondary hover:text-outside-ink hover:border-outside-ink'
                      }`}
                    >
                      <span>{fit === 'WOMEN' ? 'WOMEN SILHOUETTE' : 'MEN SILHOUETTE'}</span>
                      <span className={`text-[9px] ${selectedFit === fit ? 'text-outside-elevated/70' : 'text-outside-inkSecondary'}`}>
                        {fit === 'WOMEN' ? 'Ergonomic Boxy Cut' : 'Structured Relaxed Cut'}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-2.5 bg-outside-elevated border border-outside-border text-xs text-outside-ink font-mono flex items-center justify-between">
                  <span className="font-bold">{FIT_SPECS[selectedFit].label} (STANDARD)</span>
                  <span className="text-[10px] text-outside-inkSecondary">EXCLUSIVE RELEASE FIT</span>
                </div>
              )}

              {/* Dynamic Measurement Spec Display */}
              <div className="pt-3 border-t border-outside-border/80 text-[11px] font-mono text-outside-inkSecondary space-y-1">
                <p className="text-outside-ink font-bold text-[10px] uppercase">
                  {currentFitSpec.tagline}
                </p>
                <div className="flex justify-between text-[10px] pt-1">
                  <span>Chest: <strong className="text-outside-ink">{currentMeasurements.chest}</strong></span>
                  <span>Length: <strong className="text-outside-ink">{currentMeasurements.length}</strong></span>
                  <span>Shoulder: <strong className="text-outside-ink">{currentMeasurements.shoulder}</strong></span>
                </div>
              </div>
            </div>

            {/* Size Selector with Atomic Remaining Stock Gauge */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="uppercase tracking-wider text-outside-ink font-bold">SELECT SIZE</span>
                <span>
                  {enableStockCounter ? (
                    currentStock > 0 ? (
                      <span className="text-outside-accent font-bold">
                        {currentStock <= lowStockThreshold
                          ? `ONLY ${currentStock} LEFT IN ALLOCATION`
                          : `${currentStock} AVAILABLE`}
                      </span>
                    ) : (
                      <span className="text-outside-accent font-bold">SIZE SOLD OUT</span>
                    )
                  ) : (
                    <span className="text-outside-inkSecondary font-bold uppercase">
                      SERIALIZED RUN (CAPPED)
                    </span>
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
                          ? 'bg-outside-accent text-white font-bold border-outside-accent shadow-editorial'
                          : isSoldOut
                          ? 'bg-outside-surface border-outside-border text-outside-inkSecondary/40 cursor-not-allowed line-through'
                          : 'bg-outside-elevated border-outside-border text-outside-ink hover:border-outside-ink'
                      }`}
                    >
                      <span>{v.size}</span>
                      {v.currentStock > 0 && v.currentStock <= 5 && !isSelected && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-outside-accent" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Purchase CTA */}
            <div className="space-y-3 pt-2">
              {isOutOfStock ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setWaitlistModalOpen(true)}
                  className="w-full border-outside-accent text-outside-accent hover:bg-outside-accent hover:text-white"
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
                      <Check className="w-4 h-4 text-outside-elevated" />
                      <span>ADDED TO BAG</span>
                    </>
                  ) : !enableCheckout ? (
                    <>
                      <span>REQUEST ALLOCATION (WAITLIST ONLY) &rarr;</span>
                    </>
                  ) : (
                    <>
                      <span>CLAIM PIECE NOW &rarr;</span>
                      <span className="text-[10px] opacity-80 font-normal ml-2">
                        (₹{(drop.pricePaise / 100).toLocaleString('en-IN')})
                      </span>
                    </>
                  )}
                </Button>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-3 text-center font-mono text-[10px] text-outside-inkSecondary">
                <div className="p-3 bg-outside-elevated border border-outside-border shadow-editorial">
                  <Truck className="w-4 h-4 mx-auto mb-1 text-outside-ink" />
                  <span>BLUEDART 2-4 DAYS</span>
                </div>
                <div className="p-3 bg-outside-elevated border border-outside-border shadow-editorial">
                  <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-outside-ink" />
                  <span>100% GST INVOICE</span>
                </div>
                <div className="p-3 bg-outside-elevated border border-outside-border shadow-editorial">
                  <RotateCcw className="w-4 h-4 mx-auto mb-1 text-outside-ink" />
                  <span>7-DAY EXCHANGE</span>
                </div>
              </div>

              {/* Indian Pincode Delivery Estimator (Skechers / Adidas Confirmed Standard) */}
              <div className="p-4 bg-outside-surface border border-outside-border space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-outside-ink uppercase">
                    <MapPin className="w-4 h-4 text-outside-accent" />
                    <span>CHECK EXPRESS DELIVERY DATE</span>
                  </div>
                  <span className="text-[10px] text-outside-moss font-bold uppercase">
                    FREE DOMESTIC AIR
                  </span>
                </div>

                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit PIN code"
                      value={pincodeInput}
                      onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2 bg-outside-elevated border border-outside-border text-xs text-outside-ink font-mono focus:border-outside-accent focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-outside-ink hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    CHECK
                  </button>
                </form>

                {pincodeError && (
                  <p className="text-[11px] text-outside-accent font-sans">{pincodeError}</p>
                )}

                {deliveryResult && deliveryResult.valid && (
                  <div className="p-3 bg-outside-elevated border border-outside-border space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-outside-ink">
                        {deliveryResult.city}, {deliveryResult.state}
                      </span>
                      <span className="text-outside-moss font-bold text-[11px]">
                        Arrives by {deliveryResult.estimatedDeliveryDate}
                      </span>
                    </div>
                    <p className="text-[10px] text-outside-inkSecondary font-sans">
                      {deliveryResult.courierPartner} · {deliveryResult.dispatchNote}
                    </p>
                  </div>
                )}
              </div>

              {/* Viral Social & WhatsApp Share Engine */}
              <div className="pt-2">
                <ViralShare title={drop.title} dropNumber={drop.dropNumber} />
              </div>
            </div>

            {/* Garment Technical Specs Card */}
            <div className="p-5 bg-outside-elevated border border-outside-border space-y-2.5 font-mono text-xs shadow-editorial">
              <div className="flex items-center gap-2 text-outside-ink font-bold uppercase tracking-wider">
                <Layers className="w-4 h-4 text-outside-accent" />
                <span>GARMENT TECHNICAL SPECIFICATIONS</span>
              </div>
              <p className="text-outside-inkSecondary leading-relaxed font-sans text-xs">
                {drop.fabricSpecs}
              </p>
            </div>
          </div>
        </div>

        {/* Waitlist Modal */}
        {waitlistModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-outside-elevated border border-outside-border max-w-md w-full p-8 relative shadow-gallery">
              <h3 className="text-lg font-mono uppercase tracking-wider text-outside-ink font-bold mb-2">
                JOIN {selectedFit} · SIZE {selectedSize} WAITLIST
              </h3>
              <p className="text-xs text-outside-inkSecondary leading-relaxed mb-6 font-sans">
                If an allocation opens up or another collector cancels, you will receive an instant early access reservation code.
              </p>

              {waitlistSuccess ? (
                <div className="space-y-4">
                  <div className="p-4 bg-outside-surface border border-outside-accent text-outside-ink text-xs font-mono flex items-center gap-3">
                    <Check className="w-5 h-5 text-outside-accent flex-shrink-0" />
                    <span>YOU HAVE BEEN REGISTERED ON THE PRIORITY QUEUE.</span>
                  </div>
                  <ViralShare
                    isReferral={true}
                    title={drop.title}
                    dropNumber={drop.dropNumber}
                    customText={`I just queued for early access to OUTSIDE DROP ${drop.dropNumber}. Use my collector link before the 250 pieces sell out:`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setWaitlistModalOpen(false)}
                    className="w-full"
                  >
                    RETURN TO STORE
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleJoinWaitlist} className="space-y-4">
                  <input
                    type="email"
                    required
                    placeholder="ENTER YOUR EMAIL ADDRESS"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    className="w-full bg-outside-canvas border border-outside-border px-4 py-3 text-xs font-mono text-outside-ink focus:border-outside-accent focus:outline-none"
                  />
                  <div className="flex gap-3">
                    <Button type="submit" variant="primary" className="flex-1">
                      CONFIRM SPOT
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
    </>
  );
}

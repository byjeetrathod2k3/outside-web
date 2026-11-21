'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Check,
  Layers,
  ArrowRight,
  Flame,
  Zap,
  ShoppingBag,
  CreditCard,
  MapPin,
  Search,
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ViralShare } from '@/components/commerce/viral-share';
import { InteractiveGarmentStage } from '@/components/commerce/interactive-garment-stage';
import { estimateDelivery, DeliveryEstimateResult } from '@/lib/pincode';
import ShinyText from '@/components/reactbits/ShinyText/ShinyText';

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
  hotspots?: any[];
  variants: Variant[];
}

const FIT_SPECS = {
  WOMEN: {
    label: "WOMEN'S FIT",
    tagline: 'Ergonomic Boxy Cut · Calibrated Dropped Shoulder · Split-Hem Fluidity',
    measurements: {
      XS: { chest: '38-40"', length: '25.5"', shoulder: '19.5"' },
      S: { chest: '41-43"', length: '26.5"', shoulder: '20.5"' },
      M: { chest: '44-46"', length: '27.5"', shoulder: '21.5"' },
      L: { chest: '47-49"', length: '28.5"', shoulder: '22.5"' },
    },
  },
  MEN: {
    label: "MEN'S FIT",
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
  const router = useRouter();
  const {
    addItem,
    openCart,
    buyerPincode,
    setBuyerPincode,
    setBuyerStateCode,
  } = useCart();

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
  const [pincodeInput, setPincodeInput] = useState(buyerPincode || '380015');
  const [deliveryResult, setDeliveryResult] = useState<DeliveryEstimateResult | null>(() =>
    estimateDelivery(buyerPincode || '380015')
  );
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  useEffect(() => {
    if (buyerPincode && buyerPincode.length === 6) {
      setPincodeInput(buyerPincode);
      setDeliveryResult(estimateDelivery(buyerPincode));
    }
  }, [buyerPincode]);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    setPincodeError(null);
    const res = estimateDelivery(pincodeInput);
    if (!res.valid) {
      setPincodeError(res.error || 'Please enter a valid 6-digit PIN code.');
    } else {
      setDeliveryResult(res);
      setBuyerPincode(res.pincode);
      if (res.stateCode) {
        setBuyerStateCode(res.stateCode);
      }
    }
  };

  // Filter variants by selected fit
  const availableVariants = drop.variants.filter((v) => v.fit === selectedFit);
  const currentVariant =
    availableVariants.find((v) => v.size === selectedSize) || availableVariants[0];

  // Auto-reconcile size if switching between fits with differing size ranges (e.g. XS for Women, XL for Men)
  useEffect(() => {
    const available = drop.variants.filter((v) => v.fit === selectedFit);
    if (!available.some((v) => v.size === selectedSize)) {
      setSelectedSize(available[0]?.size || 'M');
    }
  }, [selectedFit, drop.variants, selectedSize]);

  // Monitor scroll for the sticky minimal "Active Drop Bar" - show ONLY when main CTA is scrolled above viewport
  useEffect(() => {
    const handleScroll = () => {
      const ctaEl = document.getElementById('main-purchase-cta');
      if (ctaEl) {
        const rect = ctaEl.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 70);
      } else {
        setShowStickyBar(window.scrollY > 1200);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleAddToCart = (openBag = false) => {
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
    if (openBag) {
      openCart();
    }
  };

  const handleBuyNow = () => {
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

    router.push('/checkout');
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
        <>
          {/* Top Sticky Bar (Desktop) */}
          <div
            className={`hidden md:block fixed top-20 left-0 right-0 z-30 bg-outside-elevated/98 backdrop-blur-md border-b border-outside-border px-4 py-2.5 transition-all duration-300 transform ${
              showStickyBar ? 'translate-y-0 opacity-100 shadow-editorial' : '-translate-y-full opacity-0 pointer-events-none'
            }`}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 font-mono">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-outside-accent animate-pulse" />
                <span className="text-xs font-bold text-outside-ink uppercase">
                  {drop.title}
                </span>
                <span className="text-xs text-outside-inkSecondary">
                  ₹{(drop.pricePaise / 100).toLocaleString('en-IN')} (5% GST Included)
                </span>
                <span className="text-[10px] text-outside-moss font-bold bg-outside-moss/10 px-2 py-0.5 rounded">
                  {percentClaimed}% CLAIMED
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Quick Size Dropdown */}
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="bg-outside-elevated border border-outside-border px-2.5 py-1.5 text-xs text-outside-ink font-mono focus:border-outside-accent focus:outline-none cursor-pointer"
                >
                  {availableVariants.map((v) => (
                    <option key={v.size} value={v.size} disabled={v.currentStock <= 0}>
                      {selectedFit} · {v.size} {v.currentStock <= 0 ? '(SOLD OUT)' : `(${v.currentStock} left)`}
                    </option>
                  ))}
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddToCart(true)}
                  disabled={isOutOfStock}
                  className="text-[10px] tracking-wider"
                >
                  ADD TO BAG
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="text-[10px] tracking-wider bg-outside-accent hover:bg-outside-accent/90"
                >
                  {isOutOfStock ? 'JOIN WAITLIST' : 'BUY NOW'}
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Floating Bar (Mobile on Scroll - Louis Philippe / Nykaa Standard) */}
          <div
            className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-outside-elevated/95 backdrop-blur-md border-t border-outside-border p-3 transition-all duration-300 transform ${
              showStickyBar ? 'translate-y-0 opacity-100 shadow-2xl' : 'translate-y-full opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-outside-inkSecondary uppercase">
                  {selectedFit} · SIZE {selectedSize}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-mono font-bold text-outside-ink">
                    ₹{(drop.pricePaise / 100).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] font-mono text-outside-moss font-bold">
                    (UPI: ₹{Math.round((drop.pricePaise * 0.95) / 100).toLocaleString('en-IN')})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAddToCart(true)}
                  disabled={isOutOfStock}
                  className="px-3 py-2 border border-outside-ink text-outside-ink text-[11px] font-mono font-bold uppercase tracking-wider rounded"
                >
                  Bag
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="px-4 py-2 bg-outside-accent text-white text-[11px] font-mono font-bold uppercase tracking-wider rounded shadow"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================== */}
      {/* 2. MAIN ACTIVE DROP SHOWCASE & LOOKBOOK */}
      {/* ========================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        
        {/* Adidas Confirmed-Style Drop Scarcity & Allocation Velocity Meter */}
        <div className="mb-8 p-5 bg-outside-elevated border border-outside-border shadow-editorial space-y-3 font-mono">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-outside-accent animate-ping" />
              <span className="text-xs uppercase font-bold text-outside-ink tracking-wider">
                DROP 00{drop.dropNumber} // LIMITED EDITION RUN (250 PIECES ONLY)
              </span>
              <span className="text-[10px] text-outside-inkSecondary uppercase bg-outside-surface px-2 py-0.5 border border-outside-border">
                STRICT CAPPED RUN
              </span>
            </div>
            <div className="text-xs font-bold">
              <span className="text-outside-accent">{percentClaimed}% CLAIMED</span>
              <span className="text-outside-border mx-2">|</span>
              <span className="text-outside-ink">{totalStockRemaining} OF {drop.totalEditionQty} PIECES REMAINING</span>
            </div>
          </div>

          {/* Visual Segmented Progress Bar */}
          <div className="w-full bg-outside-surface h-2.5 overflow-hidden border border-outside-border">
            <div
              className="bg-outside-accent h-full transition-all duration-1000 ease-out"
              style={{ width: `${percentClaimed}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-outside-inkSecondary">
            <span>SERIAL #OUT-001-001</span>
            <span className="font-bold text-outside-ink">NO RESTOCKS ONCE SOLD OUT</span>
            <span>SERIAL #OUT-001-250</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left: Hyper-Tactile Interactive Garment Stage with Hotspots & Macro Dot Zoom */}
          <div className="lg:col-span-7">
            <InteractiveGarmentStage
              primaryImageUrl={drop.primaryImageUrl}
              galleryUrls={drop.galleryUrls}
              dropTitle={drop.title}
              dropNumber={drop.dropNumber}
              hotspots={drop.hotspots}
            />
          </div>

          {/* Right: Architectural Garment Details & Purchasing Console */}
          <div className="lg:col-span-5 space-y-7">
            
            {/* Header & Pricing */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-editorial-label text-outside-accent font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>OFFICIAL SINGLE-DROP RELEASE</span>
                </div>
                {/* Verified Drop Badge (Zero Dark Patterns CCPA Standard) */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-outside-moss/10 border border-outside-moss/20 rounded-full text-[11px] font-mono text-outside-moss font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-outside-moss" />
                  <span>AUTHENTICATED DROP</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tighter text-outside-ink uppercase">
                {drop.title}
              </h1>
              <p className="text-sm font-sans text-outside-inkSecondary leading-relaxed">
                {drop.subtitle}
              </p>

              {/* Price, Strikethrough MRP & GST Transparency */}
              <div className="pt-4 border-t border-outside-border space-y-2.5">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-mono font-black text-outside-ink tracking-tight">
                    ₹{(drop.pricePaise / 100).toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-mono text-outside-inkSecondary line-through">
                    MRP ₹3,200
                  </span>
                  <span className="text-[11px] font-mono font-bold text-outside-moss bg-outside-moss/10 px-2 py-0.5 rounded border border-outside-moss/20">
                    25% OFF LAUNCH DROP
                  </span>
                </div>

                <div className="text-left font-mono text-[11px] text-outside-inkSecondary">
                  <p className="text-outside-ink font-semibold">ALL TAXES INCLUDED (5% GST INCLUDED)</p>
                  <p className="text-[10px] text-outside-inkSecondary">Free All-India Air Express Delivery · Cash on Delivery & Instant UPI Available</p>
                </div>

                {/* 5% Extra UPI/Prepaid Discount Hook (Cahoot Benchmark) */}
                <div className="p-2.5 bg-outside-moss/5 border border-outside-moss/30 rounded flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-outside-moss shrink-0" />
                    <span className="text-outside-ink font-bold flex items-center gap-1.5">
                      <span>Pay</span>
                      <strong className="text-outside-moss text-sm">₹{Math.round((drop.pricePaise * 0.95) / 100).toLocaleString('en-IN')}</strong>
                      <ShinyText
                        text="with 5% Instant UPI"
                        speed={3}
                        color="#3F4E44"
                        shineColor="#FFFFFF"
                        className="font-bold"
                      />
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-outside-moss bg-outside-moss/15 px-2 py-0.5 rounded">
                    CODE: OUTSIDE5
                  </span>
                </div>

                {/* 0% Interest EMI Hook (Cahoot / Nykaa Benchmark) */}
                <div className="flex items-center gap-2 font-mono text-[11px] text-outside-inkSecondary px-1">
                  <CreditCard className="w-3.5 h-3.5 text-outside-ink shrink-0" />
                  <span>Or 3 interest-free installments of <strong>₹800/mo</strong> via Snapmint / Simpl</span>
                </div>
              </div>
            </div>

            {/* Interactive Women / Men Fit Toggle (Dynamically Updates) */}
            <div className="space-y-3 p-4 bg-outside-surface border border-outside-border">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono uppercase tracking-[0.2em] text-outside-ink font-bold flex items-center gap-2">
                  <span>FIT & SIZE SPECIFICATION</span>
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
                      <span>{fit === 'WOMEN' ? 'WOMEN OVERSIZED FIT' : 'MEN OVERSIZED FIT'}</span>
                      <span className={`text-[9px] ${selectedFit === fit ? 'text-outside-elevated/70' : 'text-outside-inkSecondary'}`}>
                        {fit === 'WOMEN' ? 'Oversized Boxy Cut' : 'Structured Relaxed Cut'}
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
                          ? `ONLY ${currentStock} PIECES LEFT`
                          : `${currentStock} AVAILABLE`}
                      </span>
                    ) : (
                      <span className="text-outside-accent font-bold">SIZE SOLD OUT</span>
                    )
                  ) : (
                    <span className="text-outside-inkSecondary font-bold uppercase">
                      LIMITED RUN (250 PIECES)
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

            {/* Purchase CTAs: Dual Action (Louis Philippe / Cahoot Benchmark) */}
            <div id="main-purchase-cta" className="space-y-3 pt-2">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Button 1: Add to Bag */}
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleAddToCart(true)}
                    className="w-full text-xs font-mono tracking-[0.2em] font-bold border-outside-ink text-outside-ink hover:bg-outside-surface transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{addedAnimation ? 'ADDED TO BAG ✓' : 'ADD TO BAG'}</span>
                  </Button>

                  {/* Button 2: Buy Now (Instant Checkout) */}
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleBuyNow}
                    className="w-full text-xs font-mono tracking-[0.2em] font-bold bg-outside-accent hover:bg-outside-accent/90 text-white transition-colors flex items-center justify-center gap-2 shadow-editorial cursor-pointer"
                  >
                    <span>BUY NOW</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
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

              {/* Collector Unboxing & Authenticity Guarantee */}
              <div className="p-4 bg-outside-surface border border-outside-border space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-outside-ink uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-outside-accent" />
                    <span>WHAT ARRIVES IN YOUR COLLECTOR BOX</span>
                  </span>
                  <span className="text-[10px] text-outside-moss font-bold uppercase">100% SERIALIZED</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-outside-inkSecondary font-sans">
                  <div className="p-2 bg-outside-elevated border border-outside-border flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-outside-accent shrink-0 mt-0.5" />
                    <span>Hand-signed Certificate of Authenticity</span>
                  </div>
                  <div className="p-2 bg-outside-elevated border border-outside-border flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-outside-accent shrink-0 mt-0.5" />
                    <span>Serialized inner hem tag (#OUT-001-XXX)</span>
                  </div>
                  <div className="p-2 bg-outside-elevated border border-outside-border flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-outside-accent shrink-0 mt-0.5" />
                    <span>Rigid Sandstone Archival Collector Box</span>
                  </div>
                  <div className="p-2 bg-outside-elevated border border-outside-border flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-outside-accent shrink-0 mt-0.5" />
                    <span>Acid-free tissue wrap & Organic Care Guide</span>
                  </div>
                </div>
              </div>

              {/* Verified Payment Trust Banner */}
              <div className="p-3.5 bg-outside-elevated border border-outside-border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[11px] font-mono">
                <span className="text-outside-ink font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-outside-moss shrink-0" />
                  <span>256-BIT ENCRYPTED RAZORPAY CHECKOUT</span>
                </span>
                <div className="flex items-center gap-1.5 text-[10px] text-outside-inkSecondary flex-wrap">
                  <span className="px-1.5 py-0.5 bg-outside-surface border border-outside-border font-bold">UPI / QR</span>
                  <span className="px-1.5 py-0.5 bg-outside-surface border border-outside-border font-bold">CARDS</span>
                  <span className="px-1.5 py-0.5 bg-outside-surface border border-outside-border font-bold">NETBANKING</span>
                  <span className="px-1.5 py-0.5 bg-outside-surface border border-outside-border font-bold text-outside-moss">COD</span>
                  <span className="px-1.5 py-0.5 bg-outside-surface border border-outside-border font-bold">0% EMI</span>
                </div>
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
                <span>FABRIC & CARE SPECIFICATIONS</span>
              </div>
              <p className="text-outside-inkSecondary leading-relaxed font-sans text-xs">
                {drop.fabricSpecs}
              </p>
              {/* Statutory Consumer Protection (E-Commerce) Rules 2020 Compliance */}
              <div className="pt-2.5 border-t border-outside-border/70 text-[10px] text-outside-inkSecondary space-y-1">
                <div className="flex justify-between">
                  <span>Country of Origin: <strong className="text-outside-ink font-semibold">India</strong></span>
                  <span>HSN: <strong className="text-outside-ink font-semibold">61091000</strong></span>
                </div>
                <p>Mfr: <strong className="text-outside-ink font-semibold">OUTSIDE APPAREL STUDIO PVT LTD</strong>, Ahmedabad, Gujarat</p>
                <p>Consumer Grievances: <strong className="text-outside-ink font-semibold">grievance@outside.in</strong> · +91 79 4000 8920</p>
              </div>
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
                If a piece becomes available or an order is cancelled, you will receive an instant access notification.
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
                    customText={`I just joined the waitlist for OUTSIDE DROP ${drop.dropNumber}. Check it out before the 250 pieces sell out:`}
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
                  <p className="text-[10px] text-outside-inkSecondary font-sans leading-tight">
                    By confirming, you consent to receive priority drop alerts under our{' '}
                    <Link href="/privacy-policy" className="underline hover:text-outside-ink" target="_blank">
                      Privacy Policy
                    </Link>{' '}
                    (DPDP Act, 2023).
                  </p>
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

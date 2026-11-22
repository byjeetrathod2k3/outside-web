'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  X,
  ShoppingBag,
  ArrowRight,
  Check,
  RotateCcw,
  Star,
  Zap,
  Truck,
  ShieldCheck,
  Heart,
  Maximize2,
  Sparkles,
  Ruler,
  Clock,
  Layers,
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { estimateDelivery } from '@/lib/pincode';
import { CottonIcon, IndiaIcon, BoxExchangeIcon } from '@/components/ui/hero-icons';

export interface ProductPreviewModalProps {
  drop: any | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenWaitlist?: (drop: any) => void;
}

export function ProductPreviewModal({
  drop,
  isOpen,
  onClose,
  onOpenWaitlist,
}: ProductPreviewModalProps) {
  const router = useRouter();
  const { addItem, openCart, toggleWishlist, isInWishlist, buyerPincode, setBuyerPincode } = useCart();

  const [selectedFit, setSelectedFit] = useState<'WOMEN' | 'MEN'>('WOMEN');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Pincode state
  const [pincode, setPincode] = useState(buyerPincode || '380015');
  const [pincodeInput, setPincodeInput] = useState(buyerPincode || '380015');
  const [deliveryInfo, setDeliveryInfo] = useState(() => estimateDelivery(buyerPincode || '380015'));

  // Reset states when drop changes
  useEffect(() => {
    if (drop) {
      setSelectedFit('WOMEN');
      const firstAvailable = drop.variants?.find((v: any) => v.fit === 'WOMEN' && v.currentStock > 0);
      setSelectedSize(firstAvailable?.size || drop.variants?.[0]?.size || 'M');
      setActiveImageIndex(0);
      setIsZoomed(false);
    }
  }, [drop]);

  // Lock background scroll when modal is open and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !drop) return null;

  const isLive = drop.status === 'LIVE';
  const isUpcoming = drop.status === 'UPCOMING';
  const isArchived = drop.status === 'ARCHIVED';
  const isBookmarked = isInWishlist(drop.id);

  // Build full gallery of images
  const gallery: string[] = [];
  if (drop.primaryImageUrl) gallery.push(drop.primaryImageUrl);
  if (drop.galleryUrls && Array.isArray(drop.galleryUrls)) {
    drop.galleryUrls.forEach((url: string) => {
      if (!gallery.includes(url)) gallery.push(url);
    });
  }
  if (gallery.length === 1) {
    const backUrl = drop.primaryImageUrl.replace('front', 'back');
    if (backUrl !== drop.primaryImageUrl) gallery.push(backUrl);
  }

  const currentImage = gallery[activeImageIndex] || drop.primaryImageUrl || '/images/drops/drop-001-front.jpg';

  // Filter variants by selected fit
  const availableFitVariants = drop.variants?.filter((v: any) => v.fit === selectedFit) || [];
  const selectedVariant =
    availableFitVariants.find((v: any) => v.size === selectedSize) ||
    availableFitVariants[0] ||
    drop.variants?.[0];

  const currentStock = drop.variants?.reduce((acc: number, v: any) => acc + (v.currentStock || 0), 0) ?? 0;
  const isSoldOut = isLive && currentStock <= 0;

  const priceRupees = drop.pricePaise / 100;
  const formattedPrice = `₹${priceRupees.toLocaleString('en-IN')}`;
  const upiPriceRupees = Math.round(priceRupees * 0.95);
  const formattedUpiPrice = `₹${upiPriceRupees.toLocaleString('en-IN')}`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleAddToCart = () => {
    if (!isLive || isSoldOut) return;

    addItem({
      dropId: drop.id,
      variantId: selectedVariant?.id || `${drop.id}-${selectedFit}-${selectedSize}`,
      title: `${drop.title} (${selectedFit})`,
      fit: selectedFit,
      size: selectedSize,
      quantity: 1,
      unitPricePaise: drop.pricePaise,
      maxStock: selectedVariant?.currentStock || 50,
      image: currentImage,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2200);
    openCart();
  };

  const handleInstantBuy = () => {
    if (!isLive || isSoldOut) return;

    addItem({
      dropId: drop.id,
      variantId: selectedVariant?.id || `${drop.id}-${selectedFit}-${selectedSize}`,
      title: `${drop.title} (${selectedFit})`,
      fit: selectedFit,
      size: selectedSize,
      quantity: 1,
      unitPricePaise: drop.pricePaise,
      maxStock: selectedVariant?.currentStock || 50,
      image: currentImage,
    });

    onClose();
    router.push('/checkout');
  };

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeInput.length === 6) {
      setPincode(pincodeInput);
      setBuyerPincode(pincodeInput);
      setDeliveryInfo(estimateDelivery(pincodeInput));
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-preview-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-[#111110]/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Surface Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-[#FAF8F5] text-[#111110] rounded-2xl border border-[#DCD7CC] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
      >
        {/* Floating Top Bar with Actions */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-2">
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => toggleWishlist(drop.id)}
            aria-label={isBookmarked ? 'Remove from Saved Pieces' : 'Save Piece to Archive'}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer backdrop-blur-md ${
              isBookmarked
                ? 'bg-[#B91C1C] text-white border-[#B91C1C] shadow-sm'
                : 'bg-white/90 text-[#111110] border-[#DCD7CC] hover:bg-white hover:text-[#B91C1C]'
            }`}
            title={isBookmarked ? 'Saved in Archive' : 'Save Piece'}
          >
            <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Close Modal Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Product Preview"
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-[#DCD7CC] text-[#111110] hover:text-[#B91C1C] flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[52%_48%] max-h-[90vh] overflow-y-auto">
          
          {/* ================================================================= */}
          {/* LEFT: Multi-Angle Interactive Gallery & Inspection Stage          */}
          {/* ================================================================= */}
          <div className="relative bg-[#EDEAE2]/50 p-4 sm:p-6 lg:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#DCD7CC]">
            
            {/* Top Status & Drop Number Pills */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-white/95 rounded-md border border-[#DCD7CC] font-mono text-[11px] font-bold text-[#111110] tracking-wider uppercase shadow-2xs">
                  DROP 00{drop.dropNumber}
                </span>
                {isLive && (
                  <span className="px-2.5 py-1 bg-[#B91C1C] text-white rounded-md font-mono text-[10px] font-bold tracking-wider uppercase shadow-2xs">
                    LIVE · {currentStock} LEFT
                  </span>
                )}
                {isUpcoming && (
                  <span className="px-2.5 py-1 bg-white/95 border border-[#DCD7CC] rounded-md font-mono text-[10px] font-bold text-[#111110] tracking-wider uppercase">
                    UPCOMING RELEASE
                  </span>
                )}
                {isArchived && (
                  <span className="px-2.5 py-1 bg-[#111110] text-white rounded-md font-mono text-[10px] font-bold tracking-wider uppercase">
                    ARCHIVED IN VAULT
                  </span>
                )}
              </div>

              {/* Total Edition Badge */}
              <span className="font-mono text-[10px] text-[#6B6862] font-semibold uppercase tracking-wider">
                {drop.totalEditionQty} SERIALIZED PIECES
              </span>
            </div>

            {/* Main Interactive Stage */}
            <div
              onMouseMove={handleMouseMove}
              onClick={() => setIsZoomed(!isZoomed)}
              className={`relative aspect-[4/5] sm:aspect-square w-full rounded-xl bg-white border border-[#DCD7CC]/80 overflow-hidden cursor-crosshair select-none ${
                isZoomed ? 'ring-2 ring-[#B91C1C]' : ''
              }`}
              title={isZoomed ? 'Click to Reset Zoom' : 'Click to Zoom In (2.5x)'}
            >
              <div
                className="relative w-full h-full transition-transform duration-200 ease-out"
                style={{
                  transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }}
              >
                <Image
                  src={currentImage}
                  alt={drop.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-4 sm:p-8 select-none"
                  priority
                />
              </div>

              {/* Zoom Instruction Tag */}
              <div className="absolute bottom-3 left-3 z-10 px-2 py-1 rounded-md bg-[#111110]/80 backdrop-blur-xs text-white text-[9px] font-mono uppercase tracking-wider flex items-center gap-1.5 pointer-events-none">
                <Maximize2 className="w-2.5 h-2.5" />
                <span>{isZoomed ? 'CLICK TO RESET' : 'CLICK TO ZOOM'}</span>
              </div>

              {/* Angle Label */}
              <div className="absolute bottom-3 right-3 z-10 px-2 py-1 rounded-md bg-white/90 border border-[#DCD7CC] font-mono text-[9px] font-bold uppercase text-[#111110]">
                VIEW 0{activeImageIndex + 1} // {activeImageIndex === 0 ? 'FRONT' : activeImageIndex === 1 ? 'BACK' : 'DETAIL'}
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-2.5 mt-4 overflow-x-auto no-scrollbar py-1">
                {gallery.map((imgUrl, idx) => {
                  const isSelected = activeImageIndex === idx;
                  return (
                    <button
                      key={imgUrl + idx}
                      type="button"
                      onClick={() => {
                        setActiveImageIndex(idx);
                        setIsZoomed(false);
                      }}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 bg-white transition-all cursor-pointer shrink-0 ${
                        isSelected
                          ? 'border-[#B91C1C] ring-2 ring-[#B91C1C]/20 shadow-xs'
                          : 'border-[#DCD7CC] hover:border-[#111110]/60'
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`Angle 0${idx + 1}`}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* RIGHT: Complete Luxury Atelier E-Commerce Console                 */}
          {/* ================================================================= */}
          <div className="p-5 sm:p-6 lg:p-8 flex flex-col justify-between space-y-5">
            
            <div className="space-y-4">
              {/* Eyebrow and Reviews */}
              <div className="flex items-center justify-between gap-2 font-mono text-xs">
                <span className="text-[#B91C1C] font-bold tracking-[0.2em] uppercase text-[11px] flex items-center gap-1.5">
                  <span>✦</span>
                  <span>ATELIER SPECIFICATION</span>
                </span>

                <div className="flex items-center gap-1 text-[11px] text-[#6B6862]">
                  <div className="flex text-amber-500">
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                  <span className="font-bold text-[#111110]">4.98</span>
                  <span>(142 reviews)</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2
                  id="product-preview-title"
                  className="text-2xl sm:text-3xl font-black font-display text-[#111110] uppercase tracking-tight"
                >
                  {drop.title}
                </h2>
                <p className="text-xs sm:text-sm font-mono text-[#6B6862] uppercase tracking-wider mt-1 font-semibold">
                  {drop.subtitle}
                </p>
              </div>

              {/* Price & Instant Savings */}
              <div className="p-3.5 rounded-xl bg-white border border-[#DCD7CC] flex items-baseline justify-between font-mono">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#111110]">
                      {formattedPrice}
                    </span>
                    <span className="text-[10px] text-[#6B6862] font-semibold uppercase">
                      5% GST INCLUDED
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#2E6F40] font-bold mt-0.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Instant UPI Price: {formattedUpiPrice} (Save 5%)</span>
                  </div>
                </div>

                <div className="text-right text-[10px] text-[#6B6862] uppercase">
                  <span>HSN 61091000</span>
                  <span className="block font-bold text-[#111110]">AHMEDABAD STUDIO</span>
                </div>
              </div>

              {/* Narrative Story / Garment Inspiration */}
              <p className="text-xs sm:text-sm text-[#4A4843] leading-relaxed font-sans">
                {drop.story}
              </p>

              {/* ------------------------------------------------------------- */}
              {/* Commerce Fit & Size Selectors                                 */}
              {/* ------------------------------------------------------------- */}
              {isLive && !isSoldOut && (
                <div className="space-y-3.5 pt-2 border-t border-[#DCD7CC]">
                  
                  {/* Fit Selector */}
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-[#6B6862] font-bold uppercase tracking-wider text-[11px]">
                      SILHOUETTE / FIT:
                    </span>
                    <div className="flex items-center gap-1.5 p-0.5 bg-[#EDEAE2]/80 rounded-lg border border-[#DCD7CC]">
                      <button
                        type="button"
                        onClick={() => setSelectedFit('WOMEN')}
                        className={`px-3 py-1 rounded text-xs font-bold uppercase transition-all cursor-pointer ${
                          selectedFit === 'WOMEN'
                            ? 'bg-[#111110] text-white shadow-xs'
                            : 'text-[#52504B] hover:text-[#111110]'
                        }`}
                      >
                        WOMEN (ERGO-BOXY)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedFit('MEN')}
                        className={`px-3 py-1 rounded text-xs font-bold uppercase transition-all cursor-pointer ${
                          selectedFit === 'MEN'
                            ? 'bg-[#111110] text-white shadow-xs'
                            : 'text-[#52504B] hover:text-[#111110]'
                        }`}
                      >
                        MEN (STRUCTURED)
                      </button>
                    </div>
                  </div>

                  {/* Size Matrix */}
                  <div className="space-y-1.5 font-mono">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#6B6862] font-bold uppercase tracking-wider">
                        SELECT SIZE ({selectedFit}):
                      </span>
                      <a
                        href="/size-guide"
                        target="_blank"
                        className="text-[#B91C1C] hover:underline font-bold flex items-center gap-1"
                      >
                        <Ruler className="w-3 h-3" />
                        <span>FIT MATRIX / SIZE GUIDE ↗</span>
                      </a>
                    </div>

                    <div className="grid grid-cols-6 gap-1.5">
                      {['XS', 'S', 'M', 'L', 'XL', '2XL'].map((sz) => {
                        const variantMatch = availableFitVariants.find((v: any) => v.size === sz);
                        const isOutOfStock = !variantMatch || variantMatch.currentStock <= 0;
                        const isSelected = selectedSize === sz;

                        return (
                          <button
                            key={sz}
                            type="button"
                            disabled={isOutOfStock}
                            onClick={() => setSelectedSize(sz)}
                            className={`py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer flex flex-col items-center justify-center border ${
                              isSelected
                                ? 'bg-[#111110] text-white border-[#111110] shadow-sm'
                                : isOutOfStock
                                ? 'bg-[#EDEAE2]/30 text-[#A8A49C] border-dashed border-[#DCD7CC] cursor-not-allowed line-through'
                                : 'bg-white hover:bg-[#EDEAE2]/60 text-[#111110] border-[#DCD7CC]'
                            }`}
                          >
                            <span>{sz}</span>
                            {variantMatch && variantMatch.currentStock <= 5 && variantMatch.currentStock > 0 && (
                              <span className="text-[8px] text-[#B91C1C] font-semibold mt-0.5">
                                {variantMatch.currentStock} left
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Pincode & Delivery Timeline Estimator */}
              <div className="p-3 rounded-xl bg-white border border-[#DCD7CC] font-mono text-xs space-y-2">
                <form onSubmit={handlePincodeSubmit} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[#111110] font-bold uppercase text-[11px]">
                    <Truck className="w-4 h-4 text-[#B91C1C]" />
                    <span>DELIVERY TO:</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincodeInput}
                      onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                      className="w-20 px-2 py-1 text-center font-bold text-xs bg-[#FAF8F5] border border-[#DCD7CC] rounded focus:outline-[#111110]"
                      placeholder="Pincode"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 bg-[#111110] text-white rounded text-[10px] font-bold uppercase hover:bg-[#333333] cursor-pointer"
                    >
                      CHECK
                    </button>
                  </div>
                </form>

                {deliveryInfo && deliveryInfo.valid && (
                  <p className="text-[11px] text-[#2E6F40] font-semibold flex items-center justify-between">
                    <span>✓ {deliveryInfo.city || 'Metro'}, {deliveryInfo.state || 'India'}</span>
                    <span>Air Dispatch: {deliveryInfo.transitDaysMin}–{deliveryInfo.transitDaysMax} Days ({deliveryInfo.courierPartner})</span>
                  </p>
                )}
              </div>

              {/* 4 Craft Signifiers */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#DCD7CC] font-mono text-[10px]">
                <div className="flex items-center gap-2 text-[#52504B]">
                  <CottonIcon className="w-4 h-4 text-[#111110] shrink-0" />
                  <span>280 GSM Organic Cotton</span>
                </div>
                <div className="flex items-center gap-2 text-[#52504B]">
                  <IndiaIcon className="w-4 h-4 text-[#111110] shrink-0" />
                  <span>Made in Gujarat, India</span>
                </div>
                <div className="flex items-center gap-2 text-[#52504B]">
                  <Zap className="w-4 h-4 text-[#111110] shrink-0" />
                  <span>Free Express Air Dispatch</span>
                </div>
                <div className="flex items-center gap-2 text-[#52504B]">
                  <BoxExchangeIcon className="w-4 h-4 text-[#111110] shrink-0" />
                  <span>Zero-Cost 7-Day Exchange</span>
                </div>
              </div>

            </div>

            {/* ------------------------------------------------------------- */}
            {/* Primary Action Button Bar                                     */}
            {/* ------------------------------------------------------------- */}
            <div className="pt-4 border-t border-[#DCD7CC] mt-auto">
              {isLive && !isSoldOut ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="h-12 rounded-xl bg-white hover:bg-[#EDEAE2]/50 border-2 border-[#111110] text-[#111110] font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4 text-[#2E6F40]" />
                        <span>ADDED TO BAG ✓</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>ADD TO BAG — {formattedPrice}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleInstantBuy}
                    className="h-12 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                  >
                    <span>BUY NOW WITH 1-CLICK</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : isUpcoming ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenWaitlist) onOpenWaitlist(drop);
                    else {
                      const el = document.getElementById('vip-early-access');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full h-12 rounded-xl bg-[#111110] hover:bg-[#2A2926] text-white font-mono text-xs uppercase font-bold tracking-[0.15em] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>JOIN PRIORITY WAITLIST FOR DROP 00{drop.dropNumber} →</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full h-12 rounded-xl bg-[#EDEAE2] text-[#6B6862] font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <span>THIS PIECE IS PERMANENTLY ARCHIVED IN THE VAULT</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

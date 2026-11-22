'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, ArrowRight, ShieldCheck, Truck, Zap, Check, MapPin, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { INDIAN_STATES } from '@/lib/gst';
import { estimateDelivery } from '@/lib/pincode';

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', '2XL'];
const AVAILABLE_FITS: ('WOMEN' | 'MEN' | 'UNISEX')[] = ['WOMEN', 'MEN'];

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    updateItemVariant,
    buyerStateCode,
    setBuyerStateCode,
    buyerPincode,
    openPincodeModal,
    isPrepaidDiscountApplied,
    togglePrepaidDiscount,
    prepaidDiscountPaise,
    taxBreakdown,
  } = useCart();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const deliveryInfo = buyerPincode ? estimateDelivery(buyerPincode) : null;
  const destinationCity = deliveryInfo?.city ? deliveryInfo.city.split('/')[0].trim() : 'Ahmedabad';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-mono">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-outside-ink/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-outside-elevated border-l border-outside-border flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-outside-border flex items-center justify-between bg-outside-canvas">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-outside-accent animate-pulse" />
              <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-outside-ink font-bold">
                COLLECTOR BAG ({items.length})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-outside-inkSecondary hover:text-outside-ink rounded hover:bg-outside-surface transition-colors cursor-pointer"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Express Shipping Meter & Destination */}
          <div className="bg-outside-surface p-3.5 border-b border-outside-border text-xs font-mono">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-outside-ink flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-outside-accent" />
                <span>COMPLIMENTARY AIR EXPRESS</span>
              </span>
              <span className="text-outside-moss font-bold">UNLOCKED ✓</span>
            </div>
            <div className="w-full bg-outside-canvas h-1.5 mt-2 border border-outside-border overflow-hidden rounded-full">
              <div className="bg-outside-moss h-full w-full" />
            </div>
            
            {/* Delivery destination strip */}
            <div className="mt-2.5 pt-2 border-t border-outside-border/60 flex items-center justify-between text-[11px]">
              <span className="text-outside-inkSecondary flex items-center gap-1">
                <MapPin className="w-3 h-3 text-outside-accent" />
                <span>To: <strong className="text-outside-ink">{destinationCity} ({buyerPincode || '380015'})</strong></span>
              </span>
              <button
                onClick={openPincodeModal}
                className="text-[10px] uppercase font-bold text-outside-accent hover:underline cursor-pointer"
              >
                Change Pin
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-outside-inkSecondary p-6">
                <p className="font-mono text-xs uppercase tracking-wider mb-4">Your collector bag is empty.</p>
                <button
                  onClick={closeCart}
                  className="px-6 py-3 bg-outside-ink text-outside-elevated text-xs font-mono uppercase tracking-[0.2em] font-bold hover:bg-outside-ink/90 cursor-pointer"
                >
                  DISCOVER DROP 001
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-outside-canvas border border-outside-border shadow-xs relative"
                >
                  <div className="relative w-20 h-24 bg-outside-surface flex-shrink-0 border border-outside-border overflow-hidden">
                    <Image
                      src={item.image || '/images/drops/drop-001-front.jpg'}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-outside-ink tracking-wide">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-outside-inkSecondary hover:text-outside-accent transition-colors p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Inline Fit & Size Switchers (Cahoot Benchmark) */}
                      <div className="flex items-center gap-2 mt-2">
                        {/* Fit selector */}
                        <select
                          value={item.fit}
                          onChange={(e) =>
                            updateItemVariant(
                              item.id,
                              e.target.value as 'WOMEN' | 'MEN' | 'UNISEX',
                              item.size
                            )
                          }
                          className="bg-outside-elevated border border-outside-border px-2 py-1 text-[10px] font-mono font-bold text-outside-ink focus:outline-none cursor-pointer"
                        >
                          <option value="WOMEN">WOMEN FIT</option>
                          <option value="MEN">MEN FIT</option>
                        </select>

                        {/* Size selector */}
                        <select
                          value={item.size}
                          onChange={(e) =>
                            updateItemVariant(item.id, item.fit, e.target.value)
                          }
                          className="bg-outside-elevated border border-outside-border px-2 py-1 text-[10px] font-mono font-bold text-outside-ink focus:outline-none cursor-pointer"
                        >
                          {AVAILABLE_SIZES.map((s) => (
                            <option key={s} value={s}>
                              SIZE {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-outside-border">
                      <div className="flex items-center border border-outside-border bg-outside-elevated">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-0.5 text-xs text-outside-inkSecondary hover:text-outside-ink cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 py-0.5 text-xs font-mono font-bold text-outside-ink">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-xs text-outside-inkSecondary hover:text-outside-ink cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-mono text-xs font-bold text-outside-ink">
                        ₹{((item.unitPricePaise * item.quantity) / 100).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Tax, Savings & Checkout Footer */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-outside-border bg-outside-canvas space-y-3.5">
              
              {/* Cahoot Benchmark: 5% Instant UPI / Prepaid Discount Incentive Card */}
              <div
                onClick={togglePrepaidDiscount}
                className={`p-3 border rounded transition-all cursor-pointer select-none ${
                  isPrepaidDiscountApplied
                    ? 'border-outside-moss bg-outside-moss/5'
                    : 'border-outside-border bg-outside-surface/50 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                        isPrepaidDiscountApplied
                          ? 'bg-outside-moss border-outside-moss text-white'
                          : 'border-outside-inkSecondary bg-outside-elevated'
                      }`}
                    >
                      {isPrepaidDiscountApplied && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="text-[11px] font-mono font-bold text-outside-ink flex items-center gap-1">
                        <Zap className="w-3 h-3 text-outside-moss" />
                        5% INSTANT UPI / PREPAID SAVINGS
                      </span>
                      <p className="text-[10px] text-outside-inkSecondary">
                        Auto-applied: Code <strong className="text-outside-ink">OUTSIDE5</strong>
                      </p>
                    </div>
                  </div>
                  {isPrepaidDiscountApplied && (
                    <span className="text-xs font-mono font-bold text-outside-moss">
                      -₹{(prepaidDiscountPaise / 100).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              {/* GST & Total Breakdown Card */}
              <div className="bg-outside-elevated p-3.5 border border-outside-border font-mono text-[11px] space-y-1.5 shadow-xs">
                <div className="flex justify-between text-outside-inkSecondary">
                  <span>Gross Subtotal (MRP Inc.):</span>
                  <span className="text-outside-ink font-bold">
                    ₹{(taxBreakdown.subtotalGrossPaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Prepaid discount line */}
                {isPrepaidDiscountApplied && (
                  <div className="flex justify-between text-outside-moss font-bold">
                    <span>Prepaid UPI Discount (5%):</span>
                    <span>-₹{(prepaidDiscountPaise / 100).toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-outside-inkSecondary text-[10px]">
                  <span>Net Taxable Base Value:</span>
                  <span className="text-outside-ink">
                    ₹{(taxBreakdown.totalTaxableAmountPaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* GST Tax Display */}
                <div className="flex justify-between text-outside-inkSecondary text-[10px]">
                  <span>GST (Included):</span>
                  <span>
                    ₹{(
                      (taxBreakdown.isInterState
                        ? taxBreakdown.totalIgstPaise
                        : taxBreakdown.totalCgstPaise + taxBreakdown.totalSgstPaise) / 100
                    ).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="pt-2 border-t border-outside-border flex justify-between text-xs font-bold text-outside-ink">
                  <span>FINAL PAYABLE:</span>
                  <span className="text-outside-accent text-sm">
                    ₹{(taxBreakdown.finalPayablePaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Delivery ETA pill */}
              {deliveryInfo && deliveryInfo.estimatedDeliveryDate && (
                <div className="p-2 bg-outside-surface border border-outside-border/80 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-outside-inkSecondary">Expected Delivery:</span>
                  <span className="font-bold text-outside-ink">{deliveryInfo.estimatedDeliveryDate} (Air Express)</span>
                </div>
              )}

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-4 bg-outside-accent hover:bg-outside-accent/90 text-white font-mono text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-3 transition-colors shadow-luxury cursor-pointer"
              >
                <span>PROCEED TO SECURE CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-outside-inkSecondary pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-outside-moss" />
                  <span>GST Invoice (24)</span>
                </span>
                <span>•</span>
                <span>7-Day Doorstep Exchange</span>
                <span>•</span>
                <span>UPI · GPay · Cards</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
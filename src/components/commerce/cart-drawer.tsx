'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { INDIAN_STATES } from '@/lib/gst';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    buyerStateCode,
    setBuyerStateCode,
    taxBreakdown,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-mono">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-outside-border flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-outside-border flex items-center justify-between bg-outside-bg">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-outside-crimson" />
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-outside-text font-bold">
                YOUR BAG ({items.length})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-outside-muted hover:text-outside-text rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Express Shipping Meter (Puma / Adidas Benchmark) */}
          <div className="bg-[#EDEAE2] p-3 border-b border-outside-border text-xs font-mono">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-outside-text flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-outside-crimson" />
                <span>FREE DOMESTIC AIR EXPRESS SHIPPING</span>
              </span>
              <span className="text-outside-moss">UNLOCKED ✓</span>
            </div>
            <div className="w-full bg-white h-1.5 mt-2 border border-outside-border overflow-hidden">
              <div className="bg-outside-moss h-full w-full" />
            </div>
            <p className="text-[10px] text-outside-muted mt-1 font-sans">
              Dispatches via Bluedart Air directly from Ahmedabad Atelier (State Code 24).
            </p>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-outside-muted">
                <p className="font-mono text-xs uppercase tracking-wider mb-4">Your bag is empty.</p>
                <button
                  onClick={closeCart}
                  className="px-6 py-3 bg-outside-text text-white text-xs font-mono uppercase tracking-widest transition-all hover:bg-black"
                >
                  DISCOVER ACTIVE DROP 001
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-outside-card border border-outside-border rounded-none shadow-xs relative"
                >
                  <div className="relative w-20 h-24 bg-outside-bg flex-shrink-0 border border-outside-border overflow-hidden">
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
                        <h4 className="text-xs font-bold text-outside-text tracking-wide">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-outside-muted hover:text-outside-crimson transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] font-mono text-outside-muted mt-1 uppercase">
                        FIT: <span className="text-outside-text font-bold">{item.fit}</span> · SIZE: <span className="text-outside-text font-bold">{item.size}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-outside-border">
                      <div className="flex items-center border border-outside-border bg-outside-bg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-outside-muted hover:text-outside-text"
                        >
                          -
                        </button>
                        <span className="px-3 py-0.5 text-xs font-mono font-bold text-outside-text">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-outside-muted hover:text-outside-text"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-mono text-xs font-bold text-outside-text">
                        ₹{((item.unitPricePaise * item.quantity) / 100).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Tax & Checkout Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-outside-border bg-outside-bg space-y-4">
              
              {/* Place of Supply State Selector for GST Preview */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-outside-muted mb-1.5 font-bold">
                  SHIPPING DESTINATION (GST PLACE OF SUPPLY)
                </label>
                <select
                  value={buyerStateCode}
                  onChange={(e) => setBuyerStateCode(e.target.value)}
                  className="w-full bg-white border border-outside-border px-3 py-2 text-xs font-mono text-outside-text rounded-none focus:border-outside-crimson focus:outline-none"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s.code} value={s.code} className="bg-white text-outside-text">
                      {s.code} - {s.name} {s.code === '24' ? '(Origin State · CGST+SGST)' : '(IGST)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* GST Breakdown Card */}
              <div className="bg-white p-3.5 border border-outside-border font-mono text-[11px] space-y-2 shadow-xs">
                <div className="flex justify-between text-outside-muted">
                  <span>Gross Subtotal (MRP Inc.):</span>
                  <span className="text-outside-text font-bold">
                    ₹{(taxBreakdown.subtotalGrossPaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-outside-muted">
                  <span>Net Taxable Base Value:</span>
                  <span className="text-outside-text font-bold">
                    ₹{(taxBreakdown.totalTaxableAmountPaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Tax Breakdown */}
                {taxBreakdown.isInterState ? (
                  <div className="flex justify-between text-outside-crimson font-bold">
                    <span>Inter-State IGST (5%):</span>
                    <span>₹{(taxBreakdown.totalIgstPaise / 100).toLocaleString('en-IN')}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-outside-crimson font-bold">
                      <span>Gujarat CGST (2.5%):</span>
                      <span>₹{(taxBreakdown.totalCgstPaise / 100).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-outside-crimson font-bold">
                      <span>Gujarat SGST (2.5%):</span>
                      <span>₹{(taxBreakdown.totalSgstPaise / 100).toLocaleString('en-IN')}</span>
                    </div>
                  </>
                )}

                <div className="pt-2 border-t border-outside-border flex justify-between text-xs font-bold text-outside-text">
                  <span>FINAL PAYABLE:</span>
                  <span className="text-outside-crimson">
                    ₹{(taxBreakdown.finalPayablePaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Express Shipping notice */}
              <div className="flex items-center gap-2 text-[10px] font-mono text-outside-muted justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-outside-crimson" />
                <span>OFFICIAL TAX INVOICE GENERATED ON ORDER</span>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-4 bg-outside-crimson hover:bg-outside-crimsonHover text-white font-mono text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-3 transition-colors shadow-luxury"
              >
                <span>PROCEED TO SECURE CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

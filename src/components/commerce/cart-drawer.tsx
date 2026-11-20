'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-outside-charcoal border-l border-outside-border flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-outside-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-outside-crimson" />
              <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-white">
                YOUR BAG ({items.length})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-outside-muted hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-outside-muted">
                <p className="font-mono text-sm uppercase tracking-wider mb-4">Your bag is empty.</p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-outside-surface border border-outside-border hover:border-outside-crimson text-white text-xs font-mono uppercase tracking-widest transition-all"
                >
                  EXPLORE DROP 001
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-outside-surface/60 border border-outside-border rounded-none relative"
                >
                  <div className="relative w-20 h-24 bg-outside-card flex-shrink-0 border border-outside-border">
                    <Image
                      src={item.image || '/images/drops/drop-001-main.jpg'}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-white tracking-wide">
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
                        FIT: <span className="text-white">{item.fit}</span> · SIZE: <span className="text-white">{item.size}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-outside-border/60">
                      <div className="flex items-center border border-outside-border bg-outside-card">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-outside-muted hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-3 py-0.5 text-xs font-mono text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-outside-muted hover:text-white"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-mono text-xs font-bold text-white">
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
            <div className="p-6 border-t border-outside-border bg-outside-surface/40 space-y-4">
              
              {/* Place of Supply State Selector for GST Preview */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-outside-muted mb-1.5">
                  SHIPPING DESTINATION (GST PLACE OF SUPPLY)
                </label>
                <select
                  value={buyerStateCode}
                  onChange={(e) => setBuyerStateCode(e.target.value)}
                  className="w-full bg-outside-card border border-outside-border px-3 py-2 text-xs font-mono text-white rounded-none focus:border-outside-crimson focus:outline-none"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s.code} value={s.code} className="bg-outside-card text-white">
                      {s.code} - {s.name} {s.code === '24' ? '(Origin State · CGST+SGST)' : '(IGST)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* GST Breakdown Accordion Card */}
              <div className="bg-outside-card/60 p-3.5 border border-outside-border/80 font-mono text-[11px] space-y-2">
                <div className="flex justify-between text-outside-muted">
                  <span>Gross Subtotal (MRP Inc.):</span>
                  <span className="text-white">
                    ₹{(taxBreakdown.subtotalGrossPaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-outside-muted">
                  <span>Net Taxable Base:</span>
                  <span className="text-white">
                    ₹{(taxBreakdown.totalTaxableAmountPaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Tax Breakdown */}
                {taxBreakdown.isInterState ? (
                  <div className="flex justify-between text-outside-crimson">
                    <span>Inter-State IGST:</span>
                    <span>₹{(taxBreakdown.totalIgstPaise / 100).toLocaleString('en-IN')}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-outside-crimson">
                      <span>Gujarat CGST (50%):</span>
                      <span>₹{(taxBreakdown.totalCgstPaise / 100).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-outside-crimson">
                      <span>Gujarat SGST (50%):</span>
                      <span>₹{(taxBreakdown.totalSgstPaise / 100).toLocaleString('en-IN')}</span>
                    </div>
                  </>
                )}

                <div className="pt-2 border-t border-outside-border/80 flex justify-between text-xs font-bold text-white">
                  <span>FINAL PAYABLE:</span>
                  <span className="text-outside-crimson">
                    ₹{(taxBreakdown.finalPayablePaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Express Shipping & Authenticity note */}
              <div className="flex items-center gap-2 text-[10px] font-mono text-outside-muted justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-outside-crimson" />
                <span>TAX INVOICE GENERATED ON CHECKOUT · BLUEDART EXPRESS</span>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-4 bg-outside-crimson hover:bg-outside-crimsonBright text-white font-mono text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-3 transition-colors shadow-lg"
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

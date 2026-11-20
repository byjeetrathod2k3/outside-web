'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  FileText,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export default function TrackOrderPage() {
  const [orderQuery, setOrderQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const clean = orderQuery.trim();
      const res = await fetch(`/api/orders?orderNumber=${encodeURIComponent(clean)}`);

      if (!res.ok) {
        throw new Error('Order not found. Please verify your order number (e.g. ORD-2026-0001).');
      }

      const data = await res.json();
      if (!data || !data.orderNumber) {
        throw new Error('Order record could not be retrieved.');
      }

      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Tracking lookup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-outside-bg text-outside-text min-h-screen py-12 md:py-20 font-mono">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="border-b border-outside-border pb-8 space-y-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-outside-crimson uppercase tracking-[0.25em] font-bold">
            <span className="w-2 h-2 rounded-full bg-outside-crimson animate-pulse" />
            <span>COLLECTOR DISPATCH &amp; TRANSIT RADAR</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-outside-text uppercase">
            Track Your Allocation.
          </h1>
          <p className="text-sm font-sans text-outside-muted max-w-xl leading-relaxed">
            Enter your order reference code (provided in your confirmation SMS/email) to review live fulfillment status from our Ahmedabad studio.
          </p>
        </div>

        {/* Tracking Search Card */}
        <div className="bg-white border border-outside-border p-6 sm:p-8 shadow-luxury space-y-4">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                required
                placeholder="e.g. ORD-2026-0001"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="w-full px-4 py-3 bg-outside-surface/60 border border-outside-border text-xs text-outside-text font-mono focus:border-outside-crimson focus:outline-none uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-outside-text hover:bg-black text-white text-xs uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{loading ? 'LOCATING...' : 'TRACK ORDER'}</span>
            </button>
          </form>

          {error && (
            <div className="p-3 bg-outside-crimson/10 border border-outside-crimson text-outside-crimson text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-[11px] text-outside-muted font-sans">
            Need help? Contact concierge at <a href="mailto:support@outside.in" className="text-outside-crimson underline">support@outside.in</a> with your purchase details.
          </p>
        </div>

        {/* Order Result Timeline */}
        {order && (
          <div className="bg-white border border-outside-border p-6 sm:p-8 shadow-luxury space-y-8 animate-fade-in">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outside-border pb-6">
              <div>
                <span className="text-[10px] text-outside-crimson uppercase font-bold tracking-wider">
                  ALLOCATION VERIFIED // {order.placeOfSupplyState}
                </span>
                <h3 className="text-xl font-display font-black text-outside-text uppercase">
                  {order.orderNumber}
                </h3>
                <span className="text-xs text-outside-muted font-mono">
                  TAX INVOICE: {order.invoiceNumber}
                </span>
              </div>

              <Link
                href={`/checkout/success?orderNumber=${order.orderNumber}`}
                className="px-4 py-2 bg-outside-surface hover:bg-outside-border text-outside-text text-xs uppercase tracking-wider font-bold transition-colors border border-outside-border inline-flex items-center gap-1.5 self-start sm:self-auto"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>VIEW OFFICIAL GST INVOICE</span>
              </Link>
            </div>

            {/* Visual Timeline Steps */}
            <div className="space-y-6">
              <h4 className="text-xs uppercase font-bold text-outside-text tracking-wider">
                FULFILLMENT STATUS RADAR
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Step 1 */}
                <div className="p-4 bg-outside-moss/10 border border-outside-moss/30 space-y-2">
                  <div className="flex items-center gap-2 text-outside-moss font-bold text-xs uppercase">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>1. ALLOCATED</span>
                  </div>
                  <p className="text-[11px] text-outside-muted font-sans">
                    Serial number secured from active drop edition.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 bg-outside-moss/10 border border-outside-moss/30 space-y-2">
                  <div className="flex items-center gap-2 text-outside-moss font-bold text-xs uppercase">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>2. ATELIER QC</span>
                  </div>
                  <p className="text-[11px] text-outside-muted font-sans">
                    280 GSM fabric &amp; embroidery inspection verified.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 bg-outside-surface border border-outside-border space-y-2">
                  <div className="flex items-center gap-2 text-outside-text font-bold text-xs uppercase">
                    <Truck className="w-4 h-4 flex-shrink-0 text-outside-crimson" />
                    <span>3. IN TRANSIT</span>
                  </div>
                  <p className="text-[11px] text-outside-muted font-sans">
                    Dispatched via Bluedart Express Air from Ahmedabad.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-4 bg-outside-surface/40 border border-outside-border space-y-2 opacity-60">
                  <div className="flex items-center gap-2 text-outside-muted font-bold text-xs uppercase">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>4. DELIVERED</span>
                  </div>
                  <p className="text-[11px] text-outside-muted font-sans">
                    Estimated 2-4 days metro delivery.
                  </p>
                </div>
              </div>
            </div>

            {/* Recipient & Garment Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-outside-border text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-outside-muted uppercase font-bold block">COLLECTOR RECIPIENT</span>
                <p className="font-bold text-outside-text">{order.customerName}</p>
                <p className="text-outside-muted">{order.shippingAddress}, {order.shippingCity}</p>
                <p className="text-outside-muted">{order.shippingState} - {order.shippingPincode}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-outside-muted uppercase font-bold block">ALLOCATED ITEM</span>
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="font-bold text-outside-text">
                    {item.title} — {item.fit} · SIZE {item.size}
                  </div>
                ))}
                <p className="text-[11px] text-outside-moss font-bold pt-1">
                  TOTAL PAID: ₹{(order.totalAmountPaise / 100).toLocaleString('en-IN')} (INCL. 5% GST)
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

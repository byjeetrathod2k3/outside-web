'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { INDIAN_STATES } from '@/lib/gst';
import { ShieldCheck, ArrowRight, Lock, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    buyerStateCode,
    setBuyerStateCode,
    taxBreakdown,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="bg-outside-black text-outside-chalk min-h-screen py-24 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <p className="font-mono text-sm uppercase tracking-wider text-outside-muted">
            YOUR BAG IS CURRENTLY EMPTY
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3.5 bg-outside-crimson text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-outside-crimsonBright"
          >
            DISCOVER ACTIVE DROP 001
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const selectedStateObj = INDIAN_STATES.find((s) => s.code === buyerStateCode);
      const stateName = selectedStateObj ? selectedStateObj.name : 'Gujarat';

      const payload = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        shippingCity: formData.city,
        shippingState: stateName,
        shippingPincode: formData.pincode,
        stateCode: buyerStateCode,
        items: items.map((i) => ({
          dropId: i.dropId,
          variantId: i.variantId,
          title: i.title,
          fit: i.fit,
          size: i.size,
          quantity: i.quantity,
          unitPricePaise: i.unitPricePaise,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to place order');
      }

      const orderData = await res.json();
      clearCart();
      router.push(`/checkout/success?orderNumber=${orderData.orderNumber}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout processing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-outside-black text-outside-chalk min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-outside-border pb-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-outside-crimson font-bold">
              CHECKOUT // PLACE OF SUPPLY GST CALIBRATION
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white uppercase mt-1">
              Secure Order Verification
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-outside-muted">
            <Lock className="w-3.5 h-3.5 text-outside-crimson" />
            <span className="hidden sm:inline">256-BIT ENCRYPTED</span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-outside-surface border border-outside-crimson text-white text-xs font-mono flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-outside-crimson flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Customer & Delivery Address Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Customer Details */}
            <div className="p-6 bg-outside-surface border border-outside-border space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white">
                1. COLLECTOR CONTACT
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-outside-muted mb-1.5">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs font-mono text-white focus:border-outside-crimson focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-outside-muted mb-1.5">
                    EMAIL (FOR TAX INVOICE) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="diya@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs font-mono text-white focus:border-outside-crimson focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-outside-muted mb-1.5">
                  PHONE NUMBER (FOR BLUEDART OTP / DISPATCH) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs font-mono text-white focus:border-outside-crimson focus:outline-none"
                />
              </div>
            </div>

            {/* Shipping Address & GST State */}
            <div className="p-6 bg-outside-surface border border-outside-border space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white">
                  2. DELIVERY ADDRESS &amp; TAX JURISDICTION
                </h3>
                <span className="text-[10px] font-mono text-outside-crimson font-bold">
                  ORIGIN: GUJARAT (24)
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-outside-muted mb-1.5">
                  STREET ADDRESS &amp; BUILDING *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Apartment, Studio, Suite or House No."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs font-mono text-white focus:border-outside-crimson focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-outside-muted mb-1.5">
                    CITY *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai / Ahmedabad"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs font-mono text-white focus:border-outside-crimson focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-outside-muted mb-1.5">
                    STATE / UNION TERRITORY *
                  </label>
                  <select
                    value={buyerStateCode}
                    onChange={(e) => setBuyerStateCode(e.target.value)}
                    className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs font-mono text-white focus:border-outside-crimson focus:outline-none"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s.code} value={s.code} className="bg-outside-card text-white">
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-outside-muted mb-1.5">
                    PINCODE *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 400001"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs font-mono text-white focus:border-outside-crimson focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Badge */}
            <div className="p-6 bg-outside-surface border border-outside-border space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white">
                3. PAYMENT SETTLEMENT
              </h3>
              <div className="p-4 bg-outside-card border border-outside-crimson/60 flex items-center justify-between font-mono text-xs">
                <span className="text-white font-bold">UPI / CARDS / NETBANKING (SANDBOX / LIVE READY)</span>
                <span className="text-outside-crimson">VERIFIED</span>
              </div>
              <p className="text-[11px] text-outside-muted font-sans">
                Payment session will initialize automatically. An official sequential GST Tax Invoice will be generated upon confirmation.
              </p>
            </div>
          </div>

          {/* Right: Order Summary & Detailed GST Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-outside-surface border border-outside-border space-y-6 sticky top-28">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white">
                ORDER SPECIFICATION
              </h3>

              {/* Items */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs font-mono">
                    <div className="relative w-14 h-16 bg-outside-card border border-outside-border flex-shrink-0">
                      <Image
                        src={item.image || '/images/drops/drop-001-main.jpg'}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-white font-bold">{item.title}</h4>
                        <p className="text-outside-muted text-[11px]">
                          {item.fit} · SIZE {item.size} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-outside-muted">HSN: 61091000</span>
                        <span className="text-white font-bold">
                          ₹{((item.unitPricePaise * item.quantity) / 100).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* GST Calculation Table */}
              <div className="p-4 bg-outside-card border border-outside-border space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-outside-muted">
                  <span>Gross Subtotal (MRP):</span>
                  <span className="text-white">
                    ₹{(taxBreakdown.subtotalGrossPaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-outside-muted">
                  <span>Net Taxable Base Value:</span>
                  <span className="text-white">
                    ₹{(taxBreakdown.totalTaxableAmountPaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-outside-muted">
                  <span>Place of Supply (Buyer State):</span>
                  <span className="text-white">{taxBreakdown.buyerStateName} ({taxBreakdown.buyerStateCode})</span>
                </div>

                {taxBreakdown.isInterState ? (
                  <div className="flex justify-between text-outside-crimson font-bold">
                    <span>Integrated Tax (IGST @ 5%):</span>
                    <span>₹{(taxBreakdown.totalIgstPaise / 100).toLocaleString('en-IN')}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-outside-crimson font-bold">
                      <span>Central Tax (CGST @ 2.5%):</span>
                      <span>₹{(taxBreakdown.totalCgstPaise / 100).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-outside-crimson font-bold">
                      <span>State Tax (SGST @ 2.5%):</span>
                      <span>₹{(taxBreakdown.totalSgstPaise / 100).toLocaleString('en-IN')}</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between text-outside-muted">
                  <span>Express Domestic Shipping:</span>
                  <span className="text-white">FREE (COMPLIMENTARY)</span>
                </div>

                <div className="pt-3 border-t border-outside-border flex justify-between font-bold text-sm text-white">
                  <span>FINAL PAYABLE AMOUNT:</span>
                  <span className="text-outside-crimson">
                    ₹{(taxBreakdown.finalPayablePaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Complete Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-outside-crimson hover:bg-outside-crimsonBright text-white font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50"
              >
                <span>{loading ? 'SECURING ALLOCATION...' : 'AUTHORIZE PAYMENT & ISSUE INVOICE'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center font-mono text-[10px] text-outside-muted flex items-center justify-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-outside-crimson" />
                <span>OFFICIAL TAX INVOICE WITH GUJARAT GSTIN WILL BE ISSUED</span>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}

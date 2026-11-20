'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { INDIAN_STATES } from '@/lib/gst';
import { ShieldCheck, ArrowRight, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      <div className="bg-outside-bg text-outside-text min-h-screen py-24 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <p className="font-mono text-xs uppercase tracking-wider text-outside-muted">
            YOUR BAG IS CURRENTLY EMPTY
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3.5 bg-outside-crimson text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-outside-crimsonHover shadow-sm"
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
    <div className="bg-outside-bg text-outside-text min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-outside-border pb-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-outside-crimson font-bold">
              CHECKOUT // ORDER VERIFICATION
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-outside-text uppercase mt-1">
              Secure Order Verification
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-outside-muted">
            <Lock className="w-3.5 h-3.5 text-outside-crimson" />
            <span className="hidden sm:inline">256-BIT ENCRYPTED</span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-outside-crimsonSoft border border-outside-crimson text-outside-crimson text-xs font-mono flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-outside-crimson flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Customer & Delivery Address Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Customer Details */}
            <div className="p-6 bg-white border border-outside-border space-y-4 shadow-sm">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-outside-text font-bold">
                1. CONTACT DETAILS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-outside-muted mb-1.5 font-semibold">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-outside-border px-3.5 py-2.5 text-xs font-mono text-outside-text focus:border-outside-crimson focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-outside-muted mb-1.5 font-semibold">
                    EMAIL (FOR TAX INVOICE) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="diya@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-outside-border px-3.5 py-2.5 text-xs font-mono text-outside-text focus:border-outside-crimson focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-outside-muted mb-1.5 font-semibold">
                  PHONE NUMBER (FOR BLUEDART OTP / DISPATCH) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white border border-outside-border px-3.5 py-2.5 text-xs font-mono text-outside-text focus:border-outside-crimson focus:outline-none"
                />
              </div>
            </div>

            {/* Shipping Address & GST State */}
            <div className="p-6 bg-white border border-outside-border space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-outside-text font-bold">
                  2. DELIVERY ADDRESS
                </h3>
                <span className="text-[10px] font-mono text-outside-crimson font-bold">
                  FAST ALL-INDIA AIR EXPRESS DISPATCH
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-outside-muted mb-1.5 font-semibold">
                  STREET ADDRESS &amp; BUILDING *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Apartment, Studio, Suite or House No."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-white border border-outside-border px-3.5 py-2.5 text-xs font-mono text-outside-text focus:border-outside-crimson focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-outside-muted mb-1.5 font-semibold">
                    CITY *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai / Ahmedabad"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-white border border-outside-border px-3.5 py-2.5 text-xs font-mono text-outside-text focus:border-outside-crimson focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-outside-muted mb-1.5 font-semibold">
                    STATE / UNION TERRITORY *
                  </label>
                  <select
                    value={buyerStateCode}
                    onChange={(e) => setBuyerStateCode(e.target.value)}
                    className="w-full bg-white border border-outside-border px-3.5 py-2.5 text-xs font-mono text-outside-text focus:border-outside-crimson focus:outline-none"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s.code} value={s.code} className="bg-white text-outside-text">
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-outside-muted mb-1.5 font-semibold">
                    PINCODE *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 400001"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full bg-white border border-outside-border px-3.5 py-2.5 text-xs font-mono text-outside-text focus:border-outside-crimson focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Settlement */}
            <div className="p-6 bg-white border border-outside-border space-y-3 shadow-sm">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-outside-text font-bold">
                3. PAYMENT SETTLEMENT
              </h3>
              <div className="p-4 bg-outside-cardSubtle border border-outside-crimson/40 flex items-center justify-between font-mono text-xs">
                <span className="text-outside-text font-bold">UPI / CARDS / NETBANKING (LIVE READY)</span>
                <span className="text-outside-crimson font-bold">AUTHENTICATED</span>
              </div>
              <p className="text-[11px] text-outside-muted font-sans">
                An official sequential GST Tax Invoice will be generated upon confirmation and dispatched via email.
              </p>
            </div>
          </div>

          {/* Right: Order Summary & Detailed GST Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-white border border-outside-border space-y-6 sticky top-28 shadow-luxury">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-outside-text font-bold">
                ORDER SPECIFICATION
              </h3>

              {/* Items */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs font-mono">
                    <div className="relative w-14 h-16 bg-outside-bg border border-outside-border flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image || '/images/drops/drop-001-front.jpg'}
                        alt={item.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-outside-text font-bold">{item.title}</h4>
                        <p className="text-outside-muted text-[11px]">
                          {item.fit} · SIZE {item.size} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-outside-muted">HSN: 61091000</span>
                        <span className="text-outside-text font-bold">
                          ₹{((item.unitPricePaise * item.quantity) / 100).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* GST Calculation Table */}
              <div className="p-4 bg-outside-cardSubtle border border-outside-border space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-outside-muted">
                  <span>Gross Subtotal (MRP):</span>
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
                <div className="flex justify-between text-outside-crimson font-bold">
                  <span>GST (5% Included):</span>
                  <span>₹{(taxBreakdown.totalTaxPaise / 100).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-outside-muted">
                  <span>Express Domestic Shipping:</span>
                  <span className="text-outside-text font-bold">FREE (COMPLIMENTARY)</span>
                </div>

                <div className="pt-3 border-t border-outside-border flex justify-between font-bold text-sm text-outside-text">
                  <span>FINAL PAYABLE AMOUNT:</span>
                  <span className="text-outside-crimson">
                    ₹{(taxBreakdown.finalPayablePaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Complete Order Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full text-xs"
              >
                <span>PLACE ORDER &amp; PROCEED TO PAY</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="text-center font-mono text-[10px] text-outside-muted flex items-center justify-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-outside-crimson" />
                <span>OFFICIAL GST TAX INVOICE WILL BE ISSUED</span>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { INDIAN_STATES } from '@/lib/gst';
import { estimateDelivery } from '@/lib/pincode';
import { ShieldCheck, ArrowRight, Lock, AlertCircle, Zap, Check, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    buyerStateCode,
    setBuyerStateCode,
    buyerPincode,
    setBuyerPincode,
    isPrepaidDiscountApplied,
    togglePrepaidDiscount,
    prepaidDiscountPaise,
    taxBreakdown,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: buyerPincode || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-resolve city & state from buyerPincode on initial load
  useEffect(() => {
    if (buyerPincode && buyerPincode.length === 6) {
      const est = estimateDelivery(buyerPincode);
      if (est.valid) {
        if (est.stateCode) {
          setBuyerStateCode(est.stateCode);
        }
        if (est.city) {
          const autoCity = est.city.split('/')[0].trim();
          setFormData((prev) => ({
            ...prev,
            pincode: buyerPincode,
            city: prev.city || autoCity,
          }));
        }
      }
    }
  }, [buyerPincode, setBuyerStateCode]);

  const handlePincodeChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: clean }));
    if (clean.length === 6) {
      setBuyerPincode(clean);
      const est = estimateDelivery(clean);
      if (est.valid) {
        if (est.stateCode) {
          setBuyerStateCode(est.stateCode);
        }
        if (est.city) {
          const autoCity = est.city.split('/')[0].trim();
          setFormData((prev) => ({ ...prev, city: prev.city ? prev.city : autoCity }));
        }
      }
    }
  };

  const deliveryEst = formData.pincode.length === 6 ? estimateDelivery(formData.pincode) : null;

  if (items.length === 0) {
    return (
      <div className="bg-outside-canvas text-outside-ink min-h-screen py-24 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <p className="font-mono text-xs uppercase tracking-wider text-outside-inkSecondary">
            YOUR BAG IS CURRENTLY EMPTY
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3.5 bg-outside-accent text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-outside-accent/90 shadow-sm"
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
        isPrepaidDiscountApplied,
        discountPaise: prepaidDiscountPaise,
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
    <div className="bg-outside-canvas text-outside-ink min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-outside-border pb-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-outside-accent font-bold">
              CHECKOUT // ORDER VERIFICATION
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-outside-ink uppercase mt-1">
              Secure Order Verification
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-outside-inkSecondary">
            <Lock className="w-3.5 h-3.5 text-outside-accent" />
            <span className="hidden sm:inline">256-BIT ENCRYPTED</span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-outside-accent/10 border border-outside-accent text-outside-accent text-xs font-mono flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-outside-accent flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Customer & Delivery Address Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Customer Details */}
            <div className="p-6 bg-outside-elevated border border-outside-border space-y-4 shadow-sm">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-outside-ink font-bold">
                1. CONTACT DETAILS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-outside-inkSecondary mb-1.5 font-semibold">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-outside-canvas border border-outside-border px-3.5 py-2.5 text-xs font-mono text-outside-ink focus:border-outside-accent focus:ring-1 focus:ring-outside-accent focus:outline-none min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-outside-inkSecondary mb-1.5 font-semibold">
                    EMAIL (FOR TAX INVOICE) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="diya@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-outside-canvas border border-outside-border px-3.5 py-2.5 text-xs font-mono text-outside-ink focus:border-outside-accent focus:ring-1 focus:ring-outside-accent focus:outline-none min-h-[44px]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-outside-inkSecondary mb-1.5 font-semibold">
                  PHONE NUMBER (FOR BLUEDART OTP / DISPATCH) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-outside-canvas border border-outside-border px-3.5 py-2.5 text-xs font-mono text-outside-ink focus:border-outside-accent focus:ring-1 focus:ring-outside-accent focus:outline-none min-h-[44px]"
                />
              </div>
            </div>

            {/* Shipping Address & GST State */}
            <div className="p-6 bg-outside-elevated border border-outside-border space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-outside-ink font-bold">
                  2. DELIVERY ADDRESS
                </h3>
                <span className="text-[10px] font-mono text-outside-accent font-bold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span>BLUEDART AIR EXPRESS (COMPLIMENTARY)</span>
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-outside-inkSecondary mb-1.5 font-semibold">
                  STREET ADDRESS &amp; BUILDING *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Apartment, Studio, Suite or House No."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-outside-canvas border border-outside-border px-3.5 py-2.5 text-xs font-mono text-outside-ink focus:border-outside-accent focus:ring-1 focus:ring-outside-accent focus:outline-none min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-outside-inkSecondary mb-1.5 font-semibold">
                    PINCODE *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 380015"
                    value={formData.pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    className="w-full bg-outside-canvas border border-outside-border px-3.5 py-2.5 text-xs font-mono text-outside-ink focus:border-outside-accent focus:ring-1 focus:ring-outside-accent focus:outline-none min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-outside-inkSecondary mb-1.5 font-semibold">
                    CITY *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ahmedabad / Mumbai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-outside-canvas border border-outside-border px-3.5 py-2.5 text-xs font-mono text-outside-ink focus:border-outside-accent focus:ring-1 focus:ring-outside-accent focus:outline-none min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-outside-inkSecondary mb-1.5 font-semibold">
                    STATE / UNION TERRITORY *
                  </label>
                  <select
                    value={buyerStateCode}
                    onChange={(e) => setBuyerStateCode(e.target.value)}
                    className="w-full bg-outside-canvas border border-outside-border px-3.5 py-2.5 text-xs font-mono text-outside-ink focus:border-outside-accent focus:ring-1 focus:ring-outside-accent focus:outline-none min-h-[44px] cursor-pointer"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s.code} value={s.code} className="bg-outside-elevated text-outside-ink">
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Delivery ETA banner if valid pincode */}
              {deliveryEst && deliveryEst.valid && deliveryEst.estimatedDeliveryDate && (
                <div className="p-3 bg-outside-surface border border-outside-border flex items-center justify-between text-xs font-mono">
                  <span className="text-outside-inkSecondary flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-outside-accent" />
                    <span>Estimated Express Delivery:</span>
                  </span>
                  <span className="font-bold text-outside-ink">
                    {deliveryEst.estimatedDeliveryDate} ({deliveryEst.courierPartner})
                  </span>
                </div>
              )}
            </div>

            {/* Payment Settlement */}
            <div className="p-6 bg-outside-elevated border border-outside-border space-y-3 shadow-sm">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-outside-ink font-bold">
                3. PAYMENT SETTLEMENT
              </h3>
              <div className="p-4 bg-outside-surface border border-outside-accent/30 flex items-center justify-between font-mono text-xs">
                <span className="text-outside-ink font-bold">UPI / CARDS / NETBANKING (LIVE READY)</span>
                <span className="text-outside-accent font-bold">AUTHENTICATED</span>
              </div>
              <p className="text-[11px] text-outside-inkSecondary font-sans">
                An official sequential GST Tax Invoice will be generated upon confirmation and dispatched via email.
              </p>
            </div>
          </div>

          {/* Right: Order Summary & Detailed GST Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-outside-elevated border border-outside-border space-y-6 sticky top-28 shadow-luxury">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-outside-ink font-bold">
                ORDER SPECIFICATION
              </h3>

              {/* Items */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs font-mono">
                    <div className="relative w-14 h-16 bg-outside-surface border border-outside-border flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image || '/images/drops/drop-001-front.jpg'}
                        alt={item.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-outside-ink font-bold">{item.title}</h4>
                        <p className="text-outside-inkSecondary text-[11px]">
                          {item.fit} · SIZE {item.size} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-outside-inkSecondary">HSN: 61091000</span>
                        <span className="text-outside-ink font-bold">
                          ₹{((item.unitPricePaise * item.quantity) / 100).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Instant 5% UPI / Prepaid Discount Toggle */}
              <div
                onClick={togglePrepaidDiscount}
                className={`p-3.5 border rounded transition-all cursor-pointer select-none ${
                  isPrepaidDiscountApplied
                    ? 'border-outside-moss bg-outside-moss/5'
                    : 'border-outside-border bg-outside-surface/50 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                        isPrepaidDiscountApplied
                          ? 'bg-outside-moss border-outside-moss text-white'
                          : 'border-outside-inkSecondary bg-outside-canvas'
                      }`}
                    >
                      {isPrepaidDiscountApplied && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="text-[11px] font-mono font-bold text-outside-ink flex items-center gap-1">
                        <Zap className="w-3 h-3 text-outside-moss" />
                        5% INSTANT UPI / PREPAID DISCOUNT
                      </span>
                      <p className="text-[10px] text-outside-inkSecondary">
                        Applied via code: <strong className="text-outside-ink">OUTSIDE5</strong>
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

              {/* GST Calculation Table */}
              <div className="p-4 bg-outside-surface border border-outside-border space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-outside-inkSecondary">
                  <span>Gross Subtotal (MRP):</span>
                  <span className="text-outside-ink font-bold">
                    ₹{(taxBreakdown.subtotalGrossPaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>

                {isPrepaidDiscountApplied && (
                  <div className="flex justify-between text-outside-moss font-bold">
                    <span>Prepaid UPI Discount (5%):</span>
                    <span>-₹{(prepaidDiscountPaise / 100).toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-outside-inkSecondary">
                  <span>Net Taxable Base Value:</span>
                  <span className="text-outside-ink font-bold">
                    ₹{(taxBreakdown.totalTaxableAmountPaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-outside-accent font-bold">
                  <span>GST ({taxBreakdown.isInterState ? 'IGST 5%' : 'CGST 2.5% + SGST 2.5%'} Included):</span>
                  <span>₹{(taxBreakdown.totalTaxPaise / 100).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-outside-inkSecondary">
                  <span>Express Domestic Shipping:</span>
                  <span className="text-outside-moss font-bold">FREE (COMPLIMENTARY)</span>
                </div>

                <div className="pt-3 border-t border-outside-border flex justify-between font-bold text-sm text-outside-ink">
                  <span>FINAL PAYABLE AMOUNT:</span>
                  <span className="text-outside-accent text-base">
                    ₹{(taxBreakdown.finalPayablePaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* DPDP Act & Statutory Terms Explicit Consent (Unchecked by Default) */}
              <div className="flex items-start gap-2.5 pt-1 text-left">
                <input
                  type="checkbox"
                  id="checkout-consent"
                  required
                  className="mt-0.5 w-4 h-4 accent-outside-accent cursor-pointer shrink-0"
                />
                <label htmlFor="checkout-consent" className="text-[11px] text-outside-inkSecondary font-sans leading-tight cursor-pointer">
                  I agree to the{' '}
                  <Link href="/terms" className="underline hover:text-outside-ink" target="_blank">
                    Terms of Service
                  </Link>
                  , 7-day exchange policy, and consent to processing of my delivery details under the{' '}
                  <Link href="/privacy-policy" className="underline hover:text-outside-ink" target="_blank">
                    Privacy Policy
                  </Link>{' '}
                  (DPDP Act, 2023).
                </label>
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

              <div className="text-center font-mono text-[10px] text-outside-inkSecondary flex items-center justify-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-outside-moss" />
                <span>OFFICIAL GST TAX INVOICE WILL BE ISSUED</span>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}

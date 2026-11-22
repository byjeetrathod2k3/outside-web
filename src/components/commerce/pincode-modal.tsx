'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/cart-context';
import { estimateDelivery, DeliveryEstimateResult } from '@/lib/pincode';
import { X, MapPin, Truck, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

const POPULAR_CITIES = [
  { name: 'Ahmedabad', pin: '380015', tag: 'Studio Origin (1-2 Days)' },
  { name: 'Mumbai', pin: '400001', tag: 'Air Express (1-2 Days)' },
  { name: 'Delhi NCR', pin: '110001', tag: 'Air Express (2-3 Days)' },
  { name: 'Bengaluru', pin: '560001', tag: 'Air Express (2-3 Days)' },
  { name: 'Hyderabad', pin: '500001', tag: 'Air Express (2-3 Days)' },
];

export function PincodeModal() {
  const {
    isPincodeModalOpen,
    closePincodeModal,
    buyerPincode,
    setBuyerPincode,
    setBuyerStateCode,
  } = useCart();

  const [inputPin, setInputPin] = useState(buyerPincode || '380015');
  const [result, setResult] = useState<DeliveryEstimateResult | null>(null);

  useEffect(() => {
    if (buyerPincode && buyerPincode.length === 6) {
      setInputPin(buyerPincode);
      setResult(estimateDelivery(buyerPincode));
    }
  }, [buyerPincode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePincodeModal();
    };
    if (isPincodeModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isPincodeModalOpen, closePincodeModal]);

  if (!isPincodeModalOpen) return null;

  const handleApply = (pinToApply: string) => {
    const clean = pinToApply.replace(/\D/g, '').trim();
    if (clean.length === 6) {
      const res = estimateDelivery(clean);
      setResult(res);
      if (res.valid) {
        setBuyerPincode(clean);
        if (res.stateCode) {
          setBuyerStateCode(res.stateCode);
        }
      }
    }
  };

  const handleConfirmAndClose = () => {
    if (result && result.valid) {
      setBuyerPincode(result.pincode);
      if (result.stateCode) {
        setBuyerStateCode(result.stateCode);
      }
    }
    closePincodeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-outside-ink/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-outside-elevated border border-outside-border rounded-lg shadow-2xl overflow-hidden p-6 sm:p-8 animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pincode-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={closePincodeModal}
          className="absolute top-5 right-5 p-2 text-outside-inkSecondary hover:text-outside-ink transition-colors rounded-full hover:bg-outside-surface cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-outside-surface flex items-center justify-center text-outside-accent">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h2 id="pincode-modal-title" className="text-sm font-mono font-bold tracking-[0.2em] text-outside-ink uppercase">
              SELECT DELIVERY LOCATION
            </h2>
            <p className="text-xs text-outside-inkSecondary font-mono">
              Live Air Express delivery timelines from our Ahmedabad Studio (24)
            </p>
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-6">
          <label htmlFor="pincode-input" className="block text-[11px] font-mono uppercase tracking-widest text-outside-ink mb-2">
            Enter 6-Digit Indian Pincode
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                id="pincode-input"
                type="text"
                maxLength={6}
                value={inputPin}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setInputPin(val);
                  if (val.length === 6) {
                    handleApply(val);
                  }
                }}
                placeholder="e.g. 400001"
                className="w-full bg-outside-surface/70 border border-outside-border px-4 py-3 text-sm font-mono tracking-widest text-outside-ink focus:outline-none focus:border-outside-ink rounded"
              />
            </div>
            <button
              onClick={() => handleApply(inputPin)}
              disabled={inputPin.length !== 6}
              className="px-5 py-3 bg-outside-ink text-outside-elevated text-xs font-mono uppercase tracking-[0.15em] font-bold hover:bg-outside-ink/90 disabled:opacity-50 transition-all rounded cursor-pointer"
            >
              Check
            </button>
          </div>
        </div>

        {/* Quick Select Popular Cities */}
        <div className="mt-5">
          <p className="text-[10px] font-mono uppercase tracking-wider text-outside-inkSecondary mb-2">
            Popular Metro Hubs:
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_CITIES.map((city) => (
              <button
                key={city.pin}
                onClick={() => {
                  setInputPin(city.pin);
                  handleApply(city.pin);
                }}
                className={`text-[11px] font-mono px-3 py-1.5 rounded border transition-all cursor-pointer ${
                  inputPin === city.pin
                    ? 'border-outside-ink bg-outside-ink text-outside-elevated font-bold'
                    : 'border-outside-border bg-outside-surface/40 text-outside-inkSecondary hover:text-outside-ink hover:border-outside-inkSecondary'
                }`}
              >
                {city.name} ({city.pin})
              </button>
            ))}
          </div>
        </div>

        {/* Live Delivery Result Display */}
        {result && result.valid && (
          <div className="mt-6 p-4 rounded bg-outside-surface/70 border border-outside-moss/30 animate-fade-in">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-outside-moss" />
                  <span className="text-xs font-mono font-bold text-outside-ink uppercase">
                    Delivering to {result.city}, {result.state}
                  </span>
                </div>
                <p className="text-sm font-bold text-outside-ink mt-1">
                  Expected by <span className="text-outside-accent">{result.estimatedDeliveryDate}</span>
                </p>
                <p className="text-[11px] font-mono text-outside-inkSecondary mt-0.5">
                  Transit duration: {result.transitDaysMin}–{result.transitDaysMax} business days via {result.courierPartner}
                </p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-outside-moss/10 text-outside-moss border border-outside-moss/20 font-bold whitespace-nowrap">
                FREE EXPRESS
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-outside-border/60 flex items-center gap-2 text-[11px] font-mono text-outside-inkSecondary">
              <ShieldCheck className="w-3.5 h-3.5 text-outside-moss shrink-0" />
              <span>Direct express air dispatch from our Ahmedabad studio. No third-party drop-shipping.</span>
            </div>
          </div>
        )}

        {result && !result.valid && result.error && (
          <div className="mt-4 p-3 rounded bg-outside-accent/10 border border-outside-accent/30 text-outside-accent text-xs font-mono">
            {result.error}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-outside-border">
          <button
            onClick={closePincodeModal}
            className="px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-outside-inkSecondary hover:text-outside-ink cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmAndClose}
            className="px-6 py-2.5 bg-outside-ink text-outside-elevated text-xs font-mono uppercase tracking-[0.2em] font-bold hover:bg-outside-ink/90 transition-all rounded cursor-pointer flex items-center gap-2"
          >
            Confirm Location
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
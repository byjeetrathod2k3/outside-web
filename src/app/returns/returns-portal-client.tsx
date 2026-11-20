'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, PackageCheck, AlertCircle, RefreshCw } from 'lucide-react';

const REASON_OPTIONS = [
  'Size Too Fitted — Exchange for one size up',
  'Size Too Oversized — Exchange for one size down',
  'Switch Fit (Change between Women\'s Boxy and Men\'s Structured)',
  'Fabric trial / Color tone inspection',
  'Damaged in Transit / Courier Box Defect',
];

const TARGET_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

export function ReturnsPortalClient() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState(REASON_OPTIONS[0]);
  const [targetSize, setTargetSize] = useState('L');
  const [targetFit, setTargetFit] = useState<'WOMEN' | 'MEN'>('WOMEN');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    reverseRma: string;
    courier: string;
    pickupWindow: string;
    targetItem: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      setSubmittedData({
        reverseRma: `RMA-${orderNumber.replace(/[^A-Za-z0-9]/g, '').slice(-6) || 'OUT001'}-${randomSuffix}`,
        courier: 'Bluedart Air Express Reverse Logistics',
        pickupWindow: 'Within 24 to 48 Hours',
        targetItem: `DROP 001 (${targetFit === 'WOMEN' ? "WOMEN'S FIT" : "MEN'S FIT"} · SIZE ${targetSize})`,
      });
      setIsSubmitting(false);
    }, 800);
  };

  const handleReset = () => {
    setSubmittedData(null);
    setOrderNumber('');
    setEmail('');
  };

  if (submittedData) {
    return (
      <div className="bg-outside-elevated border border-outside-moss p-6 sm:p-8 space-y-6 shadow-gallery animate-fade-in font-mono">
        <div className="flex items-center gap-3 text-outside-moss">
          <div className="w-10 h-10 rounded-full bg-outside-moss/10 flex items-center justify-center">
            <PackageCheck className="w-6 h-6 text-outside-moss" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-outside-moss font-bold">
              DOORSTEP REVERSE PICKUP SCHEDULED
            </span>
            <h2 className="text-xl font-bold text-outside-ink uppercase">
              RMA Docket: {submittedData.reverseRma}
            </h2>
          </div>
        </div>

        <div className="p-4 bg-outside-surface border border-outside-border space-y-3 text-xs">
          <div className="flex justify-between border-b border-outside-border pb-2">
            <span className="text-outside-inkSecondary">Allocated Replacement Piece:</span>
            <span className="font-bold text-outside-ink">{submittedData.targetItem}</span>
          </div>
          <div className="flex justify-between border-b border-outside-border pb-2">
            <span className="text-outside-inkSecondary">Reverse Courier Partner:</span>
            <span className="font-bold text-outside-ink">{submittedData.courier}</span>
          </div>
          <div className="flex justify-between border-b border-outside-border pb-2">
            <span className="text-outside-inkSecondary">Expected Doorstep Pickup:</span>
            <span className="font-bold text-outside-accent">{submittedData.pickupWindow}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-outside-inkSecondary">Zero-Cost Guarantee:</span>
            <span className="font-bold text-outside-moss">₹0 (100% Free Domestic Service)</span>
          </div>
        </div>

        <div className="space-y-2 text-xs text-outside-inkSecondary font-sans">
          <p>
            An SMS confirmation with courier pickup OTP has been dispatched to your contact details. Please keep the garment folded inside the original sandstone packaging box for the Bluedart air runner.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 bg-outside-surface border border-outside-border text-outside-ink hover:border-outside-ink text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Process Another Order</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-outside-elevated border border-outside-border p-6 sm:p-8 shadow-editorial">
      <div className="border-b border-outside-border pb-4 mb-6">
        <h2 className="text-base font-mono font-bold uppercase tracking-wider text-outside-ink">
          Initiate Doorstep Exchange Request
        </h2>
        <p className="text-xs text-outside-inkSecondary font-mono mt-1">
          Zero questions asked · Free reverse courier pickup nationwide
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="order-num" className="block text-[11px] uppercase tracking-wider text-outside-ink font-bold mb-2">
              Order Number *
            </label>
            <input
              id="order-num"
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. OUT-20261120-XXXX"
              className="w-full bg-outside-surface/70 border border-outside-border px-3.5 py-2.5 text-outside-ink focus:outline-none focus:border-outside-ink rounded"
            />
          </div>

          <div>
            <label htmlFor="order-email" className="block text-[11px] uppercase tracking-wider text-outside-ink font-bold mb-2">
              Order Email Address *
            </label>
            <input
              id="order-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-outside-surface/70 border border-outside-border px-3.5 py-2.5 text-outside-ink focus:outline-none focus:border-outside-ink rounded"
            />
          </div>
        </div>

        <div>
          <label htmlFor="exchange-reason" className="block text-[11px] uppercase tracking-wider text-outside-ink font-bold mb-2">
            Reason For Exchange *
          </label>
          <select
            id="exchange-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-outside-surface/70 border border-outside-border px-3.5 py-2.5 text-outside-ink focus:outline-none focus:border-outside-ink rounded cursor-pointer"
          >
            {REASON_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 bg-outside-surface/50 border border-outside-border space-y-3">
          <span className="block text-[11px] uppercase tracking-wider text-outside-ink font-bold">
            Desired Replacement Specification:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="block text-[10px] text-outside-inkSecondary uppercase mb-1">
                Target Fit Style:
              </span>
              <div className="flex gap-2">
                {(['WOMEN', 'MEN'] as const).map((fit) => (
                  <button
                    key={fit}
                    type="button"
                    onClick={() => setTargetFit(fit)}
                    className={`flex-1 py-2 text-[11px] uppercase border transition-all cursor-pointer ${
                      targetFit === fit
                        ? 'border-outside-ink bg-outside-ink text-outside-elevated font-bold'
                        : 'border-outside-border bg-outside-elevated text-outside-inkSecondary hover:text-outside-ink'
                    }`}
                  >
                    {fit === 'WOMEN' ? "Women's Fit" : "Men's Fit"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-[10px] text-outside-inkSecondary uppercase mb-1">
                Target Replacement Size:
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {TARGET_SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setTargetSize(sz)}
                    className={`px-3 py-2 text-[11px] border transition-all cursor-pointer ${
                      targetSize === sz
                        ? 'border-outside-accent bg-outside-accent text-white font-bold'
                        : 'border-outside-border bg-outside-elevated text-outside-inkSecondary hover:text-outside-ink'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !orderNumber || !email}
          className="w-full py-4 bg-outside-ink text-outside-elevated hover:bg-outside-ink/90 disabled:opacity-50 text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all rounded cursor-pointer"
        >
          <span>{isSubmitting ? 'GENERATING REVERSE DOCKET...' : 'SUBMIT REVERSE PICKUP REQUEST'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
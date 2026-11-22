'use client';

import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import type { VipOrder } from '@/lib/vip-db';

interface ReturnExchangeModalProps {
  order: VipOrder | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReturnExchangeModal({ order, onClose, onSuccess }: ReturnExchangeModalProps) {
  const [type, setType] = useState<'EXCHANGE' | 'RETURN'>('EXCHANGE');
  const [exchangeSize, setExchangeSize] = useState('L');
  const [reason, setReason] = useState('Need different size - garment is more oversized than anticipated');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRma, setSubmittedRma] = useState<string | null>(null);

  useEffect(() => {
    if (!order) return;
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
  }, [order, onClose]);

  if (!order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/vip/orders/${order.id}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          exchangeSize: type === 'EXCHANGE' ? exchangeSize : undefined,
          reason: additionalNotes ? `${reason} — ${additionalNotes}` : reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit exchange request');
      }

      setSubmittedRma(data.rmaCode);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error processing request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#111110]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-[#FCFBF8] border border-[#DCD7CC] shadow-2xl z-10 my-8 p-6 sm:p-8 font-mono text-xs max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DCD7CC]">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#B82328]" />
            <div>
              <span className="text-[10px] text-[#B82328] uppercase tracking-widest font-bold block">
                7-DAY DOORSTEP EXCHANGE &amp; RETURN
              </span>
              <h2 className="text-sm font-bold text-[#111110] uppercase">
                Order // {order.orderNumber}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#52504B] hover:text-[#111110] border border-[#DCD7CC] hover:bg-[#EDEAE2] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedRma ? (
          /* Confirmation View */
          <div className="py-8 space-y-4 text-center">
            <div className="inline-flex p-3 bg-emerald-100 text-emerald-800 rounded-full mb-1">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#111110] uppercase">
              RMA Registered: {submittedRma}
            </h3>
            <p className="text-xs text-[#52504B] leading-relaxed max-w-sm mx-auto">
              Your {type === 'EXCHANGE' ? 'size exchange' : 'return'} request has been logged in our Ahmedabad studio queue. A doorstep reverse pickup will be initiated within 24 hours.
            </p>
            <div className="p-3 bg-[#EDEAE2] border border-[#DCD7CC] text-[11px] text-[#111110] text-left space-y-1">
              <p><strong>Pickup Address:</strong> {order.shippingAddress.streetAddress}, {order.shippingAddress.city}</p>
              <p><strong>Instructions:</strong> Please hand over the unworn garment with its sewn-in canvas tag to the Bluedart / Delhivery executive.</p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#111110] text-[#FCFBF8] hover:bg-[#B82328] uppercase font-bold tracking-wider transition-colors cursor-pointer"
            >
              RETURN TO DASHBOARD
            </button>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {error && (
              <div className="p-3 bg-[#B82328]/10 border border-[#B82328] text-[#B82328] text-xs">
                {error}
              </div>
            )}

            {/* Request Type Switcher */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('EXCHANGE')}
                className={`py-2.5 px-3 border text-center font-bold transition-all cursor-pointer ${
                  type === 'EXCHANGE'
                    ? 'bg-[#111110] text-[#FCFBF8] border-[#111110]'
                    : 'bg-[#EDEAE2]/50 text-[#52504B] border-[#DCD7CC] hover:bg-[#EDEAE2]'
                }`}
              >
                SIZE EXCHANGE
              </button>
              <button
                type="button"
                onClick={() => setType('RETURN')}
                className={`py-2.5 px-3 border text-center font-bold transition-all cursor-pointer ${
                  type === 'RETURN'
                    ? 'bg-[#111110] text-[#FCFBF8] border-[#111110]'
                    : 'bg-[#EDEAE2]/50 text-[#52504B] border-[#DCD7CC] hover:bg-[#EDEAE2]'
                }`}
              >
                RETURN FOR REFUND
              </button>
            </div>

            {/* Target Size (For Exchanges) */}
            {type === 'EXCHANGE' && (
              <div className="space-y-1.5 p-3.5 bg-[#EDEAE2]/50 border border-[#DCD7CC]">
                <label className="text-[11px] uppercase tracking-wider text-[#111110] font-bold block">
                  Select Desired Replacement Size
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setExchangeSize(sz)}
                      className={`py-2 border text-center font-bold text-xs transition-colors cursor-pointer ${
                        exchangeSize === sz
                          ? 'bg-[#B82328] text-white border-[#B82328]'
                          : 'bg-white text-[#111110] border-[#DCD7CC] hover:border-[#111110]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-[#52504B] pt-1">
                  Exchange units are reserved immediately from our limited 250-piece edition safety buffer.
                </p>
              </div>
            )}

            {/* Reason */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#52504B] font-bold block">
                Reason for {type === 'EXCHANGE' ? 'Exchange' : 'Return'}
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
              >
                <option value="Need different size - garment is more oversized than anticipated">
                  Need different size — Boxy cut is more oversized than anticipated
                </option>
                <option value="Need different size - collar or shoulder fits too snugly">
                  Need different size — Collar or shoulder fits too snugly
                </option>
                <option value="Fabric weight difference preference">
                  Fabric weight — Prefer different drape / weight
                </option>
                <option value="Changed styling preference">
                  Changed styling preference
                </option>
                <option value="Other studio inquiry">
                  Other studio reason
                </option>
              </select>
            </div>

            {/* Additional Comments */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#52504B] font-bold block">
                Additional Comments / Fitting Notes
              </label>
              <textarea
                rows={3}
                placeholder="Share any specific notes for our studio tailoring desk..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
              />
            </div>

            <div className="p-3 bg-[#EDEAE2]/40 border border-[#DCD7CC] flex items-center gap-2 text-[10px] text-[#52504B]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Free doorstep exchange shipping under our 7-day studio guarantee.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#111110] hover:bg-[#B82328] text-[#FCFBF8] text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md"
            >
              <span>{loading ? 'TRANSMITTING REQUEST...' : `SUBMIT ${type} REQUEST`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

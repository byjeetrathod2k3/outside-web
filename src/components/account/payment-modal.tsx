'use client';

import React, { useState, useEffect } from 'react';
import { X, CreditCard, ArrowRight, ShieldCheck, Smartphone } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function PaymentModal({ isOpen, onClose, onSaved }: PaymentModalProps) {
  const [methodType, setMethodType] = useState<'CARD' | 'UPI'>('CARD');
  
  // Card
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardBrand, setCardBrand] = useState('Visa');

  // UPI
  const [vpa, setVpa] = useState('');
  const [upiHolder, setUpiHolder] = useState('');

  const [isDefault, setIsDefault] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let payload: any = {
        type: methodType,
        isDefault,
      };

      if (methodType === 'CARD') {
        const cleanCard = cardNumber.replace(/\s+/g, '');
        if (cleanCard.length < 4) {
          throw new Error('Please enter a valid card number');
        }
        const last4 = cleanCard.slice(-4);
        const [m, y] = cardExpiry.split('/');
        payload = {
          ...payload,
          brand: cardBrand,
          last4OrVpa: last4,
          expiryMonth: m?.trim() || '12',
          expiryYear: y ? `20${y.trim()}` : '2028',
          holderName: cardHolder.trim() || 'Elena Vance',
        };
      } else {
        if (!vpa.includes('@')) {
          throw new Error('Please enter a valid UPI ID (e.g. username@okhdfcbank)');
        }
        payload = {
          ...payload,
          brand: 'UPI Digital Wallet',
          last4OrVpa: vpa.trim(),
          holderName: upiHolder.trim() || 'Elena Vance',
        };
      }

      const res = await fetch('/api/vip/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save payment method');
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error tokenizing payment instrument');
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
        
        <div className="flex items-center justify-between pb-4 border-b border-[#DCD7CC]">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#B82328]" />
            <div>
              <span className="text-[10px] text-[#B82328] uppercase tracking-widest font-bold block">
                PCI-DSS TOKENIZED VAULT
              </span>
              <h2 className="text-sm font-bold text-[#111110] uppercase">
                Add Saved Payment Instrument
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

        {/* Instrument Switcher */}
        <div className="grid grid-cols-2 gap-2 pt-4">
          <button
            type="button"
            onClick={() => setMethodType('CARD')}
            className={`py-2.5 px-3 border text-center font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              methodType === 'CARD'
                ? 'bg-[#111110] text-[#FCFBF8] border-[#111110]'
                : 'bg-[#EDEAE2]/50 text-[#52504B] border-[#DCD7CC] hover:bg-[#EDEAE2]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>CREDIT / DEBIT CARD</span>
          </button>
          <button
            type="button"
            onClick={() => setMethodType('UPI')}
            className={`py-2.5 px-3 border text-center font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              methodType === 'UPI'
                ? 'bg-[#111110] text-[#FCFBF8] border-[#111110]'
                : 'bg-[#EDEAE2]/50 text-[#52504B] border-[#DCD7CC] hover:bg-[#EDEAE2]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>UPI / DIGITAL WALLET</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <div className="p-3 bg-[#B82328]/10 border border-[#B82328] text-[#B82328] text-xs">
              {error}
            </div>
          )}

          {methodType === 'CARD' ? (
            /* Card Input Fields */
            <>
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#52504B] font-bold block">
                  Card Brand
                </label>
                <select
                  value={cardBrand}
                  onChange={(e) => setCardBrand(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
                >
                  <option value="Visa">Visa Infinite / Signature</option>
                  <option value="Mastercard">Mastercard World Elite</option>
                  <option value="American Express">American Express Platinum</option>
                  <option value="RuPay">RuPay Select (India)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#52504B] font-bold block">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="4242 •••• •••• 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none tracking-widest font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#52504B] font-bold block">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name on Card"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#52504B] font-bold block">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
                  />
                </div>
              </div>
            </>
          ) : (
            /* UPI Input Fields */
            <>
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#52504B] font-bold block">
                  Virtual Payment Address (VPA / UPI ID)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. mobile@okhdfcbank or name@paytm"
                  value={vpa}
                  onChange={(e) => setVpa(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#52504B] font-bold block">
                  UPI Account Holder Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Full Name as registered with Bank"
                  value={upiHolder}
                  onChange={(e) => setUpiHolder(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
                />
              </div>
            </>
          )}

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefaultPm"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 text-[#B82328] focus:ring-0 border-[#DCD7CC] rounded-none cursor-pointer"
            />
            <label htmlFor="isDefaultPm" className="text-xs text-[#111110] font-bold cursor-pointer">
              Set as default payment instrument for priority drop checkout
            </label>
          </div>

          <div className="p-3 bg-[#EDEAE2]/40 border border-[#DCD7CC] flex items-center gap-2 text-[10px] text-[#52504B]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Card numbers are never stored in plain text. RBI Tokenized Vault standards enforced.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#111110] hover:bg-[#B82328] text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md mt-4"
          >
            <span>{loading ? 'TOKENIZING INSTRUMENT...' : 'SAVE TO VIP PAYMENT METHODS'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
}

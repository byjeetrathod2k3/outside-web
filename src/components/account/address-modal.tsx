'use client';

import React, { useState } from 'react';
import { X, MapPin, ArrowRight } from 'lucide-react';
import type { VipAddress } from '@/lib/vip-db';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialAddress?: VipAddress | null;
}

export function AddressModal({ isOpen, onClose, onSaved, initialAddress }: AddressModalProps) {
  const [label, setLabel] = useState(initialAddress?.label || 'Primary Residence');
  const [recipientName, setRecipientName] = useState(initialAddress?.recipientName || '');
  const [phone, setPhone] = useState(initialAddress?.phone || '');
  const [streetAddress, setStreetAddress] = useState(initialAddress?.streetAddress || '');
  const [city, setCity] = useState(initialAddress?.city || 'Mumbai');
  const [state, setState] = useState(initialAddress?.state || 'Maharashtra');
  const [stateCode, setStateCode] = useState(initialAddress?.stateCode || '27');
  const [pincode, setPincode] = useState(initialAddress?.pincode || '');
  const [isDefault, setIsDefault] = useState(initialAddress ? initialAddress.isDefault : true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const isEdit = Boolean(initialAddress?.id);
      const url = '/api/vip/addresses';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        ...(isEdit ? { id: initialAddress?.id } : {}),
        label,
        recipientName,
        phone,
        streetAddress,
        city,
        state,
        stateCode,
        pincode,
        isDefault,
        type: 'SHIPPING',
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save address');
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error saving address');
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
            <MapPin className="w-5 h-5 text-[#B82328]" />
            <div>
              <span className="text-[10px] text-[#B82328] uppercase tracking-widest font-bold block">
                VIP ADDRESS BOOK
              </span>
              <h2 className="text-sm font-bold text-[#111110] uppercase">
                {initialAddress ? 'Edit Delivery Address' : 'Add New Address'}
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

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <div className="p-3 bg-[#B82328]/10 border border-[#B82328] text-[#B82328] text-xs">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#52504B] font-bold block">
              Address Label
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Primary Residence / Studio Office"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#52504B] font-bold block">
                Recipient Name
              </label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#52504B] font-bold block">
                Contact Phone
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98200 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#52504B] font-bold block">
              Street &amp; Building Address
            </label>
            <textarea
              rows={2}
              required
              placeholder="Flat/House No., Building Name, Street, Landmark"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#52504B] font-bold block">
                City
              </label>
              <input
                type="text"
                required
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#52504B] font-bold block">
                State
              </label>
              <select
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  if (e.target.value === 'Gujarat') setStateCode('24');
                  else if (e.target.value === 'Maharashtra') setStateCode('27');
                  else if (e.target.value === 'Karnataka') setStateCode('29');
                  else if (e.target.value === 'Delhi') setStateCode('07');
                }}
                className="w-full px-2 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
              >
                <option value="Gujarat">Gujarat (24)</option>
                <option value="Maharashtra">Maharashtra (27)</option>
                <option value="Karnataka">Karnataka (29)</option>
                <option value="Delhi">Delhi (07)</option>
                <option value="Tamil Nadu">Tamil Nadu (33)</option>
                <option value="Rajasthan">Rajasthan (08)</option>
                <option value="Telangana">Telangana (36)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#52504B] font-bold block">
                Pincode
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="6 Digits"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefaultAddr"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 text-[#B82328] focus:ring-0 border-[#DCD7CC] rounded-none cursor-pointer"
            />
            <label htmlFor="isDefaultAddr" className="text-xs text-[#111110] font-bold cursor-pointer">
              Set as primary default address for one-click express checkout
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#111110] hover:bg-[#B82328] text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md mt-4"
          >
            <span>{loading ? 'SAVING ADDRESS...' : 'SAVE ADDRESS TO PROFILE'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
}

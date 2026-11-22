'use client';

import React, { useState, useEffect } from 'react';
import { X, MessageSquare, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function TicketModal({ isOpen, onClose, onSaved }: TicketModalProps) {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'VIP_CONCIERGE' | 'SIZING_INQUIRY' | 'ORDER_TRACKING' | 'EXCHANGE_REQUEST' | 'PRODUCT_DETAIL'>('VIP_CONCIERGE');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'NORMAL' | 'VIP_PRIORITY'>('VIP_PRIORITY');
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
      const res = await fetch('/api/vip/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          category,
          message,
          priority,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit ticket');
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error transmitting ticket to concierge desk');
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
            <MessageSquare className="w-5 h-5 text-[#B82328]" />
            <div>
              <span className="text-[10px] text-[#B82328] uppercase tracking-widest font-bold block">
                ATELIER CUSTOMER SUPPORT DESK
              </span>
              <h2 className="text-sm font-bold text-[#111110] uppercase">
                Open Support Ticket // Studio Channel
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
              Inquiry Category
            </label>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
            >
              <option value="VIP_CONCIERGE">Customer Support / Drop Inquiries</option>
              <option value="SIZING_INQUIRY">Sizing Matrix &amp; Fit Recommendations</option>
              <option value="ORDER_TRACKING">Air Cargo Dispatch &amp; Tracking Follow-Up</option>
              <option value="EXCHANGE_REQUEST">7-Day Doorstep Exchange Inquiries</option>
              <option value="PRODUCT_DETAIL">280 GSM French Terry Craft &amp; Care</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#52504B] font-bold block">
              Ticket Subject / Brief
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sizing guidance on DROP 002 Boxy Shoulder cut"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#52504B] font-bold block">
              Message for Atelier Concierge
            </label>
            <textarea
              rows={4}
              required
              placeholder="Please provide details about your inquiry..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] focus:outline-none leading-relaxed"
            />
          </div>

          <div className="p-3 bg-[#EDEAE2]/50 border border-[#DCD7CC] flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#111110] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#B82328]" />
              SLA Resolution Priority:
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-[#B82328] text-white font-bold">
              VIP PRIORITY (&lt; 2 HOURS)
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#111110] hover:bg-[#B82328] text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md mt-4"
          >
            <span>{loading ? 'SUBMITTING TO CONCIERGE...' : 'DISPATCH SUPPORT TICKET'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
}

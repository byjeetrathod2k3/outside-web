'use client';

import React, { useState } from 'react';
import { X, Plane, CheckCircle2, Clock, MapPin, Copy, Check, ShieldCheck } from 'lucide-react';
import type { VipOrder } from '@/lib/vip-db';

interface TrackingModalProps {
  order: VipOrder | null;
  onClose: () => void;
}

export function TrackingModal({ order, onClose }: TrackingModalProps) {
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!order) return null;

  const handleCopyAwb = () => {
    navigator.clipboard.writeText(order.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#111110]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-[#FCFBF8] border border-[#DCD7CC] shadow-2xl z-10 my-8 p-6 sm:p-8 font-mono text-xs max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DCD7CC]">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-[#B82328]" />
            <div>
              <span className="text-[10px] text-[#B82328] uppercase tracking-widest font-bold block">
                LIVE AIR FREIGHT TELEMETRY
              </span>
              <h2 className="text-sm font-bold text-[#111110] uppercase">
                Shipment Tracking // {order.orderNumber}
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

        {/* Dispatch Summary */}
        <div className="my-5 p-4 bg-[#EDEAE2]/60 border border-[#DCD7CC] space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-[#52504B] uppercase tracking-wider block">LOGISTICS CARRIER</span>
              <span className="font-bold text-xs text-[#111110]">{order.carrier}</span>
            </div>
            <div className="sm:text-right">
              <span className="text-[10px] text-[#52504B] uppercase tracking-wider block">AIR WAYBILL (AWB)</span>
              <button
                onClick={handleCopyAwb}
                className="inline-flex items-center gap-1.5 font-bold text-xs text-[#111110] hover:text-[#B82328] transition-colors cursor-pointer group"
              >
                <span>{order.trackingNumber}</span>
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#52504B] group-hover:text-[#B82328]" />}
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-[#DCD7CC] flex items-center justify-between text-[11px]">
            <span className="text-[#52504B]">DESTINATION:</span>
            <span className="font-bold text-[#111110]">
              {order.shippingAddress.city}, {order.shippingAddress.state} ({order.shippingAddress.pincode})
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-6 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#52504B] block">
            TRANSIT CHECKPOINTS &amp; TELEMETRY
          </span>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#DCD7CC]">
            {order.trackingTimeline.map((event, idx) => {
              const isCompleted = event.status === 'COMPLETED';
              const isInTransit = event.status === 'IN_TRANSIT';

              return (
                <div key={idx} className="relative">
                  {/* Indicator Dot */}
                  <span
                    className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : isInTransit
                        ? 'bg-[#B82328] border-[#B82328] text-white animate-pulse'
                        : 'bg-[#FCFBF8] border-[#DCD7CC] text-[#52504B]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-2.5 h-2.5" /> : null}
                  </span>

                  <div className="space-y-0.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className={`font-bold text-xs ${isCompleted ? 'text-[#111110]' : isInTransit ? 'text-[#B82328]' : 'text-[#52504B]'}`}>
                        {event.title}
                      </span>
                      <span className="text-[10px] text-[#52504B]">{event.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#52504B]">
                      <MapPin className="w-3 h-3 text-[#B82328]" />
                      <span>{event.location}</span>
                    </div>

                    {event.note && (
                      <p className="text-[10px] text-[#52504B] pt-0.5 bg-[#EDEAE2]/40 p-2 border border-[#DCD7CC]/60 mt-1">
                        {event.note}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security & SLAs */}
        <div className="mt-8 pt-4 border-t border-[#DCD7CC] flex items-center justify-between text-[10px] text-[#52504B]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Air Cargo Verified SLA
          </span>
          <span>OUTSIDE STUDIO LOGISTICS</span>
        </div>

      </div>
    </div>
  );
}

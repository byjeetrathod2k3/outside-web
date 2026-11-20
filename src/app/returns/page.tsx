import React from 'react';
import { Metadata } from 'next';
import { ReturnsPortalClient } from './returns-portal-client';
import { ShieldCheck, Truck, RotateCcw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { JsonLd, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Automated 7-Day Doorstep Returns & Exchanges Portal',
  description:
    'Self-service reverse pickup & size exchanges for OUTSIDE serialized apparel. Free Bluedart Air courier pickup from your doorstep across India.',
  alternates: {
    canonical: 'https://www.outside.in/returns',
  },
};

export default function ReturnsPage() {
  const breadcrumb = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Doorstep Exchanges', url: '/returns' },
  ]);

  return (
    <div className="bg-outside-canvas text-outside-ink min-h-screen py-12 lg:py-20">
      <JsonLd data={breadcrumb} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Editorial Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-outside-surface border border-outside-border text-outside-accent text-[11px] font-mono font-bold tracking-[0.25em] uppercase">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>SEAMLESS CLIENT CARE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-outside-ink uppercase">
            7-DAY DOORSTEP EXCHANGES
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-outside-inkSecondary font-sans leading-relaxed">
            We want every OUTSIDE piece to fit your frame with absolute confidence. If your silhouette or size requires calibration, initiate a zero-cost doorstep reverse pickup within 7 days of delivery.
          </p>
        </div>

        {/* 3-Step Exchange Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-outside-elevated border border-outside-border shadow-xs space-y-2">
            <span className="text-xs font-mono font-bold text-outside-accent">01 // INSTANT INITIATION</span>
            <h3 className="text-sm font-bold uppercase text-outside-ink">Submit Order ID</h3>
            <p className="text-xs text-outside-inkSecondary leading-relaxed">
              Enter your Order Number and verified email below to pick your desired replacement size or cut.
            </p>
          </div>

          <div className="p-5 bg-outside-elevated border border-outside-border shadow-xs space-y-2">
            <span className="text-xs font-mono font-bold text-outside-accent">02 // DOORSTEP PICKUP</span>
            <h3 className="text-sm font-bold uppercase text-outside-ink">Bluedart Reverse Air</h3>
            <p className="text-xs text-outside-inkSecondary leading-relaxed">
              Our courier executive arrives at your address with a tamper-proof security flyer within 24–48 hours.
            </p>
          </div>

          <div className="p-5 bg-outside-elevated border border-outside-border shadow-xs space-y-2">
            <span className="text-xs font-mono font-bold text-outside-accent">03 // EXPRESS SWAP</span>
            <h3 className="text-sm font-bold uppercase text-outside-ink">Direct Atelier Dispatch</h3>
            <p className="text-xs text-outside-inkSecondary leading-relaxed">
              Your new size is reserved and dispatched from Ahmedabad immediately upon courier pickup scan.
            </p>
          </div>
        </div>

        {/* Interactive Self-Service Portal Component */}
        <ReturnsPortalClient />

        {/* Statutory Conditions & Guarantee Table */}
        <div className="p-6 bg-outside-surface border border-outside-border space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-outside-ink font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-outside-moss" />
            <span>OUTSIDE APPAREL STUDIO EXCHANGE POLICY &amp; INTEGRITY TERMS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-[11px] text-outside-inkSecondary">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-outside-moss shrink-0 mt-0.5" />
              <span>Garment must be unworn, unwashed, and free of fragrance or deodorant marks.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-outside-moss shrink-0 mt-0.5" />
              <span>Serialized inner hem tag and tethered canvas tag must remain attached.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-outside-moss shrink-0 mt-0.5" />
              <span>100% free domestic reverse shipping across all 28 Indian states &amp; UTs.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-outside-moss shrink-0 mt-0.5" />
              <span>Complimentary sizing advice available via WhatsApp Concierge anytime.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
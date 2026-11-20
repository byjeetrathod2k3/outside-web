import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ShieldCheck, Award } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';

export const metadata: Metadata = {
  title: 'About the Studio // Wear Your Story',
  description:
    'The architectural design philosophy, 280 GSM cotton standards, and Women-first tailoring of OUTSIDE, based in Ahmedabad, Gujarat.',
};

export default function AboutPage() {
  return (
    <div className="bg-outside-bg text-outside-text min-h-screen">
      
      {/* Hero */}
      <section className="py-20 border-b border-outside-border bg-subtle-grid">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading
            eyebrow="DESIGN STUDIO // AHMEDABAD, INDIA"
            title="Wear Your Story."
            description="OUTSIDE is a modern Indian apparel studio creating premium heavyweight streetwear, thoughtful sizing, and limited edition drops."
          />
        </div>
      </section>

      {/* Philosophy Columns */}
      <section className="py-20 border-b border-outside-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-6 space-y-4">
              <span className="text-xs font-mono text-outside-crimson font-bold uppercase tracking-wider">
                01 // THE ARCHITECTURAL SILHOUETTE
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-outside-text uppercase">
                The Women-First Sizing Calibration
              </h2>
              <p className="text-xs text-outside-muted leading-relaxed font-sans">
                For decades, streetwear has forced women into shrunken men’s t-shirts. The result is always the same: drooping shoulders that swallow the neck, pinched armholes, and rigid boxiness that fights against natural curvature.
              </p>
              <p className="text-xs text-outside-muted leading-relaxed font-sans">
                We inverted the industry convention. Every silhouette at OUTSIDE is developed first on female fit models. We engineered ergonomic armhole curves, softened shoulder slopes, and added side-split hems so the heavyweight fabric moves gracefully without bunching.
              </p>
            </div>
            <div className="md:col-span-6 p-6 bg-white border border-outside-border space-y-3 font-mono text-xs shadow-luxury">
              <div className="p-4 bg-outside-cardSubtle border border-outside-border">
                <span className="text-outside-crimson font-bold">CALIBRATED DRAPE</span>
                <p className="text-[11px] text-outside-muted mt-1 font-sans">
                  Holds architectural structure without feeling heavy or restricting natural movement.
                </p>
              </div>
              <div className="p-4 bg-outside-cardSubtle border border-outside-border">
                <span className="text-outside-crimson font-bold">SPLIT-SEAM FREEDOM</span>
                <p className="text-[11px] text-outside-muted mt-1 font-sans">
                  Reinforced side-slits allow effortless French tucking or fluid drape over high-waisted tailoring.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-6 order-2 md:order-1 p-6 bg-white border border-outside-border font-mono text-xs space-y-3 shadow-luxury">
              <div className="flex items-center gap-2 text-outside-text font-bold">
                <Award className="w-4 h-4 text-outside-crimson" />
                <span>PREMIUM TEXTILE SPECIFICATIONS</span>
              </div>
              <ul className="space-y-2 text-[11px] text-outside-muted font-sans">
                <li>· 280 GSM custom-knit long-staple organic cotton</li>
                <li>· Combed yarns to eliminate surface fuzz and pilling</li>
                <li>· Pre-shrunk French Terry weave with bio-wash treatment</li>
                <li>· 100% fair-wage ethical production in Ahmedabad, India</li>
              </ul>
            </div>
            <div className="md:col-span-6 order-1 md:order-2 space-y-4">
              <span className="text-xs font-mono text-outside-crimson font-bold uppercase tracking-wider">
                02 // PROVENANCE &amp; FABRIC HONESTY
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-outside-text uppercase">
                280 GSM Heavyweight Terry
              </h2>
              <p className="text-xs text-outside-muted leading-relaxed font-sans">
                Gujarat has been the textile heart of India for millennia. We reject lightweight, disposable fast-fashion cotton in favor of a substantial 280 GSM knit that improves with age and wash cycles.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Corporate & Tax Transparency (E-E-A-T) */}
      <section className="py-16 bg-outside-cardSubtle/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 bg-white border border-outside-border space-y-6 shadow-luxury">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-outside-crimson" />
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-outside-text font-bold">
                LEGAL ENTITY &amp; STATUTORY COMPLIANCE
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs text-outside-muted">
              <div>
                <span className="block text-outside-text font-bold">LEGAL NAME:</span>
                <span>OUTSIDE APPAREL STUDIO PVT LTD</span>
              </div>
              <div>
                <span className="block text-outside-text font-bold">GSTIN:</span>
                <span>24AABCO1234F1Z5 (Registered in India)</span>
              </div>
              <div>
                <span className="block text-outside-text font-bold">STUDIO ADDRESS:</span>
                <span>Plot 104, Design District, SG Highway, Ahmedabad 380015</span>
              </div>
              <div>
                <span className="block text-outside-text font-bold">HSN CLASSIFICATION:</span>
                <span>61091000 (Cotton Knitted T-Shirts)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

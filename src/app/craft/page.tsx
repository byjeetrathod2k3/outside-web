import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import {
  Layers,
  Sparkles,
  ShieldCheck,
  Award,
  CheckCircle2,
  ArrowRight,
  Flame,
  Scissors,
  Droplets,
  Scale,
} from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';

export const metadata: Metadata = {
  title: 'Fabric & Craftsmanship // 280 GSM Cotton | OUTSIDE India',
  description:
    'The technical textile anatomy of OUTSIDE: custom-knit 280 GSM combed organic cotton, double bio-washing, Lycra collar recovery, and ethical artisan production in Ahmedabad, India.',
};

const CRAFT_PILLARS = [
  {
    step: '01',
    title: 'Custom-Milled 280 GSM French Terry',
    subtitle: 'TEXTILE DENSITY & STRUCTURAL DRAPE',
    icon: Scale,
    description:
      'Standard fast-fashion t-shirts weigh 140 to 180 GSM. OUTSIDE engineered a heavyweight 280 GSM French Terry knit using 100% long-staple organic cotton. The outer face is flat-combed to a silk-like touch, while the inner loopback delivers thermal breathability and tactile substance that hangs in an intentional architectural boxy silhouette.',
    badge: '280 GSM KNIT',
  },
  {
    step: '02',
    title: 'Pre-Shrunk & Double Bio-Washed',
    subtitle: 'DIMENSIONAL STABILITY ACROSS WASH CYCLES',
    icon: Droplets,
    description:
      'Cotton naturally contracts upon initial laundering. We subject our raw fabric yardage to a proprietary double-bio-enzyme wash prior to pattern cutting. This permanently stabilizes the dimensional matrix, eliminating post-purchase shrinkage and removing surface fuzz for an enduring matte finish.',
    badge: 'ZERO SHRINKAGE',
  },
  {
    step: '03',
    title: 'Hand-Finished Chain-Stitch Embroidery',
    subtitle: 'TACTILE HAND-CRAFTED EMBROIDERY',
    icon: Scissors,
    description:
      'Rather than cheap heat transfers or plastic screen prints that crack over time, DROP 001 features multi-layered raised chain-stitch embroidery. Utilizing premium high-tenacity rayon threads, our Ahmedabad artisans hand-finish each "Better Days Ahead" floral stem with 12,400 precision stitches.',
    badge: '12,400 STITCHES',
  },
  {
    step: '04',
    title: 'Lycra-Reinforced 1x1 Rib Collar',
    subtitle: 'ZERO SAGGING // PERMANENT RECOVERY',
    icon: ShieldCheck,
    description:
      'The neckline is the failure point of ordinary streetwear. OUTSIDE patterns a tight 1x1 rib collar fortified with 5% high-recovery Lycra and double-needle topstitching. It hugs the neck cleanly and maintains its crisp circular profile wear after wear.',
    badge: 'LYCRA RECOVERY',
  },
];

export default function CraftPage() {
  return (
    <div className="bg-outside-bg text-outside-text min-h-screen py-12 md:py-20 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Section */}
        <div className="border-b border-outside-border pb-8 max-w-4xl space-y-3">
          <div className="flex items-center gap-2 text-xs text-outside-crimson uppercase tracking-[0.25em] font-bold">
            <span className="w-2 h-2 rounded-full bg-outside-crimson animate-pulse" />
            <span>PREMIUM FABRIC &amp; CRAFT PHILOSOPHY</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-outside-text uppercase">
            Built From Heavyweight Truth.
          </h1>
          <p className="text-sm font-sans text-outside-muted leading-relaxed max-w-2xl">
            We reject the disposable, micro-plastic fabric race. Every OUTSIDE piece is developed with obsessive material honesty in the textile hub of Ahmedabad, India.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CRAFT_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.step}
                className="bg-white border border-outside-border p-8 sm:p-10 space-y-6 shadow-luxury hover:border-outside-crimson/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-outside-border pb-4">
                    <span className="text-xs font-mono text-outside-crimson font-bold tracking-widest">
                      PILLAR {pillar.step} // STUDIO STANDARD
                    </span>
                    <span className="text-[10px] font-bold text-outside-text bg-outside-surface px-2.5 py-1 border border-outside-border">
                      {pillar.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-outside-surface border border-outside-border text-outside-crimson">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-display font-bold uppercase text-outside-text leading-tight">
                        {pillar.title}
                      </h3>
                      <span className="text-[10px] text-outside-muted uppercase tracking-wider font-bold">
                        {pillar.subtitle}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-outside-textSecondary font-sans leading-relaxed pt-2">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-outside-border flex items-center justify-between text-[11px] text-outside-muted">
                  <span>QUALITY TESTED IN AHMEDABAD, INDIA</span>
                  <CheckCircle2 className="w-4 h-4 text-outside-moss" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Spec Comparison Table vs Fast Fashion */}
        <div className="bg-white border border-outside-border p-8 sm:p-10 shadow-luxury space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outside-border pb-6">
            <div>
              <span className="text-xs text-outside-crimson uppercase tracking-[0.2em] font-bold">
                BENCHMARK AUDIT
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-outside-text uppercase mt-1">
                OUTSIDE vs. Conventional Fast Fashion
              </h2>
            </div>
            <span className="text-xs text-outside-muted font-mono uppercase bg-outside-surface px-3 py-1.5 border border-outside-border">
              VERIFIABLE TEXTILE METRICS
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-outside-surface border-b border-outside-border text-outside-muted text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="p-4">SPECIFICATION</th>
                  <th className="p-4 text-outside-crimson font-bold">OUTSIDE APPAREL STUDIO</th>
                  <th className="p-4 text-outside-muted">STANDARD COMMERCIAL APPAREL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outside-border">
                <tr>
                  <td className="p-4 font-bold text-outside-text">Fabric Weight</td>
                  <td className="p-4 text-outside-crimson font-bold">280 GSM (Heavy French Terry)</td>
                  <td className="p-4 text-outside-muted">140 - 180 GSM (Light Jersey)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-outside-text">Cotton Fiber</td>
                  <td className="p-4 text-outside-crimson font-bold">100% Combed Organic Long-Staple</td>
                  <td className="p-4 text-outside-muted">Short-staple carded / synthetic blends</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-outside-text">Pre-Shrink Treatment</td>
                  <td className="p-4 text-outside-crimson font-bold">Double Bio-Washed (0% Shrinkage)</td>
                  <td className="p-4 text-outside-muted">Unwashed (Shrinks 5-8% after first wash)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-outside-text">Artwork Application</td>
                  <td className="p-4 text-outside-crimson font-bold">12,400-Stitch Raised Embroidery</td>
                  <td className="p-4 text-outside-muted">Cracking plastic screen prints</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-outside-text">Production Scale</td>
                  <td className="p-4 text-outside-crimson font-bold">Strictly 250 Serialized Pieces (Capped)</td>
                  <td className="p-4 text-outside-muted">Mass-produced landfill inventory</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-outside-text">Ethical Origin</td>
                  <td className="p-4 text-outside-crimson font-bold">Ahmedabad Studio (Fair Living Wages)</td>
                  <td className="p-4 text-outside-muted">Opaque sweatshop subcontractor chains</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="p-8 bg-outside-surface border border-outside-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-display font-bold uppercase text-outside-text">
              Experience The Weight For Yourself.
            </h3>
            <p className="text-xs text-outside-muted font-sans mt-1">
              DROP 001 is available now in limited quantities. 280 GSM French Terry crafted in India.
            </p>
          </div>
          <Link
            href="/"
            className="px-8 py-3.5 bg-outside-crimson hover:bg-outside-crimsonHover text-white text-xs uppercase tracking-widest font-bold transition-colors shadow-sm flex items-center gap-2"
          >
            <span>ORDER ACTIVE DROP (₹2,400)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}

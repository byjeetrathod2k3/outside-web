import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight, Sparkles, Eye, ShieldAlert } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';

export const metadata: Metadata = {
  title: 'Editorial Lookbook // DROP 001: Better Days Ahead | OUTSIDE',
  description:
    'Visual editorial gallery documenting OUTSIDE DROP 001 in motion. 280 GSM organic combed cotton, ergonomic women-first boxy silhouette, and raised chain-stitch embroidery.',
};

const LOOKBOOK_FRAMES = [
  {
    id: 'frame-01',
    title: 'FRAME 01 // TEXTILE GRAVITY',
    subtitle: 'Ahmedabad Atelier Daylight · 280 GSM Heavyweight Fall',
    image: '/images/drops/drop-001-front.jpg',
    aspect: 'aspect-[4/5]',
    caption: 'Natural Raw Unbleached Ivory cotton holding architectural boxy structure without synthetic stiffeners.',
    tag: 'STUDIO DIRECT',
  },
  {
    id: 'frame-02',
    title: 'FRAME 02 // TYPOGRAPHIC MANIFESTO',
    subtitle: 'Upper-Back Minimalist Print · Same Girl Brighter Days',
    image: '/images/drops/drop-001-back.jpg',
    aspect: 'aspect-[4/5]',
    caption: 'High-density matte charcoal pigment bonded to combed cotton fibers. Engineered for wash-cycle permanence.',
    tag: 'BACK VIEW',
  },
  {
    id: 'frame-03',
    title: 'FRAME 03 // EMBROIDERY METALLURGY',
    subtitle: 'Hand-Finished Floral Stem · Rayon Threadwork',
    image: '/images/drops/drop-001-detail1.jpg',
    aspect: 'aspect-square',
    caption: 'Multi-tiered chain-stitch embroidery with debossed heart canvas tag reading "for a kinder you".',
    tag: 'MACRO DETAIL',
  },
  {
    id: 'frame-04',
    title: 'FRAME 04 // THE ERGO-BOXY PROPORTION',
    subtitle: 'Women-First Cut · Dropped Shoulder Slope',
    image: '/images/drops/drop-001-back.jpg',
    aspect: 'aspect-square',
    caption: 'Calibrated armhole depth and side-slit vents eliminate waist bunching when tucked or draped free.',
    tag: 'FIT SILHOUETTE',
  },
];

export default function LookbookPage() {
  return (
    <div className="bg-outside-bg text-outside-text min-h-screen py-12 md:py-20 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Editorial Header */}
        <div className="border-b border-outside-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-outside-crimson uppercase tracking-[0.25em] font-bold">
              <span className="w-2 h-2 rounded-full bg-outside-crimson animate-pulse" />
              <span>EDITORIAL ARCHIVE // DROP 001</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-outside-text uppercase">
              Better Days Ahead.
            </h1>
            <p className="text-sm font-sans text-outside-muted max-w-xl leading-relaxed">
              Photographed in our Ahmedabad atelier. An intimate exploration of raw unbleached cotton, botanical threadwork, and the quiet power of intentional rarity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-6 py-3.5 bg-outside-crimson hover:bg-outside-crimsonHover text-white text-xs uppercase tracking-widest font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <span>CLAIM PIECE (₹2,400)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Asymmetrical Bento Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {LOOKBOOK_FRAMES.map((frame, idx) => {
            const isLarge = idx % 2 === 0;
            return (
              <div
                key={frame.id}
                className={`${
                  isLarge ? 'md:col-span-7' : 'md:col-span-5'
                } bg-white border border-outside-border overflow-hidden shadow-luxury group transition-all`}
              >
                {/* Image Stage */}
                <div className={`relative ${frame.aspect} bg-[#EDEAE2]/40 overflow-hidden`}>
                  <Image
                    src={frame.image}
                    alt={frame.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-4 group-hover:scale-[1.03] transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 border border-outside-border text-[9px] uppercase font-bold tracking-widest text-outside-text">
                    {frame.tag}
                  </div>
                </div>

                {/* Caption Bar */}
                <div className="p-6 space-y-2 border-t border-outside-border">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-outside-crimson font-bold uppercase tracking-wider">
                      {frame.subtitle}
                    </span>
                    <span className="text-[10px] text-outside-muted uppercase">280 GSM</span>
                  </div>
                  <h3 className="text-lg font-display font-bold uppercase text-outside-text">
                    {frame.title}
                  </h3>
                  <p className="text-xs text-outside-textSecondary font-sans leading-relaxed">
                    {frame.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Drop Scarcity Manifesto Callout */}
        <div className="p-8 md:p-12 bg-white border border-outside-crimson/40 space-y-6 shadow-luxury">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-outside-crimson flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-display font-black text-outside-text uppercase">
              Strictly 250 Serialized Pieces Worldwide
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-outside-textSecondary font-sans leading-relaxed max-w-3xl">
            When DROP 001 sells out its 250 units, the pattern is permanently archived to The Vault. We will never re-release this colorway, re-issue this embroidery design, or print additional stock. Every piece is an irreplaceable collector artifact.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/"
              className="px-8 py-3.5 bg-outside-text hover:bg-black text-white text-xs uppercase tracking-widest font-bold transition-colors"
            >
              ORDER DROP 001 &rarr;
            </Link>
            <Link
              href="/vault"
              className="px-6 py-3.5 bg-outside-surface hover:bg-outside-border text-outside-text text-xs uppercase tracking-wider font-bold transition-colors border border-outside-border"
            >
              EXPLORE THE VAULT ARCHIVE
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

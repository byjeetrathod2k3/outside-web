'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ShieldCheck, CheckCircle2, ThumbsUp, Sparkles, Filter } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  variantPurchased: string;
  title: string;
  content: string;
  highlightTag: string;
  helpfulCount: number;
  imageThumbnail?: string;
}

const REVIEWS: Review[] = [
  {
    id: 'rev-01',
    author: 'Aanya Verma',
    location: 'Bandra West, Mumbai (400050)',
    rating: 5,
    date: '18 Nov 2026',
    variantPurchased: "Women's Fit · Size M",
    title: 'The 280 GSM drape is extraordinary — structured yet airy.',
    content:
      'I was hesitant about oversized streetwear fits as a woman, but OUTSIDE truly nailed the Women-First ergonomic boxy cut. The dropped shoulders don’t bunch up under outerwear, and the chain-stitched rose embroidery on the chest has a luxurious hand-crafted weight. Dispatched from Ahmedabad and arrived in Mumbai within 36 hours via Bluedart.',
    highlightTag: '280 GSM Textile Drape',
    helpfulCount: 42,
    imageThumbnail: '/images/drops/drop-001-front.jpg',
  },
  {
    id: 'rev-02',
    author: 'Kabir Singhania',
    location: 'Indiranagar, Bengaluru (560038)',
    rating: 5,
    date: '17 Nov 2026',
    variantPurchased: "Men's Fit · Size L",
    title: 'Zero neck sag, genuine luxury collar ribbing.',
    content:
      'Most oversized Indian streetwear tees lose collar shape after two washes. OUTSIDE’s high-density 1x1 ribbed neck with twin-needle stitching holds its exact circular stance all day. The serialized inner tag and satin wash label make it feel like a numbered gallery edition. Highly recommended.',
    highlightTag: 'Collar Rib Engineering',
    helpfulCount: 29,
    imageThumbnail: '/images/drops/drop-001-detail-1.jpg',
  },
  {
    id: 'rev-03',
    author: 'Rhea Mukhopadhyay',
    location: 'Vasant Vihar, New Delhi (110057)',
    rating: 5,
    date: '15 Nov 2026',
    variantPurchased: "Women's Fit · Size S",
    title: 'The embroidery texture and tethered canvas tag are pure art.',
    content:
      'The "Better Days Ahead" multi-tone thread embroidery has actual 3D relief you can run your fingers over, and the dangling canvas tag at the hem gives it such a high-fashion, conceptual edge. Packaged in a matte sandstone box with acid-free tissue and a serialized certificate. Instant collector item.',
    highlightTag: 'Embroidery Relief Artistry',
    helpfulCount: 37,
    imageThumbnail: '/images/drops/drop-001-detail-2.jpg',
  },
  {
    id: 'rev-04',
    author: 'Devansh Patel',
    location: 'Bodakdev, Ahmedabad (380054)',
    rating: 5,
    date: '14 Nov 2026',
    variantPurchased: 'Men Oversized Fit · Size XL',
    title: 'Proudly made in India — world-class fabric and craftsmanship.',
    content:
      'Ordered with the 5% instant UPI prepaid discount on launch morning and received it the very next afternoon directly from the SG Highway studio. The 100% combed cotton feels crisp, breathable in warm weather, and looks effortlessly relaxed. 250 pieces is seriously rare.',
    highlightTag: 'Same-Day Studio Dispatch',
    helpfulCount: 24,
    imageThumbnail: '/images/drops/drop-001-back.jpg',
  },
];

const METRICS = [
  { label: 'True to Size & Fit', score: '98%' },
  { label: '280 GSM Heavyweight Handfeel', score: '100%' },
  { label: 'Colorfast & Zero Shrinkage', score: '99%' },
  { label: 'On-Time Express Dispatch', score: '99.4%' },
];

export function CollectorReviews() {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  const handleHelpful = (id: string, current: number) => {
    if (helpfulVotes[id] !== undefined) return;
    setHelpfulVotes((prev) => ({ ...prev, [id]: current + 1 }));
  };

  const filteredReviews =
    selectedFilter === 'ALL'
      ? REVIEWS
      : REVIEWS.filter((r) => r.variantPurchased.toUpperCase().includes(selectedFilter));

  return (
    <section className="py-16 border-t border-outside-border bg-outside-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-outside-border">
          <div>
            <div className="flex items-center gap-2 text-outside-accent text-xs font-mono font-bold tracking-[0.25em] uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COLLECTOR DISPATCH FEEDBACK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-outside-ink uppercase">
              VERIFIED REVIEWS & PROOF
            </h2>
            <p className="text-xs sm:text-sm text-outside-inkSecondary font-mono mt-1">
              Honest impressions from early patrons across Mumbai, Bengaluru, Delhi & Ahmedabad.
            </p>
          </div>

          {/* Rating Summary Scorecard (Cahoot / Nykaa Benchmark) */}
          <div className="flex items-center gap-5 p-4 bg-outside-elevated border border-outside-border shadow-xs">
            <div className="text-center">
              <div className="text-3xl font-display font-black text-outside-ink leading-none">
                4.9<span className="text-lg text-outside-inkSecondary">/5</span>
              </div>
              <div className="flex items-center justify-center gap-0.5 mt-1 text-outside-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-outside-accent stroke-outside-accent" />
                ))}
              </div>
              <p className="text-[10px] font-mono text-outside-inkSecondary mt-1">
                148 Verified Orders
              </p>
            </div>

            <div className="h-12 w-px bg-outside-border" />

            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex items-center gap-1.5 text-outside-ink">
                <CheckCircle2 className="w-3.5 h-3.5 text-outside-moss" />
                <span className="font-bold">98% 5-STAR RATING</span>
              </div>
              <div className="text-[10px] text-outside-inkSecondary">
                Zero polyester blends · 100% Cotton
              </div>
            </div>
          </div>
        </div>

        {/* Audit Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-outside-border">
          {METRICS.map((metric) => (
            <div
              key={metric.label}
              className="p-3 bg-outside-surface/60 border border-outside-border/70 text-center font-mono"
            >
              <div className="text-lg font-black text-outside-ink">{metric.score}</div>
              <div className="text-[10px] uppercase tracking-wider text-outside-inkSecondary mt-0.5">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-outside-inkSecondary" />
            <span className="text-xs font-mono uppercase tracking-wider text-outside-ink font-bold">
              Filter by Cut:
            </span>
          </div>
          <div className="flex gap-2">
            {[
              { label: 'ALL REVIEWS', val: 'ALL' },
              { label: 'WOMEN CUT', val: 'WOMEN' },
              { label: 'MEN CUT', val: 'MEN' },
            ].map((f) => (
              <button
                key={f.val}
                onClick={() => setSelectedFilter(f.val)}
                className={`text-[11px] font-mono uppercase px-3 py-1.5 rounded transition-all cursor-pointer ${
                  selectedFilter === f.val
                    ? 'bg-outside-ink text-outside-elevated font-bold'
                    : 'bg-outside-elevated border border-outside-border text-outside-inkSecondary hover:text-outside-ink'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((review) => {
            const votes = helpfulVotes[review.id] ?? review.helpfulCount;
            const hasVoted = helpfulVotes[review.id] !== undefined;

            return (
              <div
                key={review.id}
                className="bg-outside-elevated border border-outside-border p-6 flex flex-col justify-between shadow-xs hover:border-outside-inkSecondary transition-all"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-outside-accent">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-outside-accent stroke-outside-accent" />
                        ))}
                      </div>
                      <h4 className="text-sm font-bold text-outside-ink mt-2">
                        {review.title}
                      </h4>
                    </div>

                    {review.imageThumbnail && (
                      <div className="relative w-14 h-16 bg-outside-surface border border-outside-border shrink-0 overflow-hidden">
                        <Image
                          src={review.imageThumbnail}
                          alt={review.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <p className="text-xs text-outside-inkSecondary leading-relaxed mt-3 font-sans">
                    "{review.content}"
                  </p>

                  {/* Highlight pill */}
                  <div className="mt-3.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-outside-surface text-outside-ink font-bold border border-outside-border">
                      {review.highlightTag}
                    </span>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 pt-4 border-t border-outside-border flex items-center justify-between font-mono text-[11px]">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-outside-ink">
                      <span>{review.author}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-outside-moss" />
                      <span className="text-[10px] text-outside-moss uppercase tracking-widest font-normal">
                        Verified
                      </span>
                    </div>
                    <div className="text-[10px] text-outside-inkSecondary">
                      {review.location} · {review.variantPurchased}
                    </div>
                  </div>

                  {/* Helpful Button */}
                  <button
                    onClick={() => handleHelpful(review.id, review.helpfulCount)}
                    disabled={hasVoted}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] transition-colors cursor-pointer ${
                      hasVoted
                        ? 'border-outside-moss text-outside-moss bg-outside-moss/10'
                        : 'border-outside-border text-outside-inkSecondary hover:text-outside-ink hover:border-outside-inkSecondary'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{votes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Statutory Authenticity Note */}
        <div className="mt-8 p-4 bg-outside-surface/60 border border-outside-border text-center font-mono text-xs text-outside-inkSecondary flex flex-col sm:flex-row items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-outside-moss shrink-0" />
          <span>
            Every review is matched against serialized dispatch numbers. Only verified recipients of DROP 001 may submit feedback.
          </span>
        </div>
      </div>
    </section>
  );
}
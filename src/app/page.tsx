import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getLocalStore } from '@/lib/db';
import { ActiveDropView } from '@/components/commerce/active-drop-view';
import { SectionHeading } from '@/components/ui/section-heading';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, HelpCircle } from 'lucide-react';

export default async function HomePage() {
  const store = getLocalStore();
  const activeDrop = store.drops.find((d: any) => d.status === 'LIVE' && d.isFeatured) || store.drops[0];
  const vaultDrops = store.drops.filter((d: any) => d.id !== activeDrop.id);
  const faqs = store.faqs || [];

  // Schema.org FAQPage for Answer Engine Discoverability (AEO)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq: any) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="bg-outside-bg text-outside-text font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. HERO & ACTIVE DROP ENGINE */}
      <section className="border-b border-outside-border bg-subtle-grid">
        <ActiveDropView drop={activeDrop} />
      </section>

      {/* 2. THE ANTI-INVENTORY BENTO GRID */}
      <section className="py-24 border-b border-outside-border bg-outside-cardSubtle/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="THE ANTI-INVENTORY PHILOSOPHY"
            title="Mass Production Is A Crime Against Craft."
            description="We do not produce seasonal collections or excess inventory. We release one singular, uncompromising silhouette at a time in capped serialized runs."
            className="mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Card 1: 280 GSM Cotton */}
            <div className="p-8 bg-white border border-outside-border flex flex-col justify-between hover:border-outside-crimson/60 hover:shadow-luxury-hover transition-all shadow-luxury">
              <div className="space-y-4">
                <span className="text-xs font-mono text-outside-crimson font-bold">01 // MATERIAL ENGINEERING</span>
                <h3 className="text-xl font-bold font-display text-outside-text uppercase">
                  280 GSM French Terry Cotton
                </h3>
                <p className="text-xs text-outside-muted leading-relaxed font-sans">
                  Custom-milled in Gujarat using long-staple combed organic cotton. Double-bio-washed to eliminate shrinkage while preserving structural architectural drape.
                </p>
              </div>
              <div className="pt-8 border-t border-outside-border font-mono text-[11px] text-outside-text font-bold">
                <span>WEIGHT: 280 GSM · 100% ORGANIC COMBED</span>
              </div>
            </div>

            {/* Bento Card 2: Serialized Rarity */}
            <div className="p-8 bg-white border border-outside-border flex flex-col justify-between hover:border-outside-crimson/60 hover:shadow-luxury-hover transition-all shadow-luxury">
              <div className="space-y-4">
                <span className="text-xs font-mono text-outside-crimson font-bold">02 // PERMANENT RETIREMENT</span>
                <h3 className="text-xl font-bold font-display text-outside-text uppercase">
                  The 250-Piece Hard Limit
                </h3>
                <p className="text-xs text-outside-muted leading-relaxed font-sans">
                  Every garment carries a serialized tag on the inner hem. Once unit 250 is claimed, the digital patterns are retired permanently into The Vault.
                </p>
              </div>
              <div className="pt-8 border-t border-outside-border font-mono text-[11px] text-outside-text font-bold">
                <span>ZERO RESTOCKS · ZERO DEADSTOCK</span>
              </div>
            </div>

            {/* Bento Card 3: Gujarat Studio Craft */}
            <div className="p-8 bg-white border border-outside-border flex flex-col justify-between hover:border-outside-crimson/60 hover:shadow-luxury-hover transition-all shadow-luxury">
              <div className="space-y-4">
                <span className="text-xs font-mono text-outside-crimson font-bold">03 // PROVENANCE &amp; TAX</span>
                <h3 className="text-xl font-bold font-display text-outside-text uppercase">
                  Crafted In Ahmedabad (24)
                </h3>
                <p className="text-xs text-outside-muted leading-relaxed font-sans">
                  100% domestic textile heritage with fair living wages. Complete Indian GST compliance with automated invoice generation and Place of Supply audit trails.
                </p>
              </div>
              <div className="pt-8 border-t border-outside-border font-mono text-[11px] text-outside-text font-bold">
                <span>GSTIN: 24AABCO1234F1Z5 · HSN 61091000</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. WOMEN-FIRST FIT PHILOSOPHY DEEP DIVE */}
      <section id="fit-philosophy" className="py-24 border-b border-outside-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-outside-crimson font-bold">
                PROPORTION &amp; ERGONOMICS
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-outside-text uppercase">
                The Women-First Sizing Manifesto.
              </h2>
              <p className="text-sm text-outside-muted leading-relaxed">
                Most streetwear brands treat unisex as &quot;men&apos;s cuts scaled down.&quot; The shoulders sag awkwardly, the sleeve holes pinch, and the drape is unflattering.
              </p>
              <p className="text-sm text-outside-muted leading-relaxed">
                At OUTSIDE, every silhouette begins with the female form. We recalibrated neck opening tension, altered dropped shoulder angles, and engineered side split vents so the heavyweight fabric moves gracefully without bunching at the hips.
              </p>

              <div className="space-y-3 pt-2 font-mono text-xs text-outside-text font-medium">
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-outside-crimson flex-shrink-0" />
                  <span>Proportioned armhole depth prevents excessive underarm fabric bunching</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-outside-crimson flex-shrink-0" />
                  <span>Custom rib collar with Lycra recovery retains shape wash after wash</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-outside-crimson flex-shrink-0" />
                  <span>Reinforced split-hem design sits clean whether worn tucked or free</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white border border-outside-border p-8 space-y-6 shadow-luxury">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-outside-text font-bold">
                SILHOUETTE COMPARISON MATRIX
              </h3>
              
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 bg-outside-cardSubtle border border-outside-border space-y-1">
                  <div className="flex justify-between font-bold text-outside-text">
                    <span>WOMEN FIT SILHOUETTE</span>
                    <span className="text-outside-crimson">ERGO-BOXY</span>
                  </div>
                  <p className="text-[11px] text-outside-muted font-sans pt-1">
                    Calibrated dropped shoulder, slightly trimmed torso length, relaxed body volume for an effortless oversized drape.
                  </p>
                </div>

                <div className="p-4 bg-outside-cardSubtle border border-outside-border space-y-1">
                  <div className="flex justify-between font-bold text-outside-text">
                    <span>MEN FIT SILHOUETTE</span>
                    <span className="text-outside-text">STRUCTURED-RELAXED</span>
                  </div>
                  <p className="text-[11px] text-outside-muted font-sans pt-1">
                    Broad shoulder yoke, extended sleeve drape, structured chest breadth maintaining a bold architectural presence.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-right">
                <Link
                  href="/size-guide"
                  className="text-xs font-mono text-outside-crimson hover:underline uppercase tracking-wider inline-flex items-center gap-1.5 font-bold"
                >
                  <span>VIEW FULL MEASUREMENT CHART</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. THE VAULT PREVIEW (Seeded Drops) */}
      <section className="py-24 border-b border-outside-border bg-outside-cardSubtle/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-outside-crimson font-bold">
                DIGITAL ARCHIVE // SEEDED EDITIONS
              </span>
              <h2 className="text-3xl font-display font-black tracking-tight text-outside-text uppercase">
                The Vault // Editions Showcase.
              </h2>
            </div>
            <Link
              href="/vault"
              className="text-xs font-mono text-outside-crimson hover:underline uppercase tracking-wider flex items-center gap-2 font-bold"
            >
              <span>EXPLORE ALL ARCHIVED EDITIONS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vaultDrops.map((drop: any) => (
              <div
                key={drop.id}
                className="bg-white border border-outside-border overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-luxury-hover hover:border-outside-crimson/50 transition-all"
              >
                <div className="relative aspect-[4/5] bg-outside-cardSubtle overflow-hidden">
                  <Image
                    src={drop.primaryImageUrl || '/images/drops/drop-001-front.jpg'}
                    alt={drop.title}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className="bg-white/90">
                      DROP 00{drop.dropNumber}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant={drop.status === 'UPCOMING' ? 'live' : 'archived'} className="bg-white/90">
                      {drop.status}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold font-display text-outside-text uppercase">
                      {drop.title}
                    </h3>
                    <p className="text-xs text-outside-muted mt-2 line-clamp-2 leading-relaxed">
                      {drop.story}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-outside-border flex justify-between items-center text-xs font-mono">
                    <span className="text-outside-muted">RUN: {drop.totalEditionQty} PIECES</span>
                    <Link
                      href={`/vault/${drop.slug}`}
                      className="text-outside-crimson font-bold hover:underline flex items-center gap-1"
                    >
                      <span>SPEC &rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AEO / GEO QUESTION & ANSWER ACCORDION */}
      <section className="py-24 border-b border-outside-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionHeading
            eyebrow="KNOWLEDGE BASE // DIRECT ANSWERS"
            title="Frequently Asked Questions."
            description="Clear, transparent answers regarding craft, GST compliance, sizing, and single-drop release mechanics."
          />

          <div className="space-y-4">
            {faqs.map((faq: any) => (
              <details
                key={faq.id}
                className="group p-6 bg-white border border-outside-border open:border-outside-crimson shadow-xs transition-colors cursor-pointer"
              >
                <summary className="flex items-center justify-between text-sm font-mono uppercase font-bold text-outside-text list-none">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-outside-crimson" />
                    <span>{faq.question}</span>
                  </div>
                  <span className="text-outside-muted group-open:rotate-180 transition-transform">
                    &darr;
                  </span>
                </summary>
                <div className="pt-4 mt-4 border-t border-outside-border text-xs text-outside-textSecondary leading-relaxed font-sans">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONVERSION CLOSING HOOK */}
      <section className="py-24 bg-outside-text text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs font-mono uppercase tracking-[0.3em] font-bold text-outside-crimson">
            LIMITED EDITION // ZERO DEADSTOCK
          </span>
          <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight uppercase">
            Wear Your Story.
          </h2>
          <p className="text-sm max-w-xl mx-auto leading-relaxed text-white/80 font-sans">
            DROP 001 is currently live and allocation is claimed in real time. Once unit 250 is claimed, no further pieces will ever be created.
          </p>
          <div className="pt-4">
            <a
              href="#"
              className="inline-flex items-center gap-3 px-8 py-4 bg-outside-crimson hover:bg-outside-crimsonHover text-white font-mono text-xs uppercase tracking-[0.25em] font-bold transition-all shadow-luxury"
            >
              <span>CLAIM YOUR PIECE TODAY</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

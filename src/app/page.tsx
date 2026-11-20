import React from 'react';
import Link from 'next/link';
import { getLocalStore } from '@/lib/db';
import { ActiveDropView } from '@/components/commerce/active-drop-view';
import { ArrowRight, ShieldCheck, Flame, Scissors, Check, HelpCircle } from 'lucide-react';

export default async function HomePage() {
  const store = getLocalStore();
  const activeDrop = store.drops.find((d: any) => d.status === 'LIVE' && d.isFeatured) || store.drops[0];
  const vaultDrops = store.drops.filter((d: any) => d.status === 'ARCHIVED');
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
    <div className="bg-outside-black text-outside-chalk">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. HERO & ACTIVE DROP ENGINE */}
      <section className="border-b border-outside-border bg-subtle-grid">
        <ActiveDropView drop={activeDrop} />
      </section>

      {/* 2. THE ANTI-INVENTORY BENTO GRID */}
      <section className="py-24 border-b border-outside-border bg-outside-charcoal/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-outside-crimson font-bold">
              THE ANTI-INVENTORY PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white uppercase">
              Mass Production Is A Crime Against Craft.
            </h2>
            <p className="text-sm text-outside-muted leading-relaxed">
              We do not produce seasonal collections. We drop one uncompromising silhouette at a time, strictly limited to 250 pieces, and never restock.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Card 1: 280 GSM Cotton */}
            <div className="p-8 bg-outside-surface border border-outside-border flex flex-col justify-between hover:border-outside-crimson/80 transition-colors">
              <div className="space-y-4">
                <span className="text-xs font-mono text-outside-crimson">01 // MATERIAL ENGINEERING</span>
                <h3 className="text-xl font-bold font-display text-white uppercase">
                  280 GSM French Terry Cotton
                </h3>
                <p className="text-xs text-outside-muted leading-relaxed font-sans">
                  Custom-milled in Gujarat using long-staple combed organic cotton. Double-bio-washed to eliminate shrinkage while preserving structural architectural drape.
                </p>
              </div>
              <div className="pt-8 border-t border-outside-border/60 font-mono text-[11px] text-outside-chalkDim">
                <span>WEIGHT: 280 GSM · 100% ORGANIC</span>
              </div>
            </div>

            {/* Bento Card 2: Serialized Rarity */}
            <div className="p-8 bg-outside-surface border border-outside-border flex flex-col justify-between hover:border-outside-crimson/80 transition-colors">
              <div className="space-y-4">
                <span className="text-xs font-mono text-outside-crimson">02 // PERMANENT RETIREMENT</span>
                <h3 className="text-xl font-bold font-display text-white uppercase">
                  The 250-Piece Hard Limit
                </h3>
                <p className="text-xs text-outside-muted leading-relaxed font-sans">
                  Every garment carries a hand-numbered serial tag on the inner hem. Once unit 250 is claimed, the digital patterns are permanently locked in The Vault.
                </p>
              </div>
              <div className="pt-8 border-t border-outside-border/60 font-mono text-[11px] text-outside-chalkDim">
                <span>ZERO RESTOCKS · ZERO DEADSTOCK</span>
              </div>
            </div>

            {/* Bento Card 3: Gujarat Studio Craft */}
            <div className="p-8 bg-outside-surface border border-outside-border flex flex-col justify-between hover:border-outside-crimson/80 transition-colors">
              <div className="space-y-4">
                <span className="text-xs font-mono text-outside-crimson">03 // PROVENANCE &amp; TAX</span>
                <h3 className="text-xl font-bold font-display text-white uppercase">
                  Crafted In Ahmedabad (24)
                </h3>
                <p className="text-xs text-outside-muted leading-relaxed font-sans">
                  100% domestic textile heritage with ethical living wages. Complete GST compliance with automated invoice generation and transparent Indian state taxation.
                </p>
              </div>
              <div className="pt-8 border-t border-outside-border/60 font-mono text-[11px] text-outside-chalkDim">
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
              <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">
                The Women-First Sizing Manifesto.
              </h2>
              <p className="text-sm text-outside-muted leading-relaxed">
                Most streetwear brands treat unisex as &quot;men’s cuts scaled down.&quot; The shoulders sag awkwardly, the sleeve holes pinch, and the drape is unflattering.
              </p>
              <p className="text-sm text-outside-muted leading-relaxed">
                At OUTSIDE, every silhouette begins with the female form. We recalibrated neck opening tension, altered dropped shoulder angles, and engineered side split vents so the heavyweight fabric moves gracefully without bunching at the hips.
              </p>

              <div className="space-y-3 pt-2 font-mono text-xs text-outside-chalkDim">
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

            <div className="lg:col-span-6 bg-outside-surface border border-outside-border p-8 space-y-6">
              <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-white">
                SILHOUETTE COMPARISON MATRIX
              </h3>
              
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 bg-outside-card border border-outside-border/80 space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span>WOMEN FIT SILHOUETTE</span>
                    <span className="text-outside-crimson">ERGO-BOXY</span>
                  </div>
                  <p className="text-[11px] text-outside-muted font-sans pt-1">
                    Calibrated dropped shoulder, slightly trimmed torso length, relaxed body volume for an effortless oversized drape.
                  </p>
                </div>

                <div className="p-4 bg-outside-card border border-outside-border/80 space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span>MEN FIT SILHOUETTE</span>
                    <span className="text-outside-chalk">STRUCTURED-RELAXED</span>
                  </div>
                  <p className="text-[11px] text-outside-muted font-sans pt-1">
                    Broad shoulder yoke, extended sleeve drape, structured chest breadth maintaining a bold architectural presence.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-right">
                <Link
                  href="/size-guide"
                  className="text-xs font-mono text-outside-crimson hover:text-outside-crimsonBright uppercase tracking-wider inline-flex items-center gap-1.5"
                >
                  <span>VIEW FULL MEASUREMENT CHART</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. THE VAULT PREVIEW */}
      <section className="py-24 border-b border-outside-border bg-outside-charcoal/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-outside-crimson font-bold">
                PERMANENT DIGITAL ARCHIVE
              </span>
              <h2 className="text-3xl font-display font-black tracking-tight text-white uppercase">
                The Vault // Retired Drops.
              </h2>
            </div>
            <Link
              href="/vault"
              className="text-xs font-mono text-outside-crimson hover:text-white uppercase tracking-wider flex items-center gap-2"
            >
              <span>EXPLORE ALL ARCHIVED EDITIONS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {vaultDrops.map((drop: any) => (
              <div
                key={drop.id}
                className="p-6 bg-outside-surface border border-outside-border/80 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-3">
                    <span className="text-outside-muted">DROP 00{drop.dropNumber}</span>
                    <span className="px-2.5 py-1 bg-outside-card border border-outside-border text-outside-crimson text-[10px] tracking-widest uppercase font-bold">
                      SEALED IN VAULT
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-white uppercase mb-2">
                    {drop.title}
                  </h3>
                  <p className="text-xs text-outside-muted leading-relaxed font-sans">
                    {drop.story}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-outside-border/60 flex justify-between items-center text-xs font-mono">
                  <span className="text-outside-muted">EDITION: {drop.totalEditionQty} PIECES</span>
                  <Link
                    href={`/vault/${drop.slug}`}
                    className="text-white hover:text-outside-crimson flex items-center gap-1"
                  >
                    <span>VIEW ARCHIVE SPEC</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AEO / GEO QUESTION & ANSWER ACCORDION */}
      <section className="py-24 border-b border-outside-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-outside-crimson font-bold">
              KNOWLEDGE BASE // DIRECT ANSWERS
            </span>
            <h2 className="text-3xl font-display font-black tracking-tight text-white uppercase">
              Frequently Asked Questions.
            </h2>
            <p className="text-xs text-outside-muted">
              Clear, transparent answers regarding craft, GST compliance, sizing and drops.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq: any) => (
              <details
                key={faq.id}
                className="group p-6 bg-outside-surface border border-outside-border open:border-outside-crimson transition-colors cursor-pointer"
              >
                <summary className="flex items-center justify-between text-sm font-mono uppercase font-bold text-white list-none">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-outside-crimson" />
                    <span>{faq.question}</span>
                  </div>
                  <span className="text-outside-muted group-open:rotate-180 transition-transform">
                    &darr;
                  </span>
                </summary>
                <div className="pt-4 mt-4 border-t border-outside-border/60 text-xs text-outside-chalkDim leading-relaxed font-sans">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONVERSION CLOSING HOOK */}
      <section className="py-24 bg-outside-crimson text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs font-mono uppercase tracking-[0.3em] font-bold text-white/80">
            LIMITED EDITION // ZERO DEADSTOCK
          </span>
          <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight uppercase">
            Wear Your Story.
          </h2>
          <p className="text-sm max-w-xl mx-auto leading-relaxed text-white/90 font-sans">
            DROP 001 is currently live and allocation is dwindling in real time. Once unit 250 is claimed, no further pieces will ever be created.
          </p>
          <div className="pt-4">
            <a
              href="#"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-mono text-xs uppercase tracking-[0.25em] font-bold hover:bg-black hover:text-white transition-all shadow-2xl"
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

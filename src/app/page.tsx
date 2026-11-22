import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  getLocalStore,
  DEFAULT_LAYOUT_CONFIG,
  DEFAULT_HERO_CONFIG,
  DEFAULT_CATEGORIES,
} from '@/lib/db';
import { ActiveDropView } from '@/components/commerce/active-drop-view';
import { SectionHeading } from '@/components/ui/section-heading';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, HelpCircle, BookOpen } from 'lucide-react';
import {
  JsonLd,
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateProductSchema,
  generateBreadcrumbSchema,
  generateFaqSchema,
} from '@/lib/seo';
import { DirectAnswerBlocks } from '@/components/seo/direct-answer-blocks';
import { MarqueeTicker } from '@/components/layout/marquee-ticker';
import { CollectorReviews } from '@/components/commerce/collector-reviews';
import { MultiDropShowcase } from '@/components/commerce/multi-drop-showcase';
import { EditorialHero } from '@/components/home/editorial-hero';
import { VipEarlyAccess } from '@/components/commerce/vip-early-access';
import { MobileStickyQuickBuy } from '@/components/commerce/mobile-sticky-quick-buy';
import SpotlightCard from '@/components/reactbits/SpotlightCard/SpotlightCard';
import CountUp from '@/components/reactbits/CountUp/CountUp';
import DecryptedText from '@/components/reactbits/DecryptedText/DecryptedText';
import ShinyText from '@/components/reactbits/ShinyText/ShinyText';
import BlurText from '@/components/reactbits/BlurText/BlurText';
import Waves from '@/components/reactbits/Waves/Waves';

export default async function HomePage() {
  const store = getLocalStore();
  const activeDrop = store.drops.find((d: any) => d.status === 'LIVE' && d.isFeatured) || store.drops[0];
  const vaultDrops = store.drops.filter((d: any) => d.id !== activeDrop.id);
  const faqs = store.faqs || [];
  const journal = store.journal || [];
  const flags = store.featureFlags || [];
  const layout = store.layoutConfig || DEFAULT_LAYOUT_CONFIG;

  const showVaultFlag = flags.find((f: any) => f.key === 'enable_vault_archive')?.isEnabled !== false;
  const showJournalFlag = flags.find((f: any) => f.key === 'enable_journal')?.isEnabled !== false;

  // Dynamic Grid Density classes
  const vaultMobile = layout.gridColumns?.vault?.mobile === 2 ? 'grid-cols-2' : 'grid-cols-1';
  const vaultTablet = layout.gridColumns?.vault?.tablet === 3 ? 'md:grid-cols-3' : layout.gridColumns?.vault?.tablet === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2';
  const vaultDesktop = layout.gridColumns?.vault?.desktop === 4 ? 'lg:grid-cols-4' : layout.gridColumns?.vault?.desktop === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3';

  const lookbookMobile = layout.gridColumns?.lookbook?.mobile === 2 ? 'grid-cols-2' : 'grid-cols-1';
  const lookbookDesktop = layout.gridColumns?.lookbook?.desktop === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2';

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

  const getVisibilityClass = (secConfig?: any) => {
    if (!secConfig) return '';
    const classes: string[] = [];
    if (!secConfig.visibleDesktop) classes.push('lg:hidden');
    if (!secConfig.visibleTablet) classes.push('max-lg:md:hidden');
    if (!secConfig.visibleMobile) classes.push('max-md:hidden');
    return classes.join(' ');
  };

  // Section Renderers Dictionary
  const renderSection = (sectionId: string, secConfig?: any, index?: number) => {
    const visibilityClass = getVisibilityClass(secConfig);
    const sectionKey = secConfig?.id || `${sectionId}-${index ?? 0}`;

    switch (sectionId) {
      case 'hero':
        const remainingPieces =
          activeDrop.variants?.reduce((acc: number, v: any) => acc + (v.currentStock || 0), 0) || 75;

        return (
          <EditorialHero
            key={sectionKey}
            dropTitle={activeDrop.title}
            dropNumber={activeDrop.dropNumber}
            pricePaise={activeDrop.pricePaise}
            totalPieces={activeDrop.totalEditionQty}
            remainingPieces={remainingPieces}
            allDrops={store.drops}
            heroConfig={store.heroConfig || DEFAULT_HERO_CONFIG}
          />
        );

      case 'drops':
      case 'catalog':
        const hasExplicitReviewsSection = layout.sections?.some((s: any) => s.id === 'reviews');
        return (
          <React.Fragment key={sectionKey}>
            <div id="all-drops" className="scroll-mt-28 sm:scroll-mt-32">
              <MultiDropShowcase
                drops={store.drops}
                activeDropId={activeDrop.id}
                className={visibilityClass}
                categories={store.categories || DEFAULT_CATEGORIES}
              />
            </div>
            {!hasExplicitReviewsSection && <CollectorReviews />}
          </React.Fragment>
        );

      case 'reviews':
        return <CollectorReviews key={sectionKey} />;

      case 'story':
        return (
          <section key={sectionKey} className={`py-24 border-b border-outside-border bg-outside-cardSubtle/40 ${visibilityClass}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                eyebrow="THE ANTI-INVENTORY PHILOSOPHY"
                title="Mass Production Is A Crime Against Craft."
                description="We do not produce seasonal collections or excess inventory. We release one singular, uncompromising style at a time in capped serialized runs."
                className="mb-16"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bento Card 1 */}
                <SpotlightCard
                  theme="light"
                  spotlightColor="rgba(184, 35, 40, 0.16)"
                  className="p-8 bg-outside-elevated border border-outside-border flex flex-col justify-between hover:border-outside-accent/60 transition-all shadow-editorial"
                >
                  <div className="space-y-4">
                    <span className="text-xs font-mono text-outside-accent font-bold">01 // MATERIAL ENGINEERING</span>
                    <h3 className="text-xl font-bold font-display text-outside-ink uppercase">
                      280 GSM French Terry Cotton
                    </h3>
                    <p className="text-xs text-outside-inkSecondary leading-relaxed font-sans">
                      Custom-milled in India using 100% long-staple combed organic cotton. Double-bio-washed to eliminate shrinkage while preserving soft, durable structure.
                    </p>
                  </div>
                  <div className="pt-8 border-t border-outside-border font-mono text-[11px] text-outside-ink font-bold">
                    <span>WEIGHT: 280 GSM · 100% ORGANIC COMBED</span>
                  </div>
                </SpotlightCard>

                {/* Bento Card 2 */}
                <SpotlightCard
                  theme="light"
                  spotlightColor="rgba(184, 35, 40, 0.16)"
                  className="p-8 bg-outside-elevated border border-outside-border flex flex-col justify-between hover:border-outside-accent/60 transition-all shadow-editorial"
                >
                  <div className="space-y-4">
                    <span className="text-xs font-mono text-outside-accent font-bold">02 // PERMANENT RETIREMENT</span>
                    <h3 className="text-xl font-bold font-display text-outside-ink uppercase">
                      The 250-Piece Hard Limit
                    </h3>
                    <p className="text-xs text-outside-inkSecondary leading-relaxed font-sans">
                      Every garment carries a serialized tag on the inner hem. Once unit 250 is claimed, the digital patterns are retired permanently into The Vault.
                    </p>
                  </div>
                  <div className="pt-8 border-t border-outside-border font-mono text-[11px] text-outside-ink font-bold">
                    <span>ZERO RESTOCKS · ZERO DEADSTOCK</span>
                  </div>
                </SpotlightCard>

                {/* Bento Card 3 */}
                <SpotlightCard
                  theme="light"
                  spotlightColor="rgba(184, 35, 40, 0.16)"
                  className="p-8 bg-outside-elevated border border-outside-border flex flex-col justify-between hover:border-outside-accent/60 transition-all shadow-editorial"
                >
                  <div className="space-y-4">
                    <span className="text-xs font-mono text-outside-accent font-bold">03 // MADE IN INDIA &amp; GST</span>
                    <h3 className="text-xl font-bold font-display text-outside-ink uppercase">
                      100% Made In India
                    </h3>
                    <p className="text-xs text-outside-inkSecondary leading-relaxed font-sans">
                      100% domestic textile heritage with fair living wages. Complete GST compliance with automated invoice generation.
                    </p>
                  </div>
                  <div className="pt-8 border-t border-outside-border font-mono text-[11px] text-outside-ink font-bold">
                    <span>GSTIN: <DecryptedText text="24AABCO1234F1Z5" speed={30} animateOn="view" /> · HSN 61091000</span>
                  </div>
                </SpotlightCard>
              </div>
            </div>
          </section>
        );

      case 'lookbook':
        return (
          <section key={sectionKey} id="lookbook" className={`py-24 border-b border-outside-border bg-outside-surface/30 ${visibilityClass}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-outside-accent font-bold">
                    VISUAL EDITORIAL // IN SITU
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-outside-ink uppercase">
                    The Lookbook // Drop 001 In Motion.
                  </h2>
                  <p className="text-xs sm:text-sm text-outside-inkSecondary font-sans max-w-2xl leading-relaxed">
                    280 GSM unbleached French Terry cotton, ergonomic women-first dropped shoulders, and multi-layered chain-stitch typography captured under natural studio light.
                  </p>
                </div>
                <Link
                  href="/lookbook"
                  className="text-xs font-mono text-outside-accent hover:underline uppercase tracking-wider flex items-center gap-2 font-bold whitespace-nowrap"
                >
                  <span>VIEW FULL LOOKBOOK (12 FRAMES)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Lookbook Bento Gallery */}
              <div className={`grid ${lookbookMobile} md:grid-cols-2 ${lookbookDesktop} gap-6`}>
                {/* Lookbook Frame 1 */}
                <SpotlightCard
                  theme="light"
                  spotlightColor="rgba(184, 35, 40, 0.12)"
                  className="bg-outside-elevated border border-outside-border overflow-hidden group shadow-editorial !p-0 flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/5] bg-outside-surface overflow-hidden">
                    <Image
                      src="/images/drops/drop-001-front.jpg"
                      alt="OUTSIDE DROP 001 Front Silhouette - Studio Direct"
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-outside-elevated/90 backdrop-blur text-[10px] font-mono font-bold uppercase tracking-wider text-outside-ink border border-outside-border">
                        FRAME 01 // TEXTILE GRAVITY
                      </span>
                    </div>
                  </div>
                  <div className="p-5 border-t border-outside-border space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-outside-ink">NATURAL RAW IVORY</span>
                      <span className="text-outside-accent font-bold">280 GSM</span>
                    </div>
                    <p className="text-[11px] text-outside-inkSecondary font-sans leading-relaxed">
                      Heavyweight drape holding architectural boxy silhouette without synthetic stiffeners.
                    </p>
                  </div>
                </SpotlightCard>

                {/* Lookbook Frame 2 */}
                <SpotlightCard
                  theme="light"
                  spotlightColor="rgba(184, 35, 40, 0.12)"
                  className="bg-outside-elevated border border-outside-border overflow-hidden group shadow-editorial !p-0 flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/5] bg-outside-surface overflow-hidden">
                    <Image
                      src="/images/drops/drop-001-back.jpg"
                      alt="OUTSIDE DROP 001 Typographic Manifesto - Upper Back"
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-outside-elevated/90 backdrop-blur text-[10px] font-mono font-bold uppercase tracking-wider text-outside-ink border border-outside-border">
                        FRAME 02 // TYPOGRAPHIC MANIFESTO
                      </span>
                    </div>
                  </div>
                  <div className="p-5 border-t border-outside-border space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-outside-ink">SAME GIRL BRIGHTER DAYS</span>
                      <span className="text-outside-accent font-bold">MATTE PIGMENT</span>
                    </div>
                    <p className="text-[11px] text-outside-inkSecondary font-sans leading-relaxed">
                      High-density matte charcoal pigment bonded into combed cotton fibers for lifelong wash resistance.
                    </p>
                  </div>
                </SpotlightCard>

                {/* Lookbook Frame 3 */}
                <SpotlightCard
                  theme="light"
                  spotlightColor="rgba(184, 35, 40, 0.12)"
                  className="bg-outside-elevated border border-outside-border overflow-hidden group shadow-editorial !p-0 flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/5] bg-outside-surface overflow-hidden">
                    <Image
                      src="/images/drops/drop-001-detail1.jpg"
                      alt="OUTSIDE DROP 001 Embroidery Metallurgy Detail"
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-outside-elevated/90 backdrop-blur text-[10px] font-mono font-bold uppercase tracking-wider text-outside-ink border border-outside-border">
                        FRAME 03 // EMBROIDERY METALLURGY
                      </span>
                    </div>
                  </div>
                  <div className="p-5 border-t border-outside-border space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-outside-ink">CHAIN-STITCH WORK</span>
                      <span className="text-outside-accent font-bold">DEBOSSED HEART</span>
                    </div>
                    <p className="text-[11px] text-outside-inkSecondary font-sans leading-relaxed">
                      Multi-tiered rayon threadwork with tactile hand-finished canvas patch reading &quot;for a kinder you&quot;.
                    </p>
                  </div>
                </SpotlightCard>

                {/* Lookbook Frame 4 */}
                <SpotlightCard
                  theme="light"
                  spotlightColor="rgba(184, 35, 40, 0.12)"
                  className="bg-outside-elevated border border-outside-border overflow-hidden group shadow-editorial !p-0 flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/5] bg-outside-surface overflow-hidden">
                    <Image
                      src="/images/drops/drop-001-collar.jpg"
                      alt="OUTSIDE DROP 001 Lycra Recovery Collar"
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-outside-elevated/90 backdrop-blur text-[10px] font-mono font-bold uppercase tracking-wider text-outside-ink border border-outside-border">
                        FRAME 04 // COLLAR &amp; SEAM RECOVERY
                      </span>
                    </div>
                  </div>
                  <div className="p-5 border-t border-outside-border space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-outside-ink">REINFORCED 1.25&quot; RIB</span>
                      <span className="text-outside-accent font-bold">ZERO SAG</span>
                    </div>
                    <p className="text-[11px] text-outside-inkSecondary font-sans leading-relaxed">
                      Engineered Lycra blend neckband maintains shape after 50+ wash cycles without bacon-neck distortion.
                    </p>
                  </div>
                </SpotlightCard>
              </div>
            </div>
          </section>
        );

      case 'specs':
        return (
          <section key={sectionKey} id="fit-philosophy" className={`py-24 border-b border-outside-border ${visibilityClass}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-6 space-y-6">
                  <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-outside-accent font-bold">
                    PROPORTION &amp; ERGONOMICS
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-outside-ink uppercase">
                    The Women-First Sizing Philosophy.
                  </h2>
                  <p className="text-sm text-outside-inkSecondary leading-relaxed">
                    Most streetwear brands treat unisex as &quot;men&apos;s cuts scaled down.&quot; The shoulders sag awkwardly, the sleeve holes pinch, and the drape is unflattering.
                  </p>
                  <p className="text-sm text-outside-inkSecondary leading-relaxed">
                    At OUTSIDE, every design begins with the female form. We recalibrated neck opening tension, altered dropped shoulder angles, and engineered side split vents so the heavyweight fabric moves gracefully without bunching at the hips.
                  </p>

                  <div className="space-y-3 pt-2 font-mono text-xs text-outside-ink font-medium">
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-outside-accent flex-shrink-0" />
                      <span>Proportioned armhole depth prevents excessive underarm fabric bunching</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-outside-accent flex-shrink-0" />
                      <span>Custom rib collar with Lycra recovery retains shape wash after wash</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-outside-accent flex-shrink-0" />
                      <span>Reinforced split-hem design sits clean whether worn tucked or free</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-outside-elevated border border-outside-border p-8 space-y-6 shadow-editorial">
                  <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-outside-ink font-bold">
                    FIT &amp; SIZE COMPARISON MATRIX
                  </h3>
                  
                  <div className="space-y-4 font-mono text-xs">
                    <div className="p-4 bg-outside-surface border border-outside-border space-y-1">
                      <div className="flex justify-between font-bold text-outside-ink">
                        <span>WOMEN OVERSIZED FIT</span>
                        <span className="text-outside-accent">OVERSIZED BOXY</span>
                      </div>
                      <p className="text-[11px] text-outside-inkSecondary font-sans pt-1">
                        Calibrated dropped shoulder, slightly trimmed torso length, relaxed body volume for an effortless oversized drape.
                      </p>
                    </div>

                    <div className="p-4 bg-outside-surface border border-outside-border space-y-1">
                      <div className="flex justify-between font-bold text-outside-ink">
                        <span>MEN OVERSIZED FIT</span>
                        <span className="text-outside-ink">STRUCTURED-RELAXED</span>
                      </div>
                      <p className="text-[11px] text-outside-inkSecondary font-sans pt-1">
                        Broad shoulder yoke, extended sleeve drape, structured chest breadth maintaining a bold architectural presence.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 text-right">
                    <Link
                      href="/size-guide"
                      className="text-xs font-mono text-outside-accent hover:underline uppercase tracking-wider inline-flex items-center gap-1.5 font-bold"
                    >
                      <span>VIEW FULL MEASUREMENT CHART</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'vault':
        if (!showVaultFlag) return null;
        return (
          <section key="vault" className={`py-24 border-b border-outside-border bg-outside-cardSubtle/30 ${visibilityClass}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                <div className="space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-outside-accent font-bold">
                    DIGITAL ARCHIVE // SEEDED EDITIONS
                  </span>
                  <h2 className="text-3xl font-display font-black tracking-tight text-outside-ink uppercase">
                    The Vault // Editions Showcase.
                  </h2>
                </div>
                <Link
                  href="/vault"
                  className="text-xs font-mono text-outside-accent hover:underline uppercase tracking-wider flex items-center gap-2 font-bold"
                >
                  <span>EXPLORE ALL ARCHIVED EDITIONS</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className={`grid ${vaultMobile} ${vaultTablet} ${vaultDesktop} gap-8`}>
                {vaultDrops.map((drop: any) => (
                  <SpotlightCard
                    key={drop.id}
                    theme="light"
                    spotlightColor="rgba(184, 35, 40, 0.14)"
                    className="bg-outside-elevated border border-outside-border overflow-hidden flex flex-col justify-between group shadow-editorial hover:border-outside-accent/50 transition-all !p-0"
                  >
                    <div className="relative aspect-[4/5] bg-outside-surface overflow-hidden">
                      <Image
                        src={drop.primaryImageUrl || '/images/drops/drop-001-front.jpg'}
                        alt={drop.title}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="outline" className="bg-outside-elevated/90">
                          DROP 00{drop.dropNumber}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge variant={drop.status === 'UPCOMING' ? 'live' : 'archived'} className="bg-outside-elevated/90">
                          {drop.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-bold font-display text-outside-ink uppercase">
                          {drop.title}
                        </h3>
                        <p className="text-xs text-outside-inkSecondary mt-2 line-clamp-2 leading-relaxed font-sans">
                          {drop.story}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-outside-border flex justify-between items-center text-xs font-mono">
                        <span className="text-outside-inkSecondary">RUN: {drop.totalEditionQty} PIECES</span>
                        <Link
                          href={`/vault/${drop.slug}`}
                          className="text-outside-accent font-bold hover:underline flex items-center gap-1"
                        >
                          <span>SPEC &rarr;</span>
                        </Link>
                      </div>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          </section>
        );

      case 'journal':
        if (!showJournalFlag || journal.length === 0) return null;
        return (
          <section key="journal" className={`py-24 border-b border-outside-border ${visibilityClass}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                <div className="space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-outside-accent font-bold">
                    EDITORIAL MANIFESTO
                  </span>
                  <h2 className="text-3xl font-display font-black tracking-tight text-outside-ink uppercase">
                    The Outside Journal.
                  </h2>
                </div>
                <Link
                  href="/journal"
                  className="text-xs font-mono text-outside-accent hover:underline uppercase tracking-wider flex items-center gap-2 font-bold"
                >
                  <span>READ ALL ESSAYS</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {journal.slice(0, 2).map((essay: any) => (
                  <Link
                    key={essay.id}
                    href={`/journal/${essay.slug}`}
                    className="group bg-outside-elevated border border-outside-border p-6 shadow-editorial hover:border-outside-accent transition-all block space-y-4"
                  >
                    <div className="relative aspect-video bg-outside-surface overflow-hidden">
                      <Image
                        src={essay.coverImageUrl}
                        alt={essay.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-outside-accent font-bold uppercase block">
                      BY {essay.authorName} · EDITORIAL
                    </span>
                    <h3 className="text-lg font-bold font-display text-outside-ink uppercase group-hover:text-outside-accent transition-colors">
                      {essay.title}
                    </h3>
                    <p className="text-xs text-outside-inkSecondary line-clamp-2 font-sans">
                      {essay.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );

      case 'faqs':
        return (
          <section key="faqs" className={`py-24 border-b border-outside-border ${visibilityClass}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
              {/* Direct Answer Editorial Blocks for AI Search & AEO */}
              <DirectAnswerBlocks />

              <div className="max-w-4xl mx-auto space-y-12">
                <SectionHeading
                  eyebrow="KNOWLEDGE BASE // DIRECT ANSWERS"
                  title="Frequently Asked Questions."
                  description="Clear, transparent answers regarding craft, GST compliance, sizing, and single-drop release mechanics."
                />

                <div className="space-y-4">
                  {faqs.map((faq: any) => (
                    <details
                      key={faq.id}
                      className="group p-6 bg-outside-elevated border border-outside-border open:border-outside-accent shadow-editorial transition-colors cursor-pointer"
                    >
                      <summary className="flex items-center justify-between text-sm font-mono uppercase font-bold text-outside-ink list-none">
                        <div className="flex items-center gap-3">
                          <HelpCircle className="w-4 h-4 text-outside-accent" />
                          <span>{faq.question}</span>
                        </div>
                        <span className="text-outside-inkSecondary group-open:rotate-180 transition-transform">
                          &darr;
                        </span>
                      </summary>
                      <div className="pt-4 mt-4 border-t border-outside-border text-xs text-outside-inkSecondary leading-relaxed font-sans">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );

      case 'vip':
        return (
          <section key={sectionKey} className={`relative overflow-hidden py-24 sm:py-28 bg-[#111110] text-[#FCFBF8] text-center ${visibilityClass}`}>
            {/* Silk Wave Textile Animation Background */}
            <div className="absolute inset-0 pointer-events-none opacity-25">
              <Waves lineColor="#ffffff" mouseInteraction={true} speed={0.4} />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="inline-block">
                <ShinyText
                  text="LIMITED EDITION // ZERO DEADSTOCK"
                  speed={3}
                  color="#B82328"
                  shineColor="#FFFFFF"
                  className="text-xs font-mono uppercase tracking-[0.3em] font-bold"
                />
              </div>

              <div className="flex justify-center">
                <BlurText
                  text="WEAR YOUR STORY."
                  delay={100}
                  animateBy="words"
                  direction="top"
                  className="text-4xl sm:text-6xl font-display font-black tracking-tight uppercase text-white justify-center"
                />
              </div>

              <p className="text-sm max-w-xl mx-auto leading-relaxed text-[#DCD7CC] font-sans">
                DROP 001 is currently live and allocation is claimed in real time. Once unit 250 is claimed, no further pieces will ever be created.
              </p>

              <div className="pt-4 flex justify-center">
                <a
                  href="#active-drop"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#B82328] hover:bg-[#9E1B20] text-white font-mono text-xs uppercase tracking-[0.25em] font-bold transition-all shadow-editorial cursor-pointer rounded hover:scale-102 active:scale-98"
                >
                  <span>CLAIM YOUR PIECE TODAY</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  // Sort sections according to LayoutConfig.sections
  const configuredSections = layout.sections && layout.sections.length > 0
    ? [...layout.sections].sort((a: any, b: any) => a.sortOrder - b.sortOrder)
    : [
        { id: 'hero' },
        { id: 'drops' },
        { id: 'story' },
        { id: 'lookbook' },
        { id: 'specs' },
        { id: 'vault' },
        { id: 'journal' },
        { id: 'faqs' },
        { id: 'vip' },
      ];

  const orgSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();
  const productSchema = generateProductSchema(activeDrop, true);
  const breadcrumbSchema = generateBreadcrumbSchema([{ name: 'Home', url: '/' }]);
  const faqJsonLd = generateFaqSchema(faqs);

  return (
    <div className="bg-outside-canvas text-outside-ink font-sans">
      {/* Structured E-Commerce & AEO JSON-LD */}
      <JsonLd data={orgSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqJsonLd} />

      {/* Dynamic Sections Sequence */}
      {configuredSections.map((secConfig: any, idx: number) =>
        renderSection(secConfig.id, secConfig, idx)
      )}

      {/* Mobile Sticky Quick Buy Bar (Dynamically positioned per Admin Layout Config) */}
      <MobileStickyQuickBuy
        drop={activeDrop}
        position={layout.mobileStickyCtaPosition || 'bottom_fixed'}
      />
    </div>
  );
}

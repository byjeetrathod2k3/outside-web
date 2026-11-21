'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SpotlightCard from '@/components/reactbits/SpotlightCard/SpotlightCard';
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Lock,
  Clock,
  Check,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export interface DropItem {
  id: string;
  dropNumber: number;
  slug: string;
  title: string;
  subtitle?: string;
  story?: string;
  fabricSpecs?: string;
  pricePaise: number;
  currency?: string;
  totalEditionQty: number;
  status: 'LIVE' | 'UPCOMING' | 'ARCHIVED';
  launchAt?: string;
  soldOutAt?: string | null;
  primaryImageUrl: string;
  galleryUrls?: string[];
  isFeatured?: boolean;
  variants?: Array<{
    id: string;
    dropId: string;
    sku: string;
    fit: 'WOMEN' | 'MEN' | 'UNISEX';
    size: string;
    initialStock: number;
    currentStock: number;
    reservedStock?: number;
  }>;
}

interface MultiDropShowcaseProps {
  drops: DropItem[];
  activeDropId?: string;
  className?: string;
}

type FilterCategory = 'ALL' | 'LIVE' | 'UPCOMING' | 'WOMEN' | 'MEN' | 'ARCHIVED';

export function MultiDropShowcase({
  drops = [],
  activeDropId,
  className = '',
}: MultiDropShowcaseProps) {
  const router = useRouter();
  const { addItem, openCart } = useCart();

  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  
  // Track selected fit & size per drop card
  const [selectedFitByDrop, setSelectedFitByDrop] = useState<Record<string, 'WOMEN' | 'MEN'>>({});
  const [selectedSizeByDrop, setSelectedSizeByDrop] = useState<Record<string, string>>({});
  const [imageSideByDrop, setImageSideByDrop] = useState<Record<string, 'front' | 'back'>>({});
  const [addedDropId, setAddedDropId] = useState<string | null>(null);

  // Helper getters per drop
  const getSelectedFit = (drop: DropItem): 'WOMEN' | 'MEN' => {
    return selectedFitByDrop[drop.id] || 'WOMEN';
  };

  const getSelectedSize = (drop: DropItem): string => {
    if (selectedSizeByDrop[drop.id]) return selectedSizeByDrop[drop.id];
    const fit = getSelectedFit(drop);
    const available = drop.variants?.filter((v) => v.fit === fit && v.currentStock > 0);
    return available?.[0]?.size || 'M';
  };

  const getSelectedVariant = (drop: DropItem) => {
    const fit = getSelectedFit(drop);
    const size = getSelectedSize(drop);
    return drop.variants?.find((v) => v.fit === fit && v.size === size);
  };

  const handleAddToCart = (drop: DropItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const variant = getSelectedVariant(drop);
    const fit = getSelectedFit(drop);
    const size = getSelectedSize(drop);

    if (!variant || variant.currentStock <= 0) return;

    addItem({
      dropId: drop.id,
      variantId: variant.id,
      title: drop.title,
      fit,
      size,
      quantity: 1,
      unitPricePaise: drop.pricePaise,
      maxStock: variant.currentStock,
      image: drop.primaryImageUrl,
    });

    setAddedDropId(drop.id);
    setTimeout(() => setAddedDropId(null), 2000);
    openCart();
  };

  const handleInstantBuy = (drop: DropItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const variant = getSelectedVariant(drop);
    const fit = getSelectedFit(drop);
    const size = getSelectedSize(drop);

    if (!variant || variant.currentStock <= 0) return;

    addItem({
      dropId: drop.id,
      variantId: variant.id,
      title: drop.title,
      fit,
      size,
      quantity: 1,
      unitPricePaise: drop.pricePaise,
      maxStock: variant.currentStock,
      image: drop.primaryImageUrl,
    });

    router.push('/checkout');
  };

  // Filter drops logic
  const filteredDrops = drops.filter((drop) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'LIVE') return drop.status === 'LIVE';
    if (activeFilter === 'UPCOMING') return drop.status === 'UPCOMING';
    if (activeFilter === 'ARCHIVED') return drop.status === 'ARCHIVED';
    if (activeFilter === 'WOMEN') {
      return drop.variants?.some((v) => v.fit === 'WOMEN' && v.currentStock > 0);
    }
    if (activeFilter === 'MEN') {
      return drop.variants?.some((v) => v.fit === 'MEN' && v.currentStock > 0);
    }
    return true;
  });

  const liveCount = drops.filter((d) => d.status === 'LIVE').length;
  const upcomingCount = drops.filter((d) => d.status === 'UPCOMING').length;

  return (
    <section className={`py-20 border-b border-outside-border bg-outside-surface/20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-outside-border">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] text-outside-accent font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE ROTATION // SERIALIZED PRODUCTION RUNS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-outside-ink uppercase">
              All Active &amp; Queued Productions.
            </h2>
            <p className="text-xs sm:text-sm text-outside-inkSecondary font-sans max-w-2xl leading-relaxed">
              Every silhouette is custom-milled in India, numbered from #001 to #250, and produced in a singular non-recurring run. Once an edition is claimed, the digital patterns are retired permanently into The Vault.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 bg-outside-elevated border border-outside-border text-outside-ink font-bold">
              {liveCount} LIVE {liveCount === 1 ? 'DROP' : 'DROPS'}
            </span>
            <span className="px-3 py-1.5 bg-outside-elevated border border-outside-border text-outside-inkSecondary">
              {upcomingCount} UPCOMING
            </span>
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { key: 'ALL', label: `ALL PRODUCTIONS (${drops.length})` },
              { key: 'LIVE', label: `LIVE DISPATCH (${liveCount})` },
              { key: 'UPCOMING', label: `UPCOMING QUEUE (${upcomingCount})` },
              { key: 'WOMEN', label: "WOMEN'S BOXY FIT" },
              { key: 'MEN', label: "MEN'S RELAXED FIT" },
              { key: 'ARCHIVED', label: 'THE VAULT ARCHIVE' },
            ] as const
          ).map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer border ${
                  isActive
                    ? 'bg-outside-ink text-outside-elevated border-outside-ink shadow-sm'
                    : 'bg-outside-elevated text-outside-inkSecondary border-outside-border hover:border-outside-ink hover:text-outside-ink'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Drops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDrops.map((drop) => {
            const isLive = drop.status === 'LIVE';
            const isUpcoming = drop.status === 'UPCOMING';
            const isArchived = drop.status === 'ARCHIVED';

            const fit = getSelectedFit(drop);
            const size = getSelectedSize(drop);
            const variant = getSelectedVariant(drop);
            const side = imageSideByDrop[drop.id] || 'front';

            const currentStock =
              drop.variants?.reduce((acc, v) => acc + (v.currentStock || 0), 0) ?? 0;
            const isSoldOut = isLive && currentStock <= 0;

            const primaryImg = drop.primaryImageUrl;
            const backImg =
              drop.galleryUrls?.[1] || drop.primaryImageUrl.replace('front', 'back');
            const displayImg = side === 'back' && backImg ? backImg : primaryImg;

            return (
              <SpotlightCard
                key={drop.id}
                theme="light"
                spotlightColor="rgba(184, 35, 40, 0.14)"
                className="bg-outside-elevated border border-outside-border overflow-hidden flex flex-col justify-between group shadow-editorial hover:border-outside-accent/50 transition-colors !p-0"
              >
                {/* Visual Image Stage with Image Toggle */}
                <div className="relative aspect-[4/5] bg-outside-surface overflow-hidden">
                  <Image
                    src={displayImg}
                    alt={drop.title}
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02]"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="px-2.5 py-1 bg-outside-elevated/95 backdrop-blur text-[10px] font-mono font-bold tracking-wider text-outside-ink border border-outside-border shadow-xs uppercase">
                      DROP 00{drop.dropNumber}
                    </span>
                    {drop.id === activeDropId && (
                      <span className="px-2 py-0.5 bg-outside-accent text-white text-[9px] font-mono font-bold tracking-widest uppercase">
                        HEADLINER
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    {isLive && (
                      <Badge variant="live" className="shadow-xs font-mono text-[10px]">
                        LIVE · {currentStock} LEFT
                      </Badge>
                    )}
                    {isUpcoming && (
                      <Badge variant="outline" className="bg-outside-elevated/95 font-mono text-[10px] text-outside-ink">
                        UPCOMING
                      </Badge>
                    )}
                    {isArchived && (
                      <Badge variant="archived" className="font-mono text-[10px]">
                        VAULT RETIRED
                      </Badge>
                    )}
                  </div>

                  {/* Image View Flip Switch (Front / Back) */}
                  {drop.galleryUrls && drop.galleryUrls.length > 1 && (
                    <div className="absolute bottom-3 left-3 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageSideByDrop((prev) => ({
                            ...prev,
                            [drop.id]: prev[drop.id] === 'back' ? 'front' : 'back',
                          }));
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-outside-elevated/90 hover:bg-outside-elevated backdrop-blur text-[10px] font-mono font-bold text-outside-ink border border-outside-border shadow-xs transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3 text-outside-accent" />
                        <span>VIEW {side === 'front' ? 'BACK' : 'FRONT'}</span>
                      </button>
                    </div>
                  )}

                  {/* Serial Limit Tag */}
                  <div className="absolute bottom-3 right-3 z-10">
                    <span className="px-2 py-1 bg-outside-elevated/90 backdrop-blur text-[9px] font-mono text-outside-inkSecondary border border-outside-border font-bold">
                      RUN: {drop.totalEditionQty} UNITS
                    </span>
                  </div>
                </div>

                {/* Content & Commercial Console */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  
                  {/* Title & Specs */}
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-base font-bold font-display text-outside-ink uppercase leading-snug">
                        {drop.title}
                      </h3>
                      <span className="font-mono text-sm font-bold text-outside-ink whitespace-nowrap">
                        ₹{(drop.pricePaise / 100).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <p className="text-xs text-outside-inkSecondary font-sans line-clamp-2 leading-relaxed">
                      {drop.subtitle || drop.story}
                    </p>

                    {drop.fabricSpecs && (
                      <div className="pt-1">
                        <span className="inline-block text-[10px] font-mono text-outside-accent font-bold uppercase tracking-wider bg-outside-surface/60 px-2 py-0.5 border border-outside-border">
                          {drop.fabricSpecs.split('·')[0].trim()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Commerce Selection Console for LIVE drops */}
                  {isLive && !isSoldOut && drop.variants && drop.variants.length > 0 && (
                    <div className="space-y-4 pt-3 border-t border-outside-border">
                      
                      {/* Fit Toggle */}
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[10px] uppercase font-bold text-outside-inkSecondary tracking-wider">
                          FIT SILHOUETTE
                        </span>
                        <div className="inline-flex p-0.5 bg-outside-surface border border-outside-border">
                          <button
                            onClick={() =>
                              setSelectedFitByDrop((prev) => ({ ...prev, [drop.id]: 'WOMEN' }))
                            }
                            className={`px-2.5 py-1 text-[10px] font-bold tracking-wider transition-colors cursor-pointer ${
                              fit === 'WOMEN'
                                ? 'bg-outside-elevated text-outside-ink shadow-xs'
                                : 'text-outside-inkSecondary hover:text-outside-ink'
                            }`}
                          >
                            WOMEN
                          </button>
                          <button
                            onClick={() =>
                              setSelectedFitByDrop((prev) => ({ ...prev, [drop.id]: 'MEN' }))
                            }
                            className={`px-2.5 py-1 text-[10px] font-bold tracking-wider transition-colors cursor-pointer ${
                              fit === 'MEN'
                                ? 'bg-outside-elevated text-outside-ink shadow-xs'
                                : 'text-outside-inkSecondary hover:text-outside-ink'
                            }`}
                          >
                            MEN
                          </button>
                        </div>
                      </div>

                      {/* Size Selector */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="font-bold text-outside-inkSecondary uppercase tracking-wider">
                            SELECT SIZE ({fit})
                          </span>
                          <span className="text-outside-accent font-bold">
                            {variant ? `${variant.currentStock} in stock` : 'Select'}
                          </span>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                          {(fit === 'WOMEN' ? ['XS', 'S', 'M', 'L'] : ['S', 'M', 'L', 'XL']).map(
                            (sz) => {
                              const v = drop.variants?.find((item) => item.fit === fit && item.size === sz);
                              const inStock = v && v.currentStock > 0;
                              const isSelected = size === sz;

                              return (
                                <button
                                  key={sz}
                                  disabled={!inStock}
                                  onClick={() =>
                                    setSelectedSizeByDrop((prev) => ({ ...prev, [drop.id]: sz }))
                                  }
                                  className={`py-2 text-[11px] font-mono font-bold uppercase transition-colors cursor-pointer border ${
                                    isSelected
                                      ? 'bg-outside-ink text-outside-elevated border-outside-ink shadow-xs'
                                      : inStock
                                      ? 'bg-outside-surface text-outside-ink border-outside-border hover:border-outside-ink'
                                      : 'opacity-30 cursor-not-allowed bg-outside-surface/50 border-outside-border text-outside-inkSecondary line-through'
                                  }`}
                                >
                                  {sz}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>

                      {/* Direct Dual CTAs: Buy Now + Add to Bag */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleAddToCart(drop, e)}
                          className="w-full text-[11px] font-mono tracking-wider font-bold border-outside-ink text-outside-ink hover:bg-outside-surface flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{addedDropId === drop.id ? 'ADDED ✓' : 'ADD TO BAG'}</span>
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => handleInstantBuy(drop, e)}
                          className="w-full text-[11px] font-mono tracking-wider font-bold bg-outside-accent hover:bg-outside-accent/90 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-editorial"
                        >
                          <span>BUY NOW</span>
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Actions for UPCOMING Drops */}
                  {isUpcoming && (
                    <div className="space-y-3 pt-3 border-t border-outside-border">
                      <div className="p-3 bg-outside-surface/60 border border-outside-border text-xs font-mono space-y-1">
                        <div className="flex items-center gap-1.5 text-outside-accent font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>LAUNCHING SOON · CAPPED AT {drop.totalEditionQty}</span>
                        </div>
                        <p className="text-[10px] text-outside-inkSecondary leading-relaxed">
                          VIP waitlist members receive early password access 1 hour prior to general public dispatch.
                        </p>
                      </div>

                      <a
                        href="#vip-access"
                        className="w-full py-3 bg-outside-ink hover:bg-black text-outside-elevated text-xs font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer text-center block"
                      >
                        <span>JOIN VIP QUEUE</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {/* Actions for ARCHIVED Drops */}
                  {isArchived && (
                    <div className="space-y-3 pt-3 border-t border-outside-border">
                      <div className="p-3 bg-outside-surface/60 border border-outside-border text-xs font-mono space-y-1">
                        <div className="flex items-center gap-1.5 text-outside-ink font-bold">
                          <Lock className="w-3.5 h-3.5 text-outside-inkSecondary" />
                          <span>100% CLAIMED &amp; RETIRED</span>
                        </div>
                        <p className="text-[10px] text-outside-inkSecondary leading-relaxed">
                          Zero restocks will ever be produced. Preserved for collectors in the digital archive.
                        </p>
                      </div>

                      <Link
                        href={`/vault/${drop.slug || drop.id}`}
                        className="w-full py-3 bg-outside-surface hover:bg-outside-surface/80 border border-outside-border text-outside-ink text-xs font-mono uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
                      >
                        <span>VIEW ARCHIVED SPEC</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                  {/* Bottom Assurance */}
                  <div className="pt-2 border-t border-outside-border flex items-center justify-between text-[10px] font-mono text-outside-inkSecondary">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-outside-moss" />
                      <span>INCL. 5% GST</span>
                    </span>
                    <span>DISPATCH IN 24H</span>
                  </div>

                </div>
              </SpotlightCard>
            );
          })}
        </div>

      </div>
    </section>
  );
}

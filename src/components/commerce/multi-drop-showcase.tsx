'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SpotlightCard from '@/components/reactbits/SpotlightCard/SpotlightCard';
import { CategoryStoryBubbles } from '@/components/commerce/category-story-bubbles';
import { ProductPreviewModal } from '@/components/commerce/product-preview-modal';
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Lock,
  Clock,
  Check,
  RotateCcw,
  ShieldCheck,
  Heart,
  Grid2X2,
  Grid3X3,
  LayoutGrid,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Star,
  Zap,
  Maximize2,
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
  categories?: any[];
  defaultCardCount?: number;
  defaultFilter?: FilterCategory;
  defaultSort?: SortOption;
  showCategoryBubbles?: boolean;
  showFilterToolbar?: boolean;
  sectionEyebrow?: string;
  sectionTitle?: string;
  sectionDescription?: string;
}

type FilterCategory = 'ALL' | 'LIVE' | 'UPCOMING' | 'WOMEN' | 'MEN' | 'ARCHIVED';
type PriceFilter = 'ALL' | 'UNDER_2400' | '2400_2500' | 'ABOVE_2500';
type SortOption = 'FEATURED' | 'PRICE_ASC' | 'PRICE_DESC' | 'DROP_NUM' | 'EDITION_RUN';

const COLOR_PALETTE = [
  { id: 'ALL', label: 'All Colors', hex: 'transparent', border: 'border-outside-border' },
  { id: 'ivory', label: 'Raw Ivory', hex: '#F7F5F0', border: 'border-amber-200' },
  { id: 'moss', label: 'Botanical Moss', hex: '#3F4E44', border: 'border-transparent' },
  { id: 'black', label: 'Obsidian Black', hex: '#111110', border: 'border-transparent' },
  { id: 'crimson', label: 'Studio Crimson', hex: '#B82328', border: 'border-transparent' },
];

export function MultiDropShowcase({
  drops = [],
  activeDropId,
  className = '',
  categories,
  defaultCardCount = 3,
  defaultFilter = 'ALL',
  defaultSort = 'FEATURED',
  showCategoryBubbles = true,
  showFilterToolbar = true,
  sectionEyebrow,
  sectionTitle,
  sectionDescription,
}: MultiDropShowcaseProps) {
  const router = useRouter();
  const { addItem, openCart, toggleWishlist, isInWishlist } = useCart();

  const [activeFilter, setActiveFilter] = useState<FilterCategory>(defaultFilter);
  const [activePriceFilter, setActivePriceFilter] = useState<PriceFilter>('ALL');
  const [selectedColor, setSelectedColor] = useState<string>('ALL');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>(defaultSort);
  const [gridColumns, setGridColumns] = useState<2 | 3 | 4>(3);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isShowingAllCards, setIsShowingAllCards] = useState<boolean>(!defaultCardCount || defaultCardCount === 0);

  // Per-drop interaction state
  const [selectedFitByDrop, setSelectedFitByDrop] = useState<Record<string, 'WOMEN' | 'MEN'>>({});
  const [selectedSizeByDrop, setSelectedSizeByDrop] = useState<Record<string, string>>({});
  const [imageSideByDrop, setImageSideByDrop] = useState<Record<string, 'front' | 'back'>>({});
  const [addedDropId, setAddedDropId] = useState<string | null>(null);
  const [previewDrop, setPreviewDrop] = useState<DropItem | null>(null);

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
      title: `${drop.title} (${fit})`,
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
      title: `${drop.title} (${fit})`,
      fit,
      size,
      quantity: 1,
      unitPricePaise: drop.pricePaise,
      maxStock: variant.currentStock,
      image: drop.primaryImageUrl,
    });

    router.push('/checkout');
  };

  // Filter & Sort Logic
  const filteredAndSortedDrops = useMemo(() => {
    let result = drops.filter((drop) => {
      // Category filter
      if (activeFilter === 'LIVE' && drop.status !== 'LIVE') return false;
      if (activeFilter === 'UPCOMING' && drop.status !== 'UPCOMING') return false;
      if (activeFilter === 'ARCHIVED' && drop.status !== 'ARCHIVED') return false;
      if (activeFilter === 'WOMEN') {
        const hasWomen = drop.variants?.some((v) => v.fit === 'WOMEN' && v.currentStock > 0);
        if (!hasWomen) return false;
      }
      if (activeFilter === 'MEN') {
        const hasMen = drop.variants?.some((v) => v.fit === 'MEN' && v.currentStock > 0);
        if (!hasMen) return false;
      }

      // Price filter
      const priceRupees = drop.pricePaise / 100;
      if (activePriceFilter === 'UNDER_2400' && priceRupees >= 2400) return false;
      if (activePriceFilter === '2400_2500' && (priceRupees < 2400 || priceRupees > 2500)) return false;
      if (activePriceFilter === 'ABOVE_2500' && priceRupees <= 2500) return false;

      // Size filter
      if (selectedSizeFilter !== 'ALL') {
        const hasSize = drop.variants?.some(
          (v) => v.size === selectedSizeFilter && v.currentStock > 0
        );
        if (!hasSize) return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.pricePaise - b.pricePaise;
      if (sortBy === 'PRICE_DESC') return b.pricePaise - a.pricePaise;
      if (sortBy === 'DROP_NUM') return b.dropNumber - a.dropNumber;
      if (sortBy === 'EDITION_RUN') return b.totalEditionQty - a.totalEditionQty;
      // Default: Featured (Active headliner first, then upcoming, then archived)
      if (a.id === activeDropId) return -1;
      if (b.id === activeDropId) return 1;
      if (a.status === 'LIVE') return -1;
      if (b.status === 'LIVE') return 1;
      return b.dropNumber - a.dropNumber;
    });

    return result;
  }, [drops, activeFilter, activePriceFilter, selectedSizeFilter, sortBy, activeDropId]);

  const displayedDrops = useMemo(() => {
    if (!defaultCardCount || defaultCardCount === 0 || isShowingAllCards) {
      return filteredAndSortedDrops;
    }
    return filteredAndSortedDrops.slice(0, defaultCardCount);
  }, [filteredAndSortedDrops, defaultCardCount, isShowingAllCards]);

  const hasHiddenDrops = Boolean(
    defaultCardCount &&
    defaultCardCount > 0 &&
    filteredAndSortedDrops.length > defaultCardCount
  );

  const liveCount = drops.filter((d) => d.status === 'LIVE').length;
  const upcomingCount = drops.filter((d) => d.status === 'UPCOMING').length;

  // Dynamic grid classes based on density selector (like Reference Image 3)
  const gridLayoutClass =
    gridColumns === 2
      ? 'grid-cols-1 md:grid-cols-2 gap-8'
      : gridColumns === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';

  return (
    <section className={`py-10 md:py-16 border-b border-outside-border bg-outside-surface/20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-outside-border">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] text-outside-accent font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{sectionEyebrow || 'THE ROTATION // SERIALIZED PRODUCTION RUNS'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-outside-ink uppercase">
              {sectionTitle || 'Limited Edition Catalog.'}
            </h2>
            <p className="text-xs sm:text-sm text-outside-inkSecondary font-sans max-w-2xl leading-relaxed">
              {sectionDescription || 'Every garment is custom-milled in India from 280 GSM organic cotton, numbered from #001 to #250, and produced once. Never restocked.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 bg-outside-elevated border border-outside-border text-outside-ink font-bold shadow-xs">
              {liveCount} LIVE {liveCount === 1 ? 'DROP' : 'DROPS'}
            </span>
            <span className="px-3 py-1.5 bg-outside-elevated border border-outside-border text-outside-inkSecondary">
              {upcomingCount} IN QUEUE
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* Category Story Directory: Seamless, Transparent Flow    */}
        {/* ======================================================== */}
        {showCategoryBubbles && (
          <div className="py-1">
            <CategoryStoryBubbles
              activeFilter={activeFilter}
              onSelectCategory={(catId) => setActiveFilter(catId as FilterCategory)}
              drops={drops}
              categories={categories}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* Advanced Catalog Toolbar (Active Filter Feedback & Tools)*/}
        {/* ======================================================== */}
        {showFilterToolbar && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 sm:p-4 rounded-xl bg-outside-elevated/80 border border-outside-border/80 shadow-xs">
          
          {/* Left: Active Selection Status */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[10px] uppercase tracking-wider text-[#6B6862] font-bold">VIEWING:</span>
            <span className="px-2.5 py-1 rounded bg-[#111110] text-[#FCFBF8] font-bold text-[10px] uppercase tracking-wider">
              {activeFilter === 'ALL'
                ? `ALL EDITIONS (${filteredAndSortedDrops.length})`
                : activeFilter === 'LIVE'
                ? `LIVE DROP (${filteredAndSortedDrops.length})`
                : activeFilter === 'UPCOMING'
                ? `UPCOMING (${filteredAndSortedDrops.length})`
                : activeFilter === 'WOMEN'
                ? `WOMEN'S FIT (${filteredAndSortedDrops.length})`
                : activeFilter === 'MEN'
                ? `MEN'S FIT (${filteredAndSortedDrops.length})`
                : `THE VAULT (${filteredAndSortedDrops.length})`}
            </span>
            {activeFilter !== 'ALL' && (
              <button
                type="button"
                onClick={() => setActiveFilter('ALL')}
                className="text-[11px] text-[#B82328] hover:underline font-bold ml-1.5 cursor-pointer"
              >
                Reset Filter &times;
              </button>
            )}
          </div>

          {/* Right: Controls Strip (Sort, Density, Filters Toggle) */}
          <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto font-mono text-xs">
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                isFilterPanelOpen || activePriceFilter !== 'ALL' || selectedSizeFilter !== 'ALL'
                  ? 'border-outside-accent text-outside-accent bg-outside-accent/10 font-bold'
                  : 'border-outside-border text-outside-inkSecondary hover:text-outside-ink bg-outside-surface/60'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>FILTERS</span>
              {(activePriceFilter !== 'ALL' || selectedSizeFilter !== 'ALL') && (
                <span className="w-1.5 h-1.5 rounded-full bg-outside-accent" />
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort catalog by"
                className="appearance-none bg-outside-surface/60 hover:bg-outside-surface border border-outside-border text-outside-ink px-3 py-1.5 pr-7 rounded-full text-xs font-mono uppercase focus:outline-none focus:border-outside-ink cursor-pointer"
              >
                <option value="FEATURED">SORT: FEATURED</option>
                <option value="PRICE_ASC">PRICE: LOW TO HIGH</option>
                <option value="PRICE_DESC">PRICE: HIGH TO LOW</option>
                <option value="DROP_NUM">NEWEST FIRST</option>
                <option value="EDITION_RUN">EDITION SIZE</option>
              </select>
              <ChevronDown className="w-3 h-3 text-outside-inkSecondary absolute right-2.5 pointer-events-none" />
            </div>

            {/* Grid Density Switcher (2-col, 3-col, 4-col SVG icons - Reference Image 3) */}
            <div className="hidden sm:flex items-center p-1 rounded-full bg-outside-surface/70 border border-outside-border">
              <button
                onClick={() => setGridColumns(2)}
                aria-label="2 Columns View"
                title="2 Columns Grid"
                className={`p-1.5 rounded-full transition-colors ${
                  gridColumns === 2
                    ? 'bg-outside-elevated text-outside-ink shadow-xs'
                    : 'text-outside-inkSecondary hover:text-outside-ink'
                }`}
              >
                <Grid2X2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setGridColumns(3)}
                aria-label="3 Columns View"
                title="3 Columns Grid"
                className={`p-1.5 rounded-full transition-colors ${
                  gridColumns === 3
                    ? 'bg-outside-elevated text-outside-ink shadow-xs'
                    : 'text-outside-inkSecondary hover:text-outside-ink'
                }`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setGridColumns(4)}
                aria-label="4 Columns View"
                title="4 Columns Grid"
                className={`p-1.5 rounded-full transition-colors ${
                  gridColumns === 4
                    ? 'bg-outside-elevated text-outside-ink shadow-xs'
                    : 'text-outside-inkSecondary hover:text-outside-ink'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
        )}

        {/* Collapsible Secondary Filter Bar (Price Slider & Size Pills) */}
        {isFilterPanelOpen && (
          <div className="p-5 rounded-xl bg-outside-elevated border border-outside-border space-y-4 font-mono text-xs animate-fade-in shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Filter 1: Price Range */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-outside-ink block">
                  PRICE TIER (INR)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'ALL', label: 'ALL PRICES' },
                    { id: 'UNDER_2400', label: '< ₹2,400' },
                    { id: '2400_2500', label: '₹2,400 - ₹2,500' },
                    { id: 'ABOVE_2500', label: '> ₹2,500' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setActivePriceFilter(p.id as PriceFilter)}
                      className={`px-2.5 py-1 text-[11px] rounded transition-colors cursor-pointer ${
                        activePriceFilter === p.id
                          ? 'bg-outside-ink text-outside-elevated font-bold'
                          : 'bg-outside-surface text-outside-inkSecondary hover:text-outside-ink'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter 2: Size Filter */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-outside-ink block">
                  AVAILABLE SIZE
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['ALL', 'XS', 'S', 'M', 'L', 'XL', '2XL'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSizeFilter(s)}
                      className={`px-2.5 py-1 text-[11px] rounded transition-colors cursor-pointer ${
                        selectedSizeFilter === s
                          ? 'bg-outside-ink text-outside-elevated font-bold'
                          : 'bg-outside-surface text-outside-inkSecondary hover:text-outside-ink'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter 3: Color Palette Filter */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-outside-ink block">
                  TEXTILE SHADE
                </span>
                <div className="flex items-center gap-2">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c.id)}
                      title={c.label}
                      className={`relative w-6 h-6 rounded-full transition-transform cursor-pointer border ${c.border} ${
                        selectedColor === c.id ? 'ring-2 ring-outside-accent ring-offset-2 scale-110' : ''
                      }`}
                      style={{ backgroundColor: c.hex === 'transparent' ? '#EDEAE2' : c.hex }}
                    >
                      {c.id === 'ALL' && (
                        <span className="text-[9px] font-bold text-outside-ink block text-center leading-5">
                          *
                        </span>
                      )}
                    </button>
                  ))}
                  <span className="text-[10px] text-outside-inkSecondary ml-1">
                    {COLOR_PALETTE.find((c) => c.id === selectedColor)?.label}
                  </span>
                </div>
              </div>

            </div>

            {/* Reset Filters */}
            <div className="pt-2 border-t border-outside-border/60 flex items-center justify-between text-[11px]">
              <span className="text-outside-inkSecondary">
                Showing {filteredAndSortedDrops.length} of {drops.length} serialized drops
              </span>
              {(activePriceFilter !== 'ALL' || selectedSizeFilter !== 'ALL' || activeFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setActiveFilter('ALL');
                    setActivePriceFilter('ALL');
                    setSelectedSizeFilter('ALL');
                    setSelectedColor('ALL');
                  }}
                  className="text-outside-accent hover:underline font-bold"
                >
                  RESET ALL FILTERS
                </button>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* Product Cards Grid (Matching High-Fashion Reference Standards) */}
        {/* ======================================================== */}
        {filteredAndSortedDrops.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-outside-elevated border border-outside-border space-y-4 font-mono">
            <p className="text-sm font-bold text-outside-ink uppercase">
              No garments match the selected filters.
            </p>
            <p className="text-xs text-outside-inkSecondary">
              Try adjusting your price range or size selection.
            </p>
            <button
              onClick={() => {
                setActiveFilter('ALL');
                setActivePriceFilter('ALL');
                setSelectedSizeFilter('ALL');
              }}
              className="px-6 py-2.5 rounded-full bg-outside-ink text-outside-elevated text-xs font-bold uppercase tracking-wider"
            >
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          <div className={`grid ${gridLayoutClass}`}>
            {displayedDrops.map((drop) => {
              const isLive = drop.status === 'LIVE';
              const isUpcoming = drop.status === 'UPCOMING';
              const isArchived = drop.status === 'ARCHIVED';

              const fit = getSelectedFit(drop);
              const size = getSelectedSize(drop);
              const variant = getSelectedVariant(drop);
              const side = imageSideByDrop[drop.id] || 'front';
              const isBookmarked = isInWishlist(drop.id);

              const currentStock =
                drop.variants?.reduce((acc, v) => acc + (v.currentStock || 0), 0) ?? 0;
              const isSoldOut = isLive && currentStock <= 0;

              const primaryImg = drop.primaryImageUrl;
              const backImg =
                drop.galleryUrls?.[1] || drop.primaryImageUrl.replace('front', 'back');
              const displayImg = side === 'back' && backImg ? backImg : primaryImg;

              const availableFitVariants =
                drop.variants?.filter((v) => v.fit === fit) || [];

              return (
                <SpotlightCard
                  key={drop.id}
                  theme="light"
                  spotlightColor="rgba(184, 35, 40, 0.14)"
                  className="bg-outside-elevated border border-outside-border overflow-hidden flex flex-col justify-between group shadow-editorial hover:border-outside-accent/50 transition-all rounded-2xl !p-0"
                >
                  {/* Visual Image Stage with Image Toggle & Wishlist Heart */}
                  <div
                    onClick={() => setPreviewDrop(drop)}
                    className="relative aspect-[4/5] bg-outside-surface/70 overflow-hidden cursor-pointer group/cloth"
                    title={`Click to preview ${drop.title}`}
                  >
                    <Image
                      src={displayImg}
                      alt={drop.title}
                      fill
                      className="object-contain p-4 sm:p-6 transition-transform duration-500 group-hover/cloth:scale-[1.04]"
                    />

                    {/* Quick Preview Hover Pill (All E-Commerce Standard) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cloth:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                      <span className="px-3.5 py-1.5 rounded-full bg-[#111110]/85 backdrop-blur-xs text-white text-[10px] font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover/cloth:translate-y-0 transition-transform duration-300">
                        <Maximize2 className="w-3 h-3 text-[#B91C1C]" />
                        <span>QUICK VIEW</span>
                      </span>
                    </div>

                    {/* Top Left Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      <span className="px-2.5 py-1 bg-outside-elevated/95 backdrop-blur text-[10px] font-mono font-bold tracking-wider text-outside-ink border border-outside-border shadow-xs uppercase rounded">
                        DROP 00{drop.dropNumber}
                      </span>
                      {drop.id === activeDropId && (
                        <span className="px-2 py-0.5 bg-outside-accent text-white text-[9px] font-mono font-bold tracking-widest uppercase rounded">
                          HEADLINER
                        </span>
                      )}
                    </div>

                    {/* Top Right Badges & Wishlist Heart (Reference Image 2 & 3) */}
                    <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
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
                          THE VAULT
                        </Badge>
                      )}

                      {/* Wishlist Heart Toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(drop.id);
                        }}
                        aria-label="Save to Wishlist"
                        className={`p-2 rounded-full border transition-all cursor-pointer ${
                          isBookmarked
                            ? 'bg-outside-accent text-white border-outside-accent shadow-sm'
                            : 'bg-outside-elevated/90 text-outside-ink border-outside-border hover:bg-outside-elevated hover:text-outside-accent'
                        }`}
                        title={isBookmarked ? 'Saved in Archive' : 'Save Piece'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                      </button>
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
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-outside-elevated/90 hover:bg-outside-elevated backdrop-blur text-[10px] font-mono font-bold text-outside-ink border border-outside-border shadow-xs transition-colors cursor-pointer rounded"
                        >
                          <RotateCcw className="w-3 h-3 text-outside-accent" />
                          <span>{side === 'front' ? 'VIEW BACK' : 'VIEW FRONT'}</span>
                        </button>
                      </div>
                    )}

                    {/* Edition Limit Badge */}
                    <div className="absolute bottom-3 right-3 z-10 px-2 py-0.5 rounded bg-outside-elevated/90 border border-outside-border text-[9px] font-mono text-outside-inkSecondary font-bold">
                      {drop.totalEditionQty} UNITS
                    </div>
                  </div>

                  {/* Card Content & Commerce Controls */}
                  <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Social Proof Stars */}
                      <div className="flex items-center gap-1 text-[11px] font-mono text-outside-inkSecondary mb-1.5">
                        <div className="flex text-amber-500">
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                        </div>
                        <span className="font-bold text-outside-ink ml-1">4.98</span>
                        <span>(142 reviews)</span>
                      </div>

                      <h3
                        onClick={() => setPreviewDrop(drop)}
                        className="text-base font-bold font-display text-outside-ink uppercase group-hover:text-outside-accent transition-colors cursor-pointer"
                        title={`Preview ${drop.title}`}
                      >
                        {drop.title}
                      </h3>
                      <p className="text-xs text-outside-inkSecondary mt-1.5 line-clamp-2 leading-relaxed font-sans">
                        {drop.story || drop.subtitle}
                      </p>
                    </div>

                    {/* Fit and Size Selection on the Card (Reference Image 2 Product Details) */}
                    {isLive && !isSoldOut && (
                      <div className="pt-2 border-t border-outside-border/60 space-y-2">
                        {/* Fit selector */}
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-outside-inkSecondary uppercase">FIT:</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                setSelectedFitByDrop((prev) => ({ ...prev, [drop.id]: 'WOMEN' }))
                              }
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                                fit === 'WOMEN'
                                  ? 'bg-outside-ink text-outside-elevated'
                                  : 'bg-outside-surface text-outside-inkSecondary hover:text-outside-ink'
                              }`}
                            >
                              WOMEN
                            </button>
                            <button
                              onClick={() =>
                                setSelectedFitByDrop((prev) => ({ ...prev, [drop.id]: 'MEN' }))
                              }
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                                fit === 'MEN'
                                  ? 'bg-outside-ink text-outside-elevated'
                                  : 'bg-outside-surface text-outside-inkSecondary hover:text-outside-ink'
                              }`}
                            >
                              MEN
                            </button>
                          </div>
                        </div>

                        {/* Size pills */}
                        <div className="flex items-center gap-1">
                          {availableFitVariants.map((v) => {
                            const isSelected = size === v.size;
                            const isOut = v.currentStock <= 0;
                            return (
                              <button
                                key={v.size}
                                disabled={isOut}
                                onClick={() =>
                                  setSelectedSizeByDrop((prev) => ({ ...prev, [drop.id]: v.size }))
                                }
                                className={`flex-1 py-1.5 min-h-[36px] rounded text-[10px] font-mono font-bold uppercase transition-all cursor-pointer flex items-center justify-center ${
                                  isSelected
                                    ? 'bg-outside-ink text-outside-elevated shadow-xs'
                                    : isOut
                                    ? 'bg-outside-surface/40 text-outside-inkSecondary/40 line-through cursor-not-allowed'
                                    : 'bg-outside-surface text-outside-ink hover:bg-outside-border/80'
                                }`}
                              >
                                {v.size}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Price and Action Buttons */}
                    <div className="pt-3 border-t border-outside-border/80 mt-auto">
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          <div className="text-base font-bold font-mono text-outside-ink">
                            ₹{(drop.pricePaise / 100).toLocaleString('en-IN')}
                          </div>
                          <span className="text-[10px] font-mono text-outside-moss font-bold flex items-center gap-1">
                            <Zap className="w-3 h-3 text-outside-moss" />
                            <span>UPI: ₹{Math.round((drop.pricePaise * 0.95) / 100).toLocaleString('en-IN')}</span>
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-outside-inkSecondary">
                          5% GST INCL
                        </span>
                      </div>

                      {/* Action Triggers */}
                      {isLive && !isSoldOut ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={(e) => handleAddToCart(drop, e)}
                            className="py-2.5 px-3 min-h-[44px] rounded-xl bg-outside-surface hover:bg-outside-surface/80 text-outside-ink font-mono text-xs uppercase font-bold tracking-wider border border-outside-border transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {addedDropId === drop.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-outside-moss" />
                                <span>ADDED</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>+ BAG</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={(e) => handleInstantBuy(drop, e)}
                            className="py-2.5 px-3 min-h-[44px] rounded-xl bg-outside-accent hover:bg-outside-accent/90 text-white font-mono text-xs uppercase font-bold tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                          >
                            <span>BUY NOW</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      ) : isUpcoming ? (
                        <Link
                          href={`#active-drop`}
                          className="w-full py-2.5 min-h-[44px] rounded-xl bg-outside-elevated hover:bg-outside-surface border border-outside-border text-outside-ink font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <Clock className="w-3.5 h-3.5 text-outside-accent" />
                          <span>JOIN WAITLIST</span>
                        </Link>
                      ) : (
                        <Link
                          href={`/vault/${drop.slug}`}
                          className="w-full py-2.5 min-h-[44px] rounded-xl bg-outside-surface hover:bg-outside-surface/80 text-outside-inkSecondary hover:text-outside-ink font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>EXPLORE ARCHIVE</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        )}

        {/* Dynamic Card Pagination / Show More Control */}
        {hasHiddenDrops && (
          <div className="pt-6 sm:pt-8 flex flex-col items-center justify-center gap-3 animate-fade-in">
            <button
              type="button"
              onClick={() => setIsShowingAllCards((prev) => !prev)}
              className="px-8 py-3.5 bg-[#111110] hover:bg-[#B82328] text-white font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-editorial flex items-center gap-3 cursor-pointer rounded hover:scale-102 active:scale-98"
            >
              <span>
                {isShowingAllCards
                  ? `SHOW LESS (${defaultCardCount} EDITIONS)`
                  : `VIEW ALL ${filteredAndSortedDrops.length} EDITIONS`}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isShowingAllCards ? 'rotate-180' : ''
                }`}
              />
            </button>
            <span className="text-[10px] font-mono text-outside-inkSecondary">
              Showing {displayedDrops.length} of {filteredAndSortedDrops.length} serialized drops
            </span>
          </div>
        )}

        {/* E-Commerce Standard Product Preview Screen Modal */}
        <ProductPreviewModal
          drop={previewDrop}
          isOpen={Boolean(previewDrop)}
          onClose={() => setPreviewDrop(null)}
        />

      </div>
    </section>
  );
}

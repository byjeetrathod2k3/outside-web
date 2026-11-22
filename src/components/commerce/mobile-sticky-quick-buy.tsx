'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { ShoppingBag, ArrowRight, Zap, Check } from 'lucide-react';

interface MobileStickyQuickBuyProps {
  drop: any;
  position?: 'bottom_fixed' | 'inline';
}

export function MobileStickyQuickBuy({
  drop,
  position = 'bottom_fixed',
}: MobileStickyQuickBuyProps) {
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const [visible, setVisible] = useState(false);
  const [selectedFit, setSelectedFit] = useState<'WOMEN' | 'MEN'>('WOMEN');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const variants = drop?.variants || [];
  const currentVariant = variants.find(
    (v: any) => v.fit === selectedFit && v.size === selectedSize
  ) || variants[0];

  const isOutOfStock = !currentVariant || currentVariant.currentStock <= 0;

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 450px
      if (window.scrollY > 450) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!drop) return null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentVariant || isOutOfStock) return;

    addItem({
      dropId: drop.id,
      variantId: currentVariant.id,
      title: drop.title,
      fit: selectedFit,
      size: selectedSize,
      quantity: 1,
      unitPricePaise: drop.pricePaise || 240000,
      maxStock: currentVariant.currentStock,
      image: drop.primaryImageUrl || '/images/drops/drop-001-front.jpg',
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
    openCart();
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentVariant || isOutOfStock) return;

    addItem({
      dropId: drop.id,
      variantId: currentVariant.id,
      title: drop.title,
      fit: selectedFit,
      size: selectedSize,
      quantity: 1,
      unitPricePaise: drop.pricePaise || 240000,
      maxStock: currentVariant.currentStock,
      image: drop.primaryImageUrl || '/images/drops/drop-001-front.jpg',
    });

    router.push('/checkout');
  };

  // Determine docking classes based on position setting
  const isTopDocked = position === 'inline';

  const positionClasses = isTopDocked
    ? `fixed top-14 sm:top-16 left-0 right-0 z-40 border-b border-outside-border shadow-md ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`
    : `fixed bottom-0 left-0 right-0 z-40 border-t border-outside-border shadow-2xl pb-safe ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`;

  return (
    <aside
      aria-label="Mobile Sticky Quick Buy"
      className={`md:hidden ${positionClasses} bg-outside-elevated/95 backdrop-blur-md px-3.5 py-2.5 transition-all duration-300 font-mono`}
    >
      <div className="flex items-center justify-between gap-2.5">
        {/* Left: Thumbnail & Price */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded bg-outside-surface relative overflow-hidden flex-shrink-0 border border-outside-border">
            <Image
              src={drop.primaryImageUrl || '/images/drops/drop-001-front.jpg'}
              alt={drop.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-bold text-outside-ink">
                ₹{((drop.pricePaise || 240000) / 100).toLocaleString('en-IN')}
              </span>
              <span className="text-[9px] text-outside-accent font-bold uppercase">
                DROP 00{drop.dropNumber}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-outside-inkSecondary">
              <button
                type="button"
                onClick={() => setSelectedFit(selectedFit === 'WOMEN' ? 'MEN' : 'WOMEN')}
                className="underline uppercase font-bold text-outside-ink hover:text-outside-accent"
              >
                {selectedFit === 'WOMEN' ? 'Women' : 'Men'}
              </button>
              <span>·</span>
              <span className="truncate">
                {isOutOfStock ? (
                  <span className="text-outside-accent font-bold">SOLD OUT</span>
                ) : (
                  `${currentVariant?.currentStock ?? 0} left`
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Size Selector */}
        <div className="flex items-center gap-1">
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="bg-outside-canvas border border-outside-border text-xs px-2 py-1.5 text-outside-ink font-bold focus:border-outside-ink outline-none"
          >
            {['XS', 'S', 'M', 'L', 'XL', '2XL'].map((sz) => {
              const vMatch = variants.find(
                (v: any) => v.fit === selectedFit && v.size === sz
              );
              const disabled = !vMatch || vMatch.currentStock <= 0;
              return (
                <option key={sz} value={sz} disabled={disabled}>
                  {sz} {disabled ? '(X)' : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* Right: Buy Buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="px-2.5 py-1.5 bg-outside-surface border border-outside-border text-outside-ink text-[11px] font-bold uppercase transition-colors hover:border-outside-ink disabled:opacity-40"
            title="Add to Bag"
          >
            {addedSuccess ? (
              <Check className="w-3.5 h-3.5 text-[#2E6F40]" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="px-3.5 py-1.5 bg-outside-accent hover:bg-outside-accent/90 text-white text-[11px] font-bold uppercase tracking-wider transition-colors disabled:opacity-40 shadow-sm flex items-center gap-1"
          >
            <span>{isOutOfStock ? 'CLAIMED' : 'CLAIM'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
}

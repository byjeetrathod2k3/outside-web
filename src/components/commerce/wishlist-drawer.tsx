'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/cart-context';

export function WishlistDrawer({ allDrops = [] }: { allDrops?: any[] }) {
  const { wishlist, isWishlistOpen, closeWishlist, toggleWishlist, addItem, openCart } = useCart();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWishlist();
    };
    if (isWishlistOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isWishlistOpen, closeWishlist]);

  if (!isWishlistOpen) return null;

  const bookmarkedDrops = allDrops.filter((d: any) => wishlist.includes(d.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-mono">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-outside-ink/60 backdrop-blur-xs transition-opacity"
        onClick={closeWishlist}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-outside-elevated border-l border-outside-border flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-outside-border flex items-center justify-between bg-outside-canvas">
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-outside-accent fill-outside-accent" />
              <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-outside-ink font-bold">
                SAVED ARCHIVE ({bookmarkedDrops.length})
              </h2>
            </div>
            <button
              onClick={closeWishlist}
              className="p-2 text-outside-inkSecondary hover:text-outside-ink rounded hover:bg-outside-surface transition-colors cursor-pointer"
              aria-label="Close Wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subheader Notice */}
          <div className="bg-outside-surface/60 p-3.5 border-b border-outside-border text-xs text-outside-inkSecondary flex items-center justify-between">
            <span className="text-[11px]">Capped serialized runs · Save pieces for fast checkout</span>
            <span className="text-[10px] text-outside-accent font-bold uppercase">AHMEDABAD STUDIO</span>
          </div>

          {/* Bookmarked Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {bookmarkedDrops.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-outside-inkSecondary p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-outside-surface flex items-center justify-center border border-outside-border">
                  <Heart className="w-7 h-7 text-outside-inkSecondary/60" />
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-xs uppercase tracking-wider font-bold text-outside-ink">
                    No Saved Garments
                  </p>
                  <p className="text-xs text-outside-inkSecondary max-w-xs font-sans">
                    Tap the heart icon on any drop or lookbook piece to bookmark it in your personal archive.
                  </p>
                </div>
                <button
                  onClick={closeWishlist}
                  className="px-6 py-3 bg-outside-ink text-outside-elevated text-xs font-mono uppercase tracking-[0.2em] font-bold hover:bg-outside-ink/90 cursor-pointer"
                >
                  EXPLORE ACTIVE DROPS
                </button>
              </div>
            ) : (
              bookmarkedDrops.map((drop: any) => {
                const isLive = drop.status === 'LIVE';
                const defaultVariant = drop.variants?.[0];
                return (
                  <div
                    key={drop.id}
                    className="flex gap-4 p-4 bg-outside-surface/40 border border-outside-border rounded-sm hover:border-outside-ink/30 transition-all group"
                  >
                    <div className="relative w-20 h-24 bg-outside-canvas rounded overflow-hidden shrink-0 border border-outside-border">
                      <Image
                        src={drop.primaryImageUrl || '/images/drops/drop-001-front.jpg'}
                        alt={drop.title}
                        fill
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-outside-accent">
                            DROP 00{drop.dropNumber} // {isLive ? 'LIVE' : drop.status}
                          </span>
                          <button
                            onClick={() => toggleWishlist(drop.id)}
                            className="text-outside-inkSecondary hover:text-outside-accent transition-colors p-1"
                            title="Remove from saved"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="text-xs font-bold text-outside-ink uppercase truncate mt-0.5">
                          {drop.title}
                        </h4>
                        <div className="text-xs font-bold text-outside-ink mt-1">
                          ₹{(drop.pricePaise / 100).toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        {isLive && defaultVariant ? (
                          <button
                            onClick={() => {
                              addItem({
                                dropId: drop.id,
                                variantId: defaultVariant.id,
                                title: drop.title,
                                fit: defaultVariant.fit,
                                size: defaultVariant.size,
                                quantity: 1,
                                unitPricePaise: drop.pricePaise,
                                maxStock: defaultVariant.currentStock,
                                image: drop.primaryImageUrl,
                              });
                              closeWishlist();
                              openCart();
                            }}
                            className="px-3 py-1.5 bg-outside-ink text-outside-elevated text-[10px] uppercase font-bold tracking-wider hover:bg-outside-accent transition-colors flex items-center gap-1.5"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>ADD TO BAG</span>
                          </button>
                        ) : null}
                        <Link
                          href={isLive ? '/' : `/vault/${drop.slug}`}
                          onClick={closeWishlist}
                          className="text-[10px] uppercase font-bold text-outside-inkSecondary hover:text-outside-ink hover:underline flex items-center gap-1"
                        >
                          <span>VIEW DETAILS</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

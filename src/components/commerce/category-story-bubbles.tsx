'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

interface CategoryStoryBubblesProps {
  activeFilter?: string;
  onSelectCategory?: (category: string) => void;
  drops?: any[];
}

export function CategoryStoryBubbles({
  activeFilter = 'ALL',
  onSelectCategory,
  drops = [],
}: CategoryStoryBubblesProps) {
  const categories = [
    {
      id: 'ALL',
      label: 'All Pieces',
      sublabel: `${drops.length || 4} Editions`,
      image: '/images/OUTSIDE_icon.png',
      badge: 'EXPLORE',
      isLive: false,
    },
    {
      id: 'LIVE',
      label: 'Drop 001',
      sublabel: 'Better Days',
      image: '/images/drops/drop-001-front.jpg',
      badge: 'LIVE NOW',
      isLive: true,
    },
    {
      id: 'UPCOMING',
      label: 'Drop 002',
      sublabel: 'Botanical',
      image: '/images/drops/drop-002-front.jpg',
      badge: 'NEXT DROP',
      isLive: false,
    },
    {
      id: 'WOMEN',
      label: "Women's Fit",
      sublabel: 'Ergo-Boxy',
      image: '/images/drops/drop-001-front.jpg',
      badge: 'SIGNATURE',
      isLive: false,
    },
    {
      id: 'MEN',
      label: "Men's Fit",
      sublabel: 'Structured',
      image: '/images/drops/drop-003-front.jpg',
      badge: 'RELAXED',
      isLive: false,
    },
    {
      id: 'ARCHIVED',
      label: 'The Vault',
      sublabel: 'Sold Out',
      image: '/images/drops/drop-000-front.jpg',
      badge: 'ARCHIVE',
      isLive: false,
    },
  ];

  const handleClick = (id: string, e: React.MouseEvent) => {
    if (onSelectCategory) {
      e.preventDefault();
      onSelectCategory(id);
    }
  };

  return (
    <div className="w-full py-2 select-none">
      {/* Category Story Carousel: Perfectly Centered, Zero Horizontal/Vertical Clipping */}
      <div className="w-full overflow-x-auto pt-4 pb-3 scrollbar-none no-scrollbar flex">
        <div className="flex items-start justify-start sm:justify-center gap-4 sm:gap-6 md:gap-8 mx-auto px-4 shrink-0 min-w-max">
          {categories.map((cat) => {
            const isSelected = activeFilter === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={(e) => handleClick(cat.id, e)}
                className="flex flex-col items-center shrink-0 group focus:outline-none cursor-pointer w-20 sm:w-24 text-center transition-transform hover:-translate-y-1"
                aria-pressed={isSelected}
                aria-label={`Filter by ${cat.label} (${cat.sublabel})`}
              >
                {/* 1. Unclipped Uniform Circular Avatar */}
                <div
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-200 ${
                    isSelected
                      ? 'ring-2 ring-[#B82328] ring-offset-2 ring-offset-transparent shadow-sm'
                      : cat.isLive
                      ? 'ring-2 ring-[#B82328]/70 ring-offset-2 ring-offset-transparent'
                      : 'ring-1 ring-[#DCD7CC] hover:ring-[#111110]/50'
                  }`}
                >
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-transparent border border-[#DCD7CC]/60 flex items-center justify-center">
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      className={`transition-transform duration-300 group-hover:scale-105 ${
                        cat.id === 'ALL' ? 'object-contain p-3' : 'object-contain p-1.5'
                      }`}
                    />
                  </div>
                </div>

                {/* 2. Micro Status Pill (Placed cleanly below circle, zero border cutting) */}
                <div className="mt-2 mb-1 flex items-center justify-center min-h-[18px]">
                  <span
                    className={`inline-block px-2 py-0.5 text-[8px] sm:text-[9px] font-mono font-bold uppercase rounded-full tracking-wider transition-colors ${
                      isSelected
                        ? 'bg-[#B82328] text-white shadow-xs'
                        : cat.isLive
                        ? 'bg-[#B82328]/15 text-[#B82328] border border-[#B82328]/30'
                        : 'bg-transparent text-[#52504B] border border-[#DCD7CC]'
                    }`}
                  >
                    {cat.badge}
                  </span>
                </div>

                {/* 3. Text Hierarchy: Exact Fixed-Height Container for 100% Locked Baseline Alignment */}
                <div className="w-full flex flex-col items-center justify-start font-mono h-10">
                  <span
                    className={`text-xs block font-bold truncate max-w-full leading-tight transition-colors ${
                      isSelected
                        ? 'text-[#B82328]'
                        : 'text-[#111110] group-hover:text-[#B82328]'
                    }`}
                  >
                    {cat.label}
                  </span>
                  <span className="text-[10px] text-[#6B6862] block leading-tight truncate max-w-full mt-0.5">
                    {cat.sublabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

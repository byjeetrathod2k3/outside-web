'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, Sparkles, Tag, BookOpen } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SEARCHABLE_ITEMS = [
  {
    type: 'drop',
    title: 'DROP 001 // BETTER DAYS AHEAD',
    subtitle: '280 GSM Organic Cotton · Hand-Stitched Floral Embroidery · Limited 250',
    link: '/',
    price: '₹2,400',
    image: '/images/drops/drop-001-front.jpg',
    badge: 'ACTIVE LIVE DROP',
  },
  {
    type: 'drop',
    title: 'DROP 002 // BOTANICAL ARCHITECTURE',
    subtitle: 'Sage Green 280 GSM Heavy Terry · Raw Seedling Edition',
    link: '/vault',
    price: '₹2,400',
    image: '/images/drops/drop-002-front.jpg',
    badge: 'UPCOMING ARCHIVE',
  },
  {
    type: 'drop',
    title: 'DROP 003 // MONOLITH OBSIDIAN',
    subtitle: 'Washed Charcoal Black 300 GSM Ultra-Heavy Cotton',
    link: '/vault',
    price: '₹2,600',
    image: '/images/drops/drop-003-front.jpg',
    badge: 'SOLD OUT / ARCHIVED',
  },
  {
    type: 'page',
    title: 'THE CRAFT // 280 GSM FRENCH TERRY',
    subtitle: 'Combed long-staple organic cotton engineering & tactile loop-back weave',
    link: '/craft',
    badge: 'STUDIO CRAFT',
  },
  {
    type: 'page',
    title: 'FIT ROOM // WOMEN-FIRST ARCHITECTURE',
    subtitle: 'Proportioned shoulder drop, calibrated collar & chest measurements',
    link: '/size-guide',
    badge: 'SIZING MATRIX',
  },
  {
    type: 'page',
    title: 'LOOKBOOK BENTO // EDITORIAL ARCHIVE',
    subtitle: 'Raw concrete styling and Gujarat architecture lookbook photography',
    link: '/lookbook',
    badge: 'EDITORIAL',
  },
  {
    type: 'journal',
    title: 'The Anti-Inventory Thesis: Why We Never Restock',
    subtitle: 'Editorial essay on fast-fashion overproduction and single-drop rarity',
    link: '/journal/why-we-dont-restock-the-anti-inventory-thesis',
    badge: 'JOURNAL',
  },
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? SEARCHABLE_ITEMS.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.badge.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCHABLE_ITEMS;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div
        className="fixed inset-0 bg-[#111110]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-[#FCFBF8] border border-[#DCD7CC] shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 border-b border-[#DCD7CC] flex items-center gap-3 bg-[#EDEAE2]/50">
          <Search className="w-5 h-5 text-[#B82328] flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="SEARCH DROPS, 280 GSM SPECS, FITS, JOURNAL..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base font-mono uppercase tracking-wider text-[#111110] placeholder-[#A8A59D] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#52504B] hover:text-[#111110] p-1 font-mono text-xs uppercase"
            >
              CLEAR
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-[#52504B] hover:text-[#111110] transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-3">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#52504B] flex items-center justify-between pb-1 border-b border-[#DCD7CC]/60">
            <span>{query ? `RESULTS (${results.length})` : 'POPULAR CURATIONS'}</span>
            <span>PRESS ESC TO CLOSE</span>
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-[#52504B] space-y-2">
              <p>NO EDITIONS OR ARTICLES MATCHING &ldquo;{query}&rdquo;</p>
              <p className="text-[10px] text-[#A8A59D]">Try searching for &quot;Better Days&quot;, &quot;Terry&quot;, or &quot;Sizing&quot;.</p>
            </div>
          ) : (
            results.map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                onClick={onClose}
                className="flex items-center gap-4 p-3 bg-[#FCFBF8] hover:bg-[#EDEAE2]/60 border border-[#DCD7CC] transition-all group cursor-pointer"
              >
                {item.image ? (
                  <div className="relative w-12 h-14 bg-[#EDEAE2] flex-shrink-0 border border-[#DCD7CC] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-14 bg-[#EDEAE2] flex-shrink-0 border border-[#DCD7CC] flex items-center justify-center text-[#52504B]">
                    {item.type === 'journal' ? <BookOpen className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#111110] text-[#EDEAE2] font-bold">
                      {item.badge}
                    </span>
                    {item.price && (
                      <span className="text-[10px] font-mono font-bold text-[#B82328]">
                        {item.price}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-mono font-bold text-[#111110] truncate group-hover:text-[#B82328] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#52504B] font-sans truncate">
                    {item.subtitle}
                  </p>
                </div>

                <ArrowRight className="w-4 h-4 text-[#52504B] group-hover:text-[#111110] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#EDEAE2]/80 border-t border-[#DCD7CC] flex items-center justify-between text-[10px] font-mono text-[#52504B]">
          <span>OUTSIDE ARCHIVAL SEARCH INDEX</span>
          <span className="text-[#111110] font-bold">250-PIECE SERIALIZED RELEASES</span>
        </div>
      </div>
    </div>
  );
}

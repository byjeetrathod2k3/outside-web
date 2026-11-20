import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getLocalStore } from '@/lib/db';
import { Lock, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Vault // Permanent Digital Archive',
  description:
    'Explore retired and sold-out limited serialized drops by OUTSIDE. High-density organic cotton editions permanently locked in the archive.',
};

export default function VaultPage() {
  const store = getLocalStore();
  const drops = store.drops;

  return (
    <div className="bg-outside-black text-outside-chalk min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="border-b border-outside-border pb-8 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-outside-crimson uppercase tracking-widest">
            <Lock className="w-4 h-4" />
            <span>PERMANENT PRODUCT VAULT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white uppercase">
            The Archive // Serialized Editions.
          </h1>
          <p className="text-sm text-outside-muted max-w-2xl leading-relaxed">
            Every garment released by OUTSIDE is produced once and never re-issued. This digital archive documents every pattern, fabric spec, and edition run in our history.
          </p>
        </div>

        {/* Drops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {drops.map((drop: any) => {
            const isLive = drop.status === 'LIVE';
            return (
              <div
                key={drop.id}
                className="bg-outside-surface border border-outside-border flex flex-col justify-between overflow-hidden group hover:border-outside-crimson/80 transition-all"
              >
                <div className="relative aspect-[4/5] bg-outside-card overflow-hidden">
                  <Image
                    src={drop.primaryImageUrl || '/images/drops/drop-001-main.jpg'}
                    alt={drop.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-outside-black/85 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider border border-outside-border text-white">
                    DROP 00{drop.dropNumber}
                  </div>
                  <div className="absolute top-3 right-3">
                    {isLive ? (
                      <span className="px-2.5 py-1 bg-outside-crimson text-white text-[10px] font-mono uppercase tracking-wider font-bold">
                        LIVE NOW
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-outside-card border border-outside-border text-outside-muted text-[10px] font-mono uppercase tracking-wider">
                        SEALED IN VAULT
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-display text-white uppercase">
                      {drop.title}
                    </h3>
                    <p className="text-xs text-outside-muted mt-2 line-clamp-3 leading-relaxed">
                      {drop.story}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-outside-border/60 flex items-center justify-between font-mono text-xs">
                    <span className="text-outside-muted">RUN: {drop.totalEditionQty} PIECES</span>
                    <Link
                      href={isLive ? '/' : `/vault/${drop.slug}`}
                      className="text-outside-crimson hover:text-outside-crimsonBright flex items-center gap-1.5 uppercase font-bold text-[11px]"
                    >
                      <span>{isLive ? 'VIEW LIVE DROP' : 'VIEW ARCHIVE'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

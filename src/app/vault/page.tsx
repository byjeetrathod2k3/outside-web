import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getLocalStore, DEFAULT_LAYOUT_CONFIG } from '@/lib/db';
import { Lock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/ui/section-heading';
import SpotlightCard from '@/components/reactbits/SpotlightCard/SpotlightCard';
import CountUp from '@/components/reactbits/CountUp/CountUp';
import DecryptedText from '@/components/reactbits/DecryptedText/DecryptedText';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Vault // Permanent Digital Archive',
  description:
    'Explore retired and active limited serialized drops by OUTSIDE. High-density organic cotton editions engineered in Gujarat.',
};

export default function VaultPage() {
  const store = getLocalStore();
  const drops = store.drops;
  const layout = store.layoutConfig || DEFAULT_LAYOUT_CONFIG;

  const vaultMobile = layout.gridColumns?.vault?.mobile === 2 ? 'grid-cols-2' : 'grid-cols-1';
  const vaultTablet =
    layout.gridColumns?.vault?.tablet === 3
      ? 'md:grid-cols-3'
      : layout.gridColumns?.vault?.tablet === 1
      ? 'md:grid-cols-1'
      : 'md:grid-cols-2';
  const vaultDesktop =
    layout.gridColumns?.vault?.desktop === 4
      ? 'lg:grid-cols-4'
      : layout.gridColumns?.vault?.desktop === 2
      ? 'lg:grid-cols-2'
      : 'lg:grid-cols-3';

  return (
    <div className="bg-outside-canvas text-outside-ink min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="border-b border-outside-border pb-8">
          <SectionHeading
            align="left"
            eyebrow="PERMANENT PRODUCT ARCHIVE"
            title="The Vault // Serialized Drops."
            description="Every garment released by OUTSIDE is produced once and never re-issued. This digital archive documents every pattern, fabric spec, and edition run in our history."
          />
        </div>

        {/* Drops Grid */}
        <div className={`grid ${vaultMobile} ${vaultTablet} ${vaultDesktop} gap-8`}>
          {drops.map((drop: any) => {
            const isLive = drop.status === 'LIVE';
            return (
              <SpotlightCard
                key={drop.id}
                theme="light"
                spotlightColor="rgba(184, 35, 40, 0.14)"
                className="bg-outside-elevated border border-outside-border flex flex-col justify-between overflow-hidden group shadow-editorial hover:border-outside-accent/60 transition-all !p-0"
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
                    <Badge variant={isLive ? 'live' : 'archived'} className="bg-outside-elevated/90">
                      {isLive ? 'LIVE NOW' : drop.status}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold font-display text-outside-ink uppercase">
                      {drop.title}
                    </h3>
                    <p className="text-xs text-outside-inkSecondary mt-2 line-clamp-3 leading-relaxed font-sans">
                      {drop.story}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-outside-border flex items-center justify-between font-mono text-xs">
                    <span className="text-outside-inkSecondary">
                      RUN: <CountUp to={drop.totalEditionQty} duration={1} /> PIECES
                    </span>
                    <Link
                      href={isLive ? '/' : `/vault/${drop.slug}`}
                      className="text-outside-accent hover:underline flex items-center gap-1.5 uppercase font-bold text-[11px]"
                    >
                      <span>{isLive ? 'VIEW LIVE DROP' : 'VIEW ARCHIVE'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getLocalStore } from '@/lib/db';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = getLocalStore();
  const drop = store.drops.find((d: any) => d.slug === slug);
  if (!drop) return { title: 'Drop Not Found' };

  return {
    title: `${drop.title} // The Vault Archive`,
    description: drop.story?.slice(0, 160) || 'Archived limited-edition drop by OUTSIDE.',
  };
}

export default async function VaultDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = getLocalStore();
  const drop = store.drops.find((d: any) => d.slug === slug);

  if (!drop) {
    notFound();
  }

  const isLive = drop.status === 'LIVE';

  return (
    <div className="bg-outside-bg text-outside-text min-h-screen py-16 font-mono">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb Back Link */}
        <Link
          href="/vault"
          className="inline-flex items-center gap-2 text-xs text-outside-muted hover:text-outside-text uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO THE VAULT</span>
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-6 relative aspect-[4/5] bg-white border border-outside-border overflow-hidden shadow-luxury">
            <Image
              src={drop.primaryImageUrl || '/images/drops/drop-001-front.jpg'}
              alt={drop.title}
              fill
              className="object-contain p-2"
            />
            <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 border border-outside-border text-xs text-outside-text font-bold shadow-sm">
              DROP 00{drop.dropNumber} // {drop.status}
            </div>
          </div>

          <div className="md:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs text-outside-crimson uppercase tracking-[0.25em] font-bold">
                {drop.status} ARCHIVE
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-outside-text uppercase">
                {drop.title}
              </h1>
              <p className="text-sm font-sans text-outside-muted leading-relaxed">
                {drop.subtitle}
              </p>
            </div>

            <div className="p-4 bg-white border border-outside-border space-y-2 text-xs shadow-sm">
              <div className="flex justify-between text-outside-muted">
                <span>TOTAL ALLOCATION:</span>
                <span className="text-outside-text font-bold">{drop.totalEditionQty} PIECES</span>
              </div>
              <div className="flex justify-between text-outside-muted">
                <span>ORIGINAL LAUNCH PRICE:</span>
                <span className="text-outside-text font-bold">
                  ₹{(drop.pricePaise / 100).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-outside-muted">
                <span>CURRENT STATUS:</span>
                <span className="text-outside-crimson font-bold">{drop.status}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-[0.2em] text-outside-text font-bold">
                DESIGN MANIFESTO &amp; INSPIRATION
              </h3>
              <p className="text-xs text-outside-textSecondary leading-relaxed font-sans">
                {drop.story}
              </p>
            </div>

            {/* Next Drop Waitlist Callout */}
            <div className="p-6 bg-white border border-outside-crimson/50 space-y-4 shadow-luxury">
              <div className="flex items-center gap-2 text-outside-text text-xs uppercase font-bold">
                <ShieldAlert className="w-4 h-4 text-outside-crimson flex-shrink-0" />
                <span>LIMITED RUN OF {drop.totalEditionQty} PIECES</span>
              </div>
              <p className="text-xs text-outside-muted font-sans">
                Every edition is strictly limited. Join the collector broadcast queue to receive early entry codes for future launches.
              </p>
              <Link
                href="/"
                className="inline-block w-full text-center py-3.5 bg-outside-crimson hover:bg-outside-crimsonHover text-white text-xs uppercase tracking-widest font-bold transition-colors shadow-sm"
              >
                CHECK ACTIVE DROP STATUS &rarr;
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

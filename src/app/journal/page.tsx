import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getLocalStore } from '@/lib/db';
import { ArrowRight, BookOpen } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Outside Journal // Craft, Architecture & Anti-Inventory',
  description:
    'Essays on textile engineering, sustainable rarity, the 280 GSM cotton benchmark, and the rejection of fast-fashion overproduction.',
};

export default function JournalPage() {
  const store = getLocalStore();
  const posts = store.journal || [];

  return (
    <div className="bg-outside-bg text-outside-text min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="border-b border-outside-border pb-8">
          <SectionHeading
            align="left"
            eyebrow="EDITORIAL &amp; PHILOSOPHY"
            title="The Outside Journal."
            description="In-depth perspectives on sustainable luxury, fabric metallurgy, garment pattern geometry, and why we refuse to overproduce."
          />
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {posts.map((post: any) => (
            <article
              key={post.id}
              className="bg-white border border-outside-border overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-luxury-hover hover:border-outside-crimson/50 transition-all"
            >
              <div className="relative aspect-[16/9] bg-outside-cardSubtle overflow-hidden">
                <Image
                  src={post.coverImageUrl || '/images/journal/journal-01.jpg'}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3">
                  <Badge variant="default" className="bg-white/90">
                    STUDIO ARCHIVE
                  </Badge>
                </div>
              </div>

              <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono text-outside-muted uppercase tracking-wider mb-2 font-semibold">
                    BY {post.authorName} · 4 MIN READ
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-outside-text uppercase tracking-tight group-hover:text-outside-crimson transition-colors">
                    <Link href={`/journal/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-xs text-outside-muted mt-3 leading-relaxed font-sans line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-outside-border">
                  <Link
                    href={`/journal/${post.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-mono text-outside-crimson hover:underline uppercase tracking-wider font-bold"
                  >
                    <span>READ ESSAY</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}

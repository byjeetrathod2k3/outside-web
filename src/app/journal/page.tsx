import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getLocalStore } from '@/lib/db';
import { ArrowRight, BookOpen } from 'lucide-react';
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
    <div className="bg-outside-black text-outside-chalk min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="border-b border-outside-border pb-8 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-outside-crimson uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            <span>EDITORIAL &amp; PHILOSOPHY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white uppercase">
            The Outside Journal.
          </h1>
          <p className="text-sm text-outside-muted max-w-2xl leading-relaxed">
            In-depth perspectives on sustainable luxury, fabric metallurgy, garment pattern geometry, and why we refuse to overproduce.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {posts.map((post: any) => (
            <article
              key={post.id}
              className="bg-outside-surface border border-outside-border overflow-hidden flex flex-col justify-between group hover:border-outside-crimson/80 transition-colors"
            >
              <div className="relative aspect-[16/9] bg-outside-card overflow-hidden">
                <Image
                  src={post.coverImageUrl || '/images/journal/journal-01.jpg'}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 bg-outside-black/90 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider border border-outside-border text-outside-chalkDim">
                  STUDIO ARCHIVE
                </div>
              </div>

              <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono text-outside-muted uppercase tracking-wider mb-2">
                    BY {post.authorName} · 4 MIN READ
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-white uppercase tracking-tight group-hover:text-outside-crimson transition-colors">
                    <Link href={`/journal/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-xs text-outside-muted mt-3 leading-relaxed font-sans line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-outside-border/60">
                  <Link
                    href={`/journal/${post.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-mono text-outside-crimson hover:text-outside-crimsonBright uppercase tracking-wider font-bold"
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

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getLocalStore } from '@/lib/db';
import { ArrowLeft, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export function generateStaticParams() {
  const store = getLocalStore();
  return (store.journal || []).map((post: any) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = getLocalStore();
  const post = store.journal.find((p: any) => p.slug === slug);
  if (!post) return { title: 'Essay Not Found' };

  return {
    title: `${post.title} // The Outside Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.authorName],
    },
  };
}

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = getLocalStore();
  const post = store.journal.find((p: any) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Schema.org Article JSON-LD (AEO/GEO optimization)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: `https://www.outside.in${post.coverImageUrl || '/images/journal/journal-01.jpg'}`,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'OUTSIDE APPAREL STUDIO PVT LTD',
      url: 'https://www.outside.in',
    },
    publisher: {
      '@type': 'Organization',
      name: 'OUTSIDE',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.outside.in/images/OUTSIDE_logo.jpg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.outside.in/journal/${post.slug}`,
    },
  };

  return (
    <article className="bg-outside-bg text-outside-text min-h-screen py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back navigation */}
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-xs font-mono text-outside-muted hover:text-outside-text uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO THE JOURNAL</span>
        </Link>

        {/* Editorial Header */}
        <div className="space-y-4 border-b border-outside-border pb-8">
          <div className="flex items-center gap-4 text-xs font-mono text-outside-crimson uppercase tracking-widest font-bold">
            <span>BY {post.authorName}</span>
            <span className="text-outside-border">/</span>
            <span className="flex items-center gap-1 text-outside-muted font-normal">
              <Clock className="w-3.5 h-3.5" /> 4 MIN READ
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-outside-text uppercase">
            {post.title}
          </h1>

          <p className="text-base font-sans text-outside-textSecondary leading-relaxed italic border-l-2 border-outside-crimson pl-4">
            {post.excerpt}
          </p>
        </div>

        {/* Lead Image */}
        <div className="relative aspect-[16/9] w-full bg-white border border-outside-border overflow-hidden shadow-luxury">
          <Image
            src={post.coverImageUrl || '/images/journal/journal-01.jpg'}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Essay Body */}
        <div className="prose prose-stone max-w-none text-outside-text text-sm sm:text-base leading-relaxed space-y-6 font-sans">
          {post.body.split('\n\n').map((paragraph: string, i: number) => (
            <p key={i} className="text-outside-textSecondary">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Author Bio Box (E-E-A-T) */}
        <div className="pt-10 border-t border-outside-border">
          <div className="p-6 bg-white border border-outside-border flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-outside-crimson flex items-center justify-center font-bold text-white font-mono flex-shrink-0">
              OS
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-mono uppercase tracking-wider text-outside-text font-bold">
                STUDIO OUTSIDE EDITORIAL TEAM
              </h4>
              <p className="text-xs text-outside-muted font-sans leading-relaxed">
                Written by the patternmakers, textile engineers, and founders at OUTSIDE Apparel Studio in Ahmedabad, Gujarat. Published under the open Anti-Inventory Manifesto.
              </p>
            </div>
          </div>
        </div>

      </div>
    </article>
  );
}

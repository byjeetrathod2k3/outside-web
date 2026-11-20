import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getLocalStore } from '@/lib/db';
import { ArrowLeft, ShieldAlert, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';
import { JsonLd, generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo';
import { ViralShare } from '@/components/commerce/viral-share';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = getLocalStore();
  const drop = store.drops.find((d: any) => d.slug === slug);
  if (!drop) return { title: 'Drop Not Found | OUTSIDE' };

  const url = `https://www.outside.in/vault/${drop.slug}`;
  const ogImageUrl = `https://www.outside.in/api/og?drop=${String(drop.dropNumber).padStart(3, '0')}`;

  return {
    title: `${drop.title} (DROP 00${drop.dropNumber}) // Permanent Vault Archive | OUTSIDE`,
    description: drop.subtitle || drop.story?.slice(0, 160) || 'Archived limited-edition drop by OUTSIDE.',
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${drop.title} // OUTSIDE Permanent Vault`,
      description: drop.subtitle || 'Limited-edition 280 GSM heavyweight cotton drop by OUTSIDE Ahmedabad.',
      url,
      siteName: 'OUTSIDE // Wear Your Story',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${drop.title} - Limited Edition Vault Archive`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${drop.title} // OUTSIDE Permanent Vault`,
      description: drop.subtitle || 'Limited-edition 280 GSM heavyweight cotton drop by OUTSIDE Ahmedabad.',
      images: [ogImageUrl],
    },
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

  const productSchema = generateProductSchema(drop, isLive);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://www.outside.in' },
    { name: 'The Vault', url: 'https://www.outside.in/vault' },
    { name: drop.title, url: `https://www.outside.in/vault/${drop.slug}` },
  ]);

  return (
    <div className="bg-outside-bg text-outside-text min-h-screen py-12 md:py-16 font-mono">
      {/* 2026 E-Commerce Schema Injection */}
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-outside-muted uppercase tracking-wider">
          <Link
            href="/vault"
            className="inline-flex items-center gap-1.5 hover:text-outside-text transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO THE VAULT</span>
          </Link>
          <span className="text-outside-border">/</span>
          <span className="text-outside-text font-bold">DROP 00{drop.dropNumber}</span>
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="md:col-span-6 relative aspect-[4/5] bg-white border border-outside-border overflow-hidden shadow-luxury">
            <Image
              src={drop.primaryImageUrl || '/images/drops/drop-001-front.jpg'}
              alt={`${drop.title} - OUTSIDE Limited Edition`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-4"
            />
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 border border-outside-border text-xs text-outside-text font-bold shadow-sm">
              DROP 00{drop.dropNumber} // {drop.status}
            </div>
            {isLive ? (
              <div className="absolute top-4 right-4 bg-outside-moss/10 text-outside-moss border border-outside-moss/30 px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider">
                ACTIVE LAUNCH
              </div>
            ) : (
              <div className="absolute top-4 right-4 bg-outside-crimson/10 text-outside-crimson border border-outside-crimson/30 px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider">
                ARCHIVED / SOLD OUT
              </div>
            )}
          </div>

          <div className="md:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-outside-crimson uppercase tracking-[0.25em] font-bold">
                  {drop.status} ARCHIVE
                </span>
                <span className="text-outside-border">•</span>
                <span className="text-[11px] text-outside-muted uppercase tracking-wider">
                  AHMEDABAD, GUJARAT
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-outside-text uppercase">
                {drop.title}
              </h1>
              <p className="text-sm font-sans text-outside-muted leading-relaxed">
                {drop.subtitle}
              </p>
            </div>

            <div className="p-4 bg-white border border-outside-border space-y-2.5 text-xs shadow-sm">
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
                <span>FABRIC SPECIFICATION:</span>
                <span className="text-outside-text font-bold">280 GSM COMBED COTTON</span>
              </div>
              <div className="flex justify-between text-outside-muted">
                <span>CURRENT VAULT STATUS:</span>
                <span className={isLive ? "text-outside-moss font-bold" : "text-outside-crimson font-bold"}>
                  {isLive ? "AVAILABLE NOW" : "RESERVE VAULT ARCHIVED"}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-xs uppercase tracking-[0.2em] text-outside-text font-bold">
                DESIGN MANIFESTO &amp; ARTWORK INSPIRATION
              </h3>
              <p className="text-xs text-outside-textSecondary leading-relaxed font-sans bg-outside-surface/60 p-3.5 border border-outside-border">
                {drop.story}
              </p>
            </div>

            {/* Social Sharing & Viral Discovery */}
            <div className="pt-2">
              <ViralShare
                title={drop.title}
                dropNumber={drop.dropNumber}
                url={`https://www.outside.in/vault/${drop.slug}`}
              />
            </div>

            {/* Next Drop Waitlist Callout */}
            <div className="p-6 bg-white border border-outside-crimson/50 space-y-4 shadow-luxury">
              <div className="flex items-center gap-2 text-outside-text text-xs uppercase font-bold">
                <ShieldAlert className="w-4 h-4 text-outside-crimson flex-shrink-0" />
                <span>LIMITED RUN OF {drop.totalEditionQty} PIECES — NEVER REPRINTED</span>
              </div>
              <p className="text-xs text-outside-muted font-sans leading-relaxed">
                Every OUTSIDE edition is strictly limited. Once sold out, production molds are retired. Join the collector waitlist to receive priority access tokens for the next drop.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-outside-crimson hover:bg-outside-crimsonHover text-white text-xs uppercase tracking-widest font-bold transition-colors shadow-sm"
              >
                <span>{isLive ? "ORDER ACTIVE DROP NOW" : "EXPLORE ACTIVE DROP ON HOMEPAGE"}</span>
                <Sparkles className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

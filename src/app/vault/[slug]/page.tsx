import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getLocalStore } from '@/lib/db';
import { ArrowLeft, ShieldAlert, Sparkles, Layers } from 'lucide-react';
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

  const gallery: string[] = drop.galleryUrls && drop.galleryUrls.length > 0
    ? drop.galleryUrls
    : [drop.primaryImageUrl || '/images/drops/drop-001-front.jpg'];

  return (
    <div className="bg-outside-canvas text-outside-ink min-h-screen py-12 md:py-16 font-mono">
      {/* 2026 E-Commerce Schema Injection */}
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-outside-inkSecondary uppercase tracking-wider">
          <Link
            href="/vault"
            className="inline-flex items-center gap-1.5 hover:text-outside-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>THE VAULT</span>
          </Link>
          <span>/</span>
          <span className="text-outside-ink font-bold">DROP 00{drop.dropNumber}</span>
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Multi-Angle Gallery */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative aspect-[4/5] bg-outside-surface border border-outside-border overflow-hidden shadow-luxury">
              <Image
                src={drop.primaryImageUrl || gallery[0]}
                alt={`${drop.title} - OUTSIDE Limited Edition`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-4"
              />
              <div className="absolute top-4 left-4 bg-outside-elevated/95 backdrop-blur-sm px-3 py-1.5 border border-outside-border text-xs text-outside-ink font-bold shadow-xs">
                DROP 00{drop.dropNumber} // {drop.status}
              </div>
              {isLive ? (
                <div className="absolute top-4 right-4 bg-outside-moss/10 text-outside-moss border border-outside-moss/30 px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider">
                  ACTIVE LAUNCH
                </div>
              ) : (
                <div className="absolute top-4 right-4 bg-outside-accent/10 text-outside-accent border border-outside-accent/30 px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider">
                  ARCHIVED / SOLD OUT
                </div>
              )}
            </div>

            {/* Gallery Multi-View Thumbnails (Front, Back, Details) */}
            {gallery.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {gallery.map((imgUrl: string, idx: number) => (
                  <div
                    key={idx}
                    className="relative aspect-[4/5] bg-outside-surface border border-outside-border overflow-hidden group hover:border-outside-ink transition-all"
                  >
                    <Image
                      src={imgUrl}
                      alt={`${drop.title} - View 0${idx + 1}`}
                      fill
                      className="object-contain p-1 group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-outside-elevated/90 px-1.5 py-0.5 border border-outside-border text-outside-ink font-bold">
                      0{idx + 1} // {idx === 0 ? 'FRONT' : idx === 1 ? 'BACK' : 'DETAIL'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Spec Sheet & Design Manifesto */}
          <div className="md:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-outside-accent uppercase tracking-[0.25em] font-bold">
                  {drop.status} ARCHIVE
                </span>
                <span className="text-outside-border">•</span>
                <span className="text-[11px] text-outside-inkSecondary uppercase tracking-wider">
                  AHMEDABAD, GUJARAT (24)
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-outside-ink uppercase">
                {drop.title}
              </h1>
              <p className="text-sm font-sans text-outside-inkSecondary leading-relaxed">
                {drop.subtitle}
              </p>
            </div>

            {/* Specification Card */}
            <div className="p-4 bg-outside-elevated border border-outside-border space-y-2.5 text-xs shadow-xs font-mono">
              <div className="flex justify-between text-outside-inkSecondary">
                <span>TOTAL ALLOCATION:</span>
                <span className="text-outside-ink font-bold">{drop.totalEditionQty} PIECES (SERIALIZED)</span>
              </div>
              <div className="flex justify-between text-outside-inkSecondary">
                <span>ORIGINAL LAUNCH PRICE:</span>
                <span className="text-outside-ink font-bold">
                  ₹{(drop.pricePaise / 100).toLocaleString('en-IN')} (5% GST Inc.)
                </span>
              </div>
              <div className="flex justify-between text-outside-inkSecondary">
                <span>FABRIC SPECIFICATION:</span>
                <span className="text-outside-ink font-bold">280 GSM COMBED ORGANIC COTTON</span>
              </div>
              <div className="flex justify-between text-outside-inkSecondary">
                <span>CURRENT VAULT STATUS:</span>
                <span className={isLive ? "text-outside-moss font-bold" : "text-outside-accent font-bold"}>
                  {isLive ? "AVAILABLE NOW" : "RESERVE VAULT RETIRED"}
                </span>
              </div>
            </div>

            {/* Design Manifesto */}
            <div className="space-y-2.5">
              <h3 className="text-xs uppercase tracking-[0.2em] text-outside-ink font-bold flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-outside-accent" />
                <span>DESIGN MANIFESTO &amp; ARTWORK INSPIRATION</span>
              </h3>
              <p className="text-xs text-outside-inkSecondary leading-relaxed font-sans bg-outside-surface/60 p-4 border border-outside-border">
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
            <div className="p-6 bg-outside-elevated border border-outside-border space-y-4 shadow-editorial">
              <div className="flex items-center gap-2 text-outside-ink text-xs uppercase font-bold">
                <ShieldAlert className="w-4 h-4 text-outside-accent flex-shrink-0" />
                <span>LIMITED RUN OF {drop.totalEditionQty} PIECES — NEVER REPRINTED</span>
              </div>
              <p className="text-xs text-outside-inkSecondary font-sans leading-relaxed">
                Every OUTSIDE edition is strictly limited. Once sold out, production patterns are retired to The Vault forever.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-outside-ink hover:bg-outside-ink/90 text-outside-elevated text-xs uppercase tracking-widest font-bold transition-colors shadow-sm"
              >
                <span>{isLive ? "CLAIM ACTIVE DROP PIECE NOW" : "EXPLORE ACTIVE DROP ON HOMEPAGE"}</span>
                <Sparkles className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
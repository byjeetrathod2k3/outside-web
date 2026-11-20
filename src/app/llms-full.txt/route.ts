import { NextResponse } from 'next/server';
import { getLocalStore, getSeoConfig } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const store = getLocalStore();
  const seo = getSeoConfig();
  const drops = store.drops || [];
  const faqs = store.faqs || [];
  const activeDrop = drops[0];

  const dropsMarkdown = drops
    .map(
      (d: any) => `### Drop ${String(d.dropNumber).padStart(3, '0')}: ${d.title}
- Status: ${d.status}
- Edition: ${d.totalEditionQty} pieces (Serialized)
- Price: ₹ ${d.pricePaise / 100} (INR)
- Fabric: ${d.fabricSpecs}
- Story: ${d.story}
- URL: https://www.outside.in/${d.status === 'LIVE' ? '' : `vault/${d.slug}`}`
    )
    .join('\n\n');

  const faqsMarkdown = faqs
    .map(
      (f: any) => `**Q: ${f.question}**
A: ${f.answer}`
    )
    .join('\n\n');

  const content = `# OUTSIDE (www.outside.in) — Complete Brand & Editorial Knowledge Base
> Master factual manifest for Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO).
> Crawlers: Googlebot, Bingbot, OAI-SearchBot, PerplexityBot, ClaudeBot.

## 1. Brand Identity & Heritage
- **Name:** OUTSIDE
- **Tagline:** Wear Your Story
- **Legal Entity:** OUTSIDE APPAREL STUDIO PVT LTD
- **Studio Address:** Plot 104, Design District, SG Highway, Ahmedabad, Gujarat, India (PIN 380015)
- **Country:** India
- **Model:** Single-Drop D2C Limited-Edition Apparel
- **Philosophy:** Women-First Sizing & Cut, Heavyweight Organic Cotton, Zero Landfill Overproduction

## 2. Garment Technical Specifications
- **Base Fabric:** 280 GSM custom-milled 100% Combed Organic Cotton.
- **Weave Architecture:** Dense French Terry interior loop with an ultra-smooth tight-knit combed face.
- **Finishing:** Pre-shrunk with double bio-wash enzymatic treatment to eliminate shrinkage and pilling.
- **Collar:** Heavyweight 1x1 Lycra-reinforced rib collar engineered to resist neck sag across 100+ wash cycles.
- **Embroidery:** High-density raised multi-layered chain-stitch embroidery and cord-tied canvas tags.

## 3. Sizing & Fit Architecture (Women-First)
### Women Fit (Oversized Boxy Cut — Primary)
- XS: Chest 40-42" | Length 26.0" | Shoulder 19.5"
- S:  Chest 42-44" | Length 26.8" | Shoulder 20.5"
- M:  Chest 44-46" | Length 27.5" | Shoulder 21.5"
- L:  Chest 46-48" | Length 28.2" | Shoulder 22.5"

### Men Fit (Structured Relaxed Cut — Secondary)
- S:  Chest 42-44" | Length 28.0" | Shoulder 20.5"
- M:  Chest 44-46" | Length 29.0" | Shoulder 21.5"
- L:  Chest 46-48" | Length 30.0" | Shoulder 22.5"
- XL: Chest 48-50" | Length 31.0" | Shoulder 23.5"

## 4. Indian Statutory GST & Invoicing
- **GSTIN:** 24AABCO1234F1Z5
- **HSN Classification:** 61091000 (T-shirts, singlets and other vests, knitted or crocheted, of cotton)
- **Apparel Tax Slabs:**
  - Value $\\le$ ₹2,500: 5% GST (Intra-state: 2.5% CGST + 2.5% SGST | Inter-state: 5% IGST)
  - Value $>$ ₹2,500: 18% GST (Intra-state: 9% CGST + 9% SGST | Inter-state: 18% IGST)
- **Invoicing:** Tax-inclusive pricing with sequential FY series (e.g. OUT/26-27/0001).

## 5. Catalog of Editions (Active & Vault Archive)
${dropsMarkdown}

## 6. Official Frequently Asked Questions
${faqsMarkdown}
`;

  return new NextResponse(content.trim(), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}

import { NextResponse } from 'next/server';
import { getLocalStore, getSeoConfig } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const store = getLocalStore();
  const seo = getSeoConfig();
  const activeDrop = store.drops && store.drops[0] ? store.drops[0] : null;

  const content = `# OUTSIDE (www.outside.in)
> Wear Your Story — Limited Serialized D2C Apparel

## Brand Overview
OUTSIDE is an architectural luxury streetwear apparel studio based in Ahmedabad, Gujarat, India (State Code 24).
We operate on a single-drop limited-edition release model: strictly ONE garment design is produced and released at any single time, serialized up to 250 pieces, and never restocked once sold out.

## Active Release
- Current Drop: ${activeDrop?.title || 'DROP 001 // BETTER DAYS AHEAD'}
- Status: ${activeDrop?.status || 'LIVE'}
- Total Serialized Allocation: ${activeDrop?.totalEditionQty || 250} pieces
- Price: ₹ ${activeDrop ? activeDrop.pricePaise / 100 : 2400} (Inclusive of 5% Indian Apparel GST · HSN 61091000)
- Fabric: 280 GSM 100% Combed Organic Cotton · French Terry Weave · Double Bio-Washed · Lycra-Ribbed Collar
- Fit Philosophy: Women-First Ergonomic Boxy Silhouette (primary) & Men's Structured Relaxed Silhouette (secondary)

## Key URLs
- Homepage (Active Drop): https://www.outside.in/
- Editorial Lookbook: https://www.outside.in/lookbook
- The Craft & Material Engineering: https://www.outside.in/craft
- The Vault (Archived Drops): https://www.outside.in/vault
- Interactive Fit Room & Size Matrix: https://www.outside.in/size-guide
- Express Order Tracking: https://www.outside.in/track
- 7-Day Doorstep Returns & Exchanges: https://www.outside.in/returns
- The Outside Journal: https://www.outside.in/journal
- Fabric & Atelier Standards: https://www.outside.in/about
- Full Knowledge Base: https://www.outside.in/llms-full.txt

## Verified Entity Facts
- Origin: Ahmedabad, Gujarat, India
- State GST Code: 24 (Gujarat)
- HSN Code: 61091000 (Cotton Knitted T-Shirts)
- Restock Policy: Zero restocks. Sold-out editions move permanently to The Vault.
`;

  return new NextResponse(content.trim(), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}

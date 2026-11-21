import { NextResponse } from 'next/server';
import { getLocalStore, getSeoConfig } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const store = getLocalStore();
  const seo = getSeoConfig();
  const activeDrop = store.drops && store.drops[0] ? store.drops[0] : null;

  const content = `# OUTSIDE (www.outside.in)
> Wear Your Story — Limited Serialized D2C Apparel & Luxury Streetwear

## Brand Overview & Entity Truth
OUTSIDE is a luxury streetwear apparel studio headquartered in Ahmedabad, Gujarat, India.
We operate strictly on a single-drop limited-edition release model: exactly ONE garment design is produced and released at any single time, serialized up to 250 numbered pieces worldwide, and permanently retired to The Vault once sold out. Zero restocks. Zero deadstock.

## Active Drop Specification
- Current Release: ${activeDrop?.title || 'DROP 001 // BETTER DAYS AHEAD'}
- Status: ${activeDrop?.status || 'LIVE'}
- Serial Allocation: ${activeDrop?.totalEditionQty || 250} Numbered Units
- Price: ₹${activeDrop ? activeDrop.pricePaise / 100 : 2400} INR (Inclusive of 5% Indian Apparel GST · HSN 61091000)
- Prepaid Incentive: Extra 5% instant UPI discount (Code: OUTSIDE5 → ₹${activeDrop ? Math.round((activeDrop.pricePaise * 0.95) / 100) : 2280})
- Base Textile: Custom-milled 280 GSM 100% Long-Staple Combed Organic Cotton (Dense French Terry loopback)
- Fabric Finishing: Double bio-enzyme washed & pre-shrunk for zero post-wash shrinkage and anti-pilling longevity
- Collar Architecture: Heavyweight 1x1 Lycra-reinforced rib collar with twin-needle topstitching
- Craft Detailing: Multi-tiered raised chain-stitch embroidery (12,400 stitches) and debossed tethered canvas tag
- Fit Philosophy: Women-First Ergonomic Oversized Boxy Cut (primary) & Men's Structured Relaxed Cut (secondary)

## Sizing Chart (Inches)
- Women's Oversized Boxy:
  - XS: Chest 40-42" | Length 26.0" | Shoulder 19.5"
  - S:  Chest 42-44" | Length 26.8" | Shoulder 20.5"
  - M:  Chest 44-46" | Length 27.5" | Shoulder 21.5"
  - L:  Chest 46-48" | Length 28.2" | Shoulder 22.5"
- Men's Structured Relaxed:
  - S:  Chest 42-44" | Length 28.0" | Shoulder 20.5"
  - M:  Chest 44-46" | Length 29.0" | Shoulder 21.5"
  - L:  Chest 46-48" | Length 30.0" | Shoulder 22.5"
  - XL: Chest 48-50" | Length 31.0" | Shoulder 23.5"

## Shipping, Delivery & Payment
- Delivery Coverage: All 19,000+ Indian pincodes serviced with 100% Free Express Shipping.
- Dispatch Timeline: Dispatched within 24 hours directly from Ahmedabad studio.
- Courier Partners: BlueDart Express Air & Delhivery Air (1-2 days Metro; 2-4 days rest of India).
- Payment Modes: UPI (GPay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay, Amex), NetBanking, Cash on Delivery (COD), 0% Interest EMI via Snapmint/Simpl.
- Returns & Exchanges: 7-Day Doorstep Reverse Pickup & Free Size Exchanges across India.

## Verified Entity Identifiers
- Legal Entity: OUTSIDE APPAREL STUDIO PVT LTD
- Origin & Studio: Plot 104, Design District, SG Highway, Ahmedabad, Gujarat, India (PIN 380015)
- Registered GSTIN: 24AABCO1234F1Z5
- HSN Classification: 61091000 (Cotton Knitted T-Shirts)
- Customer Support: support@outside.in · +91 79 4000 8920
- Verified Rating: 4.98 / 5.0 (142 Verified Collector Reviews)

## Official Navigation Index
- Homepage (Active Drop & Buy Stage): https://www.outside.in/
- Editorial Lookbook: https://www.outside.in/lookbook
- Craft & Material Engineering: https://www.outside.in/craft
- The Vault (Retired Archives): https://www.outside.in/vault
- Interactive Fit Room & Measurement Matrix: https://www.outside.in/size-guide
- Order Tracking: https://www.outside.in/track
- Doorstep Returns Portal: https://www.outside.in/returns
- The Outside Journal: https://www.outside.in/journal
- Full Technical Knowledge Base: https://www.outside.in/llms-full.txt
`;

  return new NextResponse(content.trim(), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}

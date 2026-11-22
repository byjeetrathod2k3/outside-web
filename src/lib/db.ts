import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

// ==========================================
// SEED DATA & RESILIENT REPOSITORY (LIGHT THEME)
// ==========================================
export interface GarmentHotspot {
  id: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  zoomLevel: number; // 1.5, 2.0, 2.5, 3.0, 3.5
  title: string;
  tag: string;
  description: string;
  spec: string;
}

export const DEFAULT_HOTSPOTS: GarmentHotspot[] = [
  {
    id: 'hs_embroidery',
    xPercent: 54,
    yPercent: 27,
    zoomLevel: 2.8,
    title: 'Raised Chain-Stitch Floral Embroidery',
    tag: 'HAND-CRAFTED EMBROIDERY (MADE IN INDIA)',
    description:
      'Multi-threaded chocolate umber and rose-pink botanical bloom with cursive "Better Days Ahead" calligraphy. Hand-finished in our Ahmedabad studio to resist wash distortion.',
    spec: 'High-Density Rayon Thread · 12,400 Stitches',
  },
  {
    id: 'hs_fabric',
    xPercent: 30,
    yPercent: 55,
    zoomLevel: 2.5,
    title: '280 GSM Combed Organic French Terry',
    tag: '100% PURE ORGANIC INDIAN COTTON',
    description:
      'Substantial heavyweight in Natural Raw Unbleached Ivory. Double bio-washed for zero shrinkage with a tactile soft-touch interior.',
    spec: '280 GSM · 100% Organic Combed Cotton',
  },
  {
    id: 'hs_stem',
    xPercent: 68,
    yPercent: 51,
    zoomLevel: 3.0,
    title: 'Continuous Braided Stemwork & Cord',
    tag: 'HAND-CRAFTED BOTANICAL DETAIL',
    description:
      'Elongated vertical braided botanical stem anchoring downwards from the flower into the hem, creating architectural visual flow across the torso.',
    spec: 'Braided Rayon Cord · Double-Reinforced Anchor Stitches',
  },
  {
    id: 'hs_tag',
    xPercent: 64,
    yPercent: 76,
    zoomLevel: 2.5,
    title: 'Tethered Canvas Tag Inscription',
    tag: 'LIMITED EDITION SIGNATURE DETAIL',
    description:
      'Elongated knotted dimensional cord anchored into a raw-edge canvas tag debossed with "for a kinder you" and subtle heart emblem.',
    spec: 'Raw Canvas · Double-Reinforced Knot Stitches',
  },
  {
    id: 'hs_sleeve',
    xPercent: 88,
    yPercent: 42,
    zoomLevel: 2.6,
    title: 'Embroidered Sleeve Brand Emblem',
    tag: 'GENUINE OUTSIDE INDIA EMBLEM',
    description:
      'High-definition OUTSIDE obsidian carbon wordmark enclosing the crimson coiled serpent emblem on the left sleeve hem.',
    spec: 'Embroidered Patchwork · Precision Merrow Border',
  },
];

export const INITIAL_DROP = {
  id: 'drop_001',
  dropNumber: 1,
  slug: 'drop-001-better-days-ahead',
  title: 'DROP 001 // BETTER DAYS AHEAD',
  subtitle: '280 GSM Heavyweight Organic Cotton · Hand-Stitched Floral Embroidery · Serialized Edition of 250',
  story: `Engineered in our Ahmedabad studio, DROP 001 explores the juxtaposition between brutalist architectural boxy tailoring and tactile human warmth. Crafted from custom-milled 280 GSM organic combed cotton in a warm unbleached ivory hue, featuring intricate multi-layered floral embroidery ("Better Days Ahead"), an elongated knotted stem tethered to a stitched canvas tag reading "for a kinder you", the signature OUTSIDE logo embroidered on the left sleeve, and the back typographic manifesto: "SAME GIRL BRIGHTER DAYS". Strictly limited to 250 serialized pieces worldwide.`,
  fabricSpecs: '280 GSM 100% Combed Organic Cotton · French Terry Weave · Pre-Shrunk & Double Bio-Washed · Hand-Finished Floral Embroidery · Lycra-Ribbed Collar · Made in Gujarat, India',
  pricePaise: 240000, // ₹2,400 (falls under 5% GST slab)
  currency: 'INR',
  totalEditionQty: 250,
  status: 'LIVE' as const,
  launchAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  soldOutAt: null as string | null,
  primaryImageUrl: '/images/drops/drop-001-front.jpg',
  galleryUrls: [
    '/images/drops/drop-001-front.jpg',
    '/images/drops/drop-001-back.jpg',
    '/images/drops/drop-001-detail1.jpg',
    '/images/drops/drop-001-detail2.jpg',
  ],
  hotspots: DEFAULT_HOTSPOTS,
  isFeatured: true,
  seoTitle: 'DROP 001: Better Days Ahead T-Shirt — OUTSIDE India',
  seoDescription: 'Limited to 250 serialized pieces. 280 GSM heavyweight combed cotton oversized t-shirt with tactile floral embroidery. Wear your story.',
  canonicalUrl: 'https://www.outside.in',
  ogImageUrl: '/images/drops/drop-001-front.jpg',
  noIndex: false,
  variants: [
    { id: 'v_w_xs', dropId: 'drop_001', sku: 'OUT-001-W-XS', fit: 'WOMEN', size: 'XS', initialStock: 25, currentStock: 18, reservedStock: 0 },
    { id: 'v_w_s', dropId: 'drop_001', sku: 'OUT-001-W-S', fit: 'WOMEN', size: 'S', initialStock: 35, currentStock: 12, reservedStock: 0 },
    { id: 'v_w_m', dropId: 'drop_001', sku: 'OUT-001-W-M', fit: 'WOMEN', size: 'M', initialStock: 40, currentStock: 4, reservedStock: 0 },
    { id: 'v_w_l', dropId: 'drop_001', sku: 'OUT-001-W-L', fit: 'WOMEN', size: 'L', initialStock: 25, currentStock: 8, reservedStock: 0 },
    { id: 'v_m_s', dropId: 'drop_001', sku: 'OUT-001-M-S', fit: 'MEN', size: 'S', initialStock: 25, currentStock: 15, reservedStock: 0 },
    { id: 'v_m_m', dropId: 'drop_001', sku: 'OUT-001-M-M', fit: 'MEN', size: 'M', initialStock: 45, currentStock: 9, reservedStock: 0 },
    { id: 'v_m_l', dropId: 'drop_001', sku: 'OUT-001-M-L', fit: 'MEN', size: 'L', initialStock: 35, currentStock: 7, reservedStock: 0 },
    { id: 'v_m_xl', dropId: 'drop_001', sku: 'OUT-001-M-XL', fit: 'MEN', size: 'XL', initialStock: 10, currentStock: 2, reservedStock: 0 },
  ],
};

export const VAULT_DROPS = [
  {
    id: 'drop_002',
    dropNumber: 2,
    slug: 'drop-002-botanical-architecture',
    title: 'DROP 002 // BOTANICAL ARCHITECTURE',
    subtitle: 'Sage Green 280 GSM Heavy Terry. Raw Seedling Edition.',
    story: 'Organic botanical sage pigment dye. Drop shoulder architecture inspired by raw foliage and urban concrete.',
    fabricSpecs: '280 GSM 100% Organic Cotton · Mineral Wash Sage · Double Needle Seams',
    pricePaise: 240000,
    totalEditionQty: 200,
    status: 'UPCOMING' as const,
    launchAt: new Date(Date.now() + 3600000 * 24 * 7).toISOString(),
    primaryImageUrl: '/images/drops/drop-002-front.jpg',
    galleryUrls: ['/images/drops/drop-002-front.jpg', '/images/drops/drop-002-back.jpg'],
    isFeatured: false,
    variants: [
      { id: 'v2_w_s', dropId: 'drop_002', sku: 'OUT-002-W-S', fit: 'WOMEN', size: 'S', initialStock: 30, currentStock: 30, reservedStock: 0 },
      { id: 'v2_w_m', dropId: 'drop_002', sku: 'OUT-002-W-M', fit: 'WOMEN', size: 'M', initialStock: 40, currentStock: 40, reservedStock: 0 },
      { id: 'v2_w_l', dropId: 'drop_002', sku: 'OUT-002-W-L', fit: 'WOMEN', size: 'L', initialStock: 30, currentStock: 30, reservedStock: 0 },
      { id: 'v2_m_s', dropId: 'drop_002', sku: 'OUT-002-M-S', fit: 'MEN', size: 'S', initialStock: 25, currentStock: 25, reservedStock: 0 },
      { id: 'v2_m_m', dropId: 'drop_002', sku: 'OUT-002-M-M', fit: 'MEN', size: 'M', initialStock: 45, currentStock: 45, reservedStock: 0 },
      { id: 'v2_m_l', dropId: 'drop_002', sku: 'OUT-002-M-L', fit: 'MEN', size: 'L', initialStock: 30, currentStock: 30, reservedStock: 0 },
    ],
  },
  {
    id: 'drop_003',
    dropNumber: 3,
    slug: 'drop-003-monolith-obsidian',
    title: 'DROP 003 // MONOLITH OBSIDIAN',
    subtitle: 'Washed Charcoal Black 300 GSM Ultra-Heavy Cotton.',
    story: 'Extreme tactile density. Carbon black wash with tonal sleeve embroidery and split-hem detailing.',
    fabricSpecs: '300 GSM Combed Cotton · Carbon Bio-Wash · Heavy Rib Collar',
    pricePaise: 260000, // ₹2,600 (qualifies for 18% slab)
    totalEditionQty: 250,
    status: 'ARCHIVED' as const,
    soldOutAt: '2026-10-15T18:00:00.000Z',
    primaryImageUrl: '/images/drops/drop-003-front.jpg',
    galleryUrls: ['/images/drops/drop-003-front.jpg', '/images/drops/drop-003-back.jpg'],
    isFeatured: false,
    variants: [
      { id: 'v3_w_s', dropId: 'drop_003', sku: 'OUT-003-W-S', fit: 'WOMEN', size: 'S', initialStock: 50, currentStock: 0, reservedStock: 0 },
      { id: 'v3_w_m', dropId: 'drop_003', sku: 'OUT-003-W-M', fit: 'WOMEN', size: 'M', initialStock: 60, currentStock: 0, reservedStock: 0 },
      { id: 'v3_m_m', dropId: 'drop_003', sku: 'OUT-003-M-M', fit: 'MEN', size: 'M', initialStock: 80, currentStock: 0, reservedStock: 0 },
      { id: 'v3_m_l', dropId: 'drop_003', sku: 'OUT-003-M-L', fit: 'MEN', size: 'L', initialStock: 60, currentStock: 0, reservedStock: 0 },
    ],
  },
  {
    id: 'drop_000',
    dropNumber: 0,
    slug: 'drop-000-genesis-prototype',
    title: 'DROP 000 // GENESIS PROTOTYPE',
    subtitle: 'Unbleached Organic Raw Cotton. Limited Prototype Run of 100.',
    story: 'The initial design manifesto. Hand-stitched label, raw edge cuffs, zero dye treatment.',
    fabricSpecs: '260 GSM Raw Unbleached Cotton · Hand-Numbered Hem Label',
    pricePaise: 220000,
    totalEditionQty: 100,
    status: 'ARCHIVED' as const,
    soldOutAt: '2026-08-15T04:22:18.000Z',
    primaryImageUrl: '/images/drops/drop-000-front.jpg',
    galleryUrls: ['/images/drops/drop-000-front.jpg', '/images/drops/drop-000-back.jpg'],
    isFeatured: false,
    variants: [
      { id: 'v0_u_s', dropId: 'drop_000', sku: 'OUT-000-U-S', fit: 'WOMEN', size: 'S', initialStock: 30, currentStock: 0, reservedStock: 0 },
      { id: 'v0_u_m', dropId: 'drop_000', sku: 'OUT-000-U-M', fit: 'MEN', size: 'M', initialStock: 40, currentStock: 0, reservedStock: 0 },
      { id: 'v0_u_l', dropId: 'drop_000', sku: 'OUT-000-U-L', fit: 'MEN', size: 'L', initialStock: 30, currentStock: 0, reservedStock: 0 },
    ],
  },
  {
    id: 'drop_004',
    dropNumber: 4,
    slug: 'drop-004-solaris-dune',
    title: 'DROP 004 // SOLARIS DUNE',
    subtitle: 'Terracotta Sun-Fade 280 GSM French Terry.',
    story: 'Mineral earth dyes formulated in Gujarat. Calibrated oversized silhouette with hand-distressed neckline.',
    fabricSpecs: '280 GSM Combed Cotton · Mineral Pigment Wash · High-Density Rib Collar',
    pricePaise: 240000,
    totalEditionQty: 250,
    status: 'UPCOMING' as const,
    launchAt: new Date(Date.now() + 3600000 * 24 * 14).toISOString(),
    primaryImageUrl: '/images/drops/drop-002-front.jpg',
    galleryUrls: ['/images/drops/drop-002-front.jpg', '/images/drops/drop-002-back.jpg'],
    isFeatured: false,
    variants: [
      { id: 'v4_w_s', dropId: 'drop_004', sku: 'OUT-004-W-S', fit: 'WOMEN', size: 'S', initialStock: 40, currentStock: 40, reservedStock: 0 },
      { id: 'v4_w_m', dropId: 'drop_004', sku: 'OUT-004-W-M', fit: 'WOMEN', size: 'M', initialStock: 50, currentStock: 50, reservedStock: 0 },
      { id: 'v4_m_m', dropId: 'drop_004', sku: 'OUT-004-M-M', fit: 'MEN', size: 'M', initialStock: 60, currentStock: 60, reservedStock: 0 },
      { id: 'v4_m_l', dropId: 'drop_004', sku: 'OUT-004-M-L', fit: 'MEN', size: 'L', initialStock: 50, currentStock: 50, reservedStock: 0 },
    ],
  },
  {
    id: 'drop_005',
    dropNumber: 5,
    slug: 'drop-005-indigo-archetype',
    title: 'DROP 005 // INDIGO ARCHETYPE',
    subtitle: 'Deep Natural Indigo 290 GSM Heavy Organic Knit.',
    story: 'Hand-dipped natural indigo dye batches. Boxy oversized drape with contrast tobacco topstitching.',
    fabricSpecs: '290 GSM Combed Cotton · Organic Indigo Bio-Wash · Double Split Hem',
    pricePaise: 250000,
    totalEditionQty: 200,
    status: 'UPCOMING' as const,
    launchAt: new Date(Date.now() + 3600000 * 24 * 21).toISOString(),
    primaryImageUrl: '/images/drops/drop-003-front.jpg',
    galleryUrls: ['/images/drops/drop-003-front.jpg', '/images/drops/drop-003-back.jpg'],
    isFeatured: false,
    variants: [
      { id: 'v5_w_s', dropId: 'drop_005', sku: 'OUT-005-W-S', fit: 'WOMEN', size: 'S', initialStock: 35, currentStock: 35, reservedStock: 0 },
      { id: 'v5_w_m', dropId: 'drop_005', sku: 'OUT-005-W-M', fit: 'WOMEN', size: 'M', initialStock: 45, currentStock: 45, reservedStock: 0 },
      { id: 'v5_m_m', dropId: 'drop_005', sku: 'OUT-005-M-M', fit: 'MEN', size: 'M', initialStock: 50, currentStock: 50, reservedStock: 0 },
    ],
  },
  {
    id: 'drop_006',
    dropNumber: 6,
    slug: 'drop-006-noir-velvet',
    title: 'DROP 006 // NOIR VELVET',
    subtitle: 'Pitch Obsidian 320 GSM French Terry Cotton.',
    story: 'Extreme cold-climate density. Suede-touch brushed organic interior with matte black silicon logo imprint.',
    fabricSpecs: '320 GSM French Terry · Carbon Suede Bio-Wash · Lycra Ribbed Cuff',
    pricePaise: 280000,
    totalEditionQty: 250,
    status: 'ARCHIVED' as const,
    soldOutAt: '2026-09-01T12:00:00.000Z',
    primaryImageUrl: '/images/drops/drop-001-back.jpg',
    galleryUrls: ['/images/drops/drop-001-back.jpg', '/images/drops/drop-001-front.jpg'],
    isFeatured: false,
    variants: [
      { id: 'v6_w_s', dropId: 'drop_006', sku: 'OUT-006-W-S', fit: 'WOMEN', size: 'S', initialStock: 30, currentStock: 0, reservedStock: 0 },
      { id: 'v6_w_m', dropId: 'drop_006', sku: 'OUT-006-W-M', fit: 'WOMEN', size: 'M', initialStock: 40, currentStock: 0, reservedStock: 0 },
      { id: 'v6_m_l', dropId: 'drop_006', sku: 'OUT-006-M-L', fit: 'MEN', size: 'L', initialStock: 50, currentStock: 0, reservedStock: 0 },
    ],
  },
];

export const INITIAL_FAQS = [
  {
    id: 'faq_1',
    category: 'Drops & Editions',
    question: 'How do OUTSIDE drops work?',
    answer: 'We operate on a single-drop schedule. Each drop features exactly one signature design, produced in a strictly capped, serialized edition (usually 100 to 250 pieces). Once an edition sells out, it will never be restocked or reissued; it moves permanently into The Vault.',
    sortOrder: 1,
  },
  {
    id: 'faq_2',
    category: 'GST & Invoicing',
    question: 'How is GST calculated on apparel orders?',
    answer: 'All prices on OUTSIDE are 100% inclusive of statutory Indian Apparel GST (5% GST for items under ₹2,500). An official sequential GST Tax Invoice with our registered GSTIN (24AABCO1234F1Z5) is generated for every order and delivered instantly via email.',
    sortOrder: 2,
  },
  {
    id: 'faq_3',
    category: 'Fit & Sizing',
    question: 'What is the Women-First fit philosophy?',
    answer: 'Rather than shrinking down a standard boxy men’s cut, our Women-first fits are custom-patterned with proportioned shoulders, ergonomic armhole depth, and calibrated drape to achieve an authentic oversized aesthetic without overwhelming the frame.',
    sortOrder: 3,
  },
  {
    id: 'faq_4',
    category: 'Shipping & Delivery',
    question: 'Where do you ship from, and how fast is delivery?',
    answer: 'All drops ship directly from our studio in Ahmedabad, Gujarat. Orders are dispatched via Bluedart / Delhivery Express within 24 hours of drop confirmation. Typical transit time is 2-4 business days across metro India.',
    sortOrder: 4,
  },
];

export const INITIAL_JOURNAL = [
  {
    id: 'journal_1',
    slug: 'why-we-dont-restock-the-anti-inventory-thesis',
    title: 'Why We Don’t Restock: The Anti-Inventory Thesis',
    excerpt: 'Fast fashion manufactures landfill; luxury manufactures artificial hype. OUTSIDE exists at the intersection of architectural design and uncompromised rarity.',
    body: `Modern fashion has an overproduction problem. Brands produce tens of thousands of identical garments, mark them up by 800%, discount the remainder by 60%, and incinerate what remains.

At OUTSIDE, we reject this wasteful cycle. Every piece is numbered. We calculate the exact yardage of cotton needed before cutting a single pattern. When DROP 001 sells out its 250 units, the pattern is retired to The Vault. 

This is not artificial scarcity—it is respect for the fabric, respect for the weavers in Gujarat, and respect for the wearer who knows their garment will never be replicated.`,
    coverImageUrl: '/images/journal/journal-01.jpg',
    authorName: 'Studio Outside',
    publishedAt: '2026-11-10T10:00:00.000Z',
    status: 'PUBLISHED' as const,
  },
  {
    id: 'journal_2',
    slug: 'the-anatomy-of-280gsm-french-terry',
    title: 'The Anatomy of 280 GSM French Terry: Why Weight Matters',
    excerpt: 'An engineering breakdown of combed long-staple cotton, loop-back knits, and zero-compromise tactile drape.',
    body: `Most retail t-shirts range between 140 to 180 GSM (grams per square meter). They feel thin, lose their neckline elasticity after three washes, and cling to the body.

For DROP 001, we developed a proprietary 280 GSM French Terry. The outer face is ultra-smooth combed yarn, while the reverse side features a micro-loop construction that absorbs moisture and breathes effortlessly in tropical Indian climates. 

The weight creates an architectural drape—the t-shirt holds its boxy structure without sagging, creating a clean, flattering fit on both men and women.`,
    coverImageUrl: '/images/journal/journal-02.jpg',
    authorName: 'Studio Outside',
    publishedAt: '2026-11-15T12:00:00.000Z',
    status: 'PUBLISHED' as const,
  },
];

// ==========================================
// MODULE 2: DYNAMIC THEME, PRESETS & DEFAULTS
// ==========================================
export const THEME_PRESETS = [
  {
    id: 'sun-bleached-gallery',
    name: 'Sun-Bleached Gallery (OUTSIDE Signature)',
    isDefault: true,
    canvasColor: '#F7F5F0',
    surfaceColor: '#EDEAE2',
    elevatedColor: '#FCFBF8',
    borderColor: '#DCD7CC',
    inkPrimaryColor: '#111110',
    inkSecondaryColor: '#52504B',
    accentPrimaryColor: '#B82328',
    accentSecondaryColor: '#3F4E44',
    hairlineGrid: true,
    borderRadius: '0px',
    glassmorphism: true,
  },
  {
    id: 'monolith-obsidian',
    name: 'Monolith Obsidian (Capsule Drop)',
    isDefault: false,
    canvasColor: '#141412',
    surfaceColor: '#1F1E1C',
    elevatedColor: '#262523',
    borderColor: '#383632',
    inkPrimaryColor: '#F7F5F0',
    inkSecondaryColor: '#A8A59D',
    accentPrimaryColor: '#D9383A',
    accentSecondaryColor: '#5A7A64',
    hairlineGrid: true,
    borderRadius: '0px',
    glassmorphism: true,
  },
  {
    id: 'botanical-sage',
    name: 'Botanical Sage (Spring Capsule)',
    isDefault: false,
    canvasColor: '#F4F6F2',
    surfaceColor: '#E6ECE2',
    elevatedColor: '#FBFCFA',
    borderColor: '#CBD6C6',
    inkPrimaryColor: '#131C15',
    inkSecondaryColor: '#4A584C',
    accentPrimaryColor: '#A82C30',
    accentSecondaryColor: '#3B5742',
    hairlineGrid: true,
    borderRadius: '2px',
    glassmorphism: true,
  },
  {
    id: 'terracotta-dust',
    name: 'Terracotta Dust (Desert Edition)',
    isDefault: false,
    canvasColor: '#F9F6F2',
    surfaceColor: '#EFE8DE',
    elevatedColor: '#FDFBF8',
    borderColor: '#DFD4C5',
    inkPrimaryColor: '#1A1411',
    inkSecondaryColor: '#5C4D44',
    accentPrimaryColor: '#B33625',
    accentSecondaryColor: '#445147',
    hairlineGrid: true,
    borderRadius: '0px',
    glassmorphism: true,
  },
];

const { id: _defaultPresetId, ...sunBleachedValues } = THEME_PRESETS[0];

export const DEFAULT_THEME_CONFIG = {
  id: 'active_theme',
  ...sunBleachedValues,
  logoUrl: '/images/OUTSIDE_icon.png',
  logoDarkUrl: '/images/OUTSIDE_icon.png',
  faviconUrl: '/favicon.ico',
  ogImageUrl: '/images/drops/drop-001-front.jpg',
  presets: THEME_PRESETS,
  updatedAt: new Date().toISOString(),
};

// ==========================================
// MODULE 2: FEATURE FLAGS
// ==========================================
export const DEFAULT_FEATURE_FLAGS = [
  // Commerce & Single-Drop Controls
  {
    id: 'flag_countdown_timer',
    key: 'enable_countdown_timer',
    label: 'Launch Countdown Timer',
    category: 'COMMERCE',
    isEnabled: true,
    description: 'Display real-time countdown ticker on upcoming drops.',
    configJson: null,
  },
  {
    id: 'flag_live_stock_counter',
    key: 'enable_live_stock_counter',
    label: 'Live Atomic Stock Counter',
    category: 'COMMERCE',
    isEnabled: true,
    description: 'Show exact remaining serialized pieces versus low-stock warning badge.',
    configJson: null,
  },
  {
    id: 'flag_low_stock_threshold',
    key: 'low_stock_threshold',
    label: 'Low-Stock Warning Threshold',
    category: 'COMMERCE',
    isEnabled: true,
    description: 'Trigger Serpent Oxide warning pill when remaining variant inventory falls below this count.',
    configJson: { threshold: 10 },
  },
  {
    id: 'flag_waitlist_capture',
    key: 'enable_waitlist_capture',
    label: 'Drop Waitlist Capture Gate',
    category: 'COMMERCE',
    isEnabled: true,
    description: 'Allow collectors to join the prioritized waitlist when an edition is sold out or upcoming.',
    configJson: null,
  },
  {
    id: 'flag_fit_toggle',
    key: 'enable_fit_toggle',
    label: 'Women-First / Men Fit Toggle',
    category: 'COMMERCE',
    isEnabled: true,
    description: 'Interactive fit switcher recalculating measurements and model previews.',
    configJson: { defaultFit: 'WOMEN' },
  },
  {
    id: 'flag_sticky_drop_bar',
    key: 'enable_sticky_drop_bar',
    label: 'Sticky Floating Drop Bar',
    category: 'COMMERCE',
    isEnabled: true,
    description: 'Floating minimal quick-buy and size select bar docked on scroll.',
    configJson: null,
  },
  {
    id: 'flag_checkout_flow',
    key: 'enable_checkout_flow',
    label: 'Storefront Checkout Mode',
    category: 'COMMERCE',
    isEnabled: true,
    description: 'When enabled, customers can checkout and pay; when disabled, storefront acts in Waitlist-Only Mode.',
    configJson: null,
  },

  // Site-Wide Modules
  {
    id: 'flag_announcement_bar',
    key: 'enable_announcement_bar',
    label: 'Top Announcement Ticker',
    category: 'SITE_WIDE',
    isEnabled: true,
    description: 'Top architectural hairline bar for drop velocity announcements.',
    configJson: {
      text: 'DROP 001 LIVE // BETTER DAYS AHEAD · 250 SERIALIZED PIECES · FREE DOMESTIC EXPRESS SHIPPING',
      link: '/',
    },
  },
  {
    id: 'flag_vault_archive',
    key: 'enable_vault_archive',
    label: 'The Vault Archive (/vault)',
    category: 'SITE_WIDE',
    isEnabled: true,
    description: 'Expose archival limited drops to public navigation and search engines.',
    configJson: null,
  },
  {
    id: 'flag_journal',
    key: 'enable_journal',
    label: 'The Outside Journal (/journal)',
    category: 'SITE_WIDE',
    isEnabled: true,
    description: 'Editorial brand essays, cotton engineering breakdowns, and manifesto articles.',
    configJson: null,
  },
  {
    id: 'flag_cookie_consent',
    key: 'enable_cookie_consent',
    label: 'Privacy & Cookie Consent Banner',
    category: 'SITE_WIDE',
    isEnabled: true,
    description: 'Minimalist Sandstone Hairline consent pill docked at bottom-left.',
    configJson: null,
  },
  {
    id: 'flag_maintenance_mode',
    key: 'enable_maintenance_mode',
    label: 'Studio Maintenance Mode',
    category: 'SITE_WIDE',
    isEnabled: false,
    description: 'Renders an avant-garde "Next Drop Preparing" screen on public storefront while keeping /admin open.',
    configJson: {
      headline: 'STUDIO IS PREPARING THE NEXT DROP',
      subline: 'DROP 002 PREPARATION UNDERWAY // AHMEDABAD STUDIO',
    },
  },
];

// ==========================================
// MODULE 2: RESPONSIVE & LAYOUT CONTROLS
// ==========================================
export interface SectionConfig {
  id: string;
  name: string;
  sortOrder: number;
  visibleDesktop: boolean;
  visibleTablet: boolean;
  visibleMobile: boolean;
  settings?: Record<string, any>;
}

export interface LayoutConfigData {
  id: string;
  sections: SectionConfig[];
  gridColumns: {
    vault: { mobile: number; tablet: number; desktop: number };
    lookbook: { mobile: number; tablet?: number; desktop: number };
  };
  mobileStickyCtaPosition: 'bottom_fixed' | 'inline';
  updatedAt: string;
}

export const DEFAULT_LAYOUT_CONFIG: LayoutConfigData = {
  id: 'active_layout',
  sections: [
    {
      id: 'hero',
      name: 'Hero Drop Showcase',
      sortOrder: 1,
      visibleDesktop: true,
      visibleTablet: true,
      visibleMobile: true,
      settings: {},
    },
    {
      id: 'drops',
      name: 'Active Productions Showcase',
      sortOrder: 2,
      visibleDesktop: true,
      visibleTablet: true,
      visibleMobile: true,
      settings: {
        defaultCardCount: 3,
        defaultFilter: 'ALL',
        defaultSort: 'FEATURED',
        showCategoryBubbles: true,
        showFilterToolbar: true,
        eyebrow: 'LIMITED SERIALIZED PRODUCTION',
        title: 'Active Studio Drops',
      },
    },
    {
      id: 'story',
      name: 'Manifesto & Craft Story',
      sortOrder: 3,
      visibleDesktop: true,
      visibleTablet: true,
      visibleMobile: true,
      settings: {
        eyebrow: 'THE ANTI-INVENTORY PHILOSOPHY',
        title: 'Mass Production Is A Crime Against Craft.',
        description: 'We do not produce seasonal collections or excess inventory. We release one singular, uncompromising style at a time in capped serialized runs.',
      },
    },
    {
      id: 'lookbook',
      name: 'Lookbook Bento Gallery',
      sortOrder: 4,
      visibleDesktop: true,
      visibleTablet: true,
      visibleMobile: true,
      settings: {
        itemLimit: 4,
        eyebrow: 'ARCHIVAL VISUAL LOGS',
        title: 'Ahmedabad Industrial Atelier Series',
      },
    },
    {
      id: 'specs',
      name: 'Technical Garment Specs',
      sortOrder: 5,
      visibleDesktop: true,
      visibleTablet: true,
      visibleMobile: true,
      settings: {
        gsmCallout: '280 GSM',
        eyebrow: 'TEXTILE ARCHITECTURE',
        title: 'French Terry Combed Organic Cotton',
      },
    },
    {
      id: 'vault',
      name: 'The Vault Archival Preview',
      sortOrder: 6,
      visibleDesktop: true,
      visibleTablet: true,
      visibleMobile: true,
      settings: {
        defaultCardCount: 3,
        eyebrow: 'THE VAULT ARCHIVE',
        title: 'Historical Numbered Editions',
        showSoldOutBadge: true,
      },
    },
    {
      id: 'journal',
      name: 'Outside Journal Essays',
      sortOrder: 7,
      visibleDesktop: true,
      visibleTablet: true,
      visibleMobile: true,
      settings: {
        articleLimit: 2,
        eyebrow: 'STUDIO ESSAYS & ESSENCE',
        title: 'Architectural Garment Theory',
      },
    },
    {
      id: 'faqs',
      name: 'AEO Structured FAQs',
      sortOrder: 8,
      visibleDesktop: true,
      visibleTablet: true,
      visibleMobile: true,
      settings: {
        faqLimit: 4,
        eyebrow: 'AUTHENTICITY & LOGISTICS',
        title: 'Common Collector Inquiries',
      },
    },
    {
      id: 'vip',
      name: 'VIP Early Access Footer Bar',
      sortOrder: 9,
      visibleDesktop: true,
      visibleTablet: true,
      visibleMobile: true,
      settings: {
        eyebrow: 'PRIVATE ALLOCATION GATEWAY',
        title: 'Never Miss A Serialized Drop.',
        badge: 'WHATSAPP & SMS PRIORITY DISPATCH',
        ctaText: 'REQUEST VIP EARLY ACCESS',
      },
    },
  ],
  gridColumns: {
    vault: { mobile: 1, tablet: 2, desktop: 3 },
    lookbook: { mobile: 1, tablet: 2, desktop: 2 },
  },
  mobileStickyCtaPosition: 'bottom_fixed',
  updatedAt: new Date().toISOString(),
};

// ==========================================
// MODULE 3: SEO, AEO, GEO & STEALTH GOVERNANCE
// ==========================================
export interface SeoConfigData {
  titleTemplate: string;
  defaultTitle: string;
  defaultMetaDescription: string;
  ogImageUrl: string;
  llmsManifesto: string;
  crawlerPolicies: {
    googlebot: boolean;
    bingbot: boolean;
    oaiSearch: boolean;
    perplexity: boolean;
    claudeBot: boolean;
  };
  redirects: { from: string; to: string; permanent: boolean }[];
  enableWaitlistReferral: boolean;
  updatedAt: string;
}

export const DEFAULT_SEO_CONFIG: SeoConfigData = {
  titleTemplate: '%s | OUTSIDE India',
  defaultTitle: 'OUTSIDE // Wear Your Story — Limited Serialized Drops',
  defaultMetaDescription:
    'Luxury streetwear engineered with 280 GSM combed organic cotton in Gujarat, India. Single-drop serialized editions capped at 250 pieces. Women-first fit philosophy.',
  ogImageUrl: '/api/og?drop=001',
  llmsManifesto: `OUTSIDE is an architectural luxury D2C apparel brand based in Ahmedabad, Gujarat, India (State Code 24).
We operate on a strict single-drop limited-edition release model: strictly ONE design is available at any given time, produced in a serialized batch of 250 pieces, and never restocked.
Garments are cut from custom-milled 280 GSM combed organic cotton with a French terry knit, featuring double bio-washing and an ergonomic Women-First boxy fit.
All orders are billed under Indian GST (HSN 61091000) with sequential invoicing.`,
  crawlerPolicies: {
    googlebot: true,
    bingbot: true,
    oaiSearch: true,
    perplexity: true,
    claudeBot: true,
  },
  redirects: [
    { from: '/drops', to: '/', permanent: true },
    { from: '/archive', to: '/vault', permanent: true },
  ],
  enableWaitlistReferral: true,
  updatedAt: new Date().toISOString(),
};

// ==========================================
// MODULE 4: CATEGORY STORY BUBBLES
// ==========================================
export interface CategoryBubble {
  id: string;
  label: string;
  sublabel: string;
  badge: string;
  image: string;
  isLive?: boolean;
  sortOrder: number;
  isActive: boolean;
}

export const DEFAULT_CATEGORIES: CategoryBubble[] = [
  {
    id: 'ALL',
    label: 'All Pieces',
    sublabel: '4 Editions',
    badge: 'EXPLORE',
    image: '/images/OUTSIDE_icon.png',
    isLive: false,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'LIVE',
    label: 'Drop 001',
    sublabel: 'Better Days',
    badge: 'LIVE NOW',
    image: '/images/drops/drop-001-front.jpg',
    isLive: true,
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'UPCOMING',
    label: 'Drop 002',
    sublabel: 'Botanical',
    badge: 'NEXT DROP',
    image: '/images/drops/drop-002-front.jpg',
    isLive: false,
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'WOMEN',
    label: "Women's Fit",
    sublabel: 'Ergo-Boxy',
    badge: 'SIGNATURE',
    image: '/images/drops/drop-001-front.jpg',
    isLive: false,
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 'MEN',
    label: "Men's Fit",
    sublabel: 'Structured',
    badge: 'RELAXED',
    image: '/images/drops/drop-003-front.jpg',
    isLive: false,
    sortOrder: 5,
    isActive: true,
  },
  {
    id: 'ARCHIVED',
    label: 'The Vault',
    sublabel: 'Sold Out',
    badge: 'ARCHIVE',
    image: '/images/drops/drop-000-front.jpg',
    isLive: false,
    sortOrder: 6,
    isActive: true,
  },
];

// ==========================================
// MODULE 5: HOMEPAGE HERO PRESENTATION CONFIG
// ==========================================
export interface HeroConfigData {
  desktopImageUrl: string;
  mobileImageUrl: string;
  altText: string;
  backgroundColor: string;
  eyebrowText: string;
  headlineLine1: string;
  headlineLine2: string;
  headlineLine3: string;
  subheadline: string;
  bodyDescription: string;
  ctaText: string;
  secondaryCtaText: string;
  objectPosition: string;
  updatedAt: string;
}

export const DEFAULT_HERO_CONFIG: HeroConfigData = {
  desktopImageUrl: '/images/outside_hero_final.png',
  mobileImageUrl: '/images/outside_hero_final.png',
  altText: 'DROP 001 Better Days Ahead Heavyweight T-Shirt',
  backgroundColor: '#EAE2D8',
  eyebrowText: 'DROP 001 · LIMITED EDITION',
  headlineLine1: 'WEAR',
  headlineLine2: 'YOUR',
  headlineLine3: 'STORY',
  subheadline: 'EXCLUSIVE APPAREL • MADE IN INDIA',
  bodyDescription: 'A limited run of 250 pieces, crafted from 280 GSM organic cotton. Thoughtfully designed, ethically made, and built to last.',
  ctaText: 'CLAIM DROP 001',
  secondaryCtaText: 'EXPLORE THE COLLECTION ▸',
  objectPosition: 'right center',
  updatedAt: new Date().toISOString(),
};

// ==========================================
// LOCAL JSON RESILIENT STORE
// ==========================================
const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

export function getLocalStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const initialData = {
    drops: [INITIAL_DROP, ...VAULT_DROPS],
    orders: [],
    leads: [
      {
        id: 'lead_demo_1',
        type: 'DROP_WAITLIST',
        status: 'NEW',
        name: 'Aarav Mehta',
        email: 'aarav@example.com',
        phone: '+919876543210',
        preferredFit: 'MEN',
        preferredSize: 'L',
        source: 'homepage-countdown',
        createdAt: new Date().toISOString(),
      },
    ],
    faqs: INITIAL_FAQS,
    journal: INITIAL_JOURNAL,
    gstConfig: {
      isEnabled: true,
      sellerLegalName: 'OUTSIDE APPAREL STUDIO PVT LTD',
      gstin: '24AABCO1234F1Z5',
      originStateCode: '24',
      originStateName: 'Gujarat',
      registeredAddress: 'Plot 104, Design District, SG Highway, Ahmedabad, Gujarat 380015',
      pricingMode: 'TAX_INCLUSIVE',
      thresholdInr: 2500,
      lowSlabRate: 5.0,
      highSlabRate: 18.0,
      defaultHsn: '61091000',
      invoicePrefix: 'OUT/26-27/',
      invoiceCounter: 4,
      financialYear: '2026-2027',
    },
    emailConfig: {
      isEnabled: true,
      provider: 'SMTP',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      username: 'drops@outside.in',
      fromName: 'OUTSIDE',
      fromEmail: 'drops@outside.in',
      replyTo: 'support@outside.in',
    },
    emailLogs: [],
    auditLogs: [],
    themeConfig: DEFAULT_THEME_CONFIG,
    featureFlags: DEFAULT_FEATURE_FLAGS,
    layoutConfig: DEFAULT_LAYOUT_CONFIG,
    seoConfig: DEFAULT_SEO_CONFIG,
    categories: DEFAULT_CATEGORIES,
    heroConfig: DEFAULT_HERO_CONFIG,
    superAdminSecurity: {
      totpSecret: null as string | null,
      totpEnabled: false,
    },
    securityLockouts: [] as { ip: string; failedAttempts: number; lockedUntil: string | null }[],
  };

  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(initialData, null, 2));
    return initialData;
  }

  try {
    const content = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(content);

    // Ensure active drop has updated real imagery
    if (parsed.drops && parsed.drops[0]) {
      parsed.drops[0].title = INITIAL_DROP.title;
      parsed.drops[0].subtitle = INITIAL_DROP.subtitle;
      parsed.drops[0].primaryImageUrl = INITIAL_DROP.primaryImageUrl;
      parsed.drops[0].galleryUrls = INITIAL_DROP.galleryUrls;
      parsed.drops[0].story = INITIAL_DROP.story;
      if (!parsed.drops[0].hotspots || parsed.drops[0].hotspots.length === 0) {
        parsed.drops[0].hotspots = DEFAULT_HOTSPOTS;
      }
    }
    if (!parsed.drops || parsed.drops.length < 7) {
      const existingIds = new Set((parsed.drops || []).map((d: any) => d.id));
      const newVaultDrops = VAULT_DROPS.filter((d) => !existingIds.has(d.id));
      parsed.drops = [...(parsed.drops || [INITIAL_DROP]), ...newVaultDrops];
    }
    // Ensure Module 2 entities exist
    if (!parsed.themeConfig) {
      parsed.themeConfig = DEFAULT_THEME_CONFIG;
    }
    if (!parsed.featureFlags || parsed.featureFlags.length === 0) {
      parsed.featureFlags = DEFAULT_FEATURE_FLAGS;
    }
    if (!parsed.layoutConfig) {
      parsed.layoutConfig = DEFAULT_LAYOUT_CONFIG;
    } else if (parsed.layoutConfig.sections && !parsed.layoutConfig.sections.some((s: any) => s.id === 'drops')) {
      parsed.layoutConfig.sections = [
        ...parsed.layoutConfig.sections.slice(0, 1),
        { id: 'drops', name: 'Active Productions Showcase', sortOrder: 1.5, visibleDesktop: true, visibleTablet: true, visibleMobile: true },
        ...parsed.layoutConfig.sections.slice(1),
      ];
    }
    // Ensure Module 3 entities exist
    if (!parsed.seoConfig) {
      parsed.seoConfig = DEFAULT_SEO_CONFIG;
    }
    if (!parsed.superAdminSecurity) {
      parsed.superAdminSecurity = {
        totpSecret: null,
        totpEnabled: false,
      };
    }
    if (!parsed.securityLockouts) {
      parsed.securityLockouts = [];
    }
    // Ensure Module 4 & 5 entities exist
    if (!Array.isArray(parsed.categories)) {
      parsed.categories = DEFAULT_CATEGORIES;
    }
    if (!parsed.heroConfig) {
      parsed.heroConfig = DEFAULT_HERO_CONFIG;
    }

    return parsed;
  } catch {
    return initialData;
  }
}

export function saveLocalStore(data: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.warn('[store] Note: File system write skipped or read-only in serverless environment:', error);
  }
}

// ==========================================
// THEME CONFIG HELPERS
// ==========================================
export function getThemeConfig() {
  const store = getLocalStore();
  return store.themeConfig || DEFAULT_THEME_CONFIG;
}

export function saveThemeConfig(newConfig: Partial<typeof DEFAULT_THEME_CONFIG>) {
  const store = getLocalStore();
  store.themeConfig = {
    ...store.themeConfig,
    ...newConfig,
    updatedAt: new Date().toISOString(),
  };
  saveLocalStore(store);
  return store.themeConfig;
}

export function resetThemeConfig() {
  const store = getLocalStore();
  store.themeConfig = {
    ...DEFAULT_THEME_CONFIG,
    updatedAt: new Date().toISOString(),
  };
  saveLocalStore(store);
  return store.themeConfig;
}

// ==========================================
// FEATURE FLAG HELPERS
// ==========================================
export function getFeatureFlags(): typeof DEFAULT_FEATURE_FLAGS {
  const store = getLocalStore();
  return store.featureFlags || DEFAULT_FEATURE_FLAGS;
}

export function getFeatureFlag(key: string) {
  const flags = getFeatureFlags();
  return flags.find((f: any) => f.key === key) || null;
}

export function isFeatureEnabled(key: string, defaultValue = true): boolean {
  const flag = getFeatureFlag(key);
  if (!flag) return defaultValue;
  return flag.isEnabled;
}

export function updateFeatureFlag(key: string, isEnabled: boolean, configJson?: any) {
  const store = getLocalStore();
  const index = (store.featureFlags || []).findIndex((f: any) => f.key === key);
  if (index !== -1) {
    store.featureFlags[index].isEnabled = isEnabled;
    if (configJson !== undefined) {
      store.featureFlags[index].configJson = configJson;
    }
    store.featureFlags[index].updatedAt = new Date().toISOString();
  } else {
    store.featureFlags.push({
      id: `flag_${key}`,
      key,
      label: key,
      category: 'CUSTOM',
      isEnabled,
      description: null,
      configJson: configJson || null,
      updatedAt: new Date().toISOString(),
    });
  }
  saveLocalStore(store);
  return store.featureFlags;
}

export function resetFeatureFlags() {
  const store = getLocalStore();
  store.featureFlags = DEFAULT_FEATURE_FLAGS.map((f) => ({
    ...f,
    updatedAt: new Date().toISOString(),
  }));
  saveLocalStore(store);
  return store.featureFlags;
}

// ==========================================
// LAYOUT CONFIG HELPERS
// ==========================================
export function getLayoutConfig(): LayoutConfigData {
  const store = getLocalStore();
  return store.layoutConfig || DEFAULT_LAYOUT_CONFIG;
}

export function saveLayoutConfig(newConfig: Partial<LayoutConfigData>): LayoutConfigData {
  const store = getLocalStore();
  store.layoutConfig = {
    ...store.layoutConfig,
    ...newConfig,
    updatedAt: new Date().toISOString(),
  };
  saveLocalStore(store);
  return store.layoutConfig as LayoutConfigData;
}

export function resetLayoutConfig(): LayoutConfigData {
  const store = getLocalStore();
  store.layoutConfig = {
    ...DEFAULT_LAYOUT_CONFIG,
    updatedAt: new Date().toISOString(),
  };
  saveLocalStore(store);
  return store.layoutConfig as LayoutConfigData;
}

// ==========================================
// AUDIT LOG HELPER
// ==========================================
export function recordAuditLog(entry: {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: any;
}) {
  const store = getLocalStore();
  if (!store.auditLogs) store.auditLogs = [];
  store.auditLogs.unshift({
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...entry,
    createdAt: new Date().toISOString(),
  });
  if (store.auditLogs.length > 500) {
    store.auditLogs = store.auditLogs.slice(0, 500);
  }
  saveLocalStore(store);
}

// ==========================================
// MODULE 3: SEO, AEO, GEO & STEALTH HELPERS
// ==========================================
export function getAdminBasePath(): string {
  try {
    const store = getLocalStore();
    const configured = store?.superAdminSecurity?.stealthAdminPath;
    if (configured && configured.startsWith('/')) return configured;
  } catch {}
  const custom = process.env.ADMIN_BASE_PATH;
  if (!custom) return '/sys-admin-gate';
  return custom.startsWith('/') ? custom : `/${custom}`;
}

export function updateStealthAdminPath(newPath: string): string {
  const cleanPath = newPath.startsWith('/') ? newPath : `/${newPath}`;
  const store = getLocalStore();
  if (!store.superAdminSecurity) {
    store.superAdminSecurity = { totpSecret: null, totpEnabled: false };
  }
  store.superAdminSecurity.stealthAdminPath = cleanPath;
  saveLocalStore(store);
  return cleanPath;
}

export function getSecurityLockouts(): { ip: string; failedAttempts: number; lockedUntil: string | null }[] {
  const store = getLocalStore();
  return store.securityLockouts || [];
}

export function clearSecurityLockouts(ip?: string) {
  const store = getLocalStore();
  if (!store.securityLockouts) store.securityLockouts = [];
  if (ip) {
    store.securityLockouts = store.securityLockouts.filter((l: any) => l.ip !== ip);
  } else {
    store.securityLockouts = [];
  }
  saveLocalStore(store);
  return store.securityLockouts;
}

export function getSeoConfig(): SeoConfigData {
  const store = getLocalStore();
  return store.seoConfig || DEFAULT_SEO_CONFIG;
}

export function saveSeoConfig(newConfig: Partial<SeoConfigData>): SeoConfigData {
  const store = getLocalStore();
  store.seoConfig = {
    ...store.seoConfig,
    ...newConfig,
    updatedAt: new Date().toISOString(),
  };
  saveLocalStore(store);
  return store.seoConfig;
}

export function resetSeoConfig(): SeoConfigData {
  const store = getLocalStore();
  store.seoConfig = {
    ...DEFAULT_SEO_CONFIG,
    updatedAt: new Date().toISOString(),
  };
  saveLocalStore(store);
  return store.seoConfig;
}

export function getSuperAdminSecurity(): { totpSecret: string | null; totpEnabled: boolean } {
  const store = getLocalStore();
  return store.superAdminSecurity || { totpSecret: null, totpEnabled: false };
}

export function saveSuperAdminSecurity(data: { totpSecret?: string | null; totpEnabled?: boolean }) {
  const store = getLocalStore();
  store.superAdminSecurity = {
    ...store.superAdminSecurity,
    ...data,
  };
  saveLocalStore(store);
  return store.superAdminSecurity;
}

/**
 * Enforces strict login rate limiting:
 * Max 5 failed attempts per IP address within a 15-minute rolling window.
 */
export function checkLoginRateLimit(ip: string): {
  allowed: boolean;
  remainingAttempts: number;
  lockoutRemainingSeconds?: number;
} {
  const store = getLocalStore();
  if (!store.securityLockouts) store.securityLockouts = [];

  const now = Date.now();
  const entry = store.securityLockouts.find((l: any) => l.ip === ip);

  if (!entry) {
    return { allowed: true, remainingAttempts: 5 };
  }

  // Check if actively locked out
  if (entry.lockedUntil) {
    const lockedUntilTime = new Date(entry.lockedUntil).getTime();
    if (now < lockedUntilTime) {
      const remainingSecs = Math.ceil((lockedUntilTime - now) / 1000);
      return {
        allowed: false,
        remainingAttempts: 0,
        lockoutRemainingSeconds: remainingSecs,
      };
    } else {
      // Lockout expired - reset
      entry.failedAttempts = 0;
      entry.lockedUntil = null;
      saveLocalStore(store);
      return { allowed: true, remainingAttempts: 5 };
    }
  }

  const remaining = Math.max(0, 5 - entry.failedAttempts);
  return { allowed: remaining > 0, remainingAttempts: remaining };
}

export function recordLoginAttempt(ip: string, email: string, success: boolean) {
  const store = getLocalStore();
  if (!store.securityLockouts) store.securityLockouts = [];

  const now = Date.now();
  let entry = store.securityLockouts.find((l: any) => l.ip === ip);

  if (!entry) {
    entry = { ip, failedAttempts: 0, lockedUntil: null };
    store.securityLockouts.push(entry);
  }

  if (success) {
    // Reset failed counter on success
    entry.failedAttempts = 0;
    entry.lockedUntil = null;
  } else {
    entry.failedAttempts = (entry.failedAttempts || 0) + 1;
    if (entry.failedAttempts >= 5) {
      // 15-minute IP lockout
      entry.lockedUntil = new Date(now + 15 * 60 * 1000).toISOString();
    }
  }

  saveLocalStore(store);

  recordAuditLog({
    userId: 'super_admin',
    action: success ? 'SUPER_ADMIN_LOGIN_SUCCESS' : 'SUPER_ADMIN_LOGIN_FAILURE',
    entityType: 'SECURITY_AUTH',
    metadata: {
      ip,
      email,
      failedAttempts: entry.failedAttempts,
      isLocked: !!entry.lockedUntil,
    },
  });
}

// ==========================================
// CATEGORY HELPERS
// ==========================================
export function getCategories(): CategoryBubble[] {
  const store = getLocalStore();
  return Array.isArray(store.categories) ? store.categories : DEFAULT_CATEGORIES;
}

export function saveCategories(categories: CategoryBubble[]): CategoryBubble[] {
  const store = getLocalStore();
  store.categories = categories;
  saveLocalStore(store);
  return store.categories;
}

export function resetCategories(): CategoryBubble[] {
  const store = getLocalStore();
  store.categories = DEFAULT_CATEGORIES;
  saveLocalStore(store);
  return store.categories;
}

// ==========================================
// HERO CONFIG HELPERS
// ==========================================
export function getHeroConfig(): HeroConfigData {
  const store = getLocalStore();
  return store.heroConfig || DEFAULT_HERO_CONFIG;
}

export function saveHeroConfig(newConfig: Partial<HeroConfigData>): HeroConfigData {
  const store = getLocalStore();
  store.heroConfig = {
    ...(store.heroConfig || DEFAULT_HERO_CONFIG),
    ...newConfig,
    updatedAt: new Date().toISOString(),
  };
  saveLocalStore(store);
  return store.heroConfig;
}

export function resetHeroConfig(): HeroConfigData {
  const store = getLocalStore();
  store.heroConfig = {
    ...DEFAULT_HERO_CONFIG,
    updatedAt: new Date().toISOString(),
  };
  saveLocalStore(store);
  return store.heroConfig;
}


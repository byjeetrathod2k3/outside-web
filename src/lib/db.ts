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
// SEED DATA & RESILIENT REPOSITORY
// ==========================================
export const INITIAL_DROP = {
  id: 'drop_001',
  dropNumber: 1,
  slug: 'drop-001-midnight-monolith',
  title: 'DROP 001 // MIDNIGHT MONOLITH',
  subtitle: '280 GSM Heavyweight French Terry Cotton. Serialized Edition of 250.',
  story: `Conceived at 3 AM in the brutalist corridors of Ahmedabad. DROP 001 explores the tension between architectural rigidity and tactile intimacy. Engineered from custom-milled 280 GSM organic long-staple combed cotton, double-bio-washed for a crisp yet lived-in drape. Each piece features reinforced split-side seams, distressed screen-printed typography on the nape, and a hand-numbered serial hem tag. Once the 250 units are claimed, this edition will be permanently sealed into The Vault.`,
  fabricSpecs: '280 GSM 100% Combed Organic Cotton · French Terry Weave · Pre-Shrunk & Bio-Washed · Ribbed Collar with Lycra Recovery · Made in Gujarat, India',
  pricePaise: 240000, // ₹2,400 (falls under 5% GST slab)
  currency: 'INR',
  totalEditionQty: 250,
  status: 'LIVE' as const,
  launchAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  soldOutAt: null as string | null,
  primaryImageUrl: '/images/drops/drop-001-main.jpg',
  galleryUrls: [
    '/images/drops/drop-001-main.jpg',
    '/images/drops/drop-001-back.jpg',
    '/images/drops/drop-001-detail1.jpg',
    '/images/drops/drop-001-detail2.jpg',
  ],
  isFeatured: true,
  seoTitle: 'DROP 001: Midnight Monolith T-Shirt — OUTSIDE India',
  seoDescription: 'Limited to 250 serialized pieces. 280 GSM heavyweight combed cotton oversized t-shirt designed and crafted in Gujarat, India. Wear your story.',
  canonicalUrl: 'https://www.outside.in',
  ogImageUrl: '/images/drops/drop-001-og.jpg',
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
    id: 'drop_000',
    dropNumber: 0,
    slug: 'drop-000-genesis-raw',
    title: 'DROP 000 // GENESIS PROTOTYPE',
    subtitle: 'Unbleached Organic Raw Cotton. Limited Prototype Run of 100.',
    story: 'The initial design manifesto. Hand-stitched label, raw edge cuffs, zero dye treatment.',
    pricePaise: 220000,
    totalEditionQty: 100,
    status: 'ARCHIVED' as const,
    launchAt: '2026-08-15T00:00:00.000Z',
    soldOutAt: '2026-08-15T04:22:18.000Z',
    primaryImageUrl: '/images/drops/drop-000-main.jpg',
    isFeatured: false,
  },
];

export const INITIAL_FAQS = [
  {
    id: 'faq_1',
    category: 'Drops & Editions',
    question: 'How do OUTSIDE drops work?',
    answer: 'We operate on a single-drop schedule. Each drop features exactly one silhouette, produced in a strictly capped, serialized edition (usually 100 to 250 pieces). Once an edition sells out, it will never be restocked or reissued; it moves permanently into The Vault.',
    sortOrder: 1,
  },
  {
    id: 'faq_2',
    category: 'GST & Invoicing',
    question: 'How is GST calculated on apparel orders?',
    answer: 'In compliance with Indian Tax Laws (HSN 6109 for cotton knitted t-shirts), items with a sale price up to ₹2,500 are charged 5% GST, while items above ₹2,500 are taxed at 18% GST. For deliveries within Gujarat (State Code 24), tax is split into CGST (2.5% / 9%) + SGST (2.5% / 9%). For all other states, IGST is applied.',
    sortOrder: 2,
  },
  {
    id: 'faq_3',
    category: 'Fit & Sizing',
    question: 'What is the Women-First fit philosophy?',
    answer: 'Rather than shrinking down a standard boxy men’s cut, our Women-first silhouettes are custom-patterned with proportioned shoulders, ergonomic armhole depth, and calibrated drape to achieve an authentic oversized aesthetic without overwhelming the frame.',
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

The weight creates an architectural drape—the t-shirt holds its boxy structure without sagging, creating clean, intentional silhouettes on both men and women.`,
    coverImageUrl: '/images/journal/journal-02.jpg',
    authorName: 'Studio Outside',
    publishedAt: '2026-11-15T12:00:00.000Z',
    status: 'PUBLISHED' as const,
  },
];

// Persistent File Store for Local Development without DB Server
const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

export function getLocalStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(STORE_PATH)) {
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
        invoiceCounter: 3,
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
      auditLogs: [
        {
          id: 'audit_init',
          action: 'SYSTEM_INITIALIZED',
          entityType: 'System',
          createdAt: new Date().toISOString(),
        },
      ],
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initialData, null, 2));
    return initialData;
  }

  try {
    const content = fs.readFileSync(STORE_PATH, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {
      drops: [INITIAL_DROP],
      orders: [],
      leads: [],
      faqs: INITIAL_FAQS,
      journal: INITIAL_JOURNAL,
      gstConfig: {},
      emailConfig: {},
      emailLogs: [],
      auditLogs: [],
    };
  }
}

export function saveLocalStore(data: any) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
}

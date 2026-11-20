import React from 'react';
import { notFound } from 'next/navigation';
import { getLocalStore } from '@/lib/db';
import type { Metadata } from 'next';

const STATIC_CMS_PAGES: Record<
  string,
  { title: string; subtitle: string; contentHtml: string }
> = {
  'size-guide': {
    title: 'SIZE & FIT MATRIX // 280 GSM SILHOUETTES',
    subtitle: 'Calibrated specifically for our Women-first and Men architectural oversized cuts.',
    contentHtml: `
      <h2>The Silhouette Architecture</h2>
      <p>All OUTSIDE garments feature an intentional architectural drape. We recommend selecting your true size for an authentic dropped-shoulder relaxed fit, or sizing down one step for a more classic structured fit.</p>
      
      <table style="width:100%; text-align:left; border-collapse:collapse; margin:24px 0;">
        <thead>
          <tr style="border-bottom: 1px solid #333; color: #D91E2A;">
            <th style="padding:10px;">SIZE</th>
            <th style="padding:10px;">CHEST (INCHES)</th>
            <th style="padding:10px;">LENGTH (INCHES)</th>
            <th style="padding:10px;">SHOULDER (INCHES)</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding:10px;">XS (Women)</td>
            <td style="padding:10px;">38 - 40"</td>
            <td style="padding:10px;">25.5"</td>
            <td style="padding:10px;">19.5"</td>
          </tr>
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding:10px;">S (Women / Men)</td>
            <td style="padding:10px;">41 - 43"</td>
            <td style="padding:10px;">26.5"</td>
            <td style="padding:10px;">20.5"</td>
          </tr>
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding:10px;">M (Women / Men)</td>
            <td style="padding:10px;">44 - 46"</td>
            <td style="padding:10px;">27.5"</td>
            <td style="padding:10px;">21.5"</td>
          </tr>
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding:10px;">L (Men)</td>
            <td style="padding:10px;">47 - 49"</td>
            <td style="padding:10px;">28.5"</td>
            <td style="padding:10px;">22.5"</td>
          </tr>
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding:10px;">XL (Men)</td>
            <td style="padding:10px;">50 - 52"</td>
            <td style="padding:10px;">29.5"</td>
            <td style="padding:10px;">23.5"</td>
          </tr>
        </tbody>
      </table>

      <h3>Care Instructions</h3>
      <p>Machine wash cold with like colors inside out. Do not tumble dry. Steam or low-heat iron on reverse side. Avoid ironing directly on screen-printed nape graphics.</p>
    `,
  },
  'shipping-returns': {
    title: 'EXPRESS SHIPPING & RETURNS POLICY',
    subtitle: 'Domestic Indian express transit and serialized exchange terms.',
    contentHtml: `
      <h2>Domestic Indian Shipping</h2>
      <p>All drops are dispatched within 24 hours of drop verification directly from our studio in Ahmedabad, Gujarat. We partner with Bluedart Air and Delhivery Express. Metro orders typically arrive within 2 business days; rest of India within 3-4 business days.</p>
      
      <h2>Tax Invoice Delivery</h2>
      <p>An official GST tax invoice with sequential financial year numbering (e.g. OUT/26-27/0001) is automatically generated and emailed immediately upon checkout completion, along with a printed physical invoice in your parcel.</p>

      <h2>7-Day Size Exchanges</h2>
      <p>Due to the limited 250-piece nature of our editions, returns for refund are not offered once an edition is sold out. However, if your garment does not fit as desired, we offer size exchanges within 7 days of delivery, subject to variant availability.</p>
    `,
  },
  'privacy-policy': {
    title: 'PRIVACY POLICY & DATA PROTECTION',
    subtitle: 'Transparent privacy standards adhering to Indian IT Act & DPDP Act guidelines.',
    contentHtml: `
      <h2>Data Collection & Purpose</h2>
      <p>OUTSIDE APPAREL STUDIO PVT LTD collects personal identification details (name, shipping address, telephone number, email) strictly to fulfill drop orders, calculate accurate Place of Supply GST, and transmit transactional order updates.</p>

      <h2>Payment Information Security</h2>
      <p>We do not store complete debit/credit card numbers or UPI PINs on our servers. All financial transactions are tokenized and processed through RBI-authorized payment aggregators.</p>
    `,
  },
  terms: {
    title: 'TERMS OF SERVICE',
    subtitle: 'Conditions governing purchase of limited serialized drops.',
    contentHtml: `
      <h2>Single-Drop Serialized Editions</h2>
      <p>All garments sold via www.outside.in are limited to the exact production run stated (e.g. 250 pieces). OUTSIDE reserves the right to cancel orders placed using automated purchasing scripts or bot networks to ensure fair collector allocation.</p>
    `,
  },
  'gst-compliance': {
    title: 'INDIAN APPAREL GST COMPLIANCE DISCLOSURE',
    subtitle: 'Comprehensive tax transparency under HSN 6109 and Gujarat State Code 24.',
    contentHtml: `
      <h2>Statutory Information</h2>
      <p><strong>Seller Legal Entity:</strong> OUTSIDE APPAREL STUDIO PVT LTD<br />
      <strong>Registered Address:</strong> Plot 104, Design District, SG Highway, Ahmedabad, Gujarat 380015<br />
      <strong>GSTIN:</strong> 24AABCO1234F1Z5<br />
      <strong>Primary HSN:</strong> 61091000 (Cotton Knitted/Crocheted T-Shirts)</p>

      <h2>Value-Based Slab Mechanics</h2>
      <p>In accordance with Indian GST regulations for apparel:<br />
      - For pieces with taxable sale value &le; ₹2,500: 5% GST is charged.<br />
      - For pieces with taxable sale value &gt; ₹2,500: 18% GST is charged.<br />
      - Deliveries inside Gujarat (24): Split 50% CGST + 50% SGST.<br />
      - Deliveries outside Gujarat: Charged as Integrated GST (IGST).</p>
    `,
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = STATIC_CMS_PAGES[slug];
  if (!page) return { title: 'Page Not Found' };
  return {
    title: `${page.title} | OUTSIDE`,
    description: page.subtitle,
  };
}

export default async function CmsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = STATIC_CMS_PAGES[slug];

  if (!page) {
    notFound();
  }

  return (
    <div className="bg-outside-black text-outside-chalk min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="border-b border-outside-border pb-8 space-y-3">
          <span className="text-xs font-mono text-outside-crimson uppercase tracking-widest">
            STUDIO POLICY &amp; DOCUMENTATION
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">
            {page.title}
          </h1>
          <p className="text-sm text-outside-muted font-sans leading-relaxed">
            {page.subtitle}
          </p>
        </div>

        <div
          className="prose prose-invert max-w-none text-outside-chalkDim text-sm sm:text-base leading-relaxed font-sans space-y-6"
          dangerouslySetInnerHTML={{ __html: page.contentHtml }}
        />

      </div>
    </div>
  );
}

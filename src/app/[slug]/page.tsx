import React from 'react';
import { notFound } from 'next/navigation';
import { getLocalStore } from '@/lib/db';
import { SectionHeading } from '@/components/ui/section-heading';
import type { Metadata } from 'next';

const STATIC_CMS_PAGES: Record<
  string,
  { title: string; subtitle: string; contentHtml: string }
> = {
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
    title: 'PRIVACY POLICY & DATA PROTECTION (DPDP ACT 2023)',
    subtitle: 'Transparent personal data governance adhering to the Digital Personal Data Protection Act, 2023 and IT Act, 2000.',
    contentHtml: `
      <h2>1. Digital Personal Data Protection (DPDP Act, 2023)</h2>
      <p>OUTSIDE APPAREL STUDIO PVT LTD ("OUTSIDE", "we", "us") values your privacy. We process personal data strictly on the basis of your explicit consent and for lawful purposes necessary to fulfill your limited-edition apparel orders.</p>

      <h2>2. Data Minimization & Collection Scope</h2>
      <p>We collect only strictly necessary information: Full Name, Delivery Address, Pincode, Email Address, and Phone Number. We do not collect excessive profiling data or invasive location coordinates.</p>

      <h2>3. Payment Data Tokenization</h2>
      <p>We do not store complete debit/credit card numbers, CVVs, or UPI PINs on our servers. All transactions are securely routed through RBI-authorized payment gateways utilizing end-to-end encryption.</p>

      <h2>4. Rights of Data Principals</h2>
      <p>Under the DPDP Act 2023, you hold the following rights:
      <br />• <strong>Right to Access:</strong> Request a summary of personal data held about you.
      <br />• <strong>Right to Correction & Erasure:</strong> Request correction of inaccurate data or legal erasure of your contact details once the order fulfillment and statutory return period concludes.
      <br />• <strong>Right to Grievance Redressal:</strong> Submit privacy concerns directly to our designated Grievance Officer.</p>

      <h2>5. Statutory Retention & Erasure Requests</h2>
      <p>Transactional invoice records (invoice number, value, HSN, tax split) are retained for 72 months to comply with Indian GST laws (Rule 56, CGST Rules 2017). Personal identifying information can be anonymized upon request by writing to <strong>grievance@outside.in</strong>.</p>
    `,
  },
  grievance: {
    title: 'GRIEVANCE REDRESSAL MECHANISM & OFFICER',
    subtitle: 'Statutory compliance under Rule 5(3)(b) of Consumer Protection (E-Commerce) Rules, 2020.',
    contentHtml: `
      <h2>Grievance Redressal Officer</h2>
      <p>In accordance with the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong> and the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>, the details of our Grievance Officer are set out below:</p>

      <table style="width:100%; text-align:left; border-collapse:collapse; margin:24px 0; font-family: monospace; font-size: 13px;">
        <tbody>
          <tr style="border-bottom: 1px solid #E7E2DA;">
            <td style="padding:10px; font-weight:bold; width:35%;">Name</td>
            <td style="padding:10px;">Mr. Rohan Mehta</td>
          </tr>
          <tr style="border-bottom: 1px solid #E7E2DA;">
            <td style="padding:10px; font-weight:bold;">Designation</td>
            <td style="padding:10px;">Grievance Redressal Officer & Head of Operations</td>
          </tr>
          <tr style="border-bottom: 1px solid #E7E2DA;">
            <td style="padding:10px; font-weight:bold;">Legal Entity</td>
            <td style="padding:10px;">OUTSIDE APPAREL STUDIO PVT LTD</td>
          </tr>
          <tr style="border-bottom: 1px solid #E7E2DA;">
            <td style="padding:10px; font-weight:bold;">Registered Office</td>
            <td style="padding:10px;">Plot 104, Design District, SG Highway, Ahmedabad, Gujarat 380015, India</td>
          </tr>
          <tr style="border-bottom: 1px solid #E7E2DA;">
            <td style="padding:10px; font-weight:bold;">Email Address</td>
            <td style="padding:10px;"><a href="mailto:grievance@outside.in" style="color:#D91E2A;">grievance@outside.in</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #E7E2DA;">
            <td style="padding:10px; font-weight:bold;">Direct Phone</td>
            <td style="padding:10px;">+91 79 4000 8920 (Mon–Fri, 10:00 AM – 6:00 PM IST)</td>
          </tr>
          <tr style="border-bottom: 1px solid #E7E2DA;">
            <td style="padding:10px; font-weight:bold;">Acknowledgment SLA</td>
            <td style="padding:10px;">Within 48 business hours</td>
          </tr>
          <tr style="border-bottom: 1px solid #E7E2DA;">
            <td style="padding:10px; font-weight:bold;">Resolution SLA</td>
            <td style="padding:10px;">Within 30 calendar days from receipt of grievance</td>
          </tr>
        </tbody>
      </table>

      <h2>How to File a Grievance</h2>
      <p>1. Send an email to <strong>grievance@outside.in</strong> detailing your Order Number (e.g., ORD-2026-0001), Registered Email, and the nature of your concern.<br />
      2. Our team will issue a unique Ticket Reference Number within 48 hours.<br />
      3. A full investigation will be conducted and resolution communicated in writing within 30 days.</p>
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
    subtitle: 'Comprehensive tax transparency under HSN 6109 and Indian GST statutory regulations.',
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
      - All displayed storefront prices are 100% inclusive of GST.<br />
      - Official sequential GST tax invoices are generated automatically for every order.</p>
    `,
  },
};

export function generateStaticParams() {
  return Object.keys(STATIC_CMS_PAGES).map((slug) => ({
    slug,
  }));
}

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
    <div className="bg-outside-bg text-outside-text min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="border-b border-outside-border pb-8">
          <SectionHeading
            align="left"
            eyebrow="STUDIO POLICY &amp; DOCUMENTATION"
            title={page.title}
            description={page.subtitle}
          />
        </div>

        <div className="bg-white border border-outside-border p-8 sm:p-12 shadow-luxury">
          <div
            className="prose prose-stone max-w-none text-outside-inkSecondary text-sm sm:text-base leading-relaxed font-sans space-y-6"
            dangerouslySetInnerHTML={{ __html: page.contentHtml }}
          />
        </div>

      </div>
    </div>
  );
}

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/cart-context';
import { GlobalHeader } from '@/components/layout/header';
import { GlobalFooter } from '@/components/layout/footer';
import { CartDrawer } from '@/components/commerce/cart-drawer';
import { CookieConsent } from '@/components/layout/cookie-consent';
import { WhatsAppConcierge } from '@/components/layout/whatsapp-concierge';
import { StorefrontWrapper } from '@/components/layout/storefront-wrapper';
import { getThemeConfig, getFeatureFlags } from '@/lib/db';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.outside.in'),
  title: {
    default: 'OUTSIDE // Wear Your Story — Limited Serialized Drops',
    template: '%s | OUTSIDE India',
  },
  description:
    'Luxury streetwear engineered with 280 GSM combed organic cotton in Gujarat, India. Single-drop serialized editions capped at 250 pieces. Women-first fit philosophy.',
  keywords: [
    'OUTSIDE',
    'Wear Your Story',
    'Streetwear India',
    'Limited Edition T-Shirt',
    '280 GSM Cotton T-shirt',
    'Luxury Streetwear Ahmedabad',
    'Single Drop Apparel',
    'Better Days Ahead T-Shirt',
    'Heavyweight French Terry',
    'Women Oversized T-Shirt',
  ],
  authors: [{ name: 'OUTSIDE Apparel Studio', url: 'https://www.outside.in' }],
  creator: 'OUTSIDE APPAREL STUDIO PVT LTD',
  publisher: 'OUTSIDE APPAREL STUDIO PVT LTD',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.outside.in',
    title: 'OUTSIDE // Wear Your Story',
    description:
      'Single-drop limited serialized luxury apparel. 280 GSM French Terry engineered in Gujarat, India.',
    siteName: 'OUTSIDE',
    images: [
      {
        url: '/images/drops/drop-001-front.jpg',
        width: 1200,
        height: 1500,
        alt: 'OUTSIDE DROP 001 - Better Days Ahead',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OUTSIDE // Wear Your Story',
    description:
      'Limited serialized drops. 280 GSM French Terry cotton t-shirts crafted in Gujarat.',
    images: ['/images/drops/drop-001-front.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#FAF9F6',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-Side Dynamic Theme & Flag Resolution (Zero-FOUC)
  const theme = getThemeConfig();
  const flags = getFeatureFlags();

  const maintenanceFlag = flags.find((f: any) => f.key === 'enable_maintenance_mode');
  const isMaintenance = maintenanceFlag?.isEnabled || false;
  const maintenanceConfig = maintenanceFlag?.configJson || {};

  const cookieConsent = flags.find((f: any) => f.key === 'enable_cookie_consent')?.isEnabled !== false;

  // Generate Zero-FOUC SSR Style Injection
  const dynamicThemeCss = `
:root {
  --bg-canvas: ${theme.canvasColor};
  --bg-surface: ${theme.surfaceColor};
  --bg-elevated: ${theme.elevatedColor};
  --border-hairline: ${theme.borderColor};
  --ink-primary: ${theme.inkPrimaryColor};
  --ink-secondary: ${theme.inkSecondaryColor};
  --accent-primary: ${theme.accentPrimaryColor};
  --accent-secondary: ${theme.accentSecondaryColor};
  --border-radius: ${theme.borderRadius || '0px'};
  --hairline-width: ${theme.hairlineGrid !== false ? '1px' : '0px'};

  --canvas: ${theme.canvasColor};
  --surface: ${theme.surfaceColor};
  --elevated: ${theme.elevatedColor};
  --border: ${theme.borderColor};
  --ink: ${theme.inkPrimaryColor};
  --accent: ${theme.accentPrimaryColor};
  --moss: ${theme.accentSecondaryColor};
}
`;

  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'OUTSIDE APPAREL STUDIO PVT LTD',
    alternateName: 'OUTSIDE',
    url: 'https://www.outside.in',
    logo: `https://www.outside.in${theme.logoUrl || '/images/OUTSIDE_icon.png'}`,
    description:
      'Limited-edition single-drop luxury streetwear brand based in Ahmedabad, Gujarat, India.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plot 104, Design District, SG Highway',
      addressLocality: 'Ahmedabad',
      addressRegion: 'Gujarat',
      postalCode: '380015',
      addressCountry: 'IN',
    },
    taxID: '24AABCO1234F1Z5',
    currenciesAccepted: 'INR',
    priceRange: '₹₹',
    foundingLocation: {
      '@type': 'Place',
      name: 'Ahmedabad, Gujarat, India',
    },
  };

  return (
    <html lang="en" className="light">
      <head>
        <style id="dynamic-theme" dangerouslySetInnerHTML={{ __html: dynamicThemeCss }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="min-h-screen bg-outside-canvas text-outside-ink flex flex-col antialiased selection:bg-outside-accent selection:text-white">
        <StorefrontWrapper maintenanceMode={isMaintenance} maintenanceConfig={maintenanceConfig}>
          <CartProvider>
            <GlobalHeader initialTheme={theme} initialFlags={flags} />
            <main className="flex-1">{children}</main>
            <CartDrawer />
            <GlobalFooter />
            <WhatsAppConcierge />
            {cookieConsent && <CookieConsent />}
          </CartProvider>
        </StorefrontWrapper>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/cart-context';
import { GlobalHeader } from '@/components/layout/header';
import { GlobalFooter } from '@/components/layout/footer';
import { CartDrawer } from '@/components/commerce/cart-drawer';

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
    'Streetwear India',
    'Limited Edition T-Shirt',
    '280 GSM Cotton T-shirt',
    'Luxury Streetwear Ahmedabad',
    'Single Drop Apparel',
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
        url: '/images/drops/drop-001-main.jpg',
        width: 1200,
        height: 1500,
        alt: 'OUTSIDE DROP 001 - Midnight Monolith',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OUTSIDE // Wear Your Story',
    description:
      'Limited serialized drops. 280 GSM French Terry cotton t-shirts crafted in Gujarat.',
    images: ['/images/drops/drop-001-main.jpg'],
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
  themeColor: '#080808',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'OUTSIDE APPAREL STUDIO PVT LTD',
    alternateName: 'OUTSIDE',
    url: 'https://www.outside.in',
    logo: 'https://www.outside.in/images/OUTSIDE_logo_transparent.png',
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
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="min-h-screen bg-outside-black text-outside-chalk flex flex-col antialiased selection:bg-outside-crimson selection:text-white">
        <CartProvider>
          <GlobalHeader />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <GlobalFooter />
        </CartProvider>
      </body>
    </html>
  );
}

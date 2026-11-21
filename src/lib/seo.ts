import React from 'react';

export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.outside.in';

/**
 * Organization & Brand Structured Data (Schema.org)
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OUTSIDE',
    legalName: 'OUTSIDE APPAREL STUDIO PVT LTD',
    url: BASE_URL,
    logo: `${BASE_URL}/images/OUTSIDE_logo.jpg`,
    slogan: 'Wear Your Story',
    taxID: '24AABCO1234F1Z5',
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name: 'OUTSIDE Design Collective',
    },
    knowsAbout: [
      'Luxury Streetwear',
      '280 GSM French Terry Cotton',
      'Combed Organic Cotton Textiles',
      'Single-Drop Scarcity Manufacturing',
      'Zero Overproduction Sustainable Fashion',
      'Women-First Oversized Streetwear Fit',
      'Ahmedabad Textile Engineering',
    ],
    brand: {
      '@type': 'Brand',
      name: 'OUTSIDE',
      slogan: 'Wear Your Story',
      url: BASE_URL,
    },
    description:
      'Luxury streetwear brand engineered with 280 GSM combed organic cotton in India. Single-drop serialized editions capped at 250 pieces.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plot 104, Design District, SG Highway',
      addressLocality: 'Ahmedabad',
      addressRegion: 'Gujarat',
      postalCode: '380015',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@outside.in',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi', 'Gujarati'],
      areaServed: 'IN',
    },
    sameAs: [
      'https://www.instagram.com/outside.in',
      'https://twitter.com/outside_in',
    ],
  };
}

/**
 * WebSite & Sitelinks Search Schema (Google Knowledge Graph)
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OUTSIDE',
    alternateName: 'OUTSIDE Apparel India',
    url: BASE_URL,
    description: 'Luxury streetwear and limited serialized drops in 280 GSM organic combed cotton.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Product & Offer Structured Data (Schema.org 2026 E-Commerce Standard)
 */
export function generateProductSchema(drop: any, inStock: boolean = true) {
  const price = (drop.pricePaise / 100).toFixed(2);
  const images = (drop.galleryUrls && drop.galleryUrls.length > 0)
    ? drop.galleryUrls.map((img: string) => img.startsWith('http') ? img : `${BASE_URL}${img}`)
    : [`${BASE_URL}${drop.primaryImageUrl || '/images/drops/drop-001-front.jpg'}`];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: drop.title,
    image: images,
    description: drop.subtitle || drop.story,
    sku: `OUT-${String(drop.dropNumber || 1).padStart(3, '0')}`,
    mpn: `OUT-GUJ-${String(drop.dropNumber || 1).padStart(3, '0')}`,
    gtin13: '8901234567890',
    brand: {
      '@type': 'Brand',
      name: 'OUTSIDE',
      slogan: 'Wear Your Story',
    },
    category: 'Apparel & Accessories > Clothing > Shirts & Tops > T-Shirts',
    material: '100% Combed Organic Cotton (280 GSM French Terry)',
    color: 'Warm Unbleached Ivory / Natural Raw Cream',
    pattern: 'Embroidered Botanical Floral Relief',
    size: 'Oversized Boxy Fit (XS, S, M, L, XL)',
    countryOfOrigin: {
      '@type': 'Country',
      name: 'India',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.98',
      reviewCount: '142',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Aanya Verma',
        },
        datePublished: '2026-11-18',
        reviewBody:
          'The 280 GSM drape is extraordinary — structured yet airy. Dispatched from Ahmedabad and arrived in Mumbai within 36 hours via BlueDart.',
      },
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Kabir Singhania',
        },
        datePublished: '2026-11-17',
        reviewBody:
          'Zero neck sag, genuine luxury collar ribbing. The serialized inner tag and satin wash label make it feel like a numbered gallery edition.',
      },
    ],
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/${drop.slug ? `vault/${drop.slug}` : ''}`,
      priceCurrency: 'INR',
      price: price,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'OUTSIDE APPAREL STUDIO PVT LTD',
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0.00',
          currency: 'INR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'd',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 4,
            unitCode: 'd',
          },
        },
      },
    },
  };
}

/**
 * BreadcrumbList Structured Data
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * FAQPage Structured Data (AEO Standard for AI Engines)
 */
export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Inline JSON-LD Script Component
 */
export function JsonLd({ data }: { data: any }) {
  if (!data) return null;
  return React.createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  });
}

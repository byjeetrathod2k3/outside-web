import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateOrganizationSchema,
  generateProductSchema,
  generateBreadcrumbSchema,
  generateFaqSchema,
} from '../src/lib/seo';
import {
  checkLoginRateLimit,
  recordLoginAttempt,
  getAdminBasePath,
  getSeoConfig,
  saveSeoConfig,
  resetSeoConfig,
} from '../src/lib/db';

describe('Module 3: Technical SEO & E-Commerce Structured Data (2026)', () => {
  it('generates valid Organization and Brand JSON-LD schema', () => {
    const schema = generateOrganizationSchema() as any;
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Organization');
    expect(schema.name).toBe('OUTSIDE');
    expect(schema.url).toBe('https://www.outside.in');
    expect(schema.logo).toContain('/images/OUTSIDE_logo.jpg');
    expect(schema.brand['@type']).toBe('Brand');
    expect(schema.brand.name).toBe('OUTSIDE');
    expect(schema.brand.slogan).toBe('Wear Your Story');
    expect(schema.address.addressRegion).toBe('Gujarat');
    expect(schema.address.addressCountry).toBe('IN');
  });

  it('generates valid Product & Offer schema with InStock availability for live drops', () => {
    const mockDrop = {
      title: 'DROP 001 // BETTER DAYS AHEAD',
      subtitle: 'Raw Silk Off-White 280 GSM French Terry Cotton.',
      slug: 'drop-001-better-days-ahead',
      primaryImageUrl: '/images/drops/drop-001-front.jpg',
      pricePaise: 240000,
      totalEditionQty: 250,
      fabricSpecs: '280 GSM Combed Cotton',
    };

    const schema = generateProductSchema(mockDrop, true) as any;
    expect(schema['@type']).toBe('Product');
    expect(schema.name).toBe(mockDrop.title);
    expect(schema.sku).toBe('OUT-001');
    expect(schema.offers['@type']).toBe('Offer');
    expect(schema.offers.price).toBe('2400.00');
    expect(schema.offers.priceCurrency).toBe('INR');
    expect(schema.offers.availability).toBe('https://schema.org/InStock');
    expect(schema.offers.hasMerchantReturnPolicy).toBeDefined();
    expect(schema.offers.shippingDetails).toBeDefined();
  });

  it('generates OutOfStock availability for archived vault drops', () => {
    const mockVaultDrop = {
      title: 'DROP 002 // DESERT MIRAGE',
      subtitle: 'Sun-Faded Terracotta 280 GSM.',
      slug: 'drop-002-desert-mirage',
      primaryImageUrl: '/images/drops/drop-002-front.jpg',
      pricePaise: 240000,
      totalEditionQty: 250,
      fabricSpecs: '280 GSM Combed Cotton',
    };

    const schema = generateProductSchema(mockVaultDrop, false) as any;
    expect(schema.offers.availability).toBe('https://schema.org/OutOfStock');
  });

  it('generates BreadcrumbList schema with exact ordered positions', () => {
    const items = [
      { name: 'Home', url: 'https://www.outside.in' },
      { name: 'The Vault', url: 'https://www.outside.in/vault' },
      { name: 'DROP 001', url: 'https://www.outside.in/vault/drop-001' },
    ];

    const schema = generateBreadcrumbSchema(items) as any;
    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement).toHaveLength(3);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[0].name).toBe('Home');
    expect(schema.itemListElement[2].position).toBe(3);
    expect(schema.itemListElement[2].name).toBe('DROP 001');
  });

  it('generates FAQPage schema with Questions and Answers', () => {
    const faqs = [
      { question: 'What is 280 GSM?', answer: 'Heavyweight organic cotton knit.' },
      { question: 'Where do you ship from?', answer: 'Ahmedabad, Gujarat.' },
    ];

    const schema = generateFaqSchema(faqs) as any;
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(2);
    expect(schema.mainEntity[0]['@type']).toBe('Question');
    expect(schema.mainEntity[0].name).toBe('What is 280 GSM?');
    expect(schema.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe('Heavyweight organic cotton knit.');
  });
});

describe('Module 3: Stealth Super Admin & Login Rate Limiter', () => {
  const testIp = '192.168.1.99';

  beforeEach(() => {
    // Reset test IP state by recording a success
    recordLoginAttempt(testIp, 'admin@outside.in', true);
  });

  it('resolves the stealth admin base path', () => {
    const basePath = getAdminBasePath();
    expect(basePath).toBeDefined();
    expect(basePath.startsWith('/')).toBe(true);
    expect(basePath).toContain('outside-studio-ops');
  });

  it('enforces 5-attempt threshold and locks out on 5th consecutive failure', () => {
    // Attempt 1 failure
    recordLoginAttempt(testIp, 'admin@outside.in', false);
    let status = checkLoginRateLimit(testIp);
    expect(status.allowed).toBe(true);
    expect(status.remainingAttempts).toBe(4);

    // Attempts 2, 3, 4
    recordLoginAttempt(testIp, 'admin@outside.in', false);
    recordLoginAttempt(testIp, 'admin@outside.in', false);
    recordLoginAttempt(testIp, 'admin@outside.in', false);
    status = checkLoginRateLimit(testIp);
    expect(status.allowed).toBe(true);
    expect(status.remainingAttempts).toBe(1);

    // Attempt 5 -> lockout triggered
    recordLoginAttempt(testIp, 'admin@outside.in', false);
    status = checkLoginRateLimit(testIp);
    expect(status.allowed).toBe(false);
    expect(status.remainingAttempts).toBe(0);
    expect(status.lockoutRemainingSeconds).toBeGreaterThan(0);
    expect(status.lockoutRemainingSeconds).toBeLessThanOrEqual(15 * 60);

    // Successful login clears the lockout
    recordLoginAttempt(testIp, 'admin@outside.in', true);
    status = checkLoginRateLimit(testIp);
    expect(status.allowed).toBe(true);
    expect(status.remainingAttempts).toBe(5);
  });

  it('loads and persists dynamic SEO & crawler configuration', () => {
    const initial = getSeoConfig();
    expect(initial.crawlerPolicies).toBeDefined();
    expect(initial.crawlerPolicies.googlebot).toBe(true);
    expect(initial.crawlerPolicies.oaiSearch).toBe(true);

    // Save partial update
    const updated = saveSeoConfig({
      defaultTitle: 'OUTSIDE // Wear Your Story — Ahmedabad Atelier',
    });
    expect(updated.defaultTitle).toBe('OUTSIDE // Wear Your Story — Ahmedabad Atelier');

    // Reset back
    const restored = resetSeoConfig();
    expect(restored.defaultTitle).toContain('OUTSIDE // Wear Your Story');
  });
});

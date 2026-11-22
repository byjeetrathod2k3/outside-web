import { describe, it, expect, beforeEach } from 'vitest';
import {
  getLayoutConfig,
  saveLayoutConfig,
  resetLayoutConfig,
  getAdminBasePath,
  updateStealthAdminPath,
  getSecurityLockouts,
  clearSecurityLockouts,
  recordLoginAttempt,
  checkLoginRateLimit,
  getLocalStore,
} from '../src/lib/db';
import { generateProductSchema, generateFaqSchema } from '../src/lib/seo';

describe('Layout Section Customization & Admin Stealth Security', () => {
  beforeEach(() => {
    resetLayoutConfig();
    clearSecurityLockouts();
  });

  describe('Card Count & Section Settings Persistence', () => {
    it('initializes with default card count of 3 for active drops section', () => {
      const layout = getLayoutConfig();
      const dropsSec = layout.sections.find((s) => s.id === 'drops');
      expect(dropsSec).toBeDefined();
      expect(dropsSec?.settings?.defaultCardCount).toBe(3);
      expect(dropsSec?.settings?.defaultFilter).toBe('ALL');
      expect(dropsSec?.settings?.showCategoryBubbles).toBe(true);
    });

    it('persists customized defaultCardCount (e.g. 2, 4, 6 or 0 for All) and filter settings', () => {
      const layout = getLayoutConfig();
      const updatedSections = layout.sections.map((sec) =>
        sec.id === 'drops'
          ? {
              ...sec,
              settings: {
                ...sec.settings,
                defaultCardCount: 2,
                defaultFilter: 'LIVE',
                eyebrow: 'EXCLUSIVE STUDIO DROPS',
                title: 'Limited Capped Editions',
              },
            }
          : sec
      );

      saveLayoutConfig({ sections: updatedSections });

      const reloaded = getLayoutConfig();
      const dropsSec = reloaded.sections.find((s) => s.id === 'drops');
      expect(dropsSec?.settings?.defaultCardCount).toBe(2);
      expect(dropsSec?.settings?.defaultFilter).toBe('LIVE');
      expect(dropsSec?.settings?.eyebrow).toBe('EXCLUSIVE STUDIO DROPS');
    });

    it('allows configuring vault card limit without affecting main drop section', () => {
      const layout = getLayoutConfig();
      const updatedSections = layout.sections.map((sec) =>
        sec.id === 'vault'
          ? {
              ...sec,
              settings: {
                ...sec.settings,
                defaultCardCount: 4,
                title: 'Archival Numbered Vault',
              },
            }
          : sec
      );

      saveLayoutConfig({ sections: updatedSections });

      const reloaded = getLayoutConfig();
      const vaultSec = reloaded.sections.find((s) => s.id === 'vault');
      expect(vaultSec?.settings?.defaultCardCount).toBe(4);
      expect(vaultSec?.settings?.title).toBe('Archival Numbered Vault');
    });
  });

  describe('Stealth Admin Gateway URL & Security Lockdown Governance', () => {
    it('retrieves the active stealth admin gateway path', () => {
      const basePath = getAdminBasePath();
      expect(basePath).toBeDefined();
      expect(basePath.startsWith('/')).toBe(true);
    });

    it('persists updated custom stealth path and formats with leading slash', () => {
      const updated = updateStealthAdminPath('studio-ops-gate');
      expect(updated).toBe('/studio-ops-gate');
      expect(getAdminBasePath()).toBe('/studio-ops-gate');

      // Revert back
      updateStealthAdminPath('/sys-admin-gate');
      expect(getAdminBasePath()).toBe('/sys-admin-gate');
    });

    it('tracks IP lockouts on consecutive failures and allows 1-click administrative reset', () => {
      const testIp = '10.0.0.99';
      // Simulate 5 failed login attempts
      for (let i = 0; i < 5; i++) {
        recordLoginAttempt(testIp, 'admin@outside.in', false);
      }

      const status = checkLoginRateLimit(testIp);
      expect(status.allowed).toBe(false);

      const lockouts = getSecurityLockouts();
      const lockedEntry = lockouts.find((l) => l.ip === testIp);
      expect(lockedEntry).toBeDefined();
      expect(lockedEntry?.failedAttempts).toBe(5);

      // Reset all lockouts
      clearSecurityLockouts(testIp);
      const afterClear = checkLoginRateLimit(testIp);
      expect(afterClear.allowed).toBe(true);
      expect(afterClear.remainingAttempts).toBe(5);
    });
  });

  describe('SEO & AEO Schema Protection with Dynamic Card Slicing', () => {
    it('preserves complete Product and Offer structured data schemas', () => {
      const store = getLocalStore();
      const drop = store.drops[0];
      const schema = generateProductSchema(drop, true) as any;

      expect(schema['@type']).toBe('Product');
      expect(schema.name).toBe(drop.title);
      expect(schema.offers.price).toBeDefined();
      expect(schema.offers.availability).toBe('https://schema.org/InStock');
      expect(schema.offers.hasMerchantReturnPolicy).toBeDefined();
      expect(schema.offers.shippingDetails).toBeDefined();
    });

    it('preserves complete FAQPage schema for Google AI Search engines regardless of visual display limit', () => {
      const faqs = [
        { question: 'Q1', answer: 'A1' },
        { question: 'Q2', answer: 'A2' },
        { question: 'Q3', answer: 'A3' },
        { question: 'Q4', answer: 'A4' },
      ];
      const schema = generateFaqSchema(faqs) as any;

      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity).toHaveLength(4);
    });
  });
});

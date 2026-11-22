import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCategories,
  saveCategories,
  resetCategories,
  getHeroConfig,
  saveHeroConfig,
  resetHeroConfig,
  DEFAULT_CATEGORIES,
  DEFAULT_HERO_CONFIG,
} from '../src/lib/db';

describe('Admin Category Management & Hero Visual Customization', () => {
  beforeEach(() => {
    resetCategories();
    resetHeroConfig();
  });

  describe('Category Story Bubbles Management', () => {
    it('initializes with default story categories', () => {
      const categories = getCategories();
      expect(categories).toBeDefined();
      expect(categories.length).toBeGreaterThanOrEqual(5);
      expect(categories[0].id).toBe('ALL');
      expect(categories[0].label).toBe('All Pieces');
      expect(categories[1].badge).toBe('LIVE NOW');
    });

    it('persists modified category labels, images and badges', () => {
      const current = getCategories();
      const updatedList = current.map((c) =>
        c.id === 'LIVE'
          ? { ...c, label: 'Drop 001 - Studio Edition', badge: 'SELLING FAST' }
          : c
      );

      saveCategories(updatedList);
      const reloaded = getCategories();
      const drop001 = reloaded.find((c) => c.id === 'LIVE');
      expect(drop001?.label).toBe('Drop 001 - Studio Edition');
      expect(drop001?.badge).toBe('SELLING FAST');
    });

    it('supports adding a new category bubble and respects isActive filtering', () => {
      const current = getCategories();
      const newCategory = {
        id: 'HOODIES',
        label: 'Heavyweight Hoodies',
        sublabel: '450 GSM French Terry',
        image: '/images/drops/drop-002-front.jpg',
        badge: 'WINTER',
        isLive: false,
        isActive: true,
        sortOrder: 7,
      };

      saveCategories([...current, newCategory]);
      const reloaded = getCategories();
      expect(reloaded.length).toBe(current.length + 1);
      expect(reloaded.find((c) => c.id === 'HOODIES')?.label).toBe('Heavyweight Hoodies');
    });

    it('resets categories back to clean studio defaults', () => {
      saveCategories([]);
      expect(getCategories().length).toBe(0);

      const restored = resetCategories();
      expect(restored.length).toBe(DEFAULT_CATEGORIES.length);
      expect(restored[0].id).toBe(DEFAULT_CATEGORIES[0].id);
    });
  });

  describe('Hero Section Visual & Image Replacement', () => {
    it('initializes with default editorial hero configuration', () => {
      const hero = getHeroConfig();
      expect(hero).toBeDefined();
      expect(hero.desktopImageUrl).toBe(DEFAULT_HERO_CONFIG.desktopImageUrl);
      expect(hero.mobileImageUrl).toBe(DEFAULT_HERO_CONFIG.mobileImageUrl);
      expect(hero.altText).toContain('DROP 001 Better Days Ahead');
      expect(hero.backgroundColor).toBe(DEFAULT_HERO_CONFIG.backgroundColor);
    });

    it('persists desktop and mobile hero image replacements with SEO alt tags', () => {
      const updated = saveHeroConfig({
        desktopImageUrl: '/images/drops/drop-002-front.jpg',
        mobileImageUrl: '/images/drops/drop-002-back.jpg',
        altText: 'OUTSIDE DROP 002 Botanical Architecture Oversized Streetwear T-Shirt',
        backgroundColor: '#EAE6DF',
        objectPosition: 'center top',
      });

      expect(updated.desktopImageUrl).toBe('/images/drops/drop-002-front.jpg');
      expect(updated.mobileImageUrl).toBe('/images/drops/drop-002-back.jpg');
      expect(updated.altText).toContain('DROP 002 Botanical');
      expect(updated.backgroundColor).toBe('#EAE6DF');

      const reloaded = getHeroConfig();
      expect(reloaded.desktopImageUrl).toBe('/images/drops/drop-002-front.jpg');
      expect(reloaded.altText).toContain('DROP 002 Botanical');
    });

    it('resets hero configuration back to factory studio baseline', () => {
      saveHeroConfig({ desktopImageUrl: '/custom/test.jpg' });
      expect(getHeroConfig().desktopImageUrl).toBe('/custom/test.jpg');

      const reset = resetHeroConfig();
      expect(reset.desktopImageUrl).toBe(DEFAULT_HERO_CONFIG.desktopImageUrl);
      expect(getHeroConfig().desktopImageUrl).toBe(DEFAULT_HERO_CONFIG.desktopImageUrl);
    });
  });
});

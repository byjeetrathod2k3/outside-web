import { describe, it, expect } from 'vitest';
import {
  getThemeConfig,
  saveThemeConfig,
  resetThemeConfig,
  getFeatureFlags,
  getFeatureFlag,
  isFeatureEnabled,
  updateFeatureFlag,
  resetFeatureFlags,
  getLayoutConfig,
  saveLayoutConfig,
  resetLayoutConfig,
  DEFAULT_THEME_CONFIG,
} from '../src/lib/db';

describe('Module 2: Dynamic Theme, Feature Flags & Layout Governance', () => {
  describe('Theme Governance', () => {
    it('returns Sun-Bleached Gallery as default theme baseline', () => {
      const theme = getThemeConfig();
      expect(theme.canvasColor).toBe('#F7F5F0');
      expect(theme.inkPrimaryColor).toBe('#111110');
      expect(theme.accentPrimaryColor).toBe('#B82328');
    });

    it('persists theme updates and allows full reset to defaults', () => {
      saveThemeConfig({ canvasColor: '#FAFAFA' });
      expect(getThemeConfig().canvasColor).toBe('#FAFAFA');

      resetThemeConfig();
      expect(getThemeConfig().canvasColor).toBe(DEFAULT_THEME_CONFIG.canvasColor);
    });
  });

  describe('Feature Flag Governance', () => {
    it('reads all default single-drop and site-wide feature flags', () => {
      const flags = getFeatureFlags();
      expect(flags.length).toBeGreaterThanOrEqual(10);

      expect(isFeatureEnabled('enable_countdown_timer')).toBe(true);
      expect(isFeatureEnabled('enable_live_stock_counter')).toBe(true);
      expect(isFeatureEnabled('enable_fit_toggle')).toBe(true);
      expect(isFeatureEnabled('enable_sticky_drop_bar')).toBe(true);
      expect(isFeatureEnabled('enable_checkout_flow')).toBe(true);
    });

    it('allows toggling flags and saving specific configuration metadata', () => {
      updateFeatureFlag('enable_maintenance_mode', true, { headline: 'UPCOMING DROP' });
      expect(isFeatureEnabled('enable_maintenance_mode')).toBe(true);
      expect(getFeatureFlag('enable_maintenance_mode')?.configJson?.headline).toBe('UPCOMING DROP');

      // Reset
      resetFeatureFlags();
      expect(isFeatureEnabled('enable_maintenance_mode')).toBe(false);
    });
  });

  describe('Layout & Responsive Governance', () => {
    it('reads default section order and grid densities', () => {
      resetLayoutConfig();
      const layout = getLayoutConfig();
      expect(layout.sections.length).toBe(9);
      expect(layout.sections[0].id).toBe('hero');
      expect(layout.gridColumns.vault.desktop).toBe(3);
    });

    it('persists section reordering and allows full rollback', () => {
      const current = getLayoutConfig();
      const reversedSections = [...current.sections].reverse();
      saveLayoutConfig({ sections: reversedSections });
      expect(getLayoutConfig().sections[0].id).toBe(reversedSections[0].id);

      resetLayoutConfig();
      expect(getLayoutConfig().sections[0].id).toBe('hero');
    });

    it('persists grid column breakpoint densities and mobile sticky cta position', () => {
      saveLayoutConfig({
        gridColumns: {
          vault: { mobile: 2, tablet: 2, desktop: 4 },
          lookbook: { mobile: 1, desktop: 2 },
        },
        mobileStickyCtaPosition: 'inline',
      });
      const updated = getLayoutConfig();
      expect(updated.gridColumns.vault.desktop).toBe(4);
      expect(updated.gridColumns.vault.mobile).toBe(2);
      expect(updated.mobileStickyCtaPosition).toBe('inline');
    });
  });
});

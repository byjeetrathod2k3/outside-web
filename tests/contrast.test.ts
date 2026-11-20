import { describe, it, expect } from 'vitest';
import {
  parseHexColor,
  getRelativeLuminance,
  getContrastRatio,
  evaluateWcagCompliance,
} from '../src/lib/contrast';

describe('WCAG 2.2 Relative Luminance and Contrast Engine', () => {
  it('correctly parses 6-digit and 3-digit hex colors', () => {
    expect(parseHexColor('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseHexColor('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(parseHexColor('#FFF')).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseHexColor('#B82328')).toEqual({ r: 184, g: 35, b: 40 });
    expect(parseHexColor('invalid')).toBeNull();
  });

  it('calculates relative luminance accurately according to sRGB gamma', () => {
    expect(getRelativeLuminance(255, 255, 255)).toBeCloseTo(1.0, 2);
    expect(getRelativeLuminance(0, 0, 0)).toBeCloseTo(0.0, 2);
  });

  it('calculates accurate contrast ratios', () => {
    // Black on white should be 21:1
    const blackOnWhite = getContrastRatio('#000000', '#FFFFFF');
    expect(blackOnWhite).toBe(21);

    // Same color on same color should be 1:1
    const whiteOnWhite = getContrastRatio('#FFFFFF', '#FFFFFF');
    expect(whiteOnWhite).toBe(1);

    // Sun-Bleached Gallery default pairing: Obsidian Carbon (#111110) on Warm Alabaster (#F7F5F0)
    const galleryContrast = getContrastRatio('#111110', '#F7F5F0');
    expect(galleryContrast).toBeGreaterThan(14.0); // Extremely high contrast > 14:1
  });

  it('correctly evaluates WCAG 2.2 AA and AAA thresholds', () => {
    const defaultEval = evaluateWcagCompliance('#111110', '#F7F5F0');
    expect(defaultEval.normalTextAA).toBe(true);
    expect(defaultEval.largeTextAA).toBe(true);
    expect(defaultEval.normalTextAAA).toBe(true);
    expect(defaultEval.rating).toBe('AAA');

    // Low contrast pairing (light gray on white)
    const lowContrastEval = evaluateWcagCompliance('#CCCCCC', '#FFFFFF');
    expect(lowContrastEval.normalTextAA).toBe(false);
    expect(lowContrastEval.rating).toBe('FAIL');
  });
});

/**
 * WCAG 2.2 Relative Luminance and Contrast Ratio Calculation Engine
 * Reference: W3C Web Content Accessibility Guidelines (WCAG) 2.2
 */

export function parseHexColor(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    return {
      r: parseInt(cleanHex[0] + cleanHex[0], 16),
      g: parseInt(cleanHex[1] + cleanHex[1], 16),
      b: parseInt(cleanHex[2] + cleanHex[2], 16),
    };
  }
  if (cleanHex.length === 6) {
    return {
      r: parseInt(cleanHex.substring(0, 2), 16),
      g: parseInt(cleanHex.substring(2, 4), 16),
      b: parseInt(cleanHex.substring(4, 6), 16),
    };
  }
  return null;
}

export function getRelativeLuminance(r: number, g: number, b: number): number {
  const sRGB = [r, g, b].map((val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

export function getContrastRatio(foregroundHex: string, backgroundHex: string): number {
  const fg = parseHexColor(foregroundHex);
  const bg = parseHexColor(backgroundHex);

  if (!fg || !bg) return 1.0;

  const l1 = getRelativeLuminance(fg.r, fg.g, fg.b);
  const l2 = getRelativeLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Number(ratio.toFixed(2));
}

export interface WcagEvaluation {
  ratio: number;
  normalTextAA: boolean; // >= 4.5:1
  largeTextAA: boolean;  // >= 3.0:1
  normalTextAAA: boolean;// >= 7.0:1
  largeTextAAA: boolean; // >= 4.5:1
  rating: 'AAA' | 'AA' | 'AA_LARGE_ONLY' | 'FAIL';
  summary: string;
}

export function evaluateWcagCompliance(foregroundHex: string, backgroundHex: string): WcagEvaluation {
  const ratio = getContrastRatio(foregroundHex, backgroundHex);
  const normalTextAA = ratio >= 4.5;
  const largeTextAA = ratio >= 3.0;
  const normalTextAAA = ratio >= 7.0;
  const largeTextAAA = ratio >= 4.5;

  let rating: 'AAA' | 'AA' | 'AA_LARGE_ONLY' | 'FAIL' = 'FAIL';
  let summary = `Contrast ratio is ${ratio}:1, failing WCAG AA (requires 4.5:1).`;

  if (normalTextAAA) {
    rating = 'AAA';
    summary = `Contrast ratio is ${ratio}:1, passing WCAG AAA (exceeds 7.0:1).`;
  } else if (normalTextAA) {
    rating = 'AA';
    summary = `Contrast ratio is ${ratio}:1, passing WCAG AA (exceeds 4.5:1).`;
  } else if (largeTextAA) {
    rating = 'AA_LARGE_ONLY';
    summary = `Contrast ratio is ${ratio}:1, passing for large display text only (≥ 3.0:1).`;
  }

  return {
    ratio,
    normalTextAA,
    largeTextAA,
    normalTextAAA,
    largeTextAAA,
    rating,
    summary,
  };
}

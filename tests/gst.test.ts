import { describe, it, expect } from 'vitest';
import {
  calculateOrderGst,
  DEFAULT_GST_SETTINGS,
  generateInvoiceNumber,
  validateGujaratGstin,
} from '../src/lib/gst';

describe('India Apparel GST Engine (Gujarat Origin 24)', () => {
  it('correctly calculates 5% GST for apparel <= Rs 2,500 within Gujarat (Intra-State split)', () => {
    // 1 piece at Rs 2,400 (240000 paise), TAX_INCLUSIVE
    const result = calculateOrderGst(
      [
        {
          title: 'DROP 001 T-Shirt',
          fit: 'WOMEN',
          size: 'M',
          unitPricePaise: 240000,
          quantity: 1,
        },
      ],
      '24', // Gujarat
      DEFAULT_GST_SETTINGS
    );

    expect(result.isInterState).toBe(false);
    expect(result.buyerStateCode).toBe('24');
    expect(result.finalPayablePaise).toBe(240000); // MRP unchanged in TAX_INCLUSIVE
    // Rate should be 5%
    expect(result.items[0].gstRate).toBe(5);
    // CGST and SGST should be 2.5% each
    expect(result.items[0].cgstRate).toBe(2.5);
    expect(result.items[0].sgstRate).toBe(2.5);
    expect(result.items[0].igstAmountPaise).toBe(0);
    expect(result.totalCgstPaise + result.totalSgstPaise).toBe(result.totalTaxPaise);
    // Total tax should be around 2400 - (2400 / 1.05) = 114.28 Rs (approx 11429 paise)
    expect(result.totalTaxPaise).toBe(11429);
  });

  it('correctly calculates 18% GST for apparel > Rs 2,500 outside Gujarat (Inter-State IGST)', () => {
    // 1 piece at Rs 3,200 (320000 paise) shipped to Maharashtra (27)
    const result = calculateOrderGst(
      [
        {
          title: 'Heavyweight Trench Drop',
          fit: 'MEN',
          size: 'L',
          unitPricePaise: 320000,
          quantity: 1,
        },
      ],
      '27', // Maharashtra
      DEFAULT_GST_SETTINGS
    );

    expect(result.isInterState).toBe(true);
    expect(result.items[0].gstRate).toBe(18);
    expect(result.items[0].igstRate).toBe(18);
    expect(result.totalCgstPaise).toBe(0);
    expect(result.totalSgstPaise).toBe(0);
    expect(result.totalIgstPaise).toBeGreaterThan(0);
    expect(result.totalTaxPaise).toBe(result.totalIgstPaise);
  });

  it('evaluates slab strictly PER PIECE, not per order total', () => {
    // 2 pieces at Rs 2,000 each = Rs 4,000 total order value.
    // Each piece is Rs 2,000 (<= Rs 2,500), so each MUST be taxed at 5%, NOT 18%!
    const result = calculateOrderGst(
      [
        {
          title: 'DROP 001 T-Shirt',
          fit: 'UNISEX',
          size: 'S',
          unitPricePaise: 200000,
          quantity: 2,
        },
      ],
      '07', // Delhi
      DEFAULT_GST_SETTINGS
    );

    expect(result.items[0].gstRate).toBe(5);
  });

  it('validates Gujarat GSTIN format correctly', () => {
    expect(validateGujaratGstin('24AABCO1234F1Z5')).toBe(true);
    expect(validateGujaratGstin('27AABCO1234F1Z5')).toBe(false); // Maharashtra code 27
    expect(validateGujaratGstin('invalid')).toBe(false);
  });

  it('formats sequential financial year invoice numbers', () => {
    expect(generateInvoiceNumber('OUT/26-27/', 1)).toBe('OUT/26-27/0001');
    expect(generateInvoiceNumber('OUT/26-27/', 42)).toBe('OUT/26-27/0042');
  });
});

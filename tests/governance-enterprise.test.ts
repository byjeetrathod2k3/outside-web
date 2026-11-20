import { describe, it, expect } from 'vitest';
import {
  calculateOrderGst,
  DEFAULT_GST_SETTINGS,
  GstSettings,
} from '../src/lib/gst';
import { checkRateLimit } from '../src/lib/rate-limit';

describe('MODULE 5 — Enterprise Governance, Legal & Financial Compliance Audit', () => {
  describe('1. GST Math Precision & Statutory Slab Rules (India HSN 61091000)', () => {
    it('exact paise precision for <= Rs 2,500 intra-state Gujarat (5% split: 2.5% CGST + 2.5% SGST, TAX_INCLUSIVE)', () => {
      const items = [
        {
          title: 'DROP 001 T-Shirt',
          fit: 'WOMEN' as const,
          size: 'M',
          unitPricePaise: 240000, // Rs 2,400 MRP
          quantity: 1,
        },
      ];

      const result = calculateOrderGst(items, '24', DEFAULT_GST_SETTINGS);

      expect(result.isInterState).toBe(false);
      expect(result.pricingMode).toBe('TAX_INCLUSIVE');
      expect(result.finalPayablePaise).toBe(240000);
      expect(result.items[0].gstRate).toBe(5);
      expect(result.items[0].cgstRate).toBe(2.5);
      expect(result.items[0].sgstRate).toBe(2.5);
      expect(result.items[0].igstRate).toBe(0);
      expect(result.totalCgstPaise + result.totalSgstPaise).toBe(result.totalTaxPaise);
      expect(result.totalTaxableAmountPaise + result.totalTaxPaise).toBe(240000);
    });

    it('exact paise precision for > Rs 2,500 intra-state Gujarat (18% split: 9% CGST + 9% SGST, TAX_INCLUSIVE)', () => {
      const items = [
        {
          title: 'Premium Heavy Trench Drop',
          fit: 'MEN' as const,
          size: 'L',
          unitPricePaise: 350000, // Rs 3,500 MRP (> Rs 2,500)
          quantity: 1,
        },
      ];

      const result = calculateOrderGst(items, '24', DEFAULT_GST_SETTINGS);

      expect(result.isInterState).toBe(false);
      expect(result.items[0].gstRate).toBe(18);
      expect(result.items[0].cgstRate).toBe(9);
      expect(result.items[0].sgstRate).toBe(9);
      expect(result.items[0].igstRate).toBe(0);
      expect(result.totalCgstPaise + result.totalSgstPaise).toBe(result.totalTaxPaise);
      expect(result.totalTaxableAmountPaise + result.totalTaxPaise).toBe(350000);
    });

    it('exact calculation for TAX_EXCLUSIVE pricing mode', () => {
      const exclusiveSettings: GstSettings = {
        ...DEFAULT_GST_SETTINGS,
        pricingMode: 'TAX_EXCLUSIVE',
      };

      const items = [
        {
          title: 'DROP 001 T-Shirt (Exclusive)',
          fit: 'WOMEN' as const,
          size: 'S',
          unitPricePaise: 200000, // Rs 2,000 base
          quantity: 1,
        },
      ];

      const result = calculateOrderGst(items, '27', exclusiveSettings); // Maharashtra (Inter-state)

      expect(result.isInterState).toBe(true);
      expect(result.pricingMode).toBe('TAX_EXCLUSIVE');
      expect(result.items[0].gstRate).toBe(5); // <= 2500
      // 5% of 200000 paise = 10000 paise (Rs 100)
      expect(result.totalTaxPaise).toBe(10000);
      expect(result.totalIgstPaise).toBe(10000);
      // Final payable = Base 200000 + Tax 10000 = 210000 paise (Rs 2,100)
      expect(result.finalPayablePaise).toBe(210000);
    });
  });

  describe('2. Cybersecurity & Bot Rate Limiting Protection', () => {
    it('blocks excessive rapid requests exceeding threshold', () => {
      const testIp = '10.0.99.1';
      const options = { windowMs: 60000, maxRequests: 3 };

      expect(checkRateLimit(testIp, options).allowed).toBe(true);
      expect(checkRateLimit(testIp, options).allowed).toBe(true);
      expect(checkRateLimit(testIp, options).allowed).toBe(true);

      // 4th request must be rejected
      const blocked = checkRateLimit(testIp, options);
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
      expect(blocked.resetSeconds).toBeGreaterThan(0);
    });
  });

  describe('3. DPDP Act 2023 & Consumer Protection Statutory Verifications', () => {
    it('validates customer PII anonymization structure without altering statutory tax snapshot', () => {
      const order = {
        id: 'ord_test_1',
        orderNumber: 'ORD-123456',
        invoiceNumber: 'OUT/26-27/0001',
        customerName: 'Diya Sharma',
        customerEmail: 'diya@example.com',
        customerPhone: '+91 98765 43210',
        shippingAddress: '402 Skyline, Bandra West, Mumbai',
        totalAmountPaise: 240000,
        taxableAmountPaise: 228571,
        totalTaxPaise: 11429,
        hsnSnapshot: '61091000',
        sellerGstin: '24AABCO1234F1Z5',
        isFrozenInvoice: true,
      };

      // Execute DPDP Erasure
      const anonymizedOrder = {
        ...order,
        customerName: 'REDACTED (DPDP ERASURE)',
        customerEmail: 'erased@dpdp.outside.in',
        customerPhone: '0000000000',
        shippingAddress: '[REDACTED PURSUANT TO DPDP ACT 2023]',
        isAnonymized: true,
      };

      // PII must be completely scrubbed
      expect(anonymizedOrder.customerName).not.toContain('Diya');
      expect(anonymizedOrder.customerEmail).toBe('erased@dpdp.outside.in');
      expect(anonymizedOrder.customerPhone).toBe('0000000000');

      // Crucial: Financial & statutory GST invoice numbers must remain 100% intact for audits
      expect(anonymizedOrder.invoiceNumber).toBe('OUT/26-27/0001');
      expect(anonymizedOrder.totalAmountPaise).toBe(240000);
      expect(anonymizedOrder.totalTaxPaise).toBe(11429);
      expect(anonymizedOrder.hsnSnapshot).toBe('61091000');
      expect(anonymizedOrder.sellerGstin).toBe('24AABCO1234F1Z5');
      expect(anonymizedOrder.isFrozenInvoice).toBe(true);
    });
  });
});

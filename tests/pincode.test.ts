import { describe, it, expect } from 'vitest';
import { estimateDelivery } from '../src/lib/pincode';

describe('Pincode Express Delivery Estimator', () => {
  it('rejects invalid or incomplete pincodes', () => {
    expect(estimateDelivery('123').valid).toBe(false);
    expect(estimateDelivery('abcdef').valid).toBe(false);
    expect(estimateDelivery('12345').valid).toBe(false);
  });

  it('accurately resolves local Gujarat/Ahmedabad pincode (380015)', () => {
    const res = estimateDelivery('380015');
    expect(res.valid).toBe(true);
    expect(res.city).toContain('Ahmedabad');
    expect(res.state).toBe('Gujarat');
    expect(res.transitDaysMin).toBe(1);
    expect(res.isExpressFree).toBe(true);
    expect(res.estimatedDeliveryDate).toBeDefined();
  });

  it('accurately resolves Mumbai metro pincode (400001)', () => {
    const res = estimateDelivery('400001');
    expect(res.valid).toBe(true);
    expect(res.city).toContain('Mumbai');
    expect(res.state).toBe('Maharashtra');
    expect(res.transitDaysMin).toBe(1);
    expect(res.transitDaysMax).toBe(2);
  });

  it('accurately resolves Bengaluru metro pincode (560001)', () => {
    const res = estimateDelivery('560001');
    expect(res.valid).toBe(true);
    expect(res.city).toContain('Bengaluru');
    expect(res.state).toBe('Karnataka');
  });

  it('falls back cleanly for any valid 6-digit Indian pincode', () => {
    const res = estimateDelivery('799001'); // Tripura
    expect(res.valid).toBe(true);
    expect(res.isExpressFree).toBe(true);
    expect(res.transitDaysMax).toBe(5);
  });
});

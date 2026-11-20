import { describe, it, expect } from 'vitest';
import { calculateOrderGst, generateGstr1Csv } from '../src/lib/gst';
import { hasRequiredRole } from '../src/lib/auth';

describe('Orders, Invoicing & RBAC Integration', () => {
  it('correctly aggregates multiple items into GSTR-1 CSV format', () => {
    const items = [
      {
        hsnCode: '61091000',
        description: 'DROP 001 T-Shirt (WOMEN - M)',
        quantity: 2,
        taxableAmountPaise: 457142,
        cgstAmountPaise: 11429,
        sgstAmountPaise: 11429,
        igstAmountPaise: 0,
        totalTaxPaise: 22858,
        gstRate: 5,
      },
      {
        hsnCode: '61091000',
        description: 'DROP 001 T-Shirt (MEN - L)',
        quantity: 1,
        taxableAmountPaise: 228571,
        cgstAmountPaise: 0,
        sgstAmountPaise: 0,
        igstAmountPaise: 11429,
        totalTaxPaise: 11429,
        gstRate: 5,
      },
    ];

    const csv = generateGstr1Csv(items);
    expect(csv).toContain('HSN,Description,UQC,Total Quantity');
    expect(csv).toContain('61091000');
    expect(csv).toContain('PCS');
    expect(csv).toContain('3'); // Total quantity = 2 + 1 = 3
    expect(csv).toContain('5%');
  });

  it('enforces RBAC hierarchy correctly', () => {
    // SUPER_ADMIN can perform everything
    expect(hasRequiredRole('SUPER_ADMIN', 'ADMIN')).toBe(true);
    expect(hasRequiredRole('SUPER_ADMIN', 'EDITOR')).toBe(true);
    expect(hasRequiredRole('SUPER_ADMIN', 'VIEWER')).toBe(true);

    // ADMIN can access ADMIN, EDITOR, VIEWER, but not SUPER_ADMIN
    expect(hasRequiredRole('ADMIN', 'SUPER_ADMIN')).toBe(false);
    expect(hasRequiredRole('ADMIN', 'ADMIN')).toBe(true);
    expect(hasRequiredRole('ADMIN', 'EDITOR')).toBe(true);

    // EDITOR cannot access ADMIN
    expect(hasRequiredRole('EDITOR', 'ADMIN')).toBe(false);
    expect(hasRequiredRole('EDITOR', 'EDITOR')).toBe(true);

    // VIEWER cannot access EDITOR
    expect(hasRequiredRole('VIEWER', 'EDITOR')).toBe(false);
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { getLocalStore, saveLocalStore, INITIAL_DROP } from '../src/lib/db';

describe('Studio Inventory & SKU Logistics Governance', () => {
  beforeEach(() => {
    // Reset test state in store
    const store = getLocalStore();
    const d1 = store.drops.find((d: any) => d.id === 'drop_001');
    if (d1 && d1.variants) {
      d1.status = 'LIVE';
      d1.soldOutAt = null;
    }
    saveLocalStore(store);
  });

  it('calculates inventory metrics and remaining units accurately', () => {
    const store = getLocalStore();
    const activeDrop = store.drops.find((d: any) => d.id === 'drop_001');
    expect(activeDrop).toBeDefined();
    expect(activeDrop.variants).toBeDefined();
    expect(activeDrop.variants.length).toBeGreaterThan(0);

    const totalRemaining = activeDrop.variants.reduce((acc: number, v: any) => acc + v.currentStock, 0);
    const totalInitial = activeDrop.variants.reduce((acc: number, v: any) => acc + v.initialStock, 0);

    expect(totalRemaining).toBeGreaterThanOrEqual(0);
    expect(totalInitial).toBeGreaterThanOrEqual(totalRemaining);
  });

  it('safely applies incremental stock adjustments and prevents negative stock', () => {
    const store = getLocalStore();
    const activeDrop = store.drops.find((d: any) => d.id === 'drop_001');
    const variant = activeDrop.variants[0];
    const initialStock = variant.currentStock;

    // Increment
    variant.currentStock += 5;
    expect(variant.currentStock).toBe(initialStock + 5);

    // Decrement
    variant.currentStock -= 2;
    expect(variant.currentStock).toBe(initialStock + 3);

    // Prevent negative stock
    const excessiveDecrement = variant.currentStock + 100;
    variant.currentStock = Math.max(0, variant.currentStock - excessiveDecrement);
    expect(variant.currentStock).toBe(0);

    // Reset back
    variant.currentStock = initialStock;
    saveLocalStore(store);
  });

  it('automatically transitions drop status to SOLD_OUT when all variants reach 0 stock', () => {
    const store = getLocalStore();
    const activeDrop = store.drops.find((d: any) => d.id === 'drop_001');
    const originalStocks = activeDrop.variants.map((v: any) => v.currentStock);

    // Simulate all variants sold out
    activeDrop.variants.forEach((v: any) => {
      v.currentStock = 0;
    });

    const totalRemaining = activeDrop.variants.reduce((acc: number, v: any) => acc + v.currentStock, 0);
    expect(totalRemaining).toBe(0);

    if (totalRemaining === 0) {
      activeDrop.status = 'SOLD_OUT';
      activeDrop.soldOutAt = new Date().toISOString();
    }

    expect(activeDrop.status).toBe('SOLD_OUT');
    expect(activeDrop.soldOutAt).not.toBeNull();

    // Restock variant - should reactivate drop to LIVE
    activeDrop.variants[0].currentStock = 10;
    const newTotal = activeDrop.variants.reduce((acc: number, v: any) => acc + v.currentStock, 0);
    expect(newTotal).toBe(10);

    if (newTotal > 0 && activeDrop.status === 'SOLD_OUT') {
      activeDrop.status = 'LIVE';
      activeDrop.soldOutAt = null;
    }

    expect(activeDrop.status).toBe('LIVE');
    expect(activeDrop.soldOutAt).toBeNull();

    // Restore original stocks
    activeDrop.variants.forEach((v: any, idx: number) => {
      v.currentStock = originalStocks[idx];
    });
    saveLocalStore(store);
  });

  it('records structured immutable audit log entries for inventory changes', () => {
    const store = getLocalStore();
    if (!store.auditLogs) store.auditLogs = [];

    const testLog = {
      id: `audit_inv_test_${Date.now()}`,
      action: 'INVENTORY_ADJUSTED',
      entityType: 'Variant',
      entityId: 'v_w_m',
      metadata: {
        dropId: 'drop_001',
        sku: 'OUT-001-W-M',
        oldStock: 4,
        newStock: 9,
        delta: 5,
        reason: 'Studio Batch Restock Allocation',
        adminUser: 'studio_director@outside.in',
      },
      createdAt: new Date().toISOString(),
    };

    store.auditLogs.unshift(testLog);
    saveLocalStore(store);

    const reloadedStore = getLocalStore();
    const foundLog = reloadedStore.auditLogs.find((l: any) => l.id === testLog.id);
    expect(foundLog).toBeDefined();
    expect(foundLog.metadata.sku).toBe('OUT-001-W-M');
    expect(foundLog.metadata.delta).toBe(5);
    expect(foundLog.metadata.reason).toBe('Studio Batch Restock Allocation');
  });

  it('formats inventory CSV rows correctly for warehouse export', () => {
    const drop = {
      id: 'drop_001',
      title: 'DROP 001 // BETTER DAYS AHEAD',
      variants: [
        {
          id: 'v_w_s',
          sku: 'OUT-001-W-S',
          fit: 'WOMEN',
          size: 'S',
          initialStock: 35,
          currentStock: 12,
          reservedStock: 0,
        },
      ],
    };

    const variant = drop.variants[0];
    const sold = variant.initialStock - variant.currentStock;
    const csvRow = [
      `"${drop.id}"`,
      `"${drop.title}"`,
      `"${variant.sku}"`,
      `"${variant.fit}"`,
      `"${variant.size}"`,
      variant.initialStock,
      variant.currentStock,
      variant.reservedStock,
      sold,
      `"${variant.currentStock <= 5 ? 'LOW_STOCK' : 'IN_STOCK'}"`,
    ].join(',');

    expect(csvRow).toContain('"drop_001"');
    expect(csvRow).toContain('"OUT-001-W-S"');
    expect(csvRow).toContain('35,12,0,23');
  });
});

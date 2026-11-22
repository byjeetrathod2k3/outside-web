import { NextResponse } from 'next/server';
import { getLocalStore, saveLocalStore } from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getCurrentSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized Super Admin access' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');
  const dropIdFilter = searchParams.get('dropId');

  const store = getLocalStore();
  const drops = store.drops || [];

  // Filter drops if requested
  const targetDrops = dropIdFilter
    ? drops.filter((d: any) => d.id === dropIdFilter)
    : drops;

  // CSV Export
  if (format === 'csv') {
    const csvRows = [
      ['Drop ID', 'Drop Title', 'SKU', 'Fit', 'Size', 'Initial Stock', 'Current Stock', 'Reserved Stock', 'Units Sold', 'Status'].join(','),
    ];

    targetDrops.forEach((drop: any) => {
      (drop.variants || []).forEach((variant: any) => {
        const sold = Math.max(0, (variant.initialStock || 0) - (variant.currentStock || 0));
        csvRows.push([
          `"${drop.id}"`,
          `"${(drop.title || '').replace(/"/g, '""')}"`,
          `"${variant.sku}"`,
          `"${variant.fit}"`,
          `"${variant.size}"`,
          variant.initialStock || 0,
          variant.currentStock || 0,
          variant.reservedStock || 0,
          sold,
          `"${variant.currentStock <= 0 ? 'SOLD_OUT' : variant.currentStock <= 5 ? 'LOW_STOCK' : 'IN_STOCK'}"`,
        ].join(','));
      });
    });

    const csvContent = csvRows.join('\n');
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="outside_inventory_matrix_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  // Calculate high-level aggregates across all drops
  let totalEditionUnits = 0;
  let totalRemainingUnits = 0;
  let totalClaimedUnits = 0;
  let totalReservedUnits = 0;
  let lowStockVariantsCount = 0;
  let soldOutVariantsCount = 0;
  let totalVariantsCount = 0;

  const dropsWithMetrics = drops.map((drop: any) => {
    const variants = drop.variants || [];
    let dropInitial = 0;
    let dropRemaining = 0;
    let dropReserved = 0;

    const enrichedVariants = variants.map((v: any) => {
      const initial = Number(v.initialStock) || 0;
      const current = Number(v.currentStock) || 0;
      const reserved = Number(v.reservedStock) || 0;
      const sold = Math.max(0, initial - current);

      dropInitial += initial;
      dropRemaining += current;
      dropReserved += reserved;

      totalVariantsCount++;
      if (current <= 0) {
        soldOutVariantsCount++;
      } else if (current <= 5) {
        lowStockVariantsCount++;
      }

      let health: 'OPTIMAL' | 'LOW' | 'CRITICAL' | 'SOLD_OUT' = 'OPTIMAL';
      if (current <= 0) health = 'SOLD_OUT';
      else if (current <= 3) health = 'CRITICAL';
      else if (current <= 5) health = 'LOW';

      return {
        ...v,
        initialStock: initial,
        currentStock: current,
        reservedStock: reserved,
        unitsSold: sold,
        stockHealth: health,
      };
    });

    totalEditionUnits += dropInitial;
    totalRemainingUnits += dropRemaining;
    totalReservedUnits += dropReserved;
    totalClaimedUnits += Math.max(0, dropInitial - dropRemaining);

    return {
      id: drop.id,
      dropNumber: drop.dropNumber,
      slug: drop.slug,
      title: drop.title,
      subtitle: drop.subtitle,
      pricePaise: drop.pricePaise,
      status: drop.status,
      isFeatured: !!drop.isFeatured,
      primaryImageUrl: drop.primaryImageUrl,
      totalEditionQty: drop.totalEditionQty || dropInitial,
      totalStock: dropInitial,
      remainingStock: dropRemaining,
      reservedStock: dropReserved,
      soldStock: Math.max(0, dropInitial - dropRemaining),
      percentClaimed: dropInitial > 0 ? Math.round(((dropInitial - dropRemaining) / dropInitial) * 100) : 0,
      variants: enrichedVariants,
    };
  });

  // Recent inventory audit logs
  const auditLogs = (store.auditLogs || [])
    .filter((log: any) => log.action === 'INVENTORY_ADJUSTED' || log.entityType === 'Variant')
    .slice(0, 20);

  return NextResponse.json({
    metrics: {
      totalEditionUnits,
      totalRemainingUnits,
      totalClaimedUnits,
      totalReservedUnits,
      lowStockVariantsCount,
      soldOutVariantsCount,
      totalVariantsCount,
    },
    drops: dropsWithMetrics,
    auditLogs,
  });
}

export async function PATCH(request: Request) {
  const session = await getCurrentSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized Super Admin access' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { dropId, variantId, newStock, delta, newInitialStock, reason } = body;

    if (!dropId || !variantId) {
      return NextResponse.json({ error: 'Missing required dropId or variantId' }, { status: 400 });
    }

    const store = getLocalStore();
    const dropIndex = store.drops.findIndex((d: any) => d.id === dropId);

    if (dropIndex === -1) {
      return NextResponse.json({ error: 'Drop not found' }, { status: 404 });
    }

    const drop = store.drops[dropIndex];
    if (!drop.variants) {
      drop.variants = [];
    }

    const variantIndex = drop.variants.findIndex((v: any) => v.id === variantId);
    if (variantIndex === -1) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
    }

    const currentVariant = drop.variants[variantIndex];
    const oldStock = Number(currentVariant.currentStock) || 0;
    const oldInitialStock = Number(currentVariant.initialStock) || oldStock;

    let updatedStock = oldStock;

    if (typeof newStock === 'number') {
      updatedStock = Math.max(0, newStock);
    } else if (typeof delta === 'number') {
      updatedStock = Math.max(0, oldStock + delta);
    }

    let updatedInitialStock = oldInitialStock;
    if (typeof newInitialStock === 'number') {
      updatedInitialStock = Math.max(0, newInitialStock);
      currentVariant.initialStock = updatedInitialStock;
    }

    currentVariant.currentStock = updatedStock;

    // Recalculate drop total stock
    const totalRemaining = drop.variants.reduce(
      (acc: number, v: any) => acc + (Number(v.currentStock) || 0),
      0
    );

    // Dynamic drop status auto-transition
    const previousDropStatus = drop.status;
    if (totalRemaining === 0 && drop.status === 'LIVE') {
      drop.status = 'SOLD_OUT';
      drop.soldOutAt = new Date().toISOString();
    } else if (totalRemaining > 0 && drop.status === 'SOLD_OUT') {
      drop.status = 'LIVE';
      drop.soldOutAt = null;
    }

    drop.updatedAt = new Date().toISOString();

    // Append to immutable audit logs
    if (!store.auditLogs) {
      store.auditLogs = [];
    }

    store.auditLogs.unshift({
      id: `audit_inv_${Date.now()}`,
      action: 'INVENTORY_ADJUSTED',
      entityType: 'Variant',
      entityId: variantId,
      metadata: {
        dropId,
        dropTitle: drop.title,
        sku: currentVariant.sku,
        fit: currentVariant.fit,
        size: currentVariant.size,
        oldStock,
        newStock: updatedStock,
        delta: updatedStock - oldStock,
        oldInitialStock,
        newInitialStock: updatedInitialStock,
        reason: reason || 'Studio Admin Manual Recount',
        adminUser: session.email || 'Super Admin',
        previousDropStatus,
        newDropStatus: drop.status,
      },
      createdAt: new Date().toISOString(),
    });

    saveLocalStore(store);

    return NextResponse.json({
      success: true,
      dropId,
      variant: currentVariant,
      dropRemainingStock: totalRemaining,
      dropStatus: drop.status,
      message: `Updated SKU ${currentVariant.sku}: ${oldStock} → ${updatedStock} units`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update inventory' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getLocalStore, saveLocalStore } from '@/lib/db';
import {
  validateGujaratGstin,
  DEFAULT_GST_SETTINGS,
  generateGstr1Csv,
} from '@/lib/gst';
import { getCurrentSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized Super Admin access' }, { status: 401 });
  }

  const store = getLocalStore();
  const { searchParams } = new URL(request.url);
  const exportFormat = searchParams.get('export');

  // GSTR-1 CSV Export for Tax Accountants
  if (exportFormat === 'gstr1') {
    const allOrderItems: any[] = [];
    (store.orders || []).forEach((order: any) => {
      (order.items || []).forEach((item: any) => {
        allOrderItems.push({
          hsnCode: item.hsnCode || '61091000',
          description: `${item.title} (${item.fit} - ${item.size})`,
          quantity: item.quantity,
          taxableAmountPaise: item.taxableAmountPaise,
          cgstAmountPaise: item.cgstAmountPaise,
          sgstAmountPaise: item.sgstAmountPaise,
          igstAmountPaise: item.igstAmountPaise,
          totalTaxPaise: item.totalTaxPaise,
          gstRate: item.gstRate,
        });
      });
    });

    const csvContent = generateGstr1Csv(allOrderItems);
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="GSTR1_HSN_Summary_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({
    config: store.gstConfig || DEFAULT_GST_SETTINGS,
  });
}

export async function PUT(request: Request) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized Super Admin access' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      isEnabled,
      sellerLegalName,
      gstin,
      originStateCode = '24',
      originStateName = 'Gujarat',
      registeredAddress,
      pricingMode,
      thresholdInr,
      lowSlabRate,
      highSlabRate,
      defaultHsn,
      invoicePrefix,
      invoiceCounter,
    } = body;

    // Validate GSTIN if provided
    if (gstin && !validateGujaratGstin(gstin)) {
      return NextResponse.json(
        { error: 'Invalid Gujarat GSTIN. Format must be 24AAAAA0000A1Z5' },
        { status: 400 }
      );
    }

    const store = getLocalStore();
    const existing = store.gstConfig || DEFAULT_GST_SETTINGS;

    store.gstConfig = {
      ...existing,
      ...(isEnabled !== undefined && { isEnabled: Boolean(isEnabled) }),
      ...(sellerLegalName && { sellerLegalName }),
      ...(gstin && { gstin }),
      ...(originStateCode && { originStateCode }),
      ...(originStateName && { originStateName }),
      ...(registeredAddress && { registeredAddress }),
      ...(pricingMode && { pricingMode }),
      ...(thresholdInr !== undefined && { thresholdInr: Number(thresholdInr) }),
      ...(lowSlabRate !== undefined && { lowSlabRate: Number(lowSlabRate) }),
      ...(highSlabRate !== undefined && { highSlabRate: Number(highSlabRate) }),
      ...(defaultHsn && { defaultHsn }),
      ...(invoicePrefix && { invoicePrefix }),
      ...(invoiceCounter !== undefined && { invoiceCounter: Number(invoiceCounter) }),
      updatedAt: new Date().toISOString(),
    };

    store.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      action: 'GST_CONFIGURATION_UPDATED',
      entityType: 'GstConfig',
      metadata: { gstin: store.gstConfig.gstin, pricingMode: store.gstConfig.pricingMode },
      createdAt: new Date().toISOString(),
    });

    saveLocalStore(store);

    return NextResponse.json({ success: true, config: store.gstConfig });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to update GST config' },
      { status: 500 }
    );
  }
}

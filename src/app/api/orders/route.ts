import { NextResponse } from 'next/server';
import {
  calculateOrderGst,
  generateInvoiceNumber,
  GstSettings,
  DEFAULT_GST_SETTINGS,
} from '@/lib/gst';
import { getLocalStore, saveLocalStore } from '@/lib/db';
import { sendTransactionalEmail } from '@/lib/email';
import { getCurrentSession } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get('orderNumber');
  const store = getLocalStore();

  if (orderNumber) {
    const order = store.orders.find((o: any) => o.orderNumber === orderNumber);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  }

  // Listing all orders requires admin authentication
  const session = await getCurrentSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required to list orders' }, { status: 401 });
  }

  return NextResponse.json(store.orders);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
      stateCode = '24',
      items,
    } = body;

    if (!customerEmail || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required order fields or items' },
        { status: 400 }
      );
    }

    const store = getLocalStore();
    const gstConfig: GstSettings = store.gstConfig || DEFAULT_GST_SETTINGS;

    // 1. Calculate itemized GST
    const taxBreakdown = calculateOrderGst(items, stateCode, gstConfig);

    // 2. Generate sequential financial-year invoice number
    const currentCounter = gstConfig.invoiceCounter || 1;
    const invoicePrefix = gstConfig.invoicePrefix || 'OUT/26-27/';
    const invoiceNumber = generateInvoiceNumber(invoicePrefix, currentCounter);

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // 3. Decrement atomic variant stocks
    const activeDrop = store.drops.find((d: any) => d.id === items[0].dropId) || store.drops[0];

    items.forEach((item: any) => {
      if (activeDrop && activeDrop.variants) {
        const variant = activeDrop.variants.find(
          (v: any) => v.fit === item.fit && v.size === item.size
        );
        if (variant && variant.currentStock > 0) {
          variant.currentStock = Math.max(0, variant.currentStock - item.quantity);
        }
      }
    });

    // Check if drop is now completely sold out
    const totalRemaining = activeDrop.variants.reduce(
      (acc: number, v: any) => acc + v.currentStock,
      0
    );
    if (totalRemaining === 0) {
      activeDrop.status = 'SOLD_OUT';
      activeDrop.soldOutAt = new Date().toISOString();
    }

    // 4. Construct Order Object
    const newOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      invoiceNumber,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
      stateCode,
      placeOfSupplyState: `${stateCode}-${taxBreakdown.buyerStateName}`,
      pricingMode: taxBreakdown.pricingMode,
      subtotalPaise: taxBreakdown.subtotalGrossPaise,
      taxableAmountPaise: taxBreakdown.totalTaxableAmountPaise,
      cgstPaise: taxBreakdown.totalCgstPaise,
      sgstPaise: taxBreakdown.totalSgstPaise,
      igstPaise: taxBreakdown.totalIgstPaise,
      totalTaxPaise: taxBreakdown.totalTaxPaise,
      totalAmountPaise: taxBreakdown.finalPayablePaise,
      paymentStatus: 'PAID',
      paymentGateway: 'mock_sandbox',
      fulfillmentStatus: 'PROCESSING',
      items: taxBreakdown.items,
      createdAt: new Date().toISOString(),
    };

    store.orders.unshift(newOrder);

    // Increment GST invoice counter
    gstConfig.invoiceCounter = currentCounter + 1;
    store.gstConfig = gstConfig;

    // Log audit event
    store.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      action: 'ORDER_PLACED_INVOICE_GENERATED',
      entityType: 'Order',
      entityId: newOrder.id,
      metadata: { invoiceNumber, totalAmount: newOrder.totalAmountPaise / 100 },
      createdAt: new Date().toISOString(),
    });

    saveLocalStore(store);

    // 5. Asynchronously trigger transactional Order Confirmation & Invoice email
    try {
      const taxSplitHtml = taxBreakdown.isInterState
        ? `<p style="margin: 4px 0; font-size: 13px; color: #CCC;">Integrated GST (IGST): <strong>₹${(taxBreakdown.totalIgstPaise / 100).toFixed(2)}</strong></p>`
        : `<p style="margin: 4px 0; font-size: 13px; color: #CCC;">Central GST (CGST): <strong>₹${(taxBreakdown.totalCgstPaise / 100).toFixed(2)}</strong></p>
           <p style="margin: 4px 0; font-size: 13px; color: #CCC;">State GST (SGST): <strong>₹${(taxBreakdown.totalSgstPaise / 100).toFixed(2)}</strong></p>`;

      await sendTransactionalEmail({
        to: customerEmail,
        templateType: 'ORDER_CONFIRMATION_INVOICE',
        variables: {
          customerName,
          orderNumber,
          invoiceNumber,
          placeOfSupply: `${taxBreakdown.buyerStateName} (${stateCode})`,
          taxableAmount: (taxBreakdown.totalTaxableAmountPaise / 100).toFixed(2),
          taxSplitHtml,
          totalAmount: (taxBreakdown.finalPayablePaise / 100).toFixed(2),
          shippingAddress,
          shippingCity,
          shippingState,
          shippingPincode,
          gstin: gstConfig.gstin || '24AABCO1234F1Z5',
        },
        config: store.emailConfig,
      });
    } catch (mailErr) {
      console.warn('Transactional email notice:', mailErr);
    }

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal order processing failure' },
      { status: 500 }
    );
  }
}

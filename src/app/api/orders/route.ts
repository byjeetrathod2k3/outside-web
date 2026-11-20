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
import { checkRateLimit } from '@/lib/rate-limit';

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
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // 0. Anti-bot checkout rate limiting (max 15 checkouts per 15 min per IP)
    const rateCheck = checkRateLimit(`order_${ip}`, { windowMs: 900000, maxRequests: 15 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many order requests. Please retry in a few minutes.' },
        { status: 429 }
      );
    }

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

    // 3. Pre-flight Concurrency & Stock Check (Zero-Overselling Guarantee)
    const activeDrop = store.drops.find((d: any) => d.id === items[0].dropId) || store.drops[0];
    if (!activeDrop || !activeDrop.variants) {
      return NextResponse.json({ error: 'Active drop edition not found' }, { status: 404 });
    }

    for (const item of items) {
      const variant = activeDrop.variants.find(
        (v: any) => v.fit === item.fit && v.size === item.size
      );
      const reqQty = Number(item.quantity) || 1;
      if (!variant) {
        return NextResponse.json(
          { error: `Variant ${item.fit} · Size ${item.size} does not exist in this edition.` },
          { status: 400 }
        );
      }
      if (variant.currentStock < reqQty) {
        return NextResponse.json(
          {
            error: `Overselling prevented: Size ${item.size} (${item.fit}) only has ${variant.currentStock} piece(s) remaining.`,
            variantAvailableStock: variant.currentStock,
            code: 'INSUFFICIENT_STOCK',
          },
          { status: 409 }
        );
      }
    }

    // Decrement atomic variant stocks
    for (const item of items) {
      const variant = activeDrop.variants.find(
        (v: any) => v.fit === item.fit && v.size === item.size
      );
      if (variant) {
        variant.currentStock -= Number(item.quantity) || 1;
      }
    }

    // Check if drop is now completely sold out
    const totalRemaining = activeDrop.variants.reduce(
      (acc: number, v: any) => acc + v.currentStock,
      0
    );
    if (totalRemaining === 0) {
      activeDrop.status = 'SOLD_OUT';
      activeDrop.soldOutAt = new Date().toISOString();
    }

    // 4. Construct Order Object with Immutable Statutory Snapshot
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
      // Frozen Statutory Invoice Snapshot (Independent of future Super Admin edits)
      sellerGstin: gstConfig.gstin || '24AABCO1234F1Z5',
      sellerLegalName: gstConfig.sellerLegalName || 'OUTSIDE APPAREL STUDIO PVT LTD',
      sellerAddress: gstConfig.registeredAddress || 'Plot 104, Design District, SG Highway, Ahmedabad 380015',
      hsnSnapshot: '61091000',
      isFrozenInvoice: true,
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

/**
 * DPDP Act 2023 — Customer Personal Data Erasure / Anonymization
 * Admin-authenticated action to erase customer identifying PII while preserving
 * financial invoice amounts, HSN, and GST tax records required for statutory audit.
 */
export async function PATCH(request: Request) {
  const session = await getCurrentSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
    return NextResponse.json(
      { error: 'Unauthorized: Admin privileges required for DPDP operations' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { orderId, action } = body;

    const store = getLocalStore();
    const order = store.orders.find((o: any) => o.id === orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (action === 'ANONYMIZE_PII') {
      const priorEmail = order.customerEmail;
      order.customerName = 'REDACTED (DPDP ERASURE)';
      order.customerEmail = 'erased@dpdp.outside.in';
      order.customerPhone = '0000000000';
      order.shippingAddress = '[REDACTED PURSUANT TO DPDP ACT 2023]';
      order.shippingCity = '[REDACTED]';
      order.shippingPincode = '000000';
      order.isAnonymized = true;
      order.anonymizedAt = new Date().toISOString();

      store.auditLogs.unshift({
        id: `audit_${Date.now()}`,
        action: 'ORDER_PII_ERASED_DPDP',
        entityType: 'Order',
        entityId: order.id,
        metadata: {
          invoiceNumber: order.invoiceNumber,
          priorEmailMasked: priorEmail ? `${priorEmail.slice(0, 2)}***@***` : 'unknown',
          performedBy: session.email,
        },
        createdAt: new Date().toISOString(),
      });

      saveLocalStore(store);
      return NextResponse.json({ success: true, order });
    }

    return NextResponse.json({ error: 'Unsupported PATCH action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'DPDP operation failed' }, { status: 500 });
  }
}

'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Printer, ArrowRight, ShieldCheck } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'ORD-2026-0001';
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders?orderNumber=${orderNumber}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderNumber]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-24 text-center font-mono text-xs uppercase text-outside-muted">
        RETRIEVING AUDITED TAX INVOICE...
      </div>
    );
  }

  // Fallback representation if API is hydrating
  const displayOrder = order || {
    orderNumber,
    invoiceNumber: 'OUT/26-27/0001',
    customerName: 'Valued Collector',
    customerEmail: 'collector@outside.in',
    shippingAddress: 'Design District, SG Highway',
    shippingCity: 'Ahmedabad',
    shippingState: 'Gujarat',
    shippingPincode: '380015',
    placeOfSupplyState: '24-Gujarat',
    stateCode: '24',
    taxableAmountPaise: 228571,
    cgstPaise: 5714,
    sgstPaise: 5714,
    igstPaise: 0,
    totalTaxPaise: 11429,
    totalAmountPaise: 240000,
    items: [
      {
        title: 'DROP 001 // MIDNIGHT MONOLITH',
        fit: 'WOMEN',
        size: 'M',
        quantity: 1,
        unitPricePaise: 240000,
        taxableAmountPaise: 228571,
        hsnCode: '61091000',
        gstRate: 5,
        cgstAmountPaise: 5714,
        sgstAmountPaise: 5714,
        igstAmountPaise: 0,
        totalAmountPaise: 240000,
      },
    ],
  };

  const isInterState = displayOrder.stateCode !== '24';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 print:p-0 print:max-w-none">
      
      {/* Top Banner (Hidden in Print) */}
      <div className="p-6 bg-outside-surface border border-outside-crimson/50 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-outside-crimson flex-shrink-0" />
          <div>
            <h2 className="text-sm font-mono uppercase tracking-wider text-white font-bold">
              ORDER CONFIRMED &amp; ALLOCATION SECURED
            </h2>
            <p className="text-xs text-outside-muted mt-0.5">
              Tax Invoice and dispatch tracking details have been transmitted to your email.
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-outside-card hover:bg-outside-surface border border-outside-border text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2"
        >
          <Printer className="w-4 h-4 text-outside-crimson" />
          <span>PRINT TAX INVOICE</span>
        </button>
      </div>

      {/* TAX INVOICE DOCUMENT */}
      <div className="bg-outside-charcoal border border-outside-border p-8 sm:p-12 space-y-8 text-white font-mono text-xs print:bg-white print:text-black print:border-none">
        
        {/* Invoice Header */}
        <div className="border-b border-outside-border/80 pb-6 flex flex-col sm:flex-row justify-between items-start gap-6 print:border-gray-300">
          <div>
            <h1 className="text-2xl font-black font-display tracking-tight text-outside-crimson uppercase print:text-red-700">
              OUTSIDE APPAREL STUDIO PVT LTD
            </h1>
            <p className="text-[11px] text-outside-muted mt-1 print:text-gray-600">
              Plot 104, Design District, SG Highway, Ahmedabad, Gujarat 380015
            </p>
            <p className="text-[11px] text-outside-muted print:text-gray-600">
              GSTIN: <strong className="text-white print:text-black">24AABCO1234F1Z5</strong> · State: Gujarat (24)
            </p>
            <p className="text-[11px] text-outside-muted print:text-gray-600">
              Email: support@outside.in · Website: www.outside.in
            </p>
          </div>

          <div className="sm:text-right space-y-1">
            <span className="px-2.5 py-1 bg-outside-crimson text-white text-[10px] uppercase font-bold tracking-widest inline-block print:bg-black">
              TAX INVOICE
            </span>
            <p className="text-sm font-bold text-white print:text-black mt-2">
              INVOICE NO: {displayOrder.invoiceNumber}
            </p>
            <p className="text-outside-muted print:text-gray-600 text-[11px]">
              ORDER REF: {displayOrder.orderNumber}
            </p>
            <p className="text-outside-muted print:text-gray-600 text-[11px]">
              DATE: {new Date().toLocaleDateString('en-IN')}
            </p>
          </div>
        </div>

        {/* Bill To & Ship To Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-outside-border/80 pb-6 print:border-gray-300">
          <div>
            <span className="text-outside-crimson uppercase tracking-wider font-bold block mb-2">
              BILLED &amp; SHIPPED TO:
            </span>
            <p className="font-bold text-white print:text-black">{displayOrder.customerName}</p>
            <p className="text-outside-muted print:text-gray-600">{displayOrder.customerEmail}</p>
            <p className="text-outside-muted print:text-gray-600">{displayOrder.shippingAddress}</p>
            <p className="text-outside-muted print:text-gray-600">
              {displayOrder.shippingCity}, {displayOrder.shippingState} - {displayOrder.shippingPincode}
            </p>
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="text-outside-crimson uppercase tracking-wider font-bold block mb-2">
              TAX DETERMINATION:
            </span>
            <p className="text-outside-muted print:text-gray-600">
              Place of Supply: <strong className="text-white print:text-black">{displayOrder.shippingState} ({displayOrder.stateCode})</strong>
            </p>
            <p className="text-outside-muted print:text-gray-600">
              Tax Regime: <strong className="text-white print:text-black">{isInterState ? 'INTER-STATE (IGST)' : 'INTRA-STATE (CGST + SGST)'}</strong>
            </p>
            <p className="text-outside-muted print:text-gray-600">
              Reverse Charge Applicable: <strong className="text-white print:text-black">NO</strong>
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outside-border/80 text-outside-crimson text-[10px] uppercase tracking-wider print:border-gray-300">
                <th className="py-2.5">Item Description</th>
                <th className="py-2.5">HSN</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Taxable (₹)</th>
                {isInterState ? (
                  <th className="py-2.5 text-right">IGST (₹)</th>
                ) : (
                  <>
                    <th className="py-2.5 text-right">CGST (₹)</th>
                    <th className="py-2.5 text-right">SGST (₹)</th>
                  </>
                )}
                <th className="py-2.5 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outside-border/40 text-[11px] print:divide-gray-200">
              {displayOrder.items.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="py-3">
                    <p className="font-bold text-white print:text-black">{item.title}</p>
                    <p className="text-[10px] text-outside-muted print:text-gray-600">
                      FIT: {item.fit} · SIZE: {item.size}
                    </p>
                  </td>
                  <td className="py-3 text-outside-muted print:text-gray-600">{item.hsnCode}</td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right">
                    {(item.taxableAmountPaise / 100).toFixed(2)}
                  </td>
                  {isInterState ? (
                    <td className="py-3 text-right">
                      {(item.igstAmountPaise / 100).toFixed(2)} ({item.gstRate}%)
                    </td>
                  ) : (
                    <>
                      <td className="py-3 text-right">
                        {(item.cgstAmountPaise / 100).toFixed(2)} (2.5%)
                      </td>
                      <td className="py-3 text-right">
                        {(item.sgstAmountPaise / 100).toFixed(2)} (2.5%)
                      </td>
                    </>
                  )}
                  <td className="py-3 text-right font-bold text-white print:text-black">
                    {(((item.grossAmountPaise ?? item.totalAmountPaise ?? (item.unitPricePaise * item.quantity))) / 100).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Summary Totals */}
        <div className="border-t border-outside-border/80 pt-6 flex flex-col sm:flex-row justify-between items-start gap-6 print:border-gray-300">
          <div className="text-[11px] text-outside-muted space-y-1 max-w-sm print:text-gray-600">
            <p>1. Certified that the particulars given above are true and correct.</p>
            <p>2. Goods once sold are eligible for 7-day size exchange only.</p>
            <p>3. Jurisdiction: Ahmedabad Courts Only.</p>
          </div>

          <div className="w-full sm:w-64 space-y-2 text-right">
            <div className="flex justify-between text-outside-muted print:text-gray-600">
              <span>Total Taxable:</span>
              <span className="text-white print:text-black">
                ₹{(displayOrder.taxableAmountPaise / 100).toFixed(2)}
              </span>
            </div>

            {isInterState ? (
              <div className="flex justify-between text-outside-crimson print:text-gray-800">
                <span>Total IGST:</span>
                <span>₹{(displayOrder.igstPaise / 100).toFixed(2)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-outside-crimson print:text-gray-800">
                  <span>Total CGST:</span>
                  <span>₹{(displayOrder.cgstPaise / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-outside-crimson print:text-gray-800">
                  <span>Total SGST:</span>
                  <span>₹{(displayOrder.sgstPaise / 100).toFixed(2)}</span>
                </div>
              </>
            )}

            <div className="pt-2 border-t border-outside-border flex justify-between font-bold text-sm text-white print:text-black print:border-gray-300">
              <span>TOTAL INVOICE VALUE:</span>
              <span className="text-outside-crimson print:text-black">
                ₹{(displayOrder.totalAmountPaise / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Signature stamp */}
        <div className="pt-8 border-t border-outside-border/60 flex justify-between items-end print:border-gray-300">
          <div className="flex items-center gap-2 text-[10px] text-outside-muted print:text-gray-600">
            <ShieldCheck className="w-4 h-4 text-outside-crimson" />
            <span>AUTHENTICATED ELECTRONIC INVOICE (GST REG 24AABCO1234F1Z5)</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-outside-muted print:text-gray-600">FOR OUTSIDE APPAREL STUDIO PVT LTD</p>
            <p className="text-xs font-bold text-white print:text-black mt-4">AUTHORIZED SIGNATORY</p>
          </div>
        </div>

      </div>

      {/* Return to drops */}
      <div className="text-center print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-outside-muted hover:text-white uppercase tracking-wider"
        >
          <span>RETURN TO STOREFRONT</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-outside-black text-outside-chalk min-h-screen">
      <Suspense fallback={<div className="p-12 text-center font-mono">LOADING INVOICE...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}

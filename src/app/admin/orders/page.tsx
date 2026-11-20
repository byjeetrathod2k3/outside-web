'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Download, ExternalLink, Printer } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="space-y-8 font-mono">
      
      {/* Header */}
      <div className="border-b border-outside-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase text-outside-crimson font-bold tracking-[0.25em]">
            AUDITED ORDER BOOK &amp; GST TAX INVOICES
          </span>
          <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight mt-1">
            Orders &amp; Invoices
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/admin/gst?export=gstr1"
            className="px-4 py-2.5 bg-outside-crimson hover:bg-outside-crimsonBright text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT GSTR-1 HSN CSV</span>
          </a>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-outside-surface border border-outside-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-xs text-outside-muted">LOADING TAX AUDIT TRAIL...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-outside-muted text-xs">
            NO ORDERS CAPTURED YET. ORDERS FROM THE STOREFRONT WILL INSTANTLY GENERATE SEQUENTIAL INVOICES HERE.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-outside-card border-b border-outside-border text-outside-muted text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="p-4">Tax Invoice No.</th>
                  <th className="p-4">Collector Details</th>
                  <th className="p-4">Place of Supply</th>
                  <th className="p-4 text-right">Taxable (₹)</th>
                  <th className="p-4 text-right">CGST / SGST</th>
                  <th className="p-4 text-right">IGST</th>
                  <th className="p-4 text-right">Total Invoice (₹)</th>
                  <th className="p-4 text-center">Invoice View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outside-border/40">
                {orders.map((order) => {
                  const isInterState = order.stateCode !== '24';
                  return (
                    <tr key={order.id} className="hover:bg-outside-card/50 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-white block">{order.invoiceNumber}</span>
                        <span className="text-[10px] text-outside-muted">{order.orderNumber}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-white block font-bold">{order.customerName}</span>
                        <span className="text-[10px] text-outside-muted">{order.customerEmail}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-outside-chalkDim block">
                          {order.placeOfSupplyState}
                        </span>
                        <span className="text-[9px] text-outside-muted">
                          {isInterState ? 'INTER-STATE (IGST)' : 'INTRA-STATE (CGST+SGST)'}
                        </span>
                      </td>
                      <td className="p-4 text-right text-outside-chalkDim">
                        ₹{(order.taxableAmountPaise / 100).toFixed(2)}
                      </td>
                      <td className="p-4 text-right">
                        {isInterState ? (
                          <span className="text-outside-muted">-</span>
                        ) : (
                          <span className="text-outside-crimson">
                            ₹{(order.cgstPaise / 100).toFixed(2)} + ₹{(order.sgstPaise / 100).toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {isInterState ? (
                          <span className="text-outside-crimson">
                            ₹{(order.igstPaise / 100).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-outside-muted">-</span>
                        )}
                      </td>
                      <td className="p-4 text-right font-bold text-white">
                        ₹{(order.totalAmountPaise / 100).toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <Link
                          href={`/checkout/success?orderNumber=${order.orderNumber}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-outside-card border border-outside-border hover:border-outside-crimson text-[10px] text-white uppercase tracking-wider transition-colors"
                        >
                          <Printer className="w-3 h-3 text-outside-crimson" />
                          <span>INVOICE</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

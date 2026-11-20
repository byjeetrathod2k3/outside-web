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
      <div className="border-b border-[#DCD7CC] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase text-[#B82328] font-bold tracking-[0.25em]">
            AUDITED ORDER BOOK &amp; GST TAX INVOICES
          </span>
          <h1 className="text-2xl font-display font-black text-[#111110] uppercase tracking-tight mt-1">
            Orders &amp; Invoices
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/admin/gst?export=gstr1"
            className="px-4 py-2.5 bg-[#111110] hover:bg-[#B82328] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT GSTR-1 HSN CSV</span>
          </a>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#FCFBF8] border border-[#DCD7CC] overflow-hidden shadow-editorial">
        {loading ? (
          <div className="p-8 text-xs text-[#52504B]">LOADING TAX AUDIT TRAIL...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-[#52504B] text-xs">
            NO ORDERS CAPTURED YET. ORDERS FROM THE STOREFRONT WILL INSTANTLY GENERATE SEQUENTIAL INVOICES HERE.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EDEAE2]/50 border-b border-[#DCD7CC] text-[#52504B] text-[10px] uppercase tracking-wider">
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
              <tbody className="divide-y divide-[#DCD7CC]">
                {orders.map((order) => {
                  const isInterState = order.stateCode !== '24';
                  return (
                    <tr key={order.id} className="hover:bg-[#EDEAE2]/30 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-[#111110] block">{order.invoiceNumber}</span>
                        <span className="text-[10px] text-[#52504B] font-mono">{order.orderNumber}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-[#111110] block font-bold">{order.customerName}</span>
                        <span className="text-[10px] text-[#52504B]">{order.customerEmail}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-[#111110] block font-medium">
                          {order.placeOfSupplyState}
                        </span>
                        <span className="text-[9px] text-[#52504B] uppercase tracking-wider">
                          {isInterState ? 'INTER-STATE (IGST)' : 'INTRA-STATE (CGST+SGST)'}
                        </span>
                      </td>
                      <td className="p-4 text-right text-[#52504B] font-mono">
                        ₹{(order.taxableAmountPaise / 100).toFixed(2)}
                      </td>
                      <td className="p-4 text-right font-mono">
                        {isInterState ? (
                          <span className="text-[#52504B]">-</span>
                        ) : (
                          <span className="text-[#B82328] font-bold">
                            ₹{(order.cgstPaise / 100).toFixed(2)} + ₹{(order.sgstPaise / 100).toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right font-mono">
                        {isInterState ? (
                          <span className="text-[#B82328] font-bold">
                            ₹{(order.igstPaise / 100).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-[#52504B]">-</span>
                        )}
                      </td>
                      <td className="p-4 text-right font-bold text-[#111110] font-mono">
                        ₹{(order.totalAmountPaise / 100).toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <Link
                          href={`/checkout/success?orderNumber=${order.orderNumber}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EDEAE2] border border-[#DCD7CC] hover:border-[#111110] text-[10px] text-[#111110] uppercase tracking-wider transition-colors font-semibold"
                        >
                          <Printer className="w-3 h-3 text-[#B82328]" />
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

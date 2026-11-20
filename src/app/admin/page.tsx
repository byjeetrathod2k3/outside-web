import React from 'react';
import Link from 'next/link';
import { getLocalStore } from '@/lib/db';
import {
  TrendingUp,
  Package,
  Users,
  Receipt,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const store = getLocalStore();
  const activeDrop = store.drops.find((d: any) => d.status === 'LIVE' && d.isFeatured) || store.drops[0];
  const orders = store.orders || [];
  const leads = store.leads || [];
  const gstConfig = store.gstConfig || {};

  // Financial aggregates
  const totalRevenuePaise = orders.reduce((acc: number, o: any) => acc + (o.totalAmountPaise || 0), 0);
  const totalTaxPaise = orders.reduce((acc: number, o: any) => acc + (o.totalTaxPaise || 0), 0);
  const totalCgstPaise = orders.reduce((acc: number, o: any) => acc + (o.cgstPaise || 0), 0);
  const totalSgstPaise = orders.reduce((acc: number, o: any) => acc + (o.sgstPaise || 0), 0);
  const totalIgstPaise = orders.reduce((acc: number, o: any) => acc + (o.igstPaise || 0), 0);

  // Active Drop Inventory metrics
  const totalStockRemaining = activeDrop?.variants?.reduce(
    (acc: number, v: any) => acc + v.currentStock,
    0
  ) || 0;
  const totalEdition = activeDrop?.totalEditionQty || 250;
  const percentClaimed = Math.round(((totalEdition - totalStockRemaining) / totalEdition) * 100);

  return (
    <div className="space-y-8 font-mono">
      
      {/* Top Banner */}
      <div className="border-b border-[#DCD7CC] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase text-[#B82328] font-bold tracking-[0.25em]">
            EXECUTIVE DASHBOARD // REAL-TIME STUDIO VELOCITY
          </span>
          <h1 className="text-2xl font-display font-black text-[#111110] uppercase tracking-tight mt-1">
            Studio Command Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/drops"
            className="px-4 py-2 bg-[#EDEAE2] border border-[#DCD7CC] hover:border-[#111110] text-[#111110] text-xs uppercase tracking-wider transition-colors font-semibold"
          >
            MANAGE DROPS
          </Link>
          <Link
            href="/api/admin/gst?export=gstr1"
            className="px-4 py-2 bg-[#111110] hover:bg-[#B82328] text-white text-xs uppercase tracking-wider font-bold transition-colors shadow-sm"
          >
            EXPORT GSTR-1 CSV
          </Link>
        </div>
      </div>

      {/* KPI Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Drop Velocity */}
        <div className="p-6 bg-[#FCFBF8] border border-[#DCD7CC] space-y-3 shadow-editorial">
          <div className="flex justify-between items-center text-[#52504B] text-xs">
            <span className="font-semibold uppercase tracking-wider">ACTIVE DROP (00{activeDrop?.dropNumber})</span>
            <Package className="w-4 h-4 text-[#B82328]" />
          </div>
          <div className="text-2xl font-bold text-[#111110]">
            {percentClaimed}% <span className="text-xs font-normal text-[#52504B]">CLAIMED</span>
          </div>
          <p className="text-[11px] text-[#52504B]">
            <strong className="text-[#B82328]">{totalStockRemaining}</strong> of {totalEdition} units available
          </p>
        </div>

        {/* Card 2: Total Revenue */}
        <div className="p-6 bg-[#FCFBF8] border border-[#DCD7CC] space-y-3 shadow-editorial">
          <div className="flex justify-between items-center text-[#52504B] text-xs">
            <span className="font-semibold uppercase tracking-wider">TOTAL PROCESSED SALES</span>
            <TrendingUp className="w-4 h-4 text-[#3F4E44]" />
          </div>
          <div className="text-2xl font-bold text-[#111110]">
            ₹{(totalRevenuePaise / 100).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-[#52504B]">
            {orders.length} orders settled via mock/live gateway
          </p>
        </div>

        {/* Card 3: GST Tax Collected */}
        <div className="p-6 bg-[#FCFBF8] border border-[#DCD7CC] space-y-3 shadow-editorial">
          <div className="flex justify-between items-center text-[#52504B] text-xs">
            <span className="font-semibold uppercase tracking-wider">GST ACCRUED (GUJARAT 24)</span>
            <Receipt className="w-4 h-4 text-[#B82328]" />
          </div>
          <div className="text-2xl font-bold text-[#111110]">
            ₹{(totalTaxPaise / 100).toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-[#52504B] truncate">
            CGST: ₹{(totalCgstPaise / 100).toFixed(0)} | SGST: ₹{(totalSgstPaise / 100).toFixed(0)} | IGST: ₹{(totalIgstPaise / 100).toFixed(0)}
          </p>
        </div>

        {/* Card 4: Collector Waitlist */}
        <div className="p-6 bg-[#FCFBF8] border border-[#DCD7CC] space-y-3 shadow-editorial">
          <div className="flex justify-between items-center text-[#52504B] text-xs">
            <span className="font-semibold uppercase tracking-wider">WAITLIST / CRM LEADS</span>
            <Users className="w-4 h-4 text-[#3F4E44]" />
          </div>
          <div className="text-2xl font-bold text-[#111110]">
            {leads.length} <span className="text-xs font-normal text-[#52504B]">QUEUED</span>
          </div>
          <p className="text-[11px] text-[#52504B]">
            Early-access notification broadcast ready
          </p>
        </div>

      </div>

      {/* Grid: Active Drop Variant Stock Gauge & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Active Drop Sizing & Stock Matrix */}
        <div className="lg:col-span-6 bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-4 shadow-editorial">
          <div className="flex justify-between items-center border-b border-[#DCD7CC] pb-3">
            <h3 className="text-xs uppercase tracking-wider text-[#111110] font-bold">
              {activeDrop?.title} // ATOMIC STOCK MATRIX
            </h3>
            <span className="text-[10px] px-2 py-0.5 bg-[#3F4E44]/10 text-[#3F4E44] border border-[#3F4E44]/30 font-bold uppercase tracking-wider">
              {activeDrop?.status}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#DCD7CC] text-[#52504B] text-[10px] uppercase bg-[#EDEAE2]/40">
                  <th className="py-2.5 px-3">Fit Category</th>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3 text-right">Initial</th>
                  <th className="py-2.5 px-3 text-right">Current Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCD7CC] text-[11px]">
                {activeDrop?.variants?.map((v: any) => (
                  <tr key={v.id} className="hover:bg-[#EDEAE2]/30 transition-colors">
                    <td className="py-2.5 px-3 text-[#111110] font-bold">{v.fit}</td>
                    <td className="py-2.5 px-3 text-[#52504B] font-mono">{v.size}</td>
                    <td className="py-2.5 px-3 text-right text-[#52504B] font-mono">{v.initialStock}</td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      <span
                        className={`font-bold ${
                          v.currentStock <= 5 ? 'text-[#B82328]' : 'text-[#3F4E44]'
                        }`}
                      >
                        {v.currentStock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 text-right">
            <Link
              href="/admin/drops"
              className="text-xs text-[#B82328] hover:text-[#111110] font-bold flex items-center justify-end gap-1.5 transition-colors"
            >
              <span>ADJUST PHYSICAL STOCK IN DROP MANAGER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right: Recent Orders & GST Invoices */}
        <div className="lg:col-span-6 bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-4 shadow-editorial">
          <div className="flex justify-between items-center border-b border-[#DCD7CC] pb-3">
            <h3 className="text-xs uppercase tracking-wider text-[#111110] font-bold">
              RECENT TAX INVOICES ({orders.length})
            </h3>
            <Link href="/admin/orders" className="text-[10px] text-[#52504B] hover:text-[#111110] font-bold uppercase tracking-wider">
              VIEW ALL &rarr;
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-[#52504B] py-8 text-center">
              No orders have been recorded yet. Orders placed on storefront will appear with GST tax splits here.
            </p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order: any) => (
                <div
                  key={order.id}
                  className="p-3 bg-[#EDEAE2]/30 border border-[#DCD7CC] flex justify-between items-center text-xs hover:border-[#111110] transition-colors"
                >
                  <div>
                    <p className="font-bold text-[#111110]">{order.invoiceNumber}</p>
                    <p className="text-[10px] text-[#52504B]">
                      {order.customerName} · {order.placeOfSupplyState}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#111110]">
                      ₹{(order.totalAmountPaise / 100).toLocaleString('en-IN')}
                    </p>
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#3F4E44]/10 text-[#3F4E44] border border-[#3F4E44]/30 font-bold uppercase tracking-wider">
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

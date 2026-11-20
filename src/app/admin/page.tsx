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
      <div className="border-b border-outside-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase text-outside-crimson font-bold tracking-[0.25em]">
            EXECUTIVE DASHBOARD // REAL-TIME STUDIO VELOCITY
          </span>
          <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight mt-1">
            Studio Command Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/drops"
            className="px-4 py-2 bg-outside-surface border border-outside-border hover:border-outside-crimson text-white text-xs uppercase tracking-wider transition-colors"
          >
            MANAGE DROPS
          </Link>
          <Link
            href="/api/admin/gst?export=gstr1"
            className="px-4 py-2 bg-outside-crimson hover:bg-outside-crimsonBright text-white text-xs uppercase tracking-wider font-bold transition-colors"
          >
            EXPORT GSTR-1 CSV
          </Link>
        </div>
      </div>

      {/* KPI Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Drop Velocity */}
        <div className="p-6 bg-outside-surface border border-outside-border space-y-3">
          <div className="flex justify-between items-center text-outside-muted text-xs">
            <span>ACTIVE DROP (00{activeDrop?.dropNumber})</span>
            <Package className="w-4 h-4 text-outside-crimson" />
          </div>
          <div className="text-2xl font-bold text-white">
            {percentClaimed}% <span className="text-xs font-normal text-outside-muted">CLAIMED</span>
          </div>
          <p className="text-[11px] text-outside-muted">
            <strong className="text-outside-crimson">{totalStockRemaining}</strong> of {totalEdition} units available
          </p>
        </div>

        {/* Card 2: Total Revenue */}
        <div className="p-6 bg-outside-surface border border-outside-border space-y-3">
          <div className="flex justify-between items-center text-outside-muted text-xs">
            <span>TOTAL PROCESSED SALES</span>
            <TrendingUp className="w-4 h-4 text-outside-crimson" />
          </div>
          <div className="text-2xl font-bold text-white">
            ₹{(totalRevenuePaise / 100).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-outside-muted">
            {orders.length} orders settled via mock/live gateway
          </p>
        </div>

        {/* Card 3: GST Tax Collected */}
        <div className="p-6 bg-outside-surface border border-outside-border space-y-3">
          <div className="flex justify-between items-center text-outside-muted text-xs">
            <span>GST ACCRUED (GUJARAT 24)</span>
            <Receipt className="w-4 h-4 text-outside-crimson" />
          </div>
          <div className="text-2xl font-bold text-white">
            ₹{(totalTaxPaise / 100).toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-outside-muted truncate">
            CGST: ₹{(totalCgstPaise / 100).toFixed(0)} | SGST: ₹{(totalSgstPaise / 100).toFixed(0)} | IGST: ₹{(totalIgstPaise / 100).toFixed(0)}
          </p>
        </div>

        {/* Card 4: Collector Waitlist */}
        <div className="p-6 bg-outside-surface border border-outside-border space-y-3">
          <div className="flex justify-between items-center text-outside-muted text-xs">
            <span>WAITLIST / CRM LEADS</span>
            <Users className="w-4 h-4 text-outside-crimson" />
          </div>
          <div className="text-2xl font-bold text-white">
            {leads.length} <span className="text-xs font-normal text-outside-muted">QUEUED</span>
          </div>
          <p className="text-[11px] text-outside-muted">
            Early-access notification broadcast ready
          </p>
        </div>

      </div>

      {/* Grid: Active Drop Variant Stock Gauge & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Active Drop Sizing & Stock Matrix */}
        <div className="lg:col-span-6 bg-outside-surface border border-outside-border p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-outside-border/80 pb-3">
            <h3 className="text-xs uppercase tracking-wider text-white font-bold">
              {activeDrop?.title} // ATOMIC STOCK MATRIX
            </h3>
            <span className="text-[10px] text-outside-crimson font-bold">
              STATUS: {activeDrop?.status}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-outside-border/60 text-outside-muted text-[10px] uppercase">
                  <th className="py-2">Fit Category</th>
                  <th className="py-2">Size</th>
                  <th className="py-2 text-right">Initial</th>
                  <th className="py-2 text-right">Current Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outside-border/40 text-[11px]">
                {activeDrop?.variants?.map((v: any) => (
                  <tr key={v.id}>
                    <td className="py-2 text-white font-bold">{v.fit}</td>
                    <td className="py-2 text-outside-chalkDim">{v.size}</td>
                    <td className="py-2 text-right text-outside-muted">{v.initialStock}</td>
                    <td className="py-2 text-right">
                      <span
                        className={`font-bold ${
                          v.currentStock <= 5 ? 'text-outside-crimson' : 'text-white'
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
              className="text-xs text-outside-crimson hover:text-outside-crimsonBright flex items-center justify-end gap-1.5"
            >
              <span>ADJUST PHYSICAL STOCK IN DROP MANAGER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right: Recent Orders & GST Invoices */}
        <div className="lg:col-span-6 bg-outside-surface border border-outside-border p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-outside-border/80 pb-3">
            <h3 className="text-xs uppercase tracking-wider text-white font-bold">
              RECENT TAX INVOICES ({orders.length})
            </h3>
            <Link href="/admin/orders" className="text-[10px] text-outside-muted hover:text-white">
              VIEW ALL &rarr;
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-outside-muted py-8 text-center">
              No orders have been recorded yet. Orders placed on storefront will appear with GST tax splits here.
            </p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order: any) => (
                <div
                  key={order.id}
                  className="p-3 bg-outside-card border border-outside-border flex justify-between items-center text-xs"
                >
                  <div>
                    <p className="font-bold text-white">{order.invoiceNumber}</p>
                    <p className="text-[10px] text-outside-muted">
                      {order.customerName} · {order.placeOfSupplyState}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-outside-crimson">
                      ₹{(order.totalAmountPaise / 100).toLocaleString('en-IN')}
                    </p>
                    <span className="text-[9px] px-1.5 py-0.5 bg-outside-surface text-white border border-outside-border">
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

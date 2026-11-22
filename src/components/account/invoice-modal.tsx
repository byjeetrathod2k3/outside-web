'use client';

import React from 'react';
import { X, Printer, Download, ShieldCheck } from 'lucide-react';
import type { VipOrder } from '@/lib/vip-db';

interface InvoiceModalProps {
  order: VipOrder | null;
  onClose: () => void;
}

export function InvoiceModal({ order, onClose }: InvoiceModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const isInterstate = order.igstPaise > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#111110]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Invoice Container */}
      <div className="relative w-full max-w-3xl bg-white text-[#111110] border border-[#DCD7CC] shadow-2xl z-10 my-8 p-6 sm:p-10 font-mono text-xs max-h-[90vh] overflow-y-auto print:m-0 print:p-0 print:border-none print:shadow-none print:max-h-none print:w-full">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#DCD7CC] print:hidden">
          <div className="flex items-center gap-2 text-[#B82328]">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              OFFICIAL GST TAX INVOICE // SECTION 31 CGST ACT
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#111110] text-[#FCFBF8] hover:bg-[#B82328] font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT / SAVE PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#52504B] hover:text-[#111110] border border-[#DCD7CC] hover:bg-[#EDEAE2] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-[#111110]">
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase text-[#111110]">
              OUTSIDE APPAREL STUDIO
            </h1>
            <p className="text-[10px] text-[#52504B] uppercase tracking-widest font-bold">
              OUTSIDE APPAREL STUDIO PRIVATE LIMITED
            </p>
            <p className="text-[11px] text-[#52504B] pt-1 leading-relaxed">
              Plot 104, Design District, SG Highway<br />
              Ahmedabad, Gujarat 380015, India<br />
              <strong className="text-[#111110]">GSTIN:</strong> 24AABCO1234F1Z5 · State Code: 24 (Gujarat)<br />
              <strong>Email:</strong> drops@outside.in · <strong>CIN:</strong> U18101GJ2025PTC123456
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <div className="inline-block px-2.5 py-1 bg-[#111110] text-[#FCFBF8] font-bold text-[11px] uppercase tracking-wider mb-1">
              TAX INVOICE
            </div>
            <p className="text-xs font-bold text-[#111110]">INVOICE #: {order.invoiceNumber}</p>
            <p className="text-[11px] text-[#52504B]">ORDER REF: {order.orderNumber}</p>
            <p className="text-[11px] text-[#52504B]">
              DATE: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
            <p className="text-[11px] text-[#52504B]">PLACE OF SUPPLY: {order.shippingAddress.state} ({order.shippingAddress.stateCode || '27'})</p>
            <p className="text-[10px] text-emerald-700 font-bold uppercase">REVERSE CHARGE: NO</p>
          </div>
        </div>

        {/* Bill To & Ship To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-[#DCD7CC]">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#52504B] font-bold block mb-1">
              BILLED &amp; SHIPPED TO:
            </span>
            <p className="font-bold text-[#111110] text-sm">{order.shippingAddress.recipientName}</p>
            <p className="text-[11px] text-[#52504B] leading-relaxed">
              {order.shippingAddress.streetAddress}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}<br />
              India (State Code: {order.shippingAddress.stateCode || '27'})<br />
              Contact: {order.shippingAddress.phone}
            </p>
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="text-[10px] uppercase tracking-wider text-[#52504B] font-bold block mb-1">
              DISPATCH &amp; PAYMENT DETAILS:
            </span>
            <p className="text-[11px]"><strong className="text-[#111110]">Carrier:</strong> {order.carrier}</p>
            <p className="text-[11px]"><strong className="text-[#111110]">Tracking AWB:</strong> {order.trackingNumber}</p>
            <p className="text-[11px]"><strong className="text-[#111110]">Payment Mode:</strong> {order.paymentMethod.description}</p>
            <p className="text-[11px] text-emerald-700 font-bold uppercase">PAYMENT STATUS: {order.paymentStatus}</p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#111110] text-[10px] uppercase tracking-wider text-[#52504B]">
                <th className="py-2.5">#</th>
                <th className="py-2.5">Item Description</th>
                <th className="py-2.5">HSN Code</th>
                <th className="py-2.5 text-center">Fit / Size</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Taxable Val</th>
                <th className="py-2.5 text-right">GST Rate</th>
                <th className="py-2.5 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCD7CC] text-xs">
              {order.items.map((item, idx) => {
                const itemGross = (item.unitPricePaise * item.quantity) / 100;
                const itemTaxable = Math.round((itemGross / 1.05) * 100) / 100;
                return (
                  <tr key={idx} className="py-3">
                    <td className="py-3 text-[#52504B]">{idx + 1}</td>
                    <td className="py-3 font-bold text-[#111110]">
                      {item.title}
                      <span className="block text-[10px] font-normal text-[#52504B]">
                        SKU: {item.sku} · 280 GSM French Terry
                      </span>
                    </td>
                    <td className="py-3 text-[#52504B]">61091000</td>
                    <td className="py-3 text-center">{item.fit} / {item.size}</td>
                    <td className="py-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 text-right">₹{itemTaxable.toFixed(2)}</td>
                    <td className="py-3 text-right">5.0%</td>
                    <td className="py-3 text-right font-bold">₹{itemGross.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tax Summary Table */}
        <div className="border-t-2 border-[#111110] pt-4 flex flex-col sm:flex-row justify-between gap-6">
          <div className="space-y-1 max-w-sm text-[10px] text-[#52504B] leading-relaxed">
            <p className="font-bold uppercase text-[#111110]">Tax Breakup Summary (Apparel Under ₹2,500 = 5% GST):</p>
            {isInterstate ? (
              <p>Integrated GST (IGST @ 5.00%): ₹{(order.igstPaise / 100).toFixed(2)}</p>
            ) : (
              <p>
                Central GST (CGST @ 2.50%): ₹{(order.cgstPaise / 100).toFixed(2)}<br />
                State GST (SGST @ 2.50%): ₹{(order.sgstPaise / 100).toFixed(2)}
              </p>
            )}
            <p className="pt-2 italic">
              Whether tax is payable on reverse charge basis: No.<br />
              This is a computer-generated tax invoice issued in accordance with Rule 46 of CGST Rules 2017.
            </p>
          </div>

          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-[#52504B]">
              <span>Taxable Subtotal:</span>
              <span>₹{(order.taxableAmountPaise / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#52504B]">
              <span>Total Tax (GST):</span>
              <span>₹{(order.totalTaxPaise / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#52504B]">
              <span>Shipping &amp; Handling:</span>
              <span className="text-emerald-700 font-bold">FREE (VIP BENEFIT)</span>
            </div>
            <div className="flex justify-between text-sm font-black text-[#111110] pt-2 border-t border-[#111110]">
              <span>TOTAL PAYABLE:</span>
              <span className="text-[#B82328]">₹{(order.totalAmountPaise / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer Signature */}
        <div className="mt-8 pt-6 border-t border-[#DCD7CC] flex flex-col sm:flex-row justify-between items-end text-[10px] text-[#52504B]">
          <div>
            <p className="font-bold text-[#111110]">THANK YOU FOR YOUR PATRONAGE.</p>
            <p>For questions or exchange requests, email support@outside.in or use the VIP Concierge tab.</p>
          </div>
          <div className="text-right pt-4 sm:pt-0">
            <div className="w-32 border-b border-[#111110] mb-1"></div>
            <p className="font-bold text-[#111110]">Authorized Signatory</p>
            <p>OUTSIDE APPAREL STUDIO PVT LTD</p>
          </div>
        </div>

      </div>
    </div>
  );
}

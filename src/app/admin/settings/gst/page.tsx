'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { validateGujaratGstin } from '@/lib/gst';

export default function AdminGstSettingsPage() {
  const [config, setConfig] = useState<any>({
    isEnabled: true,
    sellerLegalName: 'OUTSIDE APPAREL STUDIO PVT LTD',
    gstin: '24AABCO1234F1Z5',
    originStateCode: '24',
    originStateName: 'Gujarat',
    registeredAddress: 'Plot 104, Design District, SG Highway, Ahmedabad, Gujarat 380015',
    pricingMode: 'TAX_INCLUSIVE',
    thresholdInr: 2500,
    lowSlabRate: 5.0,
    highSlabRate: 18.0,
    defaultHsn: '61091000',
    invoicePrefix: 'OUT/26-27/',
    invoiceCounter: 1,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/admin/gst');
        if (res.ok) {
          const data = await res.json();
          if (data.config) setConfig(data.config);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    // Validate Gujarat GSTIN format
    if (config.gstin && !validateGujaratGstin(config.gstin)) {
      setError('Invalid Gujarat GSTIN format. Expected 24 followed by PAN, entity code, Z and checksum.');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/gst', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save configuration');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Saving failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-xs text-[#52504B] font-mono">LOADING GST ENGINE PARAMETERS...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8 font-mono">
      
      {/* Header */}
      <div className="border-b border-[#DCD7CC] pb-6 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase text-[#B82328] font-bold tracking-[0.25em]">
            STATUTORY TAX CONFIGURATION // GST (INDIA)
          </span>
          <h1 className="text-2xl font-display font-black text-[#111110] uppercase tracking-tight mt-1">
            India Apparel GST Engine Controls
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/admin/gst?export=gstr1"
            className="px-3.5 py-1.5 bg-[#FCFBF8] border border-[#DCD7CC] hover:border-[#111110] text-[#111110] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <span>DOWNLOAD GSTR-1 CSV</span>
          </a>
          <div className="flex items-center gap-2 text-xs text-[#3F4E44] bg-[#3F4E44]/10 border border-[#3F4E44]/30 px-3 py-1 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#3F4E44]" />
            <span>GST STATUTORY COMPLIANCE</span>
          </div>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-[#3F4E44]/10 border border-[#3F4E44] text-[#3F4E44] text-xs flex items-center gap-2 font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#3F4E44] flex-shrink-0" />
          <span>GST ENGINE PARAMETERS UPDATED AND ACTIVE IN REAL-TIME.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-[#B82328]/10 border border-[#B82328] text-[#B82328] text-xs flex items-center gap-2 font-bold">
          <AlertCircle className="w-4 h-4 text-[#B82328] flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 bg-[#FCFBF8] border border-[#DCD7CC] p-8 shadow-editorial">
        
        {/* Toggle GST Enabled */}
        <div className="flex items-center justify-between p-4 bg-[#EDEAE2]/40 border border-[#DCD7CC]">
          <div>
            <span className="text-xs font-bold text-[#111110] uppercase block">
              ENABLE AUTOMATED APPAREL GST CALCULATION
            </span>
            <p className="text-[11px] text-[#52504B] mt-0.5">
              When enabled, dynamic 5% vs 18% slabs and CGST/SGST/IGST splits will be enforced at checkout.
            </p>
          </div>
          <input
            type="checkbox"
            checked={config.isEnabled}
            onChange={(e) => setConfig({ ...config, isEnabled: e.target.checked })}
            className="w-5 h-5 accent-[#B82328] cursor-pointer"
          />
        </div>

        {/* Section 1: Legal Entity & Origin Details */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase text-[#B82328] font-bold tracking-wider">
            1. SELLER STATUTORY REGISTRATION (INDIA)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                SELLER LEGAL ENTITY NAME *
              </label>
              <input
                type="text"
                required
                value={config.sellerLegalName}
                onChange={(e) => setConfig({ ...config, sellerLegalName: e.target.value })}
                className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                GSTIN (GST IDENTIFICATION NUMBER) *
              </label>
              <input
                type="text"
                required
                value={config.gstin}
                onChange={(e) => setConfig({ ...config, gstin: e.target.value })}
                className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none font-mono transition-colors"
              />
              <span className="text-[10px] text-[#52504B] mt-1 block">
                Must be valid 15-character GSTIN (e.g. 24AABCO1234F1Z5)
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
              REGISTERED PRINCIPAL PLACE OF BUSINESS *
            </label>
            <input
              type="text"
              required
              value={config.registeredAddress}
              onChange={(e) => setConfig({ ...config, registeredAddress: e.target.value })}
              className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Section 2: Dynamic Slabs & HSN */}
        <div className="space-y-4 pt-4 border-t border-[#DCD7CC]">
          <h3 className="text-xs uppercase text-[#B82328] font-bold tracking-wider">
            2. VALUE-BASED TAX SLAB MECHANICS (HSN 6109)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                VALUE THRESHOLD (INR / PIECE)
              </label>
              <input
                type="number"
                value={config.thresholdInr}
                onChange={(e) => setConfig({ ...config, thresholdInr: Number(e.target.value) })}
                className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none font-mono"
              />
              <span className="text-[10px] text-[#52504B] mt-1 block">Standard: ₹2,500</span>
            </div>

            <div>
              <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                LOW SLAB RATE (&le; THRESHOLD) %
              </label>
              <input
                type="number"
                step="0.5"
                value={config.lowSlabRate}
                onChange={(e) => setConfig({ ...config, lowSlabRate: Number(e.target.value) })}
                className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none font-mono"
              />
              <span className="text-[10px] text-[#52504B] mt-1 block">Apparel rate: 5%</span>
            </div>

            <div>
              <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                HIGH SLAB RATE (&gt; THRESHOLD) %
              </label>
              <input
                type="number"
                step="0.5"
                value={config.highSlabRate}
                onChange={(e) => setConfig({ ...config, highSlabRate: Number(e.target.value) })}
                className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none font-mono"
              />
              <span className="text-[10px] text-[#52504B] mt-1 block">Apparel rate: 18%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                DEFAULT HSN CODE
              </label>
              <input
                type="text"
                value={config.defaultHsn}
                onChange={(e) => setConfig({ ...config, defaultHsn: e.target.value })}
                className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none font-mono"
              />
              <span className="text-[10px] text-[#52504B] mt-1 block">
                61091000 for Cotton Knitted/Crocheted T-Shirts
              </span>
            </div>

            <div>
              <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                PRICING MODE
              </label>
              <select
                value={config.pricingMode}
                onChange={(e) => setConfig({ ...config, pricingMode: e.target.value })}
                className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none"
              >
                <option value="TAX_INCLUSIVE">TAX_INCLUSIVE (MRP includes GST - Indian D2C Standard)</option>
                <option value="TAX_EXCLUSIVE">TAX_EXCLUSIVE (Tax calculated on top of base)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Sequential Invoicing */}
        <div className="space-y-4 pt-4 border-t border-[#DCD7CC]">
          <h3 className="text-xs uppercase text-[#B82328] font-bold tracking-wider">
            3. SEQUENTIAL INVOICE NUMBERING
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                FINANCIAL YEAR PREFIX
              </label>
              <input
                type="text"
                value={config.invoicePrefix}
                onChange={(e) => setConfig({ ...config, invoicePrefix: e.target.value })}
                className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none font-mono"
              />
              <span className="text-[10px] text-[#52504B] mt-1 block">
                Example: OUT/26-27/ creates OUT/26-27/0001
              </span>
            </div>

            <div>
              <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                NEXT INVOICE COUNTER
              </label>
              <input
                type="number"
                value={config.invoiceCounter}
                onChange={(e) => setConfig({ ...config, invoiceCounter: Number(e.target.value) })}
                className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3.5 py-2.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none font-mono"
              />
              <span className="text-[10px] text-[#52504B] mt-1 block">
                Automatically increments upon checkout
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-[#DCD7CC] flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#111110] hover:bg-[#B82328] text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'UPDATING...' : 'SAVE GST CONFIGURATION'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}

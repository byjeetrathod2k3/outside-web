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
    return <div className="p-8 text-xs text-outside-muted font-mono">LOADING GST ENGINE PARAMETERS...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8 font-mono">
      
      {/* Header */}
      <div className="border-b border-outside-border pb-6 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase text-outside-crimson font-bold tracking-[0.25em]">
            STATUTORY TAX CONFIGURATION // STATE CODE 24
          </span>
          <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight mt-1">
            India Apparel GST Engine Controls
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-outside-muted">
          <ShieldCheck className="w-4 h-4 text-outside-crimson" />
          <span>GUJARAT (24) ENFORCED</span>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-outside-surface border border-outside-crimson text-white text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-outside-crimson flex-shrink-0" />
          <span>GST ENGINE PARAMETERS UPDATED AND ACTIVE IN REAL-TIME.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-outside-surface border border-outside-crimson text-white text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-outside-crimson flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 bg-outside-surface border border-outside-border p-8">
        
        {/* Toggle GST Enabled */}
        <div className="flex items-center justify-between p-4 bg-outside-card border border-outside-border">
          <div>
            <span className="text-xs font-bold text-white uppercase block">
              ENABLE AUTOMATED APPAREL GST CALCULATION
            </span>
            <p className="text-[11px] text-outside-muted mt-0.5">
              When enabled, dynamic 5% vs 18% slabs and CGST/SGST/IGST splits will be enforced at checkout.
            </p>
          </div>
          <input
            type="checkbox"
            checked={config.isEnabled}
            onChange={(e) => setConfig({ ...config, isEnabled: e.target.checked })}
            className="w-5 h-5 accent-outside-crimson cursor-pointer"
          />
        </div>

        {/* Section 1: Legal Entity & Origin Details */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase text-outside-crimson font-bold tracking-wider">
            1. SELLER STATUTORY REGISTRATION (ORIGIN: GUJARAT - 24)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                SELLER LEGAL ENTITY NAME *
              </label>
              <input
                type="text"
                required
                value={config.sellerLegalName}
                onChange={(e) => setConfig({ ...config, sellerLegalName: e.target.value })}
                className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                GUJARAT GSTIN (STATE CODE 24) *
              </label>
              <input
                type="text"
                required
                value={config.gstin}
                onChange={(e) => setConfig({ ...config, gstin: e.target.value })}
                className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
              />
              <span className="text-[10px] text-outside-muted mt-1 block">
                Must be valid 15-character Gujarat GSTIN (e.g. 24AABCO1234F1Z5)
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
              REGISTERED PRINCIPAL PLACE OF BUSINESS *
            </label>
            <input
              type="text"
              required
              value={config.registeredAddress}
              onChange={(e) => setConfig({ ...config, registeredAddress: e.target.value })}
              className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Dynamic Slabs & HSN */}
        <div className="space-y-4 pt-4 border-t border-outside-border/80">
          <h3 className="text-xs uppercase text-outside-crimson font-bold tracking-wider">
            2. VALUE-BASED TAX SLAB MECHANICS (HSN 6109)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                VALUE THRESHOLD (INR / PIECE)
              </label>
              <input
                type="number"
                value={config.thresholdInr}
                onChange={(e) => setConfig({ ...config, thresholdInr: Number(e.target.value) })}
                className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
              />
              <span className="text-[10px] text-outside-muted mt-1 block">Standard: ₹2,500</span>
            </div>

            <div>
              <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                LOW SLAB RATE (&le; THRESHOLD) %
              </label>
              <input
                type="number"
                step="0.5"
                value={config.lowSlabRate}
                onChange={(e) => setConfig({ ...config, lowSlabRate: Number(e.target.value) })}
                className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
              />
              <span className="text-[10px] text-outside-muted mt-1 block">Apparel rate: 5%</span>
            </div>

            <div>
              <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                HIGH SLAB RATE (&gt; THRESHOLD) %
              </label>
              <input
                type="number"
                step="0.5"
                value={config.highSlabRate}
                onChange={(e) => setConfig({ ...config, highSlabRate: Number(e.target.value) })}
                className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
              />
              <span className="text-[10px] text-outside-muted mt-1 block">Apparel rate: 18%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                DEFAULT HSN CODE
              </label>
              <input
                type="text"
                value={config.defaultHsn}
                onChange={(e) => setConfig({ ...config, defaultHsn: e.target.value })}
                className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
              />
              <span className="text-[10px] text-outside-muted mt-1 block">
                61091000 for Cotton Knitted/Crocheted T-Shirts
              </span>
            </div>

            <div>
              <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                PRICING MODE
              </label>
              <select
                value={config.pricingMode}
                onChange={(e) => setConfig({ ...config, pricingMode: e.target.value })}
                className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
              >
                <option value="TAX_INCLUSIVE">TAX_INCLUSIVE (MRP includes GST - Indian D2C Standard)</option>
                <option value="TAX_EXCLUSIVE">TAX_EXCLUSIVE (Tax calculated on top of base)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Sequential Invoicing */}
        <div className="space-y-4 pt-4 border-t border-outside-border/80">
          <h3 className="text-xs uppercase text-outside-crimson font-bold tracking-wider">
            3. SEQUENTIAL INVOICE NUMBERING
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                FINANCIAL YEAR PREFIX
              </label>
              <input
                type="text"
                value={config.invoicePrefix}
                onChange={(e) => setConfig({ ...config, invoicePrefix: e.target.value })}
                className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
              />
              <span className="text-[10px] text-outside-muted mt-1 block">
                Example: OUT/26-27/ creates OUT/26-27/0001
              </span>
            </div>

            <div>
              <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                NEXT INVOICE COUNTER
              </label>
              <input
                type="number"
                value={config.invoiceCounter}
                onChange={(e) => setConfig({ ...config, invoiceCounter: Number(e.target.value) })}
                className="w-full bg-outside-card border border-outside-border px-3.5 py-2.5 text-xs text-white focus:border-outside-crimson focus:outline-none"
              />
              <span className="text-[10px] text-outside-muted mt-1 block">
                Automatically increments upon checkout
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-outside-border/80 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-outside-crimson hover:bg-outside-crimsonBright text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'UPDATING...' : 'SAVE GST CONFIGURATION'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}

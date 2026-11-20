'use client';

import React, { useState, useEffect } from 'react';
import {
  ToggleLeft,
  ToggleRight,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Shield,
  ShoppingBag,
  Globe,
  Lock,
} from 'lucide-react';

export default function AdminFeaturesPage() {
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadFlags() {
      try {
        const res = await fetch('/api/admin/features');
        if (res.ok) {
          const data = await res.json();
          if (data.flags) setFlags(data.flags);
        }
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadFlags();
  }, []);

  const handleToggle = (key: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.key === key ? { ...f, isEnabled: !f.isEnabled } : f))
    );
  };

  const handleConfigChange = (key: string, field: string, value: any) => {
    setFlags((prev) =>
      prev.map((f) => {
        if (f.key === key) {
          return {
            ...f,
            configJson: {
              ...(f.configJson || {}),
              [field]: value,
            },
          };
        }
        return f;
      })
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/admin/features', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flags),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update feature flags');
      }

      setSuccessMsg('FEATURE FLAGS SAVED // STOREFRONT CAPABILITIES SYNCHRONIZED');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset all feature flags to factory defaults?')) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      const data = await res.json();
      if (res.ok && data.flags) {
        setFlags(data.flags);
        setSuccessMsg('FEATURE FLAGS RESTORED TO FACTORY DEFAULTS.');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const commerceFlags = flags.filter((f) => f.category === 'COMMERCE');
  const siteWideFlags = flags.filter((f) => f.category === 'SITE_WIDE');

  if (loading) {
    return <div className="p-8 font-mono text-xs text-[#52504B]">LOADING FEATURE CONTROL REPOSITORY...</div>;
  }

  return (
    <div className="space-y-8 font-mono">
      
      {/* Header */}
      <div className="border-b border-[#DCD7CC] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase text-[#B82328] font-bold tracking-[0.25em]">
            LIVE RUNTIME CAPABILITY GOVERNANCE
          </span>
          <h1 className="text-2xl font-display font-black text-[#111110] uppercase tracking-tight mt-1">
            Granular Feature Control Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-[#EDEAE2] border border-[#DCD7CC] hover:border-[#111110] text-[#111110] text-xs uppercase tracking-wider flex items-center gap-2 font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#B82328]" />
            <span>FACTORY RESET</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-5 py-2 bg-[#111110] hover:bg-[#B82328] text-white text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'SYNCHRONIZING...' : 'SAVE & REVALIDATE'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-[#3F4E44]/10 border border-[#3F4E44] text-[#3F4E44] text-xs flex items-center gap-2 font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#3F4E44] flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-[#B82328]/10 border border-[#B82328] text-[#B82328] text-xs flex items-center gap-2 font-bold">
          <AlertTriangle className="w-4 h-4 text-[#B82328] flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Column 1: Commerce & Single-Drop Controls */}
        <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-6 shadow-editorial">
          <div className="border-b border-[#DCD7CC] pb-3 flex justify-between items-center">
            <h3 className="text-xs uppercase text-[#111110] font-bold tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#B82328]" />
              <span>SINGLE-DROP &amp; COMMERCE GOVERNANCE</span>
            </h3>
            <span className="text-[10px] text-[#52504B]">{commerceFlags.length} CONTROLS</span>
          </div>

          <div className="space-y-4">
            {commerceFlags.map((flag) => (
              <div
                key={flag.key}
                className="p-4 bg-[#EDEAE2]/30 border border-[#DCD7CC] space-y-3 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#111110] uppercase">
                        {flag.label}
                      </span>
                      <span className="text-[9px] font-mono text-[#52504B]">
                        ({flag.key})
                      </span>
                    </div>
                    <p className="text-[11px] text-[#52504B] leading-relaxed">
                      {flag.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggle(flag.key)}
                    className="cursor-pointer text-[#111110] hover:text-[#B82328] transition-colors flex-shrink-0"
                  >
                    {flag.isEnabled ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#3F4E44]/10 text-[#3F4E44] border border-[#3F4E44]/30 text-[10px] font-bold uppercase">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#52504B]/10 text-[#52504B] border border-[#52504B]/30 text-[10px] font-bold uppercase">
                        DISABLED
                      </span>
                    )}
                  </button>
                </div>

                {/* Sub-parameters for specific flags */}
                {flag.key === 'low_stock_threshold' && flag.isEnabled && (
                  <div className="pt-2 border-t border-[#DCD7CC] flex items-center justify-between text-xs">
                    <span className="text-[#52504B]">THRESHOLD VALUE (PIECES):</span>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={flag.configJson?.threshold || 10}
                      onChange={(e) =>
                        handleConfigChange(flag.key, 'threshold', Number(e.target.value))
                      }
                      className="w-20 bg-[#FCFBF8] border border-[#DCD7CC] px-2 py-1 text-xs text-right font-mono"
                    />
                  </div>
                )}

                {flag.key === 'enable_fit_toggle' && flag.isEnabled && (
                  <div className="pt-2 border-t border-[#DCD7CC] flex items-center justify-between text-xs">
                    <span className="text-[#52504B]">DEFAULT ACTIVE FIT TAB:</span>
                    <select
                      value={flag.configJson?.defaultFit || 'WOMEN'}
                      onChange={(e) =>
                        handleConfigChange(flag.key, 'defaultFit', e.target.value)
                      }
                      className="bg-[#FCFBF8] border border-[#DCD7CC] px-2 py-1 text-xs"
                    >
                      <option value="WOMEN">WOMEN (PRIMARY FIT)</option>
                      <option value="MEN">MEN (RELAXED)</option>
                    </select>
                  </div>
                )}

                {flag.key === 'enable_checkout_flow' && (
                  <div className="pt-2 border-t border-[#DCD7CC] text-[10px] text-[#52504B]">
                    {flag.isEnabled
                      ? '✓ Live payments enabled. Customers can checkout with Indian GST tax invoice.'
                      : '⚠ Waitlist-Only Mode: Checkout disabled; storefront captures waitlist leads.'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Site-Wide Modules & Maintenance Mode */}
        <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-6 shadow-editorial">
          <div className="border-b border-[#DCD7CC] pb-3 flex justify-between items-center">
            <h3 className="text-xs uppercase text-[#111110] font-bold tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#B82328]" />
              <span>SITE-WIDE MODULES &amp; PRIVACY</span>
            </h3>
            <span className="text-[10px] text-[#52504B]">{siteWideFlags.length} CONTROLS</span>
          </div>

          <div className="space-y-4">
            {siteWideFlags.map((flag) => (
              <div
                key={flag.key}
                className={`p-4 border space-y-3 transition-colors ${
                  flag.key === 'enable_maintenance_mode' && flag.isEnabled
                    ? 'bg-[#B82328]/10 border-[#B82328]'
                    : 'bg-[#EDEAE2]/30 border-[#DCD7CC]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#111110] uppercase">
                        {flag.label}
                      </span>
                      <span className="text-[9px] font-mono text-[#52504B]">
                        ({flag.key})
                      </span>
                    </div>
                    <p className="text-[11px] text-[#52504B] leading-relaxed">
                      {flag.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggle(flag.key)}
                    className="cursor-pointer text-[#111110] hover:text-[#B82328] transition-colors flex-shrink-0"
                  >
                    {flag.isEnabled ? (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase border ${
                        flag.key === 'enable_maintenance_mode'
                          ? 'bg-[#B82328] text-white border-[#B82328]'
                          : 'bg-[#3F4E44]/10 text-[#3F4E44] border-[#3F4E44]/30'
                      }`}>
                        {flag.key === 'enable_maintenance_mode' ? 'LIVE MAINTENANCE' : 'ACTIVE'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#52504B]/10 text-[#52504B] border border-[#52504B]/30 text-[10px] font-bold uppercase">
                        DISABLED
                      </span>
                    )}
                  </button>
                </div>

                {/* Sub-parameters: Announcement Bar text & link */}
                {flag.key === 'enable_announcement_bar' && flag.isEnabled && (
                  <div className="pt-2 border-t border-[#DCD7CC] space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-[#52504B] block mb-1">TICKER ANNOUNCEMENT TEXT:</span>
                      <input
                        type="text"
                        value={flag.configJson?.text || ''}
                        onChange={(e) =>
                          handleConfigChange(flag.key, 'text', e.target.value)
                        }
                        className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-2.5 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#52504B] block mb-1">TARGET URL LINK:</span>
                      <input
                        type="text"
                        value={flag.configJson?.link || '/'}
                        onChange={(e) =>
                          handleConfigChange(flag.key, 'link', e.target.value)
                        }
                        className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-2.5 py-1 text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Sub-parameters: Maintenance Mode copy */}
                {flag.key === 'enable_maintenance_mode' && flag.isEnabled && (
                  <div className="pt-2 border-t border-[#B82328]/40 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-[#B82328] block mb-1 font-bold">
                        MAINTENANCE HEADLINE:
                      </span>
                      <input
                        type="text"
                        value={flag.configJson?.headline || ''}
                        onChange={(e) =>
                          handleConfigChange(flag.key, 'headline', e.target.value)
                        }
                        className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-2.5 py-1 text-xs"
                      />
                    </div>
                    <p className="text-[10px] text-[#52504B]">
                      Note: The `/admin` command center will remain 100% accessible to authenticated operators.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

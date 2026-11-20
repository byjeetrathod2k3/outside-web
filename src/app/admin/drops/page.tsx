'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Plus, Save, CheckCircle, AlertCircle, Eye } from 'lucide-react';

export default function AdminDropsPage() {
  const [drops, setDrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrop, setSelectedDrop] = useState<any>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDrops() {
      try {
        const res = await fetch('/api/admin/drops');
        if (res.ok) {
          const data = await res.json();
          setDrops(data);
          setSelectedDrop(data[0] || null);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDrops();
  }, []);

  const handleUpdateStock = (variantId: string, newStock: number) => {
    if (!selectedDrop) return;
    const updatedVariants = selectedDrop.variants.map((v: any) =>
      v.id === variantId ? { ...v, currentStock: Math.max(0, newStock) } : v
    );
    setSelectedDrop({ ...selectedDrop, variants: updatedVariants });
  };

  const handleSaveDrop = async () => {
    if (!selectedDrop) return;
    setSaveSuccess(false);
    setError(null);

    try {
      const res = await fetch('/api/admin/drops', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedDrop),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update drop');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'LIVE':
        return 'bg-[#3F4E44]/10 text-[#3F4E44] border-[#3F4E44]/30';
      case 'SOLD_OUT':
        return 'bg-[#B82328]/10 text-[#B82328] border-[#B82328]/30';
      default:
        return 'bg-[#52504B]/10 text-[#52504B] border-[#52504B]/30';
    }
  };

  if (loading) {
    return <div className="p-8 font-mono text-xs text-[#52504B]">LOADING DROP PORTFOLIO...</div>;
  }

  return (
    <div className="space-y-8 font-mono">
      
      {/* Header */}
      <div className="border-b border-[#DCD7CC] pb-6 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase text-[#B82328] font-bold tracking-[0.25em]">
            SINGLE-DROP PRODUCTION LIFECYCLE
          </span>
          <h1 className="text-2xl font-display font-black text-[#111110] uppercase tracking-tight mt-1">
            Drop &amp; Inventory Manager
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="px-4 py-2 bg-[#EDEAE2] border border-[#DCD7CC] hover:border-[#111110] text-[#111110] text-xs uppercase tracking-wider flex items-center gap-2 font-semibold transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#B82328]" />
            <span>VIEW LIVE STOREFRONT</span>
          </a>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-[#3F4E44]/10 border border-[#3F4E44] text-[#3F4E44] text-xs flex items-center gap-2 font-bold">
          <CheckCircle className="w-4 h-4 text-[#3F4E44]" />
          <span>DROP SPECIFICATIONS &amp; ATOMIC STOCK COMMITTED SUCCESSFULLY.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-[#B82328]/10 border border-[#B82328] text-[#B82328] text-xs flex items-center gap-2 font-bold">
          <AlertCircle className="w-4 h-4 text-[#B82328]" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Drops List */}
        <div className="lg:col-span-4 bg-[#FCFBF8] border border-[#DCD7CC] p-4 space-y-3 shadow-editorial">
          <h3 className="text-xs uppercase text-[#52504B] px-2 py-1 font-bold">
            EDITIONS LIST ({drops.length})
          </h3>
          <div className="space-y-2">
            {drops.map((drop) => (
              <button
                key={drop.id}
                onClick={() => setSelectedDrop(drop)}
                className={`w-full text-left p-3 border transition-all text-xs cursor-pointer ${
                  selectedDrop?.id === drop.id
                    ? 'bg-[#EDEAE2] border-[#111110] text-[#111110] shadow-sm'
                    : 'bg-[#FCFBF8] border-[#DCD7CC] text-[#52504B] hover:text-[#111110] hover:border-[#111110]/50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#111110]">DROP 00{drop.dropNumber}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 border font-bold uppercase tracking-wider ${getStatusBadge(
                      drop.status
                    )}`}
                  >
                    {drop.status}
                  </span>
                </div>
                <p className="truncate text-[#111110] font-medium">{drop.title}</p>
                <p className="text-[10px] text-[#52504B] mt-1 font-mono">
                  Edition: {drop.totalEditionQty} pieces · ₹{(drop.pricePaise / 100).toLocaleString('en-IN')}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Drop Editor */}
        {selectedDrop && (
          <div className="lg:col-span-8 bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-6 shadow-editorial">
            <div className="flex justify-between items-center border-b border-[#DCD7CC] pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#111110] uppercase">
                  EDITING {selectedDrop.title}
                </h3>
                <p className="text-[11px] text-[#52504B] font-mono">
                  SLUG: {selectedDrop.slug}
                </p>
              </div>

              <button
                onClick={handleSaveDrop}
                className="px-5 py-2.5 bg-[#111110] hover:bg-[#B82328] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>SAVE CHANGES</span>
              </button>
            </div>

            {/* Drop Status & Featured Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                  LIFECYCLE STATUS
                </label>
                <select
                  value={selectedDrop.status}
                  onChange={(e) => setSelectedDrop({ ...selectedDrop, status: e.target.value })}
                  className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3 py-2 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none transition-colors"
                >
                  <option value="DRAFT">DRAFT (Hidden from storefront)</option>
                  <option value="UPCOMING">UPCOMING (Countdown ticker active)</option>
                  <option value="LIVE">LIVE (Accepting orders on homepage)</option>
                  <option value="SOLD_OUT">SOLD_OUT (Waitlist gate active)</option>
                  <option value="ARCHIVED">ARCHIVED (Permanently moved to Vault)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                  FEATURE ON HOMEPAGE
                </label>
                <select
                  value={selectedDrop.isFeatured ? 'true' : 'false'}
                  onChange={(e) =>
                    setSelectedDrop({ ...selectedDrop, isFeatured: e.target.value === 'true' })
                  }
                  className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3 py-2 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none transition-colors"
                >
                  <option value="true">YES - ACTIVE HOMEPAGE DROP</option>
                  <option value="false">NO - SECONDARY / ARCHIVE</option>
                </select>
              </div>
            </div>

            {/* Pricing (Paise) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                  PRICE (INR - PER PIECE)
                </label>
                <input
                  type="number"
                  value={selectedDrop.pricePaise / 100}
                  onChange={(e) =>
                    setSelectedDrop({
                      ...selectedDrop,
                      pricePaise: Number(e.target.value) * 100,
                    })
                  }
                  className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3 py-2 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none transition-colors font-mono"
                />
                <span className="text-[10px] text-[#52504B] mt-1 block">
                  {selectedDrop.pricePaise / 100 <= 2500
                    ? 'Qualifies for 5% GST slab'
                    : 'Exceeds ₹2,500: Qualifies for 18% GST slab'}
                </span>
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                  TOTAL EDITION RUN
                </label>
                <input
                  type="number"
                  value={selectedDrop.totalEditionQty}
                  onChange={(e) =>
                    setSelectedDrop({
                      ...selectedDrop,
                      totalEditionQty: Number(e.target.value),
                    })
                  }
                  className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3 py-2 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            {/* Atomic Variant Stock Adjuster */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs uppercase text-[#111110] font-bold tracking-wider">
                ATOMIC STOCK MANAGEMENT PER SILHOUETTE &amp; SIZE
              </h4>

              <div className="border border-[#DCD7CC] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EDEAE2]/50 border-b border-[#DCD7CC] text-[#52504B] text-[10px] uppercase">
                    <tr>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Fit</th>
                      <th className="p-3">Size</th>
                      <th className="p-3 text-right">Remaining Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCD7CC]">
                    {selectedDrop.variants?.map((v: any) => (
                      <tr key={v.id} className="hover:bg-[#EDEAE2]/30 transition-colors">
                        <td className="p-3 font-mono text-[#52504B] text-[11px]">{v.sku}</td>
                        <td className="p-3 font-bold text-[#111110]">{v.fit}</td>
                        <td className="p-3 text-[#52504B] font-mono">{v.size}</td>
                        <td className="p-3 text-right">
                          <input
                            type="number"
                            min="0"
                            value={v.currentStock}
                            onChange={(e) =>
                              handleUpdateStock(v.id, Number(e.target.value))
                            }
                            className="w-20 bg-[#FCFBF8] border border-[#DCD7CC] px-2 py-1 text-xs text-right text-[#111110] focus:border-[#B82328] focus:outline-none font-mono"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

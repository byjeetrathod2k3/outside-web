'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Boxes,
  Package,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Search,
  Filter,
  Plus,
  Minus,
  Edit3,
  History,
  ShieldAlert,
  ArrowUpDown,
  Copy,
  Check,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';

interface Variant {
  id: string;
  dropId: string;
  sku: string;
  fit: 'WOMEN' | 'MEN' | 'UNISEX';
  size: string;
  initialStock: number;
  currentStock: number;
  reservedStock: number;
  unitsSold: number;
  stockHealth: 'OPTIMAL' | 'LOW' | 'CRITICAL' | 'SOLD_OUT';
}

interface Drop {
  id: string;
  dropNumber: number;
  slug: string;
  title: string;
  subtitle?: string;
  pricePaise: number;
  status: 'LIVE' | 'UPCOMING' | 'ARCHIVED' | 'SOLD_OUT' | 'DRAFT';
  isFeatured: boolean;
  primaryImageUrl: string;
  totalEditionQty: number;
  totalStock: number;
  remainingStock: number;
  reservedStock: number;
  soldStock: number;
  percentClaimed: number;
  variants: Variant[];
}

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: {
    dropId?: string;
    dropTitle?: string;
    sku?: string;
    fit?: string;
    size?: string;
    oldStock?: number;
    newStock?: number;
    delta?: number;
    reason?: string;
    adminUser?: string;
  };
  createdAt: string;
}

export default function AdminInventoryPage() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Filters & Search
  const [selectedDropId, setSelectedDropId] = useState<string>('ALL');
  const [selectedFit, setSelectedFit] = useState<string>('ALL');
  const [selectedHealth, setSelectedHealth] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'sku' | 'stockAsc' | 'stockDesc' | 'soldDesc'>('sku');

  // Adjustment Modal State
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedVariantForModal, setSelectedVariantForModal] = useState<{
    drop: Drop;
    variant: Variant;
  } | null>(null);
  const [modalNewStock, setModalNewStock] = useState<number>(0);
  const [modalReason, setModalReason] = useState<string>('Studio Recount Verification');

  // Audit History Modal State
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedSku, setCopiedSku] = useState<string | null>(null);

  const fetchInventory = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/admin/inventory');
      if (res.ok) {
        const data = await res.json();
        setDrops(data.drops || []);
        setMetrics(data.metrics || null);
        setAuditLogs(data.auditLogs || []);
      }
    } catch (err) {
      console.error('Failed to load inventory data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleCopySku = (sku: string) => {
    navigator.clipboard.writeText(sku);
    setCopiedSku(sku);
    setTimeout(() => setCopiedSku(null), 2000);
    showToast(`Copied SKU: ${sku}`);
  };

  // Quick Delta Adjustment (-1, +1, -5, +5)
  const handleQuickAdjust = async (
    dropId: string,
    variantId: string,
    delta: number,
    sku: string
  ) => {
    setActionLoadingId(variantId);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dropId,
          variantId,
          delta,
          reason: delta > 0 ? 'Direct Studio Batch Addition' : 'Direct Stock Write-Down',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || `Updated stock for ${sku}`);
        await fetchInventory(true);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to adjust stock');
      }
    } catch {
      alert('Network error adjusting stock');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Submit Modal Adjustment
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariantForModal) return;

    const { drop, variant } = selectedVariantForModal;
    setActionLoadingId(variant.id);

    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dropId: drop.id,
          variantId: variant.id,
          newStock: Number(modalNewStock),
          reason: modalReason,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || `Stock set to ${modalNewStock} for ${variant.sku}`);
        setAdjustModalOpen(false);
        setSelectedVariantForModal(null);
        await fetchInventory(true);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to update stock');
      }
    } catch {
      alert('Network error updating stock');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter & sort logic
  const filteredRows = useMemo(() => {
    const rows: { drop: Drop; variant: Variant }[] = [];

    drops.forEach((drop) => {
      if (selectedDropId !== 'ALL' && drop.id !== selectedDropId) {
        return;
      }

      (drop.variants || []).forEach((variant) => {
        // Fit Filter
        if (selectedFit !== 'ALL' && variant.fit !== selectedFit) {
          return;
        }

        // Health / Stock Status Filter
        if (selectedHealth === 'LOW' && variant.currentStock > 5) {
          return;
        }
        if (selectedHealth === 'SOLD_OUT' && variant.currentStock > 0) {
          return;
        }
        if (selectedHealth === 'OPTIMAL' && variant.currentStock <= 5) {
          return;
        }

        // Search Query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchSku = variant.sku.toLowerCase().includes(query);
          const matchSize = variant.size.toLowerCase().includes(query);
          const matchFit = variant.fit.toLowerCase().includes(query);
          const matchDrop = drop.title.toLowerCase().includes(query);

          if (!matchSku && !matchSize && !matchFit && !matchDrop) {
            return;
          }
        }

        rows.push({ drop, variant });
      });
    });

    // Sorting
    rows.sort((a, b) => {
      if (sortBy === 'sku') {
        return a.variant.sku.localeCompare(b.variant.sku);
      }
      if (sortBy === 'stockAsc') {
        return a.variant.currentStock - b.variant.currentStock;
      }
      if (sortBy === 'stockDesc') {
        return b.variant.currentStock - a.variant.currentStock;
      }
      if (sortBy === 'soldDesc') {
        return b.variant.unitsSold - a.variant.unitsSold;
      }
      return 0;
    });

    return rows;
  }, [drops, selectedDropId, selectedFit, selectedHealth, searchQuery, sortBy]);

  return (
    <div className="space-y-8 font-mono pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111110] text-[#F7F5F0] px-5 py-3.5 border border-[#3F4E44] shadow-2xl flex items-center gap-3 text-xs uppercase tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle className="w-4 h-4 text-[#2E6F40]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="border-b border-[#DCD7CC] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase text-[#B82328] font-bold tracking-[0.25em] flex items-center gap-2">
            <Boxes className="w-3.5 h-3.5" />
            INVENTORY GOVERNANCE // ATOMIC SKU LOGISTICS
          </span>
          <h1 className="text-2xl font-display font-black text-[#111110] uppercase tracking-tight mt-1">
            Studio Inventory & SKU Matrix
          </h1>
          <p className="text-xs text-[#52504B] font-sans mt-0.5">
            Real-time multi-drop variant counts, zero-oversell locks, and serialized physical allocations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchInventory(true)}
            disabled={refreshing}
            className="px-3.5 py-2 bg-[#EDEAE2] border border-[#DCD7CC] hover:border-[#111110] text-[#111110] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'SYNCING...' : 'SYNC STOREFRONT'}</span>
          </button>

          <button
            type="button"
            onClick={() => setAuditModalOpen(true)}
            className="px-3.5 py-2 bg-[#EDEAE2] border border-[#DCD7CC] hover:border-[#111110] text-[#111110] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2"
          >
            <History className="w-3.5 h-3.5 text-[#52504B]" />
            <span>AUDIT TRAIL ({auditLogs.length})</span>
          </button>

          <a
            href={`/api/admin/inventory?format=csv${selectedDropId !== 'ALL' ? `&dropId=${selectedDropId}` : ''}`}
            download
            className="px-4 py-2 bg-[#111110] hover:bg-[#B82328] text-white text-xs uppercase tracking-wider font-bold transition-colors shadow-sm flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT CSV</span>
          </a>
        </div>
      </div>

      {/* High-Density KPI Bento Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* KPI 1: Total Physical Stock */}
        <div className="p-5 bg-[#FCFBF8] border border-[#DCD7CC] space-y-2 shadow-editorial">
          <div className="flex justify-between items-center text-[#52504B] text-xs">
            <span className="font-semibold uppercase tracking-wider">AVAILABLE PHYSICAL STOCK</span>
            <Package className="w-4 h-4 text-[#3F4E44]" />
          </div>
          <div className="text-2xl font-bold text-[#111110]">
            {loading ? '...' : metrics?.totalRemainingUnits ?? 0}
            <span className="text-xs font-normal text-[#52504B] ml-2">
              / {metrics?.totalEditionUnits ?? 0} UNITS
            </span>
          </div>
          <div className="w-full bg-[#EDEAE2] h-1.5 overflow-hidden">
            <div
              className="bg-[#3F4E44] h-full transition-all duration-500"
              style={{
                width: `${
                  metrics?.totalEditionUnits
                    ? Math.round((metrics.totalRemainingUnits / metrics.totalEditionUnits) * 100)
                    : 0
                }%`,
              }}
            />
          </div>
          <p className="text-[10px] text-[#52504B]">
            {metrics?.totalEditionUnits
              ? `${Math.round((metrics.totalRemainingUnits / metrics.totalEditionUnits) * 100)}% remaining in studio allocation`
              : 'Inventory synchronized'}
          </p>
        </div>

        {/* KPI 2: Units Sold / Claimed */}
        <div className="p-5 bg-[#FCFBF8] border border-[#DCD7CC] space-y-2 shadow-editorial">
          <div className="flex justify-between items-center text-[#52504B] text-xs">
            <span className="font-semibold uppercase tracking-wider">CLAIMED / DISPATCHED</span>
            <Sparkles className="w-4 h-4 text-[#B82328]" />
          </div>
          <div className="text-2xl font-bold text-[#111110]">
            {loading ? '...' : metrics?.totalClaimedUnits ?? 0}
            <span className="text-xs font-normal text-[#52504B] ml-2">PIECES SOLD</span>
          </div>
          <p className="text-[11px] text-[#52504B]">
            Strict limited production · zero reprint guarantee
          </p>
        </div>

        {/* KPI 3: Low Stock Alerts */}
        <div className="p-5 bg-[#FCFBF8] border border-[#DCD7CC] space-y-2 shadow-editorial">
          <div className="flex justify-between items-center text-[#52504B] text-xs">
            <span className="font-semibold uppercase tracking-wider">CRITICAL LOW-STOCK SKUS</span>
            <AlertTriangle className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="text-2xl font-bold text-[#D97706]">
            {loading ? '...' : metrics?.lowStockVariantsCount ?? 0}
            <span className="text-xs font-normal text-[#52504B] ml-2">SKUS &le; 5 UNITS</span>
          </div>
          <p className="text-[11px] text-[#52504B]">
            Auto-triggers countdown badges on storefront
          </p>
        </div>

        {/* KPI 4: Sold Out SKUs */}
        <div className="p-5 bg-[#FCFBF8] border border-[#DCD7CC] space-y-2 shadow-editorial">
          <div className="flex justify-between items-center text-[#52504B] text-xs">
            <span className="font-semibold uppercase tracking-wider">SOLD OUT / VAULT RETIRED</span>
            <ShieldAlert className="w-4 h-4 text-[#B82328]" />
          </div>
          <div className="text-2xl font-bold text-[#B82328]">
            {loading ? '...' : metrics?.soldOutVariantsCount ?? 0}
            <span className="text-xs font-normal text-[#52504B] ml-2">SKUS EXHAUSTED</span>
          </div>
          <p className="text-[11px] text-[#52504B]">
            Immediate button lock prevents concurrency oversell
          </p>
        </div>
      </div>

      {/* Drop Selection Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#DCD7CC]">
        <button
          type="button"
          onClick={() => setSelectedDropId('ALL')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
            selectedDropId === 'ALL'
              ? 'bg-[#111110] text-white shadow-sm'
              : 'bg-[#EDEAE2]/60 hover:bg-[#EDEAE2] text-[#52504B] border border-[#DCD7CC]'
          }`}
        >
          ALL PRODUCTIONS ({drops.reduce((acc, d) => acc + (d.variants?.length || 0), 0)} SKUs)
        </button>

        {drops.map((drop) => {
          const isSelected = selectedDropId === drop.id;
          return (
            <button
              key={drop.id}
              type="button"
              onClick={() => setSelectedDropId(drop.id)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#111110] text-white shadow-sm'
                  : 'bg-[#EDEAE2]/60 hover:bg-[#EDEAE2] text-[#52504B] border border-[#DCD7CC]'
              }`}
            >
              <span>
                DROP 00{drop.dropNumber} // {drop.title.split('//')[1]?.trim() || drop.title}
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.2 border font-mono ${
                  drop.status === 'LIVE'
                    ? 'bg-[#2E6F40]/10 text-[#2E6F40] border-[#2E6F40]/30'
                    : drop.status === 'UPCOMING'
                    ? 'bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30'
                    : 'bg-[#52504B]/10 text-[#52504B] border-[#52504B]/30'
                }`}
              >
                {drop.status}
              </span>
            </button>
          );
        })}
      </div>

      {/* Control Toolbar: Search, Filters & Sorters */}
      <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-editorial">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#52504B]" />
          <input
            type="text"
            placeholder="Search by SKU, Size (XS, M, XL), or Fit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#DCD7CC] focus:border-[#111110] text-xs text-[#111110] outline-none font-mono placeholder:text-[#52504B]/60"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#52504B] hover:text-[#111110]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Fit Selector */}
          <div className="flex items-center gap-1.5 text-xs text-[#52504B]">
            <span className="text-[10px] uppercase font-bold tracking-wider">FIT:</span>
            <select
              value={selectedFit}
              onChange={(e) => setSelectedFit(e.target.value)}
              className="bg-[#FAF8F5] border border-[#DCD7CC] text-xs px-2.5 py-1.5 text-[#111110] font-mono outline-none focus:border-[#111110]"
            >
              <option value="ALL">ALL FITS</option>
              <option value="WOMEN">WOMEN (ERGO-BOXY)</option>
              <option value="MEN">MEN (STRUCTURED)</option>
            </select>
          </div>

          {/* Stock Health */}
          <div className="flex items-center gap-1.5 text-xs text-[#52504B]">
            <span className="text-[10px] uppercase font-bold tracking-wider">STATUS:</span>
            <select
              value={selectedHealth}
              onChange={(e) => setSelectedHealth(e.target.value)}
              className="bg-[#FAF8F5] border border-[#DCD7CC] text-xs px-2.5 py-1.5 text-[#111110] font-mono outline-none focus:border-[#111110]"
            >
              <option value="ALL">ALL LEVELS</option>
              <option value="OPTIMAL">IN STOCK (&gt; 5)</option>
              <option value="LOW">LOW STOCK (&le; 5)</option>
              <option value="SOLD_OUT">SOLD OUT (0)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs text-[#52504B]">
            <span className="text-[10px] uppercase font-bold tracking-wider">SORT:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-[#FAF8F5] border border-[#DCD7CC] text-xs px-2.5 py-1.5 text-[#111110] font-mono outline-none focus:border-[#111110]"
            >
              <option value="sku">SKU CODE (A-Z)</option>
              <option value="stockAsc">STOCK: LOW TO HIGH</option>
              <option value="stockDesc">STOCK: HIGH TO LOW</option>
              <option value="soldDesc">UNITS SOLD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Inventory Matrix Table */}
      <div className="bg-[#FCFBF8] border border-[#DCD7CC] overflow-hidden shadow-editorial">
        <div className="p-4 border-b border-[#DCD7CC] flex justify-between items-center bg-[#EDEAE2]/30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#111110] uppercase tracking-wider">
              INVENTORY MATRIX & SKU DISPATCH LEVEL
            </span>
            <span className="text-[10px] bg-[#EDEAE2] text-[#52504B] px-2 py-0.5 border border-[#DCD7CC] font-bold">
              {filteredRows.length} VARIANTS
            </span>
          </div>

          <span className="text-[11px] text-[#52504B] font-mono hidden sm:inline">
            Direct adjustments auto-update live storefront buttons & prevent cart concurrency conflicts
          </span>
        </div>

        {loading ? (
          <div className="py-24 text-center space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#B82328] mx-auto" />
            <p className="text-xs text-[#52504B] uppercase tracking-wider">
              Querying studio atomic stock matrix...
            </p>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Boxes className="w-8 h-8 text-[#52504B]/50 mx-auto" />
            <p className="text-sm font-bold text-[#111110] uppercase tracking-wider">
              No inventory records match your criteria
            </p>
            <p className="text-xs text-[#52504B]">
              Try resetting the search query or drop filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedDropId('ALL');
                setSelectedFit('ALL');
                setSelectedHealth('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#111110] text-white text-xs uppercase tracking-wider font-bold"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#DCD7CC] text-[#52504B] text-[10px] uppercase bg-[#EDEAE2]/60 font-mono">
                  <th className="py-3 px-4">Edition / Production</th>
                  <th className="py-3 px-4">SKU Code</th>
                  <th className="py-3 px-4">Fit & Silhouette</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4 text-right">Initial</th>
                  <th className="py-3 px-4 text-right">Claimed</th>
                  <th className="py-3 px-4 text-center">Remaining Stock</th>
                  <th className="py-3 px-4 text-center">Health Status</th>
                  <th className="py-3 px-4 text-right">Quick Stock Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCD7CC] text-[11px]">
                {filteredRows.map(({ drop, variant }) => {
                  const isActionLoading = actionLoadingId === variant.id;
                  const isLow = variant.currentStock > 0 && variant.currentStock <= 5;
                  const isSoldOut = variant.currentStock <= 0;

                  return (
                    <tr
                      key={variant.id}
                      className="hover:bg-[#EDEAE2]/40 transition-colors group"
                    >
                      {/* Drop Name */}
                      <td className="py-3.5 px-4 font-bold text-[#111110]">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-[#EDEAE2] overflow-hidden flex-shrink-0 border border-[#DCD7CC] relative">
                            {drop.primaryImageUrl && (
                              <Image
                                src={drop.primaryImageUrl}
                                alt={drop.title}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <span className="block text-[11px] truncate max-w-[150px]">
                              {drop.title.split('//')[0]?.trim()}
                            </span>
                            <span className="text-[9px] text-[#52504B] block font-normal">
                              ₹{(drop.pricePaise / 100).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#111110] bg-[#FAF8F5] px-2 py-0.5 border border-[#DCD7CC]">
                            {variant.sku}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopySku(variant.sku)}
                            title="Copy SKU code"
                            className="p-1 text-[#52504B] hover:text-[#111110] transition-colors"
                          >
                            {copiedSku === variant.sku ? (
                              <Check className="w-3.5 h-3.5 text-[#2E6F40]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Fit */}
                      <td className="py-3.5 px-4 font-sans">
                        <span
                          className={`font-bold px-2 py-0.5 text-[10px] uppercase border ${
                            variant.fit === 'WOMEN'
                              ? 'bg-[#B82328]/5 text-[#B82328] border-[#B82328]/30'
                              : 'bg-[#3F4E44]/10 text-[#3F4E44] border-[#3F4E44]/30'
                          }`}
                        >
                          {variant.fit === 'WOMEN' ? "Women's Ergo-Boxy" : "Men's Structured"}
                        </span>
                      </td>

                      {/* Size */}
                      <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#111110]">
                        {variant.size}
                      </td>

                      {/* Initial Stock */}
                      <td className="py-3.5 px-4 text-right font-mono text-[#52504B]">
                        {variant.initialStock}
                      </td>

                      {/* Sold / Claimed */}
                      <td className="py-3.5 px-4 text-right font-mono text-[#52504B]">
                        <span className="font-semibold text-[#111110]">{variant.unitsSold}</span>
                        <span className="text-[9px] text-[#52504B] ml-1">
                          (
                          {variant.initialStock > 0
                            ? Math.round((variant.unitsSold / variant.initialStock) * 100)
                            : 0}
                          %)
                        </span>
                      </td>

                      {/* Current Stock */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-2">
                          <span
                            className={`text-sm font-bold font-mono px-3 py-1 border ${
                              isSoldOut
                                ? 'bg-[#111110] text-white border-[#111110]'
                                : isLow
                                ? 'bg-[#D97706]/15 text-[#D97706] border-[#D97706]/40 animate-pulse'
                                : 'bg-[#2E6F40]/10 text-[#2E6F40] border-[#2E6F40]/30'
                            }`}
                          >
                            {variant.currentStock}
                          </span>
                          <span className="text-[10px] text-[#52504B]">units</span>
                        </div>
                      </td>

                      {/* Health Status */}
                      <td className="py-3.5 px-4 text-center">
                        {isSoldOut ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-[#111110] text-[#FAF8F5] uppercase tracking-wider">
                            SOLD OUT
                          </span>
                        ) : isLow ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/30 uppercase tracking-wider">
                            LOW ({variant.currentStock} LEFT)
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-[#2E6F40]/10 text-[#2E6F40] border border-[#2E6F40]/30 uppercase tracking-wider">
                            OPTIMAL
                          </span>
                        )}
                      </td>

                      {/* Quick Adjust Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {/* Decrement 5 */}
                          <button
                            type="button"
                            disabled={isActionLoading || variant.currentStock <= 0}
                            onClick={() => handleQuickAdjust(drop.id, variant.id, -5, variant.sku)}
                            title="Subtract 5 units"
                            className="px-2 py-1 bg-[#EDEAE2] hover:bg-[#DCD7CC] text-[#111110] border border-[#DCD7CC] text-[10px] font-mono font-bold transition-colors disabled:opacity-30"
                          >
                            -5
                          </button>

                          {/* Decrement 1 */}
                          <button
                            type="button"
                            disabled={isActionLoading || variant.currentStock <= 0}
                            onClick={() => handleQuickAdjust(drop.id, variant.id, -1, variant.sku)}
                            title="Subtract 1 unit"
                            className="px-2 py-1 bg-[#EDEAE2] hover:bg-[#DCD7CC] text-[#111110] border border-[#DCD7CC] text-[10px] font-mono font-bold transition-colors disabled:opacity-30"
                          >
                            -1
                          </button>

                          {/* Increment 1 */}
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => handleQuickAdjust(drop.id, variant.id, 1, variant.sku)}
                            title="Add 1 unit"
                            className="px-2 py-1 bg-[#EDEAE2] hover:bg-[#DCD7CC] text-[#111110] border border-[#DCD7CC] text-[10px] font-mono font-bold transition-colors disabled:opacity-30"
                          >
                            +1
                          </button>

                          {/* Increment 5 */}
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => handleQuickAdjust(drop.id, variant.id, 5, variant.sku)}
                            title="Add 5 units"
                            className="px-2 py-1 bg-[#EDEAE2] hover:bg-[#DCD7CC] text-[#111110] border border-[#DCD7CC] text-[10px] font-mono font-bold transition-colors disabled:opacity-30"
                          >
                            +5
                          </button>

                          {/* Custom Set */}
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => {
                              setSelectedVariantForModal({ drop, variant });
                              setModalNewStock(variant.currentStock);
                              setModalReason('Studio Recount Verification');
                              setAdjustModalOpen(true);
                            }}
                            title="Open detailed calibration modal"
                            className="px-2.5 py-1 bg-[#111110] hover:bg-[#B82328] text-white text-[10px] font-mono font-bold transition-colors flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>SET</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjust Inventory Modal */}
      {adjustModalOpen && selectedVariantForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#FCFBF8] border-2 border-[#111110] p-6 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-[#DCD7CC] pb-4">
              <div>
                <span className="text-[10px] uppercase text-[#B82328] font-bold tracking-widest">
                  CALIBRATE PHYSICAL STOCK
                </span>
                <h3 className="text-lg font-bold text-[#111110] font-display uppercase mt-0.5">
                  SKU: {selectedVariantForModal.variant.sku}
                </h3>
                <p className="text-xs text-[#52504B]">
                  {selectedVariantForModal.drop.title} · Fit: {selectedVariantForModal.variant.fit} · Size: {selectedVariantForModal.variant.size}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAdjustModalOpen(false);
                  setSelectedVariantForModal(null);
                }}
                className="p-1 text-[#52504B] hover:text-[#111110]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              {/* Current vs Target */}
              <div className="grid grid-cols-2 gap-4 bg-[#EDEAE2]/40 p-4 border border-[#DCD7CC]">
                <div>
                  <span className="text-[10px] text-[#52504B] uppercase tracking-wider block">
                    Current Recorded Stock
                  </span>
                  <span className="text-xl font-bold font-mono text-[#111110]">
                    {selectedVariantForModal.variant.currentStock} units
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#52504B] uppercase tracking-wider block">
                    Initial Edition Allocation
                  </span>
                  <span className="text-xl font-bold font-mono text-[#52504B]">
                    {selectedVariantForModal.variant.initialStock} units
                  </span>
                </div>
              </div>

              {/* New Stock Input */}
              <div>
                <label className="block text-xs uppercase font-bold text-[#111110] tracking-wider mb-1.5">
                  New Available Stock Quantity
                </label>
                <input
                  type="number"
                  min={0}
                  max={1000}
                  value={modalNewStock}
                  onChange={(e) => setModalNewStock(Number(e.target.value))}
                  required
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#111110] text-lg font-bold font-mono text-[#111110] focus:ring-1 focus:ring-[#B82328] outline-none"
                />
              </div>

              {/* Reason Selector */}
              <div>
                <label className="block text-xs uppercase font-bold text-[#111110] tracking-wider mb-1.5">
                  Statutory Audit Reason
                </label>
                <select
                  value={modalReason}
                  onChange={(e) => setModalReason(e.target.value)}
                  className="w-full px-4 py-2 bg-[#FAF8F5] border border-[#DCD7CC] text-xs font-mono text-[#111110] outline-none focus:border-[#111110]"
                >
                  <option value="Studio Recount Verification">Studio Recount Verification</option>
                  <option value="Physical Stock Addition / Restock">Physical Stock Addition / Restock</option>
                  <option value="Collector Return / Exchange Addition">Collector Return / Exchange Addition</option>
                  <option value="Studio Editorial Sample Allocation">Studio Editorial Sample Allocation</option>
                  <option value="Damaged / Fabric Defect Write-Off">Damaged / Fabric Defect Write-Off</option>
                  <option value="Edition Allocation Adjustment">Edition Allocation Adjustment</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#DCD7CC]">
                <button
                  type="button"
                  onClick={() => {
                    setAdjustModalOpen(false);
                    setSelectedVariantForModal(null);
                  }}
                  className="px-4 py-2 bg-[#EDEAE2] hover:bg-[#DCD7CC] text-xs font-bold uppercase tracking-wider text-[#111110]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={actionLoadingId !== null}
                  className="px-6 py-2 bg-[#111110] hover:bg-[#B82328] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors disabled:opacity-50"
                >
                  {actionLoadingId ? 'UPDATING...' : 'CONFIRM ADJUSTMENT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit History Drawer / Modal */}
      {auditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#FCFBF8] border-2 border-[#111110] p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-start border-b border-[#DCD7CC] pb-3">
              <div>
                <span className="text-[10px] uppercase text-[#B82328] font-bold tracking-widest flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  IMMUTABLE AUDIT TRAIL
                </span>
                <h3 className="text-lg font-bold text-[#111110] font-display uppercase mt-0.5">
                  Inventory Adjustments History
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAuditModalOpen(false)}
                className="p-1 text-[#52504B] hover:text-[#111110]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {auditLogs.length === 0 ? (
                <p className="text-xs text-[#52504B] py-12 text-center font-mono">
                  No inventory adjustments recorded in this session.
                </p>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-[#EDEAE2]/40 border border-[#DCD7CC] text-xs font-mono space-y-1 hover:border-[#111110] transition-colors"
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-[#B82328] uppercase">
                        {log.metadata?.sku || log.entityId}
                      </span>
                      <span className="text-[#52504B]">
                        {new Date(log.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#111110] font-semibold">
                        Stock changed: {log.metadata?.oldStock ?? '?'} &rarr;{' '}
                        <strong className="text-[#2E6F40] font-bold">
                          {log.metadata?.newStock ?? '?'} units
                        </strong>{' '}
                        ({(log.metadata?.delta ?? 0) >= 0 ? `+${log.metadata?.delta}` : log.metadata?.delta})
                      </span>
                      <span className="text-[10px] bg-[#FAF8F5] px-2 py-0.5 border border-[#DCD7CC] text-[#52504B]">
                        {log.metadata?.adminUser || 'Admin'}
                      </span>
                    </div>

                    <p className="text-[10px] text-[#52504B] italic">
                      Reason: {log.metadata?.reason || 'Manual Adjustment'}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-[#DCD7CC] text-right">
              <button
                type="button"
                onClick={() => setAuditModalOpen(false)}
                className="px-4 py-2 bg-[#111110] text-white text-xs font-bold uppercase tracking-wider"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Tag,
  Save,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Sparkles,
  Link as LinkIcon,
  HelpCircle,
} from 'lucide-react';

interface CategoryBubble {
  id: string;
  label: string;
  sublabel: string;
  badge: string;
  image: string;
  isLive?: boolean;
  sortOrder: number;
  isActive: boolean;
}

const PRESET_IMAGES = [
  { label: 'OUTSIDE Logo Icon', url: '/images/OUTSIDE_icon.png' },
  { label: 'Drop 001 (Floral Ivory)', url: '/images/drops/drop-001-front.jpg' },
  { label: 'Drop 002 (Botanical Sage)', url: '/images/drops/drop-002-front.jpg' },
  { label: 'Drop 003 (Monolith Obsidian)', url: '/images/drops/drop-003-front.jpg' },
  { label: 'Drop 000 (Genesis Raw)', url: '/images/drops/drop-000-front.jpg' },
  { label: 'Studio Hero Graphic', url: '/images/outside_hero_final.png' },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryBubble[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New Category Drawer/Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newId, setNewId] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newSublabel, setNewSublabel] = useState('');
  const [newBadge, setNewBadge] = useState('EXPLORE');
  const [newImage, setNewImage] = useState('/images/drops/drop-001-front.jpg');
  const [newIsLive, setNewIsLive] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFieldChange = (index: number, field: keyof CategoryBubble, value: any) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    setCategories(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= categories.length) return;

    const updated = [...categories];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    updated.forEach((c, idx) => {
      c.sortOrder = idx + 1;
    });

    setCategories(updated);
  };

  const handleDelete = (id: string) => {
    if (!confirm(`Are you sure you want to remove category bubble "${id}"?`)) return;
    const updated = categories.filter((c) => c.id !== id);
    updated.forEach((c, idx) => {
      c.sortOrder = idx + 1;
    });
    setCategories(updated);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update categories');
      }

      setSuccessMsg('CATEGORIES SAVED // STORY BUBBLES SYNCHRONIZED ACROSS STOREFRONT');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId.trim() || !newLabel.trim()) return;

    const idUpper = newId.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    if (categories.some((c) => c.id === idUpper)) {
      alert(`Category with ID "${idUpper}" already exists.`);
      return;
    }

    const newCat: CategoryBubble = {
      id: idUpper,
      label: newLabel.trim(),
      sublabel: newSublabel.trim(),
      badge: newBadge.trim().toUpperCase(),
      image: newImage.trim(),
      isLive: newIsLive,
      sortOrder: categories.length + 1,
      isActive: true,
    };

    setCategories([...categories, newCat]);
    setShowAddForm(false);
    setNewId('');
    setNewLabel('');
    setNewSublabel('');
    setNewBadge('EXPLORE');
  };

  const handleResetDefaults = async () => {
    if (!confirm('Reset all categories back to default Studio story bubbles?')) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
        setSuccessMsg('CATEGORIES RESTORED TO STUDIO DEFAULT EDITIONS');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-mono pb-20">
      {/* Header */}
      <div className="border-b border-[#DCD7CC] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase text-[#B82328] font-bold tracking-[0.25em] flex items-center gap-2">
            <Tag className="w-3.5 h-3.5" />
            STOREFRONT STORY BUBBLES // CATEGORY NAVIGATION
          </span>
          <h1 className="text-2xl font-display font-black text-[#111110] uppercase tracking-tight mt-1">
            Category Carousel &amp; Editions Governance
          </h1>
          <p className="text-xs text-[#52504B] font-sans mt-0.5">
            Manage circular Instagram-style story bubbles, filter badges, and catalog groupings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            disabled={saving}
            className="px-3.5 py-2 bg-[#EDEAE2] border border-[#DCD7CC] hover:border-[#111110] text-[#111110] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#B82328]" />
            <span>RESET DEFAULTS</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-[#EDEAE2] border border-[#111110] text-[#111110] text-xs uppercase tracking-wider font-bold transition-colors flex items-center gap-2 hover:bg-[#DCD7CC]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'CLOSE DRAWER' : 'ADD NEW BUBBLE'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="px-5 py-2 bg-[#111110] hover:bg-[#B82328] text-white text-xs uppercase tracking-wider font-bold transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'SYNCHRONIZING...' : 'SAVE & SYNC'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-[#3F4E44]/10 border border-[#3F4E44] text-[#3F4E44] text-xs flex items-center gap-2 font-bold animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#3F4E44] flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-[#B82328]/10 border border-[#B82328] text-[#B82328] text-xs flex items-center gap-2 font-bold animate-in fade-in duration-200">
          <AlertTriangle className="w-4 h-4 text-[#B82328] flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Add Category Drawer */}
      {showAddForm && (
        <div className="bg-[#FCFBF8] border-2 border-[#111110] p-6 shadow-editorial animate-in fade-in duration-150 space-y-4">
          <div className="border-b border-[#DCD7CC] pb-3 flex justify-between items-center">
            <h3 className="text-xs uppercase font-bold text-[#111110] tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#B82328]" />
              <span>CONFIGURE NEW CATEGORY STORY BUBBLE</span>
            </h3>
            <span className="text-[10px] text-[#52504B]">DISCOVERY AVATAR</span>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#111110] tracking-wider mb-1">
                  Filter Target ID (Unique) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. HOODIES, ALL, DROP_003"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] outline-none uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#111110] tracking-wider mb-1">
                  Category Label / Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Oversized Heavyweights"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#111110] tracking-wider mb-1">
                  Sub-label / Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. 280 GSM Cotton"
                  value={newSublabel}
                  onChange={(e) => setNewSublabel(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#111110] tracking-wider mb-1">
                  Badge Tag Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. SIGNATURE, EXPLORE, NEW"
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] outline-none uppercase font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-[#111110] tracking-wider mb-1">
                  Avatar Image URL *
                </label>
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] outline-none font-mono"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {PRESET_IMAGES.map((p) => (
                    <button
                      key={p.url}
                      type="button"
                      onClick={() => setNewImage(p.url)}
                      className="text-[9px] px-2 py-0.5 bg-[#EDEAE2] border border-[#DCD7CC] hover:border-[#111110] text-[#111110] transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={newIsLive}
                  onChange={(e) => setNewIsLive(e.target.checked)}
                  className="w-4 h-4 accent-[#B82328]"
                />
                <span className="font-bold text-[#111110]">
                  Highlight as Active / Live Ring (Red pulsing border)
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-[#DCD7CC]">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-[#EDEAE2] text-xs font-bold uppercase text-[#111110]"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#111110] hover:bg-[#B82328] text-white text-xs font-bold uppercase tracking-wider"
              >
                ADD TO CAROUSEL
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Live Storefront Preview Strip */}
      <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-5 space-y-3 shadow-editorial">
        <div className="flex justify-between items-center border-b border-[#DCD7CC] pb-2">
          <span className="text-[10px] uppercase font-bold text-[#111110] tracking-wider flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-[#B82328]" />
            LIVE BUBBLE CAROUSEL RENDER PREVIEW (AS SEEN BY COLLECTORS)
          </span>
          <span className="text-[10px] text-[#52504B]">
            {categories.filter((c) => c.isActive).length} ACTIVE BUBBLES
          </span>
        </div>

        <div className="overflow-x-auto py-3 no-scrollbar">
          <div className="flex items-start gap-6 shrink-0 min-w-max px-2">
            {categories
              .filter((c) => c.isActive)
              .map((cat) => (
                <div key={cat.id} className="flex flex-col items-center w-20 text-center select-none">
                  <div
                    className={`relative w-16 h-16 rounded-full p-1 bg-white border ${
                      cat.isLive ? 'border-[#B82328] shadow-sm' : 'border-[#DCD7CC]'
                    }`}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-[#FAF8F5]">
                      <Image
                        src={cat.image}
                        alt={cat.label}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  </div>
                  <span className="mt-2 text-[9px] px-2 py-0.5 rounded-full border border-[#DCD7CC] bg-[#EDEAE2] font-bold text-[#52504B] uppercase tracking-wider">
                    {cat.badge}
                  </span>
                  <span className="mt-1 text-xs font-bold text-[#111110] truncate max-w-[80px]">
                    {cat.label}
                  </span>
                  <span className="text-[10px] text-[#52504B] truncate max-w-[80px]">
                    {cat.sublabel}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Editable Categories List */}
      <div className="bg-[#FCFBF8] border border-[#DCD7CC] shadow-editorial divide-y divide-[#DCD7CC]">
        <div className="p-4 bg-[#EDEAE2]/40 flex justify-between items-center text-xs font-bold uppercase text-[#111110] tracking-wider">
          <span>CONFIGURED STORY BUBBLES ({categories.length})</span>
          <span className="text-[10px] text-[#52504B]">DRAG OR USE ARROWS TO REORDER</span>
        </div>

        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className={`p-4 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
              cat.isActive ? 'hover:bg-[#EDEAE2]/30' : 'bg-[#EDEAE2]/20 opacity-60'
            }`}
          >
            {/* Left: Avatar Thumbnail & Sort Order */}
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-[#EDEAE2] border border-[#DCD7CC] flex items-center justify-center font-bold text-xs text-[#111110]">
                {idx + 1}
              </span>

              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#DCD7CC] bg-white flex-shrink-0">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-contain p-1"
                />
              </div>

              <div>
                <span className="text-xs font-bold text-[#111110] block">
                  {cat.label}
                </span>
                <span className="text-[10px] text-[#52504B] block font-mono">
                  ID: #{cat.id} · {cat.sublabel}
                </span>
              </div>
            </div>

            {/* Middle: Inline Editable Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 max-w-2xl">
              <div>
                <label className="block text-[9px] text-[#52504B] uppercase">Label</label>
                <input
                  type="text"
                  value={cat.label}
                  onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
                  className="w-full px-2 py-1 text-xs bg-[#FAF8F5] border border-[#DCD7CC] focus:border-[#111110] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[9px] text-[#52504B] uppercase">Sub-label</label>
                <input
                  type="text"
                  value={cat.sublabel}
                  onChange={(e) => handleFieldChange(idx, 'sublabel', e.target.value)}
                  className="w-full px-2 py-1 text-xs bg-[#FAF8F5] border border-[#DCD7CC] focus:border-[#111110] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[9px] text-[#52504B] uppercase">Badge Pill</label>
                <input
                  type="text"
                  value={cat.badge}
                  onChange={(e) => handleFieldChange(idx, 'badge', e.target.value.toUpperCase())}
                  className="w-full px-2 py-1 text-xs bg-[#FAF8F5] border border-[#DCD7CC] focus:border-[#111110] outline-none font-mono uppercase"
                />
              </div>
            </div>

            {/* Right: Actions, Sorting & Status Toggles */}
            <div className="flex items-center gap-2 self-end lg:self-center">
              {/* Live Ring Toggle */}
              <button
                type="button"
                onClick={() => handleFieldChange(idx, 'isLive', !cat.isLive)}
                title="Toggle Active/Live Ring"
                className={`px-2.5 py-1 text-[10px] uppercase font-bold border transition-colors flex items-center gap-1 ${
                  cat.isLive
                    ? 'bg-[#B82328]/10 text-[#B82328] border-[#B82328]/40'
                    : 'bg-[#EDEAE2] text-[#52504B] border-[#DCD7CC]'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>{cat.isLive ? 'LIVE RING' : 'STATIC'}</span>
              </button>

              {/* Visibility Active Toggle */}
              <button
                type="button"
                onClick={() => handleFieldChange(idx, 'isActive', !cat.isActive)}
                title={cat.isActive ? 'Hide bubble from storefront' : 'Show bubble on storefront'}
                className={`p-1.5 border transition-colors ${
                  cat.isActive
                    ? 'bg-[#FCFBF8] border-[#111110] text-[#111110]'
                    : 'bg-[#EDEAE2] border-[#DCD7CC] text-[#52504B]'
                }`}
              >
                {cat.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              {/* Move Up / Down */}
              <div className="flex items-center gap-1 border-l border-[#DCD7CC] pl-2">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="p-1 hover:bg-[#EDEAE2] text-[#111110] disabled:opacity-30"
                >
                  <MoveUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === categories.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="p-1 hover:bg-[#EDEAE2] text-[#111110] disabled:opacity-30"
                >
                  <MoveDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Delete */}
              <button
                type="button"
                onClick={() => handleDelete(cat.id)}
                className="p-1.5 hover:bg-[#B82328]/10 text-[#52504B] hover:text-[#B82328] transition-colors ml-1"
                title="Remove Category"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

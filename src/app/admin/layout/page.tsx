'use client';

import React, { useState, useEffect } from 'react';
import NextImage from 'next/image';
import {
  Layout,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  MoveUp,
  MoveDown,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Grid,
  Layers,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';

export default function AdminLayoutControlsPage() {
  const [layout, setLayout] = useState<any>({
    sections: [],
    gridColumns: {
      vault: { mobile: 1, tablet: 2, desktop: 3 },
      lookbook: { mobile: 1, desktop: 2 },
    },
    mobileStickyCtaPosition: 'bottom_fixed',
  });

  const [heroConfig, setHeroConfig] = useState<any>({
    desktopImageUrl: '/images/outside_hero_final.png',
    mobileImageUrl: '/images/outside_hero_final.png',
    altText: 'DROP 001 Better Days Ahead Heavyweight T-Shirt',
    backgroundColor: '#EAE2D8',
    objectPosition: 'right center',
    eyebrowText: 'DROP 001 · LIMITED EDITION',
    headlineLine1: 'WEAR',
    headlineLine2: 'YOUR',
    headlineLine3: 'STORY',
    subheadline: 'EXCLUSIVE APPAREL • MADE IN INDIA',
    bodyDescription: 'A limited run of 250 pieces, crafted from 280 GSM organic cotton. Thoughtfully designed, ethically made, and built to last.',
    ctaText: 'CLAIM DROP 001',
    secondaryCtaText: 'EXPLORE THE COLLECTION ▸',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewViewport, setPreviewViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [resLayout, resHero] = await Promise.all([
          fetch('/api/admin/layout'),
          fetch('/api/admin/hero'),
        ]);

        if (resLayout.ok) {
          const data = await resLayout.json();
          if (data.layout) setLayout(data.layout);
        }

        if (resHero.ok) {
          const data = await resHero.json();
          if (data.heroConfig) setHeroConfig(data.heroConfig);
        }
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const sections = [...layout.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const temp = sections[index];
    sections[index] = sections[targetIndex];
    sections[targetIndex] = temp;

    // Recalibrate sortOrder
    sections.forEach((sec, idx) => {
      sec.sortOrder = idx + 1;
    });

    setLayout({ ...layout, sections });
  };

  const handleToggleVisibility = (
    sectionId: string,
    device: 'visibleDesktop' | 'visibleTablet' | 'visibleMobile'
  ) => {
    const updatedSections = layout.sections.map((sec: any) =>
      sec.id === sectionId ? { ...sec, [device]: !sec[device] } : sec
    );
    setLayout({ ...layout, sections: updatedSections });
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const [layoutRes, heroRes] = await Promise.all([
        fetch('/api/admin/layout', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(layout),
        }),
        fetch('/api/admin/hero', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(heroConfig),
        }),
      ]);

      const layoutData = await layoutRes.json();
      if (!layoutRes.ok) {
        throw new Error(layoutData.error || 'Failed to update layout');
      }

      setSuccessMsg('LAYOUT, HERO PRESENTATION & RESPONSIVE GOVERNANCE SAVED');
      setIframeKey((prev) => prev + 1);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset section sequence and grid densities to factory defaults?')) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      const data = await res.json();
      if (res.ok && data.layout) {
        setLayout(data.layout);
        setSuccessMsg('LAYOUT RESTORED TO DEFAULT EDITORIAL SEQUENCE.');
        setIframeKey((prev) => prev + 1);
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 font-mono text-xs text-[#52504B]">LOADING LAYOUT REPOSITORY...</div>;
  }

  return (
    <div className="space-y-8 font-mono">
      
      {/* Header */}
      <div className="border-b border-[#DCD7CC] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase text-[#B82328] font-bold tracking-[0.25em]">
            RESPONSIVE GOVERNANCE &amp; SECTION ARCHITECTURE
          </span>
          <h1 className="text-2xl font-display font-black text-[#111110] uppercase tracking-tight mt-1">
            Storefront Layout &amp; Density Controls
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-[#EDEAE2] border border-[#DCD7CC] hover:border-[#111110] text-[#111110] text-xs uppercase tracking-wider flex items-center gap-2 font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#B82328]" />
            <span>RESET SEQUENCE</span>
          </button>

          <button
            onClick={handleSave}
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Section Order & Device Visibility (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-4 shadow-editorial">
            <div className="border-b border-[#DCD7CC] pb-3 flex justify-between items-center">
              <h3 className="text-xs uppercase text-[#111110] font-bold tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#B82328]" />
                <span>HOMEPAGE SECTION SEQUENCE &amp; DEVICE VISIBILITY</span>
              </h3>
              <span className="text-[10px] text-[#52504B]">REORDERABLE</span>
            </div>

            <p className="text-[11px] text-[#52504B] leading-relaxed">
              Drag or use arrows to adjust the vertical reading flow. Toggle visibility per breakpoint to optimize mobile LCP.
            </p>

            <div className="space-y-2.5">
              {(layout.sections || []).map((sec: any, idx: number) => (
                <div
                  key={sec.id}
                  className="p-3 bg-[#EDEAE2]/30 border border-[#DCD7CC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-none bg-[#EDEAE2] border border-[#DCD7CC] flex items-center justify-center font-mono font-bold text-[#111110] text-[11px]">
                      {sec.sortOrder}
                    </span>
                    <div>
                      <span className="font-bold text-[#111110] uppercase block">
                        {sec.name}
                      </span>
                      <span className="text-[10px] text-[#52504B] font-mono">
                        #{sec.id}
                      </span>
                    </div>
                  </div>

                  {/* Device Visibility Pills */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    {/* Desktop Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(sec.id, 'visibleDesktop')}
                      title="Desktop (1280px+)"
                      className={`px-2 py-1 text-[10px] border flex items-center gap-1 cursor-pointer transition-colors ${
                        sec.visibleDesktop
                          ? 'bg-[#FCFBF8] border-[#111110] text-[#111110] font-bold'
                          : 'bg-transparent border-[#DCD7CC] text-[#52504B] line-through'
                      }`}
                    >
                      <Monitor className="w-3 h-3" />
                      <span>DESK</span>
                    </button>

                    {/* Tablet Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(sec.id, 'visibleTablet')}
                      title="Tablet (768px)"
                      className={`px-2 py-1 text-[10px] border flex items-center gap-1 cursor-pointer transition-colors ${
                        sec.visibleTablet
                          ? 'bg-[#FCFBF8] border-[#111110] text-[#111110] font-bold'
                          : 'bg-transparent border-[#DCD7CC] text-[#52504B] line-through'
                      }`}
                    >
                      <Tablet className="w-3 h-3" />
                      <span>TAB</span>
                    </button>

                    {/* Mobile Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(sec.id, 'visibleMobile')}
                      title="Mobile (375px)"
                      className={`px-2 py-1 text-[10px] border flex items-center gap-1 cursor-pointer transition-colors ${
                        sec.visibleMobile
                          ? 'bg-[#FCFBF8] border-[#111110] text-[#111110] font-bold'
                          : 'bg-transparent border-[#DCD7CC] text-[#52504B] line-through'
                      }`}
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>MOB</span>
                    </button>

                    {/* Reorder Arrows */}
                    <div className="flex items-center gap-1 pl-2 border-l border-[#DCD7CC]">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveSection(idx, 'up')}
                        className="p-1 hover:bg-[#FCFBF8] text-[#111110] disabled:opacity-30 cursor-pointer"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === layout.sections.length - 1}
                        onClick={() => handleMoveSection(idx, 'down')}
                        className="p-1 hover:bg-[#FCFBF8] text-[#111110] disabled:opacity-30 cursor-pointer"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Grid & Density Controls & Live Previewer (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Hero Visual & Image Replacement Card */}
          <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-4 shadow-editorial">
            <div className="border-b border-[#DCD7CC] pb-3 flex justify-between items-center">
              <h3 className="text-xs uppercase text-[#111110] font-bold tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#B82328]" />
                <span>HERO SECTION VISUAL &amp; IMAGE REPLACEMENT</span>
              </h3>
              <span className="text-[10px] text-[#2E6F40] font-bold">SEO OPTIMIZED</span>
            </div>

            <div className="space-y-4">
              {/* Thumbnail Preview */}
              <div
                className="relative w-full aspect-[2/1] border border-[#DCD7CC] overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: heroConfig.backgroundColor || '#EAE2D8' }}
              >
                {heroConfig.desktopImageUrl ? (
                  <img
                    src={heroConfig.desktopImageUrl}
                    alt={heroConfig.altText || 'Hero Visual'}
                    className="w-full h-full object-cover select-none"
                    style={{ objectPosition: heroConfig.objectPosition || 'right center' }}
                  />
                ) : (
                  <span className="text-xs text-[#52504B]">No image configured</span>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#111110]/80 backdrop-blur-xs text-white text-[9px] font-mono uppercase">
                  Current Studio Asset
                </div>
              </div>

              {/* Desktop Image URL */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#111110] tracking-wider mb-1">
                  Desktop Hero Image URL *
                </label>
                <input
                  type="text"
                  value={heroConfig.desktopImageUrl || ''}
                  onChange={(e) =>
                    setHeroConfig({ ...heroConfig, desktopImageUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] outline-none font-mono"
                  placeholder="/images/outside_hero_final.png"
                />
                {/* Presets */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    { label: 'OUTSIDE Final (1774×887)', url: '/images/outside_hero_final.png' },
                    { label: 'Drop 001 Front', url: '/images/drops/drop-001-front.jpg' },
                    { label: 'Drop 002 Sage', url: '/images/drops/drop-002-front.jpg' },
                    { label: 'Drop 003 Obsidian', url: '/images/drops/drop-003-front.jpg' },
                  ].map((p) => (
                    <button
                      key={p.url}
                      type="button"
                      onClick={() =>
                        setHeroConfig({ ...heroConfig, desktopImageUrl: p.url })
                      }
                      className="text-[9px] px-2 py-0.5 bg-[#EDEAE2] border border-[#DCD7CC] hover:border-[#111110] text-[#111110] font-mono transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Image URL */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#111110] tracking-wider mb-1">
                  Mobile Hero Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={heroConfig.mobileImageUrl || ''}
                  onChange={(e) =>
                    setHeroConfig({ ...heroConfig, mobileImageUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] outline-none font-mono"
                  placeholder="Leave empty to use desktop asset"
                />
              </div>

              {/* SEO Alt Text & Alignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#111110] tracking-wider mb-1">
                    SEO Image Alt Text *
                  </label>
                  <input
                    type="text"
                    value={heroConfig.altText || ''}
                    onChange={(e) =>
                      setHeroConfig({ ...heroConfig, altText: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] outline-none font-mono"
                    placeholder="Keywords for Google Discover"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#111110] tracking-wider mb-1">
                    Background Color Hex
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={heroConfig.backgroundColor || '#EAE2D8'}
                      onChange={(e) =>
                        setHeroConfig({ ...heroConfig, backgroundColor: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD7CC] text-xs text-[#111110] focus:border-[#111110] outline-none font-mono"
                    />
                    <div
                      className="w-8 h-8 border border-[#DCD7CC] rounded shrink-0"
                      style={{ backgroundColor: heroConfig.backgroundColor || '#EAE2D8' }}
                    />
                  </div>
                </div>
              </div>

              {/* Headline & Eyebrow Customizer */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#DCD7CC]">
                <div>
                  <label className="block text-[9px] uppercase font-bold text-[#52504B]">Line 1</label>
                  <input
                    type="text"
                    value={heroConfig.headlineLine1 || 'WEAR'}
                    onChange={(e) =>
                      setHeroConfig({ ...heroConfig, headlineLine1: e.target.value.toUpperCase() })
                    }
                    className="w-full px-2 py-1 text-xs bg-[#FAF8F5] border border-[#DCD7CC] focus:border-[#111110] outline-none font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-bold text-[#52504B]">Line 2</label>
                  <input
                    type="text"
                    value={heroConfig.headlineLine2 || 'YOUR'}
                    onChange={(e) =>
                      setHeroConfig({ ...heroConfig, headlineLine2: e.target.value.toUpperCase() })
                    }
                    className="w-full px-2 py-1 text-xs bg-[#FAF8F5] border border-[#DCD7CC] focus:border-[#111110] outline-none font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-bold text-[#52504B]">Line 3</label>
                  <input
                    type="text"
                    value={heroConfig.headlineLine3 || 'STORY'}
                    onChange={(e) =>
                      setHeroConfig({ ...heroConfig, headlineLine3: e.target.value.toUpperCase() })
                    }
                    className="w-full px-2 py-1 text-xs bg-[#FAF8F5] border border-[#DCD7CC] focus:border-[#111110] outline-none font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Grid & Sticky Density Card */}
          <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-6 shadow-editorial">
            <div className="border-b border-[#DCD7CC] pb-3 flex justify-between items-center">
              <h3 className="text-xs uppercase text-[#111110] font-bold tracking-wider flex items-center gap-2">
                <Grid className="w-4 h-4 text-[#B82328]" />
                <span>GRID COLUMNS &amp; STICKY DENSITY</span>
              </h3>
            </div>

            {/* The Vault Grid Columns */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#111110] uppercase block">
                THE VAULT GRID COLUMNS (PER BREAKPOINT)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 bg-[#EDEAE2]/30 border border-[#DCD7CC] text-center">
                  <span className="text-[10px] text-[#52504B] block mb-1">MOBILE (375px)</span>
                  <select
                    value={layout.gridColumns?.vault?.mobile || 1}
                    onChange={(e) =>
                      setLayout({
                        ...layout,
                        gridColumns: {
                          ...layout.gridColumns,
                          vault: {
                            ...layout.gridColumns.vault,
                            mobile: Number(e.target.value),
                          },
                        },
                      })
                    }
                    className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-2 py-1 text-xs text-center"
                  >
                    <option value="1">1 Col</option>
                    <option value="2">2 Cols</option>
                  </select>
                </div>

                <div className="p-2 bg-[#EDEAE2]/30 border border-[#DCD7CC] text-center">
                  <span className="text-[10px] text-[#52504B] block mb-1">TABLET (768px)</span>
                  <select
                    value={layout.gridColumns?.vault?.tablet || 2}
                    onChange={(e) =>
                      setLayout({
                        ...layout,
                        gridColumns: {
                          ...layout.gridColumns,
                          vault: {
                            ...layout.gridColumns.vault,
                            tablet: Number(e.target.value),
                          },
                        },
                      })
                    }
                    className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-2 py-1 text-xs text-center"
                  >
                    <option value="1">1 Col</option>
                    <option value="2">2 Cols</option>
                    <option value="3">3 Cols</option>
                  </select>
                </div>

                <div className="p-2 bg-[#EDEAE2]/30 border border-[#DCD7CC] text-center">
                  <span className="text-[10px] text-[#52504B] block mb-1">DESKTOP (1280px)</span>
                  <select
                    value={layout.gridColumns?.vault?.desktop || 3}
                    onChange={(e) =>
                      setLayout({
                        ...layout,
                        gridColumns: {
                          ...layout.gridColumns,
                          vault: {
                            ...layout.gridColumns.vault,
                            desktop: Number(e.target.value),
                          },
                        },
                      })
                    }
                    className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-2 py-1 text-xs text-center"
                  >
                    <option value="2">2 Cols</option>
                    <option value="3">3 Cols</option>
                    <option value="4">4 Cols</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Sticky CTA Bar Position */}
            <div className="space-y-2 pt-2 border-t border-[#DCD7CC]">
              <span className="text-[11px] font-bold text-[#111110] uppercase block">
                MOBILE STICKY QUICK-BUY BAR POSITION
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setLayout({ ...layout, mobileStickyCtaPosition: 'bottom_fixed' })
                  }
                  className={`p-3 border text-left cursor-pointer transition-colors ${
                    layout.mobileStickyCtaPosition === 'bottom_fixed'
                      ? 'bg-[#EDEAE2] border-[#111110] text-[#111110] font-bold'
                      : 'bg-[#FCFBF8] border-[#DCD7CC] text-[#52504B]'
                  }`}
                >
                  <span className="text-xs uppercase block">BOTTOM FIXED</span>
                  <span className="text-[10px] text-[#52504B]">Floating bar over bottom edge</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setLayout({ ...layout, mobileStickyCtaPosition: 'inline' })
                  }
                  className={`p-3 border text-left cursor-pointer transition-colors ${
                    layout.mobileStickyCtaPosition === 'inline'
                      ? 'bg-[#EDEAE2] border-[#111110] text-[#111110] font-bold'
                      : 'bg-[#FCFBF8] border-[#DCD7CC] text-[#52504B]'
                  }`}
                >
                  <span className="text-xs uppercase block">TOP DOCKED</span>
                  <span className="text-[10px] text-[#52504B]">Directly below navigation</span>
                </button>
              </div>
            </div>

          </div>

          {/* Built-In Responsive Previewer */}
          <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-4 shadow-editorial">
            <div className="border-b border-[#DCD7CC] pb-3 flex justify-between items-center">
              <h3 className="text-xs uppercase text-[#111110] font-bold tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#B82328]" />
                <span>STOREFRONT LIVE PREVIEW</span>
              </h3>
              
              <div className="flex items-center gap-1 bg-[#EDEAE2] p-1 border border-[#DCD7CC]">
                <button
                  type="button"
                  onClick={() => setPreviewViewport('mobile')}
                  title="Mobile Viewport (375px)"
                  className={`p-1.5 transition-colors cursor-pointer ${
                    previewViewport === 'mobile' ? 'bg-[#FCFBF8] text-[#111110] shadow-sm' : 'text-[#52504B]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewport('tablet')}
                  title="Tablet Viewport (768px)"
                  className={`p-1.5 transition-colors cursor-pointer ${
                    previewViewport === 'tablet' ? 'bg-[#FCFBF8] text-[#111110] shadow-sm' : 'text-[#52504B]'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewport('desktop')}
                  title="Desktop Viewport (1280px)"
                  className={`p-1.5 transition-colors cursor-pointer ${
                    previewViewport === 'desktop' ? 'bg-[#FCFBF8] text-[#111110] shadow-sm' : 'text-[#52504B]'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="border border-[#DCD7CC] bg-[#EDEAE2]/40 p-2 flex justify-center overflow-hidden">
              <div
                style={{
                  width: previewViewport === 'mobile' ? '375px' : previewViewport === 'tablet' ? '540px' : '100%',
                  height: '420px',
                  transition: 'width 0.3s ease',
                }}
                className="bg-[#FCFBF8] border border-[#DCD7CC] overflow-hidden shadow-inner relative"
              >
                <iframe
                  key={iframeKey}
                  src={`/?preview=${iframeKey}`}
                  title="Storefront Live Preview"
                  className="w-full h-full border-0 select-none pointer-events-none"
                />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

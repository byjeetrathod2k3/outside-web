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
  Settings2,
  X,
  Sliders,
  Check,
  HelpCircle,
  ExternalLink,
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

  // Section Specific Settings Modal State
  const [activeEditingSection, setActiveEditingSection] = useState<any | null>(null);
  const [modalSettings, setModalSettings] = useState<Record<string, any>>({});

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

  const openSectionSettings = (sec: any) => {
    setActiveEditingSection(sec);
    setModalSettings(sec.settings ? { ...sec.settings } : {});
  };

  const handleSaveModalSettings = () => {
    if (!activeEditingSection) return;

    const updatedSections = layout.sections.map((s: any) =>
      s.id === activeEditingSection.id ? { ...s, settings: { ...modalSettings } } : s
    );

    const updatedLayout = { ...layout, sections: updatedSections };
    setLayout(updatedLayout);
    setActiveEditingSection(null);

    // Auto-save updated layout
    handleSaveLayoutDirect(updatedLayout);
  };

  const handleSaveLayoutDirect = async (layoutToSave = layout) => {
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const [layoutRes, heroRes] = await Promise.all([
        fetch('/api/admin/layout', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(layoutToSave),
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

      setSuccessMsg('SECTION SETTINGS & LAYOUT ARCHITECTURE SAVED SUCCESSFULLY.');
      setIframeKey((prev) => prev + 1);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    await handleSaveLayoutDirect(layout);
  };

  const handleReset = async () => {
    if (!confirm('Reset section sequence and column densities to studio factory defaults?')) {
      return;
    }

    setSaving(true);
    setErrorMsg(null);
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
                <span>HOMEPAGE SECTION SEQUENCE &amp; INDIVIDUAL CONTROLS</span>
              </h3>
              <span className="text-[10px] text-[#52504B]">REORDERABLE · CUSTOMIZABLE</span>
            </div>

            <p className="text-[11px] text-[#52504B] leading-relaxed">
              Drag or use arrows to adjust vertical reading order. Click <strong>SETTINGS</strong> on any section to configure card limits, default filters, custom copy, and styling without hurting SEO.
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
                        {sec.id === 'drops' && (
                          <span className="ml-2 text-[#B82328] font-semibold">
                            (Default: {sec.settings?.defaultCardCount !== undefined ? (sec.settings.defaultCardCount === 0 ? 'All Cards' : `${sec.settings.defaultCardCount} Cards`) : '3 Cards'})
                          </span>
                        )}
                        {sec.id === 'vault' && sec.settings?.defaultCardCount && (
                          <span className="ml-2 text-[#3F4E44] font-semibold">
                            ({sec.settings.defaultCardCount} Cards)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Device Visibility Pills & Settings Button */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    
                    {/* Dedicated Section Settings Button */}
                    <button
                      type="button"
                      onClick={() => openSectionSettings(sec)}
                      className="px-2.5 py-1 text-[10px] bg-[#111110] hover:bg-[#B82328] text-white border border-[#111110] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      title={`Configure & Customize #${sec.id}`}
                    >
                      <Settings2 className="w-3 h-3 text-[#EDEAE2]" />
                      <span>SETTINGS</span>
                    </button>

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
          <div id="hero-editor-card" className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-4 shadow-editorial">
            <div className="border-b border-[#DCD7CC] pb-3 flex justify-between items-center">
              <h3 className="text-xs uppercase text-[#111110] font-bold tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#B82328]" />
                <span>HERO SECTION VISUAL &amp; IMAGE REPLACEMENT</span>
              </h3>
              <span className="text-[10px] text-[#3F4E44] font-bold">SEO PROTECTED</span>
            </div>

            <p className="text-[11px] text-[#52504B] leading-relaxed">
              Replace the main homepage hero artwork. Changes immediately update LCP preloading and Google Image Search tags.
            </p>

            {/* Live Hero Thumbnail Preview */}
            <div className="relative aspect-[16/9] w-full border border-[#DCD7CC] overflow-hidden flex items-center justify-center" style={{ backgroundColor: heroConfig.backgroundColor || '#EAE2D8' }}>
              <NextImage
                src={heroConfig.desktopImageUrl || '/images/outside_hero_final.png'}
                alt={heroConfig.altText || 'Outside Hero'}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 500px"
              />
              <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#111110]/80 text-[#FCFBF8] text-[9px] font-mono">
                DESKTOP PREVIEW
              </span>
            </div>

            {/* Preset Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-[#52504B] block">
                Quick Studio Presets
              </label>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <button
                  type="button"
                  onClick={() => setHeroConfig({
                    ...heroConfig,
                    desktopImageUrl: '/images/outside_hero_final.png',
                    mobileImageUrl: '/images/outside_hero_final.png',
                    backgroundColor: '#EAE2D8',
                    altText: 'DROP 001 Better Days Ahead Heavyweight T-Shirt',
                  })}
                  className="p-2 border border-[#DCD7CC] hover:border-[#111110] text-left bg-white cursor-pointer font-bold"
                >
                  01. Outside Hero Final
                </button>
                <button
                  type="button"
                  onClick={() => setHeroConfig({
                    ...heroConfig,
                    desktopImageUrl: '/images/drops/drop-001-front.jpg',
                    mobileImageUrl: '/images/drops/drop-001-back.jpg',
                    backgroundColor: '#F7F5F0',
                    altText: 'OUTSIDE Drop 001 Ivory Edition',
                  })}
                  className="p-2 border border-[#DCD7CC] hover:border-[#111110] text-left bg-white cursor-pointer font-bold"
                >
                  02. Drop 001 Studio
                </button>
                <button
                  type="button"
                  onClick={() => setHeroConfig({
                    ...heroConfig,
                    desktopImageUrl: '/images/drops/drop-002-front.jpg',
                    mobileImageUrl: '/images/drops/drop-002-back.jpg',
                    backgroundColor: '#EAE6DF',
                    altText: 'OUTSIDE Drop 002 Botanical Moss Edition',
                  })}
                  className="p-2 border border-[#DCD7CC] hover:border-[#111110] text-left bg-white cursor-pointer font-bold"
                >
                  03. Drop 002 Botanical
                </button>
                <button
                  type="button"
                  onClick={() => setHeroConfig({
                    ...heroConfig,
                    desktopImageUrl: '/images/drops/drop-003-front.jpg',
                    mobileImageUrl: '/images/drops/drop-003-back.jpg',
                    backgroundColor: '#E5E4E2',
                    altText: 'OUTSIDE Drop 003 Obsidian Black Edition',
                  })}
                  className="p-2 border border-[#DCD7CC] hover:border-[#111110] text-left bg-white cursor-pointer font-bold"
                >
                  04. Drop 003 Obsidian
                </button>
              </div>
            </div>

            {/* Custom URLs and SEO Fields */}
            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                  Desktop Image URL (or path)
                </label>
                <input
                  type="text"
                  value={heroConfig.desktopImageUrl || ''}
                  onChange={(e) => setHeroConfig({ ...heroConfig, desktopImageUrl: e.target.value })}
                  placeholder="/images/outside_hero_final.png"
                  className="w-full bg-[#FCFBF8] border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110] focus:border-[#B82328] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                  Mobile Image URL (or path)
                </label>
                <input
                  type="text"
                  value={heroConfig.mobileImageUrl || ''}
                  onChange={(e) => setHeroConfig({ ...heroConfig, mobileImageUrl: e.target.value })}
                  placeholder="/images/outside_hero_final.png"
                  className="w-full bg-[#FCFBF8] border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110] focus:border-[#B82328] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                    Canvas Tint Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={heroConfig.backgroundColor || '#EAE2D8'}
                      onChange={(e) => setHeroConfig({ ...heroConfig, backgroundColor: e.target.value })}
                      className="w-8 h-8 p-0 border border-[#DCD7CC] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={heroConfig.backgroundColor || '#EAE2D8'}
                      onChange={(e) => setHeroConfig({ ...heroConfig, backgroundColor: e.target.value })}
                      className="w-full bg-[#FCFBF8] border border-[#DCD7CC] p-1.5 text-[11px] font-mono text-[#111110]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                    Object Alignment
                  </label>
                  <select
                    value={heroConfig.objectPosition || 'right center'}
                    onChange={(e) => setHeroConfig({ ...heroConfig, objectPosition: e.target.value })}
                    className="w-full bg-[#FCFBF8] border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110]"
                  >
                    <option value="right center">Right Center</option>
                    <option value="center center">Center Center</option>
                    <option value="left center">Left Center</option>
                    <option value="center top">Center Top</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                  SEO Alt Text (Google Image Search)
                </label>
                <input
                  type="text"
                  value={heroConfig.altText || ''}
                  onChange={(e) => setHeroConfig({ ...heroConfig, altText: e.target.value })}
                  placeholder="DROP 001 Better Days Ahead Heavyweight T-Shirt"
                  className="w-full bg-[#FCFBF8] border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110] focus:border-[#B82328] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Grid Breakpoints & Sticky CTA Density */}
          <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-4 shadow-editorial">
            <h3 className="text-xs uppercase text-[#111110] font-bold tracking-wider flex items-center gap-2 border-b border-[#DCD7CC] pb-3">
              <Grid className="w-4 h-4 text-[#B82328]" />
              <span>GRID COLUMNS &amp; STICKY DENSITY</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#52504B] block mb-2">
                  The Vault Grid Columns (Per Breakpoint)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-[#EDEAE2]/40 border border-[#DCD7CC] space-y-1">
                    <span className="text-[9px] uppercase font-bold text-[#52504B] block text-center">Mobile (375px)</span>
                    <select
                      value={layout.gridColumns?.vault?.mobile || 1}
                      onChange={(e) =>
                        setLayout({
                          ...layout,
                          gridColumns: {
                            ...layout.gridColumns,
                            vault: { ...layout.gridColumns?.vault, mobile: Number(e.target.value) },
                          },
                        })
                      }
                      className="w-full bg-[#FCFBF8] border border-[#DCD7CC] p-1.5 text-xs font-mono text-[#111110] cursor-pointer"
                    >
                      <option value={1}>1 Col</option>
                      <option value={2}>2 Cols</option>
                    </select>
                  </div>

                  <div className="p-2 bg-[#EDEAE2]/40 border border-[#DCD7CC] space-y-1">
                    <span className="text-[9px] uppercase font-bold text-[#52504B] block text-center">Tablet (768px)</span>
                    <select
                      value={layout.gridColumns?.vault?.tablet || 2}
                      onChange={(e) =>
                        setLayout({
                          ...layout,
                          gridColumns: {
                            ...layout.gridColumns,
                            vault: { ...layout.gridColumns?.vault, tablet: Number(e.target.value) },
                          },
                        })
                      }
                      className="w-full bg-[#FCFBF8] border border-[#DCD7CC] p-1.5 text-xs font-mono text-[#111110] cursor-pointer"
                    >
                      <option value={1}>1 Col</option>
                      <option value={2}>2 Cols</option>
                      <option value={3}>3 Cols</option>
                    </select>
                  </div>

                  <div className="p-2 bg-[#EDEAE2]/40 border border-[#DCD7CC] space-y-1">
                    <span className="text-[9px] uppercase font-bold text-[#52504B] block text-center">Desktop (1280px)</span>
                    <select
                      value={layout.gridColumns?.vault?.desktop || 3}
                      onChange={(e) =>
                        setLayout({
                          ...layout,
                          gridColumns: {
                            ...layout.gridColumns,
                            vault: { ...layout.gridColumns?.vault, desktop: Number(e.target.value) },
                          },
                        })
                      }
                      className="w-full bg-[#FCFBF8] border border-[#DCD7CC] p-1.5 text-xs font-mono text-[#111110] cursor-pointer"
                    >
                      <option value={2}>2 Cols</option>
                      <option value={3}>3 Cols</option>
                      <option value={4}>4 Cols</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#DCD7CC]">
                <span className="text-[10px] uppercase font-bold text-[#52504B] block mb-2">
                  Mobile Sticky Quick-Buy Bar Position
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLayout({ ...layout, mobileStickyCtaPosition: 'bottom_fixed' })}
                    className={`p-3 border text-left cursor-pointer transition-colors ${
                      layout.mobileStickyCtaPosition === 'bottom_fixed'
                        ? 'bg-[#EDEAE2] border-[#111110] font-bold text-[#111110]'
                        : 'bg-white border-[#DCD7CC] text-[#52504B]'
                    }`}
                  >
                    <span className="block font-bold uppercase">Bottom Fixed</span>
                    <span className="text-[10px] text-[#52504B]">Floating bar over bottom edge</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLayout({ ...layout, mobileStickyCtaPosition: 'inline' })}
                    className={`p-3 border text-left cursor-pointer transition-colors ${
                      layout.mobileStickyCtaPosition === 'inline'
                        ? 'bg-[#EDEAE2] border-[#111110] font-bold text-[#111110]'
                        : 'bg-white border-[#DCD7CC] text-[#52504B]'
                    }`}
                  >
                    <span className="block font-bold uppercase">Top Docked</span>
                    <span className="text-[10px] text-[#52504B]">Directly below navigation</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Storefront Live Preview */}
          <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-4 shadow-editorial">
            <div className="flex items-center justify-between border-b border-[#DCD7CC] pb-3">
              <h3 className="text-xs uppercase text-[#111110] font-bold tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#B82328]" />
                <span>STOREFRONT LIVE PREVIEW</span>
              </h3>

              <div className="flex items-center gap-1 bg-[#EDEAE2] p-1 border border-[#DCD7CC]">
                <button
                  type="button"
                  onClick={() => setPreviewViewport('mobile')}
                  className={`p-1 ${previewViewport === 'mobile' ? 'bg-[#FCFBF8] shadow-xs' : 'text-[#52504B]'}`}
                  title="Mobile View"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewport('tablet')}
                  className={`p-1 ${previewViewport === 'tablet' ? 'bg-[#FCFBF8] shadow-xs' : 'text-[#52504B]'}`}
                  title="Tablet View"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewport('desktop')}
                  className={`p-1 ${previewViewport === 'desktop' ? 'bg-[#FCFBF8] shadow-xs' : 'text-[#52504B]'}`}
                  title="Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex justify-center bg-[#EDEAE2]/30 p-2 border border-[#DCD7CC]">
              <div
                className={`bg-white transition-all overflow-hidden border border-[#DCD7CC] shadow-inner ${
                  previewViewport === 'mobile'
                    ? 'w-[375px] h-[580px]'
                    : previewViewport === 'tablet'
                    ? 'w-[768px] h-[650px]'
                    : 'w-full h-[650px]'
                }`}
              >
                <iframe
                  key={iframeKey}
                  src="/"
                  className="w-full h-full border-none"
                  title="Storefront Preview"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION SETTINGS MODAL / DIALOG                          */}
      {/* ======================================================== */}
      {activeEditingSection && (
        <div className="fixed inset-0 z-50 bg-[#111110]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FCFBF8] border-2 border-[#111110] w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in font-mono">
            
            {/* Modal Header */}
            <div className="bg-[#111110] text-[#FCFBF8] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings2 className="w-5 h-5 text-[#B82328]" />
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    CONFIGURE SECTION: {activeEditingSection.name}
                  </h3>
                  <span className="text-[10px] text-[#A5A196]">
                    Anchor: #{activeEditingSection.id} · Priority: {activeEditingSection.sortOrder}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveEditingSection(null)}
                className="text-[#DCD7CC] hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Tailored Controls per Section */}
            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs">
              
              {/* SECTION: DROPS / CATALOG */}
              {activeEditingSection.id === 'drops' && (
                <div className="space-y-6">
                  
                  {/* Default Cards to Show */}
                  <div className="p-4 bg-[#EDEAE2]/50 border border-[#DCD7CC] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#111110] uppercase tracking-wider">
                        Default Cards To Show on Homepage
                      </span>
                      <span className="text-[10px] text-[#B82328] font-bold uppercase">
                        Current: {modalSettings.defaultCardCount !== undefined ? (modalSettings.defaultCardCount === 0 ? 'All Cards' : `${modalSettings.defaultCardCount} Cards`) : '3 Cards'}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#52504B] leading-relaxed">
                      Select how many product cards are visible by default. When the collection has more editions, the storefront automatically renders a sleek <strong>&quot;View All Editions&quot;</strong> button for seamless expansion without slowing down initial page speed.
                    </p>

                    <div className="grid grid-cols-5 gap-2 pt-1">
                      {[
                        { label: '2 Cards', value: 2 },
                        { label: '3 Cards', value: 3 },
                        { label: '4 Cards', value: 4 },
                        { label: '6 Cards', value: 6 },
                        { label: 'All Cards', value: 0 },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setModalSettings({ ...modalSettings, defaultCardCount: opt.value })}
                          className={`py-2 px-1 text-center font-bold text-[11px] border cursor-pointer transition-colors ${
                            (modalSettings.defaultCardCount !== undefined ? modalSettings.defaultCardCount : 3) === opt.value
                              ? 'bg-[#111110] text-white border-[#111110]'
                              : 'bg-white border-[#DCD7CC] text-[#111110] hover:border-[#111110]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Story Bubbles & Advanced Filter Toolbar Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-[#DCD7CC] space-y-2">
                      <span className="text-[10px] font-bold uppercase text-[#52504B] block">
                        Category Story Bubbles
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setModalSettings({
                            ...modalSettings,
                            showCategoryBubbles: modalSettings.showCategoryBubbles === false ? true : false,
                          })
                        }
                        className={`w-full py-2.5 px-3 border text-xs font-bold uppercase cursor-pointer flex items-center justify-between ${
                          modalSettings.showCategoryBubbles !== false
                            ? 'bg-[#3F4E44]/10 border-[#3F4E44] text-[#3F4E44]'
                            : 'bg-[#B82328]/10 border-[#B82328] text-[#B82328]'
                        }`}
                      >
                        <span>{modalSettings.showCategoryBubbles !== false ? 'ENABLED (VISIBLE)' : 'HIDDEN'}</span>
                        <Check className="w-4 h-4" />
                      </button>
                      <p className="text-[10px] text-[#52504B]">
                        Circular editorial stories above cards.
                      </p>
                    </div>

                    <div className="p-4 bg-white border border-[#DCD7CC] space-y-2">
                      <span className="text-[10px] font-bold uppercase text-[#52504B] block">
                        Advanced Catalog Toolbar
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setModalSettings({
                            ...modalSettings,
                            showFilterToolbar: modalSettings.showFilterToolbar === false ? true : false,
                          })
                        }
                        className={`w-full py-2.5 px-3 border text-xs font-bold uppercase cursor-pointer flex items-center justify-between ${
                          modalSettings.showFilterToolbar !== false
                            ? 'bg-[#3F4E44]/10 border-[#3F4E44] text-[#3F4E44]'
                            : 'bg-[#B82328]/10 border-[#B82328] text-[#B82328]'
                        }`}
                      >
                        <span>{modalSettings.showFilterToolbar !== false ? 'ENABLED (VISIBLE)' : 'HIDDEN'}</span>
                        <Check className="w-4 h-4" />
                      </button>
                      <p className="text-[10px] text-[#52504B]">
                        Price, size filters &amp; grid density strip.
                      </p>
                    </div>
                  </div>

                  {/* Default Active Category & Sort */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                        Default Active Filter Tab
                      </label>
                      <select
                        value={modalSettings.defaultFilter || 'ALL'}
                        onChange={(e) => setModalSettings({ ...modalSettings, defaultFilter: e.target.value })}
                        className="w-full bg-white border border-[#DCD7CC] p-2.5 text-xs font-mono text-[#111110]"
                      >
                        <option value="ALL">All Editions (ALL)</option>
                        <option value="LIVE">Live Drop Now (LIVE)</option>
                        <option value="UPCOMING">Next Drop / Upcoming (UPCOMING)</option>
                        <option value="WOMEN">Women&apos;s Fit (WOMEN)</option>
                        <option value="MEN">Men&apos;s Fit (MEN)</option>
                        <option value="ARCHIVED">The Vault (ARCHIVED)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                        Default Sort Order
                      </label>
                      <select
                        value={modalSettings.defaultSort || 'FEATURED'}
                        onChange={(e) => setModalSettings({ ...modalSettings, defaultSort: e.target.value })}
                        className="w-full bg-white border border-[#DCD7CC] p-2.5 text-xs font-mono text-[#111110]"
                      >
                        <option value="FEATURED">Featured Drop Hierarchy</option>
                        <option value="PRICE_ASC">Price: Low to High</option>
                        <option value="PRICE_DESC">Price: High to Low</option>
                        <option value="DROP_NUM">Drop Number (Desc)</option>
                        <option value="EDITION_RUN">Edition Quantity (Desc)</option>
                      </select>
                    </div>
                  </div>

                  {/* Section Headings */}
                  <div className="space-y-3 pt-2 border-t border-[#DCD7CC]">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                        Section Eyebrow Subtitle
                      </label>
                      <input
                        type="text"
                        value={modalSettings.eyebrow || ''}
                        onChange={(e) => setModalSettings({ ...modalSettings, eyebrow: e.target.value })}
                        placeholder="THE ROTATION // SERIALIZED PRODUCTION RUNS"
                        className="w-full bg-white border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                        Section Headline Title
                      </label>
                      <input
                        type="text"
                        value={modalSettings.title || ''}
                        onChange={(e) => setModalSettings({ ...modalSettings, title: e.target.value })}
                        placeholder="Limited Edition Catalog."
                        className="w-full bg-white border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                        Section Narrative Description
                      </label>
                      <textarea
                        rows={2}
                        value={modalSettings.description || ''}
                        onChange={(e) => setModalSettings({ ...modalSettings, description: e.target.value })}
                        placeholder="Every garment is custom-milled in India from 280 GSM organic cotton, numbered from #001 to #250, and produced once. Never restocked."
                        className="w-full bg-white border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110]"
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* SECTION: HERO */}
              {activeEditingSection.id === 'hero' && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#EDEAE2]/40 border border-[#DCD7CC] text-[11px] text-[#52504B] space-y-2">
                    <span className="font-bold text-[#111110] block">HOMEPAGE HERO VISUAL CONTROL:</span>
                    <p>
                      The primary hero artwork and copy can be customized directly in the <strong>HERO SECTION VISUAL &amp; IMAGE REPLACEMENT</strong> card on this page.
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                      Hero Eyebrow Text
                    </label>
                    <input
                      type="text"
                      value={heroConfig.eyebrowText || ''}
                      onChange={(e) => setHeroConfig({ ...heroConfig, eyebrowText: e.target.value })}
                      className="w-full bg-white border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                      Primary CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={heroConfig.ctaText || ''}
                      onChange={(e) => setHeroConfig({ ...heroConfig, ctaText: e.target.value })}
                      className="w-full bg-white border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110]"
                    />
                  </div>
                </div>
              )}

              {/* SECTION: STORY (MANIFESTO) */}
              {activeEditingSection.id === 'story' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                      Manifesto Eyebrow
                    </label>
                    <input
                      type="text"
                      value={modalSettings.eyebrow || ''}
                      onChange={(e) => setModalSettings({ ...modalSettings, eyebrow: e.target.value })}
                      placeholder="THE ANTI-INVENTORY PHILOSOPHY"
                      className="w-full bg-white border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                      Manifesto Title
                    </label>
                    <input
                      type="text"
                      value={modalSettings.title || ''}
                      onChange={(e) => setModalSettings({ ...modalSettings, title: e.target.value })}
                      placeholder="Mass Production Is A Crime Against Craft."
                      className="w-full bg-white border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                      Philosophy Description
                    </label>
                    <textarea
                      rows={3}
                      value={modalSettings.description || ''}
                      onChange={(e) => setModalSettings({ ...modalSettings, description: e.target.value })}
                      placeholder="We do not produce seasonal collections or excess inventory. We release one singular, uncompromising style at a time in capped serialized runs."
                      className="w-full bg-white border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110]"
                    />
                  </div>
                </div>
              )}

              {/* SECTION: VAULT */}
              {activeEditingSection.id === 'vault' && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#EDEAE2]/50 border border-[#DCD7CC] space-y-3">
                    <span className="text-[11px] font-bold text-[#111110] uppercase tracking-wider block">
                      Archival Vault Cards to Show
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: '2 Cards', value: 2 },
                        { label: '3 Cards', value: 3 },
                        { label: '4 Cards', value: 4 },
                        { label: 'All Cards', value: 0 },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setModalSettings({ ...modalSettings, defaultCardCount: opt.value })}
                          className={`py-2 px-1 text-center font-bold text-[11px] border cursor-pointer transition-colors ${
                            (modalSettings.defaultCardCount !== undefined ? modalSettings.defaultCardCount : 3) === opt.value
                              ? 'bg-[#111110] text-white border-[#111110]'
                              : 'bg-white border-[#DCD7CC] text-[#111110] hover:border-[#111110]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                      Vault Eyebrow
                    </label>
                    <input
                      type="text"
                      value={modalSettings.eyebrow || ''}
                      onChange={(e) => setModalSettings({ ...modalSettings, eyebrow: e.target.value })}
                      placeholder="DIGITAL ARCHIVE // SEEDED EDITIONS"
                      className="w-full bg-white border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                      Vault Title
                    </label>
                    <input
                      type="text"
                      value={modalSettings.title || ''}
                      onChange={(e) => setModalSettings({ ...modalSettings, title: e.target.value })}
                      placeholder="The Vault // Editions Showcase."
                      className="w-full bg-white border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110]"
                    />
                  </div>
                </div>
              )}

              {/* SECTION: FAQS */}
              {activeEditingSection.id === 'faqs' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-[#3F4E44]/10 border border-[#3F4E44] text-[#3F4E44] text-[11px] space-y-1">
                    <span className="font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>SEO &amp; AEO (SCHEMA.ORG) GUARANTEE</span>
                    </span>
                    <p className="text-[#52504B]">
                      Regardless of the number of FAQs visually displayed on the page, the complete FAQ repository is automatically embedded in Schema.org FAQPage JSON-LD for Google AI Overviews and Search Generative Experience.
                    </p>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                      Initial FAQs to Display
                    </label>
                    <select
                      value={modalSettings.faqLimit || 4}
                      onChange={(e) => setModalSettings({ ...modalSettings, faqLimit: Number(e.target.value) })}
                      className="w-full bg-white border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110]"
                    >
                      <option value={4}>4 FAQs</option>
                      <option value={8}>8 FAQs</option>
                      <option value={0}>All FAQs</option>
                    </select>
                  </div>
                </div>
              )}

              {/* OTHER SECTIONS (GENERIC FALLBACK) */}
              {!['drops', 'hero', 'story', 'vault', 'faqs'].includes(activeEditingSection.id) && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                      Custom Section Eyebrow
                    </label>
                    <input
                      type="text"
                      value={modalSettings.eyebrow || ''}
                      onChange={(e) => setModalSettings({ ...modalSettings, eyebrow: e.target.value })}
                      className="w-full bg-white border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                      Custom Section Title
                    </label>
                    <input
                      type="text"
                      value={modalSettings.title || ''}
                      onChange={(e) => setModalSettings({ ...modalSettings, title: e.target.value })}
                      className="w-full bg-white border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110]"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Modal Actions */}
            <div className="bg-[#EDEAE2] px-6 py-4 border-t border-[#DCD7CC] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveEditingSection(null)}
                className="px-4 py-2 border border-[#DCD7CC] hover:border-[#111110] text-[#111110] text-xs uppercase font-semibold cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleSaveModalSettings}
                className="px-6 py-2 bg-[#111110] hover:bg-[#B82328] text-white text-xs uppercase font-bold tracking-wider cursor-pointer shadow-sm transition-colors"
              >
                APPLY &amp; SAVE SETTINGS
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

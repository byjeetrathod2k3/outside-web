'use client';

import React, { useState, useEffect } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
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
  Package,
  ArrowRight,
  Palette,
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

  const [allDrops, setAllDrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewViewport, setPreviewViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [iframeKey, setIframeKey] = useState(0);

  // Section Specific Settings Modal State
  const [activeEditingSection, setActiveEditingSection] = useState<any | null>(null);
  const [modalSettings, setModalSettings] = useState<Record<string, any>>({});
  const [modalHeroPreview, setModalHeroPreview] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    async function loadData() {
      try {
        const [resLayout, resHero, resDrops] = await Promise.all([
          fetch('/api/admin/layout'),
          fetch('/api/admin/hero'),
          fetch('/api/admin/drops'),
        ]);

        if (resLayout.ok) {
          const data = await resLayout.json();
          if (data.layout) setLayout(data.layout);
        }

        if (resHero.ok) {
          const data = await resHero.json();
          if (data.heroConfig) setHeroConfig(data.heroConfig);
        }

        if (resDrops.ok) {
          const data = await resDrops.json();
          if (data.drops) setAllDrops(data.drops);
        }
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveLayoutDirect = async (layoutToSave = layout, heroToSave = heroConfig) => {
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
          body: JSON.stringify(heroToSave),
        }),
      ]);

      const layoutData = await layoutRes.json();
      if (!layoutRes.ok) {
        throw new Error(layoutData.error || 'Failed to update layout');
      }

      setSuccessMsg('SECTION SETTINGS & LAYOUT ARCHITECTURE SAVED & REVALIDATED.');
      setIframeKey((prev) => prev + 1);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

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

    const updatedLayout = { ...layout, sections };
    setLayout(updatedLayout);
    handleSaveLayoutDirect(updatedLayout);
  };

  const handleToggleVisibility = (
    sectionId: string,
    device: 'visibleDesktop' | 'visibleTablet' | 'visibleMobile'
  ) => {
    const updatedSections = layout.sections.map((sec: any) =>
      sec.id === sectionId ? { ...sec, [device]: !sec[device] } : sec
    );
    const updatedLayout = { ...layout, sections: updatedSections };
    setLayout(updatedLayout);
    handleSaveLayoutDirect(updatedLayout); // Auto-save immediately so clicks work 100%!
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

    // Auto-save updated layout + heroConfig
    handleSaveLayoutDirect(updatedLayout, heroConfig);
  };

  const handleSave = async () => {
    await handleSaveLayoutDirect(layout, heroConfig);
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
        <div className="p-4 bg-[#3F4E44]/10 border border-[#3F4E44] text-[#3F4E44] text-xs flex items-center gap-2 font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#3F4E44] flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-[#B82328]/10 border border-[#B82328] text-[#B82328] text-xs flex items-center gap-2 font-bold animate-fade-in">
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
              <span className="text-[10px] text-[#52504B]">REORDERABLE · AUTO-SAVED</span>
            </div>

            <p className="text-[11px] text-[#52504B] leading-relaxed">
              Click <strong>SETTINGS</strong> on any section to configure card limits, grid columns, copy, and artwork. Click <strong>DESK</strong>, <strong>TAB</strong>, or <strong>MOB</strong> to toggle responsive visibility (auto-persisted instantly).
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
                          <span className="ml-2 text-[#B82328] font-bold">
                            ({sec.settings?.defaultCardCount !== undefined ? (sec.settings.defaultCardCount === 0 ? 'All Cards' : `${sec.settings.defaultCardCount} Cards`) : '3 Cards'} · {sec.settings?.defaultGridColumns ? `${sec.settings.defaultGridColumns} Cols` : (sec.settings?.defaultCardCount === 4 ? '4 Cols' : '3 Cols')})
                          </span>
                        )}
                        {sec.id === 'hero' && (
                          <span className="ml-2 text-[#3F4E44] font-semibold">
                            (Image &amp; Visual Studio)
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

                    {/* Desktop Toggle (Auto-saves immediately) */}
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(sec.id, 'visibleDesktop')}
                      title="Toggle Desktop Visibility (1024px+)"
                      className={`px-2 py-1 text-[10px] border flex items-center gap-1 cursor-pointer transition-colors ${
                        sec.visibleDesktop !== false
                          ? 'bg-[#FCFBF8] border-[#111110] text-[#111110] font-bold'
                          : 'bg-transparent border-[#DCD7CC] text-[#B82328] line-through opacity-70'
                      }`}
                    >
                      <Monitor className="w-3 h-3" />
                      <span>DESK</span>
                    </button>

                    {/* Tablet Toggle (Auto-saves immediately) */}
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(sec.id, 'visibleTablet')}
                      title="Toggle Tablet Visibility (768px - 1023px)"
                      className={`px-2 py-1 text-[10px] border flex items-center gap-1 cursor-pointer transition-colors ${
                        sec.visibleTablet !== false
                          ? 'bg-[#FCFBF8] border-[#111110] text-[#111110] font-bold'
                          : 'bg-transparent border-[#DCD7CC] text-[#B82328] line-through opacity-70'
                      }`}
                    >
                      <Tablet className="w-3 h-3" />
                      <span>TAB</span>
                    </button>

                    {/* Mobile Toggle (Auto-saves immediately) */}
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(sec.id, 'visibleMobile')}
                      title="Toggle Mobile Visibility (< 768px)"
                      className={`px-2 py-1 text-[10px] border flex items-center gap-1 cursor-pointer transition-colors ${
                        sec.visibleMobile !== false
                          ? 'bg-[#FCFBF8] border-[#111110] text-[#111110] font-bold'
                          : 'bg-transparent border-[#DCD7CC] text-[#B82328] line-through opacity-70'
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
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === layout.sections.length - 1}
                        onClick={() => handleMoveSection(idx, 'down')}
                        className="p-1 hover:bg-[#FCFBF8] text-[#111110] disabled:opacity-30 cursor-pointer"
                        title="Move Down"
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

        {/* Right: Live Previewer & Responsive Density Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Storefront Live Interactive Preview */}
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
                  className={`p-1 ${previewViewport === 'mobile' ? 'bg-[#FCFBF8] shadow-xs text-[#111110]' : 'text-[#52504B]'}`}
                  title="Mobile View (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewport('tablet')}
                  className={`p-1 ${previewViewport === 'tablet' ? 'bg-[#FCFBF8] shadow-xs text-[#111110]' : 'text-[#52504B]'}`}
                  title="Tablet View (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewport('desktop')}
                  className={`p-1 ${previewViewport === 'desktop' ? 'bg-[#FCFBF8] shadow-xs text-[#111110]' : 'text-[#52504B]'}`}
                  title="Desktop View (100%)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex justify-center bg-[#EDEAE2]/30 p-2 border border-[#DCD7CC]">
              <div
                className={`bg-white transition-all overflow-hidden border border-[#DCD7CC] shadow-inner ${
                  previewViewport === 'mobile'
                    ? 'w-[375px] h-[640px]'
                    : previewViewport === 'tablet'
                    ? 'w-[768px] h-[680px]'
                    : 'w-full h-[680px]'
                }`}
              >
                <iframe
                  key={iframeKey}
                  src="/"
                  className="w-full h-full border-none"
                  title="Storefront Live Preview"
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-[#52504B]">
              <span>Active Viewport: <strong className="text-[#111110] uppercase">{previewViewport}</strong></span>
              <button
                type="button"
                onClick={() => setIframeKey((prev) => prev + 1)}
                className="text-[#B82328] hover:underline font-bold cursor-pointer"
              >
                Reload Storefront Frame ↺
              </button>
            </div>
          </div>

          {/* Grid Breakpoints & Sticky CTA Density */}
          <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-4 shadow-editorial">
            <h3 className="text-xs uppercase text-[#111110] font-bold tracking-wider flex items-center gap-2 border-b border-[#DCD7CC] pb-3">
              <Grid className="w-4 h-4 text-[#B82328]" />
              <span>THE VAULT GRID COLUMNS &amp; STICKY DENSITY</span>
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
                      onChange={(e) => {
                        const newLayout = {
                          ...layout,
                          gridColumns: {
                            ...layout.gridColumns,
                            vault: { ...layout.gridColumns?.vault, mobile: Number(e.target.value) },
                          },
                        };
                        setLayout(newLayout);
                        handleSaveLayoutDirect(newLayout);
                      }}
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
                      onChange={(e) => {
                        const newLayout = {
                          ...layout,
                          gridColumns: {
                            ...layout.gridColumns,
                            vault: { ...layout.gridColumns?.vault, tablet: Number(e.target.value) },
                          },
                        };
                        setLayout(newLayout);
                        handleSaveLayoutDirect(newLayout);
                      }}
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
                      onChange={(e) => {
                        const newLayout = {
                          ...layout,
                          gridColumns: {
                            ...layout.gridColumns,
                            vault: { ...layout.gridColumns?.vault, desktop: Number(e.target.value) },
                          },
                        };
                        setLayout(newLayout);
                        handleSaveLayoutDirect(newLayout);
                      }}
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
                    onClick={() => {
                      const newLayout = { ...layout, mobileStickyCtaPosition: 'bottom_fixed' };
                      setLayout(newLayout);
                      handleSaveLayoutDirect(newLayout);
                    }}
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
                    onClick={() => {
                      const newLayout = { ...layout, mobileStickyCtaPosition: 'inline' };
                      setLayout(newLayout);
                      handleSaveLayoutDirect(newLayout);
                    }}
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

        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION SETTINGS MODAL / DIALOG                          */}
      {/* ======================================================== */}
      {activeEditingSection && (
        <div className="fixed inset-0 z-50 bg-[#111110]/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FCFBF8] border-2 border-[#111110] w-full max-w-3xl shadow-2xl overflow-hidden animate-fade-in font-mono">
            
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
            <div className="p-6 max-h-[78vh] overflow-y-auto space-y-6 text-xs">
              
              {/* SECTION: HERO DROP SHOWCASE */}
              {activeEditingSection.id === 'hero' && (
                <div className="space-y-6">
                  
                  {/* Hero Visual Studio Notice */}
                  <div className="flex items-center justify-between border-b border-[#DCD7CC] pb-3">
                    <span className="text-[11px] font-bold text-[#111110] uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#B82328]" />
                      <span>HERO SECTION VISUAL &amp; ARTWORK STUDIO</span>
                    </span>
                    <span className="text-[10px] text-[#3F4E44] font-bold">SEO &amp; LCP PROTECTED</span>
                  </div>

                  {/* Live Hero Thumbnail Preview */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[#52504B] uppercase font-bold">Live Hero Preview</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setModalHeroPreview('desktop')}
                          className={`px-2 py-0.5 border ${modalHeroPreview === 'desktop' ? 'bg-[#111110] text-white' : 'bg-white'}`}
                        >
                          Desktop
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalHeroPreview('mobile')}
                          className={`px-2 py-0.5 border ${modalHeroPreview === 'mobile' ? 'bg-[#111110] text-white' : 'bg-white'}`}
                        >
                          Mobile
                        </button>
                      </div>
                    </div>

                    <div
                      className="relative aspect-[16/9] w-full border border-[#DCD7CC] overflow-hidden flex items-center justify-center shadow-inner"
                      style={{ backgroundColor: heroConfig.backgroundColor || '#EAE2D8' }}
                    >
                      <NextImage
                        src={modalHeroPreview === 'desktop' ? (heroConfig.desktopImageUrl || '/images/outside_hero_final.png') : (heroConfig.mobileImageUrl || '/images/outside_hero_final.png')}
                        alt={heroConfig.altText || 'Outside Hero'}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 700px"
                      />
                    </div>
                  </div>

                  {/* 1-Click Studio Presets */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-[#52504B] block">
                      1-Click Studio Presets
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                      {[
                        { label: '01. Outside Hero Final', img: '/images/outside_hero_final.png', bg: '#EAE2D8' },
                        { label: '02. Drop 001 Studio', img: '/images/drops/drop-001-front.jpg', bg: '#F7F5F0' },
                        { label: '03. Drop 002 Botanical', img: '/images/drops/drop-002-front.jpg', bg: '#EAE6DF' },
                        { label: '04. Drop 003 Obsidian', img: '/images/drops/drop-003-front.jpg', bg: '#E5E4E2' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() =>
                            setHeroConfig({
                              ...heroConfig,
                              desktopImageUrl: preset.img,
                              mobileImageUrl: preset.img,
                              backgroundColor: preset.bg,
                            })
                          }
                          className="p-2 border border-[#DCD7CC] hover:border-[#111110] text-left bg-white cursor-pointer font-bold transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image URLs & SEO Alt */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                        Desktop Image URL
                      </label>
                      <input
                        type="text"
                        value={heroConfig.desktopImageUrl || ''}
                        onChange={(e) => setHeroConfig({ ...heroConfig, desktopImageUrl: e.target.value })}
                        placeholder="/images/outside_hero_final.png"
                        className="w-full bg-white border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                        Mobile Image URL
                      </label>
                      <input
                        type="text"
                        value={heroConfig.mobileImageUrl || ''}
                        onChange={(e) => setHeroConfig({ ...heroConfig, mobileImageUrl: e.target.value })}
                        placeholder="/images/outside_hero_final.png"
                        className="w-full bg-white border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110]"
                      />
                    </div>
                  </div>

                  {/* Tint Color & Alignment */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                        Canvas Tint Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={heroConfig.backgroundColor || '#EAE2D8'}
                          onChange={(e) => setHeroConfig({ ...heroConfig, backgroundColor: e.target.value })}
                          className="w-9 h-9 p-0 border border-[#DCD7CC] cursor-pointer"
                        />
                        <input
                          type="text"
                          value={heroConfig.backgroundColor || '#EAE2D8'}
                          onChange={(e) => setHeroConfig({ ...heroConfig, backgroundColor: e.target.value })}
                          className="w-full bg-white border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110]"
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
                        className="w-full bg-white border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110]"
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
                      SEO Alt Tag (Google Image Search Indexing)
                    </label>
                    <input
                      type="text"
                      value={heroConfig.altText || ''}
                      onChange={(e) => setHeroConfig({ ...heroConfig, altText: e.target.value })}
                      placeholder="DROP 001 Better Days Ahead Heavyweight T-Shirt"
                      className="w-full bg-white border border-[#DCD7CC] p-2 text-xs font-mono text-[#111110]"
                    />
                  </div>

                  {/* Copy & CTAs */}
                  <div className="space-y-3 pt-2 border-t border-[#DCD7CC]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#52504B] block mb-1">
                          Eyebrow Subtitle
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
                  </div>

                </div>
              )}

              {/* SECTION: DROPS / ACTIVE PRODUCTIONS SHOWCASE */}
              {activeEditingSection.id === 'drops' && (
                <div className="space-y-6">
                  
                  {/* Default Cards to Show & Grid Columns */}
                  <div className="p-4 bg-[#EDEAE2]/50 border border-[#DCD7CC] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#111110] uppercase tracking-wider">
                        Default Cards To Show on Homepage
                      </span>
                      <span className="text-[10px] text-[#B82328] font-bold uppercase">
                        Current: {modalSettings.defaultCardCount !== undefined ? (modalSettings.defaultCardCount === 0 ? 'All Cards' : `${modalSettings.defaultCardCount} Cards`) : '3 Cards'}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#52504B] leading-relaxed">
                      Choose how many product cards are visible on initial load. If the collection has more editions, the storefront automatically renders a <strong>&quot;View All Editions&quot;</strong> button for smooth expansion.
                    </p>

                    <div className="grid grid-cols-5 gap-2">
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
                          onClick={() => {
                            const newCols = opt.value === 4 ? 4 : opt.value === 2 ? 2 : 3;
                            setModalSettings({
                              ...modalSettings,
                              defaultCardCount: opt.value,
                              defaultGridColumns: modalSettings.defaultGridColumns || newCols,
                            });
                          }}
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

                    {/* Desktop Grid Columns Selector */}
                    <div className="pt-2 border-t border-[#DCD7CC]">
                      <span className="text-[10px] font-bold uppercase text-[#52504B] block mb-1.5">
                        Desktop Grid Columns Density (Cards Per Row)
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: '2 Columns', value: 2 },
                          { label: '3 Columns (Standard)', value: 3 },
                          { label: '4 Columns (Quad Density)', value: 4 },
                        ].map((colOpt) => (
                          <button
                            key={colOpt.value}
                            type="button"
                            onClick={() => setModalSettings({ ...modalSettings, defaultGridColumns: colOpt.value })}
                            className={`py-2 px-2 text-center font-bold text-[10px] border cursor-pointer transition-colors ${
                              (modalSettings.defaultGridColumns || (modalSettings.defaultCardCount === 4 ? 4 : 3)) === colOpt.value
                                ? 'bg-[#111110] text-white border-[#111110]'
                                : 'bg-white border-[#DCD7CC] text-[#111110] hover:border-[#111110]'
                            }`}
                          >
                            {colOpt.label}
                          </button>
                        ))}
                      </div>
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

                  {/* Active Drops Roster & Card Quick Management */}
                  <div className="p-4 bg-[#EDEAE2]/30 border border-[#DCD7CC] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-[#111110] flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-[#B82328]" />
                        <span>ACTIVE EDITIONS ROSTER ({allDrops.length} PRODUCTS)</span>
                      </span>
                      <Link
                        href="/admin/drops"
                        target="_blank"
                        className="text-[10px] font-bold text-[#B82328] hover:underline flex items-center gap-1"
                      >
                        <span>OPEN FULL DROPS SUITE</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pt-1">
                      {allDrops.map((drop: any) => (
                        <div
                          key={drop.id}
                          className="p-2.5 bg-white border border-[#DCD7CC] flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative w-9 h-9 bg-[#EDEAE2] border border-[#DCD7CC] flex-shrink-0 overflow-hidden">
                              <NextImage
                                src={drop.primaryImageUrl || '/images/drops/drop-001-front.jpg'}
                                alt={drop.title}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <span className="font-bold text-[#111110] block">{drop.title}</span>
                              <span className="text-[10px] text-[#52504B]">
                                ₹{(drop.pricePaise / 100).toLocaleString('en-IN')} · {drop.totalEditionQty} Units
                              </span>
                            </div>
                          </div>

                          <span
                            className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                              drop.status === 'LIVE'
                                ? 'bg-[#3F4E44] text-white'
                                : drop.status === 'UPCOMING'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-[#EDEAE2] text-[#52504B]'
                            }`}
                          >
                            {drop.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Headings */}
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

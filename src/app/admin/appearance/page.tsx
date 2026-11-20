'use client';

import React, { useState, useEffect } from 'react';
import {
  Palette,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  Plus,
  Layers,
  Sparkles,
} from 'lucide-react';
import { evaluateWcagCompliance } from '@/lib/contrast';

export default function AdminAppearancePage() {
  const [theme, setTheme] = useState<any>({
    canvasColor: '#F7F5F0',
    surfaceColor: '#EDEAE2',
    elevatedColor: '#FCFBF8',
    borderColor: '#DCD7CC',
    inkPrimaryColor: '#111110',
    inkSecondaryColor: '#52504B',
    accentPrimaryColor: '#B82328',
    accentSecondaryColor: '#3F4E44',
    hairlineGrid: true,
    borderRadius: '0px',
    glassmorphism: true,
    logoUrl: '/images/OUTSIDE_icon.png',
    logoDarkUrl: '/images/OUTSIDE_icon.png',
    faviconUrl: '/favicon.ico',
    ogImageUrl: '/images/drops/drop-001-front.jpg',
    presets: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [presetNameInput, setPresetNameInput] = useState('');
  const [previewViewport, setPreviewViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [bypassGuard, setBypassGuard] = useState(false);

  useEffect(() => {
    async function loadTheme() {
      try {
        const res = await fetch('/api/admin/appearance');
        if (res.ok) {
          const data = await res.json();
          if (data.theme) setTheme(data.theme);
        }
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadTheme();
  }, []);

  // Real-time WCAG 2.2 AA Contrast Calculations
  const contrastPrimary = evaluateWcagCompliance(theme.inkPrimaryColor, theme.canvasColor);
  const contrastSecondary = evaluateWcagCompliance(theme.inkSecondaryColor, theme.canvasColor);
  const contrastAccent = evaluateWcagCompliance(theme.accentPrimaryColor, theme.canvasColor);
  const contrastSurface = evaluateWcagCompliance(theme.inkPrimaryColor, theme.surfaceColor);

  const handleColorChange = (key: string, value: string) => {
    setTheme((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/admin/appearance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...theme,
          bypassContrastGuard: bypassGuard,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save theme');
      }

      setSuccessMsg('THEME SAVED // SYNCHRONIZED ACROSS PUBLIC STOREFRONT IN REAL-TIME');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Revert all colors and surface settings to default Sun-Bleached Gallery baseline?')) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/appearance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      const data = await res.json();
      if (res.ok && data.theme) {
        setTheme(data.theme);
        setSuccessMsg('THEME RESTORED TO DEFAULT SUN-BLEACHED GALLERY BASELINE.');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreset = async () => {
    if (!presetNameInput.trim()) return;
    try {
      const res = await fetch('/api/admin/appearance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_preset', presetName: presetNameInput.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.presets) {
        setTheme((prev: any) => ({ ...prev, presets: data.presets }));
        setPresetNameInput('');
        setSuccessMsg(`CUSTOM PRESET "${presetNameInput.trim()}" RECORDED.`);
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleApplyPreset = async (presetId: string) => {
    try {
      const res = await fetch('/api/admin/appearance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'apply_preset', presetId }),
      });
      const data = await res.json();
      if (res.ok && data.theme) {
        setTheme(data.theme);
        setSuccessMsg(`APPLIED PRESET.`);
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  if (loading) {
    return <div className="p-8 font-mono text-xs text-[#52504B]">LOADING LIVE THEME STUDIO...</div>;
  }

  return (
    <div className="space-y-8 font-mono">
      
      {/* Header */}
      <div className="border-b border-[#DCD7CC] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase text-[#B82328] font-bold tracking-[0.25em]">
            DYNAMIC VISUAL GOVERNANCE // ZERO HARDCODED STYLES
          </span>
          <h1 className="text-2xl font-display font-black text-[#111110] uppercase tracking-tight mt-1">
            Live Theme &amp; Color Studio
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-[#EDEAE2] border border-[#DCD7CC] hover:border-[#111110] text-[#111110] text-xs uppercase tracking-wider flex items-center gap-2 font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#B82328]" />
            <span>RESET TO BASELINE</span>
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

      {/* Preset Carousel Bar */}
      <div className="p-4 bg-[#FCFBF8] border border-[#DCD7CC] space-y-3 shadow-editorial">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-[#111110] font-bold tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#B82328]" />
            <span>BRAND THEME PRESETS</span>
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="NEW PRESET NAME"
              value={presetNameInput}
              onChange={(e) => setPresetNameInput(e.target.value)}
              className="bg-[#FCFBF8] border border-[#DCD7CC] px-2.5 py-1 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSavePreset}
              className="px-3 py-1 bg-[#EDEAE2] border border-[#DCD7CC] hover:border-[#111110] text-[#111110] text-xs font-bold uppercase transition-colors cursor-pointer"
            >
              SAVE AS PRESET
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {(theme.presets || []).map((preset: any) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset.id)}
              className="text-left p-3 border border-[#DCD7CC] hover:border-[#111110] bg-[#EDEAE2]/30 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-[#111110] truncate uppercase group-hover:text-[#B82328]">
                  {preset.name}
                </span>
                {preset.isDefault && (
                  <span className="text-[9px] px-1 bg-[#3F4E44]/10 text-[#3F4E44] border border-[#3F4E44]/30 font-bold uppercase">
                    DEFAULT
                  </span>
                )}
              </div>
              <div className="flex gap-1 h-3 rounded-none overflow-hidden border border-[#DCD7CC]">
                <div style={{ backgroundColor: preset.canvasColor }} className="w-1/4" title="Canvas" />
                <div style={{ backgroundColor: preset.surfaceColor }} className="w-1/4" title="Surface" />
                <div style={{ backgroundColor: preset.inkPrimaryColor }} className="w-1/4" title="Ink" />
                <div style={{ backgroundColor: preset.accentPrimaryColor }} className="w-1/4" title="Accent" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Palette Editor & Surface Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Dynamic CSS Variable Color Swatches */}
          <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-6 shadow-editorial">
            <div className="border-b border-[#DCD7CC] pb-3 flex justify-between items-center">
              <h3 className="text-xs uppercase text-[#111110] font-bold tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#B82328]" />
                <span>DYNAMIC COLOR PALETTE TOKENS</span>
              </h3>
              <span className="text-[10px] text-[#52504B]">MAPPED TO CSS VARIABLES</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Canvas Color */}
              <div className="p-3 bg-[#EDEAE2]/30 border border-[#DCD7CC] space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] uppercase text-[#111110] font-bold">--bg-canvas</label>
                  <span className="text-[10px] text-[#52504B] font-mono">{theme.canvasColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.canvasColor}
                    onChange={(e) => handleColorChange('canvasColor', e.target.value)}
                    className="w-10 h-8 border border-[#DCD7CC] cursor-pointer bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={theme.canvasColor}
                    onChange={(e) => handleColorChange('canvasColor', e.target.value)}
                    className="flex-1 bg-[#FCFBF8] border border-[#DCD7CC] px-2.5 py-1 text-xs text-[#111110] font-mono uppercase"
                  />
                </div>
                <p className="text-[10px] text-[#52504B]">Primary background canvas</p>
              </div>

              {/* Surface Color */}
              <div className="p-3 bg-[#EDEAE2]/30 border border-[#DCD7CC] space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] uppercase text-[#111110] font-bold">--bg-surface</label>
                  <span className="text-[10px] text-[#52504B] font-mono">{theme.surfaceColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.surfaceColor}
                    onChange={(e) => handleColorChange('surfaceColor', e.target.value)}
                    className="w-10 h-8 border border-[#DCD7CC] cursor-pointer bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={theme.surfaceColor}
                    onChange={(e) => handleColorChange('surfaceColor', e.target.value)}
                    className="flex-1 bg-[#FCFBF8] border border-[#DCD7CC] px-2.5 py-1 text-xs text-[#111110] font-mono uppercase"
                  />
                </div>
                <p className="text-[10px] text-[#52504B]">Cards, frames, admin sidebar</p>
              </div>

              {/* Elevated Color */}
              <div className="p-3 bg-[#EDEAE2]/30 border border-[#DCD7CC] space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] uppercase text-[#111110] font-bold">--bg-elevated</label>
                  <span className="text-[10px] text-[#52504B] font-mono">{theme.elevatedColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.elevatedColor}
                    onChange={(e) => handleColorChange('elevatedColor', e.target.value)}
                    className="w-10 h-8 border border-[#DCD7CC] cursor-pointer bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={theme.elevatedColor}
                    onChange={(e) => handleColorChange('elevatedColor', e.target.value)}
                    className="flex-1 bg-[#FCFBF8] border border-[#DCD7CC] px-2.5 py-1 text-xs text-[#111110] font-mono uppercase"
                  />
                </div>
                <p className="text-[10px] text-[#52504B]">Headers, drawers, inputs</p>
              </div>

              {/* Border Hairline */}
              <div className="p-3 bg-[#EDEAE2]/30 border border-[#DCD7CC] space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] uppercase text-[#111110] font-bold">--border-hairline</label>
                  <span className="text-[10px] text-[#52504B] font-mono">{theme.borderColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.borderColor}
                    onChange={(e) => handleColorChange('borderColor', e.target.value)}
                    className="w-10 h-8 border border-[#DCD7CC] cursor-pointer bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={theme.borderColor}
                    onChange={(e) => handleColorChange('borderColor', e.target.value)}
                    className="flex-1 bg-[#FCFBF8] border border-[#DCD7CC] px-2.5 py-1 text-xs text-[#111110] font-mono uppercase"
                  />
                </div>
                <p className="text-[10px] text-[#52504B]">Architectural 1px gridlines</p>
              </div>

              {/* Ink Primary */}
              <div className="p-3 bg-[#EDEAE2]/30 border border-[#DCD7CC] space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] uppercase text-[#111110] font-bold">--ink-primary</label>
                  <span className="text-[10px] text-[#52504B] font-mono">{theme.inkPrimaryColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.inkPrimaryColor}
                    onChange={(e) => handleColorChange('inkPrimaryColor', e.target.value)}
                    className="w-10 h-8 border border-[#DCD7CC] cursor-pointer bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={theme.inkPrimaryColor}
                    onChange={(e) => handleColorChange('inkPrimaryColor', e.target.value)}
                    className="flex-1 bg-[#FCFBF8] border border-[#DCD7CC] px-2.5 py-1 text-xs text-[#111110] font-mono uppercase"
                  />
                </div>
                <p className="text-[10px] text-[#52504B]">Headings, primary buttons</p>
              </div>

              {/* Ink Secondary */}
              <div className="p-3 bg-[#EDEAE2]/30 border border-[#DCD7CC] space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] uppercase text-[#111110] font-bold">--ink-secondary</label>
                  <span className="text-[10px] text-[#52504B] font-mono">{theme.inkSecondaryColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.inkSecondaryColor}
                    onChange={(e) => handleColorChange('inkSecondaryColor', e.target.value)}
                    className="w-10 h-8 border border-[#DCD7CC] cursor-pointer bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={theme.inkSecondaryColor}
                    onChange={(e) => handleColorChange('inkSecondaryColor', e.target.value)}
                    className="flex-1 bg-[#FCFBF8] border border-[#DCD7CC] px-2.5 py-1 text-xs text-[#111110] font-mono uppercase"
                  />
                </div>
                <p className="text-[10px] text-[#52504B]">Body prose, technical specs</p>
              </div>

              {/* Accent Primary (Serpent Oxide) */}
              <div className="p-3 bg-[#EDEAE2]/30 border border-[#DCD7CC] space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] uppercase text-[#111110] font-bold">--accent-primary</label>
                  <span className="text-[10px] text-[#52504B] font-mono">{theme.accentPrimaryColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.accentPrimaryColor}
                    onChange={(e) => handleColorChange('accentPrimaryColor', e.target.value)}
                    className="w-10 h-8 border border-[#DCD7CC] cursor-pointer bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={theme.accentPrimaryColor}
                    onChange={(e) => handleColorChange('accentPrimaryColor', e.target.value)}
                    className="flex-1 bg-[#FCFBF8] border border-[#DCD7CC] px-2.5 py-1 text-xs text-[#111110] font-mono uppercase"
                  />
                </div>
                <p className="text-[10px] text-[#52504B]">Serpent oxide, live dot, warnings</p>
              </div>

              {/* Accent Secondary (Oxidized Moss) */}
              <div className="p-3 bg-[#EDEAE2]/30 border border-[#DCD7CC] space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] uppercase text-[#111110] font-bold">--accent-secondary</label>
                  <span className="text-[10px] text-[#52504B] font-mono">{theme.accentSecondaryColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.accentSecondaryColor}
                    onChange={(e) => handleColorChange('accentSecondaryColor', e.target.value)}
                    className="w-10 h-8 border border-[#DCD7CC] cursor-pointer bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={theme.accentSecondaryColor}
                    onChange={(e) => handleColorChange('accentSecondaryColor', e.target.value)}
                    className="flex-1 bg-[#FCFBF8] border border-[#DCD7CC] px-2.5 py-1 text-xs text-[#111110] font-mono uppercase"
                  />
                </div>
                <p className="text-[10px] text-[#52504B]">Oxidized moss, in-stock badges</p>
              </div>

            </div>
          </div>

          {/* Section 2: Surface, Grid & Asset Controls */}
          <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-6 shadow-editorial">
            <div className="border-b border-[#DCD7CC] pb-3">
              <h3 className="text-xs uppercase text-[#111110] font-bold tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#B82328]" />
                <span>SURFACE, GRID &amp; ASSET CONTROLS</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Hairline Gridlines */}
              <div className="p-3 bg-[#EDEAE2]/30 border border-[#DCD7CC] space-y-2">
                <label className="block text-[11px] uppercase text-[#111110] font-bold">
                  SWISS 1PX GRIDLINES
                </label>
                <select
                  value={theme.hairlineGrid ? 'true' : 'false'}
                  onChange={(e) => setTheme({ ...theme, hairlineGrid: e.target.value === 'true' })}
                  className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-2.5 py-1.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none"
                >
                  <option value="true">ENABLED (1px Hairlines)</option>
                  <option value="false">DISABLED (Minimalist)</option>
                </select>
              </div>

              {/* Global Border Radius */}
              <div className="p-3 bg-[#EDEAE2]/30 border border-[#DCD7CC] space-y-2">
                <label className="block text-[11px] uppercase text-[#111110] font-bold">
                  GLOBAL BORDER RADIUS
                </label>
                <select
                  value={theme.borderRadius || '0px'}
                  onChange={(e) => setTheme({ ...theme, borderRadius: e.target.value })}
                  className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-2.5 py-1.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none"
                >
                  <option value="0px">0px (Sharp Architectural)</option>
                  <option value="2px">2px (Subtle Editorial)</option>
                  <option value="4px">4px (Soft Tactile)</option>
                  <option value="8px">8px (Modern Curved)</option>
                </select>
              </div>

              {/* Glassmorphism */}
              <div className="p-3 bg-[#EDEAE2]/30 border border-[#DCD7CC] space-y-2">
                <label className="block text-[11px] uppercase text-[#111110] font-bold">
                  FROSTED GLASSMORPHISM
                </label>
                <select
                  value={theme.glassmorphism ? 'true' : 'false'}
                  onChange={(e) => setTheme({ ...theme, glassmorphism: e.target.value === 'true' })}
                  className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-2.5 py-1.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none"
                >
                  <option value="true">BLUR-MD (12px Frost)</option>
                  <option value="false">OPAQUE (Solid Alabaster)</option>
                </select>
              </div>

            </div>

            {/* Asset URLs */}
            <div className="space-y-3 pt-2">
              <label className="block text-[11px] uppercase text-[#111110] font-bold">
                BRAND ASSET SWAPS
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-[#52504B] block mb-1">HEADER EMBLEM LOGO URL</span>
                  <input
                    type="text"
                    value={theme.logoUrl || ''}
                    onChange={(e) => setTheme({ ...theme, logoUrl: e.target.value })}
                    className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-2.5 py-1.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#52504B] block mb-1">DEFAULT OG SOCIAL SHARE IMAGE</span>
                  <input
                    type="text"
                    value={theme.ogImageUrl || ''}
                    onChange={(e) => setTheme({ ...theme, ogImageUrl: e.target.value })}
                    className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-2.5 py-1.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right: WCAG 2.2 AA Contrast Guard & Live Previewer (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* WCAG 2.2 AA Contrast Guard Card */}
          <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-4 shadow-editorial">
            <div className="border-b border-[#DCD7CC] pb-3 flex justify-between items-center">
              <h3 className="text-xs uppercase text-[#111110] font-bold tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#3F4E44]" />
                <span>WCAG 2.2 AA CONTRAST GUARD</span>
              </h3>
              <span className="text-[9px] px-1.5 py-0.5 bg-[#3F4E44]/10 text-[#3F4E44] border border-[#3F4E44]/30 font-bold uppercase">
                ACTIVE
              </span>
            </div>

            <p className="text-[11px] text-[#52504B] leading-relaxed">
              Real-time mathematical evaluation of relative luminance across all primary color pairings. Prevents inaccessible low-contrast deployments.
            </p>

            <div className="space-y-2.5 text-xs">
              
              {/* Pair 1: Primary Ink on Canvas */}
              <div className="p-2.5 bg-[#EDEAE2]/30 border border-[#DCD7CC] flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#111110]">Primary Ink on Canvas</p>
                  <p className="text-[10px] text-[#52504B]">Headings, manifestos, pricing</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2 py-0.5 font-bold uppercase border ${
                    contrastPrimary.normalTextAA
                      ? 'bg-[#3F4E44]/10 text-[#3F4E44] border-[#3F4E44]/30'
                      : 'bg-[#B82328]/10 text-[#B82328] border-[#B82328]/30'
                  }`}>
                    {contrastPrimary.ratio}:1 {contrastPrimary.rating}
                  </span>
                </div>
              </div>

              {/* Pair 2: Secondary Ink on Canvas */}
              <div className="p-2.5 bg-[#EDEAE2]/30 border border-[#DCD7CC] flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#111110]">Secondary Ink on Canvas</p>
                  <p className="text-[10px] text-[#52504B]">Garment specs, body copy</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2 py-0.5 font-bold uppercase border ${
                    contrastSecondary.largeTextAA
                      ? 'bg-[#3F4E44]/10 text-[#3F4E44] border-[#3F4E44]/30'
                      : 'bg-[#B82328]/10 text-[#B82328] border-[#B82328]/30'
                  }`}>
                    {contrastSecondary.ratio}:1 {contrastSecondary.rating}
                  </span>
                </div>
              </div>

              {/* Pair 3: Primary Ink on Surface */}
              <div className="p-2.5 bg-[#EDEAE2]/30 border border-[#DCD7CC] flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#111110]">Primary Ink on Surface</p>
                  <p className="text-[10px] text-[#52504B]">Bento cards, lookbook labels</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2 py-0.5 font-bold uppercase border ${
                    contrastSurface.normalTextAA
                      ? 'bg-[#3F4E44]/10 text-[#3F4E44] border-[#3F4E44]/30'
                      : 'bg-[#B82328]/10 text-[#B82328] border-[#B82328]/30'
                  }`}>
                    {contrastSurface.ratio}:1 {contrastSurface.rating}
                  </span>
                </div>
              </div>

              {/* Pair 4: Accent on Canvas */}
              <div className="p-2.5 bg-[#EDEAE2]/30 border border-[#DCD7CC] flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#111110]">Accent on Canvas</p>
                  <p className="text-[10px] text-[#52504B]">Live dots, underlines, stock pills</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2 py-0.5 font-bold uppercase border ${
                    contrastAccent.largeTextAA
                      ? 'bg-[#3F4E44]/10 text-[#3F4E44] border-[#3F4E44]/30'
                      : 'bg-[#B82328]/10 text-[#B82328] border-[#B82328]/30'
                  }`}>
                    {contrastAccent.ratio}:1 {contrastAccent.rating}
                  </span>
                </div>
              </div>

            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#DCD7CC] text-[10px]">
              <span className="text-[#52504B]">Override strict contrast block?</span>
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[#B82328]">
                <input
                  type="checkbox"
                  checked={bypassGuard}
                  onChange={(e) => setBypassGuard(e.target.checked)}
                  className="accent-[#B82328]"
                />
                <span>FORCE BYPASS GUARD</span>
              </label>
            </div>
          </div>

          {/* Built-In Responsive Storefront Previewer */}
          <div className="bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-4 shadow-editorial">
            <div className="border-b border-[#DCD7CC] pb-3 flex justify-between items-center">
              <h3 className="text-xs uppercase text-[#111110] font-bold tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#B82328]" />
                <span>RESPONSIVE VIEWPORT PREVIEWER</span>
              </h3>
              
              {/* Viewport Switcher */}
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

            <div className="text-[10px] text-[#52504B] flex justify-between items-center">
              <span>SIMULATED VIEWPORT: {previewViewport.toUpperCase()}</span>
              <a href="/" target="_blank" className="hover:text-[#111110] underline">
                OPEN FULL VIEWPORT &rarr;
              </a>
            </div>

            {/* Embedded Live Preview Frame */}
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
                  src="/"
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

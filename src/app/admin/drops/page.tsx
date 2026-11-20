'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Layers,
  Plus,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2,
  ZoomIn,
  Sparkles,
  RotateCcw,
  Move,
  Sliders,
  Check,
} from 'lucide-react';
import { GarmentHotspot } from '@/components/commerce/interactive-garment-stage';

const DEFAULT_PRESET_HOTSPOTS: GarmentHotspot[] = [
  {
    id: 'hs_embroidery',
    xPercent: 54,
    yPercent: 27,
    zoomLevel: 2.8,
    title: 'Raised Chain-Stitch Floral Embroidery',
    tag: 'HAND-CRAFTED EMBROIDERY (MADE IN INDIA)',
    description:
      'Multi-threaded chocolate umber and rose-pink botanical bloom with cursive "Better Days Ahead" calligraphy. Hand-finished in our Ahmedabad studio to resist wash distortion.',
    spec: 'High-Density Rayon Thread · 12,400 Stitches',
  },
  {
    id: 'hs_fabric',
    xPercent: 30,
    yPercent: 55,
    zoomLevel: 2.5,
    title: '280 GSM Combed Organic French Terry',
    tag: '100% PURE ORGANIC INDIAN COTTON',
    description:
      'Substantial heavyweight in Natural Raw Unbleached Ivory. Double bio-washed for zero shrinkage with a tactile soft-touch interior.',
    spec: '280 GSM · 100% Organic Combed Cotton',
  },
  {
    id: 'hs_stem',
    xPercent: 68,
    yPercent: 51,
    zoomLevel: 3.0,
    title: 'Continuous Braided Stemwork & Cord',
    tag: 'HAND-CRAFTED BOTANICAL DETAIL',
    description:
      'Elongated vertical braided botanical stem anchoring downwards from the flower into the hem, creating architectural visual flow across the torso.',
    spec: 'Braided Rayon Cord · Double-Reinforced Anchor Stitches',
  },
  {
    id: 'hs_tag',
    xPercent: 64,
    yPercent: 76,
    zoomLevel: 2.5,
    title: 'Tethered Canvas Tag Inscription',
    tag: 'LIMITED EDITION SIGNATURE DETAIL',
    description:
      'Elongated knotted dimensional cord anchored into a raw-edge canvas tag debossed with "for a kinder you" and subtle heart emblem.',
    spec: 'Raw Canvas · Double-Reinforced Knot Stitches',
  },
  {
    id: 'hs_sleeve',
    xPercent: 88,
    yPercent: 42,
    zoomLevel: 2.6,
    title: 'Embroidered Sleeve Brand Emblem',
    tag: 'GENUINE OUTSIDE INDIA EMBLEM',
    description:
      'High-definition OUTSIDE obsidian carbon wordmark enclosing the crimson coiled serpent emblem on the left sleeve hem.',
    spec: 'Embroidered Patchwork · Precision Merrow Border',
  },
];

export default function AdminDropsPage() {
  const [drops, setDrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrop, setSelectedDrop] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'HOTSPOTS' | 'INVENTORY'>('HOTSPOTS');
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [testZoomActive, setTestZoomActive] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchDrops() {
      try {
        const res = await fetch('/api/admin/drops');
        if (res.ok) {
          const data = await res.json();
          setDrops(data);
          const first = data[0] || null;
          if (first) {
            if (!first.hotspots || first.hotspots.length === 0) {
              first.hotspots = DEFAULT_PRESET_HOTSPOTS;
            }
            setSelectedDrop(first);
            setSelectedHotspotId(first.hotspots[0]?.id || null);
          }
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDrops();
  }, []);

  const handleSelectDrop = (drop: any) => {
    const d = { ...drop };
    if (!d.hotspots || d.hotspots.length === 0) {
      d.hotspots = DEFAULT_PRESET_HOTSPOTS;
    }
    setSelectedDrop(d);
    setSelectedHotspotId(d.hotspots[0]?.id || null);
    setTestZoomActive(false);
  };

  const handleUpdateStock = (variantId: string, newStock: number) => {
    if (!selectedDrop) return;
    const updatedVariants = selectedDrop.variants.map((v: any) =>
      v.id === variantId ? { ...v, currentStock: Math.max(0, newStock) } : v
    );
    setSelectedDrop({ ...selectedDrop, variants: updatedVariants });
  };

  // Hotspot Operations
  const currentHotspots: GarmentHotspot[] = selectedDrop?.hotspots || [];
  const activeHotspot = currentHotspots.find((h) => h.id === selectedHotspotId) || currentHotspots[0] || null;

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !selectedDrop) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round((((e.clientX - rect.left) / rect.width) * 100) * 10) / 10;
    const y = Math.round((((e.clientY - rect.top) / rect.height) * 100) * 10) / 10;

    const clampedX = Math.max(2, Math.min(98, x));
    const clampedY = Math.max(2, Math.min(98, y));

    if (activeHotspot) {
      // Reposition current selected hotspot
      const updated = currentHotspots.map((h) =>
        h.id === activeHotspot.id ? { ...h, xPercent: clampedX, yPercent: clampedY } : h
      );
      setSelectedDrop({ ...selectedDrop, hotspots: updated });
    } else {
      // Create a new hotspot at clicked point
      const newId = `hs_${Date.now()}`;
      const newHotspot: GarmentHotspot = {
        id: newId,
        xPercent: clampedX,
        yPercent: clampedY,
        zoomLevel: 2.5,
        title: 'New Craft Hotspot',
        tag: 'ATELIER DETAIL',
        description: 'Detail specification description of the garment craft and construction.',
        spec: 'Hand-Finished Craftsmanship',
      };
      setSelectedDrop({
        ...selectedDrop,
        hotspots: [...currentHotspots, newHotspot],
      });
      setSelectedHotspotId(newId);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round((((e.clientX - rect.left) / rect.width) * 100) * 10) / 10;
    const y = Math.round((((e.clientY - rect.top) / rect.height) * 100) * 10) / 10;
    setHoverCoord({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleUpdateActiveHotspot = (fields: Partial<GarmentHotspot>) => {
    if (!activeHotspot || !selectedDrop) return;
    const updated = currentHotspots.map((h) =>
      h.id === activeHotspot.id ? { ...h, ...fields } : h
    );
    setSelectedDrop({ ...selectedDrop, hotspots: updated });
  };

  const handleAddHotspot = () => {
    if (!selectedDrop) return;
    const newId = `hs_${Date.now()}`;
    const newHotspot: GarmentHotspot = {
      id: newId,
      xPercent: 50,
      yPercent: 50,
      zoomLevel: 2.5,
      title: 'New Craft Hotspot',
      tag: 'ATELIER DETAIL',
      description: 'Hand-crafted garment spec and artisan finish.',
      spec: 'Custom-Milled Detail',
    };
    setSelectedDrop({
      ...selectedDrop,
      hotspots: [...currentHotspots, newHotspot],
    });
    setSelectedHotspotId(newId);
  };

  const handleDeleteHotspot = (id: string) => {
    if (!selectedDrop) return;
    const updated = currentHotspots.filter((h) => h.id !== id);
    setSelectedDrop({ ...selectedDrop, hotspots: updated });
    if (selectedHotspotId === id) {
      setSelectedHotspotId(updated[0]?.id || null);
    }
  };

  const handleResetDefaultHotspots = () => {
    if (!selectedDrop) return;
    setSelectedDrop({ ...selectedDrop, hotspots: DEFAULT_PRESET_HOTSPOTS });
    setSelectedHotspotId(DEFAULT_PRESET_HOTSPOTS[0].id);
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

      const updated = await res.json();
      setDrops((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      setSelectedDrop(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
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
      <div className="border-b border-[#DCD7CC] pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase text-[#B82328] font-bold tracking-[0.25em]">
            DROP ENGINE &amp; CRAFT GOVERNANCE
          </span>
          <h1 className="text-2xl font-display font-black text-[#111110] uppercase tracking-tight mt-1">
            Drop &amp; Hotspot Studio
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

          <button
            onClick={handleSaveDrop}
            className="px-5 py-2.5 bg-[#111110] hover:bg-[#B82328] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE DROP &amp; HOTSPOTS</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-[#3F4E44]/10 border border-[#3F4E44] text-[#3F4E44] text-xs flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-[#3F4E44]" />
          <span>DROP SPECIFICATIONS &amp; CRAFT HOTSPOTS COMMITTED SUCCESSFULLY.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-[#B82328]/10 border border-[#B82328] text-[#B82328] text-xs flex items-center gap-2 font-bold">
          <AlertCircle className="w-4 h-4 text-[#B82328]" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editions List */}
        <div className="lg:col-span-3 bg-[#FCFBF8] border border-[#DCD7CC] p-4 space-y-3 shadow-editorial">
          <h3 className="text-xs uppercase text-[#52504B] px-2 py-1 font-bold">
            EDITIONS LIST ({drops.length})
          </h3>
          <div className="space-y-2">
            {drops.map((drop) => (
              <button
                key={drop.id}
                onClick={() => handleSelectDrop(drop)}
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
                  Hotspots: {drop.hotspots?.length || 5} pins · ₹{(drop.pricePaise / 100).toLocaleString('en-IN')}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Drop Editor */}
        {selectedDrop && (
          <div className="lg:col-span-9 bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-6 shadow-editorial">
            <div className="flex flex-wrap justify-between items-center border-b border-[#DCD7CC] pb-4 gap-4">
              <div>
                <h3 className="text-sm font-bold text-[#111110] uppercase">
                  EDITING {selectedDrop.title}
                </h3>
                <p className="text-[11px] text-[#52504B] font-mono">
                  SLUG: {selectedDrop.slug} // {selectedDrop.status}
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="flex border border-[#DCD7CC] bg-[#EDEAE2]/50 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('HOTSPOTS')}
                  className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeTab === 'HOTSPOTS'
                      ? 'bg-[#111110] text-white shadow-sm'
                      : 'text-[#52504B] hover:text-[#111110]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#B82328]" />
                  <span>HOTSPOT STUDIO ({currentHotspots.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('INVENTORY')}
                  className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeTab === 'INVENTORY'
                      ? 'bg-[#111110] text-white shadow-sm'
                      : 'text-[#52504B] hover:text-[#111110]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-[#52504B]" />
                  <span>LIFECYCLE &amp; INVENTORY</span>
                </button>
              </div>
            </div>

            {/* TAB 1: CRAFT HOTSPOTS & CLICK ZOOM STUDIO */}
            {activeTab === 'HOTSPOTS' && (
              <div className="space-y-6">
                <div className="bg-[#EDEAE2]/30 border border-[#DCD7CC] p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-[#111110] uppercase flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#B82328]" />
                      <span>VISUAL CLICK-TO-POSITION &amp; MACRO ZOOM ENGINE</span>
                    </h4>
                    <p className="text-[11px] text-[#52504B] mt-0.5 font-sans">
                      Click directly on the garment preview below to position or reposition pins. Each pin triggers a smooth macro zoom on the storefront.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAddHotspot}
                      className="px-3 py-1.5 bg-[#111110] hover:bg-[#B82328] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD NEW PIN</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetDefaultHotspots}
                      className="px-3 py-1.5 bg-[#FCFBF8] border border-[#DCD7CC] text-[#52504B] hover:text-[#111110] text-[10px] font-bold uppercase tracking-wider transition-colors"
                    >
                      RESET DEFAULTS
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left: Interactive Canvas */}
                  <div className="lg:col-span-6 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#52504B] font-bold uppercase">
                      <span>GARMENT PLACEMENT CANVAS</span>
                      <button
                        type="button"
                        onClick={() => setTestZoomActive(!testZoomActive)}
                        className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider transition-all border flex items-center gap-1.5 ${
                          testZoomActive
                            ? 'bg-[#B82328] text-white border-[#B82328]'
                            : 'bg-[#EDEAE2] text-[#111110] border-[#DCD7CC]'
                        }`}
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>{testZoomActive ? 'EXIT PREVIEW ZOOM' : 'TEST MACRO ZOOM'}</span>
                      </button>
                    </div>

                    <div
                      ref={canvasRef}
                      onClick={handleCanvasClick}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseLeave={() => setHoverCoord(null)}
                      className="relative aspect-[4/5] bg-[#EDEAE2]/50 border-2 border-[#DCD7CC] overflow-hidden cursor-crosshair group shadow-inner"
                      title="Click anywhere to position selected pin"
                    >
                      {/* Zoomable Container */}
                      <div
                        className="w-full h-full relative transition-transform duration-500 ease-out"
                        style={{
                          transformOrigin:
                            testZoomActive && activeHotspot
                              ? `${activeHotspot.xPercent}% ${activeHotspot.yPercent}%`
                              : '50% 50%',
                          transform:
                            testZoomActive && activeHotspot
                              ? `scale(${activeHotspot.zoomLevel || 2.5})`
                              : 'scale(1)',
                        }}
                      >
                        <Image
                          src={selectedDrop.primaryImageUrl || '/images/drops/drop-001-front.jpg'}
                          alt={selectedDrop.title}
                          fill
                          priority
                          sizes="400px"
                          className="object-contain p-4 select-none pointer-events-none"
                        />

                        {/* Placed Pins */}
                        {currentHotspots.map((hotspot, idx) => {
                          const isSelected = activeHotspot?.id === hotspot.id;
                          const counterScale = testZoomActive && activeHotspot ? 1 / (activeHotspot.zoomLevel || 2.5) : 1;

                          return (
                            <div
                              key={hotspot.id}
                              style={{
                                left: `${hotspot.xPercent}%`,
                                top: `${hotspot.yPercent}%`,
                              }}
                              className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedHotspotId(hotspot.id);
                                }}
                                style={{
                                  transform: `scale(${counterScale})`,
                                  transformOrigin: 'center center',
                                }}
                                className={`group p-1 focus:outline-none transition-all flex items-center justify-center ${
                                  isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                                }`}
                              >
                                {isSelected && (
                                  <span className="absolute inset-0 rounded-full bg-[#B82328]/40 animate-ping pointer-events-none" />
                                )}
                                <span
                                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md border-2 ${
                                    isSelected
                                      ? 'bg-[#B82328] text-white border-white ring-2 ring-[#B82328]'
                                      : 'bg-[#FCFBF8] text-[#111110] border-[#B82328]'
                                  }`}
                                >
                                  {idx + 1}
                                </span>
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Canvas HUD Overlay */}
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center pointer-events-none text-[9px] bg-[#FCFBF8]/90 backdrop-blur-sm px-2 py-1 border border-[#DCD7CC]">
                        <span className="text-[#52504B]">
                          {hoverCoord ? `CURSOR: X: ${hoverCoord.x}% · Y: ${hoverCoord.y}%` : 'CLICK TO PLACE PIN'}
                        </span>
                        {activeHotspot && (
                          <span className="text-[#B82328] font-bold">
                            PIN #{currentHotspots.findIndex((h) => h.id === activeHotspot.id) + 1} AT ({activeHotspot.xPercent}%, {activeHotspot.yPercent}%)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Selected Pin Editor & Configurator */}
                  <div className="lg:col-span-6 space-y-4">
                    {/* Hotspot Pin Selector Tabs */}
                    <div className="flex flex-wrap gap-1.5 border-b border-[#DCD7CC] pb-3">
                      {currentHotspots.map((hotspot, idx) => {
                        const isSelected = activeHotspot?.id === hotspot.id;
                        return (
                          <button
                            key={hotspot.id}
                            type="button"
                            onClick={() => setSelectedHotspotId(hotspot.id)}
                            className={`px-2.5 py-1 text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 border ${
                              isSelected
                                ? 'bg-[#111110] text-white border-[#111110] shadow-sm'
                                : 'bg-[#EDEAE2]/50 text-[#52504B] border-[#DCD7CC] hover:text-[#111110]'
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-[#B82328] text-white text-[9px] flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="max-w-[120px] truncate">{hotspot.title || `Pin ${idx + 1}`}</span>
                          </button>
                        );
                      })}
                    </div>

                    {activeHotspot ? (
                      <div className="space-y-4 bg-[#EDEAE2]/20 border border-[#DCD7CC] p-4">
                        <div className="flex items-center justify-between border-b border-[#DCD7CC] pb-2">
                          <span className="text-xs uppercase font-bold text-[#111110]">
                            EDITING PIN #{currentHotspots.findIndex((h) => h.id === activeHotspot.id) + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteHotspot(activeHotspot.id)}
                            className="text-[#B82328] hover:text-black text-[10px] uppercase font-bold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>DELETE PIN</span>
                          </button>
                        </div>

                        {/* Coordinates Sliders */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex justify-between text-[11px] font-bold text-[#52504B] mb-1">
                              <span>X COORDINATE (HORIZONTAL)</span>
                              <span className="text-[#111110] font-mono">{activeHotspot.xPercent}%</span>
                            </div>
                            <input
                              type="range"
                              min="2"
                              max="98"
                              step="0.5"
                              value={activeHotspot.xPercent}
                              onChange={(e) =>
                                handleUpdateActiveHotspot({ xPercent: parseFloat(e.target.value) })
                              }
                              className="w-full accent-[#B82328] cursor-pointer"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] font-bold text-[#52504B] mb-1">
                              <span>Y COORDINATE (VERTICAL)</span>
                              <span className="text-[#111110] font-mono">{activeHotspot.yPercent}%</span>
                            </div>
                            <input
                              type="range"
                              min="2"
                              max="98"
                              step="0.5"
                              value={activeHotspot.yPercent}
                              onChange={(e) =>
                                handleUpdateActiveHotspot({ yPercent: parseFloat(e.target.value) })
                              }
                              className="w-full accent-[#B82328] cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Zoom Level Selector */}
                        <div>
                          <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                            MAGNIFICATION ZOOM LEVEL ON CLICK
                          </label>
                          <div className="grid grid-cols-5 gap-1.5">
                            {[1.5, 2.0, 2.5, 2.8, 3.0].map((level) => (
                              <button
                                key={level}
                                type="button"
                                onClick={() => handleUpdateActiveHotspot({ zoomLevel: level })}
                                className={`py-1.5 text-xs font-mono font-bold border text-center transition-all ${
                                  activeHotspot.zoomLevel === level
                                    ? 'bg-[#B82328] text-white border-[#B82328]'
                                    : 'bg-[#FCFBF8] text-[#111110] border-[#DCD7CC] hover:border-[#111110]'
                                }`}
                              >
                                {level.toFixed(1)}×
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-[#52504B] mt-1">
                            Higher levels (2.8×–3.0×) focus sharply on intricate stitchwork, micro-labels, and fabric loops.
                          </p>
                        </div>

                        {/* Craft Tag */}
                        <div>
                          <label className="block text-[11px] uppercase text-[#52504B] mb-1 font-bold">
                            CATEGORY / CRAFT TAG
                          </label>
                          <input
                            type="text"
                            value={activeHotspot.tag}
                            onChange={(e) => handleUpdateActiveHotspot({ tag: e.target.value })}
                            placeholder="e.g. HAND-CRAFTED ATELIER EMBROIDERY"
                            className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3 py-1.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none"
                          />
                        </div>

                        {/* Title */}
                        <div>
                          <label className="block text-[11px] uppercase text-[#52504B] mb-1 font-bold">
                            CRAFT TITLE
                          </label>
                          <input
                            type="text"
                            value={activeHotspot.title}
                            onChange={(e) => handleUpdateActiveHotspot({ title: e.target.value })}
                            placeholder="e.g. Raised Chain-Stitch Floral Embroidery"
                            className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3 py-1.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none font-bold"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-[11px] uppercase text-[#52504B] mb-1 font-bold">
                            CRAFT STORY &amp; CONSTRUCTION DETAIL
                          </label>
                          <textarea
                            rows={3}
                            value={activeHotspot.description}
                            onChange={(e) => handleUpdateActiveHotspot({ description: e.target.value })}
                            placeholder="Detailed description of the craft technique..."
                            className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3 py-1.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none font-sans"
                          />
                        </div>

                        {/* Spec */}
                        <div>
                          <label className="block text-[11px] uppercase text-[#52504B] mb-1 font-bold">
                            TECHNICAL SPECIFICATION BAR
                          </label>
                          <input
                            type="text"
                            value={activeHotspot.spec}
                            onChange={(e) => handleUpdateActiveHotspot({ spec: e.target.value })}
                            placeholder="e.g. High-Density Rayon Thread · 12,400 Stitches"
                            className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3 py-1.5 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-xs text-[#52504B] border border-dashed border-[#DCD7CC]">
                        No pin selected. Click on the canvas or "ADD NEW PIN" to start configuring.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LIFECYCLE, PRICING & INVENTORY */}
            {activeTab === 'INVENTORY' && (
              <div className="space-y-6">
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
        )}
      </div>
    </div>
  );
}

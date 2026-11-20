'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Maximize2,
  Minimize2,
  ZoomIn,
  RotateCcw,
  Check,
  X,
  ChevronRight,
  Layers,
} from 'lucide-react';

export interface GarmentHotspot {
  id: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  zoomLevel: number; // 1.5 - 3.5
  title: string;
  tag: string;
  description: string;
  spec: string;
}

export const FALLBACK_HOTSPOTS: GarmentHotspot[] = [
  {
    id: 'hs_embroidery',
    xPercent: 54,
    yPercent: 27,
    zoomLevel: 2.8,
    title: 'Raised Chain-Stitch Floral Embroidery',
    tag: 'HAND-CRAFTED ATELIER EMBROIDERY',
    description:
      'Multi-threaded chocolate umber and rose-pink botanical bloom with cursive "Better Days Ahead" calligraphy. Hand-finished in our Ahmedabad atelier to resist wash distortion.',
    spec: 'High-Density Rayon Thread · 12,400 Stitches',
  },
  {
    id: 'hs_fabric',
    xPercent: 30,
    yPercent: 55,
    zoomLevel: 2.5,
    title: '280 GSM Combed Organic French Terry',
    tag: 'CUSTOM-MILLED IN GUJARAT (24)',
    description:
      'Substantial architectural weight in Natural Raw Unbleached Ivory. Double bio-washed for zero shrinkage with a tactile soft-touch loopback interior.',
    spec: '280 GSM · 100% Organic Combed Cotton',
  },
  {
    id: 'hs_stem',
    xPercent: 68,
    yPercent: 51,
    zoomLevel: 3.0,
    title: 'Continuous Braided Stemwork & Cord',
    tag: 'DIMENSIONAL BOTANICAL CRAFT',
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
    tag: 'SERIALIZED SIGNATURE DETAIL',
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
    tag: 'OFFICIAL OUTSIDE MARK',
    description:
      'High-definition OUTSIDE obsidian carbon wordmark enclosing the crimson coiled serpent emblem on the left sleeve hem.',
    spec: 'Embroidered Patchwork · Precision Merrow Border',
  },
];

interface InteractiveGarmentStageProps {
  primaryImageUrl: string;
  galleryUrls?: string[];
  dropTitle: string;
  dropNumber: number;
  hotspots?: GarmentHotspot[];
}

export function InteractiveGarmentStage({
  primaryImageUrl,
  galleryUrls = [],
  dropTitle,
  dropNumber,
  hotspots,
}: InteractiveGarmentStageProps) {
  // Available Angles
  const angles = [
    { id: 'front', label: '01 // FRONT', src: primaryImageUrl || '/images/drops/drop-001-front.jpg' },
    { id: 'back', label: '02 // BACK', src: galleryUrls[1] || '/images/drops/drop-001-back.jpg' },
    { id: 'embroidery', label: '03 // EMBROIDERY', src: '/images/drops/drop-001-detail1.jpg' },
    { id: 'tag', label: '04 // CANVAS TAG', src: '/images/drops/drop-001-detail2.jpg' },
  ];

  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [showHotspots, setShowHotspots] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  const currentAngle = angles[activeAngleIndex];
  const isFrontAngle = activeAngleIndex === 0;

  const activeHotspotList = (hotspots && hotspots.length > 0) ? hotspots : FALLBACK_HOTSPOTS;
  const activeHotspot = activeHotspotList.find((h) => h.id === activeHotspotId) || null;

  const currentZoomScale = activeHotspot ? (activeHotspot.zoomLevel || 2.5) : 1;
  const currentOriginX = activeHotspot ? activeHotspot.xPercent : 50;
  const currentOriginY = activeHotspot ? activeHotspot.yPercent : 50;

  const handleToggleHotspot = (hotspot: GarmentHotspot) => {
    if (activeHotspotId === hotspot.id) {
      setActiveHotspotId(null);
    } else {
      setActiveHotspotId(hotspot.id);
    }
  };

  const handleResetZoom = () => {
    setActiveHotspotId(null);
  };

  const handleNextHotspot = () => {
    if (!activeHotspotList.length) return;
    const currentIndex = activeHotspotList.findIndex((h) => h.id === activeHotspotId);
    const nextIndex = (currentIndex + 1) % activeHotspotList.length;
    setActiveHotspotId(activeHotspotList[nextIndex].id);
  };

  return (
    <div className="space-y-4 font-mono select-none">
      {/* Main High-Fidelity Garment Stage */}
      <div
        ref={containerRef}
        className="relative aspect-[4/5] bg-[#EDEAE2]/50 border border-[#DCD7CC] overflow-hidden group shadow-luxury"
      >
        {/* Transforming Zoom Container */}
        <div
          className="w-full h-full relative transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
          style={{
            transformOrigin: `${currentOriginX}% ${currentOriginY}%`,
            transform: `scale(${currentZoomScale})`,
          }}
        >
          {/* Garment Image */}
          <div className="w-full h-full relative">
            <Image
              src={currentAngle.src}
              alt={`${dropTitle} - ${currentAngle.label}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-4 md:p-6 select-none pointer-events-none"
            />
          </div>

          {/* Interactive Hotspot Pins (Moving synchronously with Garment Coordinates) */}
          {isFrontAngle &&
            showHotspots &&
            activeHotspotList.map((hotspot) => {
              const isActive = activeHotspot?.id === hotspot.id;
              const isAnyActive = !!activeHotspot;
              // Counter-scale so the pin circle stays sharp and uniformly sized
              const counterScale = isAnyActive ? 1 / currentZoomScale : 1;

              return (
                <div
                  key={hotspot.id}
                  style={{
                    left: `${hotspot.xPercent}%`,
                    top: `${hotspot.yPercent}%`,
                  }}
                  className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
                    isAnyActive && !isActive ? 'opacity-40 hover:opacity-100' : 'opacity-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleHotspot(hotspot);
                    }}
                    style={{
                      transform: `scale(${counterScale})`,
                      transformOrigin: 'center center',
                    }}
                    className="relative group p-1.5 focus:outline-none cursor-pointer flex items-center justify-center transition-transform"
                    aria-label={hotspot.title}
                  >
                    {/* Pulsing ring on inactive pins */}
                    {!isActive && (
                      <span className="absolute inset-0 rounded-full bg-[#B82328]/35 animate-ping opacity-80 pointer-events-none" />
                    )}

                    {/* Circular Pin Icon matching User's Spec: White Disc + Crimson Ring + Dark/Red Symbol */}
                    <span
                      className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-luxury border-2 ${
                        isActive
                          ? 'bg-[#B82328] text-white border-white scale-110 ring-2 ring-[#B82328]'
                          : 'bg-[#FCFBF8] text-[#111110] border-[#B82328] hover:border-[#111110] hover:scale-115'
                      }`}
                    >
                      {isActive ? '−' : '+'}
                    </span>
                  </button>
                </div>
              );
            })}
        </div>

        {/* Top Floating Edition Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
          <div className="bg-[#FCFBF8]/95 backdrop-blur-sm border border-[#DCD7CC] px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-[#111110] shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B82328]" />
            <span>DROP 00{dropNumber} // SERIAL EDITION OF 250</span>
          </div>
          {activeHotspot ? (
            <div className="bg-[#B82328] text-white px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold w-fit flex items-center gap-1 shadow-sm">
              <ZoomIn className="w-3 h-3" />
              <span>MACRO ZOOM: {currentZoomScale.toFixed(1)}× FOCAL LOCK</span>
            </div>
          ) : (
            <div className="bg-[#111110] text-white px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold w-fit">
              280 GSM FRENCH TERRY
            </div>
          )}
        </div>

        {/* Top Right Tool Action Toggles */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
          {activeHotspot && (
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-3 py-1 bg-[#111110] hover:bg-[#B82328] text-white text-[10px] uppercase font-bold tracking-wider transition-colors border border-[#111110] shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET (1.0×)</span>
            </button>
          )}

          {isFrontAngle && (
            <button
              type="button"
              onClick={() => setShowHotspots(!showHotspots)}
              className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider transition-all border shadow-sm flex items-center gap-1.5 cursor-pointer ${
                showHotspots
                  ? 'bg-[#111110] text-white border-[#111110]'
                  : 'bg-[#FCFBF8]/90 text-[#52504B] border-[#DCD7CC] hover:text-[#111110]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#B82328]" />
              <span>{showHotspots ? 'HIDE PINS' : 'SHOW PINS'}</span>
            </button>
          )}
        </div>

        {/* Fixed Viewport Bottom Dock: Active Hotspot Craft Card */}
        {activeHotspot && (
          <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 z-30 bg-[#FCFBF8]/98 backdrop-blur-md border-2 border-[#111110] p-4 text-left shadow-2xl space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start justify-between gap-3 border-b border-[#DCD7CC] pb-2">
              <div>
                <span className="text-[9px] font-bold text-[#B82328] uppercase tracking-widest block font-mono">
                  {activeHotspot.tag}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-[#111110] uppercase font-display leading-tight mt-0.5">
                  {activeHotspot.title}
                </h4>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleNextHotspot}
                  className="px-2 py-1 bg-[#EDEAE2] hover:bg-[#DCD7CC] text-[10px] text-[#111110] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                  title="Next craft hotspot"
                >
                  <span>NEXT</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="text-[#52504B] hover:text-[#111110] p-1 cursor-pointer transition-colors"
                  aria-label="Close craft zoom"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-[11px] sm:text-xs text-[#52504B] font-sans leading-relaxed">
              {activeHotspot.description}
            </p>

            <div className="pt-2 border-t border-[#DCD7CC] flex flex-wrap items-center justify-between gap-2 text-[9px] font-mono">
              <span className="text-[#111110] font-bold uppercase">
                SPEC: {activeHotspot.spec}
              </span>
              <span className="text-[#B82328] font-bold">
                ZOOM LEVEL: {currentZoomScale.toFixed(1)}×
              </span>
            </div>
          </div>
        )}

        {/* Bottom Left Angle Watermark */}
        {!activeHotspot && (
          <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
            <span className="text-[10px] text-[#52504B] font-bold tracking-widest uppercase bg-[#FCFBF8]/90 px-2 py-0.5 border border-[#DCD7CC]">
              {currentAngle.label}
            </span>
          </div>
        )}

        {/* Non-Zoomed Helper Pill */}
        {!activeHotspot && isFrontAngle && showHotspots && (
          <div className="absolute bottom-4 right-4 z-20 pointer-events-none hidden sm:flex items-center gap-1.5 bg-[#FCFBF8]/95 border border-[#DCD7CC] px-2.5 py-1 text-[9px] text-[#111110] font-bold uppercase tracking-wider shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B82328]" />
            <span>CLICK ANY PIN TO ZOOM (2.5×–3.0×)</span>
          </div>
        )}
      </div>

      {/* Thumbnail Selector Strip */}
      <div className="grid grid-cols-4 gap-2.5">
        {angles.map((angle, idx) => {
          const isSelected = activeAngleIndex === idx;
          return (
            <button
              key={angle.id}
              type="button"
              onClick={() => {
                setActiveAngleIndex(idx);
                setActiveHotspotId(null);
              }}
              className={`relative aspect-[4/5] bg-[#EDEAE2]/40 border transition-all overflow-hidden p-1 group cursor-pointer ${
                isSelected
                  ? 'border-2 border-[#111110] ring-1 ring-[#111110] bg-[#FCFBF8]'
                  : 'border-[#DCD7CC] hover:border-[#111110]/60'
              }`}
            >
              <Image
                src={angle.src}
                alt={angle.label}
                fill
                className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-1 inset-x-1 text-center bg-[#FCFBF8]/90 text-[8px] font-bold text-[#111110] tracking-wider uppercase py-0.5 border border-[#DCD7CC]/60 truncate">
                {angle.label.split('//')[1]?.trim() || angle.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

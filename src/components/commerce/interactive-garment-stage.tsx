'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Maximize2,
  ZoomIn,
  Eye,
  Info,
  Check,
  Layers,
  ShieldCheck,
  X,
} from 'lucide-react';

interface Hotspot {
  id: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  title: string;
  tag: string;
  description: string;
  spec: string;
}

const FRONT_HOTSPOTS: Hotspot[] = [
  {
    id: 'embroidery',
    xPercent: 68,
    yPercent: 28,
    title: 'Raised Chain-Stitch Floral Embroidery',
    tag: 'HAND-CRAFTED ATELIER EMBROIDERY',
    description:
      'Multi-threaded crimson and rose-pink floral head with botanical stemwork reading "Better Days Ahead". Hand-finished in our Ahmedabad atelier to resist wash distortion.',
    spec: 'High-Density Rayon Thread · 12,400 Stitches',
  },
  {
    id: 'fabric',
    xPercent: 32,
    yPercent: 44,
    title: '280 GSM Combed Organic French Terry',
    tag: 'CUSTOM-MILLED IN GUJARAT (24)',
    description:
      'Substantial architectural weight in Natural Raw Unbleached Ivory. Double bio-washed for zero shrinkage with a tactile soft-touch loopback interior.',
    spec: '280 GSM · 100% Organic Combed Cotton',
  },
  {
    id: 'tag',
    xPercent: 64,
    yPercent: 74,
    title: 'Tethered Canvas Tag Inscription',
    tag: 'SERIALIZED SIGNATURE DETAIL',
    description:
      'Elongated knotted dimensional cord anchored into a raw-edge canvas tag debossed with "for a kinder you" and subtle heart emblem.',
    spec: 'Raw Canvas · Double-Reinforced Knot Stitches',
  },
  {
    id: 'sleeve',
    xPercent: 88,
    yPercent: 42,
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
}

export function InteractiveGarmentStage({
  primaryImageUrl,
  galleryUrls = [],
  dropTitle,
  dropNumber,
}: InteractiveGarmentStageProps) {
  // Available Angles
  const angles = [
    { id: 'front', label: '01 // FRONT', src: primaryImageUrl || '/images/drops/drop-001-front.jpg' },
    { id: 'back', label: '02 // BACK', src: galleryUrls[1] || '/images/drops/drop-001-back.jpg' },
    { id: 'embroidery', label: '03 // EMBROIDERY', src: '/images/drops/drop-001-detail1.jpg' },
    { id: 'tag', label: '04 // CANVAS TAG', src: '/images/drops/drop-001-detail2.jpg' },
  ];

  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [showHotspots, setShowHotspots] = useState(true);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const currentAngle = angles[activeAngleIndex];
  const isFrontAngle = activeAngleIndex === 0;

  return (
    <div className="space-y-4 font-mono select-none">
      {/* Main High-Fidelity Garment Stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        className="relative aspect-[4/5] bg-[#EDEAE2]/50 border border-[#DCD7CC] overflow-hidden group shadow-luxury cursor-crosshair"
      >
        {/* Background Image / Normal View */}
        <div
          className={`w-full h-full relative transition-transform duration-200 ${
            isZooming ? 'scale-100' : 'scale-100'
          }`}
        >
          <Image
            src={currentAngle.src}
            alt={`${dropTitle} - ${currentAngle.label}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`object-contain p-4 md:p-6 transition-all duration-300 ${
              isZooming ? 'opacity-0 md:opacity-0' : 'opacity-100'
            }`}
          />
        </div>

        {/* Desktop Macro Zoom Lens Overlay */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-200 overflow-hidden ${
            isZooming ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${currentAngle.src})`,
            backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
            backgroundSize: '240%',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Top Floating Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
          <div className="bg-[#FCFBF8]/95 backdrop-blur-sm border border-[#DCD7CC] px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-[#111110] shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B82328]" />
            <span>DROP 00{dropNumber} // SERIAL EDITION OF 250</span>
          </div>
          <div className="bg-[#111110] text-white px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold w-fit">
            280 GSM FRENCH TERRY
          </div>
        </div>

        {/* Top Right Tool Action Toggles */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
          {isFrontAngle && (
            <button
              type="button"
              onClick={() => setShowHotspots(!showHotspots)}
              className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider transition-all border shadow-sm flex items-center gap-1.5 ${
                showHotspots
                  ? 'bg-[#111110] text-white border-[#111110]'
                  : 'bg-[#FCFBF8]/90 text-[#52504B] border-[#DCD7CC] hover:text-[#111110]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#B82328]" />
              <span>{showHotspots ? 'HIDE HOTSPOTS' : 'SHOW HOTSPOTS'}</span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-1 bg-[#FCFBF8]/90 backdrop-blur-sm border border-[#DCD7CC] px-2.5 py-1 text-[9px] text-[#52504B] uppercase tracking-wider font-bold">
            <ZoomIn className="w-3 h-3 text-[#111110]" />
            <span>HOVER TO LENS ZOOM</span>
          </div>
        </div>

        {/* Interactive Hotspot Pins (Only on Front View) */}
        {isFrontAngle &&
          showHotspots &&
          FRONT_HOTSPOTS.map((hotspot) => {
            const isActive = activeHotspot?.id === hotspot.id;
            return (
              <div
                key={hotspot.id}
                style={{
                  left: `${hotspot.xPercent}%`,
                  top: `${hotspot.yPercent}%`,
                }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              >
                {/* Pulsing Pin Button */}
                <button
                  type="button"
                  onClick={() => setActiveHotspot(isActive ? null : hotspot)}
                  className="relative group p-2 focus:outline-none cursor-pointer"
                  aria-label={hotspot.title}
                >
                  <span className="absolute inset-0 rounded-full bg-[#B82328]/30 animate-ping opacity-75" />
                  <span
                    className={`relative w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] transition-all shadow-md border ${
                      isActive
                        ? 'bg-[#B82328] text-white border-white scale-125'
                        : 'bg-[#FCFBF8] text-[#111110] border-[#B82328] hover:scale-110'
                    }`}
                  >
                    +
                  </span>
                </button>

                {/* Hotspot Popover Card */}
                {isActive && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 bg-[#FCFBF8] border-2 border-[#111110] p-4 text-left shadow-2xl z-30 space-y-2 pointer-events-auto">
                    <div className="flex items-start justify-between gap-2 border-b border-[#DCD7CC] pb-2">
                      <div>
                        <span className="text-[9px] font-bold text-[#B82328] uppercase tracking-widest block">
                          {hotspot.tag}
                        </span>
                        <h4 className="text-xs font-bold text-[#111110] uppercase font-display leading-tight">
                          {hotspot.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => setActiveHotspot(null)}
                        className="text-[#52504B] hover:text-[#111110] p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-[#52504B] font-sans leading-relaxed">
                      {hotspot.description}
                    </p>

                    <div className="pt-2 border-t border-[#DCD7CC] text-[9px] text-[#111110] font-bold">
                      SPEC: {hotspot.spec}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        {/* Bottom Left Angle Watermark */}
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
          <span className="text-[10px] text-[#52504B] font-bold tracking-widest uppercase bg-[#FCFBF8]/90 px-2 py-0.5 border border-[#DCD7CC]">
            {currentAngle.label}
          </span>
        </div>
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
                setActiveHotspot(null);
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

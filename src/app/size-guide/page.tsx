'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Sparkles,
  Scissors,
  Check,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

const SIZE_CHARTS = {
  WOMEN: [
    { size: 'XS', chest: '38-40"', length: '25.5"', shoulder: '19.5"', sleeve: '8.5"', recommendedFor: 'Petite / Fitted Oversized' },
    { size: 'S', chest: '41-43"', length: '26.5"', shoulder: '20.5"', sleeve: '9.0"', recommendedFor: 'Standard Women-First Oversized (Model Size)' },
    { size: 'M', chest: '44-46"', length: '27.5"', shoulder: '21.5"', sleeve: '9.5"', recommendedFor: 'Relaxed Streetwear Fit' },
    { size: 'L', chest: '47-49"', length: '28.5"', shoulder: '22.5"', sleeve: '10.0"', recommendedFor: 'Drop-Shoulder Oversized Fit' },
  ],
  MEN: [
    { size: 'S', chest: '42-44"', length: '27.5"', shoulder: '21.0"', sleeve: '9.5"', recommendedFor: 'Lean Athletic Frame' },
    { size: 'M', chest: '45-47"', length: '28.5"', shoulder: '22.0"', sleeve: '10.0"', recommendedFor: 'Standard Men Boxy Fit' },
    { size: 'L', chest: '48-50"', length: '29.5"', shoulder: '23.0"', sleeve: '10.5"', recommendedFor: 'Relaxed Oversized (Model Size)' },
    { size: 'XL', chest: '51-53"', length: '30.5"', shoulder: '24.0"', sleeve: '11.0"', recommendedFor: 'Broad Shoulder / Heavyweight Drape' },
  ],
};

export default function SizeGuidePage() {
  const [activeGender, setActiveGender] = useState<'WOMEN' | 'MEN'>('WOMEN');
  const [selectedSize, setSelectedSize] = useState<string>('S');
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  const currentChart = SIZE_CHARTS[activeGender];
  const activeRow = currentChart.find((r) => r.size === selectedSize) || currentChart[1];

  return (
    <div className="bg-outside-bg text-outside-text min-h-screen py-12 md:py-20 font-mono">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="border-b border-outside-border pb-8 space-y-3">
          <div className="flex items-center gap-2 text-xs text-outside-crimson uppercase tracking-[0.25em] font-bold">
            <span className="w-2 h-2 rounded-full bg-outside-crimson animate-pulse" />
            <span>INTERACTIVE FIT &amp; SIZING ROOM</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-outside-text uppercase">
            The Fit &amp; Sizing Matrix.
          </h1>
          <p className="text-sm font-sans text-outside-muted max-w-2xl leading-relaxed">
            All OUTSIDE garments are patterned with an intentional architectural boxy cut. Select your preferred fit below to review exact dimensions and sizing guidance.
          </p>
        </div>

        {/* Fit Switcher & Unit Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-outside-border shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs text-outside-muted font-bold uppercase mr-2">CUT:</span>
            <button
              onClick={() => {
                setActiveGender('WOMEN');
                setSelectedSize('S');
              }}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all border ${
                activeGender === 'WOMEN'
                  ? 'bg-outside-text text-white border-outside-text shadow-sm'
                  : 'bg-outside-surface text-outside-muted border-outside-border hover:text-outside-text'
              }`}
            >
              WOMEN-FIRST (ERGO-BOXY)
            </button>
            <button
              onClick={() => {
                setActiveGender('MEN');
                setSelectedSize('L');
              }}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all border ${
                activeGender === 'MEN'
                  ? 'bg-outside-text text-white border-outside-text shadow-sm'
                  : 'bg-outside-surface text-outside-muted border-outside-border hover:text-outside-text'
              }`}
            >
              MEN (STRUCTURED-RELAXED)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-outside-muted uppercase font-bold">UNIT:</span>
            <button
              onClick={() => setUnit(unit === 'inches' ? 'cm' : 'inches')}
              className="px-3 py-1 bg-outside-surface border border-outside-border text-xs text-outside-text font-bold uppercase"
            >
              {unit === 'inches' ? 'INCHES (")' : 'CENTIMETERS (CM)'}
            </button>
          </div>
        </div>

        {/* Interactive Fit Advisor Card */}
        <div className="bg-white border border-outside-border p-6 sm:p-8 shadow-luxury space-y-6">
          <div className="flex items-center justify-between border-b border-outside-border pb-4">
            <div>
              <span className="text-[10px] text-outside-crimson font-bold uppercase tracking-wider block">
                {activeGender === 'WOMEN' ? 'PRIMARY WOMEN-FIRST FIT' : 'MEN RELAXED BOXY FIT'}
              </span>
              <h3 className="text-xl font-display font-bold uppercase text-outside-text">
                SIZE {activeRow.size} PROFILE // {activeRow.recommendedFor}
              </h3>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-outside-crimson hover:bg-outside-crimsonHover text-white text-xs uppercase tracking-wider font-bold transition-colors shadow-sm"
            >
              ORDER SIZE {activeRow.size} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-outside-surface/60 border border-outside-border space-y-1">
              <span className="text-[10px] text-outside-muted uppercase font-bold block">CHEST CIRCUMFERENCE</span>
              <span className="text-lg font-bold text-outside-text">{activeRow.chest}</span>
            </div>
            <div className="p-4 bg-outside-surface/60 border border-outside-border space-y-1">
              <span className="text-[10px] text-outside-muted uppercase font-bold block">BODY LENGTH (HPS)</span>
              <span className="text-lg font-bold text-outside-text">{activeRow.length}</span>
            </div>
            <div className="p-4 bg-outside-surface/60 border border-outside-border space-y-1">
              <span className="text-[10px] text-outside-muted uppercase font-bold block">SHOULDER WIDTH</span>
              <span className="text-lg font-bold text-outside-text">{activeRow.shoulder}</span>
            </div>
            <div className="p-4 bg-outside-surface/60 border border-outside-border space-y-1">
              <span className="text-[10px] text-outside-muted uppercase font-bold block">SLEEVE LENGTH</span>
              <span className="text-lg font-bold text-outside-text">{activeRow.sleeve}</span>
            </div>
          </div>
        </div>

        {/* Master Sizing Table */}
        <div className="bg-white border border-outside-border shadow-luxury overflow-hidden">
          <div className="p-4 bg-outside-surface border-b border-outside-border flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-outside-text">
              COMPLETE {activeGender} MEASUREMENT SPECIFICATION TABLE
            </span>
            <span className="text-[10px] text-outside-muted uppercase font-bold">TOLERANCE ±0.5"</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-outside-surface/50 border-b border-outside-border text-outside-muted text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="p-4">SIZE</th>
                  <th className="p-4">CHEST</th>
                  <th className="p-4">LENGTH</th>
                  <th className="p-4">SHOULDER</th>
                  <th className="p-4">SLEEVE</th>
                  <th className="p-4">RECOMMENDED FIT / LOOK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outside-border">
                {currentChart.map((row) => {
                  const isCurrent = row.size === selectedSize;
                  return (
                    <tr
                      key={row.size}
                      onClick={() => setSelectedSize(row.size)}
                      className={`cursor-pointer transition-colors ${
                        isCurrent ? 'bg-outside-surface font-bold text-outside-crimson' : 'hover:bg-outside-surface/40'
                      }`}
                    >
                      <td className="p-4 font-bold">{row.size}</td>
                      <td className="p-4">{row.chest}</td>
                      <td className="p-4">{row.length}</td>
                      <td className="p-4">{row.shoulder}</td>
                      <td className="p-4">{row.sleeve}</td>
                      <td className="p-4 text-outside-inkSecondary font-sans">{row.recommendedFor}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Measure & Care Guarantee */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="p-6 bg-white border border-outside-border space-y-2 shadow-sm">
            <h4 className="font-bold text-outside-text uppercase">HOW TO MEASURE</h4>
            <p className="text-outside-muted font-sans leading-relaxed text-[11px]">
              Lay your best-fitting oversized t-shirt flat. Measure 1" below the armhole across the chest and multiply by 2. Compare against our chart above.
            </p>
          </div>
          <div className="p-6 bg-white border border-outside-border space-y-2 shadow-sm">
            <h4 className="font-bold text-outside-text uppercase">7-DAY SIZE EXCHANGE</h4>
            <p className="text-outside-muted font-sans leading-relaxed text-[11px]">
              If your garment doesn't drape as envisioned, we offer complimentary 7-day size exchanges, subject to remaining serialized variant stock.
            </p>
          </div>
          <div className="p-6 bg-white border border-outside-border space-y-2 shadow-sm">
            <h4 className="font-bold text-outside-text uppercase">WASH &amp; CARE</h4>
            <p className="text-outside-muted font-sans leading-relaxed text-[11px]">
              Machine wash cold inside-out with like colors. Do not tumble dry. Steam or iron on reverse side to protect the raised floral embroidery.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

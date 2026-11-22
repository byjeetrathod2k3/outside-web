import React from 'react';

export function CottonIcon({ className = 'w-5 h-5 text-[#111110]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Cloud-like cotton boll */}
      <path d="M12 21c-1.5-2-1.5-5-1.5-7" />
      <path d="M12 21c1.5-2 1.5-5 1.5-7" />
      <path d="M10.5 14c-2.5.5-4.5-.5-5.5-2.5-1-2-.5-4.5 1-5.5 1.5-1 4-.5 5 1" />
      <path d="M13.5 14c2.5.5 4.5-.5 5.5-2.5 1-2 .5-4.5-1-5.5-1.5-1-4-.5-5 1" />
      <path d="M9 7c0-2 1.3-4 3-4s3 2 3 4" />
      <path d="M9.5 17.5c-1 1-2.5 1.5-4 1.5" />
      <path d="M14.5 17.5c1 1 2.5 1.5 4 1.5" />
    </svg>
  );
}

export function IndiaIcon({ className = 'w-5 h-5 text-[#111110]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Simplified geometric silhouette of India */}
      <path d="M12 3l1.5 1.5-1 2 2 1.5 2-.5 1 2-1 2.5 1.5 2-1 2.5 1 2-2.5 3-2 1.5-2.5-1.5-2-3 1-2-1.5-2 1-2.5-1-2 2-.5 2-1.5-1-2z" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BoxExchangeIcon({ className = 'w-5 h-5 text-[#111110]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
      {/* Curved return arrow accent */}
      <path d="M7 14.5c.5 1.5 2 2.5 4 2.5" strokeDasharray="1.5 1.5" />
    </svg>
  );
}

export function LaurelWreathBadge({
  totalPieces = 250,
  className = '',
}: {
  totalPieces?: number;
  className?: string;
}) {
  return (
    <div
      className={`w-[104px] h-[104px] rounded-full bg-[#F7F4EF] border border-black/20 shadow-md flex items-center justify-center select-none relative z-10 ${className}`}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full text-[#111111]"
        aria-label={`Limited to ${totalPieces} pieces`}
      >
        <defs>
          <path id="topArc" d="M 22,60 A 38,38 0 0,1 98,60" fill="none" />
        </defs>

        {/* Top curved text: LIMITED TO */}
        <text
          fill="#111111"
          fontSize="9"
          letterSpacing="2.5"
          fontWeight="600"
          className="font-mono uppercase"
        >
          <textPath href="#topArc" startOffset="50%" textAnchor="middle">
            LIMITED TO
          </textPath>
        </text>

        {/* Center number: 250 */}
        <text
          x="60"
          y="64"
          textAnchor="middle"
          fontSize="28"
          fontWeight="800"
          fill="#111111"
          className="font-display font-black"
        >
          {totalPieces}
        </text>

        {/* Sub-label: PIECES */}
        <text
          x="60"
          y="79"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="2"
          fontWeight="600"
          fill="#333333"
          className="font-mono uppercase"
        >
          PIECES
        </text>

        {/* Symmetrical Laurels: Clean left and right bottom-arc laurel sprigs positioned strictly below y="62" */}
        {/* Left Laurel Branch */}
        <g id="laurelSprig" stroke="#111111" strokeWidth="1" fill="#111111">
          {/* Main curved stem */}
          <path
            d="M 25,66 C 25,80 36,94 50,98"
            fill="none"
            strokeLinecap="round"
          />
          {/* Symmetrical leaves along stem strictly below y=62 */}
          <path d="M 25,66 C 21,65 22,63 25,64 C 28,65 27,67 25,66 Z" />
          <path d="M 26,71 C 30,69 32,72 29,74 C 27,75 26,73 26,71 Z" />
          <path d="M 26,76 C 21,75 21,72 25,73 C 28,74 27,76 26,76 Z" />
          <path d="M 28,80 C 32,79 34,82 31,84 C 29,85 28,82 28,80 Z" />
          <path d="M 31,85 C 26,86 26,83 30,83 C 33,83 33,86 31,85 Z" />
          <path d="M 34,88 C 38,88 39,92 36,93 C 34,94 33,90 34,88 Z" />
          <path d="M 40,94 C 36,96 35,93 39,93 C 42,93 42,95 40,94 Z" />
          <path d="M 44,95 C 47,95 48,98 45,99 C 43,99 43,97 44,95 Z" />
        </g>

        {/* Right Laurel Branch (Clean exact mirror across x=60) */}
        <use href="#laurelSprig" transform="translate(120, 0) scale(-1, 1)" />
      </svg>
    </div>
  );
}

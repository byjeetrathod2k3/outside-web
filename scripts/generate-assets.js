const fs = require('fs');
const path = require('path');

const dropsDir = path.join(__dirname, 'public', 'images', 'drops');
const journalDir = path.join(__dirname, 'public', 'images', 'journal');

[dropsDir, journalDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function createDropSvg(title, subtitle, color = '#121212', accent = '#D91E2A') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color}" />
      <stop offset="100%" stop-color="#080808" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#222" stroke-width="1" stroke-opacity="0.4" />
    </pattern>
  </defs>
  <rect width="1200" height="1500" fill="url(#bg)" />
  <rect width="1200" height="1500" fill="url(#grid)" />
  
  <!-- Architectural Silhouette Illustration -->
  <g transform="translate(300, 250)" stroke="#333" stroke-width="2" fill="none">
    <!-- Boxy Oversized T-Shirt Wireframe -->
    <path d="M 150 50 Q 300 100 450 50 L 580 180 L 480 280 L 430 220 L 430 850 L 170 850 L 170 220 L 120 280 L 20 180 Z" stroke="#555" stroke-width="3" fill="#141414" fill-opacity="0.8" />
    <!-- Collar -->
    <path d="M 230 65 Q 300 120 370 65" stroke="${accent}" stroke-width="4" fill="none" />
    <!-- Center Crease / Seam -->
    <line x1="300" y1="120" x2="300" y2="850" stroke="#2A2A2A" stroke-dasharray="6,6" />
    <!-- Distressed Stamp Accent -->
    <rect x="250" y="320" width="100" height="30" fill="${accent}" fill-opacity="0.15" stroke="${accent}" stroke-width="1" />
    <text x="300" y="340" fill="${accent}" font-family="monospace" font-size="12" letter-spacing="4" text-anchor="middle">OUTSIDE</text>
  </g>

  <!-- Editorial Meta Badges -->
  <text x="80" y="120" fill="#888" font-family="monospace" font-size="20" letter-spacing="6">EDITION // SPEC-280</text>
  <text x="80" y="160" fill="#FFF" font-family="sans-serif" font-weight="900" font-size="44" letter-spacing="2">${title}</text>
  <text x="80" y="200" fill="${accent}" font-family="monospace" font-size="18" letter-spacing="3">${subtitle}</text>

  <!-- Bottom Stamp -->
  <line x1="80" y1="1380" x2="1120" y2="1380" stroke="#333" stroke-width="1" />
  <text x="80" y="1420" fill="#666" font-family="monospace" font-size="16" letter-spacing="4">GUJARAT, INDIA · 280 GSM COMBED COTTON · SERIALIZED RUN</text>
  <text x="1120" y="1420" fill="#FFF" font-family="monospace" font-size="16" letter-spacing="4" text-anchor="end">001 / 250</text>
</svg>`;
}

function createJournalSvg(title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
  <rect width="1200" height="800" fill="#0D0D0D" />
  <circle cx="900" cy="400" r="300" fill="#D91E2A" fill-opacity="0.08" />
  <rect x="100" y="100" width="1000" height="600" fill="none" stroke="#222" stroke-width="2" />
  <text x="160" y="220" fill="#D91E2A" font-family="monospace" font-size="20" letter-spacing="4">THE OUTSIDE JOURNAL</text>
  <text x="160" y="300" fill="#FFF" font-family="sans-serif" font-weight="bold" font-size="40">${title}</text>
  <text x="160" y="360" fill="#777" font-family="sans-serif" font-size="20">Craft, Architecture &amp; The Anti-Inventory Philosophy</text>
  <line x1="160" y1="580" x2="1040" y2="580" stroke="#222" stroke-width="1" />
  <text x="160" y="620" fill="#555" font-family="monospace" font-size="14" letter-spacing="3">READ TIME: 4 MIN · AHMEDABAD STUDIO ARCHIVES</text>
</svg>`;
}

fs.writeFileSync(path.join(dropsDir, 'drop-001-main.jpg'), createDropSvg('MIDNIGHT MONOLITH', 'FRONT ARCHITECTURE'));
fs.writeFileSync(path.join(dropsDir, 'drop-001-back.jpg'), createDropSvg('MIDNIGHT MONOLITH', 'BACK DISTRESSED GRAPHIC'));
fs.writeFileSync(path.join(dropsDir, 'drop-001-detail1.jpg'), createDropSvg('FABRIC MACRO', '280 GSM FRENCH TERRY WEAVE'));
fs.writeFileSync(path.join(dropsDir, 'drop-001-detail2.jpg'), createDropSvg('SERIAL HEM TAG', 'HAND-NUMBERED LABELS'));
fs.writeFileSync(path.join(dropsDir, 'drop-000-main.jpg'), createDropSvg('GENESIS PROTOTYPE', 'ARCHIVED EDITION OF 100', '#181818', '#888'));
fs.writeFileSync(path.join(journalDir, 'journal-01.jpg'), createJournalSvg('Why We Don’t Restock'));
fs.writeFileSync(path.join(journalDir, 'journal-02.jpg'), createJournalSvg('The Anatomy of 280 GSM Terry'));

console.log('Visual assets generated successfully.');

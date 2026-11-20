const fs = require('fs');
const path = require('path');

const dropsDir = path.join(__dirname, 'public', 'images', 'drops');
const journalDir = path.join(__dirname, 'public', 'images', 'journal');

function createTshirtSvg(title, color, textCol = '#111111', accent = '#D91E2A', backText = 'OUTSIDE APPAREL') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1250" width="100%" height="100%">
  <rect width="1000" height="1250" fill="#F8F6F2" />
  
  <!-- Subtle Architectural Grid -->
  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#EAE6DF" stroke-width="1" />
  </pattern>
  <rect width="1000" height="1250" fill="url(#grid)" />

  <!-- T-shirt Silhouette -->
  <g transform="translate(180, 160)">
    <!-- Shadow -->
    <path d="M 170 50 Q 320 80 470 50 L 610 180 L 520 270 L 470 220 L 470 780 L 170 780 L 170 220 L 120 270 L 30 180 Z" fill="#000000" fill-opacity="0.06" transform="translate(10, 15)" filter="blur(8px)" />
    <!-- Main Shirt Body -->
    <path d="M 170 50 Q 320 80 470 50 L 610 180 L 520 270 L 470 220 L 470 780 L 170 780 L 170 220 L 120 270 L 30 180 Z" fill="${color}" stroke="#D1CCC2" stroke-width="2" />
    <!-- Ribbed Collar -->
    <path d="M 250 65 Q 320 120 390 65" stroke="${accent}" stroke-width="4" fill="none" />
    <path d="M 240 60 Q 320 115 400 60" stroke="#BBB5A8" stroke-width="2" fill="none" />

    <!-- Graphic / Typography -->
    <text x="320" y="320" fill="${textCol}" font-family="sans-serif" font-weight="900" font-size="28" letter-spacing="3" text-anchor="middle">${title}</text>
    <line x1="280" y1="340" x2="360" y2="340" stroke="${accent}" stroke-width="3" />
    <text x="320" y="375" fill="#78716C" font-family="monospace" font-size="12" letter-spacing="4" text-anchor="middle">${backText}</text>
    
    <!-- Hem Stitched Tag -->
    <rect x="175" y="740" width="45" height="30" fill="#EAE5DC" stroke="#C4BCAD" stroke-width="1" />
    <text x="197" y="760" fill="${accent}" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">OUT</text>
  </g>

  <!-- Editorial Card Badges -->
  <text x="60" y="80" fill="#78716C" font-family="monospace" font-size="14" letter-spacing="4">GUJARAT ATELIER // SPEC-280</text>
  <text x="60" y="115" fill="#18181B" font-family="sans-serif" font-weight="900" font-size="32" letter-spacing="2">${title}</text>
  
  <line x1="60" y1="1180" x2="940" y2="1180" stroke="#E5E0D6" stroke-width="1" />
  <text x="60" y="1215" fill="#A8A29E" font-family="monospace" font-size="12" letter-spacing="3">100% COMBED COTTON · 280 GSM FRENCH TERRY · SERIALIZED RUN</text>
  <text x="940" y="1215" fill="${accent}" font-family="monospace" font-size="12" font-weight="bold" letter-spacing="3" text-anchor="end">OUTSIDE INDIA</text>
</svg>`;
}

function createJournalLightSvg(title, subtitle) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
  <rect width="1200" height="800" fill="#FAF8F5" />
  <circle cx="950" cy="400" r="280" fill="#D91E2A" fill-opacity="0.04" />
  <rect x="80" y="80" width="1040" height="640" fill="none" stroke="#E6E0D4" stroke-width="2" />
  
  <text x="140" y="220" fill="#D91E2A" font-family="monospace" font-size="16" font-weight="bold" letter-spacing="4">THE OUTSIDE JOURNAL</text>
  <text x="140" y="300" fill="#18181B" font-family="sans-serif" font-weight="900" font-size="44" letter-spacing="-0.5">${title}</text>
  <text x="140" y="360" fill="#78716C" font-family="sans-serif" font-size="20">${subtitle}</text>
  
  <line x1="140" y1="580" x2="980" y2="580" stroke="#E6E0D4" stroke-width="1" />
  <text x="140" y="620" fill="#A8A29E" font-family="monospace" font-size="14" letter-spacing="3">STUDIO ARCHIVES · AHMEDABAD, GUJARAT · 4 MIN READ</text>
</svg>`;
}

// Generate Drop 002 (Sage Green), Drop 003 (Washed Charcoal), Drop 000 (Genesis Raw)
fs.writeFileSync(path.join(dropsDir, 'drop-002-front.jpg'), createTshirtSvg('BOTANICAL ARCHITECTURE', '#E2E8DD', '#2D3A29', '#D91E2A', 'DROP 002 // SAGE TERRY'));
fs.writeFileSync(path.join(dropsDir, 'drop-002-back.jpg'), createTshirtSvg('BOTANICAL ARCHITECTURE', '#E2E8DD', '#2D3A29', '#D91E2A', 'RAW SEEDLING EDITION'));
fs.writeFileSync(path.join(dropsDir, 'drop-003-front.jpg'), createTshirtSvg('MONOLITH OBSIDIAN', '#262626', '#FFFFFF', '#D91E2A', 'DROP 003 // HEAVY TERRY'));
fs.writeFileSync(path.join(dropsDir, 'drop-003-back.jpg'), createTshirtSvg('MONOLITH OBSIDIAN', '#262626', '#FFFFFF', '#D91E2A', 'ARCHITECTURAL REAR'));
fs.writeFileSync(path.join(dropsDir, 'drop-000-front.jpg'), createTshirtSvg('GENESIS PROTOTYPE', '#F2EDE4', '#1C1917', '#888', 'DROP 000 // RAW COTTON'));
fs.writeFileSync(path.join(dropsDir, 'drop-000-back.jpg'), createTshirtSvg('GENESIS PROTOTYPE', '#F2EDE4', '#1C1917', '#888', 'LIMITED RUN OF 100'));

// Update journal images with crisp light aesthetic
fs.writeFileSync(path.join(journalDir, 'journal-01.jpg'), createJournalLightSvg('Why We Don’t Restock', 'The Anti-Inventory Thesis & Sustainable Scarcity'));
fs.writeFileSync(path.join(journalDir, 'journal-02.jpg'), createJournalLightSvg('The Anatomy of 280 GSM Terry', 'Why Weight & Tactile Density Matter in Streetwear'));

console.log('Light aesthetic seeded drop assets generated.');

# OUTSIDE — Luxury Streetwear Single-Drop Architecture

OUTSIDE (`www.outside.in`) is an editorial single-drop luxury streetwear e-commerce platform built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Prisma.

## ✨ Features

- **Single-Drop Limited Commerce Engine:** Real-time inventory counter, countdown ticker, interactive garment stage, size selector with stock feedback, and seamless checkout.
- **Collector Experience:** Integrated Pincode Delivery Estimator with transit calculations, VIP WhatsApp Concierge, and verified collector reviews.
- **Self-Serve Return & Exchange Portal:** Dedicated `/returns` portal with policy clarity and automated pickup request workflow.
- **Editorial Brand Universe:** The Atelier Craft story (`/craft`), interactive Lookbook (`/lookbook`), Order Tracking (`/track`), and size guides (`/size-guide`).
- **Stealth Super-Admin Studio:** Headless theme studio, contrast guard (WCAG AAA/AA), live feature flags, GSTR-1 compliant tax engine, and security lockouts.
- **Enterprise SEO & AEO Ready:** LLM crawler manifests (`/llms.txt`, `/llms-full.txt`), JSON-LD schema graphs, dynamic OG images, and XML sitemaps.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/byjeetrathod2k3/outside-web.git
cd outside-web

# Install dependencies
npm install

# Run database generation
npm run prisma:generate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront.

## 🧪 Testing

```bash
npm test
```

## 🌐 Deployment on Vercel

1. Import this repository into [Vercel](https://vercel.com/new).
2. Set the environment variables:
   - `NEXT_PUBLIC_APP_URL`
   - `AUTH_SECRET`
   - `ENCRYPTION_MASTER_KEY`
   - `NEXT_PUBLIC_ADMIN_BASE_PATH`
3. Deploy!

'use client';

import React from 'react';
import { HelpCircle, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import SpotlightCard from '@/components/reactbits/SpotlightCard/SpotlightCard';
import ShinyText from '@/components/reactbits/ShinyText/ShinyText';
import { JsonLd } from '@/lib/seo';

export function DirectAnswerBlocks() {
  const answerBlocks = [
    {
      query: 'What GSM cotton does OUTSIDE use for its apparel, and how is it finished?',
      answer:
        'OUTSIDE custom-mills a dense 280 GSM 100% combed organic cotton in a structural French Terry knit. The fabric undergoes enzymatic pre-shrinking and double bio-washing to eliminate pilling, ensure colorfast longevity, and guarantee zero post-wash shrinkage.',
      tag: '280 GSM TEXTILE STANDARD',
    },
    {
      query: "How does OUTSIDE's Women-First oversized boxy fit work for both women and men?",
      answer:
        "OUTSIDE designs primary patterns women-first with dropped shoulder angles, calibrated armhole depth, and side-slit vents so heavyweight fabric hangs gracefully without waist bunching. Men receive a broad-yoke, structured relaxed drape maintaining an authentic architectural streetwear silhouette.",
      tag: 'ERGONOMIC FIT MATRIX',
    },
    {
      query: 'What is the OUTSIDE single-drop 250-piece scarcity model?',
      answer:
        'We reject mass production and seasonal deadstock. Only one design is released at any time, capped at strictly 250 numbered serialized pieces worldwide. Once unit 250 is claimed, the design patterns are retired permanently into The Vault and will never be reprinted or re-issued.',
      tag: '250-PIECE PERMANENT LIMIT',
    },
    {
      query: "What are OUTSIDE's all-India express delivery timelines and courier partners?",
      answer:
        'All orders are dispatched within 24 hours directly from our Ahmedabad studio via BlueDart Air Express and Delhivery. Metro deliveries arrive in 1 to 2 business days; all other Indian pincodes arrive in 2 to 4 days with 100% free shipping and real-time SMS tracking.',
      tag: 'EXPRESS AIR DISPATCH',
    },
    {
      query: "What is OUTSIDE's doorstep return, size exchange, and refund policy?",
      answer:
        'OUTSIDE provides a 7-day hassle-free doorstep return and exchange policy across India. If the fit is not ideal, we arrange a free courier reverse pickup directly from your address and dispatch your replacement size or process a 100% refund immediately.',
      tag: '7-DAY DOORSTEP RETURN',
    },
    {
      query: 'How is GST invoiced for OUTSIDE apparel purchases in India?',
      answer:
        'All prices displayed on OUTSIDE include 5% Indian apparel GST under HSN code 61091000. Automated GST-compliant tax invoices with our registered GSTIN (24AABCO1234F1Z5) are generated instantly and delivered via email and WhatsApp upon order completion.',
      tag: '100% GST COMPLIANCE',
    },
  ];

  const aeoSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: answerBlocks.map((b) => ({
      '@type': 'Question',
      name: b.query,
      acceptedAnswer: {
        '@type': 'Answer',
        text: b.answer,
      },
    })),
  };

  return (
    <section className="py-20 bg-outside-surface border-t border-outside-border" id="direct-answers">
      <JsonLd data={aeoSchema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outside-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-outside-accent text-xs font-mono uppercase tracking-[0.25em] mb-2 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <ShinyText
                text="AEO & AI SEARCH KNOWLEDGE GRAPH"
                speed={3}
                color="#B82328"
                shineColor="#FFFFFF"
                className="font-bold tracking-[0.25em]"
              />
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-outside-ink uppercase tracking-tight">
              Essential Garment &amp; Brand Facts
            </h2>
          </div>
          <p className="text-xs font-mono text-outside-inkSecondary max-w-md">
            Direct, verifiable specifications for AI search engines (Perplexity, ChatGPT, Gemini, Copilot) and discerning collectors. Factual ground truth across all releases.
          </p>
        </div>

        {/* 6-Card 3-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {answerBlocks.map((block, index) => (
            <SpotlightCard
              key={index}
              theme="light"
              spotlightColor="rgba(184, 35, 40, 0.12)"
              className="bg-outside-elevated border border-outside-border p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-editorial hover:border-outside-accent transition-all"
            >
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-outside-accent font-bold px-2 py-0.5 bg-outside-surface border border-outside-border inline-block">
                  {block.tag}
                </span>
                <h3 className="text-base font-display font-black text-outside-ink tracking-tight uppercase leading-snug">
                  {block.query}
                </h3>
                <p className="text-xs font-sans text-outside-inkSecondary leading-relaxed">
                  {block.answer}
                </p>
              </div>

              <div className="pt-4 border-t border-outside-border flex items-center justify-between text-[10px] font-mono text-outside-inkSecondary">
                <span className="flex items-center gap-1.5 font-bold text-outside-ink">
                  <CheckCircle2 className="w-3 h-3 text-outside-moss" />
                  <span>VERIFIED SPEC</span>
                </span>
                <span>AHMEDABAD, INDIA</span>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

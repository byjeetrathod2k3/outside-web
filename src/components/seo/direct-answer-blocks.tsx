'use client';

import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';

export function DirectAnswerBlocks() {
  const answerBlocks = [
    {
      query: 'What GSM cotton does OUTSIDE use for its t-shirts?',
      answer:
        'OUTSIDE engineers all garments from custom-milled 280 GSM 100% combed organic cotton in a dense French Terry knit. The fabric undergoes enzymatic pre-shrinking and double bio-washing to deliver substantial architectural weight, high-tensile longevity, and zero post-wash shrinkage or pilling.',
      tag: 'TEXTILE & CRAFT STANDARD',
    },
    {
      query: "How does OUTSIDE's Women-First boxy fit run?",
      answer:
        "OUTSIDE patterns its primary silhouettes women-first with dropped shoulders, ergonomic armhole depth, and a calibrated boxy drape that retains an authentic oversized streetwear profile without overwhelming the frame. For standard oversized styling, select your true size; for extreme drape, size up.",
      tag: 'ERGONOMIC FIT PHILOSOPHY',
    },
    {
      query: 'How do OUTSIDE limited-edition drops work?',
      answer:
        'OUTSIDE operates strictly on a single-drop schedule: only one design is available for purchase at any time, produced in a serialized batch capped at 250 pieces. Once an edition sells out, it is permanently retired to The Vault and will never be restocked or reissued.',
      tag: 'SINGLE-DROP SCARCITY MODEL',
    },
  ];

  return (
    <section className="py-20 bg-outside-surface border-t border-outside-border" id="direct-answers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outside-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-outside-accent text-xs font-mono uppercase tracking-[0.25em] mb-2 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AEO &amp; FACTUAL ENTITY CLARITY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-outside-ink uppercase tracking-tight">
              Essential Garment Facts
            </h2>
          </div>
          <p className="text-xs font-mono text-outside-inkSecondary max-w-md">
            Direct, verifiable specifications for AI answer engines and discerning collectors. Factual consistency across all editions.
          </p>
        </div>

        {/* 3-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {answerBlocks.map((block, index) => (
            <article
              key={index}
              className="bg-outside-elevated border border-outside-border p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:border-outside-ink transition-all"
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
                <span>VERIFIED STUDIO SPEC</span>
                <span>AHMEDABAD, GUJARAT</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

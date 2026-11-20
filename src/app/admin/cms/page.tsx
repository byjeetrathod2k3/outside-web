'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus, HelpCircle, BookOpen, Save, CheckCircle } from 'lucide-react';

export default function AdminCmsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [journal, setJournal] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState<'faqs' | 'journal'>('faqs');
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', category: 'General' });
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    async function loadCmsData() {
      try {
        const res = await fetch('/api/admin/cms');
        if (res.ok) {
          const data = await res.json();
          if (data.faqs) setFaqs(data.faqs);
          if (data.journal) setJournal(data.journal);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadCmsData();
  }, []);

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaq.question || !newFaq.answer) return;

    try {
      const updatedFaqs = [
        ...faqs,
        {
          id: `faq_${Date.now()}`,
          ...newFaq,
          sortOrder: faqs.length + 1,
        },
      ];

      const res = await fetch('/api/admin/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faqs: updatedFaqs }),
      });

      if (res.ok) {
        setFaqs(updatedFaqs);
        setNewFaq({ question: '', answer: '', category: 'General' });
        setSavedMessage(true);
        setTimeout(() => setSavedMessage(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 font-mono">
      
      {/* Header */}
      <div className="border-b border-outside-border pb-6 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase text-outside-crimson font-bold tracking-[0.25em]">
            HEADLESS CONTENT MANAGEMENT SYSTEM // AEO &amp; GEO
          </span>
          <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight mt-1">
            CMS &amp; Editorial Knowledge Base
          </h1>
        </div>
      </div>

      {savedMessage && (
        <div className="p-4 bg-outside-surface border border-outside-crimson text-white text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-outside-crimson" />
          <span>CONTENT UPDATED AND DEPLOYED TO STOREFRONT IMMEDIATELY.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-outside-border text-xs">
        <button
          onClick={() => setActiveSection('faqs')}
          className={`px-6 py-3 border-b-2 uppercase tracking-wider font-bold transition-all ${
            activeSection === 'faqs'
              ? 'border-outside-crimson text-white bg-outside-surface/60'
              : 'border-transparent text-outside-muted hover:text-white'
          }`}
        >
          AEO FAQS ACCORDION ({faqs.length})
        </button>
        <button
          onClick={() => setActiveSection('journal')}
          className={`px-6 py-3 border-b-2 uppercase tracking-wider font-bold transition-all ${
            activeSection === 'journal'
              ? 'border-outside-crimson text-white bg-outside-surface/60'
              : 'border-transparent text-outside-muted hover:text-white'
          }`}
        >
          JOURNAL ESSAYS ({journal.length})
        </button>
      </div>

      {/* Section 1: FAQs */}
      {activeSection === 'faqs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* FAQ List */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs uppercase text-outside-muted font-bold">
              ACTIVE STOREFRONT FAQS (STRUCTURED SCHEMA.ORG EMBEDDED)
            </h3>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="p-4 bg-outside-surface border border-outside-border space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-outside-crimson flex-shrink-0" />
                      <span>{faq.question}</span>
                    </h4>
                    <span className="text-[9px] px-2 py-0.5 bg-outside-card border border-outside-border text-outside-muted">
                      {faq.category}
                    </span>
                  </div>
                  <p className="text-xs text-outside-muted font-sans leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Add FAQ Form */}
          <div className="lg:col-span-5 bg-outside-surface border border-outside-border p-6 space-y-4">
            <h3 className="text-xs uppercase text-white font-bold tracking-wider">
              CREATE AEO KNOWLEDGE BASE QUESTION
            </h3>

            <form onSubmit={handleAddFaq} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                  CATEGORY
                </label>
                <select
                  value={newFaq.category}
                  onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                  className="w-full bg-outside-card border border-outside-border px-3 py-2 text-xs text-white focus:border-outside-crimson focus:outline-none"
                >
                  <option value="General">General</option>
                  <option value="Drops & Editions">Drops &amp; Editions</option>
                  <option value="GST & Invoicing">GST &amp; Invoicing</option>
                  <option value="Fit & Sizing">Fit &amp; Sizing</option>
                  <option value="Shipping & Delivery">Shipping &amp; Delivery</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                  QUESTION (USER SEARCH INTENT) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Can I claim GST input on business orders?"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  className="w-full bg-outside-card border border-outside-border px-3 py-2 text-xs text-white focus:border-outside-crimson focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-outside-muted mb-1.5">
                  DIRECT ANSWER (CLEAR &amp; CONCISE) *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide a factual, authoritative answer suitable for Google AI and Perplexity citations..."
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  className="w-full bg-outside-card border border-outside-border px-3 py-2 text-xs text-white focus:border-outside-crimson focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-outside-crimson hover:bg-outside-crimsonBright text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>PUBLISH TO STOREFRONT</span>
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Section 2: Journal */}
      {activeSection === 'journal' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {journal.map((post) => (
              <div key={post.id} className="p-6 bg-outside-surface border border-outside-border space-y-3">
                <span className="text-[10px] text-outside-crimson font-bold uppercase">
                  STATUS: {post.status} · BY {post.authorName}
                </span>
                <h3 className="text-base font-bold text-white uppercase">{post.title}</h3>
                <p className="text-xs text-outside-muted font-sans leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="pt-2 text-right">
                  <a
                    href={`/journal/${post.slug}`}
                    target="_blank"
                    className="text-xs text-outside-crimson hover:underline"
                  >
                    PREVIEW LIVE ESSAY &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

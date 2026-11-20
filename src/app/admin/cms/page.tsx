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
      <div className="border-b border-[#DCD7CC] pb-6 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase text-[#B82328] font-bold tracking-[0.25em]">
            HEADLESS CONTENT MANAGEMENT SYSTEM // AEO &amp; GEO
          </span>
          <h1 className="text-2xl font-display font-black text-[#111110] uppercase tracking-tight mt-1">
            CMS &amp; Editorial Knowledge Base
          </h1>
        </div>
      </div>

      {savedMessage && (
        <div className="p-4 bg-[#3F4E44]/10 border border-[#3F4E44] text-[#3F4E44] text-xs flex items-center gap-2 font-bold">
          <CheckCircle className="w-4 h-4 text-[#3F4E44]" />
          <span>CONTENT UPDATED AND DEPLOYED TO STOREFRONT IMMEDIATELY.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#DCD7CC] text-xs">
        <button
          onClick={() => setActiveSection('faqs')}
          className={`px-6 py-3 border-b-2 uppercase tracking-wider font-bold transition-all cursor-pointer ${
            activeSection === 'faqs'
              ? 'border-[#B82328] text-[#111110] bg-[#FCFBF8]'
              : 'border-transparent text-[#52504B] hover:text-[#111110]'
          }`}
        >
          AEO FAQS ACCORDION ({faqs.length})
        </button>
        <button
          onClick={() => setActiveSection('journal')}
          className={`px-6 py-3 border-b-2 uppercase tracking-wider font-bold transition-all cursor-pointer ${
            activeSection === 'journal'
              ? 'border-[#B82328] text-[#111110] bg-[#FCFBF8]'
              : 'border-transparent text-[#52504B] hover:text-[#111110]'
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
            <h3 className="text-xs uppercase text-[#52504B] font-bold">
              ACTIVE STOREFRONT FAQS (STRUCTURED SCHEMA.ORG EMBEDDED)
            </h3>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="p-4 bg-[#FCFBF8] border border-[#DCD7CC] space-y-2 shadow-editorial">
                  <div className="flex justify-between items-start gap-3">
                    <h4 className="text-xs font-bold text-[#111110] uppercase flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-[#B82328] flex-shrink-0" />
                      <span>{faq.question}</span>
                    </h4>
                    <span className="text-[9px] px-2 py-0.5 bg-[#EDEAE2] border border-[#DCD7CC] text-[#52504B] font-mono flex-shrink-0">
                      {faq.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#52504B] font-sans leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Add FAQ Form */}
          <div className="lg:col-span-5 bg-[#FCFBF8] border border-[#DCD7CC] p-6 space-y-4 shadow-editorial">
            <h3 className="text-xs uppercase text-[#111110] font-bold tracking-wider">
              CREATE AEO KNOWLEDGE BASE QUESTION
            </h3>

            <form onSubmit={handleAddFaq} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                  CATEGORY
                </label>
                <select
                  value={newFaq.category}
                  onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                  className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3 py-2 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none transition-colors"
                >
                  <option value="General">General</option>
                  <option value="Drops & Editions">Drops &amp; Editions</option>
                  <option value="GST & Invoicing">GST &amp; Invoicing</option>
                  <option value="Fit & Sizing">Fit &amp; Sizing</option>
                  <option value="Shipping & Delivery">Shipping &amp; Delivery</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                  QUESTION (USER SEARCH INTENT) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Can I claim GST input on business orders?"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3 py-2 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#52504B] mb-1.5 font-bold">
                  DIRECT ANSWER (CLEAR &amp; CONCISE) *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide a factual, authoritative answer suitable for Google AI and Perplexity citations..."
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  className="w-full bg-[#FCFBF8] border border-[#DCD7CC] px-3 py-2 text-xs text-[#111110] focus:border-[#B82328] focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#111110] hover:bg-[#B82328] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
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
              <div key={post.id} className="p-6 bg-[#FCFBF8] border border-[#DCD7CC] space-y-3 shadow-editorial">
                <span className="text-[10px] text-[#B82328] font-bold uppercase">
                  STATUS: {post.status} · BY {post.authorName}
                </span>
                <h3 className="text-base font-bold text-[#111110] uppercase">{post.title}</h3>
                <p className="text-xs text-[#52504B] font-sans leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="pt-2 text-right">
                  <a
                    href={`/journal/${post.slug}`}
                    target="_blank"
                    className="text-xs text-[#B82328] hover:text-[#111110] font-bold uppercase tracking-wider"
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

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Globe,
  Share2,
  Bot,
  RefreshCw,
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Search,
  MessageSquare,
  Twitter,
  Plus,
  Trash2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Eye,
  FileCode,
} from 'lucide-react';

interface CrawlerPolicies {
  googlebot: boolean;
  bingbot: boolean;
  oaiSearch: boolean;
  perplexity: boolean;
  claudeBot: boolean;
}

interface RedirectItem {
  from: string;
  to: string;
  permanent: boolean;
}

interface SeoConfig {
  titleTemplate: string;
  defaultTitle: string;
  defaultMetaDescription: string;
  ogImageUrl: string;
  llmsManifesto: string;
  crawlerPolicies: CrawlerPolicies;
  redirects: RedirectItem[];
  enableWaitlistReferral: boolean;
  updatedAt?: string;
}

export default function AdminSeoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [purging, setPurging] = useState(false);
  const [activeTab, setActiveTab] = useState<'serp' | 'og' | 'crawlers' | 'llms' | 'redirects'>('serp');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [socialPlatform, setSocialPlatform] = useState<'whatsapp' | 'x' | 'linkedin'>('whatsapp');

  const [config, setConfig] = useState<SeoConfig>({
    titleTemplate: '%s | OUTSIDE India',
    defaultTitle: 'OUTSIDE // Wear Your Story — Limited Serialized Drops',
    defaultMetaDescription:
      'Luxury streetwear engineered with 280 GSM combed organic cotton in Gujarat, India. Single-drop serialized editions capped at 250 pieces. Women-first fit philosophy.',
    ogImageUrl: '/api/og?drop=001',
    llmsManifesto: '',
    crawlerPolicies: {
      googlebot: true,
      bingbot: true,
      oaiSearch: true,
      perplexity: true,
      claudeBot: true,
    },
    redirects: [],
    enableWaitlistReferral: true,
  });

  // Redirect form state
  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');
  const [newPermanent, setNewPermanent] = useState(true);
  const [lastPurgedAt, setLastPurgedAt] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const toast = {
    success: (msg: string) => {
      setNotification({ type: 'success', message: msg });
      setTimeout(() => setNotification(null), 4000);
    },
    error: (msg: string) => {
      setNotification({ type: 'error', message: msg });
      setTimeout(() => setNotification(null), 4500);
    },
    info: (msg: string) => {
      setNotification({ type: 'info', message: msg });
      setTimeout(() => setNotification(null), 3500);
    },
  };

  useEffect(() => {
    fetchSeoConfig();
  }, []);

  const fetchSeoConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/seo');
      const data = await res.json();
      if (data.success && data.config) {
        setConfig(data.config);
      }
    } catch {
      toast.error('Failed to load SEO configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'SEO configuration saved & sitemaps queued!');
        if (data.config) setConfig(data.config);
      } else {
        toast.error(data.error || 'Failed to save configuration');
      }
    } catch {
      toast.error('Network error while saving SEO config');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to restore default SEO & Crawler settings?')) return;
    try {
      setSaving(true);
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('SEO configuration restored to factory defaults');
        if (data.config) setConfig(data.config);
      }
    } catch {
      toast.error('Failed to reset configuration');
    } finally {
      setSaving(false);
    }
  };

  const handlePurgeCache = async () => {
    try {
      setPurging(true);
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'purgeCache' }),
      });
      const data = await res.json();
      if (data.success) {
        setLastPurgedAt(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }));
        toast.success(data.message || 'Edge Cache Purged & Revalidated');
      }
    } catch {
      toast.error('Failed to revalidate cache');
    } finally {
      setPurging(false);
    }
  };

  const handleAddRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFrom.trim() || !newTo.trim()) {
      toast.error('Both Source (From) and Destination (To) paths are required.');
      return;
    }

    const cleanFrom = newFrom.trim().startsWith('/') ? newFrom.trim() : `/${newFrom.trim()}`;
    const cleanTo = newTo.trim().startsWith('/') || newTo.trim().startsWith('http') ? newTo.trim() : `/${newTo.trim()}`;

    // Check duplicate
    if (config.redirects.some((r) => r.from.toLowerCase() === cleanFrom.toLowerCase())) {
      toast.error(`A redirect for "${cleanFrom}" already exists.`);
      return;
    }

    const updated = [
      ...config.redirects,
      { from: cleanFrom, to: cleanTo, permanent: newPermanent },
    ];
    setConfig({ ...config, redirects: updated });
    setNewFrom('');
    setNewTo('');
    toast.success(`Redirect added: ${cleanFrom} → ${cleanTo}. Click Save Changes to commit.`);
  };

  const handleRemoveRedirect = (index: number) => {
    const updated = config.redirects.filter((_, i) => i !== index);
    setConfig({ ...config, redirects: updated });
    toast.info('Redirect removed. Click Save Changes to commit.');
  };

  const titleLength = config.defaultTitle.length;
  const descLength = config.defaultMetaDescription.length;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-outside-muted font-mono text-xs">
          <RefreshCw className="w-4 h-4 animate-spin text-outside-crimson" />
          <span>INITIALIZING SEO, AEO &amp; VIRAL ENGINE...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-mono pb-20">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-outside-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-outside-moss animate-pulse" />
            <span className="text-[10px] text-outside-moss uppercase tracking-widest font-bold">
              MODULE 3 ACTIVE // NEXT-GEN ENGINE
            </span>
          </div>
          <h1 className="text-2xl font-display font-black text-outside-text tracking-tight uppercase">
            SEO, AEO, GEO &amp; VIRAL DISCOVERY
          </h1>
          <p className="text-xs text-outside-muted font-sans mt-0.5">
            Real-time metadata governance, Answer Engine Optimization (AEO/GEO), WhatsApp preview generator, and AI crawler access rules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePurgeCache}
            disabled={purging}
            className="px-3.5 py-2 bg-white hover:bg-outside-surface border border-outside-border text-outside-text text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
            title="Revalidate edge routes, robots.txt, and llms.txt"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${purging ? 'animate-spin text-outside-crimson' : 'text-outside-muted'}`} />
            <span>{purging ? 'PURGING...' : 'PURGE EDGE CACHE'}</span>
          </button>

          <button
            onClick={handleReset}
            disabled={saving}
            className="px-3 py-2 bg-white hover:bg-red-50 border border-outside-border hover:border-outside-crimson/40 text-outside-muted hover:text-outside-crimson text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RESET</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-outside-crimson hover:bg-outside-crimsonHover text-white text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'COMMITTING...' : 'SAVE CONFIGURATION'}</span>
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`p-3 text-xs border flex items-center justify-between transition-all ${
            notification.type === 'success'
              ? 'bg-outside-moss/10 text-outside-moss border-outside-moss/30'
              : notification.type === 'error'
              ? 'bg-outside-crimson/10 text-outside-crimson border-outside-crimson/30'
              : 'bg-outside-surface text-outside-text border-outside-border'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-[10px] uppercase tracking-wider font-bold underline"
          >
            DISMISS
          </button>
        </div>
      )}

      {lastPurgedAt && (
        <div className="p-3 bg-outside-moss/10 border border-outside-moss/30 text-outside-moss text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Edge cache, XML sitemaps, and LLM text endpoints purged at {lastPurgedAt} IST.</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider">STATUS 200 OK</span>
        </div>
      )}

      {/* Studio Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-outside-border pb-3">
        <button
          onClick={() => setActiveTab('serp')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 border ${
            activeTab === 'serp'
              ? 'bg-outside-text text-white border-outside-text shadow-sm'
              : 'bg-white hover:bg-outside-surface text-outside-muted border-outside-border'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>SERP &amp; SOCIAL PREVIEWER</span>
        </button>

        <button
          onClick={() => setActiveTab('og')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 border ${
            activeTab === 'og'
              ? 'bg-outside-text text-white border-outside-text shadow-sm'
              : 'bg-white hover:bg-outside-surface text-outside-muted border-outside-border'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>DYNAMIC OG STUDIO</span>
        </button>

        <button
          onClick={() => setActiveTab('crawlers')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 border ${
            activeTab === 'crawlers'
              ? 'bg-outside-text text-white border-outside-text shadow-sm'
              : 'bg-white hover:bg-outside-surface text-outside-muted border-outside-border'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AI CRAWLER GOVERNANCE</span>
        </button>

        <button
          onClick={() => setActiveTab('llms')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 border ${
            activeTab === 'llms'
              ? 'bg-outside-text text-white border-outside-text shadow-sm'
              : 'bg-white hover:bg-outside-surface text-outside-muted border-outside-border'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>AEO / LLMS.TXT MANIFESTO</span>
        </button>

        <button
          onClick={() => setActiveTab('redirects')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 border ${
            activeTab === 'redirects'
              ? 'bg-outside-text text-white border-outside-text shadow-sm'
              : 'bg-white hover:bg-outside-surface text-outside-muted border-outside-border'
          }`}
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>REDIRECT MANAGER ({config.redirects.length})</span>
        </button>
      </div>

      {/* TAB 1: SERP & SOCIAL PREVIEWER */}
      {activeTab === 'serp' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form Column */}
            <div className="lg:col-span-5 space-y-5">
              <div className="p-5 bg-white border border-outside-border space-y-4 shadow-sm">
                <h3 className="text-xs uppercase tracking-wider font-bold text-outside-text flex items-center gap-2">
                  <Globe className="w-4 h-4 text-outside-crimson" />
                  <span>CORE BRAND METADATA</span>
                </h3>

                {/* Default Title */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="text-outside-muted font-bold">SEO TITLE TAG</label>
                    <span
                      className={`text-[11px] font-bold ${
                        titleLength > 60 ? 'text-outside-crimson' : titleLength >= 45 ? 'text-outside-moss' : 'text-outside-muted'
                      }`}
                    >
                      {titleLength} / 60 chars {titleLength > 60 && '(Truncated on SERP)'}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={config.defaultTitle}
                    onChange={(e) => setConfig({ ...config, defaultTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-outside-surface/60 border border-outside-border text-outside-text text-xs focus:outline-none focus:border-outside-text font-sans"
                  />
                  <div className="w-full h-1 bg-outside-border overflow-hidden rounded-full">
                    <div
                      className={`h-full transition-all ${
                        titleLength > 60 ? 'bg-outside-crimson' : titleLength >= 45 ? 'bg-outside-moss' : 'bg-outside-muted'
                      }`}
                      style={{ width: `${Math.min(100, (titleLength / 60) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Meta Description */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="text-outside-muted font-bold">META DESCRIPTION</label>
                    <span
                      className={`text-[11px] font-bold ${
                        descLength > 160 ? 'text-outside-crimson' : descLength >= 120 ? 'text-outside-moss' : 'text-outside-muted'
                      }`}
                    >
                      {descLength} / 160 chars
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={config.defaultMetaDescription}
                    onChange={(e) => setConfig({ ...config, defaultMetaDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-outside-surface/60 border border-outside-border text-outside-text text-xs focus:outline-none focus:border-outside-text font-sans leading-relaxed"
                  />
                  <div className="w-full h-1 bg-outside-border overflow-hidden rounded-full">
                    <div
                      className={`h-full transition-all ${
                        descLength > 160 ? 'bg-outside-crimson' : descLength >= 120 ? 'bg-outside-moss' : 'bg-outside-muted'
                      }`}
                      style={{ width: `${Math.min(100, (descLength / 160) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Title Template */}
                <div className="space-y-1.5">
                  <label className="text-xs text-outside-muted font-bold">TITLE TEMPLATE</label>
                  <input
                    type="text"
                    value={config.titleTemplate}
                    onChange={(e) => setConfig({ ...config, titleTemplate: e.target.value })}
                    className="w-full px-3 py-2 bg-outside-surface/60 border border-outside-border text-outside-text text-xs focus:outline-none focus:border-outside-text font-mono"
                  />
                  <p className="text-[11px] text-outside-muted font-sans">
                    Use <code className="bg-outside-border px-1 py-0.5 text-outside-text">%s</code> as placeholder for drop titles.
                  </p>
                </div>

                {/* Waitlist Referral Toggle */}
                <div className="pt-2 border-t border-outside-border flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-outside-text">WAITLIST VIRAL REFERRAL HOOK</div>
                    <div className="text-[11px] text-outside-muted font-sans">
                      Display one-tap invite card after visitor signs up for waitlist.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.enableWaitlistReferral}
                    onChange={(e) => setConfig({ ...config, enableWaitlistReferral: e.target.checked })}
                    className="w-4 h-4 accent-outside-crimson"
                  />
                </div>
              </div>
            </div>

            {/* Live Previews Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Google SERP Preview Card */}
              <div className="p-5 bg-white border border-outside-border space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-outside-border">
                  <div className="flex items-center gap-2 text-xs font-bold text-outside-text">
                    <Search className="w-3.5 h-3.5 text-blue-600" />
                    <span>GOOGLE SERP SIMULATOR (2026 DESKTOP / MOBILE)</span>
                  </div>

                  <div className="flex items-center gap-1 bg-outside-surface p-1 border border-outside-border text-[11px]">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`px-2.5 py-1 font-bold ${
                        previewDevice === 'desktop' ? 'bg-white text-outside-text shadow-xs' : 'text-outside-muted'
                      }`}
                    >
                      Desktop
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`px-2.5 py-1 font-bold ${
                        previewDevice === 'mobile' ? 'bg-white text-outside-text shadow-xs' : 'text-outside-muted'
                      }`}
                    >
                      Mobile
                    </button>
                  </div>
                </div>

                {/* Google Result Box */}
                <div
                  className={`p-4 bg-white border border-outside-border rounded-lg ${
                    previewDevice === 'mobile' ? 'max-w-sm mx-auto' : ''
                  }`}
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  {/* Google Favicon & URL Bar */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-[10px] text-white font-bold">
                      O
                    </div>
                    <div className="text-xs text-gray-700 leading-tight">
                      <div className="font-semibold text-gray-900">OUTSIDE India</div>
                      <div className="text-[11px] text-gray-500 truncate">https://www.outside.in › drops › drop-001</div>
                    </div>
                  </div>

                  {/* Google Blue Title */}
                  <h4 className="text-blue-800 hover:underline text-lg font-normal leading-snug cursor-pointer line-clamp-2">
                    {config.defaultTitle}
                  </h4>

                  {/* Google Snippet */}
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed line-clamp-3">
                    <span className="text-gray-400">Nov 20, 2026 — </span>
                    {config.defaultMetaDescription}
                  </p>

                  {/* Schema Breadcrumb Extension */}
                  <div className="flex items-center gap-3 mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                    <span className="text-emerald-700 font-medium">In stock · ₹2,400</span>
                    <span>•</span>
                    <span>Ahmedabad, Gujarat</span>
                    <span>•</span>
                    <span>280 GSM Cotton</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp / Social Card Preview */}
              <div className="p-5 bg-white border border-outside-border space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-outside-border">
                  <div className="flex items-center gap-2 text-xs font-bold text-outside-text">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>VIRAL SOCIAL SHARE CARD PREVIEW</span>
                  </div>

                  <div className="flex items-center gap-1 bg-outside-surface p-1 border border-outside-border text-[11px]">
                    <button
                      onClick={() => setSocialPlatform('whatsapp')}
                      className={`px-2.5 py-1 font-bold ${
                        socialPlatform === 'whatsapp' ? 'bg-white text-outside-text shadow-xs' : 'text-outside-muted'
                      }`}
                    >
                      WhatsApp
                    </button>
                    <button
                      onClick={() => setSocialPlatform('x')}
                      className={`px-2.5 py-1 font-bold ${
                        socialPlatform === 'x' ? 'bg-white text-outside-text shadow-xs' : 'text-outside-muted'
                      }`}
                    >
                      X (Twitter)
                    </button>
                    <button
                      onClick={() => setSocialPlatform('linkedin')}
                      className={`px-2.5 py-1 font-bold ${
                        socialPlatform === 'linkedin' ? 'bg-white text-outside-text shadow-xs' : 'text-outside-muted'
                      }`}
                    >
                      LinkedIn
                    </button>
                  </div>
                </div>

                {/* WhatsApp Chat Bubble Mockup */}
                {socialPlatform === 'whatsapp' && (
                  <div className="max-w-md mx-auto bg-[#EFEAE2] p-4 rounded-xl border border-outside-border">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                      {/* OG Image Frame */}
                      <div className="relative aspect-[1200/630] bg-[#F7F5F0] border-b border-gray-200 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/api/og?drop=001"
                          alt="OUTSIDE OG Card"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                          1200 × 630 EDGE OG
                        </div>
                      </div>

                      {/* WhatsApp Metadata Preview */}
                      <div className="p-3 bg-[#F0F2F5] space-y-1">
                        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold truncate">
                          OUTSIDE.IN
                        </div>
                        <div className="text-xs font-bold text-gray-900 line-clamp-1">
                          {config.defaultTitle}
                        </div>
                        <div className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                          {config.defaultMetaDescription}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-500 text-right">12:45 PM ✓✓</div>
                  </div>
                )}

                {/* X (Twitter) Card Mockup */}
                {socialPlatform === 'x' && (
                  <div className="max-w-md mx-auto bg-black text-white p-4 rounded-xl">
                    <div className="rounded-2xl border border-neutral-800 overflow-hidden bg-black">
                      <div className="relative aspect-[1200/630] bg-[#F7F5F0]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/api/og?drop=001"
                          alt="OUTSIDE OG Card"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 space-y-1 bg-black">
                        <div className="text-xs text-neutral-500">outside.in</div>
                        <div className="text-xs font-bold text-white line-clamp-1">{config.defaultTitle}</div>
                        <div className="text-[11px] text-neutral-400 line-clamp-2">{config.defaultMetaDescription}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* LinkedIn Card Mockup */}
                {socialPlatform === 'linkedin' && (
                  <div className="max-w-md mx-auto bg-white p-4 rounded-xl border border-outside-border shadow-sm">
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      <div className="relative aspect-[1200/630] bg-[#F7F5F0]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/api/og?drop=001"
                          alt="OUTSIDE OG Card"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 bg-[#F9FAFB] space-y-1">
                        <div className="text-xs font-bold text-gray-900 line-clamp-1">{config.defaultTitle}</div>
                        <div className="text-[11px] text-gray-500">outside.in · 1 min read</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DYNAMIC OG STUDIO */}
      {activeTab === 'og' && (
        <div className="space-y-6">
          <div className="p-6 bg-white border border-outside-border space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-outside-border">
              <div>
                <h3 className="text-sm font-display font-bold uppercase tracking-wider text-outside-text">
                  EDGE-GENERATED DYNAMIC SOCIAL SHARE CARDS
                </h3>
                <p className="text-xs text-outside-muted font-sans mt-0.5">
                  Generated in &lt;50ms at edge runtime via <code className="bg-outside-surface px-1 py-0.5">next/og</code>. Real-time typography, price tags, and serialized drop badges.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/api/og?drop=001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-outside-surface hover:bg-outside-border text-outside-text text-xs uppercase tracking-wider font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <span>OPEN FULL 1200×630</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* High-res Image Preview */}
            <div className="space-y-4">
              <div className="relative aspect-[1200/630] max-w-4xl mx-auto border-2 border-outside-border bg-outside-bg shadow-luxury overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/api/og?drop=001"
                  alt="OUTSIDE Live Edge OpenGraph Card"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-outside-border text-xs">
                <div className="p-3 bg-outside-surface/60 border border-outside-border space-y-1">
                  <div className="text-[10px] text-outside-muted uppercase font-bold">EDGE ENDPOINT</div>
                  <div className="font-mono text-outside-text truncate">/api/og?drop=001</div>
                </div>
                <div className="p-3 bg-outside-surface/60 border border-outside-border space-y-1">
                  <div className="text-[10px] text-outside-muted uppercase font-bold">DIMENSIONS</div>
                  <div className="font-mono text-outside-text">1200 × 630 px (1.90:1 ratio)</div>
                </div>
                <div className="p-3 bg-outside-surface/60 border border-outside-border space-y-1">
                  <div className="text-[10px] text-outside-muted uppercase font-bold">CACHING POLICY</div>
                  <div className="font-mono text-outside-moss font-bold">s-maxage=86400, stale-while-revalidate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI CRAWLER GOVERNANCE */}
      {activeTab === 'crawlers' && (
        <div className="space-y-6">
          <div className="p-6 bg-white border border-outside-border space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-outside-border">
              <div>
                <h3 className="text-sm font-display font-bold uppercase tracking-wider text-outside-text flex items-center gap-2">
                  <Bot className="w-4 h-4 text-outside-crimson" />
                  <span>AI SEARCH ENGINE &amp; CRAWLER ACCESS MATRIX</span>
                </h3>
                <p className="text-xs text-outside-muted font-sans mt-0.5">
                  Govern indexing and training access for leading generative search engines in <code className="bg-outside-surface px-1 py-0.5">/robots.txt</code>.
                </p>
              </div>

              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-outside-surface hover:bg-outside-border text-outside-text text-xs uppercase tracking-wider font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <span>VIEW LIVE ROBOTS.TXT</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Bot Matrix Table */}
            <div className="divide-y divide-outside-border border border-outside-border">
              {[
                {
                  id: 'googlebot' as const,
                  name: 'Googlebot & Google Other',
                  agent: 'Googlebot',
                  purpose: 'Core Google search indexing, Google Lens visual search, and AI Overviews.',
                  badge: 'CRITICAL FOR SEO',
                  badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
                },
                {
                  id: 'bingbot' as const,
                  name: 'Bingbot & Microsoft Copilot',
                  agent: 'bingbot',
                  purpose: 'Microsoft Bing indexation and Copilot shopping citations.',
                  badge: 'RECOMMENDED',
                  badgeColor: 'text-outside-muted bg-outside-surface border-outside-border',
                },
                {
                  id: 'oaiSearch' as const,
                  name: 'OAI-SearchBot (OpenAI SearchGPT)',
                  agent: 'OAI-SearchBot',
                  purpose: 'Powers real-time product discovery and direct answers in ChatGPT Search.',
                  badge: 'AEO CRITICAL',
                  badgeColor: 'text-outside-moss bg-outside-moss/10 border-outside-moss/30',
                },
                {
                  id: 'perplexity' as const,
                  name: 'PerplexityBot (Perplexity AI)',
                  agent: 'PerplexityBot',
                  purpose: 'Conversational shopping discovery engine citations and direct link cards.',
                  badge: 'GEO CRITICAL',
                  badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
                },
                {
                  id: 'claudeBot' as const,
                  name: 'ClaudeBot (Anthropic)',
                  agent: 'ClaudeBot',
                  purpose: 'Anthropic knowledge crawls and real-time Claude web reasoning.',
                  badge: 'OPTIONAL',
                  badgeColor: 'text-outside-muted bg-outside-surface border-outside-border',
                },
              ].map((crawler) => {
                const isAllowed = config.crawlerPolicies[crawler.id];
                return (
                  <div key={crawler.id} className="p-4 sm:flex sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-outside-text">{crawler.name}</span>
                        <code className="text-[10px] text-outside-muted font-mono bg-outside-surface px-1 py-0.5">
                          User-agent: {crawler.agent}
                        </code>
                        <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 border ${crawler.badgeColor}`}>
                          {crawler.badge}
                        </span>
                      </div>
                      <p className="text-xs text-outside-muted font-sans">{crawler.purpose}</p>
                    </div>

                    <div className="mt-3 sm:mt-0 flex items-center gap-3">
                      <span className={`text-xs font-bold uppercase tracking-wider ${isAllowed ? 'text-outside-moss' : 'text-outside-crimson'}`}>
                        {isAllowed ? 'ALLOWED (200)' : 'DISALLOWED (403)'}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setConfig({
                            ...config,
                            crawlerPolicies: {
                              ...config.crawlerPolicies,
                              [crawler.id]: !isAllowed,
                            },
                          })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isAllowed ? 'bg-outside-moss' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isAllowed ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AEO / LLMS.TXT MANIFESTO */}
      {activeTab === 'llms' && (
        <div className="space-y-6">
          <div className="p-6 bg-white border border-outside-border space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-outside-border">
              <div>
                <h3 className="text-sm font-display font-bold uppercase tracking-wider text-outside-text flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-outside-crimson" />
                  <span>AEO / GEO KNOWLEDGE BASE &amp; LLMS.TXT MANIFESTO</span>
                </h3>
                <p className="text-xs text-outside-muted font-sans mt-0.5">
                  Direct plain-markdown context served at <code className="bg-outside-surface px-1 py-0.5">/llms.txt</code> for LLMs to cite verified facts.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-outside-surface hover:bg-outside-border text-outside-text text-xs uppercase tracking-wider font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <span>VIEW /LLMS.TXT</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="/llms-full.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-outside-surface hover:bg-outside-border text-outside-text text-xs uppercase tracking-wider font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <span>VIEW /LLMS-FULL.TXT</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-outside-muted font-bold">BRAND MANIFESTO &amp; VERIFIED ENTITY CLAIMS</label>
                <span className="text-outside-muted font-mono">{config.llmsManifesto?.length || 0} characters</span>
              </div>
              <textarea
                rows={10}
                value={config.llmsManifesto}
                onChange={(e) => setConfig({ ...config, llmsManifesto: e.target.value })}
                className="w-full p-4 bg-outside-surface/60 border border-outside-border text-outside-text text-xs font-mono leading-relaxed focus:outline-none focus:border-outside-text"
              />
              <p className="text-[11px] text-outside-muted font-sans leading-relaxed">
                Tip: Maintain exact consistency across GSM cotton specs (280 GSM), origin (Ahmedabad, Gujarat State Code 24), GST slab rates (5% ≤ ₹2,500, 18% &gt; ₹2,500), and Women-First sizing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REDIRECT MANAGER */}
      {activeTab === 'redirects' && (
        <div className="space-y-6">
          <div className="p-6 bg-white border border-outside-border space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-outside-border">
              <div>
                <h3 className="text-sm font-display font-bold uppercase tracking-wider text-outside-text flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-outside-crimson" />
                  <span>301 / 308 PERMANENT REDIRECT CONTROLLER</span>
                </h3>
                <p className="text-xs text-outside-muted font-sans mt-0.5">
                  Preserve SEO link juice when drops or legacy URLs move without touching middleware code.
                </p>
              </div>
            </div>

            {/* Add New Redirect Form */}
            <form onSubmit={handleAddRedirect} className="p-4 bg-outside-surface/60 border border-outside-border space-y-3">
              <div className="text-xs font-bold text-outside-text uppercase">CREATE NEW REDIRECT RULE</div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-4">
                  <label className="block text-[10px] text-outside-muted uppercase font-bold mb-1">
                    SOURCE PATH (FROM)
                  </label>
                  <input
                    type="text"
                    placeholder="/old-path or /drop"
                    value={newFrom}
                    onChange={(e) => setNewFrom(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-outside-border text-xs text-outside-text font-mono focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[10px] text-outside-muted uppercase font-bold mb-1">
                    TARGET PATH (TO)
                  </label>
                  <input
                    type="text"
                    placeholder="/vault or /"
                    value={newTo}
                    onChange={(e) => setNewTo(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-outside-border text-xs text-outside-text font-mono focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-outside-muted uppercase font-bold mb-1">
                    HTTP STATUS
                  </label>
                  <select
                    value={newPermanent ? '308' : '307'}
                    onChange={(e) => setNewPermanent(e.target.value === '308')}
                    className="w-full px-2.5 py-1.5 bg-white border border-outside-border text-xs text-outside-text font-mono focus:outline-none"
                  >
                    <option value="308">308 Permanent</option>
                    <option value="307">307 Temporary</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex items-end">
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-outside-text hover:bg-black text-white text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ADD RULE</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Existing Redirects Table */}
            <div className="border border-outside-border overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-outside-surface text-outside-muted uppercase font-bold border-b border-outside-border text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">SOURCE (FROM)</th>
                    <th className="py-2.5 px-4">DESTINATION (TO)</th>
                    <th className="py-2.5 px-4">STATUS</th>
                    <th className="py-2.5 px-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outside-border">
                  {config.redirects.map((redirect, idx) => (
                    <tr key={idx} className="hover:bg-outside-surface/40">
                      <td className="py-2.5 px-4 font-mono font-bold text-outside-text">{redirect.from}</td>
                      <td className="py-2.5 px-4 font-mono text-outside-muted">{redirect.to}</td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`text-[9px] uppercase font-bold px-2 py-0.5 border ${
                            redirect.permanent
                              ? 'bg-outside-moss/10 text-outside-moss border-outside-moss/30'
                              : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}
                        >
                          {redirect.permanent ? '308 PERMANENT' : '307 TEMPORARY'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => handleRemoveRedirect(idx)}
                          className="text-outside-muted hover:text-outside-crimson transition-colors p-1"
                          title="Delete redirect rule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {config.redirects.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-outside-muted text-xs">
                        No custom redirect rules defined. All requests follow standard App Router routing.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

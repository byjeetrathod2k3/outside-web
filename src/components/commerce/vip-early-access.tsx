'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Crown, Sparkles } from 'lucide-react';

export function VipEarlyAccess({ className = '' }: { className?: string }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section id="vip" className={`relative overflow-hidden py-16 sm:py-20 bg-[#111110] text-[#FCFBF8] border-b border-[#383632] ${className}`}>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        {/* Subtle VIP Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#383632]/80 border border-[#4F4C45] text-xs font-mono font-bold tracking-[0.25em] uppercase text-amber-400">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>VIP TRANSMISSION · EARLY ACCESS</span>
        </div>

        {/* Minimal Headline */}
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-[#FCFBF8] uppercase">
            NEVER MISS A DROP.
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A49C] max-w-lg mx-auto font-sans leading-relaxed">
            Join 1,840+ collectors receiving encrypted private access links 1 hour before numbered runs open to the public.
          </p>
        </div>

        {/* Email Capture Input Band */}
        <div className="max-w-md mx-auto pt-2">
          {submitted ? (
            <div className="p-4 rounded-xl bg-[#2D5A27]/20 border border-[#2D5A27] text-white flex items-center justify-center gap-2.5 font-mono text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ACCESS CONFIRMED · WELCOME TO THE VIP ROSTER</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 font-mono">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 min-h-[48px] px-4 rounded-full sm:rounded-l-full sm:rounded-r-none bg-[#1C1B19] border border-[#4F4C45] text-[#FCFBF8] placeholder-[#736E66] text-xs focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="min-h-[48px] px-6 rounded-full sm:rounded-r-full sm:rounded-l-none bg-[#B82328] hover:bg-[#9E1B20] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
              >
                <span>{loading ? 'SECURING...' : 'REQUEST ACCESS'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        <p className="text-[10px] font-mono text-[#736E66] uppercase tracking-wider">
          STRICTLY ZERO SPAM · INSTANT ONE-CLICK UNSUBSCRIBE ANYTIME
        </p>

      </div>
    </section>
  );
}

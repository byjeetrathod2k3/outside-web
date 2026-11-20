'use client';

import React, { useState } from 'react';
import { Mail, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'CONTACT_INQUIRY',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.inquiryType,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          source: 'contact-page',
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-outside-black text-outside-chalk min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="border-b border-outside-border pb-8 space-y-3">
          <span className="text-xs font-mono text-outside-crimson uppercase tracking-widest">
            STUDIO LIAISON // CONCIERGE &amp; PRESS
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white uppercase">
            Direct Studio Communication.
          </h1>
          <p className="text-sm text-outside-muted max-w-xl leading-relaxed">
            For collector sizing assistance, press inquiries, or studio appointment requests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Left: Studio Information */}
          <div className="md:col-span-5 space-y-8">
            <div className="p-6 bg-outside-surface border border-outside-border space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white">
                AHMEDABAD ATELIER
              </h3>
              <div className="space-y-3 text-xs font-mono text-outside-muted">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-outside-crimson flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">OUTSIDE APPAREL STUDIO PVT LTD</strong>
                    <p className="mt-0.5">Plot 104, Design District, SG Highway</p>
                    <p>Ahmedabad, Gujarat 380015, India</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Mail className="w-4 h-4 text-outside-crimson flex-shrink-0" />
                  <a href="mailto:support@outside.in" className="hover:text-white">
                    support@outside.in
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 bg-outside-surface border border-outside-border font-mono text-xs space-y-2">
              <span className="text-outside-crimson font-bold">GST &amp; TAX IDENTIFICATION</span>
              <p className="text-outside-muted">GSTIN: 24AABCO1234F1Z5</p>
              <p className="text-outside-muted">Origin State: Gujarat (Code 24)</p>
              <p className="text-outside-muted">Response Velocity: &lt; 24 Business Hours</p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="md:col-span-7 bg-outside-surface border border-outside-border p-8">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-outside-crimson mx-auto" />
                <h3 className="text-lg font-mono uppercase tracking-wider text-white">
                  MESSAGE DISPATCHED
                </h3>
                <p className="text-xs text-outside-muted max-w-sm mx-auto leading-relaxed">
                  Thank you. A studio liaison will review your transmission and reply within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-outside-muted mb-2">
                    INQUIRY CLASSIFICATION
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full bg-outside-card border border-outside-border px-4 py-3 text-xs font-mono text-white focus:border-outside-crimson focus:outline-none"
                  >
                    <option value="CONTACT_INQUIRY">General Studio Inquiry / Sizing</option>
                    <option value="PRESS_COLLAB">Press, Editorial &amp; Collaborations</option>
                    <option value="WHOLESALE">Select Retail / Gallery Partner</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-outside-muted mb-2">
                      YOUR FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Diya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-outside-card border border-outside-border px-4 py-3 text-xs font-mono text-white focus:border-outside-crimson focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-outside-muted mb-2">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="diya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-outside-card border border-outside-border px-4 py-3 text-xs font-mono text-white focus:border-outside-crimson focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-outside-muted mb-2">
                    PHONE NUMBER (OPTIONAL)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-outside-card border border-outside-border px-4 py-3 text-xs font-mono text-white focus:border-outside-crimson focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-outside-muted mb-2">
                    YOUR MESSAGE *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Provide details regarding your inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-outside-card border border-outside-border px-4 py-3 text-xs font-mono text-white focus:border-outside-crimson focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-outside-crimson hover:bg-outside-crimsonBright text-white font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{loading ? 'TRANSMITTING...' : 'TRANSMIT MESSAGE'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

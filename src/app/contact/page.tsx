'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';

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
    <div className="bg-outside-bg text-outside-text min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="border-b border-outside-border pb-8">
          <SectionHeading
            align="left"
            eyebrow="STUDIO CONTACT // SUPPORT &amp; PRESS"
            title="Direct Studio Communication."
            description="For collector sizing assistance, press inquiries, or studio appointment requests."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Left: Studio Information */}
          <div className="md:col-span-5 space-y-8">
            <div className="p-6 bg-white border border-outside-border space-y-4 shadow-luxury">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-outside-text font-bold">
                AHMEDABAD STUDIO
              </h3>
              <div className="space-y-3 text-xs font-mono text-outside-muted">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-outside-crimson flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-outside-text">OUTSIDE APPAREL STUDIO PVT LTD</strong>
                    <p className="mt-0.5">Plot 104, Design District, SG Highway</p>
                    <p>Ahmedabad, Gujarat 380015, India</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Mail className="w-4 h-4 text-outside-crimson flex-shrink-0" />
                  <a href="mailto:support@outside.in" className="hover:text-outside-crimson transition-colors font-semibold">
                    support@outside.in
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border border-outside-border font-mono text-xs space-y-2 shadow-sm">
              <span className="text-outside-crimson font-bold">GST IDENTIFICATION</span>
              <p className="text-outside-muted">GSTIN: 24AABCO1234F1Z5</p>
              <p className="text-outside-muted">100% GST Compliant (Registered in India)</p>
              <p className="text-outside-muted">Response Time: &lt; 24 Business Hours</p>
            </div>

            <div className="p-6 bg-white border border-outside-border font-mono text-xs space-y-2 shadow-sm">
              <span className="text-outside-crimson font-bold">GRIEVANCE REDRESSAL OFFICER</span>
              <p className="text-outside-text font-bold">Mr. Rohan Mehta</p>
              <p className="text-outside-muted">Designation: Grievance Officer &amp; Customer Ops</p>
              <p className="text-outside-muted">Email: grievance@outside.in</p>
              <p className="text-outside-muted">Direct: +91 79 4000 8920</p>
              <p className="text-[10px] text-outside-muted pt-1">
                Statutory Timelines (Consumer Protection Rules, 2020):<br />
                · Acknowledgment within 48 hours<br />
                · Complete resolution within 30 days
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="md:col-span-7 bg-white border border-outside-border p-8 shadow-luxury">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-outside-crimson mx-auto" />
                <h3 className="text-lg font-mono uppercase tracking-wider text-outside-text font-bold">
                  MESSAGE SENT
                </h3>
                <p className="text-xs text-outside-muted max-w-sm mx-auto leading-relaxed font-sans">
                  Thank you. Our customer support team will reply within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-outside-muted mb-2 font-semibold">
                    INQUIRY CLASSIFICATION
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full bg-white border border-outside-border px-4 py-3 text-xs font-mono text-outside-text focus:border-outside-crimson focus:outline-none"
                  >
                    <option value="CONTACT_INQUIRY">General Studio Inquiry / Sizing</option>
                    <option value="PRESS_COLLAB">Press, Editorial &amp; Collaborations</option>
                    <option value="WHOLESALE">Select Retail / Gallery Partner</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-outside-muted mb-2 font-semibold">
                      YOUR FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Diya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-outside-border px-4 py-3 text-xs font-mono text-outside-text focus:border-outside-crimson focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-outside-muted mb-2 font-semibold">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="diya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-outside-border px-4 py-3 text-xs font-mono text-outside-text focus:border-outside-crimson focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-outside-muted mb-2 font-semibold">
                    PHONE NUMBER (OPTIONAL)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-outside-border px-4 py-3 text-xs font-mono text-outside-text focus:border-outside-crimson focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-outside-muted mb-2 font-semibold">
                    YOUR MESSAGE *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Provide details regarding your inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-outside-border px-4 py-3 text-xs font-mono text-outside-text focus:border-outside-crimson focus:outline-none"
                  />
                </div>

                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="contact-consent"
                    required
                    className="mt-0.5 w-4 h-4 accent-outside-crimson cursor-pointer shrink-0"
                  />
                  <label htmlFor="contact-consent" className="text-[11px] text-outside-muted font-sans leading-tight cursor-pointer">
                    I consent to OUTSIDE storing and processing my contact details solely to respond to this inquiry in accordance with the{' '}
                    <Link href="/privacy-policy" className="underline hover:text-outside-text" target="_blank">
                      Privacy Policy
                    </Link>{' '}
                    (DPDP Act, 2023).
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="w-full text-xs"
                >
                  <span>TRANSMIT MESSAGE</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Users, Download, Filter, Mail, Phone } from 'lucide-react';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch('/api/leads');
        if (res.ok) {
          const data = await res.json();
          setLeads(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  const filteredLeads =
    filterType === 'ALL' ? leads : leads.filter((l) => l.type === filterType);

  const handleExportCsv = () => {
    const headers = ['ID', 'Type', 'Status', 'Name', 'Email', 'Phone', 'Fit', 'Size', 'Source', 'Date'];
    const rows = filteredLeads.map((l) => [
      l.id,
      l.type,
      l.status,
      `"${l.name || ''}"`,
      l.email,
      l.phone || '',
      l.preferredFit || '',
      l.preferredSize || '',
      l.source || '',
      l.createdAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OUTSIDE_Leads_CRM_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 font-mono">
      
      {/* Header */}
      <div className="border-b border-outside-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase text-outside-crimson font-bold tracking-[0.25em]">
            COLLECTOR WAITLIST &amp; CRM INTELLIGENCE
          </span>
          <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight mt-1">
            Waitlist &amp; Inquiries ({filteredLeads.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 bg-outside-surface border border-outside-border hover:border-outside-crimson text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-outside-crimson" />
            <span>EXPORT LEADS CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        {['ALL', 'DROP_WAITLIST', 'CONTACT_INQUIRY', 'PRESS_COLLAB'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 border transition-all uppercase ${
              filterType === type
                ? 'bg-outside-crimson border-outside-crimson text-white font-bold'
                : 'bg-outside-surface border-outside-border text-outside-muted hover:text-white'
            }`}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-outside-surface border border-outside-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-xs text-outside-muted">LOADING COLLECTOR PIPELINE...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-outside-muted text-xs">
            NO LEADS RECORDED IN THIS CATEGORY.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-outside-card border-b border-outside-border text-outside-muted text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="p-4">Collector</th>
                  <th className="p-4">Classification</th>
                  <th className="p-4">Preferences</th>
                  <th className="p-4">Origin Channel</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Captured</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outside-border/40">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-outside-card/50 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-white block">{lead.name || 'Anonymous'}</span>
                      <span className="text-[10px] text-outside-muted block">{lead.email}</span>
                      {lead.phone && (
                        <span className="text-[10px] text-outside-muted block">{lead.phone}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-outside-card border border-outside-border text-outside-chalkDim text-[10px]">
                        {lead.type}
                      </span>
                      {lead.message && (
                        <p className="text-[10px] text-outside-muted italic mt-1 line-clamp-1">
                          &quot;{lead.message}&quot;
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-[11px]">
                      {lead.preferredFit || lead.preferredSize ? (
                        <span className="text-white">
                          {lead.preferredFit || 'ANY'} · {lead.preferredSize || 'ANY'}
                        </span>
                      ) : (
                        <span className="text-outside-muted">-</span>
                      )}
                    </td>
                    <td className="p-4 text-[10px] text-outside-muted">
                      {lead.source || 'direct'}
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] text-outside-crimson font-bold">
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-right text-[10px] text-outside-muted">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

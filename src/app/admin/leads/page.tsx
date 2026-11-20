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
    a.download = `outside-leads-${Date.now()}.csv`;
    a.click();
  };

  const handleEraseLead = async (id: string, email: string) => {
    if (!confirm(`DPDP ACT 2023 ERASURE: Are you sure you want to permanently erase all personal data for ${email}? This action is logged immutably.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
      } else {
        alert('Failed to erase lead personal data.');
      }
    } catch (e) {
      alert('Error during DPDP erasure operation.');
    }
  };

  return (
    <div className="space-y-8 font-mono">
      
      {/* Header */}
      <div className="border-b border-[#DCD7CC] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase text-[#B82328] font-bold tracking-[0.25em]">
            COLLECTOR WAITLIST &amp; CRM INTELLIGENCE
          </span>
          <h1 className="text-2xl font-display font-black text-[#111110] uppercase tracking-tight mt-1">
            Waitlist &amp; Inquiries ({filteredLeads.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 bg-[#111110] hover:bg-[#B82328] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
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
            className={`px-3 py-1.5 border transition-all uppercase cursor-pointer ${
              filterType === type
                ? 'bg-[#111110] border-[#111110] text-white font-bold shadow-sm'
                : 'bg-[#EDEAE2] border-[#DCD7CC] text-[#52504B] hover:text-[#111110] hover:border-[#111110]/50'
            }`}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#FCFBF8] border border-[#DCD7CC] overflow-hidden shadow-editorial">
        {loading ? (
          <div className="p-8 text-xs text-[#52504B]">LOADING COLLECTOR PIPELINE...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-[#52504B] text-xs">
            NO LEADS RECORDED IN THIS CATEGORY.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EDEAE2]/50 border-b border-[#DCD7CC] text-[#52504B] text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="p-4">Collector</th>
                  <th className="p-4">Classification</th>
                  <th className="p-4">Preferences</th>
                  <th className="p-4">Origin Channel</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Captured</th>
                  <th className="p-4 text-right">DPDP Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCD7CC]">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#EDEAE2]/30 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-[#111110] block">{lead.name || 'Anonymous'}</span>
                      <span className="text-[10px] text-[#52504B] block">{lead.email}</span>
                      {lead.phone && (
                        <span className="text-[10px] text-[#52504B] block font-mono">{lead.phone}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-[#EDEAE2] border border-[#DCD7CC] text-[#52504B] text-[10px] uppercase font-bold">
                        {lead.type}
                      </span>
                      {lead.message && (
                        <p className="text-[10px] text-[#52504B] italic mt-1 line-clamp-1">
                          &quot;{lead.message}&quot;
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-[11px]">
                      {lead.preferredFit || lead.preferredSize ? (
                        <span className="text-[#111110] font-bold">
                          {lead.preferredFit || 'ANY'} · {lead.preferredSize || 'ANY'}
                        </span>
                      ) : (
                        <span className="text-[#52504B]">-</span>
                      )}
                    </td>
                    <td className="p-4 text-[10px] text-[#52504B]">
                      {lead.source || 'direct'}
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] px-2 py-0.5 bg-[#3F4E44]/10 text-[#3F4E44] border border-[#3F4E44]/30 font-bold uppercase tracking-wider">
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-right text-[10px] text-[#52504B] font-mono">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleEraseLead(lead.id, lead.email)}
                        className="px-2.5 py-1 bg-[#B82328]/10 hover:bg-[#B82328] text-[#B82328] hover:text-white border border-[#B82328]/30 text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer"
                        title="Permanently erase personal identifying data under DPDP Act 2023"
                      >
                        ERASE (DPDP)
                      </button>
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

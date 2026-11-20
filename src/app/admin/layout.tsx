import React from 'react';
import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export const metadata: Metadata = {
  title: 'Studio Command // OUTSIDE Admin',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#111110] flex flex-col md:flex-row font-mono antialiased w-full max-w-full overflow-x-hidden">
      {/* Mobile-Ready Daylight Studio Admin Sidebar */}
      <AdminSidebar />

      {/* Main Daylight Workspace */}
      <main className="flex-1 overflow-y-auto bg-[#FCFBF8] p-4 sm:p-6 md:p-10 min-w-0 max-w-full">
        {children}
      </main>
    </div>
  );
}

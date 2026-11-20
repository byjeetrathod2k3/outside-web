import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import {
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Users,
  Settings,
  Mail,
  FileText,
  ShieldAlert,
  LogOut,
  ExternalLink,
} from 'lucide-react';

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
    <div className="min-h-screen bg-outside-black text-outside-chalk flex flex-col md:flex-row font-mono antialiased">
      
      {/* Studio Admin Sidebar */}
      <aside className="w-full md:w-64 bg-outside-charcoal border-r border-outside-border flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo & Studio Identifier */}
          <div className="p-6 border-b border-outside-border">
            <Link href="/" target="_blank" className="flex items-center gap-2 group">
              <span className="text-outside-crimson font-black tracking-widest text-lg font-display uppercase">
                OUTSIDE
              </span>
              <span className="px-1.5 py-0.5 bg-outside-surface border border-outside-border text-[9px] text-outside-muted uppercase tracking-widest">
                STUDIO v1.0
              </span>
              <ExternalLink className="w-3 h-3 text-outside-muted group-hover:text-white transition-colors" />
            </Link>
            <p className="text-[10px] text-outside-muted mt-1 uppercase tracking-wider">
              COMMAND // RBAC SUPER_ADMIN
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-none hover:bg-outside-surface text-outside-chalkDim hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-outside-crimson" />
              <span>OVERVIEW</span>
            </Link>

            <Link
              href="/admin/drops"
              className="flex items-center gap-3 px-3 py-2.5 rounded-none hover:bg-outside-surface text-outside-chalkDim hover:text-white transition-colors"
            >
              <Layers className="w-4 h-4 text-outside-crimson" />
              <span>DROP MANAGER</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-3 py-2.5 rounded-none hover:bg-outside-surface text-outside-chalkDim hover:text-white transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-outside-crimson" />
              <span>ORDERS &amp; INVOICES</span>
            </Link>

            <Link
              href="/admin/leads"
              className="flex items-center gap-3 px-3 py-2.5 rounded-none hover:bg-outside-surface text-outside-chalkDim hover:text-white transition-colors"
            >
              <Users className="w-4 h-4 text-outside-crimson" />
              <span>WAITLIST &amp; CRM</span>
            </Link>

            <Link
              href="/admin/cms"
              className="flex items-center gap-3 px-3 py-2.5 rounded-none hover:bg-outside-surface text-outside-chalkDim hover:text-white transition-colors"
            >
              <FileText className="w-4 h-4 text-outside-crimson" />
              <span>HEADLESS CMS</span>
            </Link>

            <div className="pt-4 mt-4 border-t border-outside-border/60">
              <span className="px-3 text-[10px] text-outside-muted uppercase tracking-widest block mb-2 font-bold">
                COMPLIANCE &amp; SETTINGS
              </span>

              <Link
                href="/admin/settings/gst"
                className="flex items-center gap-3 px-3 py-2.5 rounded-none hover:bg-outside-surface text-outside-chalkDim hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4 text-outside-crimson" />
                <span>GST (GUJARAT 24)</span>
              </Link>

              <Link
                href="/admin/settings/email"
                className="flex items-center gap-3 px-3 py-2.5 rounded-none hover:bg-outside-surface text-outside-chalkDim hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-outside-crimson" />
                <span>EMAIL ENGINE</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* User Session & Logout */}
        <div className="p-4 border-t border-outside-border bg-outside-surface/40 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-7 h-7 rounded-full bg-outside-crimson text-white font-bold flex items-center justify-center text-xs">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold text-white truncate">admin@outside.in</p>
              <p className="text-[9px] text-outside-muted">SUPER_ADMIN · AHMEDABAD</p>
            </div>
          </div>

          <form action="/api/admin/auth" method="POST">
            <button
              formAction={async () => {
                'use server';
                const { cookies } = await import('next/headers');
                const cookieStore = await cookies();
                cookieStore.delete('outside_session');
                const { redirect } = await import('next/navigation');
                redirect('/admin/login');
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-outside-card border border-outside-border hover:border-outside-crimson text-[10px] text-outside-muted hover:text-white uppercase tracking-wider transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>TERMINATE SESSION</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Command Workspace */}
      <main className="flex-1 overflow-y-auto bg-outside-black p-6 sm:p-10">
        {children}
      </main>

    </div>
  );
}

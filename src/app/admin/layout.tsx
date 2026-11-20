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
    <div className="min-h-screen bg-[#FCFBF8] text-[#111110] flex flex-col md:flex-row font-mono antialiased">
      
      {/* Daylight Studio Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#EDEAE2] border-r border-[#DCD7CC] flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo & Studio Identifier */}
          <div className="p-6 border-b border-[#DCD7CC] bg-[#EDEAE2]">
            <Link href="/" target="_blank" className="flex items-center gap-2.5 group">
              <div className="relative w-6 h-6 flex-shrink-0">
                <Image
                  src="/images/OUTSIDE_icon.png"
                  alt="OUTSIDE"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[#111110] font-black tracking-widest text-base font-display uppercase">
                OUTSIDE
              </span>
              <span className="px-1.5 py-0.5 bg-[#FCFBF8] border border-[#DCD7CC] text-[9px] text-[#52504B] uppercase tracking-widest font-mono">
                STUDIO v1.0
              </span>
              <ExternalLink className="w-3 h-3 text-[#52504B] group-hover:text-[#111110] transition-colors" />
            </Link>
            <p className="text-[10px] text-[#52504B] mt-1.5 uppercase tracking-wider font-mono">
              COMMAND // RBAC SUPER_ADMIN
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-none hover:bg-[#FCFBF8] text-[#52504B] hover:text-[#111110] transition-colors font-medium border border-transparent hover:border-[#DCD7CC]"
            >
              <LayoutDashboard className="w-4 h-4 text-[#B82328]" />
              <span>OVERVIEW</span>
            </Link>

            <Link
              href="/admin/drops"
              className="flex items-center gap-3 px-3 py-2.5 rounded-none hover:bg-[#FCFBF8] text-[#52504B] hover:text-[#111110] transition-colors font-medium border border-transparent hover:border-[#DCD7CC]"
            >
              <Layers className="w-4 h-4 text-[#B82328]" />
              <span>DROP MANAGER</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-3 py-2.5 rounded-none hover:bg-[#FCFBF8] text-[#52504B] hover:text-[#111110] transition-colors font-medium border border-transparent hover:border-[#DCD7CC]"
            >
              <ShoppingBag className="w-4 h-4 text-[#B82328]" />
              <span>ORDERS &amp; INVOICES</span>
            </Link>

            <Link
              href="/admin/leads"
              className="flex items-center gap-3 px-3 py-2.5 rounded-none hover:bg-[#FCFBF8] text-[#52504B] hover:text-[#111110] transition-colors font-medium border border-transparent hover:border-[#DCD7CC]"
            >
              <Users className="w-4 h-4 text-[#B82328]" />
              <span>WAITLIST &amp; CRM</span>
            </Link>

            <Link
              href="/admin/cms"
              className="flex items-center gap-3 px-3 py-2.5 rounded-none hover:bg-[#FCFBF8] text-[#52504B] hover:text-[#111110] transition-colors font-medium border border-transparent hover:border-[#DCD7CC]"
            >
              <FileText className="w-4 h-4 text-[#B82328]" />
              <span>HEADLESS CMS</span>
            </Link>

            <div className="pt-4 mt-4 border-t border-[#DCD7CC]">
              <span className="px-3 text-[10px] text-[#52504B] uppercase tracking-widest block mb-2 font-bold">
                COMPLIANCE &amp; SETTINGS
              </span>

              <Link
                href="/admin/settings/gst"
                className="flex items-center gap-3 px-3 py-2.5 rounded-none hover:bg-[#FCFBF8] text-[#52504B] hover:text-[#111110] transition-colors font-medium border border-transparent hover:border-[#DCD7CC]"
              >
                <Settings className="w-4 h-4 text-[#B82328]" />
                <span>GST (GUJARAT 24)</span>
              </Link>

              <Link
                href="/admin/settings/email"
                className="flex items-center gap-3 px-3 py-2.5 rounded-none hover:bg-[#FCFBF8] text-[#52504B] hover:text-[#111110] transition-colors font-medium border border-transparent hover:border-[#DCD7CC]"
              >
                <Mail className="w-4 h-4 text-[#B82328]" />
                <span>EMAIL ENGINE</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* User Session & Logout */}
        <div className="p-4 border-t border-[#DCD7CC] bg-[#EDEAE2] space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-7 h-7 rounded-none bg-[#111110] text-[#FCFBF8] font-bold flex items-center justify-center text-xs">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold text-[#111110] truncate">admin@outside.in</p>
              <p className="text-[9px] text-[#52504B]">SUPER_ADMIN · AHMEDABAD</p>
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
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#FCFBF8] border border-[#DCD7CC] hover:border-[#B82328] hover:bg-[#EDEAE2] text-[10px] text-[#52504B] hover:text-[#111110] uppercase tracking-wider transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>TERMINATE SESSION</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Daylight Workspace */}
      <main className="flex-1 overflow-y-auto bg-[#FCFBF8] p-6 sm:p-10">
        {children}
      </main>

    </div>
  );
}

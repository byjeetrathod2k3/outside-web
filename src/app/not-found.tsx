import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-[#F7F5F0] text-[#111110] min-h-[75vh] flex items-center justify-center py-20 px-4 font-mono">
      <div className="max-w-md w-full bg-[#FCFBF8] border border-[#DCD7CC] p-8 sm:p-10 space-y-6 text-center shadow-editorial">
        <div className="inline-flex p-3 bg-[#EDEAE2] border border-[#DCD7CC] text-[#B82328]">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] text-[#B82328] uppercase font-bold tracking-[0.25em] block">
            ERROR 404 // ROUTE NOT ALLOCATED
          </span>
          <h1 className="text-3xl font-display font-black uppercase tracking-tight text-[#111110]">
            Edition Out of Bounds.
          </h1>
          <p className="text-xs text-[#52504B] font-sans leading-relaxed pt-1">
            The page or archival edition you requested has either been retired to The Vault, moved to another path, or does not exist in our catalog.
          </p>
        </div>

        <div className="pt-4 border-t border-[#DCD7CC] space-y-3">
          <Link
            href="/"
            className="w-full py-3.5 bg-[#111110] hover:bg-[#B82328] text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>RETURN TO ACTIVE DROP</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/vault"
            className="w-full py-3 bg-[#FCFBF8] hover:bg-[#EDEAE2] text-[#111110] border border-[#DCD7CC] text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors block"
          >
            <span>EXPLORE THE VAULT ARCHIVE</span>
          </Link>
        </div>

        <div className="pt-2 text-[10px] text-[#52504B]">
          <span>OUTSIDE APPAREL STUDIO · AHMEDABAD, INDIA</span>
        </div>
      </div>
    </div>
  );
}

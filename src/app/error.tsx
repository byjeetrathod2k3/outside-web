'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, ArrowRight } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitized error digest for SRE tracking without exposing stack trace to users
    console.error('OUTSIDE Storefront Error Digest:', error.digest || error.message);
  }, [error]);

  return (
    <div className="bg-[#F7F5F0] text-[#111110] min-h-[75vh] flex items-center justify-center py-20 px-4 font-mono">
      <div className="max-w-md w-full bg-[#FCFBF8] border border-[#DCD7CC] p-8 sm:p-10 space-y-6 text-center shadow-editorial">
        <div className="inline-flex p-3 bg-[#B82328]/10 border border-[#B82328]/30 text-[#B82328]">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] text-[#B82328] uppercase font-bold tracking-[0.25em] block">
            ERROR 500 // STUDIO SERVICE ANOMALY
          </span>
          <h1 className="text-3xl font-display font-black uppercase tracking-tight text-[#111110]">
            Temporary Interruption.
          </h1>
          <p className="text-xs text-[#52504B] font-sans leading-relaxed pt-1">
            Our studio systems encountered an unexpected condition while loading this section. Our engineering team has been notified.
          </p>
          {error.digest && (
            <p className="text-[10px] text-[#52504B] font-mono pt-1">
              REF CODE: {error.digest}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-[#DCD7CC] space-y-3">
          <button
            onClick={() => reset()}
            className="w-full py-3.5 bg-[#111110] hover:bg-[#B82328] text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RETRY OPERATION</span>
          </button>

          <Link
            href="/"
            className="w-full py-3 bg-[#FCFBF8] hover:bg-[#EDEAE2] text-[#111110] border border-[#DCD7CC] text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <span>RETURN TO STOREFRONT</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="pt-2 text-[10px] text-[#52504B]">
          <span>FOR IMMEDIATE ASSISTANCE: SUPPORT@OUTSIDE.IN</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

interface ViralShareProps {
  title?: string;
  dropNumber?: number | string;
  url?: string;
  customText?: string;
  isReferral?: boolean;
  className?: string;
}

export function ViralShare({
  title = 'DROP 001 // BETTER DAYS AHEAD',
  dropNumber = '001',
  url,
  customText,
  isReferral = false,
  className = '',
}: ViralShareProps) {
  const [copied, setCopied] = useState(false);

  const targetUrl = typeof window !== 'undefined' ? url || window.location.href : 'https://www.outside.in';

  const defaultShareText = isReferral
    ? `I just queued for early access to OUTSIDE DROP ${dropNumber} (${title}). Limited to 250 serialized pieces. Wear your story:`
    : `OUTSIDE DROP ${dropNumber} is live — strictly limited to 250 serialized pieces. Wear your story:`;

  const shareText = customText || defaultShareText;

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `OUTSIDE // ${title}`,
          text: shareText,
          url: targetUrl,
        });
        return;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // Fall back to copy
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText} ${targetUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${targetUrl}`)}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(targetUrl)}`;

  return (
    <div className={`font-mono space-y-3 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        {/* WhatsApp Direct Share Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 text-[#128C7E] text-xs font-bold uppercase tracking-wider transition-all"
        >
          {/* WhatsApp SVG Icon */}
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          <span>WHATSAPP SHARE</span>
        </a>

        {/* X / Twitter Share Button */}
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          className="inline-flex items-center gap-2 px-3 py-2.5 bg-[#EDEAE2] hover:bg-[#DCD7CC] border border-[#DCD7CC] text-[#111110] text-xs font-bold uppercase tracking-wider transition-all"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>POST ON X</span>
        </a>

        {/* Native Web Share or Copy Link */}
        <button
          type="button"
          onClick={handleNativeShare}
          aria-label="Copy Drop Link"
          className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-[#FCFBF8] hover:bg-[#EDEAE2] border border-[#DCD7CC] text-[#111110] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#3F4E44]" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? 'LINK COPIED' : 'INVITE / SHARE'}</span>
        </button>
      </div>

      {isReferral && (
        <p className="text-[11px] text-[#52504B] leading-relaxed">
          Share your allocation link with 3 friends to secure guaranteed priority queueing for DROP 002.
        </p>
      )}
    </div>
  );
}

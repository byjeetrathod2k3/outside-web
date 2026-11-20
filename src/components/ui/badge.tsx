import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'live' | 'soldOut' | 'draft' | 'outline' | 'moss' | 'archived' | 'crimson';
  children: React.ReactNode;
}

export function Badge({
  variant = 'default',
  className,
  children,
  ...props
}: BadgeProps) {
  const base =
    'inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] font-bold select-none border transition-colors';

  const variants = {
    default: 'bg-outside-surface text-outside-inkSecondary border-outside-border',
    live: 'bg-[#EBF0EC] text-outside-accentSecondary border-[#C8D6CB]',
    moss: 'bg-[#EBF0EC] text-outside-accentSecondary border-[#C8D6CB]',
    crimson: 'bg-[#FDF2F2] text-outside-accent border-[#F0CDCF]',
    soldOut: 'bg-[#FDF2F2] text-outside-accent border-[#F0CDCF]',
    draft: 'bg-outside-surface text-outside-inkSecondary border-outside-border',
    archived: 'bg-outside-surface text-outside-inkSecondary border-outside-border',
    outline: 'bg-transparent text-outside-inkSecondary border-outside-border',
  };

  return (
    <span className={twMerge(clsx(base, variants[variant], className))} {...props}>
      {children}
    </span>
  );
}

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'crimson' | 'outline' | 'live' | 'archived';
  children: React.ReactNode;
}

export function Badge({
  variant = 'default',
  className,
  children,
  ...props
}: BadgeProps) {
  const base =
    'inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest font-semibold transition-all select-none';

  const variants = {
    default: 'bg-outside-cardSubtle text-outside-textSecondary border border-outside-border',
    crimson: 'bg-outside-crimson text-white border border-outside-crimson shadow-sm',
    outline: 'bg-transparent text-outside-muted border border-outside-border',
    live: 'bg-outside-crimsonSoft text-outside-crimson border border-outside-crimson/30',
    archived: 'bg-outside-cardSubtle text-outside-muted border border-outside-border',
  };

  return (
    <span className={twMerge(clsx(base, variants[variant], className))} {...props}>
      {children}
    </span>
  );
}

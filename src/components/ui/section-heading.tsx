import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'space-y-3',
          align === 'center' ? 'text-center max-w-3xl mx-auto' : 'text-left max-w-2xl',
          className
        )
      )}
    >
      {eyebrow && (
        <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-outside-crimson font-bold block">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-outside-text uppercase">
        {title}
      </h2>
      {description && (
        <p className="text-sm font-sans text-outside-muted leading-relaxed font-normal">
          {description}
        </p>
      )}
    </div>
  );
}

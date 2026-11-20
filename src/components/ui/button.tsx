import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center font-mono uppercase tracking-[0.2em] font-bold transition-all focus:outline-none focus:ring-2 focus:ring-outside-accent disabled:opacity-50 disabled:cursor-not-allowed select-none border';

    const variants = {
      primary:
        'bg-outside-ink text-outside-elevated border-outside-ink hover:bg-black hover:border-outside-accent shadow-editorial active:scale-[0.99]',
      accent:
        'bg-outside-accent text-outside-elevated border-outside-accent hover:bg-[#96191E] shadow-editorial active:scale-[0.99]',
      secondary:
        'bg-outside-surface text-outside-ink border-outside-border hover:border-outside-ink active:scale-[0.99]',
      outline:
        'bg-outside-elevated text-outside-ink border-outside-border hover:border-outside-ink hover:bg-outside-surface active:scale-[0.99]',
      ghost:
        'bg-transparent text-outside-inkSecondary border-transparent hover:text-outside-ink hover:bg-outside-surface',
    };

    const sizes = {
      sm: 'text-[10px] px-3.5 py-2 gap-1.5',
      md: 'text-xs px-5 py-3 gap-2',
      lg: 'text-xs px-7 py-4 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={twMerge(clsx(base, variants[variant], sizes[size], className))}
        {...props}
      >
        {loading ? (
          <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

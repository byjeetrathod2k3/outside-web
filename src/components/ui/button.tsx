import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
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
      'inline-flex items-center justify-center font-mono uppercase tracking-[0.2em] font-bold transition-all focus:outline-none focus:ring-2 focus:ring-outside-crimson disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary:
        'bg-outside-crimson hover:bg-outside-crimsonHover text-white shadow-luxury hover:shadow-luxury-hover border border-outside-crimson',
      secondary:
        'bg-outside-text hover:bg-black text-white border border-outside-text shadow-sm',
      outline:
        'bg-white hover:bg-outside-cardSubtle text-outside-text border border-outside-border hover:border-outside-text',
      ghost:
        'bg-transparent hover:bg-outside-cardSubtle text-outside-muted hover:text-outside-text border border-transparent',
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

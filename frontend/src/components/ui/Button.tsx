import { type ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-sans font-medium transition-all duration-150 rounded-[var(--radius)] border focus-visible:outline-none focus-visible:ring-3 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
      primary: 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] hover:border-[var(--color-primary-hover)] focus-visible:ring-[var(--color-primary-light)]',
      secondary: 'bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-strong)] focus-visible:ring-[var(--color-bg)]',
      ghost: 'bg-transparent text-[var(--color-text-secondary)] border-transparent hover:bg-[var(--color-bg)] hover:text-[var(--color-text)] focus-visible:ring-[var(--color-bg)]',
      danger: 'bg-[var(--color-danger)] text-white border-[var(--color-danger)] hover:bg-[var(--color-danger-hover)] hover:border-[var(--color-danger-hover)] focus-visible:ring-[var(--color-danger-light)]',
    };
    const sizes = {
      sm: 'px-3.5 py-2.5 text-xs',
      md: 'px-4.5 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
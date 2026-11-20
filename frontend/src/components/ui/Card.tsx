import { type HTMLAttributes, forwardRef } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', padding = 'md', children, ...props }, ref) => {
    const base = 'bg-[var(--color-surface)] rounded-[var(--radius-lg)] transition-shadow duration-200 transition-border-color duration-200';
    const variants = {
      default: 'border border-[var(--color-border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow)] hover:border-[var(--color-border-strong)]',
      elevated: 'border border-[var(--color-border)] shadow-[var(--shadow)] hover:shadow-[var(--shadow-lg)]',
      outlined: 'border-2 border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
    };
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-6',
    };

    return (
      <div ref={ref} className={`${base} ${variants[variant]} ${paddings[padding]} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`mb-4 ${className}`} {...props}>{children}</div>
  )
);
CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = '', children, ...props }, ref) => (
    <h3 ref={ref} className={`text-lg font-semibold text-[var(--color-text)] ${className}`} {...props}>{children}</h3>
  )
);
CardTitle.displayName = 'CardTitle';

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>{children}</div>
  )
);
CardContent.displayName = 'CardContent';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`mt-4 flex items-center gap-3 ${className}`} {...props}>{children}</div>
  )
);
CardFooter.displayName = 'CardFooter';
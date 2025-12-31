import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] hover:shadow-lg hover:-translate-y-[1px] active:translate-y-0 shadow-[0_1px_2px_rgba(0,0,0,0.08)] border border-[rgba(0,0,0,0.04)]',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        outline:
          'border border-[var(--border-default)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] shadow-sm hover:text-[var(--text-primary)]',
        secondary:
          'bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] active:bg-[var(--bg-active)] border border-[var(--border-default)] shadow-sm',
        ghost: 'hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] text-[var(--text-secondary)]',
        link: 'text-[var(--accent-primary)] underline-offset-4 hover:underline',
        muted: 'bg-[var(--bg-active)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]',
        tertiary: 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] hover:bg-[var(--accent-subtle)]/80',
      },
      size: {
        default: 'h-10 px-4 py-2',
        xs: 'h-7 rounded-md px-2 text-xs',
        sm: 'h-9 rounded-md px-3', // Slightly taller than shadcn default 8
        lg: 'h-11 rounded-md px-8',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';

export { Button, buttonVariants };

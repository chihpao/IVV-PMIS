import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold tracking-tight transition-[transform,box-shadow,background-color,color,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground shadow-sm hover:shadow-md',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:shadow-md',
        outline: 'border border-border bg-transparent text-foreground hover:bg-muted/60',
        secondary: 'bg-white text-foreground ring-1 ring-border/60 hover:bg-secondary',
        ghost: 'bg-transparent text-foreground hover:bg-muted/50',
        muted: 'bg-muted text-muted-foreground hover:bg-muted/80',
        tertiary: 'bg-accent text-accent-foreground ring-1 ring-border/50 hover:bg-accent/80',
      },
      size: {
        default: 'h-11 px-4',
        xs: 'h-7 rounded-md px-2 text-xs',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-12 rounded-md px-6',
        icon: 'h-9 w-9',
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

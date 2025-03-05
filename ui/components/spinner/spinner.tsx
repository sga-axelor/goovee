import {VariantProps, cva} from 'class-variance-authority';
import {Loader2} from 'lucide-react';
import {cn} from '@/utils/css';

const spinnerVariants = cva('flex-col items-center justify-center', {
  variants: {
    show: {true: 'flex', false: 'hidden'},
    fullscreen: {true: 'fixed inset-0 z-[200] bg-black/50'},
  },
  defaultVariants: {show: true},
});

const loaderVariants = cva('animate-spin text-primary', {
  variants: {size: {small: 'size-6', medium: 'size-8', large: 'size-12'}},
  defaultVariants: {size: 'medium'},
});

interface SpinnerContentProps
  extends VariantProps<typeof spinnerVariants>,
    VariantProps<typeof loaderVariants> {
  className?: string;
  children?: React.ReactNode;
}

export function Spinner({
  size,
  show,
  children,
  className,
  fullscreen,
}: SpinnerContentProps) {
  return (
    <span className={spinnerVariants({show, fullscreen})}>
      <Loader2 className={cn(loaderVariants({size}), className)} />
      {children}
    </span>
  );
}

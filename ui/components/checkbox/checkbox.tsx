'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import {cva, type VariantProps} from 'class-variance-authority';
import {Check} from 'lucide-react';

import {cn} from '@/utils/css';

const checkboxVariants = cva(
  'peer h-5 w-5 shrink-0 rounded border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
        success:
          'border-success data-[state=checked]:bg-success data-[state=checked]:text-success-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({className, variant, ...props}, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={checkboxVariants({variant, className})}
    {...props}>
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}>
      <Check className="h-5 w-5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export {Checkbox};

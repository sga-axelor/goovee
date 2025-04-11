import React from 'react';

// ---- CORE IMPORTS ---- //
import {cn} from '@/utils/css';
import {Badge} from '@/ui/components';

export type Variant =
  | 'success'
  | 'destructive'
  | 'yellow'
  | 'purple'
  | 'blue'
  | 'default'
  | 'orange'
  | 'primary';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant: Variant;
  outline?: boolean;
}

const classes: Record<Variant, string> = {
  success: 'bg-success/[.25] text-success-dark',
  destructive: 'bg-destructive/[.25] text-destructive-dark',
  yellow: 'bg-palette-yellow text-palette-yellow-dark',
  purple: 'bg-palette-purple text-palette-purple-dark',
  blue: 'bg-palette-blue text-palette-blue-dark',
  default: 'bg-primary/[.25] text-primary',
  orange: 'bg-palette-orange text-palette-orange-dark',
  primary: 'bg-palette-blue-light text-palette-blue-dark',
};
const outlineClasses: Record<Variant, string> = {
  success: 'border-success text-success border',
  destructive: 'border-destructive text-destructive border',
  yellow: 'border-palette-yellow-dark text-palette-yellow-dark border',
  purple: 'border-palette-purple text-palette-purple border',
  blue: 'border-violet-400 text-violet-400 border',
  default: 'border-primary text-primary border',
  orange: 'border-palette-orange text-palette-orange border',
  primary: 'border-palette-blue text-palette-blue-dark border',
};

export const Tag: React.FC<TagProps> = ({
  children,
  variant = 'default',
  className,
  outline,
  ...props
}) => {
  const variantClasses = outline ? outlineClasses[variant] : classes[variant];
  return (
    <Badge
      className={cn(variantClasses, className)}
      variant="tag_default"
      {...props}>
      {children}
    </Badge>
  );
};

export default Tag;

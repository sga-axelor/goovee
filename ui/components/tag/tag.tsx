import * as React from 'react';
import {Badge} from '@ui/components/badge';
import {cn} from '@/utils/css';

type Variant =
  | 'success'
  | 'destructive'
  | 'yellow'
  | 'purple'
  | 'blue'
  | 'default';

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
};
const outlineClasses: Record<Variant, string> = {
  success: 'border-success text-success border',
  destructive: 'border-destructive text-destructive border',
  yellow: 'border-palette-yellow text-palette-yellow border',
  purple: 'border-palette-purple text-palette-purple border',
  blue: 'border-violet-400 text-violet-400 border',
  default: 'border-primary text-primary border',
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

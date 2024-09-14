import React from 'react';

// ---- CORE IMPORTS ---- //
import {cn} from '@/utils/css';
import {Badge} from '@/ui/components';

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
}

const classes: Record<Variant, string> = {
  success: 'bg-success/[.25] text-success-dark',
  destructive: 'bg-destructive/[.25] text-destructive-dark',
  yellow: 'bg-palette-yellow text-palette-yellow-dark',
  purple: 'bg-palette-purple text-palette-purple-dark',
  blue: 'bg-palette-blue text-palette-blue-dark',
  default: 'bg-primary/[.25] text-primary',
};

export const Tag: React.FC<TagProps> = ({
  children,
  variant = 'default',
  className,
  ...props
}) => {
  return (
    <Badge
      className={cn(classes[variant], className)}
      variant="tag_default"
      {...props}>
      {children}
    </Badge>
  );
};

export default Tag;

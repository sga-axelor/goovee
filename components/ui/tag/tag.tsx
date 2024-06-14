import * as React from 'react';
import {Badge} from '@ui/components/badge';

type Variant =
  | 'success'
  | 'error'
  | 'warning'
  | 'primary'
  | 'secondary'
  | 'default';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant: Variant;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  success: {
    backgroundColor: 'hsl(var(--success-light))',
    color: 'hsl(var(--success-dark))',
  },
  error: {
    backgroundColor: 'hsl(var(--error-light))',
    color: 'hsl(var(--error-dark))',
  },
  warning: {
    backgroundColor: 'hsl(var(--warning-light))',
    color: 'hsl(var(--warning-dark))',
  },
  primary: {
    backgroundColor: 'hsl(var(--primary-light))',
    color: 'hsl(var(--primary-dark))',
  },
  secondary: {
    backgroundColor: 'hsl(var(--secondary-light))',
    color: 'hsl(var(--secondary-dark))',
  },
  default: {
    backgroundColor: 'hsl(var(--default-light))',
    color: 'hsl(var(--default-dark))',
  },
};

export const Tag: React.FC<TagProps> = ({
  children,
  variant = 'default',
  style,
  ...props
}) => {
  const combinedStyles = {
    ...variantStyles[variant],
    ...style,
  };

  return (
    <Badge style={combinedStyles} variant="tag_default" {...props}>
      {children}
    </Badge>
  );
};

export default Tag;

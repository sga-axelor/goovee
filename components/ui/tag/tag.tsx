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
    backgroundColor: 'var(--success-light)',
    color: 'var(--success-dark)',
  },
  error: {
    backgroundColor: 'var(--error-light)',
    color: 'var(--error-dark)',
  },
  warning: {
    backgroundColor: 'var(--warning-light)',
    color: 'var(--warning-dark)',
  },
  primary: {
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary-dark)',
  },
  secondary: {
    backgroundColor: 'var(--secondary-light)',
    color: 'var(--secondary-dark)',
  },
  default: {
    backgroundColor: 'var(--default-light)',
    color: 'var(--default-dark)',
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

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
    backgroundColor: '#D0EED8',
    color: '#4FC179',
  },
  error: {
    backgroundColor: '#FBC6C4',
    color: '#F14E46',
  },
  warning: {
    backgroundColor: '#FFE6BF',
    color: '#FFA114',
  },
  primary: {
    backgroundColor: '#F6F1FF',
    color: '#5603AD',
  },
  secondary: {
    backgroundColor: '#D0E3FF',
    color: '#2D60C4',
  },
  default: {
    backgroundColor: '#adb5bd',
    color: '#495057',
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

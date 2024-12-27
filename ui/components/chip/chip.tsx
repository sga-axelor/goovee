'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {Tag} from '@/ui/components';
import {cn} from '@/utils/css';
import {Variant} from '@/ui/components/tag';

export function Chip({
  value,
  variant = 'default',
  className,
  outline = false,
}: {
  value: string;
  variant?: Variant;
  className?: string;
  outline?: boolean;
}) {
  if (!value) {
    return null;
  }
  return (
    <Tag
      variant={variant}
      className={cn('text-[0.625rem] py-1 w-max', className)}
      outline={outline}>
      {value}
    </Tag>
  );
}

export default Chip;

'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {Tag} from '@/ui/components';
import {cn} from '@/utils/css';
import {Variant} from '@/ui/components/tag';

export function Status({
  value,
  variant = 'default',
  className,
}: {
  value: string;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Tag
      variant={variant}
      className={cn('text-[10px] py-1 w-max', className)}
      outline>
      {value}
    </Tag>
  );
}

export default Status;

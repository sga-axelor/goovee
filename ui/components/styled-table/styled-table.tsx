'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableFooter,
  TableHeader,
} from '@/ui/components';
import {i18n} from '@/locale';

// ---- LOCAL IMPORTS ---- //
import type {TableHeadProps, TableProps} from './types';

export const StyledHead = ({columns, className = ''}: TableHeadProps) => {
  const getAlignmentClass = (align?: string) => {
    switch (align) {
      case 'right':
        return 'text-right';
      case 'center':
        return 'text-center';
      default:
        return 'text-left';
    }
  };

  return (
    <TableRow>
      {columns?.map(({key, label, align}, index) => {
        const isEdge = index === 0 || index === columns?.length - 1;
        const paddingInline = isEdge ? '1.5rem' : '1rem';

        return (
          <TableHead
            key={key}
            className={`${className} ${getAlignmentClass(align)} text-card-foreground text-base font-semibold`}
            style={{paddingInline}}>
            {i18n.t(label)}
          </TableHead>
        );
      })}
    </TableRow>
  );
};

export const StyledTable = ({
  columns,
  children,
  className,
  headStyle,
}: TableProps) => {
  return (
    <Table
      className={`w-full rounded-lg bg-card text-card-foreground ${className}`}>
      <TableHeader>
        <StyledHead className={headStyle} columns={columns} />
      </TableHeader>
      <TableBody>{children}</TableBody>
      <TableFooter></TableFooter>
    </Table>
  );
};

export default StyledTable;

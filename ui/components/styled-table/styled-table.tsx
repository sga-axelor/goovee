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

// ---- LOCAL IMPORTS ---- //
import type {TableHeadProps, TableProps} from './types';

export const StyledHead = ({columns, className}: TableHeadProps) => {
  return (
    <TableRow>
      {columns?.map((column: any, index: number) => (
        <TableHead
          key={column.key}
          className={`${className} text-card-foreground text-base font-semibold`}
          style={{
            paddingInline: '1.5rem',
            border: 'none',
            borderRadius:
              index === 0
                ? '0.5rem 0rem 0rem 0.5rem'
                : index === columns.length - 1
                  ? '0 0.5rem 0.5rem 0'
                  : '',
          }}>
          {column.label}
        </TableHead>
      ))}
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

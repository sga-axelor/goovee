'use client';

import React from 'react';
import {TableHeadProps, TableProps} from './types';
import {Table, TableBody, TableCell, TableRow} from '@ui/components/table';

export const StyledHead = ({columns, className}: TableHeadProps) => {
  return (
    <>
      <TableRow>
        {columns?.map((column: any, index: number) => (
          <TableCell
            key={column.key}
            className={`${className} text-primary text-base font-semibold`}
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
          </TableCell>
        ))}
      </TableRow>
    </>
  );
};

export const StyledTable = ({
  columns,
  children,
  className,
  headStyle,
}: TableProps) => {
  return (
    <>
      <Table className={`w-full rounded-lg bg-background ${className}`}>
        <StyledHead className={headStyle} columns={columns} />
        <TableBody>{children}</TableBody>
      </Table>
    </>
  );
};

export default StyledTable;

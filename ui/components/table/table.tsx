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
              paddingInline: '24px',
              border: 'none',
              borderRadius:
                index === 0
                  ? '8px 0px 0px 8px'
                  : index === columns.length - 1
                    ? '0 8px 8px 0'
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

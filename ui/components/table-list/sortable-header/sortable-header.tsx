'use client';

import React, {useMemo} from 'react';
import {MdArrowDropDown, MdArrowDropUp} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {TableHead, TableHeader, TableRow} from '@/ui/components';
import {useResponsive} from '@/ui/hooks';
import {cn} from '@/utils/css';
import {ORDER_BY, RESPONSIVE_SIZES} from '@/constants';
import {Column} from '@/ui/components/table-list/types';

type SortableHeaderProps = {
  columns: Column[];
  sort?: {
    key: string | null;
    direction: 'ASC' | 'DESC';
    toggle: (column: Column, e: React.MouseEvent) => void;
  };
};

export function SortableHeader({columns, sort}: SortableHeaderProps) {
  const res = useResponsive();

  const isSmallScreen = useMemo(
    () => RESPONSIVE_SIZES.some(size => res[size]),
    [res],
  );

  const filteredColumns = useMemo(
    () => (isSmallScreen ? columns.filter(col => col.mobile) : columns),
    [isSmallScreen, columns],
  );

  const getSortIcon = (isActive: boolean, isAscending: boolean) => {
    if (!isActive) return null;
    return isAscending ? MdArrowDropDown : MdArrowDropUp;
  };

  return (
    <TableHeader>
      <TableRow>
        {filteredColumns.map(column => {
          const isActive = sort?.key === column.key;
          const isAscending = isActive && sort?.direction === ORDER_BY.ASC;
          const canSort = Boolean(column.sortable);
          const SortIcon = getSortIcon(isActive, isAscending);

          return (
            <TableHead
              key={String(column.key)}
              onClick={canSort ? e => sort?.toggle(column, e) : undefined}
              className={cn(
                'text-card-foreground text-base font-semibold border-none p-3',
                {'cursor-pointer': canSort},
              )}>
              <div className="flex gap-1 items-center">
                <span className="line-clamp-1">{column.label}</span>
                {SortIcon && <SortIcon className="h-4 w-4 ms-auto" />}
              </div>
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
}

export default SortableHeader;

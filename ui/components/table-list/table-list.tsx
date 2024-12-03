'use client';

import React, {useCallback, useMemo} from 'react';

// ---- CORE IMPORTS ---- //
import {Table, TableBody, Pagination} from '@/ui/components';
import {useSearchParams} from '@/ui/hooks';
import type {Column, SortState} from '@/ui/components/table-list/types';
import {ExpandableTableRows, SortableHeader} from '@/ui/components/table-list';

type TableListProps = {
  columns: Column[];
  rows: any[];
  sort: SortState;
  pageInfo: any;
  pageParamKey: string;
  onSort: ({key, getter}: {key: string; getter: any}) => void;
  onRowClick?: (record: any) => void;
};

export function TableList({
  columns,
  rows,
  sort,
  pageInfo,
  pageParamKey,
  onRowClick,
  onSort,
}: TableListProps) {
  const memoizedColumns = useMemo(() => columns, [columns]);

  const {page, pages, hasPrev, hasNext} = pageInfo || {};
  const {update} = useSearchParams();

  const handlePreviousPage = useCallback(() => {
    if (!hasPrev) return;
    update([{key: pageParamKey, value: Math.max(Number(page) - 1, 1)}]);
  }, [hasPrev, page, update, pageParamKey]);

  const handleNextPage = useCallback(() => {
    if (!hasNext) return;
    update([{key: pageParamKey, value: Number(page) + 1}]);
  }, [hasNext, page, update, pageParamKey]);

  const handlePage = useCallback(
    (page: string | number) => {
      update([{key: pageParamKey, value: page}]);
    },
    [update, pageParamKey],
  );

  const handleSortToggle = useCallback(
    (column: Column) => {
      onSort &&
        onSort({
          key: column.key,
          getter: column.getter,
        });
    },
    [onSort],
  );

  return (
    <>
      <Table className="rounded-lg bg-card text-card-foreground">
        <SortableHeader
          columns={memoizedColumns}
          sort={{
            key: sort?.key,
            direction: sort?.direction,
            toggle: handleSortToggle,
          }}
        />
        <TableBody>
          <ExpandableTableRows
            rows={rows}
            columns={memoizedColumns}
            onRowClick={onRowClick}
          />
        </TableBody>
      </Table>
      {pageInfo && page > 1 && (
        <Pagination
          page={page}
          pages={pages}
          disablePrev={!hasPrev}
          disableNext={!hasNext}
          onPrev={handlePreviousPage}
          onNext={handleNextPage}
          onPage={handlePage}
        />
      )}
    </>
  );
}

export default TableList;

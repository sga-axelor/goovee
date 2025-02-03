'use client';

import React, {useCallback, useMemo} from 'react';

// ---- CORE IMPORTS ---- //
import {Table, TableBody, Pagination} from '@/ui/components';
import {useSearchParams} from '@/ui/hooks';
import type {Column, SortState} from '@/ui/components/table-list/types';
import {ExpandableTableRows, SortableHeader} from '@/ui/components/table-list';

type TableListProps = {
  style?: React.CSSProperties;
  columns: Column[];
  rows: any[];
  sort: SortState;
  pageInfo?: any;
  pageParamKey?: string;
  handlePage?: (page: number) => void;
  onSort: ({key, getter}: {key: string; getter: any}) => void;
  onRowClick?: (record: any) => void;
};

export function TableList({
  style,
  columns,
  rows,
  sort,
  pageInfo,
  pageParamKey,
  handlePage,
  onRowClick,
  onSort,
}: TableListProps) {
  const memoizedColumns = useMemo(() => columns, [columns]);

  const {page, pages = 0, hasPrev, hasNext} = pageInfo || {};
  const {update} = useSearchParams();

  const handlePageChange = useCallback(
    (page: number) => {
      if (handlePage != null) {
        handlePage(page);
        return;
      }

      update([{key: pageParamKey, value: page}]);
    },
    [handlePage, update, pageParamKey],
  );

  const handlePreviousPage = useCallback(() => {
    if (!hasPrev) return;
    handlePageChange(Math.max(Number(page) - 1, 1));
  }, [hasPrev, handlePageChange, page]);

  const handleNextPage = useCallback(() => {
    if (!hasNext) return;
    handlePageChange(Number(page) + 1);
  }, [hasNext, handlePageChange, page]);

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
      <Table className="rounded-lg bg-card text-card-foreground" style={style}>
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
      {pageInfo && pages > 1 && (
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

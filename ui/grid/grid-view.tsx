'use client';

import React, {useMemo, useState} from 'react';

import {TableList} from '@/ui/components';
import {useSortBy} from '@/ui/hooks';
import {getPageInfo} from '@/utils';

import type {Column} from './types';
import {sortColumns} from './content.helpers';

const DEFAULT_PAGE_LIMIT = 5;

export const GridView = ({
  style,
  columns,
  data,
  handleRowClick,
  pageInfo,
  handlePage,
  localPageLimit = DEFAULT_PAGE_LIMIT,
}: {
  style?: React.CSSProperties;
  columns: Column[];
  data: any[];
  handleRowClick: (record: any) => void;
  pageInfo?: {
    count: number;
    limit: number;
    page: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  handlePage?: (page: number) => void;
  localPageLimit?: number;
}) => {
  const [page, setPage] = useState(1);

  const visibleColumns = useMemo(() => sortColumns(columns), [columns]);
  const isLocalPage = useMemo(() => pageInfo == null, [pageInfo]);
  const pageData = useMemo(
    () =>
      isLocalPage
        ? data?.slice((page - 1) * localPageLimit, page * localPageLimit)
        : data,
    [data, isLocalPage, localPageLimit, page],
  );

  const [sortedData, sort, toggleSort] = useSortBy(pageData);

  return (
    <div className="container mt-5 mb-20">
      <div className="p-2 bg-card rounded-md border">
        <TableList
          style={style}
          columns={visibleColumns}
          rows={sortedData}
          sort={sort}
          onSort={toggleSort}
          onRowClick={handleRowClick}
          pageInfo={
            pageInfo ??
            getPageInfo({
              count: data?.length,
              page,
              limit: localPageLimit,
            })
          }
          handlePage={isLocalPage ? setPage : handlePage}
        />
      </div>
    </div>
  );
};

export default GridView;

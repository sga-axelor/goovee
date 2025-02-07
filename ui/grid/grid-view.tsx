'use client';

import React, {useMemo, useState} from 'react';
import {MdAdd} from 'react-icons/md';

import {Button, TableList} from '@/ui/components';
import {Field, Panel} from '@/ui/form';
import {useSortBy} from '@/ui/hooks';
import {getPageInfo} from '@/utils';

import type {Column} from './types';
import {sortColumns} from './content.helpers';
import AdditionPopup from './addition-popup';

const DEFAULT_PAGE_LIMIT = 5;

export const GridView = ({
  style,
  columns,
  data,
  handleRowClick,
  pageInfo,
  handlePage,
  localPageLimit = DEFAULT_PAGE_LIMIT,
  creationContent,
  canCreate = false,
}: {
  style?: React.CSSProperties;
  columns: Partial<Column>[];
  data: any[];
  handleRowClick?: (record: any) => void;
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
  creationContent?: {fields: Field[]; panels?: Panel[]; model?: string};
  canCreate?: boolean;
}) => {
  const [page, setPage] = useState(1);
  const [formVisible, setFormVisible] = useState<boolean>(false);

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
      <div className="relative p-2 bg-card rounded-md border">
        {canCreate && creationContent && (
          <div className="flex justify-end absolute top-2 right-2 z-50">
            <AdditionPopup
              visible={formVisible}
              onClose={() => setFormVisible(false)}
              creationContent={creationContent}
            />
            <Button
              onClick={() => setFormVisible(true)}
              className="!px-2 !py-1 text-primary-foreground bg-success hover:bg-success-dark">
              <MdAdd className="h-6 w-6" />
            </Button>
          </div>
        )}
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

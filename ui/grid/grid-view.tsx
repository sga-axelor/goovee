'use client';

import React, {useMemo, useState} from 'react';
import {MdAdd, MdDelete, MdSearch} from 'react-icons/md';

import {i18n} from '@/locale';
import {Button, Label, TableList} from '@/ui/components';
import {Field, Panel} from '@/ui/form';
import {useSortBy} from '@/ui/hooks';
import {getPageInfo} from '@/utils';

import type {Column} from './types';
import {sortColumns} from './content.helpers';
import AdditionPopup from './addition-popup';
import SelectionPopup from './selection-popup';

const DEFAULT_PAGE_LIMIT = 5;

export const GridView = ({
  style,
  title,
  columns,
  data,
  handleRowClick,
  pageInfo,
  handlePage,
  localPageLimit = DEFAULT_PAGE_LIMIT,
  canCreate = false,
  creationContent,
  canSelect = false,
  selectionContent,
  selectedRows,
  canRemove = false,
  handleRemove,
}: {
  style?: React.CSSProperties;
  title?: string;
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
  canCreate?: boolean;
  creationContent?: {
    fields: Field[];
    panels?: Panel[];
    model?: string;
    handleCreate?: (data: any) => Promise<void>;
  };
  canSelect?: boolean;
  selectionContent?: {
    data: any[];
    handleSelect: (record: any) => void;
  };
  selectedRows?: any[];
  canRemove?: boolean;
  handleRemove?: () => void;
}) => {
  const [page, setPage] = useState(1);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [gridVisible, setGridVisible] = useState<boolean>(false);

  const visibleColumns = useMemo(() => sortColumns(columns), [columns]);
  const isLocalPage = useMemo(() => pageInfo == null, [pageInfo]);

  const [sortedData, sort, toggleSort] = useSortBy(data);

  const pageData = useMemo(
    () =>
      isLocalPage
        ? sortedData?.slice((page - 1) * localPageLimit, page * localPageLimit)
        : sortedData,
    [sortedData, isLocalPage, localPageLimit, page],
  );

  return (
    <div className="container mt-5 mb-20" style={style}>
      <div className="flex justify-between items-center mb-1">
        <Label className="text-base font-medium leading-6">
          {i18n.t(title ?? '')}
        </Label>
        <div className="flex flex-row gap-2 items-center">
          {canCreate && creationContent && (
            <div>
              <AdditionPopup
                visible={formVisible}
                onClose={() => setFormVisible(false)}
                creationContent={creationContent}
              />
              <Button
                onClick={e => {
                  e.preventDefault();
                  setFormVisible(true);
                }}
                className="!px-2 !py-1 text-primary-foreground bg-success hover:bg-success-dark">
                <MdAdd className="h-6 w-6" />
              </Button>
            </div>
          )}
          {canSelect && selectionContent && (
            <div>
              <SelectionPopup
                visible={gridVisible}
                onClose={() => setGridVisible(false)}
                selectionContent={{columns, ...selectionContent}}
              />
              <Button
                onClick={e => {
                  e.preventDefault();
                  setGridVisible(true);
                }}
                className="!px-2 !py-1 text-primary-foreground bg-success hover:bg-success-dark">
                <MdSearch className="h-6 w-6" />
              </Button>
            </div>
          )}
          {canRemove && handleRemove && (
            <Button
              onClick={e => {
                e.preventDefault();
                handleRemove();
              }}
              className="!px-2 !py-1 text-primary-foreground bg-success hover:bg-success-dark">
              <MdDelete className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>
      <div className="relative p-2 bg-card rounded-md border">
        <TableList
          columns={visibleColumns}
          rows={pageData}
          selectedRows={selectedRows}
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

'use client';
import React from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
// ---- CORE IMPORTS ---- //
import {Container, Pagination} from '@/ui/components';
import {i18n} from '@/lib/i18n';
// ---- LOCAL IMPORTS ---- //
import {Card, QuotationsTable} from '@/subapps/quotations/common/ui/components';
import {QUOTATIONS_COLUMNS} from '@/subapps/quotations/common/constants/quotations';
import type {Quotations} from '@/subapps/quotations/common/types/quotations';
type Props = {
  quotations: Quotations[];
  pageInfo?: any;
};
const Content = (props: Props) => {
  const {quotations, pageInfo} = props;
  const {page, pages} = pageInfo || {};
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handleRowClick = (id: any) => {
    router.push(`${pathname}/${id}`);
  };
  const updateSearchParams = (
    values: Array<{
      key: string;
      value?: string | number;
    }>,
  ) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    values.forEach(({key, value = ''}: any) => {
      value = value && String(value)?.trim();
      if (!value) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };
  const handlePreviousPage = () => {
    const {page, hasPrev} = pageInfo;
    if (!hasPrev) return;
    updateSearchParams([{key: 'page', value: Math.max(Number(page) - 1, 1)}]);
  };
  const handleNextPage = () => {
    const {page, hasNext} = pageInfo;
    if (!hasNext) return;
    updateSearchParams([{key: 'page', value: Number(page) + 1}]);
  };
  const handlePage = (page: string | number) => {
    updateSearchParams([{key: 'page', value: page}]);
  };

  return (
    <>
      <Container title={i18n.get('Quotations')}>
        <div className="hidden md:block">
          <QuotationsTable
            columns={QUOTATIONS_COLUMNS}
            quotations={quotations}
            onClick={handleRowClick}
          />
        </div>
        <div className="block md:hidden">
          <Card quotations={quotations} onClick={handleRowClick} />
        </div>
        <div className="flex items-center justify-center mt-6 mb-4">
          <Pagination
            page={page}
            pages={pages}
            disablePrev={!pageInfo?.hasPrev}
            disableNext={!pageInfo?.hasNext}
            onPrev={handlePreviousPage}
            onNext={handleNextPage}
            onPage={handlePage}
          />
        </div>
      </Container>
    </>
  );
};
export default Content;

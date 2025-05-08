'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {useSearchParams} from '@/ui/hooks';
import {Pagination} from '@/ui/components';
import {DEFAULT_PAGE, URL_PARAMS} from '@/constants';

export function PaginationContent({
  pageInfo: {page, pages, hasPrev, hasNext} = {},
}: {
  pageInfo: any;
}) {
  const {update} = useSearchParams();

  const handlePreviousPage = () => {
    if (!hasPrev) return;
    update([{key: URL_PARAMS.page, value: Math.max(Number(page) - 1, 1)}]);
  };

  const handleNextPage = () => {
    if (!hasNext) return;
    update([{key: URL_PARAMS.page, value: Number(page) + 1}]);
  };

  const handlePage = (page: string | number) => {
    update([{key: URL_PARAMS.page, value: page}]);
  };

  return (
    pages > DEFAULT_PAGE && (
      <div className="mb-12 md:mb-0">
        <Pagination
          page={page}
          pages={pages}
          disablePrev={!hasPrev}
          disableNext={!hasNext}
          onPrev={handlePreviousPage}
          onNext={handleNextPage}
          onPage={handlePage}
        />
      </div>
    )
  );
}

export default PaginationContent;

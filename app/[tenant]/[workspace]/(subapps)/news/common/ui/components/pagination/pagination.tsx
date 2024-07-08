'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {
  Pagination as ShadCnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/ui/components/pagination';

type PaginationProps = {
  page?: string | number;
  pages?: string | number;
  disablePrev?: boolean;
  disableNext?: boolean;
  onPage?: any;
  onPrev?: any;
  onNext?: any;
};
export const Pagination = ({
  page,
  pages,
  disableNext,
  disablePrev,
  onPrev,
  onNext,
  onPage,
}: PaginationProps) => {
  return (
    <>
      <ShadCnPagination>
        <PaginationContent>
          <PaginationItem className="cursor-pointer">
            <PaginationPrevious
              onClick={onPrev}
              className={`${
                disablePrev ? 'text-gray-400  pointer-events-none' : ''
              } `}
              // disabled={disablePrev}
            />
          </PaginationItem>
          {Array.from({length: Number(pages)}).map((_, i) => {
            const current = i + 1;

            return (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={current === page}
                  href="#"
                  className={
                    current === page
                      ? 'bg-success text-white rounded-full border-none'
                      : 'hover:rounded-full font-normal text-sm'
                  }
                  onClick={() => onPage?.(current)}>
                  {current}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          {/* <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem> */}
          {/* <PaginationItem>
            <PaginationLink href="#">{16}</PaginationLink>
          </PaginationItem> */}
          <PaginationItem className="cursor-pointer">
            <PaginationNext
              onClick={onNext}
              className={`${
                disableNext ? 'text-gray-400  pointer-events-none' : ''
              } `}
              // disabled={disableNext}
            />
          </PaginationItem>
        </PaginationContent>
      </ShadCnPagination>
    </>
  );
};

export default Pagination;

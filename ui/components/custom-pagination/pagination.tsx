'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {
  Pagination as ShadCnPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
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
  const currentPage = Number(page) || 1;
  const totalPages = Number(pages) || 1;

  const renderPaginationItems = () => {
    const items = [];

    items.push(renderPaginationLink(1));

    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    let startPage: number, endPage: number;

    if (currentPage < 3) {
      startPage = 2;
      endPage = Math.min(totalPages - 1, 3);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3);
      endPage = totalPages - 1;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(renderPaginationLink(i));
    }

    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    if (totalPages > 1) {
      items.push(renderPaginationLink(totalPages));
    }

    return items;
  };

  const renderPaginationLink = (pageNumber: number) => (
    <PaginationItem key={pageNumber}>
      <PaginationLink
        isActive={pageNumber === currentPage}
        href="#"
        className={
          pageNumber === currentPage
            ? 'bg-success hover:bg-success-dark text-white hover:text-white rounded-full border-none'
            : 'hover:rounded-full font-normal text-sm'
        }
        onClick={() => onPage?.(pageNumber)}>
        {pageNumber}
      </PaginationLink>
    </PaginationItem>
  );

  return (
    <ShadCnPagination>
      <PaginationContent>
        <PaginationItem className="cursor-pointer">
          <PaginationPrevious
            onClick={onPrev}
            className={`${
              disablePrev ? 'text-gray-400 pointer-events-none' : ''
            }`}
          />
        </PaginationItem>

        {renderPaginationItems()}

        <PaginationItem className="cursor-pointer">
          <PaginationNext
            onClick={onNext}
            className={`${
              disableNext ? 'text-gray-400 pointer-events-none' : ''
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </ShadCnPagination>
  );
};

export default Pagination;

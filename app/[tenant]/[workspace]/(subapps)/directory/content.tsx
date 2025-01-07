import {ChevronLeft, ChevronRight} from 'lucide-react';
import Link from 'next/link';

// ---- CORE IMPORTS ---- //
import {getTranslation} from '@/lib/core/i18n/server';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/ui/components/pagination';
import {clone} from '@/utils';
import {getPaginationButtons} from '@/utils/pagination';

// ---- LOCAL IMPORTS ---- //
import type {ListEntry} from './common/orm';
import {Card} from './common/ui/components/card';
import {Map} from './common/ui/components/map';
import {Sort} from './common/ui/components/sort';

type ContentProps = {
  workspaceURI: string;
  url: string;
  entries: ListEntry[];
  tenant: string;
  pages: number;
  searchParams?: any;
};

export async function Content({
  workspaceURI,
  tenant,
  pages,
  searchParams,
  entries,
  url,
}: ContentProps) {
  if (!entries || entries.length === 0) {
    return (
      <h2 className="font-semibold text-xl text-center mt-5">
        {await getTranslation('No entries found.')}
      </h2>
    );
  }

  return (
    <>
      {/* NOTE: expand class applied by the map , when it is expanded and when it is in mobile view */}
      <div className="flex has-[.expand]:flex-col gap-4 mt-4">
        <aside className="space-y-4">
          <Map
            showExpand
            entries={clone(
              entries.filter(
                x => x.address?.longit && x.address?.latit && x.isMap,
              ),
            )}
          />
          <Sort />
        </aside>
        <main className="grow flex flex-col gap-4">
          {entries.map(item => (
            <Card
              item={item}
              url={`${workspaceURI}/directory/entry/${item.id}`}
              key={item.id}
              tenant={tenant}
            />
          ))}
        </main>
      </div>
      {pages > 1 && (
        <CardPagination url={url} pages={pages} searchParams={searchParams} />
      )}
    </>
  );
}

type CardPaginationProps = {
  url: string;
  searchParams: {page?: number; limit?: number};
  pages: number;
};

function CardPagination({url, searchParams, pages}: CardPaginationProps) {
  const {page = 1} = searchParams;

  return (
    <Pagination className="p-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious asChild>
            <Link
              replace
              scroll={false}
              className={+page <= 1 ? 'invisible' : ''}
              href={{pathname: url, query: {...searchParams, page: +page - 1}}}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Link>
          </PaginationPrevious>
        </PaginationItem>
        {getPaginationButtons({currentPage: +page, totalPages: pages}).map(
          (value, i) =>
            typeof value === 'string' ? (
              <PaginationItem key={i}>
                <span className="pagination-ellipsis">...</span>
              </PaginationItem>
            ) : (
              <PaginationItem key={value}>
                <PaginationLink isActive={+page === value} asChild>
                  <Link
                    replace
                    scroll={false}
                    href={{
                      pathname: url,
                      query: {...searchParams, page: value},
                    }}>
                    {value}
                  </Link>
                </PaginationLink>
              </PaginationItem>
            ),
        )}
        <PaginationItem>
          <PaginationNext asChild>
            <Link
              replace
              scroll={false}
              className={+page >= pages ? 'invisible' : ''}
              href={{pathname: url, query: {...searchParams, page: +page + 1}}}>
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

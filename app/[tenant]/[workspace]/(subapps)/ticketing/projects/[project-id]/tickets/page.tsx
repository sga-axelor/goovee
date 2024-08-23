// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {findWorkspace} from '@/orm/workspace';
import type {SearchParams} from '@/types/search-param';
import type {Maybe} from '@/types/util';
import {Button} from '@/ui/components/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/ui/components/pagination';
import {TableCell, TableRow} from '@/ui/components/table';
import {clone} from '@/utils';
import {cn} from '@/utils/css';
import {workspacePathname} from '@/utils/workspace';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import Link from 'next/link';
import {Suspense} from 'react';
import {MdAdd} from 'react-icons/md';

// ---- LOCAL IMPORTS ---- //
import {columns, filterMap, sortMap} from '../../../common/constants';
import {
  findProjectTickets,
  findTicketPriorities,
  findTicketStatuses,
  findUsers,
} from '../../../common/orm/projects';
import type {FilterKey} from '../../../common/types';
import {Filter} from '../../../common/ui/components/filter';
import {TicketList} from '../../../common/ui/components/ticket-list';
import {getPages, getPaginationButtons, getSkip} from '../../../common/utils';
import Search from '../search';
import {getWhere, getOrderBy} from '../../../common/utils/search-param';

const TICKETS_PER_PAGE = 7;
const DEFAULT_SORT = 'updatedOn';
export default async function Page({
  params,
  searchParams,
}: {
  params: {tenant: string; workspace: string; 'project-id': string};
  searchParams: SearchParams<FilterKey>;
}) {
  const projectId = params?.['project-id'];

  const {
    limit = TICKETS_PER_PAGE,
    page = 1,
    sort = DEFAULT_SORT,
    ...filterParams
  } = searchParams;

  const session = await getSession();
  // const userId = session!.user.id;
  const userId = '1';

  const {workspaceURL, workspaceURI} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  const tickets = findProjectTickets({
    projectId,
    take: Number(limit),
    skip: getSkip(limit, page),
    where: getWhere(filterParams, filterMap),
    orderBy: getOrderBy(sort, sortMap),
  });

  const url = `${workspaceURI}/ticketing/projects/${projectId}/tickets`;
  return (
    <div className="container my-6 space-y-6 mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xl">{i18n.get('All tickets')}</h2>
        <Button variant="success" className="flex items-center" asChild>
          <Link
            href={`${workspaceURI}/ticketing/projects/${projectId}/tickets/edit`}>
            <MdAdd className="size-6" />
            <span>{i18n.get('Create a ticket')}</span>
          </Link>
        </Button>
      </div>
      <div className="flex items-end justify-between gap-6">
        <Search workspace={workspace} />
        <Suspense>
          <AsyncFilter url={url} searchParams={searchParams} />
        </Suspense>
      </div>
      <TicketList
        tickets={tickets}
        url={url}
        searchParams={searchParams}
        footer={
          <TableRow>
            <TableCell colSpan={columns.length + 1} align="center">
              <Suspense>
                <AsyncPagination
                  tickets={tickets}
                  url={url}
                  searchParams={searchParams}
                />
              </Suspense>
            </TableCell>
          </TableRow>
        }
      />
    </div>
  );
}

async function AsyncFilter({
  url,
  searchParams,
}: {
  url: string;
  searchParams: SearchParams<FilterKey>;
}) {
  const [users, statuses, priorities] = await Promise.all([
    findUsers().then(clone),
    findTicketStatuses().then(clone),
    findTicketPriorities().then(clone),
  ]);

  return (
    <Filter
      users={users}
      priorities={priorities}
      statuses={statuses}
      url={url}
      searchParams={searchParams}
    />
  );
}

async function AsyncPagination(props: {
  tickets: Promise<any[]>;
  searchParams: SearchParams<FilterKey>;
  url: string;
}) {
  const {url, searchParams} = props;
  const {page = 1, limit = TICKETS_PER_PAGE} = searchParams;
  const tickets = await props.tickets;
  const pages = getPages(tickets, limit);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious asChild>
            <Link
              className={cn({
                ['invisible']: +page <= 1,
              })}
              href={{
                pathname: url,
                query: {
                  ...searchParams,
                  page: +page - 1,
                },
              }}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Link>
          </PaginationPrevious>
        </PaginationItem>
        {getPaginationButtons(+page, pages).map((value, i) => {
          if (typeof value == 'string') {
            return (
              <PaginationItem key={i}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          return (
            <PaginationItem key={value}>
              <PaginationLink isActive={+page === value} asChild>
                <Link
                  href={{
                    pathname: url,
                    query: {
                      ...searchParams,
                      page: value,
                    },
                  }}>
                  {value}
                </Link>
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext asChild>
            <Link
              className={cn({
                ['invisible']: +page >= pages,
              })}
              href={{
                pathname: url,
                query: {
                  ...searchParams,
                  page: +page + 1,
                },
              }}>
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

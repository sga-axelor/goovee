// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {findWorkspace} from '@/orm/workspace';
import {Button} from '@/ui/components/button';
import {TableCell, TableRow} from '@/ui/components/table';
import {clone} from '@/utils';
import {cn} from '@/utils/css';
import {workspacePathname} from '@/utils/workspace';
import {Suspense} from 'react';
import {MdAdd} from 'react-icons/md';

// ---- LOCAL IMPORTS ---- //
import {columns} from '../../../common/constants';
import {findProjectTickets} from '../../../common/orm/projects';
import {FilterForm} from '../../../common/ui/components/filter';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../../common/ui/components/pagination';
import {TicketList} from '../../../common/ui/components/ticket-list';
import {
  getPages,
  getPaginationButtons,
  getSkip,
  getSortDirection,
  getSortKey,
} from '../../../common/utils';
import Search from '../search';

export default async function Page({
  params,
  searchParams,
}: {
  params: {tenant: string; workspace: string; 'project-id': string};
  searchParams: {[key: string]: string | undefined};
}) {
  const projectId = params?.['project-id'];

  const {limit = 7, page = 1, sort = 'updatedOn'} = searchParams;

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
    orderBy: columns
      .find((c: {key: any}) => c.key === getSortKey(sort))
      ?.orderBy?.(getSortDirection(sort)),
  });

  const url = `${workspaceURI}/ticketing/projects/${projectId}/tickets`;
  return (
    <div className="container my-6 space-y-6 mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xl">{i18n.get('All tickets')}</h2>
        <Button variant="success" className="flex items-center">
          <MdAdd className="size-6" />
          <span>{i18n.get('Create a ticket')}</span>
        </Button>
      </div>
      <div className="flex items-end justify-between gap-6">
        <Search workspace={workspace} />
        <FilterForm />
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
                  limit={Number(limit)}
                  page={Number(page)}
                  sort={searchParams.sort}
                />
              </Suspense>
            </TableCell>
          </TableRow>
        }
      />
    </div>
  );
}

async function AsyncPagination(props: {
  tickets: Promise<any[]>;
  limit: number;
  url: string;
  page: string | number;
  sort: string | undefined;
}) {
  const {limit, url, page, sort} = props;
  const tickets = await props.tickets;

  const pages = getPages(tickets, limit);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn({
              ['invisible']: +page <= 1,
            })}
            href={{
              pathname: url,
              query: {
                page: +page - 1,
                sort: sort,
              },
            }}
          />
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
              <PaginationLink
                isActive={+page === value}
                href={{
                  pathname: url,
                  query: {
                    page: value,
                    sort: sort,
                  },
                }}>
                {value}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            className={cn({
              ['invisible']: +page >= pages,
            })}
            href={{
              pathname: url,
              query: {
                page: +page + 1,
                sort: sort,
              },
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

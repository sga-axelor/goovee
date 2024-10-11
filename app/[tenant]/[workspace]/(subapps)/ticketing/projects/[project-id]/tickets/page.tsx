// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {findWorkspace} from '@/orm/workspace';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/ui/components';
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
import {decodeFilter} from '@/utils/filter';
import {workspacePathname} from '@/utils/workspace';
import {ID} from '@goovee/orm';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {Suspense} from 'react';
import {FaChevronRight} from 'react-icons/fa';
import {MdAdd} from 'react-icons/md';

// ---- LOCAL IMPORTS ---- //
import {columns, DEFAULT_SORT, sortKeyPathMap} from '../../../common/constants';
import {
  findContactPartners,
  findProject,
  findCompany,
  findTicketPriorities,
  findTicketStatuses,
  findClientPartner,
} from '../../../common/orm/projects';
import {findTickets} from '../../../common/orm/tickets';
import type {SearchParams} from '../../../common/types/search-param';
import {Filter} from '../../../common/ui/components/filter';
import {TicketList} from '../../../common/ui/components/ticket-list';
import {getPages, getPaginationButtons} from '../../../common/utils';
import {
  getOrderBy,
  getSkip,
  getWhere,
} from '../../../common/utils/search-param';
import Search from '../search';

const TICKETS_PER_PAGE = 7;
export default async function Page({
  params,
  searchParams,
}: {
  params: {tenant: string; workspace: string; 'project-id': string};
  searchParams: SearchParams;
}) {
  const projectId = params?.['project-id'];

  const {
    limit = TICKETS_PER_PAGE,
    page = 1,
    sort = DEFAULT_SORT,
    filter,
  } = searchParams;

  const session = await getSession();
  if (!session?.user) notFound();
  const userId = session!.user.id;

  const {workspaceURL, workspaceURI} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  if (!workspace) notFound();

  const project = await findProject(projectId, workspace.id, userId);
  if (!project) notFound();

  const tickets = await findTickets({
    projectId,
    take: +limit,
    skip: getSkip(limit, page),
    where: getWhere(decodeFilter(filter), userId),
    orderBy: getOrderBy(sort, sortKeyPathMap),
  }).then(clone);

  const url = `${workspaceURI}/ticketing/projects/${projectId}/tickets`;
  const pages = getPages(tickets, limit);
  return (
    <div className="container my-6 space-y-6 mx-auto">
      <div className="flex flex-col items-center justify-between md:flex-row gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="text-foreground-muted cursor-pointer truncate text-md">
                <Link href={`${workspaceURI}/ticketing`}>
                  {i18n.get('Projects')}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <FaChevronRight className="text-primary" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="cursor-pointer max-w-[8ch] md:max-w-[15ch] truncate text-md">
                <Link href={`${workspaceURI}/ticketing/projects/${projectId}`}>
                  {project.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <FaChevronRight className="text-primary" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate text-lg font-semibold">
                <h2 className="font-semibold text-xl">
                  {i18n.get('All tickets')}
                </h2>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button variant="success" className="flex items-center" asChild>
          <Link
            href={`${workspaceURI}/ticketing/projects/${projectId}/tickets/create`}>
            <MdAdd className="size-6" />
            <span>{i18n.get('Create a ticket')}</span>
          </Link>
        </Button>
      </div>
      <div className="lg:flex items-end justify-between gap-6">
        <Search projectId={projectId} inputClassName="h-[39px]" />
        <Suspense>
          <AsyncFilter
            url={url}
            searchParams={searchParams}
            projectId={projectId}
          />
        </Suspense>
      </div>
      <TicketList
        tickets={tickets}
        footer={<Footer url={url} pages={pages} searchParams={searchParams} />}
      />
    </div>
  );
}

type FooterProps = {
  url: string;
  searchParams: SearchParams;
  pages: number;
};

function Footer(props: FooterProps) {
  const {url, searchParams, pages} = props;
  const {page = 1} = searchParams;
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious asChild>
            <Link
              replace
              scroll={false}
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
                  replace
                  scroll={false}
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
              replace
              scroll={false}
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

async function AsyncFilter({
  url,
  searchParams,
  projectId,
}: {
  url: string;
  searchParams: SearchParams;
  projectId: ID;
}) {
  const [contacts, statuses, priorities, company, clientPartner] =
    await Promise.all([
      findContactPartners(projectId),
      findTicketStatuses(projectId),
      findTicketPriorities(projectId),
      findCompany(projectId),
      findClientPartner(projectId),
    ]).then(clone);

  return (
    <Filter
      contacts={contacts}
      priorities={priorities}
      statuses={statuses}
      company={company}
      url={url}
      searchParams={searchParams}
      clientPartner={clientPartner}
    />
  );
}

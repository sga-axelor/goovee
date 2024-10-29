// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {getSession} from '@/auth';
import {findWorkspace} from '@/orm/workspace';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
} from '@/ui/components';
import {Skeleton} from '@/ui/components/skeleton';
import {clone} from '@/utils';
import {encodeFilter} from '@/utils/url';
import {workspacePathname} from '@/utils/workspace';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {Suspense} from 'react';
import {IconType} from 'react-icons';
import {FaChevronRight} from 'react-icons/fa';
import {
  MdAdd,
  MdAllInbox,
  MdArrowForward,
  MdCheckCircleOutline,
  MdListAlt,
  MdPending,
} from 'react-icons/md';

// ---- LOCAL IMPORTS ---- //
import {cn} from '@/utils/css';
import {DEFAULT_SORT, sortKeyPathMap} from '../../common/constants';
import {findProject, findTicketStatuses} from '../../common/orm/projects';
import {
  findTickets,
  getAllTicketCount,
  getCreatedTicketCount,
  getManagedTicketCount,
  getMyTicketCount,
  getResolvedTicketCount,
} from '../../common/orm/tickets';
import type {SearchParams} from '../../common/types/search-param';
import {Swipe} from '../../common/ui/components/swipe';
import {TicketList} from '../../common/ui/components/ticket-list';
import {getOrderBy, getSkip} from '../../common/utils/search-param';
import {EncodedFilter} from '../../common/utils/validators';
import Search from './search';

export default async function Page({
  params,
  searchParams,
}: {
  params: {tenant: string; workspace: string; 'project-id': string};
  searchParams: SearchParams;
}) {
  const projectId = params?.['project-id'];

  const {limit = 7, page = 1, sort = DEFAULT_SORT} = searchParams;

  const session = await getSession();
  if (!session?.user) notFound();
  const userId = session!.user.id;

  const {workspaceURL, workspaceURI, tenant} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) notFound();

  const project = await findProject(projectId, workspace.id, userId, tenant);

  if (!project) notFound();
  const tickets = await findTickets({
    projectId,
    take: Number(limit),
    skip: getSkip(limit, page),
    orderBy: getOrderBy(sort, sortKeyPathMap),
    where: {
      status: {
        isCompleted: false,
      },
    },
    tenantId: tenant,
  }).then(clone);

  const ticketsURL = `${workspaceURI}/ticketing/projects/${projectId}/tickets`;

  const statuses = await findTicketStatuses(projectId, tenant);

  const status = statuses.filter(s => !s.isCompleted).map(s => s.id);
  const statusCompleted = statuses.filter(s => s.isCompleted).map(s => s.id);
  const allTicketsURL = `${ticketsURL}?filter=${encodeFilter<EncodedFilter>({status})}`;
  const items = [
    {
      label: 'All Tickets',
      count: getAllTicketCount({projectId, tenantId: tenant}),
      icon: MdAllInbox,
      href: allTicketsURL,
      iconClassName: 'bg-palette-pink text-palette-pink-dark',
    },
    {
      label: 'My tickets',
      count: getMyTicketCount({projectId, userId, tenantId: tenant}),
      href: `${ticketsURL}?filter=${encodeFilter<EncodedFilter>({status, myTickets: true})}`,
      icon: MdAllInbox,
      iconClassName: 'bg-palette-blue text-palette-blue-dark',
    },
    {
      label: 'Managed tickets',
      count: getManagedTicketCount({projectId, userId, tenantId: tenant}),
      icon: MdListAlt,
      href: `${ticketsURL}?filter=${encodeFilter<EncodedFilter>({status, managedBy: [userId.toString()]})}`,
      iconClassName: 'bg-palette-purple text-palette-purple-dark',
    },
    {
      label: 'Created tickets',
      count: getCreatedTicketCount({projectId, userId, tenantId: tenant}),
      icon: MdPending,
      href: `${ticketsURL}?filter=${encodeFilter<EncodedFilter>({status, createdBy: [userId.toString()]})}`,
      iconClassName: 'bg-palette-yellow text-palette-yellow-dark',
    },
    {
      label: 'Resolved tickets',
      count: getResolvedTicketCount({projectId, tenantId: tenant}),
      icon: MdCheckCircleOutline,
      href: `${ticketsURL}?filter=${encodeFilter<EncodedFilter>({status: statusCompleted})}`,
      iconClassName: 'text-success bg-success-light',
    },
  ].map(props => (
    <Suspense key={props.label} fallback={<TicketCardSkeleton />}>
      <TicketCard {...props} />
    </Suspense>
  ));

  return (
    <div className="container my-6 space-y-6 mx-auto">
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
            <BreadcrumbPage className="sm:truncate text-lg  font-semibold">
              {project.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Search
        projectId={projectId}
        inputClassName="h-[39px] placeholder:!text-sm text-sm"
      />
      <Swipe items={items} />
      <div className="flex items-center justify-between !mt-0">
        <h2 className="font-semibold text-xl">{i18n.get('Latest tickets')}</h2>
        <Button variant="success" className="flex items-center" asChild>
          <Link href={`${ticketsURL}/create`}>
            <MdAdd className="size-6" />
            <span>{i18n.get('Create a ticket')}</span>
          </Link>
        </Button>
      </div>
      <div>
        <TicketList tickets={tickets} />
        <div className="flex justify-end p-4">
          <Link
            href={allTicketsURL}
            className="inline-flex gap-1 items-center text-success text-sm font-medium">
            {i18n.get('See all tickets')}
            <MdArrowForward />
          </Link>
        </div>
      </div>
    </div>
  );
}

type TicketCardProps = {
  label: string;
  count: Promise<number>;
  href: string;
  icon: IconType;
  iconClassName: string;
};

const wrapperClassName = 'flex items-center gap-6 px-4 h-full';
const iconWrapperClassName =
  'flex items-center justify-center h-10 w-10 rounded-full';

async function TicketCard(props: TicketCardProps) {
  const {label, icon: Icon, count: countPromise, href, iconClassName} = props;
  const count = await countPromise;

  return (
    <Link href={href} className={wrapperClassName}>
      <div className={cn(iconWrapperClassName, iconClassName)}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="grow flex flex-col justify-between">
        <h3 className="text-[28px] font-semibold">{count}</h3>
        <p className="text-sm font-semibold">{label}</p>
      </div>
    </Link>
  );
}

function TicketCardSkeleton() {
  return (
    <div className={wrapperClassName}>
      <Skeleton className={iconWrapperClassName} />
      <div className="grow flex flex-col gap-2">
        <Skeleton className="w-[3rem] h-[2rem]" />
        <Skeleton className="w-[7rem] h-[1.5rem]" />
      </div>
    </div>
  );
}

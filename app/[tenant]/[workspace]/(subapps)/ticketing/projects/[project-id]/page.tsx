// ---- CORE IMPORTS ---- //
import {t} from '@/locale/server';
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
import {formatNumber} from '@/locale/server/formatters';
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
import {ensureAuth} from '../../common/utils/auth-helper';
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

  const {workspaceURL, workspaceURI, tenant} = workspacePathname(params);

  const {error, info} = await ensureAuth(workspaceURL, tenant);
  if (error) notFound();
  const {auth, workspace} = info;

  const [project, tickets, statuses] = await Promise.all([
    findProject(projectId, auth),
    findTickets({
      projectId,
      take: Number(limit),
      skip: getSkip(limit, page),
      orderBy: getOrderBy(sort, sortKeyPathMap),
      where: {status: {isCompleted: false}},
      auth,
    }).then(clone),
    findTicketStatuses(projectId, tenant),
  ]);

  if (!project) notFound();

  const ticketsURL = `${workspaceURI}/ticketing/projects/${projectId}/tickets`;
  const status = statuses.filter(s => !s.isCompleted).map(s => s.id);
  const statusCompleted = statuses.filter(s => s.isCompleted).map(s => s.id);
  const allTicketsURL = `${ticketsURL}?filter=${encodeFilter<EncodedFilter>({status})}`;
  const items = [
    workspace.config.isShowAllTickets && {
      label: await t('All tickets'),
      count: getAllTicketCount({projectId, auth}),
      icon: MdAllInbox,
      href: allTicketsURL,
      iconClassName: 'bg-palette-pink text-palette-pink-dark',
    },
    workspace.config.isShowMyTickets && {
      label: await t('My tickets'),
      count: getMyTicketCount({projectId, auth}),
      href: `${ticketsURL}?filter=${encodeFilter<EncodedFilter>({status, myTickets: true})}`,
      icon: MdAllInbox,
      iconClassName: 'bg-palette-blue text-palette-blue-dark',
    },
    workspace.config.isShowManagedTicket && {
      label: await t('Managed tickets'),
      count: getManagedTicketCount({projectId, auth}),
      icon: MdListAlt,
      href: `${ticketsURL}?filter=${encodeFilter<EncodedFilter>({status, managedBy: [auth.userId.toString()]})}`,
      iconClassName: 'bg-palette-purple text-palette-purple-dark',
    },
    workspace.config.isShowCreatedTicket && {
      label: await t('Created tickets'),
      count: getCreatedTicketCount({projectId, auth}),
      icon: MdPending,
      href: `${ticketsURL}?filter=${encodeFilter<EncodedFilter>({status, createdBy: [auth.userId.toString()]})}`,
      iconClassName: 'bg-palette-yellow text-palette-yellow-dark',
    },
    workspace.config.isShowResolvedTicket && {
      label: await t('Resolved tickets'),
      count: getResolvedTicketCount({projectId, auth}),
      icon: MdCheckCircleOutline,
      href: `${ticketsURL}?filter=${encodeFilter<EncodedFilter>({status: statusCompleted})}`,
      iconClassName: 'text-success bg-success-light',
    },
  ]
    .filter(Boolean)
    .map(
      props =>
        props && (
          <Suspense key={props.label} fallback={<TicketCardSkeleton />}>
            <TicketCard {...props} />
          </Suspense>
        ),
    );

  return (
    <div className="container my-6 space-y-6 mx-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              asChild
              className="text-foreground-muted cursor-pointer truncate text-md">
              <Link href={`${workspaceURI}/ticketing`}>
                {await t('Projects')}
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
        <h2 className="font-semibold text-xl">{await t('Latest tickets')}</h2>
        <Button variant="success" className="flex items-center" asChild>
          <Link href={`${ticketsURL}/create`}>
            <MdAdd className="size-6" />
            <span>{await t('Create a ticket')}</span>
          </Link>
        </Button>
      </div>
      <div>
        <TicketList tickets={tickets} />
        <div className="flex justify-end p-4">
          <Link
            href={allTicketsURL}
            className="inline-flex gap-1 items-center text-success text-sm font-medium">
            {await t('See all tickets')}
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

const wrapperClassName = 'flex items-center gap-5 px-4 h-full';
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
        <h3 className="text-[28px] font-semibold">{formatNumber(count)}</h3>
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

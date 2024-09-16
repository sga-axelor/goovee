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
  Button,
  TableCell,
  TableRow,
} from '@/ui/components';
import {Skeleton} from '@/ui/components/skeleton';
import {clone} from '@/utils';
import {encodeFilter} from '@/utils/filter';
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
import {columns, sortKeyPathMap} from '../../common/constants';
import {findProject, findTicketStatuses} from '../../common/orm/projects';
import {
  findTickets,
  getAllTicketCount,
  getAssignedTicketCount,
  getCreatedTicketCount,
  getMyTicketCount,
  getResolvedTicketCount,
} from '../../common/orm/tickets';
import type {SearchParams} from '../../common/types/search-param';
import {Swipe} from '../../common/ui/components/swipe';
import {TicketList} from '../../common/ui/components/ticket-list';
import {getOrderBy, getSkip} from '../../common/utils/search-param';
import Hero from './hero';

export default async function Page({
  params,
  searchParams,
}: {
  params: {tenant: string; workspace: string; 'project-id': string};
  searchParams: SearchParams;
}) {
  const projectId = params?.['project-id'];

  const {limit = 7, page = 1, sort = 'updatedOn'} = searchParams;

  const session = await getSession();
  if (!session?.user) notFound();
  const userId = session!.user.id;

  const {workspaceURL, workspaceURI} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  const project = (await findProject(projectId, workspace.id, userId))!;
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
  }).then(clone);

  const ticketsURL = `${workspaceURI}/ticketing/projects/${projectId}/tickets`;

  const statuses = await findTicketStatuses(projectId);

  const status = statuses.filter(s => !s.isCompleted).map(s => s.id);
  const statusCompleted = statuses.filter(s => s.isCompleted).map(s => s.id);
  const allTicketsURL = `${ticketsURL}?filter=${encodeFilter({status})}`;
  const items = [
    {
      label: 'All Tickets',
      count: getAllTicketCount(projectId),
      icon: MdAllInbox,
      href: allTicketsURL,
      iconColor: 'palette-pink-dark',
      iconBgColor: 'palette-pink',
    },
    {
      label: 'My tickets',
      count: getMyTicketCount(projectId, userId),
      href: `${ticketsURL}?filter=${encodeFilter({status, myTickets: true})}`,
      icon: MdAllInbox,
      iconColor: 'palette-blue-dark',
      iconBgColor: 'palette-blue',
    },
    {
      label: 'Assigned tickets',
      count: getAssignedTicketCount(projectId, userId),
      icon: MdListAlt,
      href: `${ticketsURL}?filter=${encodeFilter({status, assignedTo: [userId]})}`,
      iconColor: 'palette-purple-dark',
      iconBgColor: 'palette-purple',
    },
    {
      label: 'Created tickets',
      count: getCreatedTicketCount(projectId, userId),
      icon: MdPending,
      href: `${ticketsURL}?filter=${encodeFilter({status, requestedBy: [userId]})}`,
      iconColor: 'palette-yellow-dark',
      iconBgColor: 'palette-yellow',
    },
    {
      label: 'Resolved tickets',
      count: getResolvedTicketCount(projectId),
      icon: MdCheckCircleOutline,
      href: `${ticketsURL}?filter=${encodeFilter({status: statusCompleted})}`,
      iconColor: 'success',
      iconBgcolor: 'success-light',
    },
  ].map(props => (
    <Suspense key={props.label} fallback={<TicketCardSkeleton />}>
      <TicketCard {...props} />
    </Suspense>
  ));

  return (
    <>
      <Hero projectId={projectId} />
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
              <BreadcrumbPage className="sm:truncate text-lg font-semibold">
                {project.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Swipe items={items} />
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl">
            {i18n.get('Latest tickets')}
          </h2>
          <Button variant="success" className="flex items-center" asChild>
            <Link href={`${ticketsURL}/create`}>
              <MdAdd className="size-6" />
              <span>{i18n.get('Create a ticket')}</span>
            </Link>
          </Button>
        </div>
        <TicketList
          tickets={tickets}
          footer={
            <TableRow>
              <TableCell colSpan={columns.length + 1} align="right">
                <Link
                  href={allTicketsURL}
                  className="inline-flex gap-1 items-center">
                  {i18n.get('See all tickets')}
                  <MdArrowForward />
                </Link>
              </TableCell>
            </TableRow>
          }
        />
      </div>
    </>
  );
}

type TicketCardProps = {
  label: string;
  count: Promise<number>;
  href?: string;
  icon?: IconType;
  iconColor: string;
  iconBgColor: string;
};

async function TicketCard(props: TicketCardProps) {
  const {
    label,
    icon: Icon,
    count: countPromise,
    href,
    iconColor,
    iconBgColor,
  } = props;
  const count = await countPromise;

  const content = (
    <>
      <div
        className={`flex items-center justify-center h-10 w-10 bg-${iconBgColor} rounded-full`}>
        {Icon && <Icon className={`h-6 w-6 text-${iconColor}`} />}
      </div>
      <div className="grow flex flex-col justify-between">
        <h3 className="text-[28px] font-semibold">{count}</h3>
        <p className="text-sm font-semibold">{label}</p>
      </div>
    </>
  );

  const className = 'flex items-center gap-6 px-4 h-full';
  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }
  return <div className={className}>{content}</div>;
}

function TicketCardSkeleton() {
  return (
    <div className="flex items-center gap-6 px-6 h-[80px]">
      <div className="h-[56px] w-[56px] p-2 bg-muted rounded-full">
        <Skeleton className={`h-[40px] w-[40px]`} />
      </div>
      <div className="grow flex flex-col gap-2">
        <Skeleton className="w-[3rem] h-[2rem]" />
        <Skeleton className="w-[7rem] h-[1.5rem]" />
      </div>
    </div>
  );
}

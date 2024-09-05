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
import Link from 'next/link';
import {columns, sortKeyPathMap} from '../../common/constants';
import {findProject} from '../../common/orm/projects';
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
  // const userId = session!.user.id;
  const userId = '1';

  const {workspaceURL, workspaceURI} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  const project = (await findProject(projectId, workspace.id))!;
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

  const items = [
    {
      label: 'All Tickets',
      count: getAllTicketCount(projectId),
      icon: MdAllInbox,
      href: `${ticketsURL}?filter=${encodeFilter({statusCompleted: false})}`,
    },
    {
      label: 'My tickets',
      count: getMyTicketCount(projectId, userId),
      href: `${ticketsURL}?filter=${encodeFilter({statusCompleted: false, myTickets: true})}`,
      icon: MdAllInbox,
    },
    {
      label: 'Assigned tickets',
      count: getAssignedTicketCount(projectId, userId),
      icon: MdListAlt,
      href: `${ticketsURL}?filter=${encodeFilter({statusCompleted: false, assignedTo: [userId]})}`,
    },
    {
      label: 'Created tickets',
      count: getCreatedTicketCount(projectId, userId),
      icon: MdPending,
      href: `${ticketsURL}?filter=${encodeFilter({statusCompleted: false, requestedBy: [userId]})}`,
    },
    {
      label: 'Resolved tickets',
      count: getResolvedTicketCount(projectId),
      icon: MdCheckCircleOutline,
      href: `${ticketsURL}?filter=${encodeFilter({statusCompleted: true})}`,
    },
  ].map(props => (
    <Suspense key={props.label} fallback={<TicketCardSkeleton />}>
      <TicketCard {...props} />
    </Suspense>
  ));

  return (
    <>
      <Hero workspace={workspace} projectId={projectId} />
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
              <FaChevronRight className="text-black" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate text-lg font-semibold">
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
          projectId={projectId}
          footer={
            <TableRow>
              <TableCell colSpan={columns.length + 1} align="right">
                <Link
                  href={ticketsURL}
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
};

async function TicketCard(props: TicketCardProps) {
  const {label, icon: Icon, count: countPromise, href} = props;
  const count = await countPromise;

  const content = (
    <>
      <div className="h-[56px] w-[56px] p-2 bg-muted rounded-full">
        {Icon && (
          <Icon className={`h-[40px] w-[40px] text-success bg-success-light`} />
        )}
      </div>
      <div className="grow flex flex-col justify-between">
        <h3 className="text-[2rem] font-semibold">{count}</h3>
        <p className="font-semibold">{label}</p>
      </div>
    </>
  );

  const className = 'flex items-center gap-6 px-6 h-[80px]';
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

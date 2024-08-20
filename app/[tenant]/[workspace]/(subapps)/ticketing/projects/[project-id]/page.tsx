// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {findWorkspace} from '@/orm/workspace';
import {Button, TableCell, TableRow} from '@/ui/components';
import {Skeleton} from '@/ui/components/skeleton';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {Suspense} from 'react';
import {IconType} from 'react-icons';
import {
  MdAdd,
  MdAllInbox,
  MdArrowForward,
  MdCheckCircleOutline,
  MdListAlt,
  MdPending,
} from 'react-icons/md';

// ---- LOCAL IMPORTS ---- //
import {
  findProjectTickets,
  getAllTicketCount,
  getAssignedTicketCount,
  getCreatedTicketCount,
  getMyTicketCount,
  getResolvedTicketCount,
} from '../../common/orm/projects';
import {Swipe} from '../../common/ui/components/swipe';
import {TicketList} from '../../common/ui/components/ticket-list';
import {getSkip, getSortDirection, getSortKey} from '../../common/utils';
import Hero from './hero';
import {columns} from '../../common/constants';
import Link from 'next/link';

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
      .find(c => c.key === getSortKey(sort))
      ?.orderBy?.(getSortDirection(sort)),
  });

  const items = [
    {
      label: 'All',
      count: getAllTicketCount(projectId),
      icon: MdAllInbox,
    },
    {
      label: 'My tickets',
      count: getMyTicketCount(projectId, userId),
      icon: MdAllInbox,
    },
    {
      label: 'Assigned tickets',
      count: getAssignedTicketCount(projectId, userId),
      icon: MdListAlt,
    },
    {
      label: 'Created tickets',
      count: getCreatedTicketCount(projectId, userId),
      icon: MdPending,
    },
    {
      label: 'Resolved tickets',
      count: getResolvedTicketCount(projectId),
      icon: MdCheckCircleOutline,
    },
  ].map(props => (
    <Suspense key={props.label} fallback={<TicketCardSkeleton />}>
      <TicketCard {...props} />
    </Suspense>
  ));

  return (
    <>
      <Hero workspace={workspace} />
      <div className="container my-6 space-y-6 mx-auto">
        <Swipe items={items} />
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl">
            {i18n.get('Latest tickets')}
          </h2>
          <Button variant="success" className="flex items-center" asChild>
            <Link
              href={`${workspaceURI}/ticketing/projects/${projectId}/tickets/edit`}>
              <MdAdd className="size-6" />
              <span>{i18n.get('Create a ticket')}</span>
            </Link>
          </Button>
        </div>
        <TicketList
          tickets={tickets}
          url={`${workspaceURI}/ticketing/projects/${projectId}`}
          searchParams={searchParams}
          footer={
            <TableRow>
              <TableCell colSpan={columns.length + 1} align="right">
                <Link
                  href={`${workspaceURI}/ticketing/projects/${projectId}/tickets`}
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
  icon?: IconType;
};

async function TicketCard(props: TicketCardProps) {
  const {label, icon: Icon, count: countPromise} = props;
  const count = await countPromise;
  return (
    <div className="flex items-center gap-6 px-6 h-[80px]">
      <div className="h-[56px] w-[56px] p-2 bg-muted rounded-full">
        {Icon && (
          <Icon className={`h-[40px] w-[40px] text-success bg-success-light`} />
        )}
      </div>
      <div className="grow flex flex-col justify-between">
        <h3 className="text-[2rem] font-semibold">{count}</h3>
        <p className="font-semibold">{label}</p>
      </div>
    </div>
  );
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

import {
  MdAdd,
  MdAllInbox,
  MdCheckCircleOutline,
  MdListAlt,
  MdPending,
} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {findWorkspace} from '@/orm/workspace';
import {Button} from '@/ui/components';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import {ORDER_BY} from '@/constants';
import {TicketList} from '@/subapps/ticketing/common/ui/components/ticket-list';
import {TicketTypes} from '@/subapps/ticketing/common/ui/components/ticket-types';
import {
  findProjectTickets,
  getAllTicketCount,
  getAssignedTicketCount,
  getCreatedTicketCount,
  getMyTicketCount,
  getResolvedTicketCount,
} from '../../common/orm/projects';
import {getSkip} from '../../common/utils';
import Hero from './hero';

export default async function Page({
  params,
  searchParams,
}: {
  params: {tenant: string; workspace: string; 'project-id': string};
  searchParams: {[key: string]: string | undefined};
}) {
  const projectId = params?.['project-id'];

  const {limit = 7, page = 1} = searchParams;

  const session = await getSession();
  // const userId = session!.user.id;
  const userId = '1';

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  const tickets = await findProjectTickets({
    projectId,
    take: Number(limit),
    skip: getSkip(limit, page),
    orderBy: {
      updatedOn: ORDER_BY.ASC,
    },
  });

  const items = [
    {
      label: 'All',
      count: await getAllTicketCount(projectId),
      icon: MdAllInbox,
    },
    {
      label: 'My tickets',
      count: await getMyTicketCount(projectId, userId),
      icon: MdAllInbox,
    },
    {
      label: 'Assigned tickets',
      count: await getAssignedTicketCount(projectId, userId),
      icon: MdListAlt,
    },
    {
      label: 'Created tickets',
      count: await getCreatedTicketCount(projectId, userId),
      icon: MdPending,
    },
    {
      label: 'Resolved tickets',
      count: await getResolvedTicketCount(projectId),
      icon: MdCheckCircleOutline,
    },
  ].map(({count, label, icon: Icon}) => (
    <div key={label} className="flex items-center gap-6 px-6 h-[80px]">
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
  ));

  return (
    <>
      <Hero workspace={workspace} />
      <div className="container my-6 space-y-6">
        <TicketTypes items={items} />
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl">
            {i18n.get('Latest tickets')}
          </h2>
          <Button variant="success" className="flex items-center">
            <MdAdd className="size-6" />
            <span>{i18n.get('Create a ticket')}</span>
          </Button>
        </div>
        <TicketList tickets={tickets} />
      </div>
    </>
  );
}

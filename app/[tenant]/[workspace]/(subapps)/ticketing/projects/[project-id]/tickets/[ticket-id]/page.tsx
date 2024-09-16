// ---- CORE IMPORTS ---- //
import {AOSProjectTask} from '@/goovee/.generated/models';
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
  Table,
  TableBody,
} from '@/ui/components';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {FaChevronRight} from 'react-icons/fa';

// ---- LOCAL IMPORTS ---- //
import {encodeFilter} from '@/utils/filter';
import {
  findTicketCategories,
  findTicketPriorities,
  findTicketStatuses,
} from '../../../../common/orm/projects';
import {findTicket} from '../../../../common/orm/tickets';
import {TicketDetails} from '../../../../common/ui/components/ticket-details';
import {
  CancelTicket,
  CloseTicket,
} from '../../../../common/ui/components/ticket-form/ticket-actions';
import {TicketRows} from '../../../../common/ui/components/ticket-list/ticket-rows';

interface SubTicketsProps {
  parentTicket?: AOSProjectTask;
  childTickets?: AOSProjectTask[];
}
export default async function Page({
  params,
}: {
  params: {
    tenant: string;
    workspace: string;
    'project-id': string;
    'ticket-id': string;
  };
}) {
  const session = await getSession();
  if (!session?.user) notFound();
  const {workspaceURI, workspaceURL} = workspacePathname(params);
  const projectId = params['project-id'];
  const ticketId = params['ticket-id'];

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  });

  if (!workspace) notFound();

  const [ticket, statuses, categories, priorities] = await Promise.all([
    findTicket(ticketId, projectId),
    findTicketStatuses(projectId),
    findTicketCategories(projectId),
    findTicketPriorities(projectId),
  ]);
  if (!ticket) notFound();
  const ticketsURL = `${workspaceURI}/ticketing/projects/${projectId}/tickets`;
  const status = statuses.filter(s => !s.isCompleted).map(s => s.id);
  const allTicketsURL = `${ticketsURL}?filter=${encodeFilter({status})}`;

  return (
    <div className="container mt-5 mb-20">
      <div className="flex flex-col lg:flex-row gap-4 justify-between min-h-9 items-center">
        <Breadcrumb className="flex-shrink">
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
                  {ticket.project?.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <FaChevronRight className="text-primary" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="cursor-pointer text-md">
                <Link href={allTicketsURL}>{i18n.get('All tickets')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <FaChevronRight className="text-primary" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate text-lg font-semibold">
                <h2 className="font-semibold text-xl">{ticket.name}</h2>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {!ticket.status?.isCompleted && (
          <div className="flex gap-4">
            <CancelTicket id={ticketId} version={ticket.version} />
            <CloseTicket id={ticketId} version={ticket.version} />
          </div>
        )}
      </div>
      <TicketDetails
        ticket={clone(ticket)}
        statuses={clone(statuses)}
        categories={clone(categories)}
        priorities={clone(priorities)}
      />
      {(ticket.parentTask || (ticket.childTasks?.length ?? 0) > 0) && (
        <SubTickets
          parentTicket={ticket.parentTask}
          childTickets={ticket.childTasks}
        />
      )}
    </div>
  );
}

function SubTickets({parentTicket, childTickets}: SubTicketsProps) {
  return (
    <div className="space-y-4 rounded-md border bg-white p-4 mt-5">
      {/* ----parent ticket----- */}
      {parentTicket && (
        <>
          <h4 className="text-[1.5rem] font-semibold">Parent ticket</h4>
          <hr className="mt-5" />
          <Table>
            <TableBody>
              <TicketRows tickets={[clone(parentTicket)]} />
            </TableBody>
          </Table>
        </>
      )}
      {/* ----child tickets---  */}
      {childTickets && (childTickets.length ?? 0) > 0 && (
        <>
          <h4 className="text-[1.5rem] font-semibold">Child ticket</h4>
          <hr className="mt-5" />
          <Table>
            <TableBody>
              <TicketRows tickets={clone(childTickets)} />
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}

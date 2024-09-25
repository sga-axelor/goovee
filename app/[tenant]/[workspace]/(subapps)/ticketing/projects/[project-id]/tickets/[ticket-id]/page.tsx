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
  Table,
  TableBody,
} from '@/ui/components';
import {clone} from '@/utils';
import {encodeFilter} from '@/utils/filter';
import {workspacePathname} from '@/utils/workspace';
import {ID} from '@goovee/orm';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {Suspense} from 'react';
import {FaChevronRight} from 'react-icons/fa';

// ---- LOCAL IMPORTS ---- //
import {
  findContactPartners,
  findTicketCategories,
  findTicketPriorities,
  findTicketStatuses,
} from '../../../../common/orm/projects';
import {
  findTicket,
  findTicketLinkTypes,
  Ticket,
  TicketListTicket,
} from '../../../../common/orm/tickets';
import {TicketDetails} from '../../../../common/ui/components/ticket-details';
import {
  CancelTicket,
  CloseTicket,
  RelatedTicketsHeader,
} from '../../../../common/ui/components/ticket-form/ticket-actions';
import {RelatedTicketRows} from '../../../../common/ui/components/ticket-list/related-ticket-rows';
import {TicketRows} from '../../../../common/ui/components/ticket-list/ticket-rows';

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

  const [ticket, statuses, categories, priorities, contacts] =
    await Promise.all([
      findTicket(ticketId, projectId),
      findTicketStatuses(projectId),
      findTicketCategories(projectId),
      findTicketPriorities(projectId),
      findContactPartners(projectId),
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
        contacts={clone(contacts)}
      />
      <div className="space-y-4 rounded-md border bg-card p-4 mt-5">
        {ticket.parentTask && <ParentTicket ticket={ticket.parentTask} />}
        {ticket.childTasks && Boolean(ticket.childTasks.length) && (
          <ChildTickets tickets={ticket.childTasks} />
        )}
        <Suspense>
          <RelatedTickets
            links={ticket.projectTaskLinkList}
            ticketId={ticket.id}
          />
        </Suspense>
      </div>
    </div>
  );
}

async function ChildTickets({tickets}: {tickets: TicketListTicket[]}) {
  return (
    <>
      <h4 className="text-xl font-semibold">{i18n.get('Child tickets')}</h4>
      <hr className="mt-5" />
      <Table>
        <TableBody>
          <TicketRows tickets={clone(tickets)} />
        </TableBody>
      </Table>
    </>
  );
}

async function ParentTicket({ticket}: {ticket: TicketListTicket}) {
  return (
    <>
      <h4 className="text-xl font-semibold">{i18n.get('Parent ticket')}</h4>
      <hr className="mt-5" />
      <Table>
        <TableBody>
          <TicketRows tickets={[clone(ticket)]} />
        </TableBody>
      </Table>
    </>
  );
}

async function RelatedTickets({
  links,
  ticketId,
}: {
  links?: Ticket['projectTaskLinkList'];
  ticketId: ID;
}) {
  const linkTypes = await findTicketLinkTypes();
  return (
    <>
      <RelatedTicketsHeader linkTypes={clone(linkTypes)} ticketId={ticketId} />
      <hr className="mt-5" />
      <Table>
        <TableBody>
          <RelatedTicketRows links={clone(links ?? [])} ticketId={ticketId} />
        </TableBody>
      </Table>
    </>
  );
}

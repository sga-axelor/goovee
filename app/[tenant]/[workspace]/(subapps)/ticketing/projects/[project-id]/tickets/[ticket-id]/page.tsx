// ---- CORE IMPORTS ---- //
import {SORT_TYPE} from '@/constants';
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {findWorkspace} from '@/orm/workspace';
import {ModelType} from '@/types';
import type {Cloned} from '@/types/util';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Comments,
} from '@/ui/components';
import {clone} from '@/utils';
import {encodeFilter} from '@/utils/filter';
import {workspacePathname} from '@/utils/workspace';
import type {ID} from '@goovee/orm';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {Suspense} from 'react';
import {FaChevronRight} from 'react-icons/fa';

// ---- LOCAL IMPORTS ---- //
import type {
  Category,
  ContactPartner,
  Priority,
} from '../../../../common/orm/projects';
import {
  findContactPartners,
  findTicketCategories,
  findTicketPriorities,
  findTicketStatuses,
} from '../../../../common/orm/projects';
import type {Ticket, TicketListTicket} from '../../../../common/orm/tickets';
import {
  findParentTickets,
  findTicket,
  findTicketLinkTypes,
} from '../../../../common/orm/tickets';
import {EncodedFilter} from '../../../../common/schema';
import {TicketDetails} from '../../../../common/ui/components/ticket-details';
import {
  ChildTicketList,
  ParentTicketList,
  RelatedTicketList,
} from '../../../../common/ui/components/ticket-list';
import {ChildTicketsHeader, RelatedTicketsHeader} from './headers';

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
      findTicket({ticketId, projectId}),
      findTicketStatuses(projectId),
      findTicketCategories(projectId),
      findTicketPriorities(projectId),
      findContactPartners(projectId),
    ]).then(clone);

  if (!ticket) notFound();

  const ticketsURL = `${workspaceURI}/ticketing/projects/${projectId}/tickets`;
  const status = statuses.filter(s => !s.isCompleted).map(s => s.id);
  const allTicketsURL = `${ticketsURL}?filter=${encodeFilter<EncodedFilter>({status})}`;

  return (
    <div className="container mt-5 mb-20">
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
      <TicketDetails
        ticket={ticket}
        categories={categories}
        priorities={priorities}
        contacts={contacts}
      />
      <div className="space-y-4 rounded-md border bg-card p-4 mt-5">
        {ticket.parentTask && <ParentTicket ticket={ticket.parentTask} />}
        <Suspense>
          <ChildTickets
            tickets={ticket.childTasks}
            projectId={ticket.project?.id}
            ticketId={ticket.id}
            categories={categories}
            priorities={priorities}
            contacts={contacts}
            userId={session.user.id}
          />
        </Suspense>
        <Suspense>
          <RelatedTickets
            links={ticket.projectTaskLinkList}
            ticketId={ticket.id}
            projectId={ticket.project?.id}
          />
        </Suspense>
      </div>
      <div className="rounded-md border bg-card p-4 mt-5">
        <h4 className="text-xl font-semibold border-b">
          {i18n.get('Comments')}
        </h4>
        <Comments
          record={ticket}
          modelType={ModelType.ticketing}
          showCommentsByDefault
          showTopBorder={false}
          showReactions={false}
          hideSortBy
          hideCloseComments
          hideCommentsHeader
          inputPosition="top"
          sortByProp={SORT_TYPE.new}
          key={Math.random()}
        />
      </div>
    </div>
  );
}

async function ChildTickets({
  tickets,
  ticketId,
  projectId,
  categories,
  priorities,
  contacts,
  userId,
}: {
  tickets?: Cloned<Ticket>['childTasks'];
  ticketId: ID;
  projectId?: ID;
  categories: Category[];
  priorities: Priority[];
  contacts: ContactPartner[];
  userId: ID;
}) {
  if (!projectId) return;
  const parentIds = await findParentTickets(ticketId);
  return (
    <div>
      <ChildTicketsHeader
        ticketId={ticketId}
        parentIds={parentIds}
        projectId={projectId}
        categories={categories}
        priorities={priorities}
        contacts={contacts}
        userId={userId}
      />
      <hr className="mt-5" />
      <ChildTicketList ticketId={ticketId.toString()} tickets={tickets} />
    </div>
  );
}

async function ParentTicket({ticket}: {ticket: Cloned<TicketListTicket>}) {
  return (
    <div>
      <h4 className="text-xl font-semibold">{i18n.get('Parent ticket')}</h4>
      <hr className="mt-5" />
      <ParentTicketList tickets={[ticket]} />
    </div>
  );
}

async function RelatedTickets({
  links,
  ticketId,
  projectId,
}: {
  links?: Cloned<Ticket>['projectTaskLinkList'];
  ticketId: ID;
  projectId?: ID;
}) {
  if (!projectId) return;
  const linkTypes = await findTicketLinkTypes(projectId);
  return (
    <div>
      <RelatedTicketsHeader
        linkTypes={clone(linkTypes)}
        ticketId={ticketId}
        links={links ?? []}
        projectId={projectId}
      />
      <hr className="mt-5" />
      <RelatedTicketList links={links ?? []} ticketId={ticketId.toString()} />
    </div>
  );
}

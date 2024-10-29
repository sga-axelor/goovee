import Link from 'next/link';
import {notFound} from 'next/navigation';
import {Suspense} from 'react';
import {FaChevronRight} from 'react-icons/fa';

// ---- CORE IMPORTS ---- //
import {type Tenant} from '@/tenant';
import {SORT_TYPE} from '@/constants';
import {i18n} from '@/i18n';
import {getSession} from '@/auth';
import {findWorkspace} from '@/orm/workspace';
import {ModelType} from '@/types';
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
import {encodeFilter} from '@/utils/url';
import {workspacePathname} from '@/utils/workspace';
import type {ID} from '@goovee/orm';

// ---- LOCAL IMPORTS ---- //
import {Skeleton} from '@/ui/components/skeleton';
import {
  findContactPartners,
  findTicketCategories,
  findTicketPriorities,
  findTicketStatuses,
} from '../../../../common/orm/projects';
import {
  findChildTicketIds,
  findChildTickets,
  findParentTicket,
  findParentTicketIds,
  findRelatedTicketLinks,
  findTicket,
  findTicketLinkTypes,
} from '../../../../common/orm/tickets';
import type {
  Category,
  ContactPartner,
  ParentTicket,
  Priority,
} from '../../../../common/types';
import {TicketDetails} from '../../../../common/ui/components/ticket-details';
import {
  ChildTicketList,
  ParentTicketList,
  RelatedTicketList,
} from '../../../../common/ui/components/ticket-list';
import {EncodedFilter} from '../../../../common/utils/validators';
import {
  ChildTicketsHeader,
  ParentTicketsHeader,
  RelatedTicketsHeader,
} from './headers';
import {TicketDetailsProvider} from '../../../../common/ui/components/ticket-details/ticket-details-provider';

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

  const {tenant} = params;

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  });

  if (!workspace) notFound();

  const [ticket, statuses, categories, priorities, contacts] =
    await Promise.all([
      findTicket({ticketId, projectId, tenantId: tenant}),
      findTicketStatuses(projectId, tenant),
      findTicketCategories(projectId, tenant),
      findTicketPriorities(projectId, tenant),
      findContactPartners(projectId, tenant),
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
      <TicketDetailsProvider ticket={ticket}>
        <>
          <TicketDetails
            categories={categories}
            priorities={priorities}
            contacts={contacts}
          />
          <div className="space-y-4 rounded-md border bg-card p-4 mt-5">
            <Suspense fallback={<Skeleton className="h-[160px]" />}>
              <ParentTicket
                ticketId={ticket.id}
                projectId={ticket.project?.id}
                tenantId={tenant}
              />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-[160px]" />}>
              <ChildTickets
                projectId={ticket.project?.id}
                ticketId={ticket.id}
                categories={categories}
                priorities={priorities}
                contacts={contacts}
                userId={session.user.id}
                tenantId={tenant}
              />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-[160px]" />}>
              <RelatedTickets
                ticketId={ticket.id}
                projectId={ticket.project?.id}
                tenantId={tenant}
              />
            </Suspense>
          </div>
        </>
      </TicketDetailsProvider>
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
  ticketId,
  projectId,
  categories,
  priorities,
  contacts,
  userId,
  tenantId,
}: {
  ticketId: ID;
  projectId?: ID;
  categories: Category[];
  priorities: Priority[];
  contacts: ContactPartner[];
  userId: ID;
  tenantId: Tenant['id'];
}) {
  if (!projectId) return;

  const [parentIds, tickets] = await Promise.all([
    findParentTicketIds(ticketId, tenantId),
    findChildTickets(ticketId, tenantId).then(clone),
  ]);
  return (
    <div>
      <ChildTicketsHeader
        ticketId={ticketId}
        parentIds={parentIds}
        childrenIds={tickets?.map(t => t.id) ?? []}
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

async function ParentTicket({
  projectId,
  ticketId,
  tenantId,
}: {
  projectId?: ID;
  ticketId: ID;
  tenantId: Tenant['id'];
}) {
  if (!projectId) return;
  const [childIds, ticket] = await Promise.all([
    findChildTicketIds(ticketId, tenantId),
    findParentTicket(ticketId, tenantId).then(clone),
  ]);
  return (
    <div>
      <ParentTicketsHeader
        ticketId={ticketId}
        projectId={projectId}
        childrenIds={childIds}
        parentId={ticket?.id}
      />
      <hr className="mt-5" />
      <ParentTicketList
        tickets={ticket ? [ticket] : []}
        ticketId={ticketId.toString()}
      />
    </div>
  );
}

async function RelatedTickets({
  ticketId,
  projectId,
  tenantId,
}: {
  ticketId: ID;
  projectId?: ID;
  tenantId: Tenant['id'];
}) {
  if (!projectId) return;
  const [linkTypes, links] = await Promise.all([
    findTicketLinkTypes(projectId, tenantId),
    findRelatedTicketLinks(ticketId, tenantId),
  ]).then(clone);

  return (
    <div>
      <RelatedTicketsHeader
        linkTypes={linkTypes}
        ticketId={ticketId}
        links={links ?? []}
        projectId={projectId}
      />
      <hr className="mt-5" />
      <RelatedTicketList links={links ?? []} ticketId={ticketId.toString()} />
    </div>
  );
}

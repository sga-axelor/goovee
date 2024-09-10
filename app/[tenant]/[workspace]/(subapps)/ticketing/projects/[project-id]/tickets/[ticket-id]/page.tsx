// ---- CORE IMPORTS ---- //
import {AOSProjectTask} from '@/goovee/.generated/models';
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {findWorkspace} from '@/orm/workspace';
import {Maybe} from '@/types/util';
import {
  AvatarImage,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Table,
  TableBody,
  Tag,
} from '@/ui/components';
import {Progress} from '@/ui/components/progress';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {ID} from '@goovee/orm';
import {Avatar} from '@radix-ui/react-avatar';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {FaChevronRight} from 'react-icons/fa';
import {MdOutlineModeEditOutline} from 'react-icons/md';

// ---- LOCAL IMPORTS ---- //
import {ASSIGNMENT} from '../../../../common/constants';
import {findProject, findTicketStatuses} from '../../../../common/orm/projects';
import {findTicket} from '../../../../common/orm/tickets';
import {Stepper} from '../../../../common/ui/components/stepper';
import {TicketRows} from '../../../../common/ui/components/ticket-list/ticket-rows';
import {formatDate} from '../../../../common/utils';
import {encodeFilter} from '@/utils/filter';
import {
  AssignToSupplier,
  CancelTicket,
  CloseTicket,
} from '../../../../common/ui/components/ticket-form/ticket-actions';

interface SubTicketsProps {
  parentTicket?: AOSProjectTask;
  childTickets?: AOSProjectTask[];
  projectId?: string;
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

  const [ticket, statuses, project] = await Promise.all([
    findTicket(ticketId, projectId),
    findTicketStatuses(projectId),
    findProject(projectId, workspace.id, session!.user.id),
  ]);
  if (!ticket) notFound();
  const ticketsURL = `${workspaceURI}/ticketing/projects/${projectId}/tickets`;
  const status = statuses.filter(s => !s.isCompleted).map(s => s.id);
  const allTicketsURL = `${ticketsURL}?filter=${encodeFilter({status})}`;

  return (
    <div className="container mt-5 mb-20">
      <div className="flex gap-4 justify-between min-h-9 items-center">
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
              <FaChevronRight className="text-black" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="cursor-pointer max-w-[8ch] md:max-w-[15ch] truncate text-md">
                <Link href={`${workspaceURI}/ticketing/projects/${projectId}`}>
                  {project!.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <FaChevronRight className="text-black" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="cursor-pointer text-md">
                <Link href={allTicketsURL}>{i18n.get('All tickets')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <FaChevronRight className="text-black" />
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
        ticket={ticket}
        workspaceURI={workspaceURI}
        statuses={statuses}
      />
      {(ticket.parentTask || (ticket.childTasks?.length ?? 0) > 0) && (
        <SubTickets
          parentTicket={ticket.parentTask}
          childTickets={ticket.childTasks}
          projectId={projectId}
        />
      )}
    </div>
  );
}

function TicketDetails({
  ticket,
  workspaceURI,
  statuses,
}: {
  ticket: AOSProjectTask;
  workspaceURI: string;
  statuses: {id: ID; name?: string}[];
}) {
  return (
    <div className="space-y-4 rounded-md border bg-white p-4 mt-5">
      <Stepper
        steps={statuses}
        current={ticket.status?.id}
        className="mb-12 md:mx-20"
      />
      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="text-base font-medium">#{ticket?.id}</p>

          <Link
            href={`${workspaceURI}/ticketing/projects/${ticket.project?.id}/tickets/${ticket.id}/edit`}>
            <MdOutlineModeEditOutline className="size-6" />
          </Link>
        </div>
        <p className="text-xl font-semibold">{ticket?.name}</p>
        <p className="text-sm font-medium">
          {ticket?.projectTaskCategory?.name}
        </p>
        {ticket.priority && (
          <Tag variant="success" className="text-[12px] py-1 me-5">
            {ticket.priority?.name}
          </Tag>
        )}

        <hr />
        <p className="flex !mt-3.5 items-center">
          <span className="font-medium pe-2">{i18n.get('Request by')}: </span>
          <Avatar className="h-8 w-10">
            <AvatarImage
              src="/images/user.png"
              className="h-8 w-10 rounded-full"
            />
          </Avatar>
          <span>
            {ticket.requestedByContact?.name
              ? ticket.requestedByContact?.name
              : ticket.project?.company?.name}
          </span>
        </p>
        <p>
          <span className="font-medium pe-2">{i18n.get('Created on')}:</span>
          {formatDate(ticket.taskDate)}
        </p>
        <hr />

        <div className="flex items-start">
          <div className="flex flex-col space-y-2">
            <p>
              <span className="font-medium pe-2">Assigned to:</span>
              {ticket.assignment === ASSIGNMENT.PROVIDER
                ? ticket.project?.company?.name
                : ticket.assignedToContact?.name}
            </p>
            <p>
              <span className="font-medium pe-2">Expected on:</span>
              {formatDate(ticket.taskEndDate)}
            </p>
          </div>
          {ticket.assignment !== 2 && (
            <div className="ml-auto">
              <AssignToSupplier id={ticket.id!} version={ticket.version!} />
            </div>
          )}
        </div>

        <hr />
        <div className="sm:flex items-center !mt-3.5">
          <p className="font-medium pe-2"> {i18n.get('Progress')}: </p>
          {getProgress(ticket.progress)}%
          <Progress
            value={getProgress(ticket.progress)}
            className="h-3 basis-3/4 sm:ms-5 rounded-none"
          />
        </div>
        <p>
          <span className="font-medium pe-2"> {i18n.get('Version')}:</span>
          {ticket.targetVersion?.title}
        </p>
        <hr />
        <div className="sm:flex sm:justify-start !mt-4 sm:space-x-20 max-[639px]:space-y-5">
          <p>
            <span className="font-medium"> {i18n.get('Quantity')}: </span>
            {ticket.quantity}
          </p>
          <p>
            <span className="font-medium"> {i18n.get('Price WT')}: </span>
            {ticket.unitPrice}$
          </p>
          <p>
            <span className="font-medium">{i18n.get('Invoicing unit')}: </span>
            {ticket.invoicingUnit?.name}
          </p>
        </div>
        {/* --ticket--description--- */}
        <div className="!mt-10">
          <Description description={ticket.description} />
        </div>
      </div>
    </div>
  );
}

function Description({description}: {description: Maybe<string>}) {
  if (!description) return null;
  //TODO: sanitize with DOMPurify
  const html = description;
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}

function SubTickets({parentTicket, childTickets, projectId}: SubTicketsProps) {
  return (
    <div className="space-y-4 rounded-md border bg-white p-4 mt-5">
      {/* ----parent ticket----- */}
      {parentTicket && (
        <>
          <h4 className="text-[1.5rem] font-semibold">Parent ticket</h4>
          <hr className="mt-5" />
          <Table>
            <TableBody>
              <TicketRows
                tickets={[clone(parentTicket)]}
                projectId={projectId}
              />
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
              <TicketRows tickets={clone(childTickets)} projectId={projectId} />
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}

function getProgress(p: Maybe<string>): number {
  if (p) {
    const progress = Number(p);
    if (!isNaN(progress)) {
      return progress;
    }
  }
  return 0;
}

// ---- CORE IMPORTS ---- //
import {AOSProjectTask} from '@/goovee/.generated/models';
import {i18n} from '@/lib/i18n';
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
  TableCell,
  TableRow,
  Tag,
} from '@/ui/components';
import {Progress} from '@/ui/components/progress';
import {workspacePathname} from '@/utils/workspace';
import {ID} from '@goovee/orm';
import {Avatar} from '@radix-ui/react-avatar';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {FaChevronRight} from 'react-icons/fa';
import {MdOutlineModeEditOutline} from 'react-icons/md';

// ---- LOCAL IMPORTS ---- //
import {findProject, findTicketStatuses} from '../../../../common/orm/projects';
import {findTicket} from '../../../../common/orm/tickets';
import {Stepper} from '../../../../common/ui/components/stepper';
import {formatDate} from '../../../../common/utils';

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
  const {workspaceURI} = workspacePathname(params);
  const projectId = params['project-id'];
  const ticketId = params['ticket-id'];

  const [ticket, statuses, project] = await Promise.all([
    findTicket(ticketId, projectId),
    findTicketStatuses(projectId),
    findProject(projectId),
  ]);
  if (!ticket) notFound();
  return (
    <div className="container mt-5 mb-20">
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
              <Link
                href={`${workspaceURI}/ticketing/projects/${projectId}/tickets`}>
                {i18n.get('All tickets')}
              </Link>
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
      <TicketDetails
        ticket={ticket}
        workspaceURI={workspaceURI}
        statuses={statuses}
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

        {ticket.status && (
          <Tag variant="yellow" className="text-[12px] py-1">
            {ticket.status?.name}
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
          <span>{ticket.contact?.name}</span>
        </p>
        <p>
          <span className="font-medium pe-2">{i18n.get('Created on')}:</span>
          {formatDate(ticket.taskDate)}
        </p>
        <hr />

        <div className="flex flex-col space-y-2 !mt-3.5">
          <p>
            <span className="font-medium pe-2">{i18n.get('Assigned to')}:</span>
            {ticket.assignedTo?.name}
          </p>
          <p>
            <span className="font-medium pe-2">{i18n.get('Expected on')}:</span>
            {formatDate(ticket.taskEndDate)}
          </p>
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
          {ticket?.version}
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
              <TableRow>
                <TableCell className="px-5">
                  <Link href="">#{parentTicket.id}</Link>
                </TableCell>
                <TableCell className="flex justify-center items-center">
                  <Avatar className="h-12 w-16">
                    <AvatarImage src="/images/user.png" />
                  </Avatar>
                  <p className="ms-1">{parentTicket.contact?.name}</p>
                </TableCell>
                <TableCell>{parentTicket.name}</TableCell>
                <TableCell>
                  {parentTicket.priority && (
                    <Tag variant="blue" className="text-[12px] py-1 w-max">
                      {parentTicket.priority?.name}
                    </Tag>
                  )}
                </TableCell>
                <TableCell>
                  {parentTicket.status && (
                    <Tag
                      variant="default"
                      className="text-[12px] py-1 w-max"
                      outline>
                      {parentTicket.status?.name}
                    </Tag>
                  )}
                </TableCell>
                <TableCell>{parentTicket.projectTaskCategory?.name}</TableCell>
                <TableCell>{parentTicket.assignedTo?.name}</TableCell>
                <TableCell>{formatDate(parentTicket.updatedOn)}</TableCell>
              </TableRow>
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
              {childTickets.map(ticket => {
                return (
                  <TableRow key={ticket?.id}>
                    <TableCell className="px-5">
                      <Link href="">#{ticket.id}</Link>
                    </TableCell>
                    <TableCell className="flex justify-center items-center">
                      <Avatar className="h-12 w-16">
                        <AvatarImage src="/images/user.png" />
                      </Avatar>
                      <p className="ms-1">{ticket.contact?.name}</p>
                    </TableCell>
                    <TableCell>{ticket.name}</TableCell>
                    <TableCell>
                      {ticket.priority && (
                        <Tag variant="blue" className="text-[12px] py-1 w-max">
                          {ticket.priority?.name}
                        </Tag>
                      )}
                    </TableCell>
                    <TableCell>
                      {ticket.status && (
                        <Tag
                          variant="default"
                          className="text-[12px] py-1 w-max"
                          outline>
                          {ticket.status?.name}
                        </Tag>
                      )}
                    </TableCell>
                    <TableCell>{ticket.projectTaskCategory?.name}</TableCell>
                    <TableCell>{ticket.assignedTo?.name}</TableCell>
                    <TableCell>{formatDate(ticket?.updatedOn)}</TableCell>
                  </TableRow>
                );
              })}
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

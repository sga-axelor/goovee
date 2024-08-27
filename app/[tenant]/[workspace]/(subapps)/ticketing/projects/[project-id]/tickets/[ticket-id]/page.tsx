// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {
  findTicketById,
  findTicketStatuses,
} from '../../../../common/orm/projects';

import {AvatarImage, Button, Tag, TableCell, TableRow} from '@/ui/components';
import {Avatar} from '@radix-ui/react-avatar';
import {MdOutlineModeEditOutline} from 'react-icons/md';
import Link from 'next/link';
import {formatDate} from '../../../../common/utils';
import {Progress} from '@/ui/components/progress';
import {i18n} from '@/lib/i18n';
import {AOSProjectTask, AOSProjectTaskStatus} from '@/goovee/.generated/models';
import {notFound} from 'next/navigation';
import {Maybe} from '@/types/util';

interface User {
  id: number;
  name: string;
  avatarUrl: string;
}

interface Priority {
  name: string;
}

interface Status {
  name: string;
}
interface Assigned {
  name: string;
}
interface Ticket {
  id: number;
  user: User;
  name: string;
  priority: Priority;
  status: Status;
  category: string;
  assignedTo: Assigned;
  updatedOn: Date;
}

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

  const [ticket, statuses] = await Promise.all([
    findTicketById(ticketId),
    findTicketStatuses(),
  ]);
  if (!ticket) notFound();
  return (
    <div className="container mt-5">
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
  statuses: AOSProjectTaskStatus[];
}) {
  return (
    <div className="space-y-4 rounded-md border bg-white p-4 mt-5">
      <div className="flex items-center gap-2 w-full">
        {statuses.map((s, i) => {
          const isCompleted =
            statuses.findIndex(s => s.name === ticket.status?.name) >= i;

          const dotColor = isCompleted ? 'green' : 'lightgray';
          let lineColor = 'lightgray';

          if (i < statuses.length - 1) {
            const nextIsCompleted =
              statuses.findIndex(s => s.name === ticket.status?.name) >= i + 1;
            lineColor = isCompleted && nextIsCompleted ? 'green' : 'lightgray';
          }

          return (
            <div className="flex flex-col w-full" key={i}>
              <div className="flex items-center w-full">
                <div
                  className="p-1.5 rounded-full"
                  style={{backgroundColor: dotColor}}></div>
                {i < statuses?.length - 1 && (
                  <div
                    className="h-[1px] flex-grow ms-2"
                    style={{backgroundColor: lineColor}}></div>
                )}
              </div>
              <p className="mt-1 text-sm">{s.name}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-20 space-y-2">
        <div className="flex justify-between">
          <p className="text-base font-medium">#{ticket?.id}</p>

          <Link
            href={`${workspaceURI}/ticketing/projects/${ticket?.project?.id}/tickets/edit`}>
            <MdOutlineModeEditOutline className="size-6" />
          </Link>
        </div>
        <p className="text-xl font-semibold">{ticket?.name}</p>
        <p className="text-sm font-medium">{ticket?.projectTaskCategory}</p>
        <Tag variant="success" className="text-[12px] py-1 me-5">
          {ticket.priority?.name}
        </Tag>
        <Tag variant="yellow" className="text-[12px] py-1">
          {ticket.status?.name}
        </Tag>
        <hr />
        <p className="flex !mt-3.5 items-center">
          <span className="font-medium pe-2">{i18n.get('Request by')}: </span>
          <Avatar className="h-8 w-10">
            <AvatarImage
              src="/images/user.png"
              className="h-8 w-10 rounded-full"
            />
          </Avatar>
          <span>Orville Bartoletti</span>
        </p>
        <p>
          <span className="font-medium pe-2">{i18n.get('Created on')}:</span>
          {formatDate(ticket.taskDate)}
        </p>
        <hr />
        <div className="flex items-start">
          <div className="flex flex-col space-y-2">
            <p>
              <span className="font-medium pe-2">
                {i18n.get('Assigned to')}:
              </span>
              {ticket.assignedTo?.name}
            </p>
            <p>
              <span className="font-medium pe-2">
                {i18n.get('Expected on')}:
              </span>
              {formatDate(ticket.taskEndDate)}
            </p>
          </div>
          <div className="ml-auto">
            <Button variant="success">Assign to supplier</Button>
          </div>
        </div>
        <hr />
        <div className="flex items-center !mt-4">
          <p className="font-medium pe-2"> {i18n.get('Progress')}: </p>
          {getProgress(ticket.progress)}%
          <Progress
            value={getProgress(ticket.progress)}
            className="h-3 basis-3/4 ms-5 rounded"
          />
        </div>
        <p>
          <span className="font-medium pe-2"> {i18n.get('Version')}:</span>
          {ticket?.version}
        </p>
        <hr />
        <div className="flex justify-start space-x-20 !mt-4">
          <p>
            <span className="font-medium"> {i18n.get('Quantity')}: </span>3
          </p>
          <p>
            <span className="font-medium"> {i18n.get('Price WT')}: </span>10.00$
          </p>
          <p>
            <span className="font-medium">{i18n.get('Invoicing unit')}:</span>
            dollar($)
          </p>
        </div>
        {/* --ticket--description--- */}
        <div>
          <p dangerouslySetInnerHTML={{__html: ticket.description ?? ''}}></p>
        </div>
      </div>
    </div>
  );
}

function SubTickets({parentTicket, childTickets}: SubTicketsProps) {
  return (
    <div className="space-y-4 rounded-md border bg-white p-4 mt-5">
      {/* ----parent ticket----- */}
      {parentTicket && (
        <div>
          <h4 className="text-[1.5rem] font-semibold">Parent ticket</h4>
          <hr className="mt-5" />
          <TableRow>
            <TableCell className="px-5">
              <Link href="">#{parentTicket.id}</Link>
            </TableCell>
            <TableCell className="flex justify-center items-center">
              <Avatar className="h-12 w-16">
                <AvatarImage src="/images/user.png" />
              </Avatar>
              <p className="ms-1">{parentTicket.user?.name}</p>
            </TableCell>
            <TableCell>{parentTicket.name}</TableCell>
            <TableCell>
              <Tag variant="blue" className="text-[12px] py-1">
                {parentTicket.priority?.name}
              </Tag>
            </TableCell>
            <TableCell>
              <Tag variant="default" className="text-[12px] py-1" outline>
                {parentTicket.status?.name}
              </Tag>
            </TableCell>
            <TableCell>{parentTicket.projectTaskCategory?.name}</TableCell>
            <TableCell>{parentTicket.assignedTo?.name}</TableCell>
            <TableCell>{formatDate(parentTicket.updatedOn)}</TableCell>
          </TableRow>
        </div>
      )}
      {/* ----child tickets---  */}
      {childTickets && (childTickets.length ?? 0) > 0 && (
        <div>
          <h4 className="text-[1.5rem] font-semibold">Child ticket</h4>
          <hr className="mt-5" />
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
                  <p className="ms-1">{ticket.user}</p>
                </TableCell>
                <TableCell>{ticket.name}</TableCell>
                <TableCell>
                  <Tag variant="blue" className="text-[12px] py-1">
                    {ticket.priority?.name}
                  </Tag>
                </TableCell>
                <TableCell>
                  <Tag variant="default" className="text-[12px] py-1" outline>
                    {ticket.status?.name}
                  </Tag>
                </TableCell>
                <TableCell>{ticket.projectTaskCategory?.name}</TableCell>
                <TableCell>{ticket.assignedTo?.name}</TableCell>
                <TableCell>{formatDate(ticket?.updatedOn)}</TableCell>
              </TableRow>
            );
          })}
        </div>
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

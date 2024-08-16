'use client';

import {
  AvatarImage,
  StyledTable,
  Table,
  TableCell,
  TableRow,
  Tag,
} from '@/ui/components';

import {Avatar} from '@radix-ui/react-avatar';

type Tickets = {
  ticketId: string;
  requestedBy: string;
  subject: string;
  priority: string;
  status: string;
  category: string;
  assignedTo: string;
  updatedOn: string;
};

type Variant =
  | 'success'
  | 'blue'
  | 'yellow'
  | 'purple'
  | 'destructive'
  | 'default';

const columns = [
  {
    field: 'ticketId',
    label: 'Ticket ID',
  },
  {
    field: 'requestedBy',
    label: 'Requested by',
  },
  {
    field: 'subject',
    label: 'Subject',
  },
  {
    field: 'priority',
    label: 'Priority',
  },
  {
    field: 'status',
    label: 'Status',
  },
  {
    field: 'category',
    label: 'Category',
  },
  {
    field: 'assignedTo',
    label: 'Assigned to',
  },
  {
    field: 'updatedOn',
    label: 'Updated',
  },
];

const priorityMap: {[key: string]: Variant} = {
  Low: 'success',
  Medium: 'blue',
  High: 'yellow',
};

const statusMap: {[key: string]: Variant} = {
  New: 'blue',
  'In Progress': 'yellow',
  Resolved: 'success',
  Closed: 'destructive',
};

const getVariantName = (name: string) => {
  return priorityMap[name] || 'default';
};

const getStatusName = (name: string) => {
  return statusMap[name] || 'default';
};

export function TicketList({tickets}: {tickets: Tickets[]}) {
  return (
    <StyledTable columns={columns}>
      {tickets?.map((ticket: any, i: number) => {
        const priority = getVariantName(ticket?.priority);
        const status = getStatusName(ticket?.status);
        return (
          <TableRow key={i}>
            <TableCell className="px-5">{ticket?.ticketId}</TableCell>
            <TableCell className="flex justify-center items-center">
              <Avatar className="h-12 w-16">
                <AvatarImage src="/images/user.png" />
              </Avatar>
              <p className="ms-1"> {ticket?.requestedBy}</p>
            </TableCell>
            <TableCell>{ticket?.subject}</TableCell>
            <TableCell>
              <Tag variant={priority!} className="text-[12px]">
                {ticket?.priority}
              </Tag>
            </TableCell>
            <TableCell>
              <Tag variant={status!} className="text-[12px]" outline>
                {ticket?.status}
              </Tag>
            </TableCell>
            <TableCell>{ticket?.category}</TableCell>
            <TableCell>{ticket?.assignedTo}</TableCell>
            <Table>{ticket?.updatedOn}</Table>
          </TableRow>
        );
      })}
    </StyledTable>
  );
}

export default TicketList;

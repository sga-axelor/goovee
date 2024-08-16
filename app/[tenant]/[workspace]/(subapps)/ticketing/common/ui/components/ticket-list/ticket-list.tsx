import {Maybe} from '@/types/util';
import {
  AvatarImage,
  StyledTable,
  Table,
  TableCell,
  TableRow,
  Tag,
} from '@/ui/components';

import {Avatar} from '@radix-ui/react-avatar';
import {formatDate} from '../../../utils';

type Ticket = {
  id: string;
  version: number;
  name?: string;
  ticketNumber?: string;
  updatedOn?: Date;
  priority?: {
    id: string;
    name: string;
    version: number;
  };
  status?: {
    id: string;
    name: string;
    version: number;
  };
  projectTaskCategory?: {
    id: string;
    name: string;
    version: number;
  };
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

const getVariantName = (name: Maybe<string>) => {
  if (!name) return 'default';
  return priorityMap[name] || 'default';
};

const getStatusName = (name: Maybe<string>) => {
  if (!name) return 'default';
  return statusMap[name] || 'default';
};

export function TicketList({tickets}: {tickets: Ticket[]}) {
  return (
    <StyledTable columns={columns}>
      {tickets.map(ticket => {
        const priority = getVariantName(ticket.priority?.name);
        const status = getStatusName(ticket.status?.name);
        return (
          <TableRow key={ticket.id}>
            <TableCell className="px-5">{ticket.ticketNumber}</TableCell>
            <TableCell className="flex justify-center items-center">
              <Avatar className="h-12 w-16">
                <AvatarImage src="/images/user.png" />
              </Avatar>
              <p className="ms-1"> {ticket.requestedBy}</p>
            </TableCell>
            <TableCell>{ticket.name}</TableCell>
            <TableCell>
              <Tag variant={priority} className="text-[12px]">
                {ticket.priority?.name}
              </Tag>
            </TableCell>
            <TableCell>
              <Tag variant={status!} className="text-[12px]" outline>
                {ticket.status?.name}
              </Tag>
            </TableCell>
            <TableCell>{ticket.projectTaskCategory?.name}</TableCell>
            <TableCell>{ticket.assignedTo}</TableCell>
            <Table>{formatDate(ticket.updatedOn)}</Table>
          </TableRow>
        );
      })}
    </StyledTable>
  );
}

export default TicketList;

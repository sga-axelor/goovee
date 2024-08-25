// ---- CORE IMPORTS ---- //
import {Avatar, AvatarImage, TableCell, TableRow, Tag} from '@/ui/components';
import {i18n} from '@/lib/i18n';
import {Maybe} from '@/types/util';

// ---- LOCAL IMPORTS ---- //
import {Ticket} from '../../../types';
import {columns} from '../../../constants';
import {formatDate} from '../../../utils';

type Variant =
  | 'success'
  | 'blue'
  | 'yellow'
  | 'purple'
  | 'destructive'
  | 'default';

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

export function TicketRows(props: {tickets: Ticket[]}) {
  const {tickets} = props;
  if (!tickets.length) {
    return (
      <TableRow>
        <TableCell colSpan={columns.length + 1} align="center">
          {i18n.get('No records found')}
        </TableCell>
      </TableRow>
    );
  }
  return tickets.map(ticket => {
    const priority = getVariantName(ticket.priority?.name);
    const status = getStatusName(ticket.status?.name);
    return (
      <TableRow key={ticket.id}>
        <TableCell className="px-5">#{ticket.id}</TableCell>
        <TableCell className="flex justify-center items-center">
          <Avatar className="h-12 w-16">
            <AvatarImage src="/images/user.png" />
          </Avatar>
          <p className="ms-1"> {ticket.contact?.name}</p>
        </TableCell>
        <TableCell>{ticket.name}</TableCell>
        <TableCell>
          <Tag variant={priority} className="text-[12px] py-1">
            {ticket.priority?.name}
          </Tag>
        </TableCell>
        <TableCell>
          <Tag variant={status!} className="text-[12px] py-1" outline>
            {ticket.status?.name}
          </Tag>
        </TableCell>
        <TableCell>{ticket.projectTaskCategory?.name}</TableCell>
        <TableCell>{ticket.assignedTo?.name}</TableCell>
        <TableCell>{formatDate(ticket.updatedOn)}</TableCell>
      </TableRow>
    );
  });
}

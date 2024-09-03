// ---- CORE IMPORTS ---- //
import {
  Avatar,
  AvatarImage,
  Collapsible,
  CollapsibleContent,
  TableCell,
  TableRow,
  Tag,
} from '@/ui/components';
import {i18n} from '@/lib/i18n';
import {Maybe} from '@/types/util';
import {useState} from 'react';
import {MdArrowDropDown, MdArrowDropUp} from 'react-icons/md';
import Link from 'next/link';

// ---- LOCAL IMPORTS ---- //
import {Ticket} from '../../../types';
import {columns} from '../../../constants';
import {formatDate} from '../../../utils';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {useResponsive} from '@/ui/hooks';

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
interface TicketDetailRowProps {
  label: string;
  value: React.ReactNode;
}

const TicketDetailRow: React.FC<TicketDetailRowProps> = ({label, value}) => (
  <>
    <p className="text-base font-semibold mb-0">{i18n.get(label)}</p>
    <p className="justify-self-end">{value}</p>
  </>
);

export function TicketRows(props: {tickets: Ticket[]; projectId: any}) {
  const {workspaceURL} = useWorkspace();
  const {tickets, projectId} = props;
  const [show, setShow] = useState(false);
  const [id, setId] = useState('');
  const res = useResponsive();
  const small = (['xs', 'sm'] as const).some(x => res[x]);

  const handleCollapse = (Id: string) => {
    setId(Id);
    setShow(!show);
    if (Id !== id) {
      setShow(true);
    }
  };

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
    const priorityVariant = getVariantName(ticket.priority?.name);
    const statusVariant = getStatusName(ticket.status?.name);

    const priority = ticket.priority && (
      <Tag variant={priorityVariant} className="text-[12px] py-1 w-max">
        {ticket.priority.name}
      </Tag>
    );

    const status = ticket.status && (
      <Tag variant={statusVariant!} className="text-[12px] py-1 w-max" outline>
        {ticket.status.name}
      </Tag>
    );

    return (
      <>
        <TableRow key={ticket.id}>
          <TableCell className="px-5">
            <Link
              href={`${workspaceURL}/ticketing/projects/${projectId}/tickets/${ticket?.id}`}
              className="font-medium">
              #{ticket.id}
            </Link>
          </TableCell>
          <TableCell className="flex md:justify-center items-center justify-end">
            <Avatar className="h-12 w-16">
              <AvatarImage src="/images/user.png" />
            </Avatar>
            <p className="ms-1"> {ticket.contact?.name}</p>
            {small &&
              (show && ticket?.id === id ? (
                <MdArrowDropUp
                  onClick={() => handleCollapse(ticket.id)}
                  className="cursor-pointer ms-1"
                />
              ) : (
                <MdArrowDropDown
                  onClick={() => handleCollapse(ticket.id)}
                  className="cursor-pointer ms-1"
                />
              ))}
          </TableCell>
          {!small && (
            <>
              <TableCell>{ticket.name}</TableCell>
              <TableCell>{priority}</TableCell>
              <TableCell>{status}</TableCell>
              <TableCell>{ticket.projectTaskCategory?.name}</TableCell>
              <TableCell>{ticket.assignedTo?.name}</TableCell>
              <TableCell>{formatDate(ticket.updatedOn)}</TableCell>
            </>
          )}
        </TableRow>
        {small && ticket.id === id && show && (
          <TableRow>
            <TableCell colSpan={2}>
              <Collapsible open={show}>
                <CollapsibleContent className="grid grid-cols-2 gap-y-2">
                  <TicketDetailRow label="Subject" value={ticket.name} />
                  <TicketDetailRow label="Priority" value={priority} />
                  <TicketDetailRow label="Status" value={status} />
                  <TicketDetailRow
                    label="Category"
                    value={ticket.projectTaskCategory?.name}
                  />
                  <TicketDetailRow
                    label="Assigned to"
                    value={ticket.assignedTo?.name}
                  />
                  <TicketDetailRow
                    label="Updated On"
                    value={formatDate(ticket.updatedOn)}
                  />
                </CollapsibleContent>
              </Collapsible>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  });
}

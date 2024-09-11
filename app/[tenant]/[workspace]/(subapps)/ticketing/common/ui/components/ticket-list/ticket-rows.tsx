'use client';
// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/lib/i18n';
import {
  Avatar,
  AvatarImage,
  Collapsible,
  CollapsibleContent,
  TableCell,
  TableRow,
} from '@/ui/components';
import {useResponsive} from '@/ui/hooks';
import Link from 'next/link';
import {useState} from 'react';
import {MdArrowDropDown, MdArrowDropUp} from 'react-icons/md';

// ---- LOCAL IMPORTS ---- //
import {ASSIGNMENT, columns} from '../../../constants';
import {Ticket} from '../../../types';
import {formatDate} from '../../../utils';
import {Category, Priority, Status} from '../pills';
import {useRouter} from 'next/navigation';

interface TicketDetailRowProps {
  label: string;
  children: React.ReactNode;
}

const Item: React.FC<TicketDetailRowProps> = ({label, children}) => (
  <>
    <p className="text-base font-semibold mb-0">{i18n.get(label)}</p>
    <p className="flex justify-self-end items-center">{children}</p>
  </>
);

export function TicketRows(props: {tickets: Ticket[]; projectId: any}) {
  const {workspaceURL} = useWorkspace();
  const {tickets, projectId} = props;
  const [show, setShow] = useState(false);
  const [id, setId] = useState('');
  const res = useResponsive();
  const router = useRouter();
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
    const handleClick = () => {
      router.push(
        `${workspaceURL}/ticketing/projects/${projectId}/tickets/${ticket?.id}`,
      );
    };

    return (
      <>
        <TableRow
          key={ticket.id}
          onClick={handleClick}
          className="cursor-pointer">
          <TableCell className="px-5">
            <p className="font-medium">#{ticket.id}</p>
          </TableCell>
          {!small ? (
            <TableCell className="flex md:justify-center items-center justify-end">
              <Avatar className="h-12 w-16">
                <AvatarImage src="/images/user.png" />
              </Avatar>
              <p className="ms-1">
                {ticket.requestedByContact?.name
                  ? ticket.requestedByContact?.name
                  : ticket.project?.company?.name}
              </p>

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
          ) : (
            <TableCell className="truncate max-w-40 line-clamp-1 table-cell">
              {ticket.name}

              {small &&
                (show && ticket?.id === id ? (
                  <MdArrowDropUp
                    onClick={() => handleCollapse(ticket.id)}
                    className="cursor-pointer ms-1 inline"
                  />
                ) : (
                  <MdArrowDropDown
                    onClick={() => handleCollapse(ticket.id)}
                    className="cursor-pointer ms-1 inline"
                  />
                ))}
            </TableCell>
          )}

          {!small && (
            <>
              <TableCell className="truncate max-w-40 line-clamp-1 table-cell">
                {ticket.name}
              </TableCell>
              <TableCell>
                <Priority name={ticket.priority?.name} />
              </TableCell>
              <TableCell>
                <Status name={ticket.status?.name} />
              </TableCell>
              <TableCell>
                <Category name={ticket.projectTaskCategory?.name} />
              </TableCell>
              <TableCell>
                {ticket.assignment === ASSIGNMENT.CUSTOMER
                  ? ticket.assignedToContact?.name
                  : ticket?.project?.company?.name}
              </TableCell>
              <TableCell>{formatDate(ticket.updatedOn)}</TableCell>
            </>
          )}
        </TableRow>
        {small && ticket.id === id && show && (
          <TableRow>
            <TableCell colSpan={2}>
              <Collapsible open={show}>
                <CollapsibleContent className="grid grid-cols-2 gap-y-2">
                  <Item label="Requested by">
                    {ticket.requestedByContact?.name ? (
                      <>
                        <Avatar className="h-12 w-16">
                          <AvatarImage src="/images/user.png" />
                        </Avatar>
                        {ticket.requestedByContact?.name}
                      </>
                    ) : (
                      ticket.project?.company?.name
                    )}
                  </Item>

                  <Item label="Priority">
                    <Priority name={ticket.priority?.name} />
                  </Item>
                  <Item label="Status">
                    <Priority name={ticket.status?.name} />
                  </Item>
                  <Item label="Status">
                    <Category name={ticket.status?.name} />
                  </Item>
                  <Item label="Assigned to">
                    {ticket.assignment === ASSIGNMENT.CUSTOMER
                      ? ticket.assignedToContact?.name
                      : ticket.project?.company?.name}
                  </Item>
                  <Item label="Updated On">{formatDate(ticket.updatedOn)}</Item>
                </CollapsibleContent>
              </Collapsible>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  });
}

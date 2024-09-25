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
import {useRouter} from 'next/navigation';
import {Fragment, useState} from 'react';
import {MdArrowDropDown, MdArrowDropUp} from 'react-icons/md';
import {Cloned} from '@/types/util';

// ---- LOCAL IMPORTS ---- //
import {ASSIGNMENT, columns} from '../../../constants';
import type {TicketListTicket} from '../../../orm/tickets';
import {formatDate, getProfilePic} from '../../../utils';
import {Category, Priority, Status} from '../pills';

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

export function TicketRows(props: {tickets: Cloned<TicketListTicket>[]}) {
  const {workspaceURI} = useWorkspace();
  const {tickets} = props;
  const [show, setShow] = useState(false);
  const [id, setId] = useState('');
  const res = useResponsive();
  const router = useRouter();
  const small = (['xs', 'sm', 'md'] as const).some(x => res[x]);

  const handleCollapse = (Id: string, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
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
      ticket.project?.id &&
        router.push(
          `${workspaceURI}/ticketing/projects/${ticket.project.id}/tickets/${ticket.id}`,
        );
    };

    return (
      <Fragment key={ticket.id}>
        <TableRow
          onClick={handleClick}
          className="cursor-pointer [&:not(:has(.action:hover)):hover]:bg-slate-100">
          <TableCell className="px-5">
            <p className="font-medium">#{ticket.id}</p>
          </TableCell>
          {!small ? (
            <>
              <TableCell className="flex md:justify-start items-center justify-end">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    className="object-cover"
                    src={getProfilePic(
                      ticket.requestedByContact?.id
                        ? ticket.requestedByContact.picture?.id
                        : ticket.project?.company?.logo?.id,
                    )}
                  />
                </Avatar>
                <p className="ms-2">
                  {ticket.requestedByContact?.id
                    ? ticket.requestedByContact.name
                    : ticket.project?.company?.name}
                </p>
              </TableCell>

              <TableCell className="max-w-40 ">
                <div className="line-clamp-2">{ticket.name}</div>
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
          ) : (
            <TableCell
              className="flex items-center cursor-pointer gap-1 action"
              onClick={e => handleCollapse(ticket.id, e)}>
              <p className="max-w-48 line-clamp-2">{ticket.name}</p>
              {show && ticket?.id === id ? (
                <MdArrowDropUp className="ms-auto inline" />
              ) : (
                <MdArrowDropDown className="ms-auto inline" />
              )}
            </TableCell>
          )}
        </TableRow>
        {small && (
          <Collapsible open={ticket.id === id && show} asChild>
            <TableRow>
              <CollapsibleContent asChild>
                <TableCell colSpan={2}>
                  <div className="grid grid-cols-2 gap-y-2">
                    <Item label="Requested by">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          className="object-cover"
                          src={getProfilePic(
                            ticket.requestedByContact?.id
                              ? ticket.requestedByContact.picture?.id
                              : ticket.project?.company?.logo?.id,
                          )}
                        />
                      </Avatar>
                      <span className="ms-2">
                        {ticket.requestedByContact?.id
                          ? ticket.requestedByContact?.name
                          : ticket.project?.company?.name}
                      </span>
                    </Item>

                    <Item label="Priority">
                      <Priority name={ticket.priority?.name} />
                    </Item>
                    <Item label="Status">
                      <Status name={ticket.status?.name} />
                    </Item>
                    <Item label="Assigned to">
                      {ticket.assignment === ASSIGNMENT.CUSTOMER
                        ? ticket.assignedToContact?.name
                        : ticket.project?.company?.name}
                    </Item>
                    <Item label="Updated On">
                      {formatDate(ticket.updatedOn)}
                    </Item>
                  </div>
                </TableCell>
              </CollapsibleContent>
            </TableRow>
          </Collapsible>
        )}
      </Fragment>
    );
  });
}

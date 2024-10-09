'use client';
// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/lib/i18n';
import type {Cloned} from '@/types/util';
import {
  Avatar,
  AvatarImage,
  Collapsible,
  CollapsibleContent,
  TableCell,
  TableRow,
} from '@/ui/components';
import {useResponsive, useToast} from '@/ui/hooks';
import {ID} from '@goovee/orm';
import {useRouter} from 'next/navigation';
import {Fragment, useState} from 'react';
import {MdArrowDropDown, MdArrowDropUp} from 'react-icons/md';

// ---- LOCAL IMPORTS ---- //
import {deleteRelatedLink} from '../../../actions';
import {ASSIGNMENT, columns} from '../../../constants';
import type {Ticket} from '../../../orm/tickets';
import {formatDate, getProfilePic} from '../../../utils';
import {Button} from '../delete-button';
import {Category, Priority, Status} from '../pills';

interface TicketDetailRowProps {
  label: string;
  children: React.ReactNode;
}

const Item: React.FC<TicketDetailRowProps> = ({label, children}) => (
  <>
    <p className="text-xs font-semibold mb-0">{i18n.get(label)}</p>
    <p className="flex justify-self-end items-center">{children}</p>
  </>
);

type RelatedTicketRowProps = {
  ticketId: ID;
  links: Cloned<NonNullable<Ticket['projectTaskLinkList']>>;
};

export function RelatedTicketRows(props: RelatedTicketRowProps) {
  const {links, ticketId} = props;
  const {workspaceURI} = useWorkspace();
  const [openId, setOpenId] = useState<string | null>(null);
  const res = useResponsive();
  const router = useRouter();
  const small = (['xs', 'sm', 'md'] as const).some(x => res[x]);

  if (!links.length) {
    return (
      <TableRow>
        <TableCell colSpan={columns.length + 1} align="center">
          {i18n.get('No records found')}
        </TableCell>
      </TableRow>
    );
  }

  return links.map(link => {
    const ticket = link.relatedTask;
    if (!ticket) return;

    const handleClick = () => {
      ticket.project?.id &&
        router.push(
          `${workspaceURI}/ticketing/projects/${ticket.project.id}/tickets/${ticket.id}`,
        );
    };

    const handleCollapse = (e: React.MouseEvent<HTMLTableCellElement>) => {
      e.stopPropagation();
      setOpenId(id => (id === ticket.id ? null : ticket.id));
    };

    return (
      <Fragment key={link.id}>
        <TableRow
          onClick={handleClick}
          className="[&:not(:has(.action:hover))]:cursor-pointer  [&:not(:has(.action:hover)):hover]:bg-slate-100 text-xs">
          <TableCell className="p-3">
            {small ? (
              <p className="font-medium">#{ticket.id}</p>
            ) : (
              <p className="font-medium">{link.projectTaskLinkType?.name}</p>
            )}
          </TableCell>
          {!small ? (
            <>
              <TableCell className="p-3">
                <p className="font-medium">#{ticket.id}</p>
              </TableCell>

              <TableCell className="max-w-40 p-3">
                <div className="line-clamp-2">{ticket.name}</div>
              </TableCell>
              <TableCell className="p-3">
                <Priority name={ticket.priority?.name} />
              </TableCell>
              <TableCell className="p-3">
                <Status name={ticket.status?.name} />
              </TableCell>

              <TableCell className="p-3">
                {ticket.assignedToContact?.simpleFullName}
              </TableCell>
              <TableCell>
                {ticket.assignment === ASSIGNMENT.CUSTOMER
                  ? ticket.project?.clientPartner?.simpleFullName
                  : ticket?.project?.company?.name}
              </TableCell>
              <TableCell className="p-3">
                {formatDate(ticket.updatedOn)}
              </TableCell>
            </>
          ) : (
            <TableCell
              className="flex float-end items-center action p-3"
              onClick={handleCollapse}>
              <p className="">{ticket.name}</p>
              {ticket?.id === openId ? (
                <MdArrowDropUp className="cursor-pointer ms-1 inline" />
              ) : (
                <MdArrowDropDown className="cursor-pointer ms-1 inline" />
              )}
            </TableCell>
          )}

          <TableCell className="text-center action pointer-events-none p-3">
            <DeleteCell
              ticketId={ticketId}
              relatedTicketId={ticket.id}
              linkId={link.id}
            />
          </TableCell>
        </TableRow>
        {small && (
          <Collapsible open={ticket.id === openId} asChild>
            <TableRow className="text-xs">
              <CollapsibleContent asChild>
                <TableCell colSpan={2}>
                  <div className="grid grid-cols-2 gap-y-2">
                    <Item label="Link Type">
                      <span className="max-w-48 line-clamp-2">
                        {link.projectTaskLinkType?.name}
                      </span>
                    </Item>

                    <Item label="Priority">
                      <Priority name={ticket.priority?.name} />
                    </Item>
                    <Item label="Status">
                      <Status name={ticket.status?.name} />
                    </Item>

                    <Item label="Managed by">
                      {ticket.assignedToContact?.simpleFullName}
                    </Item>
                    <Item label="Assigned to">
                      {ticket.assignment === ASSIGNMENT.CUSTOMER
                        ? ticket.project?.clientPartner?.simpleFullName
                        : ticket.project?.company?.name}
                    </Item>
                    <Item label="Updated">{formatDate(ticket.updatedOn)}</Item>
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

function DeleteCell({
  ticketId,
  linkId,
  relatedTicketId,
}: {
  ticketId: ID;
  linkId: ID;
  relatedTicketId: ID;
}) {
  const {workspaceURL} = useWorkspace();
  const router = useRouter();
  const {toast} = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!loading) {
      try {
        const {error, message} = await deleteRelatedLink({
          workspaceURL,
          data: {
            currentTicketId: ticketId,
            linkTicketId: relatedTicketId,
            linkId,
          },
        });

        if (error) {
          return toast({
            variant: 'destructive',
            title: message,
          });
        }

        toast({
          variant: 'success',
          title: i18n.get('Link removed'),
        });

        router.refresh();
      } catch (e) {
        if (e instanceof Error) {
          return toast({
            variant: 'destructive',
            title: e.message,
          });
        }
        toast({
          variant: 'destructive',
          title: i18n.get('An error occurred'),
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return <Button onClick={handleDelete} disabled={loading} />;
}

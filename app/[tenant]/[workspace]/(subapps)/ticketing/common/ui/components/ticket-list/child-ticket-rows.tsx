'use client';
// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/lib/i18n';
import type {Cloned} from '@/types/util';
import {
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
import {deleteChildLink} from '../../../actions';
import {columns} from '../../../constants';
import type {Ticket} from '../../../orm/tickets';
import {formatDate, isWithProvider} from '../../../utils';
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

type ChildTicketRowsProps = {
  tickets: Cloned<NonNullable<Ticket['childTasks']>>;
  ticketId: ID;
};

export function ChildTicketRows(props: ChildTicketRowsProps) {
  const {tickets, ticketId} = props;
  const {workspaceURI} = useWorkspace();
  const [openId, setOpenId] = useState<string | null>(null);
  const res = useResponsive();
  const router = useRouter();
  const small = (['xs', 'sm', 'md'] as const).some(x => res[x]);

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

    const handleCollapse = (e: React.MouseEvent<HTMLTableCellElement>) => {
      e.stopPropagation();
      setOpenId(id => (id === ticket.id ? null : ticket.id));
    };

    return (
      <Fragment key={ticket.id}>
        <TableRow
          onClick={handleClick}
          className="cursor-pointer [&:not(:has(.action:hover)):hover]:bg-slate-100 text-xs">
          <TableCell className="p-3">
            <p className="font-medium">#{ticket.id}</p>
          </TableCell>
          {!small ? (
            <>
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
                <Category name={ticket.projectTaskCategory?.name} />
              </TableCell>
              <TableCell className="p-3">
                {ticket.assignedToContact?.simpleFullName}
              </TableCell>
              <TableCell className="p-3">
                {isWithProvider(ticket.assignment)
                  ? ticket?.project?.company?.name
                  : ticket.project?.clientPartner?.simpleFullName}
              </TableCell>
              <TableCell className="p-3">
                {formatDate(ticket.updatedOn)}
              </TableCell>
            </>
          ) : (
            <TableCell className="action p-3" onClick={handleCollapse}>
              <div className="flex items-center">
                <p className="max-w-48 line-clamp-2">{ticket.name}</p>
                {ticket?.id === openId ? (
                  <MdArrowDropUp className="cursor-pointer ms-1  inline" />
                ) : (
                  <MdArrowDropDown className="cursor-pointer ms-1  inline" />
                )}
              </div>
            </TableCell>
          )}

          <TableCell className="text-center action pointer-events-none p-3">
            <DeleteCell ticketId={ticketId} relatedTicketId={ticket.id} />
          </TableCell>
        </TableRow>
        {small && (
          <Collapsible open={ticket.id === openId} asChild>
            <TableRow className="text-xs">
              <CollapsibleContent asChild>
                <TableCell colSpan={3}>
                  <div className="grid grid-cols-2 gap-y-2">
                    <Item label="Priority">
                      <Priority name={ticket.priority?.name} />
                    </Item>
                    <Item label="Status">
                      <Status name={ticket.status?.name} />
                    </Item>
                    <Item label="Category">
                      <Category
                        name={ticket.projectTaskCategory?.name}
                        className="me-0"
                      />
                    </Item>
                    <Item label="Managed by">
                      {ticket.assignedToContact?.simpleFullName}
                    </Item>
                    <Item label="Assigned to">
                      {isWithProvider(ticket.assignment)
                        ? ticket.project?.company?.name
                        : ticket.project?.clientPartner?.simpleFullName}
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

function DeleteCell({
  ticketId,
  relatedTicketId,
}: {
  ticketId: ID;
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
        const {error, message} = await deleteChildLink({
          workspaceURL,
          data: {
            currentTicketId: ticketId,
            linkTicketId: relatedTicketId,
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

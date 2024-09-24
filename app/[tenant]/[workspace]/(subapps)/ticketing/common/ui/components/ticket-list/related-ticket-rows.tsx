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
import {useResponsive, useToast} from '@/ui/hooks';
import {ID} from '@goovee/orm';
import {useRouter} from 'next/navigation';
import {Fragment, useState} from 'react';
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdRemoveCircleOutline,
} from 'react-icons/md';

// ---- LOCAL IMPORTS ---- //
import {cn} from '@/utils/css';
import {deleteLink} from '../../../actions';
import {ASSIGNMENT, columns} from '../../../constants';
import {Ticket} from '../../../types';
import {getProfilePic} from '../../../utils';
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

type RelatedTicketRowProps = {
  ticketId: ID;
  links: {
    id: ID;
    version: number;
    projectTaskLinkType: {
      id: ID;
      version: number;
      name: string;
    };
    relatedTask: Ticket;
  }[];
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
          className="[&:not(:has(.action:hover))]:cursor-pointer  [&:not(:has(.action:hover)):hover]:bg-slate-100">
          <TableCell>
            <p className="font-medium">{link.projectTaskLinkType.name}</p>
          </TableCell>
          {!small ? (
            <>
              <TableCell className="px-5">
                <p className="font-medium">#{ticket.id}</p>
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
            </>
          ) : (
            <TableCell
              className="flex float-end items-center action"
              onClick={handleCollapse}>
              <p className="font-medium px-5">#{ticket.id}</p>
              {ticket?.id === openId ? (
                <MdArrowDropUp className="cursor-pointer ms-1 inline" />
              ) : (
                <MdArrowDropDown className="cursor-pointer ms-1 inline" />
              )}
            </TableCell>
          )}

          <TableCell className="text-center action pointer-events-none">
            <DeleteCell
              ticketId={ticketId}
              relatedTicketId={ticket.id}
              linkId={link.id}
            />
          </TableCell>
        </TableRow>
        {small && (
          <Collapsible open={ticket.id === openId} asChild>
            <TableRow>
              <CollapsibleContent asChild>
                <TableCell colSpan={3}>
                  <div className="grid grid-cols-2 gap-y-2">
                    <Item label="Subject">
                      <span className="max-w-48 line-clamp-2">
                        {ticket.name}
                      </span>
                    </Item>
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
        const {error, message} = await deleteLink({
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

  return (
    <button
      onClick={handleDelete}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap p-1 text-destructive hover:scale-110 active:scale-95 rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pointer-events-auto disabled:pointer-events-none disabled:opacity-50',
      )}>
      <MdRemoveCircleOutline className="w-5 h-5" />
    </button>
  );
}

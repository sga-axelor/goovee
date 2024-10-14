'use client';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import type {Cloned} from '@/types/util';
import {Table, TableBody, TableHeader, TableRow} from '@/ui/components';
import {useSortBy} from '@/ui/hooks';
import {useRouter} from 'next/navigation';
import {useCallback} from 'react';
import type {Ticket, TicketListTicket} from '../../../orm/tickets';
import {TableHeads, TableRows} from '../table-elements';
import {
  childColumns,
  parentColumns,
  relatedColumns,
  ticketColumns,
} from './columns';
import {
  RemoveChildButton,
  RemoveLinkButton,
  RemoveParentButton,
} from './ticket-row-buttons';

type TicketListProps = {
  tickets: Cloned<TicketListTicket>[];
};

export function TicketList(props: TicketListProps) {
  const {tickets} = props;
  const [sortedTickets, sort, toggleSort] = useSortBy(tickets);

  const {workspaceURI} = useWorkspace();
  const router = useRouter();

  const handleRowClick = useCallback(
    (record: Cloned<TicketListTicket>) => {
      record.project?.id &&
        router.push(
          `${workspaceURI}/ticketing/projects/${record.project.id}/tickets/${record.id}`,
        );
    },
    [router, workspaceURI],
  );

  return (
    <Table className="rounded-lg bg-card text-card-foreground">
      <TableHeader>
        <TableRow>
          <TableHeads
            columns={ticketColumns}
            sort={{
              key: sort.key,
              direction: sort.direction,
              toggle: column =>
                toggleSort({
                  key: column.key,
                  getter: column.getter,
                  type: column.type,
                }),
            }}
          />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRows
          records={sortedTickets}
          columns={ticketColumns}
          onRowClick={handleRowClick}
        />
      </TableBody>
    </Table>
  );
}

export function ParentTicketList(props: {
  ticketId: string;
  tickets: Cloned<NonNullable<Ticket['parentTask']>>[];
}) {
  const {tickets, ticketId} = props;

  const {workspaceURI} = useWorkspace();
  const router = useRouter();

  const handleRowClick = useCallback(
    (record: Cloned<TicketListTicket>) => {
      record.project?.id &&
        router.push(
          `${workspaceURI}/ticketing/projects/${record.project.id}/tickets/${record.id}`,
        );
    },
    [router, workspaceURI],
  );
  const hasTickets = Boolean(tickets.length);
  return (
    <Table className="rounded-lg bg-card text-card-foreground">
      {hasTickets && (
        <TableHeader>
          <TableRow>
            <TableHeads columns={parentColumns} />
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        <TableRows
          records={tickets}
          columns={parentColumns}
          onRowClick={handleRowClick}
          deleteCellRenderer={ticket => (
            <RemoveParentButton
              ticketId={ticketId}
              relatedTicketId={ticket.id}
            />
          )}
        />
      </TableBody>
    </Table>
  );
}

export function ChildTicketList(props: {
  ticketId: string;
  tickets: Cloned<Ticket>['childTasks'];
}) {
  const {tickets, ticketId} = props;
  const hasTickets = Boolean(tickets?.length);

  const {workspaceURI} = useWorkspace();
  const router = useRouter();

  const handleRowClick = useCallback(
    (record: Cloned<NonNullable<Ticket['childTasks']>[number]>) => {
      record.project?.id &&
        router.push(
          `${workspaceURI}/ticketing/projects/${record.project.id}/tickets/${record.id}`,
        );
    },
    [router, workspaceURI],
  );

  return (
    <Table className="rounded-lg bg-card text-card-foreground">
      {hasTickets && (
        <TableHeader>
          <TableRow>
            <TableHeads columns={childColumns} />
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        <TableRows
          records={tickets ?? []}
          columns={childColumns}
          onRowClick={handleRowClick}
          deleteCellRenderer={ticket => (
            <RemoveChildButton
              ticketId={ticketId}
              relatedTicketId={ticket.id}
            />
          )}
        />
      </TableBody>
    </Table>
  );
}

export function RelatedTicketList(props: {
  ticketId: string;
  links: Cloned<NonNullable<Ticket['projectTaskLinkList']>>;
}) {
  const {links, ticketId} = props;
  const hasLinks = Boolean(links?.length);

  const {workspaceURI} = useWorkspace();
  const router = useRouter();

  const handleRowClick = useCallback(
    (record: Cloned<NonNullable<Ticket['projectTaskLinkList']>[number]>) => {
      record.relatedTask?.project?.id &&
        router.push(
          `${workspaceURI}/ticketing/projects/${record.relatedTask.project.id}/tickets/${record.relatedTask.id}`,
        );
    },
    [router, workspaceURI],
  );

  return (
    <Table className="rounded-lg bg-card text-card-foreground">
      {hasLinks && (
        <TableHeader>
          <TableRow>
            <TableHeads columns={relatedColumns} />
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        <TableRows
          records={links ?? []}
          columns={relatedColumns}
          onRowClick={handleRowClick}
          deleteCellRenderer={link =>
            link.relatedTask && (
              <RemoveLinkButton
                ticketId={ticketId}
                relatedTicketId={link.relatedTask.id}
                linkId={link.id}
              />
            )
          }
        />
      </TableBody>
    </Table>
  );
}

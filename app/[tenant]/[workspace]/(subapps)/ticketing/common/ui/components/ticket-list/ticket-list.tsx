'use client';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import type {Cloned} from '@/types/util';
import {Table, TableBody, TableHeader, TableRow} from '@/ui/components';
import {useSortBy} from '@/ui/hooks';
import {useRouter} from 'next/navigation';
import {useCallback, useMemo} from 'react';
import type {
  ChildTicket,
  ParentTicket,
  TicketLink,
  TicketListTicket,
} from '../../../types';
import {type Column, TableHeads, TableRows} from '../table-elements';
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
import type {PortalAppConfig} from '@/types';

type TicketListProps = {
  tickets: Cloned<TicketListTicket>[];
  ticketingFieldSet: PortalAppConfig['ticketingFieldSet'];
};

function filterColumns<T extends Record<string, any>>(
  columns: Column<T>[],
  ticketingFieldSet: PortalAppConfig['ticketingFieldSet'],
) {
  if (!ticketingFieldSet) return columns;
  const fields = ticketingFieldSet.map(field => field.name);
  return columns.filter(
    column => column.required || fields.includes(column.key),
  );
}

export function TicketList(props: TicketListProps) {
  const {tickets, ticketingFieldSet} = props;
  const [sortedTickets, sort, toggleSort] = useSortBy(tickets);

  const {workspaceURI} = useWorkspace();
  const router = useRouter();

  const columns = useMemo(() => {
    return filterColumns(ticketColumns, ticketingFieldSet);
  }, [ticketingFieldSet]);

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
            columns={columns}
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
          columns={columns}
          onRowClick={handleRowClick}
        />
      </TableBody>
    </Table>
  );
}

export function ParentTicketList(props: {
  ticketId: string;
  tickets: Cloned<ParentTicket>[];
  ticketingFieldSet: PortalAppConfig['ticketingFieldSet'];
}) {
  const {tickets, ticketId, ticketingFieldSet} = props;

  const {workspaceURI} = useWorkspace();
  const router = useRouter();

  const columns = useMemo(() => {
    return filterColumns(parentColumns, ticketingFieldSet);
  }, [ticketingFieldSet]);

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
            <TableHeads columns={columns} />
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        <TableRows
          records={tickets}
          columns={columns}
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
  tickets?: Cloned<ChildTicket[]>;
  ticketingFieldSet: PortalAppConfig['ticketingFieldSet'];
}) {
  const {tickets, ticketId, ticketingFieldSet} = props;
  const hasTickets = Boolean(tickets?.length);

  const {workspaceURI} = useWorkspace();
  const router = useRouter();

  const columns = useMemo(() => {
    return filterColumns(childColumns, ticketingFieldSet);
  }, [ticketingFieldSet]);

  const handleRowClick = useCallback(
    (record: Cloned<ChildTicket>) => {
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
            <TableHeads columns={columns} />
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        <TableRows
          records={tickets ?? []}
          columns={columns}
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
  links: Cloned<TicketLink[]>;
  ticketingFieldSet: PortalAppConfig['ticketingFieldSet'];
}) {
  const {links, ticketId, ticketingFieldSet} = props;
  const hasLinks = Boolean(links?.length);

  const columns = useMemo(() => {
    return filterColumns(relatedColumns, ticketingFieldSet);
  }, [ticketingFieldSet]);

  const {workspaceURI} = useWorkspace();
  const router = useRouter();

  const handleRowClick = useCallback(
    (record: Cloned<TicketLink>) => {
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
            <TableHeads columns={columns} />
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        <TableRows
          records={links ?? []}
          columns={columns}
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

// ---- CORE IMPORTS ---- //
import {ORDER_BY} from '@/constants';
import {Maybe} from '@/types/util';
import {
  AvatarImage,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
} from '@/ui/components';
import {Skeleton} from '@/ui/components/skeleton';
import {Avatar} from '@radix-ui/react-avatar';
import Link from 'next/link';
import {ReactNode, Suspense} from 'react';
import {MdArrowDropDown, MdArrowDropUp, MdArrowForward} from 'react-icons/md';

// ---- LOCAL IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {columns} from '../../../constants';
import {formatDate, getSortDirection, getSortKey} from '../../../utils';
import type {Ticket} from '../../../types';

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
type TicketListProps = {
  tickets: Promise<Ticket[]>;
  url: string;
  searchParams: Record<string, string | undefined>;
  footer?: ReactNode;
};

export async function TicketList(props: TicketListProps) {
  const {tickets, url, searchParams, footer} = props;
  return (
    <Table className="w-full rounded-lg bg-card text-card-foreground">
      <TableHeader>
        <TableRow>
          {columns?.map(column => {
            const isActive = getSortKey(searchParams.sort) === column.key;
            const isASC =
              isActive && getSortDirection(searchParams.sort) === ORDER_BY.ASC;
            const label = i18n.get(column.label);
            return (
              <TableHead
                key={column.key}
                className="text-card-foreground text-base font-semibold px-6 border-none">
                {column.orderBy ? (
                  <div className="flex gap-1 items-center">
                    <Link
                      scroll={false}
                      href={`${url}?sort=${isASC ? '-' : ''}${column.key}`}>
                      {label}
                    </Link>
                    {isActive &&
                      (isASC ? <MdArrowDropDown /> : <MdArrowDropUp />)}
                  </div>
                ) : (
                  label
                )}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        <Suspense fallback={<TicketRowsSkeleton />}>
          <TicketRows tickets={tickets} />
        </Suspense>
      </TableBody>
      <TableFooter>{footer}</TableFooter>
    </Table>
  );
}

async function TicketRows(props: {tickets: Promise<Ticket[]>}) {
  const tickets = await props.tickets;
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

function TicketRowsSkeleton() {
  return Array(7)
    .fill(null)
    .map((t, i) => (
      <TableRow key={i}>
        {columns.map((c, i) => (
          <TableCell key={i}>
            <Skeleton className="w-24 h-6" />
          </TableCell>
        ))}
      </TableRow>
    ));
}

export default TicketList;

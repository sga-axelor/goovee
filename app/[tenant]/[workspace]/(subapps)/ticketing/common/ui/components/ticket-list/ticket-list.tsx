'use client';
// ---- CORE IMPORTS ---- //
import {ORDER_BY} from '@/constants';
import {i18n} from '@/lib/i18n';
import {
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/components';
import {useSortBy} from '@/ui/hooks';
import {ReactNode} from 'react';
import {MdArrowDropDown, MdArrowDropUp} from 'react-icons/md';

// ---- LOCAL IMPORTS ---- //
import {columns, sortKeyPathMap} from '../../../constants';
import type {Ticket} from '../../../types';
import {TicketRows} from './ticket-rows';

type TicketListProps = {
  tickets: Ticket[];
  footer?: ReactNode;
  projectId?: string;
};

export function TicketList(props: TicketListProps) {
  const {tickets, footer, projectId} = props;
  const [sortedTickets, sort, toggleSort] = useSortBy(tickets);

  return (
    <Table className="rounded-lg bg-card text-card-foreground">
      <TableHeader>
        <TableRow>
          {columns?.map(column => {
            const isActive = sort.key === column.key;
            const isASC = isActive && sort.direction === ORDER_BY.ASC;
            const label = i18n.get(column.label);
            return (
              <TableHead
                key={column.key}
                onClick={() => {
                  const path = sortKeyPathMap[column.key];
                  path && toggleSort({key: column.key, path});
                }}
                className="text-card-foreground cursor-pointer text-base font-semibold px-6 border-none">
                <div className="flex gap-1 items-center">
                  <div className="line-clamp-1">{label}</div>
                  {isActive &&
                    (isASC ? <MdArrowDropDown /> : <MdArrowDropUp />)}
                </div>
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TicketRows tickets={sortedTickets} projectId={projectId} />
      </TableBody>
      <TableFooter>{footer}</TableFooter>
    </Table>
  );
}

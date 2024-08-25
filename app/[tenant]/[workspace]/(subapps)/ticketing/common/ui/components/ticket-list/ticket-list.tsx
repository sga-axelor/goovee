'use client';
// ---- CORE IMPORTS ---- //
import {ORDER_BY} from '@/constants';
import {i18n} from '@/lib/i18n';
import {
  Button,
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
};

export function TicketList(props: TicketListProps) {
  const {tickets, footer} = props;
  const [sortedTickets, sort, toggleSort] = useSortBy(tickets);

  return (
    <Table className="w-full rounded-lg bg-card text-card-foreground">
      <TableHeader>
        <TableRow>
          {columns?.map(column => {
            const sortKey = sortKeyPathMap[sort.key];
            const isActive = sortKey === column.key;
            const isASC = isActive && sort.direction === ORDER_BY.ASC;
            const label = i18n.get(column.label);
            return (
              <TableHead
                key={column.key}
                className="text-card-foreground text-base font-semibold px-6 border-none">
                <div className="flex gap-1 items-center">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const path = sortKeyPathMap[column.key];
                      path && toggleSort({key: column.key, path});
                    }}>
                    {label}
                  </Button>
                  {isActive &&
                    (isASC ? <MdArrowDropDown /> : <MdArrowDropUp />)}
                </div>
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TicketRows tickets={sortedTickets} />
      </TableBody>
      <TableFooter>{footer}</TableFooter>
    </Table>
  );
}

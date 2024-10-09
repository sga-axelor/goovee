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
import {useResponsive, useSortBy} from '@/ui/hooks';
import {cn} from '@/utils/css';
import {ReactNode} from 'react';
import {MdArrowDropDown, MdArrowDropUp} from 'react-icons/md';
import type {Cloned} from '@/types/util';

// ---- LOCAL IMPORTS ---- //
import {columns, sortValueGetterMap} from '../../../constants';
import type {TicketListTicket} from '../../../orm/tickets';
import {TicketRows} from './ticket-rows';

type TicketListProps = {
  tickets: Cloned<TicketListTicket>[];
  footer?: ReactNode;
};

export function TicketList(props: TicketListProps) {
  const {tickets, footer} = props;
  const [sortedTickets, sort, toggleSort] = useSortBy(tickets);
  const res = useResponsive();
  const small = (['xs', 'sm', 'md'] as const).some(x => res[x]);
  const mainColumns = small ? [columns[0], columns[2]] : columns;

  return (
    <Table className="rounded-lg bg-card text-card-foreground">
      <TableHeader>
        <TableRow>
          {mainColumns?.map(column => {
            const isActive = sort.key === column.key;
            const isASC = isActive && sort.direction === ORDER_BY.ASC;
            const label = i18n.get(column.label);
            const Arrow = isASC ? MdArrowDropDown : MdArrowDropUp;
            return (
              <TableHead
                key={column.key}
                onClick={() => {
                  const getter = sortValueGetterMap[column.key];
                  getter && toggleSort({key: column.key, getter});
                }}
                className={cn(
                  'text-card-foreground cursor-pointer text-xs font-semibold border-none pr-0',
                )}>
                <div className="flex gap-1 items-center">
                  <div className="line-clamp-1">{label}</div>
                  {isActive ? (
                    <Arrow className="ms-auto" />
                  ) : (
                    <span className="h-[1em] w-[1em]" />
                  )}
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

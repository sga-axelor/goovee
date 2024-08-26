// ---- CORE IMPORTS ---- //
import {ORDER_BY} from '@/constants';
import {
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/components';
import Link from 'next/link';
import {ReactNode} from 'react';
import {MdArrowDropDown, MdArrowDropUp} from 'react-icons/md';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import {columns, sortKeyPathMap} from '../../../constants';
import type {Ticket} from '../../../types';
import {decodeSortValue, encodeSortValue} from '../../../utils/search-param';
import {TicketRows} from './ticket-rows';

type TicketListProps = {
  tickets: Ticket[];
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
            const [key, direction] = decodeSortValue(searchParams.sort);
            const isActive = key === column.key;
            const isASC = isActive && direction === ORDER_BY.ASC;
            const label = i18n.get(column.label);
            return (
              <TableHead
                key={column.key}
                className="text-card-foreground text-base font-semibold px-6 border-none">
                {sortKeyPathMap[column.key] ? (
                  <div className="flex gap-1 items-center">
                    <Link
                      scroll={false}
                      href={{
                        pathname: url,
                        query: {
                          ...searchParams,
                          page: 1,
                          sort: encodeSortValue(
                            column.key,
                            isASC ? ORDER_BY.DESC : ORDER_BY.ASC,
                          ),
                        },
                      }}>
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
        <TicketRows tickets={tickets} />
      </TableBody>
      <TableFooter>{footer}</TableFooter>
    </Table>
  );
}

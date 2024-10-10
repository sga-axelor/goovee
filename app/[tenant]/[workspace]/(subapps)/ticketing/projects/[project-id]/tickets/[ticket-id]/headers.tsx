'use client';
import {i18n} from '@/lib/i18n';
import {Cloned} from '@/types/util';
import {TableHead, TableHeader, TableRow} from '@/ui/components';
import {ID} from '@goovee/orm';
import type {
  Category,
  ContactPartner,
  Priority,
} from '../../../../common/orm/projects';
import {Ticket} from '../../../../common/orm/tickets';
import {TicketLinkHeader} from '../../../../common/ui/components/ticket-link-header';
import {TicketForm} from '../../../../common/ui/components/ticket-form';
import {
  TicketChildLinkForm,
  TicketRelatedLinkForm,
} from '../../../../common/ui/components/ticket-link-form';
import {useResponsive} from '@/ui/hooks';
import {columns} from '../../../../common/constants';
import {cn} from '@/utils/css';
import {Column, SortKey} from '../../../../common/types';

export function RelatedTicketsHeader(props: {
  linkTypes: {
    id: string;
    name: string;
  }[];
  projectId: ID;
  ticketId: ID;
  links: Cloned<NonNullable<Ticket['projectTaskLinkList']>>;
}) {
  return (
    <TicketLinkHeader
      title={i18n.get('Related tickets')}
      alertTitle={i18n.get('Link related ticket')}
      alertContentRenderer={({closeAlert}) => (
        <TicketRelatedLinkForm {...props} onSubmit={closeAlert} />
      )}
    />
  );
}

export function ChildTicketsHeader(props: {
  projectId: ID;
  ticketId: ID;
  parentIds: ID[];
  categories: Category[];
  priorities: Priority[];
  contacts: ContactPartner[];
  userId: ID;
}) {
  const {
    ticketId,
    projectId,
    categories,
    priorities,
    contacts,
    userId,
    parentIds,
  } = props;

  return (
    <TicketLinkHeader
      title={i18n.get('Child tickets')}
      dialogTitle={i18n.get('Create child ticket')}
      dialogContentRenderer={({closeDialog}) => (
        <TicketForm
          projectId={projectId.toString()}
          categories={categories}
          priorities={priorities}
          contacts={contacts}
          userId={userId}
          parentId={ticketId.toString()}
          className="mt-10 text-left"
          onSuccess={closeDialog}
        />
      )}
      alertTitle={i18n.get('Link child ticket')}
      alertContentRenderer={({closeAlert}) => (
        <TicketChildLinkForm
          ticketId={ticketId}
          parentIds={parentIds}
          projectId={projectId}
          onSubmit={closeAlert}
        />
      )}
    />
  );
}
export function ParentTicketTableHeader() {
  const res = useResponsive();
  const small = (['xs', 'sm', 'md'] as const).some(x => res[x]);
  const mainColumns = small ? [columns[0], columns[2]] : columns;

  return (
    <TableHeader>
      <TableRow>
        {mainColumns?.map((column, index) => {
          return (
            <TableHead
              key={column.key}
              className={cn(
                'text-card-foreground cursor-pointer text-xs font-semibold border-none pr-0',
              )}>
              <div
                className={cn('flex gap-1 items-center', {
                  'flex-row': index === 1 && small,
                })}>
                <div className="line-clamp-1">{column.label}</div>
              </div>
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
}

export function ChildTicketTableHeader() {
  const res = useResponsive();
  const small = (['xs', 'sm', 'md'] as const).some(x => res[x]);
  const mainColumns = small
    ? [columns[0], columns[2]]
    : columns.filter((column, index) => index !== 1);

  return (
    <TableHeader>
      <TableRow>
        {mainColumns?.map((column, index) => {
          return (
            <TableHead
              key={column.key}
              className={cn(
                'text-card-foreground cursor-pointer text-xs font-semibold border-none pr-0',
              )}>
              <div
                className={cn('flex gap-1 items-center', {
                  'flex-row': index === 1 && small,
                })}>
                <div className="line-clamp-1">{column.label}</div>
              </div>
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
}

export function RelatedTicketsTableHeader() {
  const res = useResponsive();
  const small = (['xs', 'sm', 'md'] as const).some(x => res[x]);
  const newField = {
    key: 'link',
    label: 'Link Type',
  };
  const updatedColumns: Column<SortKey>[] = [newField, ...columns];
  const mainColumns = small
    ? [updatedColumns[0], updatedColumns[3]]
    : updatedColumns;

  return (
    <TableHeader>
      <TableRow>
        {mainColumns?.map((column, index) => {
          return (
            index !== 2 &&
            index !== 6 && (
              <TableHead
                key={column.key}
                className={cn(
                  'text-card-foreground cursor-pointer text-xs font-semibold border-none pr-0',
                )}>
                <div
                  className={cn('flex gap-1 items-center', {
                    'flex-row': index === 1 && small,
                  })}>
                  <div className="line-clamp-1">{column.label}</div>
                </div>
              </TableHead>
            )
          );
        })}
      </TableRow>
    </TableHeader>
  );
}

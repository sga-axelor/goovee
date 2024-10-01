/**
 * Tickets Constants
 */

import {Column, SortKey} from '../types';
import {TicketListTicket} from '../orm/tickets';
import {Cloned} from '@/types/util';

export const columns: Column<SortKey>[] = [
  {
    key: 'ticketId',
    label: 'Ticket ID',
  },
  {
    key: 'requestedBy',
    label: 'Requested by',
  },
  {
    key: 'subject',
    label: 'Subject',
  },
  {
    key: 'priority',
    label: 'Priority',
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'category',
    label: 'Category',
  },
  {
    key: 'assignedTo',
    label: 'Assigned to',
  },
  {
    key: 'updatedOn',
    label: 'Updated',
  },
];

// NOTE: This is used for serverside sorting
export const sortKeyPathMap: Record<string, string> = {
  ticketId: 'id',
  requestedBy: 'requestedByContact.simpleFullName',
  subject: 'name',
  priority: 'priority.name',
  status: 'status.name',
  category: 'projectTaskCategory.name',
  assignedTo: 'assignedToContact.simpleFullName',
  updatedOn: 'updatedOn',
};

type Getter = (t: Cloned<TicketListTicket>) => unknown;
// NOTE: This is used for clientside sorting
export const sortValueGetterMap: Record<string, string | Getter> = {
  ticketId: 'id',
  requestedBy: t =>
    t.requestedByContact?.simpleFullName ?? t.project?.company?.name,
  subject: 'name',
  priority: 'priority.name',
  status: 'status.name',
  category: 'projectTaskCategory.name',
  assignedTo: t =>
    t.assignment === ASSIGNMENT.PROVIDER
      ? t.project?.company?.name
      : t.assignedToContact?.simpleFullName,
  updatedOn: 'updatedOn',
};

export const TYPE_SELECT = {
  TASK: 'task',
  TICKET: 'ticket',
} as const;

export const ASSIGNMENT = {
  CUSTOMER: 1,
  PROVIDER: 2,
} as const;

export const INVOICING_TYPE = {
  TIME_SPENT: 1,
  PACKAGE: 2,
  NO_INVOICING: 3,
  ON_PROGRESS: 4,
} as const;

export const VERSION_MISMATCH_ERROR = 'OptimisticLockVersionMismatchError';
export const VERSION_MISMATCH_CAUSE_CLASS =
  'javax.persistence.OptimisticLockException';

export const STATUS_CHANGE_METHOD = {
  DB: 'fromDB',
  WS: 'fromWS',
};

export const DEFAULT_SORT = 'updatedOn DESC';
export const COMPANY = 'company';

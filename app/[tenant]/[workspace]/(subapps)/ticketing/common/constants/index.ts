/**
 * Tickets Constants
 */

import {Cloned} from '@/types/util';
import {TicketListTicket} from '../orm/tickets';
import {Column, SortKey} from '../types';
import {isWithProvider} from '../utils';

export const columns: Column<SortKey>[] = [
  {
    key: 'ticketId',
    label: 'Ticket ID',
  },
  {
    key: 'createdBy',
    label: 'Created by',
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
    key: 'managedBy',
    label: 'Managed by',
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
  createdBy: 'requestedByContact.simpleFullName',
  subject: 'name',
  priority: 'priority.name',
  status: 'status.name',
  category: 'projectTaskCategory.name',
  managedBy: 'assignedToContact.simpleFullName',
  assignedTo: 'assignment',
  updatedOn: 'updatedOn',
};

type Getter = (t: Cloned<TicketListTicket>) => unknown;
// NOTE: This is used for clientside sorting
export const sortValueGetterMap: Record<string, string | Getter> = {
  ticketId: 'id',
  createdBy: t =>
    t.requestedByContact?.simpleFullName ?? t.project?.company?.name,
  subject: 'name',
  priority: 'priority.name',
  status: 'status.name',
  category: 'projectTaskCategory.name',
  assignedTo: t =>
    isWithProvider(t.assignment)
      ? t.project?.company?.name
      : t.project?.clientPartner?.simpleFullName,
  updatedOn: 'updatedOn',
  managedBy: t => t.assignedToContact?.simpleFullName,
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

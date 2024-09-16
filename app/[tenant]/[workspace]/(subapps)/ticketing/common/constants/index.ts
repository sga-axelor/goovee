/**
 * Tickets Constants
 */

import {Column, SortKey} from '../types';

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

export const sortKeyPathMap: Record<string, string> = {
  ticketId: 'id',
  requestedBy: 'requestedByContact.name',
  subject: 'name',
  priority: 'priority.name',
  status: 'status.name',
  category: 'projectTaskCategory.name',
  assignedTo: 'assignment',
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

/**
 * Tickets Constants
 */

import {Column, FilterKey, SortKey} from '../types';

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

export const filterKeyPathMap: Record<string, string> = {
  priority: 'priority.id',
  requestedBy: 'assignedTo.id',
  status: 'status.id',
  statusCompleted: 'status.isCompleted',
  updatedOn: 'updatedOn',
  updatedBy: 'updatedBy.id',
};

export const sortKeyPathMap: Record<string, string> = {
  ticketId: 'id',
  requestedBy: 'contact.name',
  subject: 'name',
  priority: 'priority.name',
  status: 'status.name',
  category: 'projectTaskCategory.name',
  assignedTo: 'assignedTo.name',
  updatedOn: 'updatedOn',
};

/**
 * Tickets Constants
 */

import {Column, FilterKey, SortKey} from '../types';
import {Path} from '../utils/search-param';

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

export const filterMap: Record<string, Path> = {
  priority: {
    path: 'priority.id',
  },
  requestedBy: {
    path: 'assignedTo.id',
  },
  status: {
    path: 'status.id',
  },
  updatedOn: {
    path: 'updatedOn',
  },
};

export const sortMap: Record<string, Path> = {
  ticketId: {
    path: 'id',
  },
  // requestedBy: {
  //   path: 'contact.name',
  // },
  subject: {
    path: 'name',
  },
  priority: {
    path: 'priority.name',
  },
  status: {
    path: 'status.name',
  },
  category: {
    path: 'projectTaskCategory.name',
  },
  assignedTo: {
    path: 'assignedTo.name',
  },
  updatedOn: {
    path: 'updatedOn',
  },
};

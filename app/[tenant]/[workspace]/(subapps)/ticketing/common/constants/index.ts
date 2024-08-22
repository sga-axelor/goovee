/**
 * Tickets Constants
 */

import {Maybe} from '@/types/util';
import {Column} from '../types';

export const columns: Column[] = [
  {
    key: 'ticketId',
    label: 'Ticket ID',
    orderBy: dir => ({
      ticketNumber: dir,
    }),
  },
  {
    key: 'requestedBy',
    label: 'Requested by',
  },
  {
    key: 'subject',
    label: 'Subject',
    orderBy: dir => ({
      name: dir,
    }),
  },
  {
    key: 'priority',
    label: 'Priority',
    orderBy: dir => ({
      priority: {
        name: dir,
      },
    }),
  },
  {
    key: 'status',
    label: 'Status',
    orderBy: dir => ({
      status: {
        name: dir,
      },
    }),
  },
  {
    key: 'category',
    label: 'Category',
    orderBy: dir => ({
      projectTaskCategory: {
        name: dir,
      },
    }),
  },
  {
    key: 'assignedTo',
    label: 'Assigned to',
    orderBy: dir => ({
      assignedTo: {
        name: dir,
      },
    }),
  },
  {
    key: 'updatedOn',
    label: 'Updated',
    orderBy: dir => ({
      updatedOn: dir,
    }),
  },
];

type QueryGenarator = (query: Maybe<string>) => Maybe<{}>;
export const filterMap = new Map<string, QueryGenarator>();

filterMap.set('priority', (query: Maybe<string>) => {
  if (!query) return null;
  const values = query.split(',');
  return {
    OR: values.map(v => ({priority: {name: v}})),
  };
});

filterMap.set('requestedBy', (query: Maybe<string>) => {
  if (!query) return null;
  const values = query.split(',');
  //TODO: change it to requestedBy later
  return {
    OR: values.map(v => ({assignedTo: {name: v}})),
  };
});

filterMap.set('status', (query: Maybe<string>) => {
  if (!query) return null;
  const values = query.split(',');
  return {
    OR: values.map(v => ({status: {name: v}})),
  };
});

filterMap.set('updatedOn', (query: Maybe<string>) => {
  if (!query) return null;
  const values = query.split(',');
  return {
    OR: values
      .map(v => {
        const [from, to] = v.split(' ');
        const fromTime = new Date(from).getTime();
        const toTime = new Date(to).getTime();
        if (isNaN(fromTime)) return;

        if (isNaN(toTime) || fromTime === toTime) {
          return {updatedOn: from};
        }
        const between = [from, to];
        if (fromTime > toTime) between.reverse();

        return {updatedOn: {between}};
      })
      .filter(Boolean),
  };
});

/**
 * Tickets Constants
 */

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

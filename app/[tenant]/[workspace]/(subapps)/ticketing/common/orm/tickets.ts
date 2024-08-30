/**
 * Tickets ORM API
 */

import {getClient} from '@/goovee';
import {ID} from '@goovee/orm';
import {i18n} from '@/lib/i18n';
import {ORDER_BY} from '@/constants';

import {CreateTicketInfo, UpdateTicketInfo} from '../ui/components/ticket-form';

export async function findTickets() {}

export async function findTicket() {}

export async function createTicket(data: CreateTicketInfo, user: ID) {
  const {priority, subject, description, category, project: projectId} = data;
  const client = await getClient();
  const project = await client.aOSProject.findOne({
    where: {
      id: projectId,
    },
    select: {
      assignedTo: {
        id: true,
      },
      projectTaskStatusSet: {
        select: {
          id: true,
        },
        take: 1,
        orderBy: {
          sequence: ORDER_BY.ASC,
        },
      } as unknown as {select: {id: true}}, // type cast to prevent orm type error
    },
  });

  if (!project) {
    throw new Error(i18n.get('Project not found'));
  }

  const manager = project.assignedTo?.id;
  const defaultStatus = project?.projectTaskStatusSet?.[0]?.id;

  const ticket = await client.aOSProjectTask.create({
    data: {
      createdOn: new Date(),
      updatedOn: new Date(),
      createdBy: {select: {id: user}},
      updatedBy: {select: {id: user}},
      project: {
        select: {
          id: projectId,
        },
      },
      name: subject,
      description: description,
      ...(defaultStatus && {
        status: {
          select: {
            id: defaultStatus,
          },
        },
      }),
      ...(category && {
        projectTaskCategory: {
          select: {
            id: category,
          },
        },
      }),
      ...(manager && {
        assignedTo: {
          select: {
            id: manager,
          },
        },
      }),
      ...(priority && {
        priority: {
          select: {
            id: priority,
          },
        },
      }),
    },
    select: {
      id: true,
      project: {
        id: true,
      },
    },
  });

  return ticket;
}

export async function updateTicket(data: UpdateTicketInfo, user: ID) {
  const {priority, subject, description, category, id, version} = data;
  const client = await getClient();

  const ticket = await client.aOSProjectTask.update({
    data: {
      id,
      version,
      updatedOn: new Date(),
      updatedBy: {select: {id: user}},
      name: subject,
      description: description,
      ...(category && {
        projectTaskCategory: {
          select: {
            id: category,
          },
        },
      }),
      ...(priority && {
        priority: {
          select: {
            id: priority,
          },
        },
      }),
    },
    select: {
      id: true,
      project: {
        id: true,
      },
    },
  });

  return ticket;
}

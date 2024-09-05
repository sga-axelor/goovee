/**
 * Tickets ORM API
 */

import {ORDER_BY} from '@/constants';
import {getClient} from '@/goovee';
import {AOSProjectTask} from '@/goovee/.generated/models';
import {i18n} from '@/lib/i18n';
import {Entity, ID} from '@goovee/orm';

import {QueryProps} from '../types';
import {
  CreateTicketInfo,
  UpdateAssignTicket,
  UpdateTicketInfo,
} from '../ui/components/ticket-form';
import {ASSIGNMENT, INVOICING_TYPE, TYPE_SELECT} from '../constants';

export type TicketProps<T extends Entity> = QueryProps<T> & {
  projectId: ID;
};

export async function createTicket(
  data: CreateTicketInfo,
  user: ID,
  workspaceId: ID,
) {
  const {priority, subject, description, category, project: projectId} = data;
  const client = await getClient();
  const project = await client.aOSProject.findOne({
    where: {
      id: projectId,
      portalWorkspace: {
        id: workspaceId,
      },
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
      taskDate: new Date(),
      assignment: ASSIGNMENT.CUSTOMER,
      typeSelect: TYPE_SELECT.TICKET,
      invoicingType: INVOICING_TYPE.NO_INVOICING,
      isPrivate: false,
      progress: '0.00',
      // createdBy: {select: {id: user}},
      // updatedBy: {select: {id: user}},
      contact: {select: {id: user}},
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
      name: true,
    },
  });

  const ticketWithFullName = client.aOSProjectTask.update({
    data: {
      id: ticket.id,
      version: ticket.version,
      fullName: `#${ticket.id} ${ticket.name}`,
    },
    select: {
      project: {
        id: true,
      },
    },
  });
  return ticketWithFullName;
}

export async function updateTicket(
  data: UpdateTicketInfo,
  user: ID,
  workspaceId: ID,
) {
  const {
    priority,
    subject,
    description,
    category,
    id,
    version,
    project: projectId,
  } = data;
  const client = await getClient();

  const project = await client.aOSProject.findOne({
    where: {
      id: projectId,
      portalWorkspace: {
        id: workspaceId,
      },
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
export async function getAllTicketCount(projectId: ID): Promise<number> {
  const client = await getClient();
  const count = await client.aOSProjectTask.count({
    where: {
      typeSelect: TYPE_SELECT.TICKET,
      project: {
        id: projectId,
      },
      status: {
        isCompleted: false,
      },
    },
  });
  return Number(count);
}
export async function getMyTicketCount(
  projectId: ID,
  userId: ID,
): Promise<number> {
  const client = await getClient();
  const count = await client.aOSProjectTask.count({
    where: {
      typeSelect: TYPE_SELECT.TICKET,
      project: {
        id: projectId,
      },
      status: {
        isCompleted: false,
      },
      OR: [
        {
          assignedTo: {
            id: userId,
          },
        },
        {
          createdBy: {
            id: userId,
          },
        },
      ],
    },
  });
  return Number(count);
}
export async function getAssignedTicketCount(
  projectId: ID,
  userId: ID,
): Promise<number> {
  const client = await getClient();
  const count = await client.aOSProjectTask.count({
    where: {
      typeSelect: TYPE_SELECT.TICKET,
      project: {
        id: projectId,
      },
      status: {
        isCompleted: false,
      },
      assignedTo: {
        id: userId,
      },
    },
  });
  return Number(count);
}
export async function getCreatedTicketCount(
  projectId: ID,
  userId: ID,
): Promise<number> {
  const client = await getClient();
  const count = await client.aOSProjectTask.count({
    where: {
      typeSelect: TYPE_SELECT.TICKET,
      project: {
        id: projectId,
      },
      status: {
        isCompleted: false,
      },
      createdBy: {
        id: userId,
      },
    },
  });
  return Number(count);
}
export async function getResolvedTicketCount(projectId: ID): Promise<number> {
  const client = await getClient();
  const count = await client.aOSProjectTask.count({
    where: {
      typeSelect: TYPE_SELECT.TICKET,
      project: {
        id: projectId,
      },
      status: {
        isCompleted: true,
      },
    },
  });
  return Number(count);
}
export async function findTickets(props: TicketProps<AOSProjectTask>) {
  const {projectId, take, skip, where, orderBy} = props;
  const client = await getClient();
  const tickets = await client.aOSProjectTask.find({
    ...(take ? {take} : {}),
    ...(skip ? {skip} : {}),
    ...(orderBy ? {orderBy} : {}),
    where: {
      project: {
        id: projectId,
      },
      typeSelect: TYPE_SELECT.TICKET,
      ...where,
    },
    select: {
      name: true,
      updatedOn: true,
      assignment: true,
      contact: {
        name: true,
      },
      status: {
        name: true,
      },
      projectTaskCategory: {
        name: true,
      },
      priority: {
        name: true,
      },
      project: {
        name: true,
      },
      assignedTo: {
        name: true,
      },
    },
  });
  return tickets;
}
export async function findTicket(ticketId: ID, projectId: ID) {
  const client = await getClient();
  const ticket = await client.aOSProjectTask.findOne({
    where: {
      id: ticketId,
      typeSelect: TYPE_SELECT.TICKET,
      project: {id: projectId},
    },
    select: {
      name: true,
      version: true,
      progress: true,
      description: true,
      taskDate: true,
      taskEndDate: true,
      childTasks: {
        select: {
          name: true,
          updatedOn: true,
          status: {
            name: true,
          },
          projectTaskCategory: {
            name: true,
          },
          priority: {
            name: true,
          },
          project: {
            name: true,
          },
          assignedTo: {
            name: true,
          },
        },
      },
      parentTask: {
        name: true,
        updatedOn: true,
        status: {
          name: true,
        },
        projectTaskCategory: {
          name: true,
        },
        priority: {
          name: true,
        },
        project: {
          name: true,
        },
        assignedTo: {
          name: true,
        },
      },
      project: {
        name: true,
      },
      projectTaskCategory: {
        name: true,
      },
      priority: {
        name: true,
      },
      assignedTo: {
        name: true,
      },
      status: {
        name: true,
      },
      assignment: true,
    },
  });

  return ticket;
}

export async function findTicketInfo(ticketId: ID, projectId: ID) {
  const client = await getClient();
  const ticket = await client.aOSProjectTask.findOne({
    where: {
      typeSelect: TYPE_SELECT.TICKET,
      id: ticketId,
      project: {id: projectId},
    },
    select: {
      name: true,
      version: true,
      description: true,
      projectTaskCategory: {
        name: true,
      },
      priority: {
        name: true,
      },
    },
  });

  return ticket;
}

export async function assignTicketToSupplier(id: string, version: number) {
  const client = await getClient();

  const ticket = await client.aOSProjectTask.update({
    data: {
      id,
      version,
      assignment: ASSIGNMENT.PROVIDER,
    },
  });

  return ticket;
}

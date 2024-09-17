/**
 * Tickets ORM API
 */

import {ORDER_BY} from '@/constants';
import {getClient} from '@/goovee';
import {AOSProjectTask} from '@/goovee/.generated/models';
import {i18n} from '@/lib/i18n';
import {Entity, ID} from '@goovee/orm';
import axios from 'axios';

import {
  ASSIGNMENT,
  INVOICING_TYPE,
  TYPE_SELECT,
  VERSION_MISMATCH_CAUSE_CLASS,
  VERSION_MISMATCH_ERROR,
} from '../constants';
import {CreateTicketInfo, UpdateTicketInfo} from '../ui/components/ticket-form';
import {
  getProjectAccessFilter,
  getTicketAccessFilter,
  QueryProps,
} from './helpers';

export type TicketProps<T extends Entity> = QueryProps<T> & {
  projectId: ID;
};

async function hasTicketAccess(
  ticketId: ID,
  userId: ID,
  workspaceId: ID,
): Promise<boolean> {
  const client = await getClient();
  const ticket = await client.aOSProjectTask.findOne({
    where: {
      id: ticketId,
      project: {
        ...getProjectAccessFilter({userId, workspaceId}),
      },
      ...getTicketAccessFilter(),
    },
    select: {
      id: true,
    },
  });
  return !!ticket;
}

export async function createTicket(
  data: CreateTicketInfo,
  userId: ID,
  workspaceId: ID,
) {
  const {priority, subject, description, category, project: projectId} = data;
  const client = await getClient();
  const project = await client.aOSProject.findOne({
    where: {
      id: projectId,
      ...getProjectAccessFilter({userId, workspaceId}),
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
      requestedByContact: {select: {id: userId}},
      assignedToContact: {select: {id: userId}},
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

export async function updateTicketViaWS(
  data: UpdateTicketInfo,
  userId: ID,
  workspaceId: ID,
) {
  const {
    priority,
    subject,
    description,
    category,
    status,
    assignment,
    id,
    version,
  } = data;

  if (!(await hasTicketAccess(id, userId, workspaceId))) {
    // To make sure the user has access to the ticket.
    throw new Error(i18n.get('Ticket not found'));
  }

  const aos = process.env.NEXT_PUBLIC_AOS_URL;

  if (!aos) throw new Error(i18n.get('Rest API URL not set'));

  const ws = `${aos}/ws/rest/com.axelor.apps.project.db.ProjectTask`;

  const res = await axios
    .post(
      ws,
      {
        data: {
          id,
          version,
          name: subject,
          description: description,
          ...(category && {
            projectTaskCategory: {
              id: category,
            },
          }),
          ...(priority && {
            priority: {
              id: priority,
            },
          }),
          ...(status && {
            status: {
              id: status,
            },
          }),
          ...(assignment && {
            assignment: assignment,
          }),
        },
        fields: ['project'],
      },
      {
        auth: {
          username: process.env.BASIC_AUTH_USERNAME as string,
          password: process.env.BASIC_AUTH_PASSWORD as string,
        },
      },
    )
    .then(({data}) => data);

  if (!res.data || res?.status === -1) {
    if (res.data?.causeClass === VERSION_MISMATCH_CAUSE_CLASS) {
      const e = new Error(res.data.message);
      e.name = VERSION_MISMATCH_ERROR;
      throw e;
    }
    throw new Error(i18n.get('Failed to update ticket'));
  }

  return res.data;
}

export async function updateTicket(
  data: UpdateTicketInfo,
  userId: ID,
  workspaceId: ID,
) {
  const {
    priority,
    subject,
    description,
    category,
    status,
    assignment,
    id,
    version,
  } = data;
  const client = await getClient();

  if (!(await hasTicketAccess(id, userId, workspaceId))) {
    // To make sure the user has access to the ticket.
    throw new Error(i18n.get('Ticket not found'));
  }

  const ticket = await client.aOSProjectTask.update({
    data: {
      id,
      version,
      updatedOn: new Date(),
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
      ...(status && {
        status: {
          select: {
            id: status,
          },
        },
      }),
      ...(assignment && {
        assignment: assignment,
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
      ...getTicketAccessFilter(),
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
      ...getTicketAccessFilter(),
      project: {
        id: projectId,
      },
      status: {
        isCompleted: false,
      },
      OR: [
        {
          assignedToContact: {
            id: userId,
          },
        },
        {
          requestedByContact: {
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
      ...getTicketAccessFilter(),
      project: {
        id: projectId,
      },
      status: {
        isCompleted: false,
      },
      assignedToContact: {
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
      ...getTicketAccessFilter(),
      project: {
        id: projectId,
      },
      status: {
        isCompleted: false,
      },
      requestedByContact: {
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
      ...getTicketAccessFilter(),
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
      ...getTicketAccessFilter(),
      project: {
        id: projectId,
      },
      ...where,
    },
    select: {
      name: true,
      updatedOn: true,
      assignment: true,
      assignedToContact: {
        name: true,
        picture: {
          id: true,
        },
      },
      requestedByContact: {
        name: true,
        picture: {
          id: true,
        },
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
        company: {
          name: true,
          logo: {
            id: true,
          },
        },
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
      project: {id: projectId},
      ...getTicketAccessFilter(),
    },
    select: {
      name: true,
      targetVersion: {
        title: true,
      },
      progress: true,
      quantity: true,
      unitPrice: true,
      invoicingUnit: {
        name: true,
      },
      description: true,
      taskDate: true,
      taskEndDate: true,
      displayFinancialData: true,
      attrs: true,
      assignedToContact: {
        name: true,
        picture: {
          id: true,
        },
      },
      requestedByContact: {
        name: true,
        picture: {
          id: true,
        },
      },
      projectTaskLinkList: {
        select: {
          relatedTask: {
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
              company: {
                name: true,
                logo: {
                  id: true,
                },
              },
            },
            assignedTo: {
              name: true,
            },
            assignedToContact: {
              name: true,
              picture: {
                id: true,
              },
            },
            requestedByContact: {
              name: true,
              picture: {
                id: true,
              },
            },
          },
        },
      },
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
            company: {
              name: true,
              logo: {
                id: true,
              },
            },
          },
          assignedTo: {
            name: true,
          },
          assignedToContact: {
            name: true,
            picture: {
              id: true,
            },
          },
          requestedByContact: {
            name: true,
            picture: {
              id: true,
            },
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
          company: {
            name: true,
            logo: {
              id: true,
            },
          },
        },
        assignedTo: {
          name: true,
        },
        assignedToContact: {
          name: true,
          picture: {
            id: true,
          },
        },
        requestedByContact: {
          name: true,
          picture: {
            id: true,
          },
        },
      },
      project: {
        name: true,
        company: {
          name: true,
          logo: {
            id: true,
          },
        },
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
        isCompleted: true,
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
      ...getTicketAccessFilter(),
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

export async function findTicketVersion(ticketId: ID) {
  const client = await getClient();
  const ticket = await client.aOSProjectTask.findOne({
    where: {
      id: ticketId,
    },
    select: {
      version: true,
    },
  });
  if (!ticket) {
    throw new Error('Ticket not found');
  }
  return ticket.version;
}

export async function findTicketsBySearch(
  search: string,
  userId: ID,
  workspaceId: ID,
  projectId?: ID,
) {
  const client = await getClient();
  const tickets = await client.aOSProjectTask.find({
    where: {
      project: {
        ...(projectId && {id: projectId}),
        ...getProjectAccessFilter({userId, workspaceId}),
      },
      ...getTicketAccessFilter(),
      OR: [
        {
          name: {
            like: `%${search}%`,
          },
        },
        {
          description: {
            like: `%${search}%`,
          },
        },
      ],
    },
    take: 10,
    select: {
      name: true,
    },
  });
  return tickets;
}

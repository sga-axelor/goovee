/**
 * Tickets ORM API
 */

import {ORDER_BY} from '@/constants';
import {getClient} from '@/goovee';
import type {AOSProjectTask} from '@/goovee/.generated/models';
import {i18n} from '@/lib/i18n';
import {addComment} from '@/orm/comment';
import {ModelType} from '@/types';
import {sql} from '@/utils/template-string';
import type {Entity, ID, SelectOptions} from '@goovee/orm';
import axios from 'axios';

import {
  ASSIGNMENT,
  INVOICING_TYPE,
  TYPE_SELECT,
  VERSION_MISMATCH_CAUSE_CLASS,
  VERSION_MISMATCH_ERROR,
} from '../constants';
import type {CreateTicketInfo, UpdateTicketInfo} from '../utils/validators';
import type {QueryProps} from './helpers';
import {getProjectAccessFilter, getTicketAccessFilter} from './helpers';
import {
  ChildTicket,
  LinkType,
  ParentTicket,
  Ticket,
  TicketLink,
  TicketListTicket,
  TicketSearch,
} from '../types';

export type TicketProps<T extends Entity> = QueryProps<T> & {
  projectId: ID;
};

type Track = {
  name: string;
  title: string;
  value: string;
  oldValue?: string;
};

export async function findTicketAccess({
  recordId: ticketId,
  userId,
  workspaceId,
  select,
}: {
  recordId: ID;
  userId: ID;
  workspaceId: ID;
  select?: SelectOptions<AOSProjectTask>;
}) {
  const client = await getClient();
  const ticket = await client.aOSProjectTask.findOne({
    where: {
      id: ticketId,
      project: {...getProjectAccessFilter({userId, workspaceId})},
      ...getTicketAccessFilter(),
    },
    select: {id: true, ...select},
  });
  return ticket;
}

export async function createTicket({
  data,
  userId,
  workspaceId,
  workspaceURL,
}: {
  data: CreateTicketInfo;
  userId: ID;
  workspaceId: ID;
  workspaceURL: string;
}) {
  const {
    priority,
    subject,
    description,
    category,
    project: projectId,
    managedBy,
    parentId,
  } = data;

  const client = await getClient();
  const project = await client.aOSProject.findOne({
    where: {
      id: projectId,
      ...getProjectAccessFilter({userId, workspaceId}),
    },
    select: {
      assignedTo: {id: true},
      projectTaskStatusSet: {
        select: {id: true},
        take: 1,
        orderBy: {sequence: ORDER_BY.ASC},
      } as unknown as {select: {id: true}}, // type cast to prevent orm type error
    },
  });

  if (!project) {
    throw new Error(i18n.get('Project not found'));
  }

  if (parentId) {
    const parentTicket = await findTicketAccess({
      recordId: parentId,
      userId,
      workspaceId,
      select: {
        project: {id: true},
      },
    });
    if (!parentTicket) {
      throw new Error(i18n.get('Parent ticket not found'));
    }
    if (parentTicket?.project?.id !== projectId) {
      throw new Error(i18n.get('Parent ticket not in this project'));
    }
  }

  const manager = project.assignedTo?.id;
  const defaultStatus = project?.projectTaskStatusSet?.[0]?.id;

  let ticketWithoutFullName = await client.aOSProjectTask.create({
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
      project: {select: {id: projectId}},
      name: subject,
      description: description,
      ...(managedBy && {assignedToContact: {select: {id: managedBy}}}),
      ...(defaultStatus && {status: {select: {id: defaultStatus}}}),
      ...(category && {projectTaskCategory: {select: {id: category}}}),
      ...(manager && {assignedTo: {select: {id: manager}}}),
      ...(priority && {priority: {select: {id: priority}}}),
      ...(parentId && {parentTask: {select: {id: parentId}}}),
    },
    select: {name: true},
  });

  const ticket = await client.aOSProjectTask.update({
    data: {
      id: ticketWithoutFullName.id,
      version: ticketWithoutFullName.version,
      fullName: `#${ticketWithoutFullName.id} ${ticketWithoutFullName.name}`,
      updatedOn: new Date(),
    },
    select: {
      name: true,
      taskDate: true,
      assignment: true,
      typeSelect: true,
      invoicingType: true,
      isPrivate: true,
      progress: true,
      requestedByContact: {name: true},
      project: {name: true},
      ...(managedBy && {assignedToContact: {name: true}}),
      ...(category && {projectTaskCategory: {name: true}}),
      ...(priority && {priority: {name: true}}),
      ...(defaultStatus && {status: {name: true}}),
      ...(manager && {assignedTo: {name: true}}),
    },
  });

  const tracks: Track[] = [
    {name: 'name', title: 'Subject', value: ticket.name},
    {
      name: 'assignment',
      title: 'Assignment',
      value: ticket.assignment?.toString() ?? '',
    },
    {name: 'typeSelect', title: 'Type', value: ticket.typeSelect ?? ''},
    {name: 'isPrivate', title: 'Private', value: String(ticket.isPrivate)},
    {name: 'progress', title: 'Progress', value: ticket.progress ?? ''},
    {name: 'project', title: 'Project', value: ticket.project?.name ?? ''},
    {
      name: 'taskDate',
      title: 'Task Date',
      value: String(ticket.taskDate) ?? '', //NOTE: ORM type is Date , but it is sending string,
    },
    {
      name: 'invoicingType',
      title: 'Invoicing Type',
      value: String(ticket.invoicingType),
    },
    {
      name: 'requestedByContact',
      title: 'Requested By',
      value: ticket.requestedByContact?.name ?? '',
    },
  ];

  if (category) {
    tracks.push({
      name: 'projectTaskCategory',
      title: 'Category',
      value: ticket.projectTaskCategory?.name ?? '',
    });
  }

  if (priority) {
    tracks.push({
      name: 'priority',
      title: 'Priority',
      value: ticket.priority?.name ?? '',
    });
  }

  if (defaultStatus) {
    tracks.push({
      name: 'status',
      title: 'Status',
      value: ticket.status?.name ?? '',
    });
  }

  if (managedBy) {
    tracks.push({
      name: 'assignedToContact',
      title: 'AssignedToContact',
      value: ticket.assignedToContact?.name ?? '',
    });
  }
  try {
    await addComment({
      workspaceURL,
      type: ModelType.ticketing,
      model: {id: ticket.id},
      messageBody: {title: 'Record Created', tracks: tracks, tags: []},
    });
  } catch (e) {
    console.log('Error adding comment');
    console.error(e);
  }
  return ticket;
}

export async function updateTicketByWS({
  data,
  userId,
  workspaceId,
}: {
  data: UpdateTicketInfo;
  userId: ID;
  workspaceId: ID;
}) {
  const {
    priority,
    subject,
    description,
    category,
    status,
    assignment,
    managedBy,
    id,
    version,
  } = data;

  if (!(await findTicketAccess({recordId: id, userId, workspaceId}))) {
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
          ...(category && {projectTaskCategory: {id: category}}),
          ...(priority && {priority: {id: priority}}),
          ...(status && {status: {id: status}}),
          ...(assignment && {assignment: assignment}),
          ...(managedBy && {assignedToContact: {select: {id: managedBy}}}),
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

export async function updateTicket({
  data,
  userId,
  workspaceId,
  workspaceURL,
}: {
  data: UpdateTicketInfo;
  userId: ID;
  workspaceId: ID;
  workspaceURL: string;
}) {
  const {
    priority,
    subject,
    description,
    category,
    status,
    assignment,
    managedBy,
    id,
    version,
  } = data;
  const client = await getClient();

  const select: SelectOptions<AOSProjectTask> = {
    ...(subject != null && {name: true}),
    ...(category && {projectTaskCategory: {name: true}}),
    ...(priority && {priority: {name: true}}),
    ...(status && {status: {name: true}}),
    ...(assignment && {assignment: true}),
    ...(managedBy && {assignedToContact: {name: true}}),
  };

  const oldTicket = await findTicketAccess({
    recordId: id,
    userId,
    workspaceId,
    select,
  });
  if (!oldTicket) {
    // To make sure the user has access to the ticket.
    throw new Error(i18n.get('Ticket not found'));
  }

  const ticket = await client.aOSProjectTask.update({
    data: {
      id,
      version,
      updatedOn: new Date(),
      description: description,
      ...(subject != null && {name: subject, fullName: `#${id} ${subject}`}),
      ...(category && {projectTaskCategory: {select: {id: category}}}),
      ...(priority && {priority: {select: {id: priority}}}),
      ...(status && {status: {select: {id: status}}}),
      ...(assignment && {assignment: assignment}),
      ...(managedBy && {assignedToContact: {select: {id: managedBy}}}),
    },
    select: {
      id: true,
      project: {id: true},
      ...select,
    },
  });

  const tracks: Track[] = [];

  if (subject != null && oldTicket.name !== ticket.name) {
    tracks.push({
      name: 'name',
      title: 'Subject',
      value: ticket.name,
      ...(oldTicket.name && {oldValue: oldTicket.name}),
    });
  }
  if (
    category &&
    oldTicket.projectTaskCategory?.name !== ticket.projectTaskCategory?.name
  ) {
    tracks.push({
      name: 'projectTaskCategory',
      title: 'Category',
      value: ticket.projectTaskCategory?.name ?? '',
      ...(oldTicket.projectTaskCategory?.name && {
        oldValue: oldTicket.projectTaskCategory.name,
      }),
    });
  }
  if (priority && oldTicket.priority?.name !== ticket.priority?.name) {
    tracks.push({
      name: 'priority',
      title: 'Priority',
      value: ticket.priority?.name ?? '',
      ...(oldTicket.priority?.name && {oldValue: oldTicket.priority.name}),
    });
  }

  if (status && oldTicket.status?.name !== ticket.status?.name) {
    tracks.push({
      name: 'status',
      title: 'Status',
      value: ticket.status?.name ?? '',
      ...(oldTicket.status?.name && {oldValue: oldTicket.status.name}),
    });
  }

  if (assignment && oldTicket.assignment !== ticket.assignment) {
    tracks.push({
      name: 'assignment',
      title: 'Assignment',
      value: ticket.assignment?.toString() ?? '',
      ...(oldTicket.assignment && {oldValue: oldTicket.assignment.toString()}),
    });
  }

  if (
    managedBy &&
    oldTicket.assignedToContact?.name !== ticket.assignedToContact?.name
  ) {
    tracks.push({
      name: 'assignedToContact',
      title: 'AssignedToContact',
      value: ticket.assignedToContact?.name ?? '',
      ...(oldTicket.assignedToContact?.name && {
        oldValue: oldTicket.assignedToContact.name,
      }),
    });
  }

  try {
    await addComment({
      workspaceURL,
      type: ModelType.ticketing,
      model: {id: ticket.id},
      messageBody: {title: 'Record Updated', tracks: tracks, tags: []},
    });
  } catch (e) {
    console.log('Error adding comment');
    console.error(e);
  }

  return ticket;
}

export async function getAllTicketCount({
  projectId,
}: {
  projectId: ID;
}): Promise<number> {
  const client = await getClient();
  const count = await client.aOSProjectTask.count({
    where: {
      ...getTicketAccessFilter(),
      project: {id: projectId},
      status: {isCompleted: false},
    },
  });
  return Number(count);
}

export async function getMyTicketCount({
  projectId,
  userId,
}: {
  projectId: ID;
  userId: ID;
}): Promise<number> {
  const client = await getClient();
  const count = await client.aOSProjectTask.count({
    where: {
      ...getTicketAccessFilter(),
      project: {id: projectId},
      status: {isCompleted: false},
      OR: [
        {assignedToContact: {id: userId}},
        {requestedByContact: {id: userId}},
      ],
    },
  });
  return Number(count);
}

export async function getManagedTicketCount({
  projectId,
  userId,
}: {
  projectId: ID;
  userId: ID;
}): Promise<number> {
  const client = await getClient();
  const count = await client.aOSProjectTask.count({
    where: {
      ...getTicketAccessFilter(),
      project: {id: projectId},
      status: {isCompleted: false},
      assignedToContact: {id: userId},
    },
  });
  return Number(count);
}

export async function getCreatedTicketCount({
  projectId,
  userId,
}: {
  projectId: ID;
  userId: ID;
}): Promise<number> {
  const client = await getClient();
  const count = await client.aOSProjectTask.count({
    where: {
      ...getTicketAccessFilter(),
      project: {id: projectId},
      status: {isCompleted: false},
      requestedByContact: {id: userId},
    },
  });
  return Number(count);
}
export async function getResolvedTicketCount({
  projectId,
}: {
  projectId: ID;
}): Promise<number> {
  const client = await getClient();
  const count = await client.aOSProjectTask.count({
    where: {
      ...getTicketAccessFilter(),
      project: {id: projectId},
      status: {isCompleted: true},
    },
  });
  return Number(count);
}

export async function findTickets(
  props: TicketProps<AOSProjectTask>,
): Promise<TicketListTicket[]> {
  const {projectId, take, skip, where, orderBy} = props;
  const client = await getClient();
  const tickets = await client.aOSProjectTask.find({
    ...(take ? {take} : {}),
    ...(skip ? {skip} : {}),
    ...(orderBy ? {orderBy} : {}),
    where: {
      ...getTicketAccessFilter(),
      project: {id: projectId},
      ...where,
    },
    select: {
      name: true,
      updatedOn: true,
      assignment: true,
      assignedToContact: {simpleFullName: true, picture: {id: true}},
      requestedByContact: {simpleFullName: true, picture: {id: true}},
      status: {name: true},
      projectTaskCategory: {name: true},
      priority: {name: true},
      project: {
        name: true,
        company: {name: true, logo: {id: true}},
        clientPartner: {simpleFullName: true},
      },
      assignedTo: {name: true},
    },
  });
  return tickets;
}

export async function findRelatedTicketLinks(
  ticketId: ID,
): Promise<TicketLink[] | undefined> {
  const client = await getClient();
  const ticket = await client.aOSProjectTask.findOne({
    where: {id: ticketId},
    select: {
      projectTaskLinkList: {
        select: {
          projectTaskLinkType: {name: true},
          relatedTask: {
            name: true,
            updatedOn: true,
            status: {name: true},
            projectTaskCategory: {name: true},
            priority: {name: true},
            project: {
              name: true,
              company: {name: true, logo: {id: true}},
              clientPartner: {simpleFullName: true},
            },
            assignedTo: {name: true},
            assignedToContact: {simpleFullName: true, picture: {id: true}},
            requestedByContact: {simpleFullName: true, picture: {id: true}},
            assignment: true,
          },
        },
      },
    },
  });
  return ticket?.projectTaskLinkList;
}

export async function findChildTickets(ticketId: ID): Promise<ChildTicket[]> {
  const client = await getClient();
  const tickets = await client.aOSProjectTask.find({
    where: {
      parentTask: {
        id: ticketId,
      },
    },
    select: {
      name: true,
      updatedOn: true,
      status: {name: true},
      projectTaskCategory: {name: true},
      priority: {name: true},
      project: {
        name: true,
        company: {name: true, logo: {id: true}},
        clientPartner: {simpleFullName: true},
      },
      assignedTo: {name: true},
      assignedToContact: {simpleFullName: true, picture: {id: true}},
      requestedByContact: {simpleFullName: true, picture: {id: true}},
      assignment: true,
    },
  });
  return tickets;
}

export async function findParentTicket(
  ticketId: ID,
): Promise<ParentTicket | undefined> {
  const client = await getClient();
  const ticket = await client.aOSProjectTask.findOne({
    where: {
      id: ticketId,
    },
    select: {
      parentTask: {
        name: true,
        updatedOn: true,
        status: {name: true},
        projectTaskCategory: {name: true},
        priority: {name: true},
        project: {
          name: true,
          company: {name: true, logo: {id: true}},
          clientPartner: {simpleFullName: true},
        },
        assignedTo: {name: true},
        assignedToContact: {simpleFullName: true, picture: {id: true}},
        requestedByContact: {simpleFullName: true, picture: {id: true}},
        assignment: true,
      },
    },
  });
  return ticket?.parentTask;
}

export async function findTicket({
  ticketId,
  projectId,
}: {
  ticketId: ID;
  projectId: ID;
}): Promise<Ticket | null> {
  const client = await getClient();
  const ticket = await client.aOSProjectTask.findOne({
    where: {
      id: ticketId,
      project: {id: projectId},
      ...getTicketAccessFilter(),
    },
    select: {
      name: true,
      targetVersion: {title: true},
      progress: true,
      quantity: true,
      unitPrice: true,
      invoicingType: true,
      invoicingUnit: {name: true},
      description: true,
      taskEndDate: true,
      displayFinancialData: true,
      assignedToContact: {simpleFullName: true, picture: {id: true}},
      requestedByContact: {simpleFullName: true, picture: {id: true}},
      createdOn: true,
      project: {
        name: true,
        company: {name: true, logo: {id: true}},
        clientPartner: {simpleFullName: true},
      },
      projectTaskCategory: {name: true},
      priority: {name: true},
      assignedTo: {name: true},
      status: {name: true, isCompleted: true},
      assignment: true,
    },
  });

  return ticket;
}

export async function findTicketVersion(ticketId: ID): Promise<number> {
  const client = await getClient();
  const ticket = await client.aOSProjectTask.findOne({
    where: {id: ticketId},
    select: {version: true},
  });
  if (!ticket) {
    throw new Error('Ticket not found');
  }
  return ticket.version;
}

export async function findTicketsBySearch(props: {
  search?: string;
  userId: ID;
  workspaceId: ID;
  projectId?: ID;
  excludeList?: ID[];
}): Promise<TicketSearch[]> {
  const {search, userId, workspaceId, projectId, excludeList} = props;
  const client = await getClient();
  const tickets = await client.aOSProjectTask.find({
    where: {
      project: {
        ...(projectId && {id: projectId}),
        ...getProjectAccessFilter({userId, workspaceId}),
      },
      ...getTicketAccessFilter(),
      ...(search && {
        OR: [
          {fullName: {like: `%${search}%`}},
          {description: {like: `%${search}%`}},
        ],
      }),
      ...(Boolean(excludeList?.length) && {
        id: {notIn: excludeList},
      }),
    },
    take: 10,
    select: {fullName: true},
  });
  return tickets;
}

export async function findParentTicketIds(ticketId: ID): Promise<string[]> {
  const client = await getClient();

  const res = await client.$raw(
    sql`
      WITH RECURSIVE
        parent_tickets AS (
          -- Base case: Select the initial ticket's parent
          SELECT
            id,
            parent_task,
            ARRAY[id] AS visited_ids -- Track visited tickets
          FROM
            project_project_task
          WHERE
            id = $1
          UNION ALL
          -- Recursive step: Select the parent of the current ticket
          SELECT
            pt.id,
            pt.parent_task,
            visited_ids || pt.id -- Append the current ticket to the visited list
          FROM
            project_project_task pt
            INNER JOIN parent_tickets p ON pt.id = p.parent_task
          WHERE
            pt.id IS NOT NULL
            AND NOT pt.id = ANY (p.visited_ids) -- Prevent circular reference
        )
      SELECT
        ARRAY_AGG(parent_task) AS ids
      FROM
        parent_tickets
      WHERE
        parent_task IS NOT NULL;
    `,
    ticketId,
  );

  if (Array.isArray(res)) {
    const parentTickets = res[0]?.ids;
    return parentTickets ?? [];
  }
  return [];
}

export async function findChildTicketIds(ticketId: ID): Promise<string[]> {
  const client = await getClient();

  const res = await client.$raw(
    sql`
      WITH RECURSIVE
        child_tickets AS (
          -- Base case: Select the initial ticket
          SELECT
            id,
            parent_task,
            ARRAY[id] AS visited_ids -- Track visited tickets
          FROM
            project_project_task
          WHERE
            id = $1
          UNION ALL
          -- Recursive step: Select the child tickets where the current ticket is the parent
          SELECT
            pt.id,
            pt.parent_task,
            visited_ids || pt.id -- Append the current ticket to the visited list
          FROM
            project_project_task pt
            INNER JOIN child_tickets ct ON pt.parent_task = ct.id
          WHERE
            pt.id IS NOT NULL
            AND NOT pt.id = ANY (ct.visited_ids) -- Prevent circular reference
        )
      SELECT
        ARRAY_AGG(id) AS ids
      FROM
        child_tickets
      WHERE
        -- Exclude the initial ticket itself from the results
        id != $1;
    `,
    ticketId,
  );

  if (Array.isArray(res)) {
    const childTickets = res[0]?.ids;
    return childTickets ?? [];
  }

  return [];
}

export async function createChildTicketLink({
  data,
  userId,
  workspaceId,
}: {
  data: {currentTicketId: ID; linkTicketId: ID};
  userId: ID;
  workspaceId: ID;
}) {
  const {currentTicketId, linkTicketId} = data;
  const client = await getClient();

  const [currentTicket, linkTicket] = await Promise.all([
    findTicketAccess({recordId: currentTicketId, userId, workspaceId}),
    findTicketAccess({recordId: linkTicketId, userId, workspaceId}),
  ]);

  if (!currentTicket || !linkTicket) {
    // To make sure the user has access to the ticket.
    throw new Error(i18n.get('Ticket not found'));
  }

  const parentTickets = await findParentTicketIds(currentTicketId);
  if (parentTickets.includes(linkTicketId.toString())) {
    throw new Error(i18n.get('Circular dependency'));
  }

  const ticket = await client.aOSProjectTask.update({
    data: {
      id: currentTicketId.toString(),
      version: currentTicket.version, //TODO: get the version from client
      childTasks: {select: {id: linkTicketId}},
    },
    select: {id: true},
  });
  return ticket;
}

export async function deleteChildTicketLink({
  data,
  userId,
  workspaceId,
}: {
  data: {currentTicketId: ID; linkTicketId: ID};
  userId: ID;
  workspaceId: ID;
}) {
  const {currentTicketId, linkTicketId} = data;
  const client = await getClient();

  const [currentTicket, linkTicket] = await Promise.all([
    findTicketAccess({recordId: currentTicketId, userId, workspaceId}),
    findTicketAccess({recordId: linkTicketId, userId, workspaceId}),
  ]);

  if (!currentTicket || !linkTicket) {
    // To make sure the user has access to the ticket.
    throw new Error(i18n.get('Ticket not found'));
  }

  const ticket = await client.aOSProjectTask.update({
    data: {
      id: currentTicketId.toString(),
      version: currentTicket.version, //TODO: get the version from client
      childTasks: {remove: linkTicketId},
    },
    select: {id: true},
  });
  return ticket;
}

export async function createParentTicketLink({
  data,
  userId,
  workspaceId,
}: {
  data: {currentTicketId: ID; linkTicketId: ID};
  userId: ID;
  workspaceId: ID;
}) {
  const {currentTicketId, linkTicketId} = data;
  const client = await getClient();

  const [currentTicket, linkTicket] = await Promise.all([
    findTicketAccess({recordId: currentTicketId, userId, workspaceId}),
    findTicketAccess({recordId: linkTicketId, userId, workspaceId}),
  ]);

  if (!currentTicket || !linkTicket) {
    // To make sure the user has access to the ticket.
    throw new Error(i18n.get('Ticket not found'));
  }

  const childTickets = await findChildTicketIds(currentTicketId);
  if (childTickets.includes(linkTicketId.toString())) {
    throw new Error(i18n.get('Circular dependency'));
  }

  const ticket = await client.aOSProjectTask.update({
    data: {
      id: currentTicketId.toString(),
      version: currentTicket.version, //TODO: get the version from client
      parentTask: {select: {id: linkTicketId}},
    },
    select: {id: true},
  });
  return ticket;
}

export async function deleteParentTicketLink({
  data,
  userId,
  workspaceId,
}: {
  data: {currentTicketId: ID; linkTicketId: ID};
  userId: ID;
  workspaceId: ID;
}) {
  const {currentTicketId, linkTicketId} = data;
  const client = await getClient();

  const [currentTicket, linkTicket] = await Promise.all([
    findTicketAccess({recordId: currentTicketId, userId, workspaceId}),
    findTicketAccess({recordId: linkTicketId, userId, workspaceId}),
  ]);

  if (!currentTicket || !linkTicket) {
    // To make sure the user has access to the ticket.
    throw new Error(i18n.get('Ticket not found'));
  }

  const ticket = await client.aOSProjectTask.update({
    data: {
      id: linkTicketId.toString(),
      version: linkTicket.version, //TODO: get the version from client
      childTasks: {remove: currentTicketId},
    },
    select: {id: true},
  });
  return ticket;
}

export async function findTicketLinkTypes(projectId?: ID): Promise<LinkType[]> {
  const client = await getClient();
  if (projectId) {
    const project = await client.aOSProject.findOne({
      where: {id: projectId},
      select: {projectTaskLinkTypeSet: {select: {name: true}}},
    });
    if (project?.projectTaskLinkTypeSet?.length) {
      return project.projectTaskLinkTypeSet;
    }
  }
  const links = await client.aOSProjectTaskLinkType.find({
    select: {name: true},
  });
  return links;
}

export async function createRelatedTicketLink({
  data,
  userId,
  workspaceId,
}: {
  data: {currentTicketId: ID; linkTicketId: ID; linkType: ID};
  userId: ID;
  workspaceId: ID;
}): Promise<[string, string]> {
  const {currentTicketId, linkTicketId, linkType} = data;
  const client = await getClient();
  const [currentTicket, linkTicket] = await Promise.all([
    findTicketAccess({
      recordId: currentTicketId,
      userId,
      workspaceId,
      select: {
        name: true,
        project: {name: true, projectTaskLinkTypeSet: {select: {id: true}}},
      },
    }),
    findTicketAccess({
      recordId: linkTicketId,
      userId,
      workspaceId,
      select: {
        name: true,
        project: {name: true, projectTaskLinkTypeSet: {select: {id: true}}},
      },
    }),
  ]);
  if (!currentTicket || !linkTicket) {
    // To make sure the user has access to the ticket.
    throw new Error(i18n.get('Ticket not found'));
  }

  if (currentTicket.project?.id !== linkTicket.project?.id) {
    // This is enabled as per #85205
    // remove this check to enable cross project linking
    throw new Error(i18n.get('Cross project linking not allowed'));
  }

  const type = await client.aOSProjectTaskLinkType.findOne({
    where: {id: linkType},
    select: {name: true, oppositeLinkType: {id: true, name: true}},
  });

  if (!type) {
    throw new Error(i18n.get('Invalid link type'));
  }
  const currentTicketLinkTypes = currentTicket.project?.projectTaskLinkTypeSet;
  const linkTicketLinkTypes = linkTicket.project?.projectTaskLinkTypeSet;

  //NOTE: if the project has configured to use certain linkTypes , then only those linkTypes are allowed.
  //if not then all linkTypes are allowed

  if (currentTicketLinkTypes?.length) {
    const hasTypeAccess = currentTicketLinkTypes.some(
      link => link.id === type.id,
    );
    if (!hasTypeAccess) {
      //NOTE: this message is copied from backend
      throw new Error(
        `${i18n.get('Please configure the project')} "${currentTicket.project?.name}" ${i18n.get('with project task link type')} "${type.name}" ${i18n.get('if you want to create this link')}.`,
      );
    }
  }
  const oppositeType = type?.oppositeLinkType ?? type;

  if (linkTicketLinkTypes?.length) {
    const hasTypeAccess = linkTicketLinkTypes.some(
      link => link.id === oppositeType.id,
    );
    if (!hasTypeAccess) {
      throw new Error(
        `${i18n.get('Please configure the project')} "${linkTicket.project?.name}" ${i18n.get('with project task link type')} "${oppositeType.name}" ${i18n.get('if you want to create this link')}.`,
      );
    }
  }

  let link1 = await client.aOSProjectTaskLink.create({
    data: {
      createdOn: new Date(),
      updatedOn: new Date(),
      projectTask: {select: {id: currentTicketId}},
      relatedTask: {select: {id: linkTicketId}},
      projectTaskLinkType: {select: {id: type.id}},
    },
    select: {id: true},
  });

  const link2 = await client.aOSProjectTaskLink.create({
    data: {
      createdOn: new Date(),
      updatedOn: new Date(),
      projectTask: {select: {id: linkTicketId}},
      relatedTask: {select: {id: currentTicketId}},
      projectTaskLinkType: {select: {id: oppositeType.id}},
      projectTaskLink: {select: {id: link1.id}},
    },
    select: {id: true},
  });

  link1 = await client.aOSProjectTaskLink.update({
    data: {
      id: link1.id,
      version: link1.version,
      updatedOn: new Date(),
      projectTaskLink: {select: {id: link2.id}},
    },
    select: {id: true},
  });

  return [link1.id, link2.id];
}

export async function deleteRelatedTicketLink({
  data,
  userId,
  workspaceId,
}: {
  data: {currentTicketId: ID; linkTicketId: ID; linkId: ID};
  userId: ID;
  workspaceId: ID;
}): Promise<ID> {
  const {currentTicketId, linkTicketId, linkId} = data;
  const client = await getClient();
  const [hasCurrentTicketAccess, hasLinkTicketAccess] = await Promise.all([
    findTicketAccess({recordId: currentTicketId, userId, workspaceId}),
    findTicketAccess({recordId: linkTicketId, userId, workspaceId}),
  ]);
  if (!hasCurrentTicketAccess || !hasLinkTicketAccess) {
    // To make sure the user has access to the ticket.
    throw new Error(i18n.get('Ticket not found'));
  }

  const link = await client.aOSProjectTaskLink.findOne({
    where: {id: linkId},
    select: {projectTaskLink: {id: true}},
  });

  if (!link) {
    throw new Error(i18n.get('Link does not exist'));
  }

  const linksToDelete = [linkId];
  if (link.projectTaskLink?.id) {
    linksToDelete.push(link.projectTaskLink.id);
  }
  const deleteCount = await client.aOSProjectTaskLink.deleteAll({
    where: {id: {in: linksToDelete}},
  });
  return deleteCount;
}

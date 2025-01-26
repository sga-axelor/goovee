import axios from 'axios';

// ---- LOCAL IMPORTS ---- //
import {MAIL_MESSAGE_TYPE, ORDER_BY, SUBAPP_CODES} from '@/constants';
import type {AOSProjectTask} from '@/goovee/.generated/models';
import {t} from '@/locale/server';
import {addComment} from '@/orm/comment';
import {manager, type Tenant} from '@/tenant';
import {sql} from '@/utils/template-string';
import type {Entity, ID, SelectOptions} from '@goovee/orm';

// ---- LOCAL IMPORTS ---- //
import {
  ASSIGNMENT,
  INVOICING_TYPE,
  TYPE_SELECT,
  VERSION_MISMATCH_CAUSE_CLASS,
  VERSION_MISMATCH_ERROR,
} from '../constants';
import {
  ChildTicket,
  LinkType,
  ParentTicket,
  Ticket,
  TicketLink,
  TicketListTicket,
  TicketSearch,
} from '../types';
import type {AuthProps} from '../utils/auth-helper';
import type {CreateTicketInfo, UpdateTicketInfo} from '../utils/validators';
import type {QueryProps} from './helpers';
import {getProjectAccessFilter, withTicketAccessFilter} from './helpers';

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
  auth,
  select,
  projectId,
}: {
  recordId: ID;
  auth: AuthProps;
  projectId?: ID;
  select?: SelectOptions<AOSProjectTask>;
}) {
  if (!auth.tenantId) {
    throw new Error(await t('TenantId is required.'));
  }

  const client = await manager.getClient(auth.tenantId);

  const ticket = await client.aOSProjectTask.findOne({
    where: withTicketAccessFilter(auth)({
      id: ticketId,
      project: {
        ...(projectId && {id: projectId}),
        ...getProjectAccessFilter(auth),
      },
    }),
    select: {id: true, ...select},
  });

  return ticket;
}

export async function createTicket({
  data,
  workspaceURL,
  auth,
}: {
  data: CreateTicketInfo;
  workspaceURL: string;
  auth: AuthProps;
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

  if (!auth.tenantId) {
    throw new Error(await t('TenantId is required.'));
  }

  const client = await manager.getClient(auth.tenantId);

  const project = await client.aOSProject.findOne({
    where: {
      id: projectId,
      ...getProjectAccessFilter(auth),
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
    throw new Error(await t('Project not found'));
  }

  if (parentId) {
    const parentTicket = await findTicketAccess({
      recordId: parentId,
      select: {project: {id: true}},
      auth,
    });

    if (!parentTicket) {
      throw new Error(await t('Parent ticket not found'));
    }

    if (parentTicket?.project?.id !== projectId) {
      throw new Error(await t('Parent ticket not in this project'));
    }
  }

  const projectManager = project.assignedTo?.id;
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
      createdByContact: {select: {id: auth.userId}},
      project: {select: {id: projectId}},
      name: subject,
      description: description,
      ...(managedBy && {managedByContact: {select: {id: managedBy}}}),
      ...(defaultStatus && {status: {select: {id: defaultStatus}}}),
      ...(category && {projectTaskCategory: {select: {id: category}}}),
      ...(projectManager && {assignedTo: {select: {id: projectManager}}}),
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
      createdByContact: {name: true},
      project: {name: true},
      ...(managedBy && {managedByContact: {name: true}}),
      ...(category && {projectTaskCategory: {name: true}}),
      ...(priority && {priority: {name: true}}),
      ...(defaultStatus && {status: {name: true}}),
      ...(projectManager && {assignedTo: {name: true}}),
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
      name: 'createdByContact',
      title: 'Created by',
      value: ticket.createdByContact?.name ?? '',
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
      name: 'managedByContact',
      title: 'Managed by',
      value: ticket.managedByContact?.name ?? '',
    });
  }
  try {
    const {error, message} = await addComment({
      workspaceURL,
      subapp: SUBAPP_CODES.ticketing,
      recordId: ticket.id,
      subject: `Record Created by ${auth.simpleFullName}`,
      messageBody: {title: 'Record Created', tracks: tracks, tags: []},
      messageType: MAIL_MESSAGE_TYPE.notification,
      tenantId: auth.tenantId,
    });
    if (error) console.error(message);
  } catch (e) {
    console.error('Error adding comment');
    console.error(e);
  }
  return ticket;
}

export async function updateTicketByWS({
  data,
  auth,
}: {
  data: UpdateTicketInfo;
  auth: AuthProps;
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

  if (!(await findTicketAccess({recordId: id, auth}))) {
    // To make sure the user has access to the ticket.
    throw new Error(await t('Ticket not found'));
  }

  const aos = process.env.NEXT_PUBLIC_AOS_URL;

  if (!aos) throw new Error(await t('Rest API URL not set'));

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
          ...(managedBy && {managedByContact: {select: {id: managedBy}}}),
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
    throw new Error(await t('Failed to update ticket'));
  }

  return res.data;
}

export async function updateTicket({
  data,
  auth,
  workspaceURL,
}: {
  data: UpdateTicketInfo;
  workspaceURL: string;
  auth: AuthProps;
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

  const client = await manager.getClient(auth.tenantId);

  const select: SelectOptions<AOSProjectTask> = {
    ...(subject != null && {name: true}),
    ...(category && {projectTaskCategory: {name: true}}),
    ...(priority && {priority: {name: true}}),
    ...(status && {status: {name: true}}),
    ...(assignment && {assignment: true}),
    ...(managedBy && {managedByContact: {name: true}}),
  };

  const oldTicket = await findTicketAccess({recordId: id, select, auth});
  if (!oldTicket) {
    // To make sure the user has access to the ticket.
    throw new Error(await t('Ticket not found'));
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
      ...(managedBy && {managedByContact: {select: {id: managedBy}}}),
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
    oldTicket.managedByContact?.name !== ticket.managedByContact?.name
  ) {
    tracks.push({
      name: 'managedByContact',
      title: 'Managed by',
      value: ticket.managedByContact?.name ?? '',
      ...(oldTicket.managedByContact?.name && {
        oldValue: oldTicket.managedByContact.name,
      }),
    });
  }

  try {
    await addComment({
      workspaceURL,
      subapp: SUBAPP_CODES.ticketing,
      recordId: ticket.id,
      subject: `Record Updated by ${auth.simpleFullName}`,
      messageBody: {title: 'Record Updated', tracks: tracks, tags: []},
      messageType: MAIL_MESSAGE_TYPE.notification,
      tenantId: auth.tenantId,
    });
  } catch (e) {
    console.log('Error adding comment');
    console.error(e);
  }

  return ticket;
}

export async function getAllTicketCount(props: {
  projectId: ID;
  auth: AuthProps;
}): Promise<number> {
  const {projectId, auth} = props;
  if (!auth.tenantId) {
    throw new Error(await t('TenantId is required.'));
  }
  const client = await manager.getClient(auth.tenantId);

  const count = await client.aOSProjectTask.count({
    where: withTicketAccessFilter(auth)({
      project: {id: projectId},
      status: {isCompleted: false},
    }),
  });

  return Number(count);
}

export async function getMyTicketCount(props: {
  projectId: ID;
  auth: AuthProps;
}): Promise<number> {
  const {projectId, auth} = props;
  if (!auth.tenantId) {
    throw new Error(await t('TenantId is required.'));
  }
  const client = await manager.getClient(auth.tenantId);

  const count = await client.aOSProjectTask.count({
    where: withTicketAccessFilter(auth)({
      project: {id: projectId},
      status: {isCompleted: false},
      OR: [
        {managedByContact: {id: auth.userId}},
        {createdByContact: {id: auth.userId}},
      ],
    }),
  });
  return Number(count);
}

export async function getManagedTicketCount(props: {
  projectId: ID;
  auth: AuthProps;
}): Promise<number> {
  const {projectId, auth} = props;
  if (!auth.tenantId) {
    throw new Error(await t('TenantId is required.'));
  }
  const client = await manager.getClient(auth.tenantId);

  const count = await client.aOSProjectTask.count({
    where: withTicketAccessFilter(auth)({
      project: {id: projectId},
      status: {isCompleted: false},
      managedByContact: {id: auth.userId},
    }),
  });

  return Number(count);
}

export async function getCreatedTicketCount(props: {
  projectId: ID;
  auth: AuthProps;
}): Promise<number> {
  const {projectId, auth} = props;
  if (!auth.tenantId) {
    throw new Error(await t('TenantId is required.'));
  }
  const client = await manager.getClient(auth.tenantId);

  const count = await client.aOSProjectTask.count({
    where: withTicketAccessFilter(auth)({
      project: {id: projectId},
      status: {isCompleted: false},
      createdByContact: {id: auth.userId},
    }),
  });

  return Number(count);
}
export async function getResolvedTicketCount(props: {
  projectId: ID;
  auth: AuthProps;
}): Promise<number> {
  const {projectId, auth} = props;
  if (!auth.tenantId) {
    throw new Error(await t('TenantId is required.'));
  }
  const client = await manager.getClient(auth.tenantId);

  const count = await client.aOSProjectTask.count({
    where: withTicketAccessFilter(auth)({
      project: {id: projectId},
      status: {isCompleted: true},
    }),
  });

  return Number(count);
}

export async function findTickets(
  props: TicketProps<AOSProjectTask> & {auth: AuthProps},
): Promise<TicketListTicket[]> {
  const {projectId, take, skip, where, orderBy, auth} = props;

  if (!auth.tenantId) {
    throw new Error(await t('TenantId is required.'));
  }

  const client = await manager.getClient(auth.tenantId);

  const tickets = await client.aOSProjectTask.find({
    ...(take ? {take} : {}),
    ...(skip ? {skip} : {}),
    ...(orderBy ? {orderBy} : {}),
    where: withTicketAccessFilter(auth)({
      project: {id: projectId},
      ...where,
    }),
    select: {
      name: true,
      updatedOn: true,
      assignment: true,
      managedByContact: {simpleFullName: true},
      createdByContact: {simpleFullName: true},
      status: {name: true},
      projectTaskCategory: {name: true},
      priority: {name: true},
      project: {
        name: true,
        company: {name: true},
        clientPartner: {simpleFullName: true},
      },
      assignedTo: {name: true},
    },
  });

  return tickets;
}

export async function findRelatedTicketLinks(
  ticketId: ID,
  tenantId: Tenant['id'],
): Promise<TicketLink[] | undefined> {
  if (!tenantId) {
    throw new Error(await t('TenantId is required.'));
  }

  const client = await manager.getClient(tenantId);

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
              company: {name: true},
              clientPartner: {simpleFullName: true},
            },
            assignedTo: {name: true},
            managedByContact: {simpleFullName: true},
            createdByContact: {simpleFullName: true},
            assignment: true,
          },
        },
      },
    },
  });

  return ticket?.projectTaskLinkList;
}

export async function findChildTickets(
  ticketId: ID,
  tenantId: Tenant['id'],
): Promise<ChildTicket[]> {
  if (!tenantId) {
    throw new Error(await t('TenantId is required.'));
  }

  const client = await manager.getClient(tenantId);

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
        company: {name: true},
        clientPartner: {simpleFullName: true},
      },
      assignedTo: {name: true},
      createdByContact: {simpleFullName: true},
      managedByContact: {simpleFullName: true},
      assignment: true,
    },
  });

  return tickets;
}

export async function findParentTicket(
  ticketId: ID,
  tenantId: Tenant['id'],
): Promise<ParentTicket | undefined> {
  if (!tenantId) {
    throw new Error(await t('TenantId is required.'));
  }

  const client = await manager.getClient(tenantId);

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
          company: {name: true},
          clientPartner: {simpleFullName: true},
        },
        assignedTo: {name: true},
        managedByContact: {simpleFullName: true},
        createdByContact: {simpleFullName: true},
        assignment: true,
      },
    },
  });

  return ticket?.parentTask;
}

export async function findTicket({
  ticketId,
  projectId,
  auth,
}: {
  ticketId: ID;
  projectId: ID;
  auth: AuthProps;
}): Promise<Ticket | null> {
  if (!auth.tenantId) {
    throw new Error(await t('TenantId is required.'));
  }

  const client = await manager.getClient(auth.tenantId);

  const ticket = await client.aOSProjectTask.findOne({
    where: withTicketAccessFilter(auth)({
      id: ticketId,
      project: {id: projectId},
    }),
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
      managedByContact: {simpleFullName: true},
      createdByContact: {simpleFullName: true},
      createdOn: true,
      project: {
        name: true,
        company: {name: true},
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

export async function findTicketVersion(
  ticketId: ID,
  tenantId: Tenant['id'],
): Promise<number> {
  if (!tenantId) {
    throw new Error(await t('TenantId is required.'));
  }

  const client = await manager.getClient(tenantId);

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
  projectId?: ID;
  excludeList?: ID[];
  auth: AuthProps;
}): Promise<TicketSearch[]> {
  const {search, projectId, excludeList, auth} = props;

  if (!auth.tenantId) {
    throw new Error(await t('TenantId is required.'));
  }

  const client = await manager.getClient(auth.tenantId);

  const tickets = await client.aOSProjectTask.find({
    where: withTicketAccessFilter(auth)({
      project: {
        ...(projectId && {id: projectId}),
        ...getProjectAccessFilter(auth),
      },
      ...(search && {
        OR: [
          {fullName: {like: `%${search}%`}},
          {description: {like: `%${search}%`}},
        ],
      }),
      ...(Boolean(excludeList?.length) && {
        id: {notIn: excludeList},
      }),
    }),
    take: 10,
    select: {fullName: true},
  });

  return tickets;
}

export async function findParentTicketIds(
  ticketId: ID,
  tenantId: Tenant['id'],
): Promise<string[]> {
  if (!tenantId) {
    return [];
  }

  const client = await manager.getClient(tenantId);

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

export async function findChildTicketIds(
  ticketId: ID,
  tenantId: Tenant['id'],
): Promise<string[]> {
  if (!tenantId) {
    return [];
  }

  const client = await manager.getClient(tenantId);

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
  auth,
}: {
  data: {currentTicketId: ID; linkTicketId: ID};
  auth: AuthProps;
}) {
  const {currentTicketId, linkTicketId} = data;

  if (!auth.tenantId) {
    throw new Error('TenantId is required.');
  }

  const client = await manager.getClient(auth.tenantId);

  const [currentTicket, linkTicket] = await Promise.all([
    findTicketAccess({recordId: currentTicketId, auth}),
    findTicketAccess({recordId: linkTicketId, auth}),
  ]);

  if (!currentTicket || !linkTicket) {
    // To make sure the user has access to the ticket.
    throw new Error(await t('Ticket not found'));
  }

  const parentTickets = await findParentTicketIds(
    currentTicketId,
    auth.tenantId,
  );

  if (parentTickets.includes(linkTicketId.toString())) {
    throw new Error(await t('Circular dependency'));
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
  auth,
}: {
  data: {currentTicketId: ID; linkTicketId: ID};
  auth: AuthProps;
}) {
  if (!auth.tenantId) {
    throw new Error(await t('TenantId is required.'));
  }

  const {currentTicketId, linkTicketId} = data;

  const client = await manager.getClient(auth.tenantId);

  const [currentTicket, linkTicket] = await Promise.all([
    findTicketAccess({recordId: currentTicketId, auth}),
    findTicketAccess({recordId: linkTicketId, auth}),
  ]);

  if (!currentTicket || !linkTicket) {
    // To make sure the user has access to the ticket.
    throw new Error(await t('Ticket not found'));
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
  auth,
}: {
  data: {currentTicketId: ID; linkTicketId: ID};
  auth: AuthProps;
}) {
  if (!auth.tenantId) {
    throw new Error(await t('TenantId is required.'));
  }

  const {currentTicketId, linkTicketId} = data;

  const client = await manager.getClient(auth.tenantId);

  const [currentTicket, linkTicket] = await Promise.all([
    findTicketAccess({recordId: currentTicketId, auth}),
    findTicketAccess({recordId: linkTicketId, auth}),
  ]);

  if (!currentTicket || !linkTicket) {
    // To make sure the user has access to the ticket.
    throw new Error(await t('Ticket not found'));
  }

  const childTickets = await findChildTicketIds(currentTicketId, auth.tenantId);

  if (childTickets.includes(linkTicketId.toString())) {
    throw new Error(await t('Circular dependency'));
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
  auth,
}: {
  data: {currentTicketId: ID; linkTicketId: ID};
  auth: AuthProps;
}) {
  if (!auth.tenantId) {
    throw new Error(await t('TenantId is required.'));
  }

  const {currentTicketId, linkTicketId} = data;

  const client = await manager.getClient(auth.tenantId);

  const [currentTicket, linkTicket] = await Promise.all([
    findTicketAccess({recordId: currentTicketId, auth}),
    findTicketAccess({recordId: linkTicketId, auth}),
  ]);

  if (!currentTicket || !linkTicket) {
    // To make sure the user has access to the ticket.
    throw new Error(await t('Ticket not found'));
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

export async function findTicketLinkTypes(
  projectId: ID,
  tenantId: Tenant['id'],
): Promise<LinkType[]> {
  if (!tenantId) {
    throw new Error(await t('TenantId is required.'));
  }

  const client = await manager.getClient(tenantId);

  if (projectId) {
    const project = await client.aOSProject.findOne({
      where: {id: projectId},
      select: {projectTaskLinkTypeSet: {select: {name: true}}},
    });
    if (project?.projectTaskLinkTypeSet?.length) {
      return project?.projectTaskLinkTypeSet;
    }
  }
  const links = await client.aOSProjectTaskLinkType.find({
    select: {name: true},
  });

  return links;
}

export async function createRelatedTicketLink({
  data,
  auth,
}: {
  data: {currentTicketId: ID; linkTicketId: ID; linkType: ID};
  auth: AuthProps;
}): Promise<[string, string]> {
  if (!auth.tenantId) {
    throw new Error(await t('TenantId is required.'));
  }

  const {currentTicketId, linkTicketId, linkType} = data;

  const client = await manager.getClient(auth.tenantId);

  const [currentTicket, linkTicket] = await Promise.all([
    findTicketAccess({
      recordId: currentTicketId,
      select: {
        name: true,
        project: {name: true, projectTaskLinkTypeSet: {select: {id: true}}},
      },
      auth,
    }),
    findTicketAccess({
      recordId: linkTicketId,
      select: {
        name: true,
        project: {name: true, projectTaskLinkTypeSet: {select: {id: true}}},
      },
      auth,
    }),
  ]);

  if (!currentTicket || !linkTicket) {
    // To make sure the user has access to the ticket.
    throw new Error(await t('Ticket not found'));
  }

  if (currentTicket.project?.id !== linkTicket.project?.id) {
    // This is enabled as per #85205
    // remove this check to enable cross project linking
    throw new Error(await t('Cross project linking not allowed'));
  }

  const type = await client.aOSProjectTaskLinkType.findOne({
    where: {id: linkType},
    select: {name: true, oppositeLinkType: {id: true, name: true}},
  });

  if (!type) {
    throw new Error(await t('Invalid link type'));
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
        `${await t('Please configure the project')} "${currentTicket.project?.name}" ${await t('with project task link type')} "${type.name}" ${await t('if you want to create this link')}.`,
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
        `${await t('Please configure the project')} "${linkTicket.project?.name}" ${await t('with project task link type')} "${oppositeType.name}" ${await t('if you want to create this link')}.`,
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
  auth,
}: {
  data: {currentTicketId: ID; linkTicketId: ID; linkId: ID};
  auth: AuthProps;
}): Promise<ID> {
  if (!auth.tenantId) {
    throw new Error(await t('TenantId is required.'));
  }

  const {currentTicketId, linkTicketId, linkId} = data;

  const client = await manager.getClient(auth.tenantId);

  const [hasCurrentTicketAccess, hasLinkTicketAccess] = await Promise.all([
    findTicketAccess({recordId: currentTicketId, auth}),
    findTicketAccess({recordId: linkTicketId, auth}),
  ]);

  if (!hasCurrentTicketAccess || !hasLinkTicketAccess) {
    // To make sure the user has access to the ticket.
    throw new Error(await t('Ticket not found'));
  }

  const link = await client.aOSProjectTaskLink.findOne({
    where: {id: linkId},
    select: {projectTaskLink: {id: true}},
  });

  if (!link) {
    throw new Error(await t('Link does not exist'));
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

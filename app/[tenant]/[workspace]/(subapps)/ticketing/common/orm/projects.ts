/**
 * Projects ORM API
 */
import {ORDER_BY} from '@/constants';
import {getClient} from '@/goovee';
import {
  AOSProject,
  AOSProjectTask,
  AOSProjectTaskCategory,
} from '@/goovee/.generated/models';
import {Entity, ID, WhereOptions} from '@goovee/orm';

type QueryProps<T extends Entity> = {
  where?: WhereOptions<T> | null;
  take?: number;
  // orderBy?: OrderByArg<T>;
  orderBy?: any;
  skip?: number;
};

export async function findProjects(props?: QueryProps<AOSProject>) {
  const {where, take, orderBy, skip} = props ?? {};
  const client = await getClient();
  const projects = await client.aOSProject.find({
    ...(take ? {take} : {}),
    ...(skip ? {skip} : {}),
    ...(orderBy ? {orderBy} : {}),
    ...(where ? {where} : {}),
    select: {
      name: true,
    },
  });
  return projects;
}

export async function getAllTicketCount(projectId: ID): Promise<number> {
  const client = await getClient();
  const count = await client.aOSProjectTask.count({
    where: {
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

export async function findProjectsWithTaskCount(
  props?: QueryProps<AOSProject>,
) {
  const projects = await findProjects(props);
  const counts = await Promise.all(
    projects.map(project => getAllTicketCount(project.id)),
  );
  return projects.map((p, i) => ({...p, taskCount: counts[i]}));
}

export async function findProjectById(id: ID) {
  const client = await getClient();
  const projects = await client.aOSProject.find({
    where: {
      id: id,
    },
    select: {
      name: true,
    },
  });
  return projects;
}

type TicketProps<T extends Entity> = QueryProps<T> & {
  projectId: ID;
};

export async function findProjectTickets(props: TicketProps<AOSProjectTask>) {
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
      ...where,
    },
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
  });
  return tickets;
}

export async function findTicketCategories(projectId: ID) {
  const client = await getClient();
  const project = await client.aOSProject.findOne({
    where: {
      id: projectId,
    },
    select: {
      projectTaskCategorySet: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return project?.projectTaskCategorySet ?? [];
}

export async function findTicketPriorities(projectId: ID) {
  const client = await getClient();
  const project = await client.aOSProject.findOne({
    where: {
      id: projectId,
    },
    select: {
      projectTaskPrioritySet: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return project?.projectTaskPrioritySet ?? [];
}

export async function findTicketStatuses(projectId: ID) {
  const client = await getClient();
  const project = await client.aOSProject.findOne({
    where: {
      id: projectId,
    },
    select: {
      projectTaskStatusSet: {
        orderBy: {
          sequence: ORDER_BY.ASC,
        },
        select: {
          id: true,
          name: true,
          sequence: true,
        },
      },
    },
  });
  return project?.projectTaskStatusSet ?? [];
}

export async function findUsers() {
  const client = await getClient();
  const users = await client.aOSUser.find({
    select: {
      name: true,
    },
  });
  return users;
}

export async function findTicket(ticketId: ID, projectId?: ID) {
  const client = await getClient();
  const ticket = await client.aOSProjectTask.findOne({
    where: {
      id: ticketId,
      ...(projectId ? {project: {id: projectId}} : {}),
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
    },
  });

  return ticket;
}

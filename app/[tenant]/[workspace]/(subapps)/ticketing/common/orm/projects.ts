/**
 * Projects ORM API
 */
import {getClient} from '@/goovee';
import {AOSProject, AOSProjectTask} from '@/goovee/.generated/models';
import {Entity, WhereOptions} from '@goovee/orm';
import {parseInt} from 'lodash';

type QueryProps<T extends Entity> = {
  where?: WhereOptions<T>;
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
export async function getTaskCount(projectId: string): Promise<number> {
  const client = await getClient();
  const count = await client.aOSProjectTask.count({
    where: {
      project: {
        id: projectId,
      },
    },
  });
  return typeof count === 'number' ? count : parseInt(count);
}

export async function findProjectsWithTaskCount(
  props?: QueryProps<AOSProject>,
) {
  const projects = await findProjects(props);
  const counts = await Promise.all(
    projects.map(project => getTaskCount(project.id)),
  );
  return projects.map((p, i) => ({...p, taskCount: counts[i]}));
}

export async function findProjectById(id: string) {
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
  projectId: string;
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
      ticketNumber: true,
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
    },
  });
  return tickets;
}

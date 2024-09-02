/**
 * Projects ORM API
 */
import {ORDER_BY} from '@/constants';
import {getClient} from '@/goovee';
import {AOSProject} from '@/goovee/.generated/models';
import {ID} from '@goovee/orm';
import {getAllTicketCount} from './tickets';
import {QueryProps} from '../types';

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

export async function findProjectsWithTaskCount(
  props?: QueryProps<AOSProject>,
) {
  const projects = await findProjects(props);
  const counts = await Promise.all(
    projects.map(project => getAllTicketCount(project.id)),
  );
  return projects.map((p, i) => ({...p, taskCount: counts[i]}));
}

export async function findProject(id: ID) {
  const client = await getClient();
  const project = await client.aOSProject.findOne({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
    },
  });
  return project;
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

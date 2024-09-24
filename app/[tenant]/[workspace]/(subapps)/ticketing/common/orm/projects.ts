/**
 * Projects ORM API
 */
import {ORDER_BY} from '@/constants';
import {getClient} from '@/goovee';
import {AOSProject} from '@/goovee/.generated/models';
import {ID} from '@goovee/orm';

import {AuthProps, getProjectAccessFilter, QueryProps} from './helpers';
import {getAllTicketCount} from './tickets';

export async function findProjects(props: QueryProps<AOSProject> & AuthProps) {
  const {workspaceId, userId, where, take, orderBy, skip} = props;
  const client = await getClient();
  const projects = await client.aOSProject.find({
    ...(take ? {take} : {}),
    ...(skip ? {skip} : {}),
    ...(orderBy ? {orderBy} : {}),
    where: {
      ...getProjectAccessFilter({workspaceId, userId}),
      ...where,
    },
    select: {name: true},
  });
  return projects;
}

export async function findProjectsWithTaskCount(
  props: QueryProps<AOSProject> & AuthProps,
) {
  const projects = await findProjects(props);
  const counts = await Promise.all(
    projects.map(project => getAllTicketCount(project.id)),
  );
  return projects.map((p, i) => ({...p, taskCount: counts[i]}));
}

export async function findProject(id: ID, workspaceId: ID, userId: ID) {
  const client = await getClient();
  const project = await client.aOSProject.findOne({
    where: {
      id: id,
      ...getProjectAccessFilter({workspaceId, userId}),
    },
    select: {id: true, name: true},
  });
  return project;
}

export async function findTicketCategories(projectId: ID) {
  const client = await getClient();
  const project = await client.aOSProject.findOne({
    where: {id: projectId},
    select: {
      projectTaskCategorySet: {select: {id: true, name: true}},
    },
  });
  return project?.projectTaskCategorySet ?? [];
}

export async function findTicketPriorities(projectId: ID) {
  const client = await getClient();
  const project = await client.aOSProject.findOne({
    where: {id: projectId},
    select: {
      projectTaskPrioritySet: {select: {id: true, name: true}},
    },
  });
  return project?.projectTaskPrioritySet ?? [];
}

export async function findTicketStatuses(projectId: ID) {
  const client = await getClient();
  const project = await client.aOSProject.findOne({
    where: {id: projectId},
    select: {
      projectTaskStatusSet: {
        orderBy: {sequence: ORDER_BY.ASC},
        select: {
          id: true,
          name: true,
          sequence: true,
          isCompleted: true,
        },
      } as unknown as {
        select: {
          id: true;
          name: true;
          sequence: true;
          isCompleted: true;
        };
      },
    },
  });
  return project?.projectTaskStatusSet ?? [];
}

export async function findCompany(projectId: ID) {
  const client = await getClient();
  const project = await client.aOSProject.findOne({
    where: {id: projectId},
    select: {company: {id: true, name: true}},
  });
  return project?.company;
}

export async function findTicketDoneStatus() {
  const client = await getClient();
  const projectAppConfig = await client.aOSAppProject.findOne({
    select: {completedTaskStatus: {id: true}},
  });

  return projectAppConfig?.completedTaskStatus?.id;
}

export async function findTicketCancelledStatus() {
  const client = await getClient();
  const projectAppConfig = await client.aOSAppProject.findOne({
    select: {cancelledTaskStatus: {id: true}},
  });

  return projectAppConfig?.cancelledTaskStatus?.id;
}

export async function findContactPartners(projectId: ID) {
  const client = await getClient();
  const project = await client.aOSProject.findOne({
    where: {id: projectId},
    select: {
      clientPartner: {
        id: true,
        name: true,
        contactPartnerSet: {select: {name: true}},
      },
    },
  });
  if (!project?.clientPartner) return [];

  const partners = project.clientPartner.contactPartnerSet ?? [];
  partners.push({
    id: project.clientPartner.id,
    version: project.clientPartner.version,
    name: project.clientPartner.name,
  });
  return partners;
}

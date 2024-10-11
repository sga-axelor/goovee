/**
 * Projects ORM API
 */
import {ORDER_BY} from '@/constants';
import {getClient} from '@/goovee';
import {AOSProject} from '@/goovee/.generated/models';
import type {ID} from '@goovee/orm';

import type {AuthProps, QueryProps} from './helpers';
import {getProjectAccessFilter} from './helpers';
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

export type Category = Awaited<ReturnType<typeof findTicketCategories>>[number];
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

export type Priority = Awaited<ReturnType<typeof findTicketPriorities>>[number];
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

export type Status = Awaited<ReturnType<typeof findTicketStatuses>>[number];
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

export type Company = NonNullable<Awaited<ReturnType<typeof findCompany>>>;
export async function findCompany(projectId: ID) {
  const client = await getClient();
  const project = await client.aOSProject.findOne({
    where: {id: projectId},
    select: {company: {id: true, name: true}},
  });
  return project?.company;
}
export type ClientPartner = NonNullable<
  Awaited<ReturnType<typeof findClientPartner>>
>;
export async function findClientPartner(projectId: ID) {
  const client = await getClient();
  const project = await client.aOSProject.findOne({
    where: {id: projectId},
    select: {
      clientPartner: {simpleFullName: true},
    },
  });
  return project?.clientPartner;
}

export async function findTicketDoneStatus(): Promise<string | undefined> {
  const client = await getClient();
  const projectAppConfig = await client.aOSAppProject.findOne({
    select: {completedTaskStatus: {id: true}},
  });

  return projectAppConfig?.completedTaskStatus?.id;
}

export async function findTicketCancelledStatus(): Promise<string | undefined> {
  const client = await getClient();
  const projectAppConfig = await client.aOSAppProject.findOne({
    select: {cancelledTaskStatus: {id: true}},
  });

  return projectAppConfig?.cancelledTaskStatus?.id;
}

export type ContactPartner = Awaited<
  ReturnType<typeof findContactPartners>
>[number];

export async function findContactPartners(projectId: ID) {
  const client = await getClient();
  const project = await client.aOSProject.findOne({
    where: {id: projectId},
    select: {
      clientPartner: {
        id: true,
        simpleFullName: true,
        contactPartnerSet: {select: {simpleFullName: true}},
      },
    },
  });
  if (!project?.clientPartner) return [];

  const partners =
    project.clientPartner.contactPartnerSet?.map(p => ({
      id: p.id,
      version: p.version,
      simpleFullName: p.simpleFullName,
    })) ?? [];

  partners.push({
    id: project.clientPartner.id,
    version: project.clientPartner.version,
    simpleFullName: project.clientPartner.simpleFullName,
  });

  return partners;
}

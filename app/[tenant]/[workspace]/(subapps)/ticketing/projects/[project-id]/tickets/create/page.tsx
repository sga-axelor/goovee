// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {encodeFilter} from '@/utils/filter';
import {workspacePathname} from '@/utils/workspace';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {FaChevronRight} from 'react-icons/fa';

// ---- LOCAL IMPORTS ---- //
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/ui/components';
import {
  findContactPartners,
  findProject,
  findTicketCategories,
  findTicketPriorities,
  findTicketStatuses,
} from '../../../../common/orm/projects';
import {findTicketAccess} from '../../../../common/orm/tickets';
import {EncodedFilter} from '../../../../common/schema';
import {Form} from './client-form';
export default async function Page({
  params,
  searchParams,
}: {
  params: {
    tenant: string;
    workspace: string;
    'project-id': string;
  };
  searchParams: {
    parentId?: string;
  };
}) {
  const session = await getSession();
  if (!session?.user) notFound();
  const userId = session!.user.id;
  const projectId = params['project-id'];
  const {parentId} = searchParams;
  const {workspaceURL, workspaceURI} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  if (!workspace) notFound();

  if (parentId) {
    const parentTicket = await findTicketAccess({
      recordId: parentId,
      userId,
      workspaceId: workspace.id,
      select: {
        project: {id: true},
      },
    });
    if (parentTicket?.project?.id !== projectId) notFound();
  }

  const [project, statuses, categories, priorities, contacts] =
    await Promise.all([
      findProject(projectId, workspace.id, userId),
      findTicketStatuses(projectId),
      findTicketCategories(projectId).then(clone),
      findTicketPriorities(projectId).then(clone),
      findContactPartners(projectId).then(clone),
    ]);

  if (!project) notFound();

  const ticketsURL = `${workspaceURI}/ticketing/projects/${projectId}/tickets`;
  const status = statuses.filter(s => !s.isCompleted).map(s => s.id);
  const allTicketsURL = `${ticketsURL}?filter=${encodeFilter<EncodedFilter>({status})}`;

  return (
    <div className="container mt-5 mb-20">
      <Breadcrumb className="flex-shrink">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              asChild
              className="text-foreground-muted cursor-pointer truncate text-md">
              <Link href={`${workspaceURI}/ticketing`}>
                {i18n.get('Projects')}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <FaChevronRight className="text-primary" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink
              asChild
              className="cursor-pointer max-w-[8ch] md:max-w-[35ch] truncate text-md">
              <Link href={`${workspaceURI}/ticketing/projects/${projectId}`}>
                {project.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <FaChevronRight className="text-primary" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="cursor-pointer text-md">
              <Link href={allTicketsURL}>{i18n.get('All tickets')}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <FaChevronRight className="text-primary" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate text-lg font-semibold">
              <h2 className="font-semibold text-xl">
                {i18n.get('Create a ticket')}
              </h2>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Form
        projectId={projectId}
        categories={categories}
        priorities={priorities}
        contacts={contacts}
        userId={userId}
        parentId={parentId}
        workspaceURI={workspaceURI}
      />
    </div>
  );
}

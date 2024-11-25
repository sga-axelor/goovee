import Link from 'next/link';
import {notFound} from 'next/navigation';
import {FaChevronRight} from 'react-icons/fa';

// ---- CORE IMPORTS ---- //
import {getTranslation} from '@/i18n/server';
import {clone} from '@/utils';
import {encodeFilter} from '@/utils/url';
import {workspacePathname} from '@/utils/workspace';

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
import {ensureAuth} from '../../../../common/utils/auth-helper';
import {EncodedFilter} from '../../../../common/utils/validators';
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
  const projectId = params['project-id'];
  const {parentId} = searchParams;
  const {workspaceURL, workspaceURI, tenant} = workspacePathname(params);
  const {error, info} = await ensureAuth(workspaceURL, tenant);
  if (error) notFound();
  const {auth} = info;

  if (parentId) {
    const parentTicket = await findTicketAccess({
      recordId: parentId,
      select: {project: {id: true}},
      auth,
    });
    if (parentTicket?.project?.id !== projectId) notFound();
  }

  const [project, statuses, categories, priorities, contacts] =
    await Promise.all([
      findProject(projectId, auth),
      findTicketStatuses(projectId, tenant),
      findTicketCategories(projectId, tenant).then(clone),
      findTicketPriorities(projectId, tenant).then(clone),
      findContactPartners(projectId, tenant).then(clone),
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
                {await getTranslation('Projects')}
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
              <Link href={allTicketsURL}>
                {await getTranslation('All tickets')}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <FaChevronRight className="text-primary" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate text-lg font-semibold">
              <h2 className="font-semibold text-xl">
                {await getTranslation('Create a ticket')}
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
        userId={auth.userId}
        parentId={parentId}
        workspaceURI={workspaceURI}
      />
    </div>
  );
}

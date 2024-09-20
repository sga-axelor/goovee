// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import {
  findProject,
  findTicketCategories,
  findTicketPriorities,
  findTicketStatuses,
} from '../../../../common/orm/projects';
import {TicketForm} from '../../../../common/ui/components/ticket-form';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/ui/components';
import {FaChevronRight} from 'react-icons/fa';
import {workspacePathname} from '@/utils/workspace';
import Link from 'next/link';
import {i18n} from '@/lib/i18n';
import {encodeFilter} from '@/utils/filter';
import {findWorkspace} from '@/orm/workspace';
import {getSession} from '@/orm/auth';
import {notFound} from 'next/navigation';
export default async function Page({
  params,
}: {
  params: {
    tenant: string;
    workspace: string;
    'project-id': string;
  };
}) {
  const session = await getSession();
  if (!session?.user) notFound();
  const userId = session!.user.id;
  const projectId = params['project-id'];
  const {workspaceURL, workspaceURI} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  if (!workspace) notFound();

  const [project, statuses, categories, priorities] = await Promise.all([
    findProject(projectId, workspace.id, userId),
    findTicketStatuses(projectId),
    findTicketCategories(projectId).then(clone),
    findTicketPriorities(projectId).then(clone),
  ]);

  const ticketsURL = `${workspaceURI}/ticketing/projects/${projectId}/tickets`;
  const status = statuses.filter(s => !s.isCompleted).map(s => s.id);
  const allTicketsURL = `${ticketsURL}?filter=${encodeFilter({status})}`;

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
                {project?.name}
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
      <TicketForm
        projectId={projectId}
        categories={categories}
        priorities={priorities}
      />
    </div>
  );
}

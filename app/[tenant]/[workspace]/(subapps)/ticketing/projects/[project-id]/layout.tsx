import {ReactNode} from 'react';
import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {findWorkspace} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';
import {getSession} from '@/auth';

// ---- LOCAL IMPORTS ---- //
import {findProject} from '@/subapps/ticketing/common/orm/projects';

export default async function Layout({
  params,
  children,
}: {
  params: {tenant: string; workspace: string; 'project-id': string};
  children: ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) notFound();
  const projectId = params?.['project-id'];

  const {workspaceURL, tenant} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  });

  if (!workspace) notFound();

  const project = await findProject(
    projectId,
    workspace.id,
    session!.user.id,
    tenant,
  );

  if (!project) notFound();

  return children;
}

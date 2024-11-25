import {notFound} from 'next/navigation';
import {ReactNode} from 'react';

// ---- CORE IMPORTS ---- //
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import {findProject} from '@/subapps/ticketing/common/orm/projects';
import {ensureAuth} from '../../common/utils/auth-helper';

export default async function Layout({
  params,
  children,
}: {
  params: {tenant: string; workspace: string; 'project-id': string};
  children: ReactNode;
}) {
  const projectId = params?.['project-id'];

  const {workspaceURL, tenant} = workspacePathname(params);

  const {error, info} = await ensureAuth(workspaceURL, tenant);
  if (error) notFound();
  const {auth} = info;

  const project = await findProject(projectId, auth);

  if (!project) notFound();

  return children;
}

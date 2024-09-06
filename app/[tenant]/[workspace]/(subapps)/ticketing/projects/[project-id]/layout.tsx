import {findWorkspace} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';
import {notFound} from 'next/navigation';
import {ReactNode} from 'react';
import {getSession} from '@/orm/auth';

import {findProject} from '../../common/orm/projects';

export default async function Layout({
  params,
  children,
}: {
  params: {tenant: string; workspace: string; 'project-id': string};
  children: ReactNode;
}) {
  const session = await getSession();
  const projectId = params?.['project-id'];

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  });
  if (!workspace) notFound();

  const project = findProject(projectId, workspace.id, session!.user.id);
  if (!project) notFound();
  return children;
}

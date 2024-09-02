import {notFound} from 'next/navigation';
import {ReactNode} from 'react';

import {findProject} from '../../common/orm/projects';

export default async function Page({
  params,
  children,
}: {
  params: {tenant: string; workspace: string; 'project-id': string};
  children: ReactNode;
}) {
  const projectId = params?.['project-id'];
  const project = findProject(projectId);
  if (!project) notFound();
  return children;
}

import {ReactNode} from 'react';
import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import {findTicketAccess} from '../../../../common/orm/tickets';
import {ensureAuth} from '../../../../common/utils/auth-helper';

export default async function Layout({
  params,
  children,
}: {
  params: {
    tenant: string;
    workspace: string;
    'project-id': string;
    'ticket-id': string;
  };
  children: ReactNode;
}) {
  const projectId = params?.['project-id'];
  const ticketId = params['ticket-id'];
  const {workspaceURL, tenant} = workspacePathname(params);
  const {error, info} = await ensureAuth(workspaceURL, tenant);
  if (error) notFound();
  const {auth} = info;

  const ticket = await findTicketAccess({recordId: ticketId, projectId, auth});
  if (!ticket) notFound();

  return children;
}

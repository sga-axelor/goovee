import {ReactNode} from 'react';
import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {manager} from '@/tenant';

// ---- LOCAL IMPORTS ---- //
import {getTicketAccessFilter} from '@/subapps/ticketing/common/orm/helpers';

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
  const {tenant} = params;

  const client = await manager.getClient(tenant);

  const ticket = await client.aOSProjectTask.findOne({
    where: {
      id: ticketId,
      project: {id: projectId},
      ...getTicketAccessFilter(),
    },
    select: {
      id: true,
    },
  });

  if (!ticket) notFound();

  return children;
}

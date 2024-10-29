import {getClient} from '@/goovee';
import {notFound} from 'next/navigation';
import {ReactNode} from 'react';

import {getTicketAccessFilter} from '../../../../common/orm/helpers';

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

  const client = await getClient();
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

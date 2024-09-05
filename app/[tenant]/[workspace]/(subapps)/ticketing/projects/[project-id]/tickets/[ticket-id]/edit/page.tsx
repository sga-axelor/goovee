// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {notFound} from 'next/navigation';

// ---- LOCAL IMPORTS ---- //
import {
  findTicketCategories,
  findTicketPriorities,
} from '../../../../../common/orm/projects';
import {findTicketInfo} from '../../../../../common/orm/tickets';
import {TicketForm} from '../../../../../common/ui/components/ticket-form';

export default async function Page({
  params,
}: {
  params: {
    tenant: string;
    workspace: string;
    'project-id': string;
    'ticket-id': string;
  };
}) {
  const projectId = params['project-id'];
  const ticketId = params['ticket-id'];

  const [categories, priorities, ticket] = await Promise.all([
    findTicketCategories(projectId).then(clone),
    findTicketPriorities(projectId).then(clone),
    findTicketInfo(ticketId, projectId).then(clone),
  ]);

  if (!ticket) {
    notFound();
  }

  return (
    <TicketForm
      projectId={projectId}
      ticket={ticket}
      categories={categories}
      priorities={priorities}
    />
  );
}

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import {
  findTicketCategories,
  findTicketPriorities,
} from '../../../../common/orm/projects';
import {TicketForm} from '../../../../common/ui/components/ticket-form';

export default async function Page({
  params,
}: {
  params: {
    tenant: string;
    workspace: string;
    'project-id': string;
  };
}) {
  const projectId = params['project-id'];

  const [categories, priorities] = await Promise.all([
    findTicketCategories(projectId).then(clone),
    findTicketPriorities(projectId).then(clone),
  ]);

  return (
    <TicketForm
      projectId={projectId}
      categories={categories}
      priorities={priorities}
    />
  );
}

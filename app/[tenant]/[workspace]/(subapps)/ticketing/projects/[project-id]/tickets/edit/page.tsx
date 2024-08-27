// ---- LOCAL IMPORTS ---- //
import {clone} from '@/utils';
import {
  findTicketCategories,
  findTicketPriorities,
  findTicketStatuses,
  findUsers,
} from '../../../../common/orm/projects';
import TicketForm from './form';

const defaultTicket = {};

export default async function Page() {
  const [users, categories, statuses, priorities] = await Promise.all([
    findUsers().then(clone),
    findTicketCategories().then(clone),
    findTicketStatuses().then(clone),
    findTicketPriorities().then(clone),
  ]);
  return (
    <TicketForm
      contacts={users}
      ticket={defaultTicket}
      categories={categories}
      statuses={statuses}
      priorities={priorities}
    />
  );
}

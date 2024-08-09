// ---- LOCAL IMPORTS ---- //
import TicketForm from './form';

const defaultTicket = {
  title: '',
};

export default function Page() {
  return <TicketForm ticket={defaultTicket} />;
}

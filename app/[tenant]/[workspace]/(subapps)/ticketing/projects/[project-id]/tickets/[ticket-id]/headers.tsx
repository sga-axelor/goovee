'use client';
import {i18n} from '@/lib/i18n';
import {Cloned} from '@/types/util';
import {ID} from '@goovee/orm';
import {Ticket} from '../../../../common/orm/tickets';
import {HeaderWithAlert} from '../../../../common/ui/components/header-with-alert';
import {
  TicketChildLinkForm,
  TicketRelatedLinkForm,
} from '../../../../common/ui/components/ticket-link-form';

export function RelatedTicketsHeader(props: {
  linkTypes: {
    id: string;
    name: string;
  }[];
  ticketId: ID;
  links: Cloned<NonNullable<Ticket['projectTaskLinkList']>>;
}) {
  return (
    <HeaderWithAlert
      title={i18n.get('Related tickets')}
      alertTitle={i18n.get('Add related ticket')}
      renderer={({closeAlert}) => (
        <TicketRelatedLinkForm {...props} onSubmit={closeAlert} />
      )}
    />
  );
}

export function ChildTicketsHeader(props: {
  projectId?: ID;
  ticketId: ID;
  parentIds: ID[];
}) {
  return (
    <HeaderWithAlert
      title={i18n.get('Child tickets')}
      alertTitle={i18n.get('Add child ticket')}
      renderer={({closeAlert}) => (
        <TicketChildLinkForm {...props} onSubmit={closeAlert} />
      )}
    />
  );
}

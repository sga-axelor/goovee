'use client';
import {i18n} from '@/lib/i18n';
import type {Cloned} from '@/types/util';
import type {ID} from '@goovee/orm';
import type {
  Category,
  ContactPartner,
  Priority,
} from '../../../../common/orm/projects';
import type {Ticket} from '../../../../common/orm/tickets';
import {TicketForm} from '../../../../common/ui/components/ticket-form';
import {
  TicketChildLinkForm,
  TicketRelatedLinkForm,
} from '../../../../common/ui/components/ticket-link-form';
import {TicketLinkHeader} from '../../../../common/ui/components/ticket-link-header';

export function RelatedTicketsHeader(props: {
  linkTypes: {
    id: string;
    name: string;
  }[];
  projectId: ID;
  ticketId: ID;
  links: Cloned<NonNullable<Ticket['projectTaskLinkList']>>;
}) {
  return (
    <TicketLinkHeader
      title={i18n.get('Related tickets')}
      alertTitle={i18n.get('Link related ticket')}
      alertContentRenderer={({closeAlert}) => (
        <TicketRelatedLinkForm {...props} onSubmit={closeAlert} />
      )}
    />
  );
}

export function ChildTicketsHeader(props: {
  projectId: ID;
  ticketId: ID;
  parentIds: ID[];
  categories: Category[];
  priorities: Priority[];
  contacts: ContactPartner[];
  userId: ID;
}) {
  const {
    ticketId,
    projectId,
    categories,
    priorities,
    contacts,
    userId,
    parentIds,
  } = props;

  return (
    <TicketLinkHeader
      title={i18n.get('Child tickets')}
      dialogTitle={i18n.get('Create child ticket')}
      dialogContentRenderer={({closeDialog}) => (
        <TicketForm
          projectId={projectId.toString()}
          categories={categories}
          priorities={priorities}
          contacts={contacts}
          userId={userId}
          parentId={ticketId.toString()}
          className="mt-10 text-left"
          onSuccess={closeDialog}
        />
      )}
      alertTitle={i18n.get('Link child ticket')}
      alertContentRenderer={({closeAlert}) => (
        <TicketChildLinkForm
          ticketId={ticketId}
          parentIds={parentIds}
          projectId={projectId}
          onSubmit={closeAlert}
        />
      )}
    />
  );
}

'use client';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/lib/i18n';
import {Cloned} from '@/types/util';
import {Button} from '@/ui/components';
import {ID} from '@goovee/orm';
import Link from 'next/link';
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
  const {workspaceURI} = useWorkspace();
  return (
    <HeaderWithAlert
      title={i18n.get('Child tickets')}
      alertTitle={i18n.get('Add child ticket')}
      renderer={({closeAlert}) => (
        <div className="p-2">
          <Button variant="outline" className="w-full border-input" asChild>
            <Link
              href={{
                pathname: `${workspaceURI}/ticketing/projects/${props.projectId}/tickets/create`,
                query: {parentId: props.ticketId},
              }}>
              {i18n.get('Create ticket')}
            </Link>
          </Button>
          <h3 className="text-center my-2">{i18n.get('OR')}</h3>
          <TicketChildLinkForm {...props} onSubmit={closeAlert} />
        </div>
      )}
    />
  );
}

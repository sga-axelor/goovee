'use client';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/lib/i18n';
import {Alert, AlertDescription, AlertTitle, Button} from '@/ui/components';
import {ID} from '@goovee/orm';
import {X} from 'lucide-react';
import {ReactNode, useCallback, useState} from 'react';
import {MdAdd} from 'react-icons/md';

import {cancelTicket, closeTicket} from '../../../actions';
import {useRetryAction} from '../../../hooks';
import {TicketChildLinkForm, TicketRelatedLinkForm} from '../ticket-link-form';
import {HeaderWithAlert} from './header-with-alert';

export function CancelTicket({id, version}: {id: string; version: number}) {
  const {workspaceURL} = useWorkspace();
  const {action, loading} = useRetryAction(
    cancelTicket,
    i18n.get('Ticket canceled'),
  );

  const handleClick = useCallback(async () => {
    await action({
      data: {id: id, version: version},
      workspaceURL,
    });
  }, [id, version, workspaceURL, action]);

  return (
    <Button
      size="sm"
      variant="destructive"
      disabled={loading}
      onClick={handleClick}>
      {i18n.get('Cancel ticket')}
    </Button>
  );
}

export function CloseTicket({id, version}: {id: string; version: number}) {
  const {workspaceURL} = useWorkspace();
  const {action, loading} = useRetryAction(
    closeTicket,
    i18n.get('Ticket closed'),
  );

  const handleClick = useCallback(async () => {
    await action({
      data: {id: id, version: version},
      workspaceURL,
    });
  }, [id, version, workspaceURL, action]);

  return (
    <Button
      size="sm"
      variant="success"
      disabled={loading}
      onClick={handleClick}>
      {i18n.get('Close ticket')}
    </Button>
  );
}

export function RelatedTicketsHeader(props: {
  linkTypes: {
    id: string;
    name: string;
  }[];
  ticketId: ID;
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

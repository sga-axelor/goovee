'use client';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/lib/i18n';
import {Alert, AlertDescription, AlertTitle, Button} from '@/ui/components';
import {ID} from '@goovee/orm';
import {X} from 'lucide-react';
import {useCallback, useState} from 'react';
import {MdAdd} from 'react-icons/md';

import {assignToSupplier, cancelTicket, closeTicket} from '../../../actions';
import {useRetryAction} from '../../../hooks';
import {TicketLinkForm} from '../ticket-link-form';

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

export function AssignToSupplier({id, version}: {id: string; version: number}) {
  const {workspaceURL} = useWorkspace();
  const {action, loading} = useRetryAction(
    assignToSupplier,
    i18n.get('Ticket assinged to supplier'),
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
      type="button"
      variant="success"
      disabled={loading}
      onClick={handleClick}>
      {i18n.get('Assign to supplier')}
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
  const [showAlert, setShowAlert] = useState(false);

  const closeAlert = useCallback(() => {
    setShowAlert(false);
  }, []);

  const openAlert = useCallback(() => {
    setShowAlert(true);
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <h4 className="text-xl font-semibold">{i18n.get('Related tickets')}</h4>
        {!showAlert && (
          <Button size="sm" type="button" variant="success" onClick={openAlert}>
            <MdAdd className="size-6 lg:me-1" />
            <span className="hidden lg:inline">
              {i18n.get('Add related ticket')}
            </span>
          </Button>
        )}
      </div>
      {showAlert && (
        <Alert variant="warning" className="group">
          <button
            className="ring-0 absolute right-2 top-2 rounded-md cursor-pointer p-1 text-foreground/50 lg:opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none group-hover:opacity-100"
            onClick={() => setShowAlert(false)}>
            <X className="h-4 w-4" />
          </button>
          <AlertTitle>{i18n.get('Add related ticket')}</AlertTitle>
          <AlertDescription>
            <TicketLinkForm {...props} onSubmit={closeAlert} />
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}

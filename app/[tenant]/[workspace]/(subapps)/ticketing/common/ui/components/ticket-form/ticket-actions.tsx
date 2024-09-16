'use client';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/lib/i18n';
import {Button} from '@/ui/components';
import {useRouter} from 'next/navigation';
import {useCallback, useState} from 'react';

import {assignToSupplier, cancelTicket, closeTicket} from '../../../actions';
import {useToast} from '@/ui/hooks';

export function CancelTicket({id, version}: {id: string; version: number}) {
  const {workspaceURL} = useWorkspace();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {toast} = useToast();

  const handleClick = useCallback(async () => {
    try {
      setLoading(true);
      const {data, error, message} = await cancelTicket({
        data: {id: id, version: version},
        workspaceURL,
      });
      if (error) {
        console.error(message);
        return toast({
          variant: 'destructive',
          title: message,
        });
      }
      return toast({
        variant: 'success',
        title: i18n.get('Ticket canceled'),
      });
    } catch (e) {
      console.error(e);
    } finally {
      router.refresh();
      setLoading(false);
    }
  }, [id, version, router, workspaceURL, toast]);
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {toast} = useToast();

  const handleClick = useCallback(async () => {
    try {
      setLoading(true);
      const {data, error, message} = await closeTicket({
        data: {id: id, version: version},
        workspaceURL,
      });
      if (error) {
        console.error(message);
        return toast({
          variant: 'destructive',
          title: message,
        });
      }
      return toast({
        variant: 'success',
        title: i18n.get('Ticket closed'),
      });
    } catch (e) {
      console.error(e);
    } finally {
      router.refresh();
      setLoading(false);
    }
  }, [id, version, workspaceURL, router, toast]);

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
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {toast} = useToast();

  const handleAssignTo = async () => {
    try {
      setLoading(true);
      const {data, error, message} = await assignToSupplier({
        data: {id: id, version: version},
        workspaceURL,
      });
      if (error) {
        console.error(message);
        return toast({
          variant: 'destructive',
          title: message,
        });
      }
      return toast({
        variant: 'success',
        title: i18n.get('Ticket assigned to supplier'),
      });
    } catch (e) {
      console.error(e);
    } finally {
      router.refresh();
      setLoading(false);
    }
  };
  return (
    <Button
      size="sm"
      type="button"
      variant="success"
      disabled={loading}
      onClick={handleAssignTo}>
      {i18n.get('Assign to supplier')}
    </Button>
  );
}

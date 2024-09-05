'use client';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/lib/i18n';
import {Button} from '@/ui/components';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

import {assignToSupplier} from '../../../../common/ui/components/ticket-form';

export function AssignToSupplier({id, version}: {id: string; version: number}) {
  const {workspaceURL} = useWorkspace();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleAssignTo = async () => {
    try {
      setLoading(true);
      const {data, error, message} = await assignToSupplier({
        data: {id: id, version: version},
        workspaceURL,
      });
      if (error) {
        console.error(message);
      }
    } catch (e) {
      console.error(e);
    } finally {
      router.refresh();
      setLoading(false);
    }
  };
  return (
    <Button variant="success" disabled={loading} onClick={handleAssignTo}>
      {i18n.get('Assign to supplier')}
    </Button>
  );
}

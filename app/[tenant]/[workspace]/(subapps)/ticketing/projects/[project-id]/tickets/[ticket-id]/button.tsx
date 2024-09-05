'use client';
import {useRouter} from 'next/navigation';

import {Button} from '@/ui/components';
import {assign} from '../../../../common/ui/components/ticket-form';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

export default function AssignButton({
  id,
  version,
}: {
  id: string;
  version: number;
}) {
  const {workspaceURL, workspaceURI} = useWorkspace();
  const router = useRouter();
  const handleAssignTo = async () => {
    await assign({
      action: {
        data: {id: id, version: version},
      },
      workspaceURL,
      workspaceURI,
    });
    router.refresh();
  };
  return (
    <Button variant="success" onClick={handleAssignTo}>
      Assign to supplier
    </Button>
  );
}

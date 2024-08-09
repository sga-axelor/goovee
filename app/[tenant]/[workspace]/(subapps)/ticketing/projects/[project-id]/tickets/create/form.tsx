'use client';

// ---- CORE IMPORT ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORT ---- //
import {create} from './action';

export default function TicketForm({ticket}: {ticket: any}) {
  const {workspaceURL} = useWorkspace();

  const handleSubmit = () => {
    /**
     * TODO
     *
     * Call create action with formdata and workspaceURL
     */
  };

  return <form></form>;
}

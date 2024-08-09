'use server';

// ---- CORE IMPORTS ---- //
import {PortalWorkspace} from '@/types';

export async function findTickets({
  search = '',
  workspace,
}: {
  search: string;
  workspace: PortalWorkspace;
}) {
  if (!workspace) return [];

  return [];
}

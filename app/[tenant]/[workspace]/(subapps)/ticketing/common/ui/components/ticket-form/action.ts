'use server';

// ---- CORE IMPORTS ---- //
import {SUBAPP_CODES} from '@/constants';
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {revalidatePath} from 'next/cache';

// ---- LOCAL IMPORTS ---- //
import {
  createTicket,
  updateTicket,
  assignTicketToSupplier,
} from '../../../orm/tickets';
import {
  UpdateTicketSchema,
  CreateTicketSchema,
  CreateTicketInfo,
  UpdateTicketInfo,
  UpdateAssignTicket,
} from './schema';

type mutateProps = {
  workspaceURL: string;
  workspaceURI: string;
  action:
    | {
        type: 'create';
        data: CreateTicketInfo;
      }
    | {
        type: 'update';
        data: UpdateTicketInfo;
      };
};

type AssignToSupplierProps = {
  workspaceURL: string;
  data: UpdateAssignTicket;
};

export async function mutate(
  props: mutateProps,
): Promise<
  | {error: true; message: string; data?: never}
  | {error: false; data: any; message?: never}
> {
  const {workspaceURL, workspaceURI, action} = props;

  if (!workspaceURL) {
    return {
      error: true,
      message: i18n.get('Workspace not provided.'),
    };
  }

  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.resources,
    user,
    url: workspaceURL,
  });

  if (!subapp) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
  });

  if (!workspace) {
    return {
      error: true,
      message: i18n.get('Invalid workspace'),
    };
  }
  try {
    let ticket;
    if (action.type === 'create') {
      const createData = CreateTicketSchema.parse(action.data);
      ticket = await createTicket(createData, user.id, workspace.id);
    } else {
      const updateData = UpdateTicketSchema.parse(action.data);
      ticket = await updateTicket(updateData, user.id, workspace.id);
    }

    if (ticket.project?.id) {
      revalidatePath(
        `${workspaceURI}/ticketing/projects/${ticket.project.id}/tickets`,
      );
    }

    return {
      error: false,
      data: clone(ticket),
    };
  } catch (e) {
    if (e instanceof Error) {
      return {error: true, message: e.message};
    }
    throw e;
  }
}

export async function assignToSupplier(
  props: AssignToSupplierProps,
): Promise<
  | {error: true; message: string; data?: never}
  | {error: false; data: any; message?: never}
> {
  const {workspaceURL, data} = props;

  if (!workspaceURL) {
    return {
      error: true,
      message: i18n.get('Workspace not provided.'),
    };
  }

  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.resources,
    user,
    url: workspaceURL,
  });

  if (!subapp) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
  });

  if (!workspace) {
    return {
      error: true,
      message: i18n.get('Invalid workspace'),
    };
  }
  try {
    const ticket = await assignTicketToSupplier(data.id, data.version);

    return {
      error: false,
      data: clone(ticket),
    };
  } catch (e) {
    if (e instanceof Error) {
      return {error: true, message: e.message};
    }
    throw e;
  }
}

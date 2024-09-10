'use server';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {clone} from '@/utils';
import {revalidatePath} from 'next/cache';

// ---- LOCAL IMPORTS ---- //
import {createTicket, updateTicket} from '../../../orm/tickets';
import {
  UpdateTicketSchema,
  CreateTicketSchema,
  CreateTicketInfo,
  UpdateTicketInfo,
} from './schema';
import {ensureAuth} from '../../../utils/auth-helper';
import {ASSIGNMENT} from '../../../constants';
import {
  findTicketCancelledStatus,
  findTicketDoneStatus,
} from '../../../orm/projects';

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

export async function mutate(
  props: mutateProps,
): Promise<
  | {error: true; message: string; data?: never}
  | {error: false; data: any; message?: never}
> {
  const {workspaceURL, workspaceURI, action} = props;
  const {error, message, auth} = await ensureAuth(workspaceURL);
  if (error) return {error: true, message};
  const {user, workspace} = auth;

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

type TicketActionProps = {
  workspaceURL: string;
  data: {id: string; version: number};
};

export async function assignToSupplier(
  props: TicketActionProps,
): Promise<
  | {error: true; message: string; data?: never}
  | {error: false; data: any; message?: never}
> {
  const {workspaceURL, data} = props;

  const {error, message, auth} = await ensureAuth(workspaceURL);
  if (error) return {error: true, message};
  const {user, workspace} = auth;

  try {
    const updateData = UpdateTicketSchema.parse({
      ...data,
      assignment: ASSIGNMENT.PROVIDER,
    });
    const ticket = await updateTicket(updateData, user.id, workspace.id);
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

export async function closeTicket(
  props: TicketActionProps,
): Promise<
  | {error: true; message: string; data?: never}
  | {error: false; data: any; message?: never}
> {
  const {workspaceURL, data} = props;

  const {error, message, auth} = await ensureAuth(workspaceURL);
  if (error) return {error: true, message};
  const {user, workspace} = auth;

  try {
    const status = await findTicketDoneStatus();
    if (!status) {
      return {
        error: true,
        message: i18n.get('Done status not configured'),
      };
    }
    const updateData = UpdateTicketSchema.parse({
      ...data,
      status,
    });

    const ticket = await updateTicket(updateData, user.id, workspace.id);

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

export async function cancelTicket(
  props: TicketActionProps,
): Promise<
  | {error: true; message: string; data?: never}
  | {error: false; data: any; message?: never}
> {
  const {workspaceURL, data} = props;

  const {error, message, auth} = await ensureAuth(workspaceURL);
  if (error) return {error: true, message};
  const {user, workspace} = auth;

  try {
    const status = await findTicketCancelledStatus();
    if (!status) {
      return {
        error: true,
        message: i18n.get('Cancelled status not configured'),
      };
    }
    const updateData = UpdateTicketSchema.parse({
      ...data,
      status,
    });
    const ticket = await updateTicket(updateData, user.id, workspace.id);

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

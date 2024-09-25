'use server';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {Cloned} from '@/types/util';
import {clone} from '@/utils';
import {ID} from '@goovee/orm';
import {revalidatePath} from 'next/cache';

// ---- LOCAL IMPORTS ---- //
import {
  ASSIGNMENT,
  STATUS_CHANGE_METHOD,
  VERSION_MISMATCH_ERROR,
} from '../constants';
import {findTicketCancelledStatus, findTicketDoneStatus} from '../orm/projects';
import {
  createTicket,
  createTicketLink,
  deleteTicketLink,
  findTicketsBySearch,
  findTicketVersion,
  TicketSearch,
  updateTicket,
  updateTicketViaWS,
} from '../orm/tickets';
import {CreateTicketSchema, UpdateTicketSchema} from '../schema';
import {ensureAuth} from '../utils/auth-helper';
import type {ActionResponse, MutateProps} from './types';

export async function mutate(
  props: MutateProps,
  force?: boolean,
): ActionResponse<{id: string}> {
  const {workspaceURL, workspaceURI, action} = props;
  const {error, message, auth} = await ensureAuth(workspaceURL);
  if (error) return {error: true, message};
  const {user, workspace} = auth;

  try {
    let ticket;
    if (action.type === 'create') {
      const createData = CreateTicketSchema.parse(action.data);
      ticket = await createTicket(
        createData,
        user.id,
        workspace.id,
        workspaceURL,
      );
    } else {
      const updateData = UpdateTicketSchema.parse(action.data);
      if (force) {
        const version = await findTicketVersion(updateData.id);
        updateData.version = version;
      }
      ticket = await updateTicket(
        updateData,
        user.id,
        workspace.id,
        workspaceURL,
      );
    }

    if (ticket.project?.id) {
      revalidatePath(
        `${workspaceURI}/ticketing/projects/${ticket.project.id}/tickets`,
      );
    }

    return {
      error: false,
      data: {id: ticket.id},
    };
  } catch (e) {
    if (e instanceof Error) {
      if (e.name === VERSION_MISMATCH_ERROR) {
        return {error: true, message: e.name};
      }
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
  force?: boolean,
): ActionResponse<true> {
  const {workspaceURL, data} = props;

  const {error, message, auth} = await ensureAuth(workspaceURL);
  if (error) return {error: true, message};
  const {user, workspace} = auth;

  try {
    const updateData = UpdateTicketSchema.parse({
      ...data,
      assignment: ASSIGNMENT.PROVIDER,
    });

    if (force) {
      const version = await findTicketVersion(updateData.id);
      updateData.version = version;
    }

    const update =
      workspace.config.ticketStatusChangeMethod === STATUS_CHANGE_METHOD.WS
        ? updateTicketViaWS
        : updateTicket;

    await update(updateData, user.id, workspace.id, workspaceURL);
    return {
      error: false,
      data: true,
    };
  } catch (e) {
    if (e instanceof Error) {
      if (e.name === VERSION_MISMATCH_ERROR) {
        return {error: true, message: e.name};
      }
      return {error: true, message: e.message};
    }
    throw e;
  }
}

export async function closeTicket(
  props: TicketActionProps,
  force?: boolean,
): ActionResponse<true> {
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

    if (force) {
      const version = await findTicketVersion(updateData.id);
      updateData.version = version;
    }

    const update =
      workspace.config.ticketStatusChangeMethod === STATUS_CHANGE_METHOD.WS
        ? updateTicketViaWS
        : updateTicket;

    await update(updateData, user.id, workspace.id, workspaceURL);

    //TODO: tickets path needs to be revalidated
    return {
      error: false,
      data: true,
    };
  } catch (e) {
    if (e instanceof Error) {
      if (e.name === VERSION_MISMATCH_ERROR) {
        return {error: true, message: e.name};
      }
      return {error: true, message: e.message};
    }
    throw e;
  }
}

export async function cancelTicket(
  props: TicketActionProps,
  force?: boolean,
): ActionResponse<true> {
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

    if (force) {
      const version = await findTicketVersion(updateData.id);
      updateData.version = version;
    }

    const update =
      workspace.config.ticketStatusChangeMethod === STATUS_CHANGE_METHOD.WS
        ? updateTicketViaWS
        : updateTicket;

    await update(updateData, user.id, workspace.id, workspaceURL);
    return {
      error: false,
      data: true,
    };
  } catch (e) {
    if (e instanceof Error) {
      if (e.name === VERSION_MISMATCH_ERROR) {
        return {error: true, message: e.name};
      }
      return {error: true, message: e.message};
    }
    throw e;
  }
}

type CreateLinkProps = {
  workspaceURL: string;
  data: {currentTicketId: ID; linkTicketId: ID; linkType: ID};
};

export async function createLink(props: CreateLinkProps): ActionResponse<true> {
  const {workspaceURL, data} = props;

  const {error, message, auth} = await ensureAuth(workspaceURL);
  if (error) return {error: true, message};
  const {user, workspace} = auth;

  try {
    await createTicketLink(data, user.id, workspace.id);
    return {
      error: false,
      data: true,
    };
  } catch (e) {
    if (e instanceof Error) {
      if (e.name === VERSION_MISMATCH_ERROR) {
        return {error: true, message: e.name};
      }
      return {error: true, message: e.message};
    }
    throw e;
  }
}

type DeleteLinkProps = {
  workspaceURL: string;
  data: {currentTicketId: ID; linkTicketId: ID; linkId: ID};
};

export async function deleteLink(props: DeleteLinkProps): ActionResponse<ID> {
  const {workspaceURL, data} = props;

  const {error, message, auth} = await ensureAuth(workspaceURL);
  if (error) return {error: true, message};
  const {user, workspace} = auth;

  try {
    const count = await deleteTicketLink(data, user.id, workspace.id);
    return {
      error: false,
      data: count,
    };
  } catch (e) {
    if (e instanceof Error) {
      if (e.name === VERSION_MISMATCH_ERROR) {
        return {error: true, message: e.name};
      }
      return {error: true, message: e.message};
    }
    throw e;
  }
}

export async function searchTickets({
  search,
  workspaceURL,
  projectId,
  excludeList,
}: {
  search?: string;
  workspaceURL: string;
  projectId?: ID;
  excludeList?: ID[];
}): ActionResponse<Cloned<TicketSearch>[]> {
  const {error, message, auth} = await ensureAuth(workspaceURL);
  if (error) {
    return {error: true, message};
  }
  const {user, workspace} = auth;

  const tickets = await findTicketsBySearch({
    search,
    userId: user.id,
    workspaceId: workspace.id,
    projectId,
    excludeList,
  });
  return {error: false, data: clone(tickets)};
}

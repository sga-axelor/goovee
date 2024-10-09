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
  createRelatedTicketLink,
  deleteRelatedTicketLink,
  findTicketsBySearch,
  findTicketVersion,
  TicketSearch,
  updateTicket,
  updateTicketViaWS,
  createChildTicketLink,
  deleteChildTicketLink,
} from '../orm/tickets';
import {CreateTicketSchema, UpdateTicketSchema} from '../schema';
import {ensureAuth} from '../utils/auth-helper';
import type {ActionResponse, MutateProps} from './types';

export type MutateResponse = {id: string; version: number};
export async function mutate(
  props: MutateProps,
  force?: boolean,
): ActionResponse<MutateResponse> {
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
      data: {id: ticket.id, version: ticket.version},
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

type UpdateAssignmentProps = {
  workspaceURL: string;
  data: {id: string; version: number; assignment: number};
};

export async function updateAssignment(
  props: UpdateAssignmentProps,
  force?: boolean,
): ActionResponse<true> {
  const {workspaceURL, data} = props;

  const {error, message, auth} = await ensureAuth(workspaceURL);
  if (error) return {error: true, message};
  const {user, workspace} = auth;

  try {
    const updateData = UpdateTicketSchema.parse({
      ...data,
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

type TicketActionProps = {
  workspaceURL: string;
  data: {id: string; version: number};
};

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

type CreateRelatedLinkProps = {
  workspaceURL: string;
  data: {currentTicketId: ID; linkTicketId: ID; linkType: ID};
};

export async function createRelatedLink(
  props: CreateRelatedLinkProps,
): ActionResponse<true> {
  const {workspaceURL, data} = props;

  const {error, message, auth} = await ensureAuth(workspaceURL);
  if (error) return {error: true, message};
  const {user, workspace} = auth;

  try {
    await createRelatedTicketLink(data, user.id, workspace.id);
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

type CreateChildLinkProps = {
  workspaceURL: string;
  data: {currentTicketId: ID; linkTicketId: ID};
};

export async function createChildLink(
  props: CreateChildLinkProps,
): ActionResponse<true> {
  const {workspaceURL, data} = props;

  const {error, message, auth} = await ensureAuth(workspaceURL);
  if (error) return {error: true, message};
  const {user, workspace} = auth;

  try {
    await createChildTicketLink(data, user.id, workspace.id);
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

type DeleteChildLinkProps = {
  workspaceURL: string;
  data: {currentTicketId: ID; linkTicketId: ID};
};

export async function deleteChildLink(
  props: DeleteChildLinkProps,
): ActionResponse<true> {
  const {workspaceURL, data} = props;

  const {error, message, auth} = await ensureAuth(workspaceURL);
  if (error) return {error: true, message};
  const {user, workspace} = auth;

  try {
    await deleteChildTicketLink(data, user.id, workspace.id);
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

type DeleteRelatedLinkProps = {
  workspaceURL: string;
  data: {currentTicketId: ID; linkTicketId: ID; linkId: ID};
};

export async function deleteRelatedLink(
  props: DeleteRelatedLinkProps,
): ActionResponse<ID> {
  const {workspaceURL, data} = props;

  const {error, message, auth} = await ensureAuth(workspaceURL);
  if (error) return {error: true, message};
  const {user, workspace} = auth;

  try {
    const count = await deleteRelatedTicketLink(data, user.id, workspace.id);
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

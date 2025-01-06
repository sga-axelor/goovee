'use server';

import {revalidatePath} from 'next/cache';
import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {TENANT_HEADER} from '@/middleware';
import {t} from '@/locale/server';
import {clone} from '@/utils';
import type {ID} from '@goovee/orm';
import type {Cloned} from '@/types/util';

// ---- LOCAL IMPORTS ---- //
import {MUTATE_TYPE, STATUS_CHANGE_METHOD} from '../constants';
import {findTicketCancelledStatus, findTicketDoneStatus} from '../orm/projects';
import type {TicketSearch} from '../types';
import {
  createChildTicketLink,
  createParentTicketLink,
  createRelatedTicketLink,
  createTicket,
  deleteChildTicketLink,
  deleteParentTicketLink,
  deleteRelatedTicketLink,
  findTicketsBySearch,
  findTicketVersion,
  updateTicket,
  updateTicketByWS,
} from '../orm/tickets';
import {ensureAuth} from '../utils/auth-helper';
import {CreateTicketSchema, UpdateTicketSchema} from '../utils/validators';
import {handleError} from './helpers';
import type {ActionConfig, ActionResponse, MutateProps} from './types';

export type MutateResponse = {id: string; version: number};

export async function mutate(
  props: MutateProps,
  config?: ActionConfig,
): ActionResponse<MutateResponse> {
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required.'),
    };
  }

  const {workspaceURL, workspaceURI, action} = props;

  const {force} = config || {};

  const {error, message, info} = await ensureAuth(workspaceURL, tenantId);

  if (error) return {error: true, message};

  const {auth} = info;

  try {
    let ticket;
    if (action.type === MUTATE_TYPE.CREATE) {
      const createData = CreateTicketSchema.parse(action.data);
      ticket = await createTicket({data: createData, workspaceURL, auth});
    } else {
      const updateData = UpdateTicketSchema.parse(action.data);
      if (force) {
        const version = await findTicketVersion(updateData.id, tenantId);
        updateData.version = version;
      }
      ticket = await updateTicket({data: updateData, workspaceURL, auth});
    }

    if (ticket.project?.id) {
      revalidatePath(
        `${workspaceURI}/ticketing/projects/${ticket.project.id}/tickets`,
      );
    }

    return {
      success: true,
      data: {id: ticket.id, version: ticket.version},
    };
  } catch (e) {
    return handleError(e);
  }
}

export type UpdateAssignmentProps = {
  workspaceURL: string;
  data: {id: string; version: number; assignment: number};
};

export async function updateAssignment(
  props: UpdateAssignmentProps,
  config?: ActionConfig,
): ActionResponse<true> {
  const {workspaceURL, data} = props;
  const {force} = config || {};

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required.'),
    };
  }

  const {error, message, info} = await ensureAuth(workspaceURL, tenantId);

  if (error) return {error: true, message};

  const {workspace, auth} = info;

  try {
    const updateData = UpdateTicketSchema.parse({
      ...data,
    });

    if (force) {
      const version = await findTicketVersion(updateData.id, tenantId);
      updateData.version = version;
    }

    const update =
      workspace.config.ticketStatusChangeMethod === STATUS_CHANGE_METHOD.WS
        ? updateTicketByWS
        : updateTicket;

    await update({data: updateData, workspaceURL, auth});
    return {success: true, data: true};
  } catch (e) {
    return handleError(e);
  }
}

export type TicketActionProps = {
  workspaceURL: string;
  data: {id: string; version: number};
};

export async function closeTicket(
  props: TicketActionProps,
  config?: ActionConfig,
): ActionResponse<true> {
  const {workspaceURL, data} = props;
  const {force} = config || {};

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required.'),
    };
  }

  const {error, message, info} = await ensureAuth(workspaceURL, tenantId);

  if (error) return {error: true, message};

  const {workspace, auth} = info;

  try {
    const status = await findTicketDoneStatus(tenantId);

    if (!status) {
      return {
        error: true,
        message: await t('Done status not configured'),
      };
    }

    const updateData = UpdateTicketSchema.parse({...data, status});

    if (force) {
      const version = await findTicketVersion(updateData.id, tenantId);
      updateData.version = version;
    }

    const update =
      workspace.config.ticketStatusChangeMethod === STATUS_CHANGE_METHOD.WS
        ? updateTicketByWS
        : updateTicket;

    await update({data: updateData, workspaceURL, auth});

    return {success: true, data: true};
  } catch (e) {
    return handleError(e);
  }
}

export async function cancelTicket(
  props: TicketActionProps,
  config?: ActionConfig,
): ActionResponse<true> {
  const {workspaceURL, data} = props;
  const {force} = config || {};

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required.'),
    };
  }

  const {error, message, info} = await ensureAuth(workspaceURL, tenantId);

  if (error) return {error: true, message};

  const {workspace, auth} = info;

  try {
    const status = await findTicketCancelledStatus(tenantId);
    if (!status) {
      return {
        error: true,
        message: await t('Cancelled status not configured'),
      };
    }

    const updateData = UpdateTicketSchema.parse({...data, status});

    if (force) {
      const version = await findTicketVersion(updateData.id, tenantId);
      updateData.version = version;
    }

    const update =
      workspace.config.ticketStatusChangeMethod === STATUS_CHANGE_METHOD.WS
        ? updateTicketByWS
        : updateTicket;

    await update({data: updateData, workspaceURL, auth});

    return {success: true, data: true};
  } catch (e) {
    return handleError(e);
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

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required.'),
    };
  }

  const {error, message, info} = await ensureAuth(workspaceURL, tenantId);

  if (error) return {error: true, message};

  const {auth} = info;

  try {
    await createRelatedTicketLink({data, auth});
    return {success: true, data: true};
  } catch (e) {
    return handleError(e);
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

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required.'),
    };
  }

  const {error, message, info} = await ensureAuth(workspaceURL, tenantId);

  if (error) return {error: true, message};

  const {auth} = info;

  try {
    await createChildTicketLink({data, auth});

    return {success: true, data: true};
  } catch (e) {
    return handleError(e);
  }
}

export async function createParentLink(
  props: CreateChildLinkProps,
): ActionResponse<true> {
  const {workspaceURL, data} = props;

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required.'),
    };
  }

  const {error, message, info} = await ensureAuth(workspaceURL, tenantId);

  if (error) return {error: true, message};

  const {auth} = info;

  try {
    await createParentTicketLink({data, auth});
    return {success: true, data: true};
  } catch (e) {
    return handleError(e);
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

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required.'),
    };
  }

  const {error, message, info} = await ensureAuth(workspaceURL, tenantId);

  if (error) return {error: true, message};

  const {auth} = info;

  try {
    await deleteChildTicketLink({data, auth});
    return {success: true, data: true};
  } catch (e) {
    return handleError(e);
  }
}

type DeleteParentLinkProps = {
  workspaceURL: string;
  data: {currentTicketId: ID; linkTicketId: ID};
};

export async function deleteParentLink(
  props: DeleteParentLinkProps,
): ActionResponse<true> {
  const {workspaceURL, data} = props;

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required.'),
    };
  }

  const {error, message, info} = await ensureAuth(workspaceURL, tenantId);

  if (error) return {error: true, message};

  const {auth} = info;

  try {
    await deleteParentTicketLink({data, auth});
    return {success: true, data: true};
  } catch (e) {
    return handleError(e);
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

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required.'),
    };
  }

  const {error, message, info} = await ensureAuth(workspaceURL, tenantId);

  if (error) return {error: true, message};

  const {auth} = info;

  try {
    const count = await deleteRelatedTicketLink({data, auth});

    return {success: true, data: count};
  } catch (e) {
    return handleError(e);
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
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required.'),
    };
  }

  const {error, message, info} = await ensureAuth(workspaceURL, tenantId);

  if (error) {
    return {error: true, message};
  }
  const {auth} = info;

  const tickets = await findTicketsBySearch({
    search,
    projectId,
    excludeList,
    auth,
  });

  return {success: true, data: clone(tickets)};
}

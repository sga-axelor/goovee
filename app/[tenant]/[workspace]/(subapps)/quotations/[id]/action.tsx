'use server';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {SUBAPP_CODES} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {getWhereClause} from '@/subapps/quotations/common/utils/quotations';
import {findQuotation} from '../common/orm/quotations';

export async function confirmQuotation({
  workspaceURL,
  quotationId,
}: {
  workspaceURL: string;
  quotationId: string;
}) {
  if (!(workspaceURL && quotationId)) {
    return {
      error: true,
      message: i18n.get('Bad request'),
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
    code: SUBAPP_CODES.quotations,
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

  const {isContact, id, mainPartnerId} = session?.user;

  const {role} = subapp;

  const where = getWhereClause(isContact, role, id, mainPartnerId);

  const quotation = await findQuotation(quotationId, {where});

  if (!quotation) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  /**
   * TODO
   *
   * Convert to order
   */

  return {
    success: true,
    order: {id: quotationId},
  };
}

export async function confirmPayment() {}

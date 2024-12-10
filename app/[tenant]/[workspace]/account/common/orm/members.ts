// ---- CORE IMPORTS ---- //
import {SUBAPP_WITH_ROLES} from '@/constants';
import {getSession} from '@/lib/core/auth';
import {isAdminContact, isPartner} from '@/orm/partner';
import {findSubapps, findWorkspaceMembers} from '@/orm/workspace';
import {type Tenant, manager} from '@/tenant';
import type {PortalWorkspace} from '@/types';
import {clone} from '@/utils';

export async function findAvailableSubapps({
  url,
  tenantId,
}: {
  url: PortalWorkspace['url'];
  tenantId: Tenant['id'];
}) {
  if (!(url && tenantId)) {
    return [];
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return [];
  }

  const apps = findSubapps({
    url,
    user: {
      id: user?.isContact ? user.mainPartnerId! : user.id,
    } as any,
    tenantId,
  })
    .then(clone)
    .then(apps =>
      apps
        .filter(a => a.id)
        .map(({id, name, code}) => ({
          id,
          name,
          code,
          authorization: SUBAPP_WITH_ROLES.includes(code),
        })),
    );

  return apps;
}

export async function findMembers({
  workspaceURL,
  tenantId,
}: {
  workspaceURL: PortalWorkspace['url'];
  tenantId: Tenant['id'];
}) {
  if (!tenantId) {
    return [];
  }

  const client = await manager.getClient(tenantId);

  if (!client) {
    return [];
  }

  const admin = await isPartner();

  let adminContact;
  if (!admin) {
    adminContact = await isAdminContact({tenantId, workspaceURL});
    if (!adminContact) return [];
  }

  const workspaceMembers = await findWorkspaceMembers({
    url: workspaceURL,
    tenantId,
  }).then(clone);

  if (admin) {
    return workspaceMembers.contacts;
  }

  if (adminContact) {
    return workspaceMembers.contacts.filter(
      (c: any) => c.id !== adminContact.id,
    );
  }
}

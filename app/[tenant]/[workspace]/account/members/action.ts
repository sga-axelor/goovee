'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {getTranslation} from '@/i18n/server';
import {getSession} from '@/auth';
import {TENANT_HEADER} from '@/middleware';
import {findWorkspace, findWorkspaceMembers} from '@/orm/workspace';
import {isAdminContact, isPartner, updatePartner} from '@/orm/partner';
import {manager} from '@/tenant';
import {clone} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import {findInviteById} from '../common/orm/invites';
import {findAvailableSubapps} from '../common/orm/members';
import {Authorization} from '../common/types';

function error(message: string) {
  return {
    error: true,
    message,
  };
}

async function canUpdate({workspaceURL}: {workspaceURL: string}) {
  if (!workspaceURL) {
    return false;
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return false;
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return false;
  }

  const workspace = await findWorkspace({url: workspaceURL, user, tenantId});

  if (!workspace) {
    return false;
  }

  const isPartnerUser = await isPartner();
  const isAdminContactUser = await isAdminContact({workspaceURL, tenantId});

  const canDelete = isPartnerUser || isAdminContactUser;

  if (!canDelete) {
    return false;
  }

  return true;
}

export async function updateInviteApplication({
  workspaceURL,
  invite,
  app,
  value,
}: {
  workspaceURL: string;
  invite: {id: string};
  app: {id: string; code: string};
  value: 'yes' | 'no';
}) {
  const canUpdateInvite = await canUpdate({workspaceURL});

  if (!canUpdateInvite) {
    return error(await getTranslation('Unauthorized'));
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(await getTranslation('Bad Request'));
  }

  const client = await manager.getClient(tenantId);

  if (!client) {
    return error(await getTranslation('Bad Request'));
  }

  const $invite = await findInviteById({id: invite.id, tenantId});

  if (!$invite) {
    return error(await getTranslation('Bad Request'));
  }

  const availableApps = await findAvailableSubapps({
    url: workspaceURL,
    tenantId,
  });

  const $app = availableApps.find(a => a.code === app.code);

  if (!$app) {
    return error(await getTranslation('Bad Request'));
  }

  const contactConfig: any = $invite?.contactAppPermissionList?.[0];

  if (!contactConfig) {
    return error(await getTranslation('Invalid operation'));
  }

  const existingApp = contactConfig?.contactAppPermissionList.find(
    (a: any) => a.app.code === $app.code,
  );

  try {
    const data: any = {
      id: contactConfig.id,
      version: contactConfig.version,
    };

    if (value === 'yes' && !existingApp) {
      data.contactAppPermissionList = {
        create: [
          {
            app: {
              select: {
                id: $app.id,
              },
            },
            roleSelect: Authorization.restricted,
          },
        ],
      };
    } else if (value === 'no') {
      if (existingApp) {
        data.contactAppPermissionList = {
          remove: [existingApp.id],
        };
      }
    }

    const updatedConfig = await client.aOSPortalContactWorkspaceConfig.update({
      data,
    });

    return {
      success: true,
      data: await findInviteById({id: invite.id, tenantId}),
    };
  } catch (err) {
    console.log(err);
    return error(await getTranslation('Error updating invite. Try again.'));
  }
}

export async function updateInviteAuthentication({
  workspaceURL,
  invite,
  app,
  value,
}: {
  workspaceURL: string;
  invite: {id: string};
  app: {id: string; code: string};
  value: Authorization;
}) {
  const canUpdateInvite = await canUpdate({workspaceURL});

  if (!canUpdateInvite) {
    return error(await getTranslation('Unauthorized'));
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(await getTranslation('Bad Request'));
  }

  const client = await manager.getClient(tenantId);

  if (!client) {
    return error(await getTranslation('Bad Request'));
  }

  const $invite = await findInviteById({id: invite.id, tenantId});

  if (!$invite) {
    return error(await getTranslation('Bad Request'));
  }

  const availableApps = await findAvailableSubapps({
    url: workspaceURL,
    tenantId,
  });

  const $app = availableApps.find(a => a.code === app.code);

  if (!$app) {
    return error(await getTranslation('Bad Request'));
  }

  const contactConfig: any = $invite?.contactAppPermissionList?.[0];

  if (!contactConfig) {
    return error(await getTranslation('Invalid operation'));
  }

  const existingApp = contactConfig?.contactAppPermissionList.find(
    (a: any) => a.app.code === $app.code,
  );

  if (!existingApp) {
    return error(await getTranslation('Invalid operation'));
  }

  try {
    const updatedConfig = await client.aOSPortalContactWorkspaceConfig.update({
      data: {
        id: contactConfig.id,
        version: contactConfig.version,
        contactAppPermissionList: {
          update: [
            {
              id: existingApp.id,
              version: existingApp.version,
              roleSelect: value,
            },
          ],
        },
      },
    });

    return {
      success: true,
      data: await findInviteById({id: invite.id, tenantId}),
    };
  } catch (err) {
    console.log(err);
    return error(await getTranslation('Error updating invite. Try again.'));
  }
}

export async function deleteMember({
  member,
  workspaceURL,
}: {
  member: {id: string; email: string};
  workspaceURL: string;
}) {
  const canUpdateInvite = await canUpdate({workspaceURL});

  if (!canUpdateInvite) {
    return error(await getTranslation('Unauthorized'));
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(await getTranslation('Bad Request'));
  }

  const client = await manager.getClient(tenantId);

  if (!client) {
    return error(await getTranslation('Bad Request'));
  }

  const adminContact = await isAdminContact({workspaceURL, tenantId});

  const members = await findWorkspaceMembers({tenantId, url: workspaceURL});

  const isPartner = members?.partners?.find(p => p.id === member.id);

  if (isPartner && adminContact) {
    return error(await getTranslation('Unauthorized')); // admin contact cannot remove partner
  }

  let $member =
    isPartner || members?.contacts?.find((c: any) => c.id === member.id);

  if (!$member?.contactWorkspaceConfig?.id) {
    return error(await getTranslation('Bad Request'));
  }

  try {
    const updatedPartner = await updatePartner({
      data: {
        id: $member.id,
        version: $member.version,
        contactWorkspaceConfigSet: {
          remove: [$member.contactWorkspaceConfig?.id],
        },
      },
      tenantId,
    }).then(clone);

    return {
      success: true,
      data: updatedPartner,
    };
  } catch (err) {
    return error(await getTranslation('Error updating member. Try again.'));
  }
}

export async function updateMemberApplication({
  workspaceURL,
  member,
  app,
  value,
}: {
  workspaceURL: string;
  member: {id: string; email: string};
  app: {id: string; code: string};
  value: 'yes' | 'no';
}) {
  const canUpdateInvite = await canUpdate({workspaceURL});

  if (!canUpdateInvite) {
    return error(await getTranslation('Unauthorized'));
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(await getTranslation('Bad Request'));
  }

  const client = await manager.getClient(tenantId);

  if (!client) {
    return error(await getTranslation('Bad Request'));
  }

  const members = await findWorkspaceMembers({tenantId, url: workspaceURL});

  let $member = members?.contacts?.find((c: any) => c.id === member.id);

  if (!$member) {
    return error(await getTranslation('Bad Request'));
  }

  const availableApps = await findAvailableSubapps({
    url: workspaceURL,
    tenantId,
  });

  const $app = availableApps.find(a => a.code === app.code);

  if (!$app) {
    return error(await getTranslation('Bad Request'));
  }

  const contactConfig: any = $member?.contactWorkspaceConfig;

  if (!contactConfig) {
    return error(await getTranslation('Invalid operation'));
  }

  const existingApp = contactConfig?.contactAppPermissionList?.find(
    (a: any) => a.app.code === $app.code,
  );

  try {
    const data: any = {
      id: contactConfig.id,
      version: contactConfig.version,
    };

    if (value === 'yes' && !existingApp) {
      data.contactAppPermissionList = {
        create: [
          {
            app: {
              select: {
                id: $app.id,
              },
            },
            roleSelect: Authorization.restricted,
          },
        ],
      };
    } else if (value === 'no') {
      if (existingApp) {
        data.contactAppPermissionList = {
          remove: [existingApp.id],
        };
      }
    }

    const updatedConfig = await client.aOSPortalContactWorkspaceConfig
      .update({
        data,
        select: {
          contactAppPermissionList: {
            select: {
              app: true,
              roleSelect: true,
            },
          },
        },
      })
      .then(clone);

    return {
      success: true,
      data: updatedConfig,
    };
  } catch (err) {
    console.log(err);
    return error(await getTranslation('Error updating invite. Try again.'));
  }
}

export async function updateMemberAuthentication({
  workspaceURL,
  member,
  app,
  value,
}: {
  workspaceURL: string;
  member: {id: string; email: string};
  app: {id: string; code: string};
  value: Authorization;
}) {
  const canUpdateInvite = await canUpdate({workspaceURL});

  if (!canUpdateInvite) {
    return error(await getTranslation('Unauthorized'));
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(await getTranslation('Bad Request'));
  }

  const client = await manager.getClient(tenantId);

  if (!client) {
    return error(await getTranslation('Bad Request'));
  }

  const members = await findWorkspaceMembers({tenantId, url: workspaceURL});

  let $member = members?.contacts?.find((c: any) => c.id === member.id);

  if (!$member) {
    return error(await getTranslation('Bad Request'));
  }

  const availableApps = await findAvailableSubapps({
    url: workspaceURL,
    tenantId,
  });

  const $app = availableApps.find(a => a.code === app.code);

  if (!$app) {
    return error(await getTranslation('Bad Request'));
  }

  const contactConfig: any = $member?.contactWorkspaceConfig;

  if (!contactConfig) {
    return error(await getTranslation('Invalid operation'));
  }

  const existingApp = contactConfig?.contactAppPermissionList?.find(
    (a: any) => a.app.code === $app.code,
  );

  if (!existingApp) {
    return error(await getTranslation('Invalid operation'));
  }

  try {
    const updatedConfig = await client.aOSPortalContactWorkspaceConfig
      .update({
        data: {
          id: contactConfig.id,
          version: contactConfig.version,
          contactAppPermissionList: {
            update: [
              {
                id: existingApp.id,
                version: existingApp.version,
                roleSelect: value,
              },
            ],
          },
        },
        select: {
          contactAppPermissionList: {
            select: {
              roleSelect: true,
              app: {
                code: true,
              },
            },
          },
        },
      })
      .then(clone);

    return {
      success: true,
      data: updatedConfig,
    };
  } catch (err) {
    console.log(err);
    return error(await getTranslation('Error updating invite. Try again.'));
  }
}

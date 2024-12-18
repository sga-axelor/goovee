'use server';

import {z} from 'zod';
import {headers} from 'next/headers';
import {revalidatePath} from 'next/cache';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {getTranslation} from '@/i18n/server';
import {TENANT_HEADER} from '@/middleware';
import {findPartnerByEmail, isAdminContact, isPartner} from '@/orm/partner';
import {findWorkspace} from '@/orm/workspace';
import NotificationManager, {NotificationType} from '@/notification';
import {SEARCH_PARAMS} from '@/constants';
import type {PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {inviteTemplate} from '../../common/constants/template';
import {
  findInviteForEmail,
  createInvite,
  findInviteById,
  deleteInviteById,
} from '../../common/orm/invites';
import {InviteAppsConfig, Role} from '../../common/types';
import {findAvailableSubapps} from '../../common/orm/members';

function error(message: string) {
  return {
    error: true,
    message,
  };
}

export async function deleteInvite({
  id,
  workspaceURL,
}: {
  id: string;
  workspaceURL: string;
}) {
  if (!(id && workspaceURL)) {
    return error(await getTranslation('Bad Request'));
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return error(await getTranslation('Unauthorized'));
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(await getTranslation('Bad Request'));
  }

  const workspace = await findWorkspace({url: workspaceURL, user, tenantId});

  if (!workspace) {
    return error(await getTranslation('Bad Request'));
  }

  const isPartnerUser = await isPartner();
  const isAdminContactUser = await isAdminContact({workspaceURL, tenantId});

  const canDelete = isPartnerUser || isAdminContactUser;

  if (!canDelete) {
    return error(await getTranslation('Unauthorized'));
  }

  const invite = await findInviteById({id, tenantId});

  const partnerId = (user?.isContact ? user.mainPartnerId : user.id)!;

  if (!(invite && invite?.partner?.id && invite.partner.id === partnerId)) {
    return error(await getTranslation('Invalid invite'));
  }

  try {
    const result = await deleteInviteById({id, tenantId});
    if (!result) {
      throw new Error();
    } else {
      return {
        success: true,
        message: await getTranslation('Invite deleted successfully'),
      };
    }
  } catch (err) {
    return error(await getTranslation('Error deleting invite.'));
  }
}

export async function sendInvites({
  workspaceURL,
  emails,
  role,
  apps,
}: {
  workspaceURL: PortalWorkspace['url'];
  emails: string;
  role: Role;
  apps: InviteAppsConfig;
}) {
  if (!(emails && workspaceURL && apps)) {
    return error(await getTranslation('Bad Request'));
  }

  let emailAddresses = emails
    .split(',')
    ?.map(email => email?.trim())
    .filter(Boolean);

  if (!emailAddresses) {
    return error(await getTranslation('Bad Request'));
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return error(await getTranslation('Unauthorized'));
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(await getTranslation('Bad Request'));
  }

  const workspace = await findWorkspace({url: workspaceURL, user, tenantId});

  if (!workspace) {
    return error(await getTranslation('Bad Request'));
  }

  const isPartnerUser = await isPartner();
  const isAdminContactUser = await isAdminContact({workspaceURL, tenantId});

  const canSendInvites = isPartnerUser || isAdminContactUser;

  if (!canSendInvites) {
    return error(await getTranslation('Unauthorized'));
  }

  const partner = await findPartnerByEmail(user.email, tenantId);

  if (!partner) {
    return error(await getTranslation('Unauthorized'));
  }

  let availableApps = [];

  try {
    availableApps = await findAvailableSubapps({
      url: workspaceURL,
      tenantId,
    });
  } catch (err) {
    return error(await getTranslation('Error sending invites'));
  }

  const filteredApps = Object.entries(apps).reduce((acc, [code, config]) => {
    const availableApp = availableApps.find((a: any) => a.code === code);
    if (config && availableApp) {
      acc[code] = {...config, id: availableApp.id};
    }
    return acc;
  }, {} as InviteAppsConfig);

  if (!Object.keys(filteredApps)?.length) {
    return error(await getTranslation('No apps available.'));
  }

  let inviteError;

  for (const email of emailAddresses) {
    try {
      z.string().email({message: 'Invalid email address'}).parse(email);

      const existingInvite = await findInviteForEmail({
        email,
        tenantId,
        workspaceURL,
      });

      if (existingInvite) {
        continue;
      }

      const invite = await createInvite({
        workspace,
        tenantId,
        email,
        role,
        apps: filteredApps,
        partnerId: (user.isContact ? user.mainPartnerId : user.id) as any,
      });

      if (!invite?.id) {
        inviteError = true;
        continue;
      }

      const mailService = NotificationManager.getService(NotificationType.mail);

      mailService?.notify(
        inviteTemplate({
          email,
          link: `${process.env.NEXT_PUBLIC_HOST}/auth/register/invite/${invite.id}?${SEARCH_PARAMS.TENANT_ID}=${tenantId}`,
        }),
      );
    } catch (err) {
      inviteError = true;
    }
  }

  if (inviteError) {
    return error(await getTranslation('Error sending invites, try again.'));
  } else {
    revalidatePath(`${workspace.url}/account/members`);
    return {
      success: true,
      message: await getTranslation('Invites send successfully.'),
    };
  }
}

'use server';

import {revalidatePath} from 'next/cache';

import {Tenant} from '@/tenant';
import {getTranslation} from '@/i18n/server';
import {
  findPartnerByEmail,
  registerContact,
  updatePartner,
} from '@/orm/partner';
import {deleteInviteById} from '@/app/[tenant]/[workspace]/account/common/orm/invites';
import {getSession} from '@/auth';
import {PortalWorkspace} from '@/types';

import {findInviteById} from '../../common/orm/register';

function error(message: string) {
  return {
    error: true,
    message,
  };
}

export async function register({
  firstName,
  name,
  email,
  password,
  tenantId,
  inviteId,
}: any) {
  if (!(name && email && password && tenantId && inviteId)) {
    return error(await getTranslation('Bad request'));
  }

  const invite = await findInviteById({id: inviteId, tenantId});

  if (!invite) {
    return error(await getTranslation('Invalid invite'));
  }

  if (!invite?.partner?.id) {
    return error(
      await getTranslation('No partner available for the workspace'),
    );
  }

  if (email !== invite.emailAddress?.address) {
    return error(await getTranslation('Bad request'));
  }

  const {workspace} = invite;

  if (!workspace) {
    return error(await 'Invalid workspace');
  }

  const $partner = await findPartnerByEmail(email, tenantId);

  if ($partner) {
    return error(await 'Already registered, try login and subscribing invite');
  }

  const contactConfig = invite?.contactAppPermissionList?.[0];

  try {
    const contact = await registerContact({
      email,
      name,
      firstName,
      password,
      tenantId,
      contactConfig,
      partnerId: invite.partner.id,
    });

    const uri = `${workspace.url.replace(process.env.NEXT_PUBLIC_HOST, '')}`;

    deleteInviteById({
      id: invite.id,
      tenantId,
    }).catch(err => {
      console.error(err);
    });

    return {
      success: true,
      data: {
        contact,
        query: `?callbackurl=${encodeURIComponent(uri)}&workspaceURI=${encodeURIComponent(uri)}&tenant=${tenantId}`,
      },
    };
  } catch (err) {
    return error(await getTranslation('Error registering contact. Try again.'));
  }
}

export async function subscribe({
  workspaceURL,
  tenantId,
  inviteId,
}: {
  workspaceURL: PortalWorkspace['url'];
  tenantId?: Tenant['id'] | null;
  inviteId: string;
}) {
  if (!(workspaceURL && inviteId && tenantId)) {
    return error(await getTranslation('Bad Request'));
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return error(await getTranslation('Unauthorized'));
  }

  const invite = await findInviteById({id: inviteId, tenantId});

  if (
    !(
      invite &&
      invite.partner &&
      invite.partner.id === user.mainPartnerId &&
      invite.emailAddress.address === user.email &&
      invite.workspace &&
      invite.workspace.url === workspaceURL
    )
  ) {
    return error(await getTranslation('Bad Request'));
  }

  const contactConfig = invite?.contactAppPermissionList?.[0];

  if (!contactConfig) {
    return error(await getTranslation('Bad Request'));
  }

  const $user = await findPartnerByEmail(user.email, tenantId);

  if (!$user) {
    return error(await getTranslation('User not found'));
  }

  const data = {
    id: $user?.id,
    version: $user.version,
    contactWorkspaceConfigSet: {select: [{id: contactConfig.id}]},
  } as any;

  try {
    const updatedUser = await updatePartner({
      data,
      tenantId,
    });

    revalidatePath('/', 'layout');
  } catch (err) {
    return error(await getTranslation('Error subscribing, try again.'));
  }

  deleteInviteById({
    id: invite.id,
    tenantId,
  }).catch(err => {
    console.error(err);
  });

  return {
    success: true,
    message: await getTranslation('Subscribed successfully.'),
  };
}

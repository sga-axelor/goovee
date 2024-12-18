'use server';

import {getTranslation} from '@/i18n/server';
import {findInviteById} from '../../common/orm/register';
import {findPartnerByEmail, registerContact} from '@/orm/partner';
import {deleteInviteById} from '@/app/[tenant]/[workspace]/account/common/orm/invites';

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
    return error(await 'Already registered');
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

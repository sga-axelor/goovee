'use server';

import {revalidatePath} from 'next/cache';

import {Tenant} from '@/tenant';
import {t} from '@/locale/server';
import {
  findPartnerByEmail,
  registerContact,
  updatePartner,
} from '@/orm/partner';
import {deleteInviteById} from '@/app/[tenant]/[workspace]/account/common/orm/invites';
import {getSession} from '@/auth';
import {PortalWorkspace} from '@/types';
import {findOne, isValid} from '@/otp/orm';
import {Scope} from '@/otp/constants';

import {findInviteById} from '../../common/orm/register';

function error(message: string) {
  return {
    error: true,
    message,
  };
}

type RegisterDTO = {
  firstName: string;
  name: string;
  email: string;
  otp?: string;
  password?: string;
  tenantId: string;
  inviteId: string;
};

export async function register({
  firstName,
  name,
  email,
  password,
  tenantId,
  inviteId,
}: RegisterDTO) {
  if (!(name && tenantId && inviteId)) {
    return error(await t('Bad request'));
  }

  const invite = await findInviteById({id: inviteId, tenantId});

  if (!invite) {
    return error(await t('Invalid invite'));
  }

  if (!invite?.partner?.id) {
    return error(await t('No partner available for the workspace'));
  }

  if (email !== invite.emailAddress?.address) {
    return error(await t('Bad request'));
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

    revalidatePath('/', 'layout');

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
        query: `?callbackurl=${encodeURIComponent(`${invite.workspace?.url}/`)}&workspaceURI=${encodeURIComponent(`${uri}/`)}&tenant=${tenantId}`,
      },
    };
  } catch (err) {
    return error(await t('Error registering contact. Try again.'));
  }
}

export async function registerByEmail(data: RegisterDTO) {
  const {email, password, otp, tenantId} = data;

  if (!tenantId) {
    return error(await t('TenantId is required'));
  }

  if (!(email && password)) {
    return error(await t('Bad request', {tenantId}));
  }

  if (!otp) {
    return error(
      await t('OTP is required.', {
        tenantId,
      }),
    );
  }

  const otpResult = await findOne({
    scope: Scope.Registration,
    entity: email,
    tenantId,
  });

  if (!otpResult) {
    return error(
      await t('Invalid OTP', {
        tenantId,
      }),
    );
  }

  if (!(await isValid({id: otpResult.id, value: otp, tenantId}))) {
    return error(
      await t('Invalid OTP', {
        tenantId,
      }),
    );
  }

  return register(data);
}

export async function registerByGoogle(
  data: Omit<RegisterDTO, 'password' | 'email' | 'otp'>,
) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return error(await t('Login with google to register'));
  }

  return register({...data, email: user.email});
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
    return error(await t('Bad request'));
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return error(await t('Unauthorized'));
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
    return error(await t('Bad request'));
  }

  const contactConfig = invite?.contactAppPermissionList?.[0];

  if (!contactConfig) {
    return error(await t('Bad request'));
  }

  const $user = await findPartnerByEmail(user.email, tenantId);

  if (!$user) {
    return error(await t('User not found'));
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
    return error(await t('Error subscribing, try again'));
  }

  deleteInviteById({
    id: invite.id,
    tenantId,
  }).catch(err => {
    console.error(err);
  });

  return {
    success: true,
    message: await t('Subscribed successfully.'),
  };
}

export async function fetchUpdatedSession({tenantId}: {tenantId: string}) {
  if (!tenantId) {
    return null;
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return null;
  }

  const partner = await findPartnerByEmail(user.email, tenantId);

  if (!partner) {
    return null;
  }

  return {
    id: partner.id,
    email: user.email,
    tenantId,
  };
}

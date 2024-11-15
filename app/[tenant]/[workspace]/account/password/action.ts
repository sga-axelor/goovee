'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {compare, hash} from '@/auth/utils';
import {i18n} from '@/i18n';
import {findPartnerByEmail} from '@/orm/partner';
import {TENANT_HEADER} from '@/middleware';
import {manager} from '@/tenant';

export async function changePassword({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) {
  if (!(oldPassword && newPassword)) {
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

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: i18n.get('Bad request'),
    };
  }

  const partner = await findPartnerByEmail(user?.email, tenantId);

  if (!partner?.password) {
    return {
      error: true,
      message: i18n.get('Bad request.'),
    };
  }

  const isOldPasswordMatch = await compare(oldPassword, partner.password);

  if (!isOldPasswordMatch) {
    return {
      error: true,
      message: i18n.get('Invalid old password'),
    };
  }

  const hashedNewPassword = await hash(newPassword);

  const client = await manager.getClient(tenantId);

  try {
    await client.aOSPartner.update({
      data: {
        id: partner.id,
        version: partner.version,
        password: hashedNewPassword,
      },
    });
  } catch (err) {
    return {
      error: true,
      message: i18n.get('Error setting new password. Try again.'),
    };
  }

  return {
    success: true,
    message: i18n.get('Password changed successfully.'),
  };
}

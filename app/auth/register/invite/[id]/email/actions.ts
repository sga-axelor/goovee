'use server';

import {generateOTP as coreGenerateOTP} from '@/otp/actions';
import {getTranslation} from '@/i18n/server';
import {Scope} from '@/otp/constants';
import {findWorkspace} from '@/orm/workspace';
import {type Tenant} from '@/tenant';
import {findInviteById} from '../../../common/orm/register';

function error(message: string) {
  return {
    error: true,
    message,
  };
}

export async function generateOTP({
  inviteId,
  tenantId,
}: {
  inviteId: string;
  tenantId: Tenant['id'];
}) {
  if (!(inviteId && tenantId)) {
    return error(await getTranslation('Invitation and Tenant is required'));
  }

  const invite = await findInviteById({
    id: inviteId,
    tenantId,
  });

  if (!(invite?.workspace && invite?.partner)) {
    return error(await getTranslation('Bad Request'));
  }

  const workspace = await findWorkspace({
    url: invite.workspace.url,
    user: {
      id: invite.partner.id,
    } as any,
    tenantId,
  });

  if (!workspace?.config) {
    return error(await getTranslation('Bad Request'));
  }

  const email = invite?.emailAddress?.address;

  if (
    !(workspace.config.emailAccount && workspace.config.otpTemplateList?.length)
  ) {
    return coreGenerateOTP({
      email,
      scope: Scope.Registration,
      tenantId,
    });
  } else {
    const {emailAccount, otpTemplateList} = workspace.config;
    const localization = invite.partner?.localization?.code;

    let template =
      localization &&
      otpTemplateList.find(
        (t: any) => t?.localization?.code === localization,
      );

    if (!template) {
      template = otpTemplateList?.[0];
    }

    return coreGenerateOTP({
      email,
      scope: Scope.Registration,
      tenantId,
      mailConfig: {
        emailAccount,
        template: template?.template,
      },
    });
  }
}

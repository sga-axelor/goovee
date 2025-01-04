'use server';

import {generateOTP as coreGenerateOTP} from '@/otp/actions';
import {getTranslation} from '@/i18n/server';
import {Scope} from '@/otp/constants';
import {type Tenant} from '@/tenant';
import {findDefaultPartnerWorkspaceConfig} from '@/orm/workspace';

function error(message: string) {
  return {
    error: true,
    message,
  };
}

export async function generateOTP({
  email,
  workspaceURL,
  tenantId,
}: {
  email: string;
  workspaceURL?: string;
  tenantId: Tenant['id'];
}) {
  if (!(email && tenantId)) {
    return error(await getTranslation('Email, Scope and Tenant is required'));
  }

  const defaultPartnerWorkspaceConfig =
    workspaceURL &&
    (await findDefaultPartnerWorkspaceConfig({
      url: workspaceURL,
      tenantId,
    }));

  return coreGenerateOTP({
    email,
    scope: Scope.Registration,
    tenantId,
    mailConfig: {
      template:
        defaultPartnerWorkspaceConfig?.portalAppConfig?.otpTemplateList?.[0]
          ?.template,
    },
  });
}

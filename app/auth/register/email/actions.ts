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

  if (
    !(
      defaultPartnerWorkspaceConfig?.portalAppConfig?.emailAccount &&
      defaultPartnerWorkspaceConfig?.portalAppConfig?.otpTemplateList?.length
    )
  ) {
    return coreGenerateOTP({
      email,
      scope: Scope.Registration,
      tenantId,
    });
  } else {
    const {portalAppConfig} = defaultPartnerWorkspaceConfig;
    const {emailAccount, otpTemplateList} = portalAppConfig;

    const template = otpTemplateList?.[0];

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

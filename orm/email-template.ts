import lodash from 'lodash';

// ---- CORE IMPORTS ----//
import {manager, type Tenant} from '@/tenant';
import {clone} from '@/utils';
import type {ID} from '@/types';

export type MailConfig = {
  emailAccount: {
    login: string;
    password: string;
    host: string;
    port: string | number;
  };
  template: {
    subject?: string;
    content: string;
  };
};

export function isValidMailConfig(mailConfig: MailConfig): boolean {
  const hasEmailAccount =
    mailConfig?.emailAccount &&
    mailConfig?.emailAccount?.login &&
    mailConfig?.emailAccount?.password &&
    mailConfig?.emailAccount?.host &&
    mailConfig?.emailAccount?.port;

  const hasTemplate = mailConfig?.template && mailConfig?.template?.content;

  return Boolean(hasEmailAccount && hasTemplate);
}

export async function findOneById({
  id,
  tenantId,
}: {
  id: ID;
  tenantId: Tenant['id'];
}) {
  if (!(id && tenantId)) {
    return [];
  }

  const client = await manager.getClient(tenantId);

  if (!client) {
    return [];
  }

  const templates = await client.aOSPortalEmailTemplate
    .findOne({
      where: {
        id,
      },
      select: {
        otpPortalConfig: true,
        invitationPortalConfig: true,
        localization: true,
        template: true,
      },
    })
    .then(clone);

  return templates;
}

export function replacePlaceholders({
  content,
  values,
}: {
  content: string;
  values: any;
}) {
  if (!(content && values)) return;

  return content.replace(/\$\{([^}]+)\}/g, (placeholder: string) => {
    const key = placeholder.slice(2, -1);
    return lodash.get(values, key, placeholder);
  });
}

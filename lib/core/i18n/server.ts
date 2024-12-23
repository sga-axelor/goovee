'use server';

import {cache} from 'react';
import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {TENANT_HEADER} from '@/middleware';
import {manager, type Tenant} from '@/tenant';
import {DEFAULT_LANGUAGE_CODE} from '@/constants';
import {getLanguageCodeFromAcceptLanguage} from '@/utils/locale';
import {getSession} from '@/auth';
import type {User} from '@/types';

const getBundle = cache(async function getBundle(
  tenantId: Tenant['id'],
  language = 'en',
) {
  const client = await manager.getClient(tenantId);

  if (!client) return {};

  let translations = await client.aOSMetaTranslation.find({
    where: {
      language,
    },
  });

  const translationsJSON: any = {};

  translations?.forEach((t: any) => {
    translationsJSON[t.key] = t.value;
  });

  return translationsJSON;
});

export async function getTranslation(
  key: string,
  {
    tenantId,
    language,
    user,
  }: {tenantId?: Tenant['id']; language?: string; user?: User} = {
    tenantId: '',
    language: '',
  },
) {
  if (!tenantId) {
    tenantId = headers().get(TENANT_HEADER) as string;
  }

  if (!tenantId) return key;

  if (!user) {
    const session = await getSession();
    const $user = session?.user;
    if ($user?.language) {
      language = $user.language;
    }
  }

  if (!language) {
    const acceptLanguage = headers().get('Accept-Language')!;

    if (acceptLanguage) {
      const code = getLanguageCodeFromAcceptLanguage(acceptLanguage);
      if (code) language = code;
    }
  }

  if (!language) {
    language = DEFAULT_LANGUAGE_CODE;
  }

  const bundle = await getBundle(tenantId, language);

  return bundle[key] || key;
}

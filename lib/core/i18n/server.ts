'use server';

import {cache} from 'react';
import {TENANT_HEADER} from '@/middleware';
import {headers} from 'next/headers';
import {manager} from '@/tenant';
import {type Tenant} from '@/tenant';

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
  {tenantId, language}: {tenantId?: Tenant['id']; language?: string} = {
    tenantId: '',
    language: '',
  },
) {
  tenantId = tenantId || (headers().get(TENANT_HEADER) as string);

  if (!tenantId) return key;

  language = language || headers().get('Accept-Language') || 'en  ';

  const bundle = await getBundle(tenantId, language);

  return bundle[key] || key;
}

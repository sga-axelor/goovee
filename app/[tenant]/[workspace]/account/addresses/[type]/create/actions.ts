'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {createPartnerAddress} from '@/orm/address';
import {PartnerAddress} from '@/types';
import {clone} from '@/utils';
import {TENANT_HEADER} from '@/middleware';

export async function createAddress(values: Partial<PartnerAddress>) {
  const session = await getSession();
  const tenantId = headers().get(TENANT_HEADER);

  if (!(session && tenantId)) return null;

  const address = await createPartnerAddress(
    session.user?.id,
    values,
    tenantId,
  ).then(clone);

  return address;
}

'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';
import {updatePartnerAddress} from '@/orm/address';
import {PartnerAddress} from '@/types';
import {clone} from '@/utils';
import {TENANT_HEADER} from '@/middleware';

export async function updateAddress(values: Partial<PartnerAddress>) {
  const session = await getSession();
  const tenantId = headers().get(TENANT_HEADER);

  if (!(session && tenantId)) return null;

  const address = await updatePartnerAddress(
    session.user?.id,
    values,
    tenantId,
  ).then(clone);

  return address;
}

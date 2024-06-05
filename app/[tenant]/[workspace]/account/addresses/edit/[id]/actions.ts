'use server';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';
import {updatePartnerAddress} from '@/orm/address';
import {PartnerAddress} from '@/types';
import {clone} from '@/utils';

export async function updateAddress(values: Partial<PartnerAddress>) {
  const session = await getSession();

  if (!session) return null;

  const address = await updatePartnerAddress(session.user?.id, values).then(
    clone,
  );

  return address;
}

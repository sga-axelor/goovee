'use server';

// ---- CORE IMPORTS ---- //
import {
  findDefaultDeliveryAddress,
  findDefaultInvoicingAddress,
  findPartnerAddress,
} from '@/orm/address';
import {getSession} from '@/orm/auth';
import {clone} from '@/utils';
import type {ID} from '@/types';

export async function findInvoicingAddress() {
  const session = await getSession();
  const user = session?.user;

  if (!user) return null;

  return findDefaultInvoicingAddress(user.id).then(clone);
}

export async function findDeliveryAddress() {
  const session = await getSession();
  const user = session?.user;

  if (!user) return null;

  return findDefaultDeliveryAddress(user.id).then(clone);
}

export async function findAddress(id: ID) {
  const session = await getSession();
  const user = session?.user;

  if (!user) return null;

  return findPartnerAddress(id).then(clone);
}

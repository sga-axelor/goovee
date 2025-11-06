'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {TENANT_HEADER} from '@/middleware';
import {
  findDefaultDeliveryAddress,
  findDefaultInvoicingAddress,
  findDeliveryAddresses,
  findInvoicingAddresses,
  findPartnerAddress,
} from '@/orm/address';
import type {ID} from '@/types';
import {clone, getUserId} from '@/utils';

export async function findDefaultInvoicing() {
  const session = await getSession();
  const user = session?.user;

  const tenantId = headers().get(TENANT_HEADER);

  if (!(user && tenantId)) return null;

  const userId = getUserId(user);

  return findDefaultInvoicingAddress(userId, tenantId).then(clone);
}

export async function findDefaultDelivery() {
  const session = await getSession();
  const user = session?.user;

  const tenantId = headers().get(TENANT_HEADER);

  if (!(user && tenantId)) return null;

  const userId = getUserId(user);

  return findDefaultDeliveryAddress(userId, tenantId).then(clone);
}

export async function findAddress(id: ID) {
  const session = await getSession();
  const user = session?.user;

  const tenantId = headers().get(TENANT_HEADER);

  if (!(user && tenantId)) return null;

  const userId = getUserId(user);

  return findPartnerAddress({partnerId: userId, addressId: id, tenantId}).then(
    clone,
  );
}

export async function fetchDeliveryAddresses() {
  const session = await getSession();
  const user = session?.user;

  const tenantId = headers().get(TENANT_HEADER);

  if (!(user && tenantId)) return null;

  const userId = getUserId(user);

  return findDeliveryAddresses(userId, tenantId).then(clone);
}

export async function fetchInvoicingAddresses() {
  const session = await getSession();
  const user = session?.user;

  const tenantId = headers().get(TENANT_HEADER);

  if (!(user && tenantId)) return null;

  const userId = getUserId(user);

  return findInvoicingAddresses(userId, tenantId).then(clone);
}

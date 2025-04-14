'use server';

import {headers} from 'next/headers';

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
import {clone} from '@/utils';

export async function findDefaultInvoicing() {
  const session = await getSession();
  const user = session?.user;

  const tenantId = headers().get(TENANT_HEADER);

  if (!(user && tenantId)) return null;

  return findDefaultInvoicingAddress(user.id, tenantId).then(clone);
}

export async function findDefaultDelivery() {
  const session = await getSession();
  const user = session?.user;

  const tenantId = headers().get(TENANT_HEADER);

  if (!(user && tenantId)) return null;

  return findDefaultDeliveryAddress(user.id, tenantId).then(clone);
}

export async function findAddress(id: ID) {
  const session = await getSession();
  const user = session?.user;

  const tenantId = headers().get(TENANT_HEADER);

  if (!(user && tenantId)) return null;

  return findPartnerAddress(id, tenantId).then(clone);
}

export async function fetchDeliveryAddresses() {
  const session = await getSession();
  const user = session?.user;

  const tenantId = headers().get(TENANT_HEADER);

  if (!(user && tenantId)) return null;

  return findDeliveryAddresses(user.id, tenantId).then(clone);
}

export async function fetchInvoicingAddresses() {
  const session = await getSession();
  const user = session?.user;

  const tenantId = headers().get(TENANT_HEADER);

  if (!(user && tenantId)) return null;

  return findInvoicingAddresses(user.id, tenantId).then(clone);
}

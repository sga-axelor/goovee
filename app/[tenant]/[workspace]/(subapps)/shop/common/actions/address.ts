'use server';

import {headers} from 'next/headers';

import {getSession} from '@/auth';
import {TENANT_HEADER} from '@/middleware';
import {
  findDefaultDeliveryAddress,
  findDefaultInvoicingAddress,
  findPartnerAddress,
} from '@/orm/address';
import type {ID} from '@/types';
import {clone} from '@/utils';

export async function findInvoicingAddress() {
  const session = await getSession();
  const user = session?.user;

  const tenantId = headers().get(TENANT_HEADER);

  if (!(user && tenantId)) return null;

  return findDefaultInvoicingAddress(user.id, tenantId).then(clone);
}

export async function findDeliveryAddress() {
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

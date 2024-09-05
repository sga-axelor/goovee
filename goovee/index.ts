import axios from 'axios';
import {LRUCache} from '@/lib/cache';
import type {ID, Tenant} from '@/types';
import {DEFAULT_TENANT} from '@/constants';
import {GooveeClient, createClient} from './.generated/client';

const cache = new LRUCache<ID, {tenant: Tenant; client: GooveeClient}>(10);

async function getTenant(tenantId: ID): Promise<Tenant | null> {
  const tenant = await axios
    .get(`${process.env.NEXT_PUBLIC_HOST}/api/tenant/${tenantId}`, {
      auth: {
        username: process.env.TENANT_MANAGER_BASIC_USERNAME as string,
        password: process.env.TENANT_MANAGER_BASIC_PASSWORD as string,
      },
    })
    .then(({data}) => data);

  return tenant;
}

export async function getClient(tenantId: ID) {
  if (!tenantId) {
    throw new Error('No tenant.');
  }

  let result = cache.get(tenantId);

  if (result?.client) {
    return result.client;
  }

  const tenant = await getTenant(tenantId);

  if (!tenant) {
    throw new Error('Tenant not found');
  }

  const client = createClient({
    url: tenant?.db?.url,
  });

  if (!client) {
    throw new Error('Invalid configuration');
  }

  await client.$connect();
  await client.$sync();

  cache.put(tenantId, {tenant, client});

  return client;
}

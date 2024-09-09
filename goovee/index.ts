import axios from 'axios';
import {LRUCache} from '@/lib/cache';
import type {ID, Tenant} from '@/types';
import {GooveeClient, createClient} from './.generated/client';

const cache = new LRUCache<ID, {tenant: Tenant; client: GooveeClient}>(10);

async function getTenant(
  tenantId: ID,
): Promise<{tenant: Tenant; client: GooveeClient} | null> {
  const result = cache.get(tenantId);

  if (result) {
    return result;
  }

  const tenant = await axios
    .get(`${process.env.NEXT_PUBLIC_HOST}/api/tenant/${tenantId}`, {
      auth: {
        username: process.env.TENANT_MANAGER_BASIC_USERNAME as string,
        password: process.env.TENANT_MANAGER_BASIC_PASSWORD as string,
      },
    })
    .then(({data}) => data);

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

  return {
    tenant,
    client,
  };
}

export async function getClient(tenantId: ID) {
  if (!tenantId) {
    throw new Error('No tenant.');
  }

  let result = await getTenant(tenantId);

  if (result?.client) {
    return result.client;
  } else {
    throw new Error('Client not found');
  }
}

import axios from 'axios';
import {LRUCache} from '@/lib/cache';
import type {ID, Tenant} from '@/types';
import {DEFAULT_TENANT} from '@/constants';
import {GooveeClient, createClient} from './.generated/client';

const cache = new LRUCache<ID, GooveeClient>(10);

async function getTenant(tenantId: ID): Promise<Tenant | null> {
  const tenant = await axios
    .get(`http://localhost:3000/api/tenant/${tenantId}`, {
      auth: {
        username: process.env.BASIC_AUTH_USER as string,
        password: process.env.BASIC_AUTH_PASS as string,
      },
    })
    .then(({data}) => data);

  return tenant;
}

export async function getClient(tenantId: ID = DEFAULT_TENANT) {
  if (!tenantId) {
    throw new Error('No tenant.');
  }

  let client = cache.get(tenantId);

  if (client) {
    return client;
  }

  const tenant = await getTenant(tenantId);

  if (!tenant) {
    throw new Error('Tenant not found');
  }

  client = createClient({
    url: tenant?.db?.url,
  });

  if (!client) {
    throw new Error('Invalid configuration');
  }

  await client.$connect();
  await client.$sync();

  cache.put(tenantId, client);

  return client;
}

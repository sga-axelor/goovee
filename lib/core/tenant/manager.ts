'server only';

import axios from 'axios';

import {createClient} from '@/goovee/.generated/client';
import {LRUCache} from './lru';
import type {Tenant, TenantConfig} from './types';

const CACHE_CAPACITY = 20;

async function fetchConfig(id: Tenant['id']) {
  if (!id) return null;

  return await axios
    .get(`${process.env.NEXT_PUBLIC_HOST}/api/tenant/${id}/config`, {
      auth: {
        username: process.env.TENANT_MANAGER_BASIC_USERNAME as string,
        password: process.env.TENANT_MANAGER_BASIC_PASSWORD as string,
      },
    })
    .then(({data}) => data)
    .catch(err => {
      throw new Error('Error fetching tenant configuration');
    });
}

export class TenantManager {
  private cache: LRUCache<Tenant['id'], Tenant>;

  constructor() {
    this.cache = new LRUCache<Tenant['id'], Tenant>(CACHE_CAPACITY);
  }

  async getTenant(id: Tenant['id']) {
    if (!id) {
      throw new Error('Tenant id is required');
    }

    const cached = this.cache.get(id);

    if (cached) {
      return cached;
    }

    try {
      const config: TenantConfig = await fetchConfig(id);

      if (!config) {
        throw new Error('Error getting tenant');
      } else {
        const client = createClient({
          url: config?.db?.url,
        });

        if (!client) {
          throw new Error('Invalid configuration');
        }

        await client.$connect();
        await client.$sync();

        const tenant = {
          id,
          config,
          client,
        };

        this.cache.put(id, tenant);

        return tenant;
      }
    } catch (err) {
      throw new Error('Error getting tenant');
    }
  }
  async getConfig(id: Tenant['id']) {
    if (!id) {
      throw new Error('Tenant id is required');
    }

    return this.getTenant(id).then(tenant => tenant?.config);
  }
  async getClient(id: Tenant['id']) {
    if (!id) {
      throw new Error('Tenant id is required');
    }

    return this.getTenant(id).then(tenant => tenant?.client);
  }
}

export const manager = new TenantManager();

export default manager;

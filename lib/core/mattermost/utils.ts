import {experimental_taintUniqueValue} from 'react';
import {getEnv} from '@/environment';
import {type TenantConfig} from '@/tenant';

/**
 * Get the Mattermost host URL from environment variables
 */
export function getHost(): string {
  return (
    getEnv()?.GOOVEE_PUBLIC_MATTERMOST_HOST ||
    process.env.GOOVEE_PUBLIC_MATTERMOST_HOST ||
    ''
  );
}

export function getAdminToken(): string {
  const token =
    getEnv()?.MATTERMOST_TOKEN || process.env.MATTERMOST_TOKEN || '';

  if (token) {
    experimental_taintUniqueValue(
      'Mattermost token is a server secret. Do not pass to Client Components.',
      process,
      token,
    );
  }

  return token;
}

export function isCreateMattermostUsersEnabled(): boolean {
  const envValue =
    getEnv()?.CREATE_MATTERMOST_USERS || process.env.CREATE_MATTERMOST_USERS;
  return envValue === 'true';
}

export function getAosUrl(config: TenantConfig): string {
  return config?.aos?.url;
}

import {i18n} from '@/i18n';
import {getSession} from '@/auth';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import type {Tenant} from '@/tenant';

// ---- LOCAL IMPORTS ---- //
import {error} from '@/subapps/events/common/utils';

type ValidationResult = {
  error: null | boolean;
  message?: string;
};

export async function validate(validators: Function[]) {
  for (const validator of validators) {
    if (typeof validator !== 'function') {
      throw new Error('Validator is not a function');
    }

    const result = await validator();
    if (result.error) {
      return result;
    }
  }
  return {error: null};
}

export async function withAuth(): Promise<ValidationResult> {
  const session = await getSession();
  if (!session?.user?.id) {
    return {error: true, message: i18n.get('Unauthorized')};
  }
  return {error: null};
}

export function withSubapp(code: string, url: string, tenantId: Tenant['id']) {
  return async function () {
    const session = await getSession();
    const user = session?.user;

    const subapp = await findSubappAccess({code, user, url, tenantId});

    if (!subapp) {
      return error(i18n.get('Unauthorized'));
    }

    return {error: null};
  };
}

export function withWorkspace(
  url: string,
  tenantId: Tenant['id'],
  config?: {checkAuth?: boolean},
) {
  return async function (): Promise<ValidationResult> {
    if (config?.checkAuth) {
      const result = await withAuth();
      if (result?.error) return result;
    }

    const session = await getSession();
    const user = session?.user;

    const workspace = await findWorkspace({user, url, tenantId});

    if (!workspace) {
      return {error: true, message: i18n.get('Invalid workspace')};
    }

    return {error: null};
  };
}

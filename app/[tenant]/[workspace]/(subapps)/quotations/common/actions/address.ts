'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {TENANT_HEADER} from '@/middleware';
import {getTranslation} from '@/i18n/server';
import {SUBAPP_CODES} from '@/constants';
import {getSession} from '@/auth';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {findCities} from '@/orm/address';

export const fetchCities = async ({
  countryId,
  workspaceURL,
}: {
  countryId: string | number;
  workspaceURL: string;
}) => {
  if (!countryId) {
    return {
      error: true,
      message: await getTranslation('Country Id is required'),
    };
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await getTranslation('TenantId is required'),
    };
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return {error: true, message: await getTranslation('Unauthorized')};
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.quotations,
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!subapp) {
    return {error: true, message: await getTranslation('Unauthorized')};
  }

  const workspace = await findWorkspace({user, url: workspaceURL, tenantId});

  if (!workspace) {
    return {error: true, message: await getTranslation('Invalid workspace')};
  }

  try {
    const cities = await findCities({countryId, tenantId});
    return {
      success: true,
      data: clone(cities),
    };
  } catch (error) {
    console.error('Error fetching cities:', error);
    return {
      error: true,
      message: await getTranslation(
        'An unexpected error occurred while fetching cities',
      ),
    };
  }
};

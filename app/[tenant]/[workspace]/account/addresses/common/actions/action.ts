'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {TENANT_HEADER} from '@/middleware';
import {t} from '@/locale/server';
import {SUBAPP_CODES} from '@/constants';
import {getSession} from '@/auth';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {findCities, findCountry} from '@/orm/address';
import {createPartnerAddress, updatePartnerAddress} from '@/orm/address';
import {PartnerAddress} from '@/types';
import {manager} from '@/tenant';
import {findByID} from '@/orm/record';

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
      message: await t('Country Id is required'),
    };
  }

  if (!workspaceURL) {
    return {
      error: true,
      message: await t('Workspace not provided.'),
    };
  }

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required'),
    };
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return {error: true, message: await t('Unauthorized')};
  }

  const workspace = await findWorkspace({user, url: workspaceURL, tenantId});

  if (!workspace) {
    return {error: true, message: await t('Invalid workspace')};
  }

  const country: any = await findCountry({id: countryId, tenantId});

  if (!country) {
    return {
      error: true,
      message: await t('Invalid country selected!'),
    };
  }

  try {
    const cities = await findCities({countryId: country.id, tenantId});
    return {
      success: true,
      data: clone(cities),
    };
  } catch (error) {
    console.error('Error fetching cities:', error);
    return {
      error: true,
      message: await t('An unexpected error occurred while fetching cities'),
    };
  }
};

export async function createAddress(values: Partial<PartnerAddress>) {
  const session = await getSession();
  const tenantId = headers().get(TENANT_HEADER);

  if (!(session && tenantId)) return null;

  const address = await createPartnerAddress(
    session.user?.id,
    values,
    tenantId,
  ).then(clone);

  return address;
}

export async function updateAddress(values: Partial<PartnerAddress>) {
  const session = await getSession();
  const tenantId = headers().get(TENANT_HEADER);

  if (!(session && tenantId)) return null;

  const address = await updatePartnerAddress(
    session.user?.id,
    values,
    tenantId,
  ).then(clone);

  return address;
}

export async function confirmAddresses({
  workspaceURL,
  record,
  subAppCode,
}: {
  workspaceURL: string;
  record: any;
  subAppCode: SUBAPP_CODES;
}) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!workspaceURL) {
    return {
      error: true,
      message: await t('Workspace not provided.'),
    };
  }

  if (!tenantId) {
    return {
      error: true,
      message: await t('Bad request'),
    };
  }

  if (!record) {
    return {
      error: true,
      message: await t('Invalid record.'),
    };
  }

  const session = await getSession();

  if (!session) {
    return {
      error: true,
      message: await t('Unauthorized'),
    };
  }

  const user = session.user;

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!workspace) {
    return {
      error: true,
      message: await t('Invalid workspace'),
    };
  }

  const subapp = await findSubappAccess({
    code: subAppCode,
    user,
    url: workspace.url,
    tenantId,
  });

  if (!subapp) {
    return {
      error: true,
      message: await t('Unauthorized'),
    };
  }

  const {
    error,
    message,
    data: modelRecord,
  }: any = await findByID({
    subapp: subapp.code,
    id: record.id,
    workspaceURL,
    workspace,
    tenantId,
    withAuth: false,
  });

  if (error) {
    return {
      error: true,
      message: await t(message || 'Record not found.'),
    };
  }

  try {
    const reqBody = {
      id: modelRecord.id,
      version: modelRecord.version,
      mainInvoicingAddressStr: record.mainInvoicingAddress.formattedFullName,
      mainInvoicingAddress: {
        select: {
          id: record.mainInvoicingAddress.id,
        },
      },
      deliveryAddressStr: record.deliveryAddress.formattedFullName,
      deliveryAddress: {
        select: {
          id: record.deliveryAddress.id,
        },
      },
    };

    const client = await manager.getClient(tenantId);
    const result = await client.aOSOrder
      .update({data: reqBody})
      .then(clone)
      .catch(error => {
        console.log('Error >>>', error);
      });
    return {success: true, data: result};
  } catch (error) {
    return {
      error: true,
      message: await t('Something went wrong while saving address!'),
    };
  }
}

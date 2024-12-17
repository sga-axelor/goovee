import {manager, type Tenant} from '@/tenant';
import {PartnerAddress, Partner, ID, City} from '@/types';

const addressFields = {
  address: {
    zip: true,
    addressl2: true,
    addressl3: true,
    addressl4: true,
    addressl6: true,
    city: true,
    streetName: true,
    countrySubDivision: true,
    firstName: true,
    lastName: true,
    companyName: true,
    department: true,
    country: {
      id: true,
      name: true,
    },
    formattedFullName: true,
  },
  isDefaultAddr: true,
  isDeliveryAddr: true,
  isInvoicingAddr: true,
};

export async function findPartnerAddress(
  addressId: PartnerAddress['id'],
  tenantId: Tenant['id'],
) {
  if (!(addressId && tenantId)) return null;

  const client = await manager.getClient(tenantId);

  const address = await client.aOSPartnerAddress.findOne({
    where: {
      id: addressId,
    },
    select: addressFields,
  });

  return address;
}

export async function createPartnerAddress(
  partnerId: Partner['id'],
  values: Partial<PartnerAddress>,
  tenantId: Tenant['id'],
) {
  if (!(partnerId && tenantId)) return null;

  const client = await manager.getClient(tenantId);

  const address = await client.aOSPartnerAddress.create({
    data: {
      partner: {
        select: {
          id: partnerId,
        },
      },
      address: {
        create: {
          ...values.address,
          country: {
            select: {
              id: values?.address?.country,
            },
          },
          city: {
            select: {
              id: values?.address?.city,
            },
          },
        },
      },
      isInvoicingAddr: values.isInvoicingAddr,
      isDeliveryAddr: values.isDeliveryAddr,
      isDefaultAddr: values.isDefaultAddr,
    },
  });

  return address;
}

export async function updatePartnerAddress(
  partnerId: Partner['id'],
  values: Partial<PartnerAddress>,
  tenantId: Tenant['id'],
) {
  if (!(partnerId && tenantId)) return null;

  const client = await manager.getClient(tenantId);

  const address = await client.aOSPartnerAddress.update({
    data: {
      id: values.id as any,
      version: values.version as any,
      address: {
        update: {
          ...values.address,
          country: {
            select: {
              id: values?.address?.country,
            },
          },
          city: {
            select: {
              id: values?.address?.city,
            },
          },
        },
      },
      isInvoicingAddr: values.isInvoicingAddr,
      isDeliveryAddr: values.isDeliveryAddr,
      isDefaultAddr: values.isDefaultAddr,
    },
  });

  return address;
}

export async function findAddresses(
  partnerId: Partner['id'],
  tenantId: Tenant['id'],
) {
  if (!(partnerId && tenantId)) return null;

  const client = await manager.getClient(tenantId);

  const addresses = await client.aOSPartnerAddress.find({
    where: {
      partner: {
        id: partnerId,
      },
    },
    select: addressFields,
  });

  return addresses;
}

export async function findDeliveryAddresses(
  partnerId: Partner['id'],
  tenantId: Tenant['id'],
) {
  if (!(partnerId && tenantId)) return null;

  const client = await manager.getClient(tenantId);

  const addresses = await client.aOSPartnerAddress.find({
    where: {
      partner: {
        id: partnerId,
      },
      isDeliveryAddr: true,
    },
    select: addressFields,
  });

  return addresses;
}

export async function findAddress({
  id,
  tenantId,
}: {
  id: ID;
  tenantId: Tenant['id'];
}) {
  if (!id) {
    return {};
  }
  if (!id || !tenantId) return null;

  const client = await manager.getClient(tenantId);
  const whereConditions: any = {
    id,
  };

  const address = await client.aOSAddress.findOne({
    where: whereConditions,
    select: addressFields.address,
  });
  return address;
}

export async function findInvoicingAddresses(
  partnerId: Partner['id'],
  tenantId: Tenant['id'],
) {
  if (!(partnerId && tenantId)) return null;

  const client = await manager.getClient(tenantId);

  const addresses = await client.aOSPartnerAddress.find({
    where: {
      partner: {
        id: partnerId,
      },
      isInvoicingAddr: true,
    },
    select: addressFields,
  });

  return addresses;
}

export async function findDefaultAddress(
  partnerId: Partner['id'],
  tenantId: Tenant['id'],
) {
  if (!(partnerId && tenantId)) return null;

  const client = await manager.getClient(tenantId);

  const addresses = await client.aOSPartnerAddress.findOne({
    where: {
      partner: {
        id: partnerId,
      },
      isDefaultAddr: true,
    },
    select: addressFields,
  });

  return addresses;
}

export async function findDefaultDeliveryAddress(
  partnerId: Partner['id'],
  tenantId: Tenant['id'],
) {
  if (!(partnerId && tenantId)) return null;

  const client = await manager.getClient(tenantId);

  const result = await client.aOSPartnerAddress.findOne({
    where: {
      partner: {
        id: partnerId,
      },
      isDefaultAddr: true,
      isDeliveryAddr: true,
    },
    select: addressFields,
  });

  return result;
}

export async function findDefaultInvoicingAddress(
  partnerId: Partner['id'],
  tenantId: Tenant['id'],
) {
  if (!(partnerId && tenantId)) return null;

  const client = await manager.getClient(tenantId);

  const result = await client.aOSPartnerAddress.findOne({
    where: {
      partner: {
        id: partnerId,
      },
      isDefaultAddr: true,
      isInvoicingAddr: true,
    },
    select: addressFields,
  });

  return result;
}

export async function findCountries(tenantId: Tenant['id']) {
  if (!tenantId) return [];

  const client = await manager.getClient(tenantId);

  const countries = await client.aOSCountry.find();

  return countries;
}

export async function findCities({
  countryId,
  tenantId,
}: {
  countryId: string | number;
  tenantId: Tenant['id'];
}): Promise<City[]> {
  if (!tenantId || !countryId) return [];

  try {
    const client = await manager.getClient(tenantId);

    const cities = await client.aOSCity.find({
      where: {
        country: {id: countryId},
      },
    });

    return cities.map(city => ({
      id: city.id,
      name: city.name,
    })) as City[];
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}

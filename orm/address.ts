import {getClient} from '@/goovee';
import {PartnerAddress, Partner} from '@/types';

export async function findPartnerAddress(addressId: PartnerAddress['id']) {
  if (!addressId) return null;

  const client = await getClient();

  const address = await client.aOSPartnerAddress.findOne({
    where: {
      id: addressId,
    },
    select: {
      address: {
        zip: true,
        addressl2: true,
        addressl4: true,
        addressl6: true,
        country: {
          id: true,
          name: true,
        },
      },
      isDefaultAddr: true,
      isDeliveryAddr: true,
      isInvoicingAddr: true,
    },
  });

  return address;
}

export async function createPartnerAddress(
  partnerId: Partner['id'],
  values: Partial<PartnerAddress>,
) {
  if (!partnerId) return null;

  const client = await getClient();

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
) {
  if (!partnerId) return null;

  const client = await getClient();

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
        },
      },
      isInvoicingAddr: values.isInvoicingAddr,
      isDeliveryAddr: values.isDeliveryAddr,
      isDefaultAddr: values.isDefaultAddr,
    },
  });

  return address;
}

export async function findAddresses(partnerId: Partner['id']) {
  if (!partnerId) return null;

  const client = await getClient();

  const addresses = await client.aOSPartnerAddress.find({
    where: {
      partner: {
        id: partnerId,
      },
    },
    select: {
      address: {
        zip: true,
        addressl2: true,
        addressl4: true,
        addressl6: true,
        country: {
          name: true,
        },
      },
      isDefaultAddr: true,
      isDeliveryAddr: true,
      isInvoicingAddr: true,
    },
  });

  return addresses;
}

export async function findDeliveryAddresses(partnerId: Partner['id']) {
  if (!partnerId) return null;

  const client = await getClient();

  const addresses = await client.aOSPartnerAddress.find({
    where: {
      partner: {
        id: partnerId,
      },
      isDeliveryAddr: true,
    },
    select: {
      address: {
        zip: true,
        addressl2: true,
        addressl4: true,
        addressl6: true,
        country: {
          name: true,
        },
      },
      isDefaultAddr: true,
      isDeliveryAddr: true,
      isInvoicingAddr: true,
    },
  });

  return addresses;
}

export async function findInvoicingAddresses(partnerId: Partner['id']) {
  if (!partnerId) return null;

  const client = await getClient();

  const addresses = await client.aOSPartnerAddress.find({
    where: {
      partner: {
        id: partnerId,
      },
      isInvoicingAddr: true,
    },
    select: {
      address: {
        zip: true,
        addressl2: true,
        addressl4: true,
        addressl6: true,
        country: {
          name: true,
        },
      },
      isDefaultAddr: true,
      isDeliveryAddr: true,
      isInvoicingAddr: true,
    },
  });

  return addresses;
}

export async function findCountries() {
  const client = await getClient();

  const countries = await client.aOSCountry.find();

  return countries;
}

import {client} from '@/globals';
import {PartnerAddress, Partner} from '@/types';

export async function findPartnerAddress(addressId: PartnerAddress['id']) {
  if (!addressId) return null;

  const c = await client;

  const address = await c.aOSPartnerAddress.findOne({
    where: {
      id: addressId,
    },
    select: {
      address: {
        zip: true,
        addressl2: true,
        addressl4: true,
        addressl6: true,
        addressl7country: {
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

  const c = await client;

  const address = await c.aOSPartnerAddress.create({
    data: {
      partner: {
        select: {
          id: partnerId,
        },
      },
      address: {
        create: {
          ...values.address,
          addressl7country: {
            select: {
              id: values?.address?.addressl7country,
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

  const c = await client;

  const address = await c.aOSPartnerAddress.update({
    data: {
      id: values.id,
      address: {
        update: {
          ...values.address,
          addressl7country: {
            select: {
              id: values?.address?.addressl7country,
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

  const c = await client;

  const addresses = await c.aOSPartnerAddress.find({
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
        addressl7country: {
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

  const c = await client;

  const addresses = await c.aOSPartnerAddress.find({
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
        addressl7country: {
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

  const c = await client;

  const addresses = await c.aOSPartnerAddress.find({
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
        addressl7country: {
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
  const c = await client;

  const countries = await c.aOSCountry.find();

  return countries;
}

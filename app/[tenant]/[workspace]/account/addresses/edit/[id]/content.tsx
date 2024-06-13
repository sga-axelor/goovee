'use client';
// ---- CORE IMPORTS ---- //
import { i18n } from '@/lib/i18n';
import { AddressForm } from '@ui/components/index';
import type { PartnerAddress, Country, Address } from '@/types';

// ---- LOCAL IMPORTS ---- //
import { updateAddress } from './actions';
import { useState } from 'react';

export default function Content({
  id,
  partnerAddress,
  countries,
}: {
  id: string;
  partnerAddress: PartnerAddress;
  countries: Country[];
}) {
  const { address } = partnerAddress;
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    values: Partial<Address> & { multipletype?: boolean },
  ) => {
    try {
      event.preventDefault();
      if (loading) return;
      setLoading(true)
      let isDeliveryAddr = partnerAddress.isDeliveryAddr,
        isInvoicingAddr = partnerAddress.isInvoicingAddr;

      if (values.multipletype) {
        isDeliveryAddr = true;
        isInvoicingAddr = true;
      }

      const { multipletype, addressl7country, ...address } = values;

      const _address = await updateAddress({
        id,
        address: {
          ...address,
          addressl7country: addressl7country?.id,
          formattedFullName: address.addressl2,
          fullName: address.addressl2,
        } as Address,
        isInvoicingAddr,
        isDeliveryAddr,
      });
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  };

  return (
    <>
      <h2 className="mb-4 text-3xl">{i18n.get('Edit Address')}</h2>
      <AddressForm
        onSubmit={handleSubmit}
        countries={countries}
        values={{
          ...address,
          multipletype:
            partnerAddress.isDeliveryAddr && partnerAddress.isInvoicingAddr,
        }}
      />
    </>
  );
}

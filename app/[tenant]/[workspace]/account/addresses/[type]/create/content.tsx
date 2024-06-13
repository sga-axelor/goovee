'use client';

import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {capitalise} from '@/utils';
import {AddressForm} from '@ui/components/index';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/lib/i18n';
import type {Address, Country} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {createAddress} from './actions';

export default function Content({
  type,
  countries,
}: {
  type: 'delivery' | 'invoicing';
  countries: Country[];
}) {
  const title = `${capitalise(type)} Address`;

  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    values: Partial<Address> & {multipletype?: boolean},
  ) => {
    event.preventDefault();
    let isDeliveryAddr, isInvoicingAddr;

    if (values.multipletype) {
      isDeliveryAddr = true;
      isInvoicingAddr = true;
    }

    if (type === 'delivery') {
      isDeliveryAddr = true;
    }

    if (type === 'invoicing') {
      isInvoicingAddr = true;
    }

    const {multipletype, addressl7country, ...address} = values;

    try {
      const _address = await createAddress({
        address: {
          ...address,
          addressl7country: addressl7country?.id,
          formattedFullName: address.addressl2,
          fullName: address.addressl2,
        } as Address,
        isInvoicingAddr,
        isDeliveryAddr,
      });

      router.push(`${workspaceURI}/account/addresses/${_address?.id}`);
    } catch (err) {
      alert(i18n.get('Error creating address'));
    }
  };

  return (
    <>
      <h2 className="mb-4 text-[32px]">{title}</h2>
      <AddressForm onSubmit={handleSubmit} countries={countries} />
    </>
  );
}

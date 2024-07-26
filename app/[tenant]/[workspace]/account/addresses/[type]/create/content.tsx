'use client';

import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {capitalise} from '@/utils';
import {AddressForm} from '@ui/components/index';
import {useCart} from '@/app/[tenant]/[workspace]/cart-context';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/lib/i18n';
import {useSearchParams, useToast} from '@/ui/hooks';
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
  const {toast} = useToast();
  const {workspaceURI} = useWorkspace();

  const {updateAddress} = useCart();
  const {searchParams} = useSearchParams();
  const checkout = searchParams.get('checkout') === 'true';

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

    const {multipletype, country, ...address} = values;

    try {
      const _address = await createAddress({
        address: {
          ...address,
          country: country?.id,
          formattedFullName: address.addressl2,
          fullName: address.addressl2,
        } as Address,
        isInvoicingAddr,
        isDeliveryAddr,
      });

      if (checkout) {
        updateAddress({
          addressType: type,
          address: _address,
        });
      }

      toast({
        variant: 'success',
        title: i18n.get('Address successfully created'),
      });

      router.refresh();

      router.replace(
        `${workspaceURI}/account/addresses${checkout ? '?checkout=true' : ''}`,
      );
    } catch (err) {
      toast({
        variant: 'destructive',
        title: i18n.get('Error creating address'),
      });
    }
  };

  return (
    <>
      <h2 className="mb-4 text-3xl">{title}</h2>
      <AddressForm onSubmit={handleSubmit} countries={countries} />
    </>
  );
}

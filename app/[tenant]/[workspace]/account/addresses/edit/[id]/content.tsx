'use client';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {AddressForm} from '@ui/components/index';
import {useToast} from '@/ui/hooks';
import type {PartnerAddress, Country, Address} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {updateAddress} from './actions';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

export default function Content({
  id,
  partnerAddress,
  countries,
}: {
  id: string;
  partnerAddress: PartnerAddress;
  countries: Country[];
}) {
  const {address} = partnerAddress;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {workspaceURI} = useWorkspace();
  const {toast} = useToast();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    values: Partial<Address> & {multipletype?: boolean},
  ) => {
    try {
      event.preventDefault();
      if (loading) return;
      setLoading(true);
      let isDeliveryAddr = partnerAddress.isDeliveryAddr,
        isInvoicingAddr = partnerAddress.isInvoicingAddr;

      if (values.multipletype) {
        isDeliveryAddr = true;
        isInvoicingAddr = true;
      }

      const {multipletype, country, ...address} = values;

      const _address = await updateAddress({
        id,
        address: {
          ...address,
          country: country?.id,
          formattedFullName: address.addressl2,
          fullName: address.addressl2,
        } as Address,
        isInvoicingAddr,
        isDeliveryAddr,
      });
      setLoading(false);

      toast({
        variant: 'success',
        title: i18n.get('Address successfully edited'),
      });

      router.refresh();

      router.push(`${workspaceURI}/account/addresses`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: i18n.get('Error editing address'),
      });
      setLoading(false);
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

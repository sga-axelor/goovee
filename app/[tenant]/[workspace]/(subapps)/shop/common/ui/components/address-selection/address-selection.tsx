'use client';

import {useCallback, useEffect, useState} from 'react';
import Link from 'next/link';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {useCart} from '@/app/[tenant]/[workspace]/cart-context';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {
  findAddress,
  fetchDeliveryAddresses,
  fetchInvoicingAddresses,
  findDefaultDelivery,
  findDefaultInvoicing,
} from '@/subapps/shop/common/actions/address';
import {Button, Loader, Separator} from '@/ui/components';
import {ADDRESS_TYPE} from '@/constants';

export function AddressSelection({
  callbackURL,
  title,
}: {
  callbackURL?: string;
  title?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [invoicingAddress, setInvoicingAddress] = useState<any>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<any>(null);

  const {cart, updateAddress} = useCart();
  const {workspaceURI} = useWorkspace();

  const {
    invoicingAddress: cartInvoicingAddress,
    deliveryAddress: cartDeliveryAddress,
  } = cart || {};

  const resolveFromCartAddresses = useCallback(async () => {
    setLoading(true);

    const [delivery, invoicing] = await Promise.all([
      cartDeliveryAddress ? findAddress(cartDeliveryAddress) : null,
      cartInvoicingAddress ? findAddress(cartInvoicingAddress) : null,
    ]);
    if (delivery) setDeliveryAddress(delivery);
    if (invoicing) setInvoicingAddress(invoicing);
    setLoading(false);
  }, [cartDeliveryAddress, cartInvoicingAddress]);

  const resolveDefaultAddresses = useCallback(async () => {
    setLoading(true);

    const getDeliveryAddress = async () => {
      let address: any = await findDefaultDelivery();
      if (!address) {
        const addresses = await fetchDeliveryAddresses();
        address = addresses?.[0];
      }
      return address;
    };

    const getInvoicingAddress = async () => {
      let address: any = await findDefaultInvoicing();
      if (!address) {
        const addresses = await fetchInvoicingAddresses();
        address = addresses?.[0];
      }
      return address;
    };

    const [deliveryResult, invoicingResult] = await Promise.allSettled([
      getDeliveryAddress(),
      getInvoicingAddress(),
    ]);

    const delivery =
      deliveryResult.status === 'fulfilled' ? deliveryResult.value : null;
    const invoicing =
      invoicingResult.status === 'fulfilled' ? invoicingResult.value : null;

    if (delivery) {
      setDeliveryAddress(delivery);
      updateAddress({addressType: ADDRESS_TYPE.delivery, address: delivery.id});
    }

    if (invoicing) {
      setInvoicingAddress(invoicing);
      updateAddress({
        addressType: ADDRESS_TYPE.invoicing,
        address: invoicing.id,
      });
    }

    setLoading(false);
  }, [updateAddress]);

  useEffect(() => {
    if (cartDeliveryAddress && cartInvoicingAddress) {
      resolveFromCartAddresses();
    } else {
      resolveDefaultAddresses();
    }
  }, [
    cartDeliveryAddress,
    cartInvoicingAddress,
    resolveFromCartAddresses,
    resolveDefaultAddresses,
  ]);

  const noAddress = !invoicingAddress && !deliveryAddress;

  const sameDeliveryAndInvoicingAddress = Boolean(
    invoicingAddress?.id && invoicingAddress.id === deliveryAddress?.id,
  );

  const LinkButton = ({children, ...props}: any) => (
    <Link
      className="block"
      href={`${workspaceURI}/account/addresses?checkout=true${callbackURL ? `&callbackURL=${callbackURL}` : ''}`}>
      <Button className="rounded-full" variant="outline" {...props}>
        {children}
      </Button>
    </Link>
  );

  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg">
      <h3 className="text-xl font-medium">{title || i18n.t('Contact')}</h3>
      <Separator className="my-4" />
      {loading ? (
        <Loader />
      ) : noAddress ? (
        <div className="border p-4 rounded-lg space-y-2">
          <h3 className="text-lg font-semibold mb-4">
            {i18n.t('Invoicing and delivery address')}
          </h3>
          <LinkButton>{i18n.t('Create or Select an address')}</LinkButton>
        </div>
      ) : sameDeliveryAndInvoicingAddress ? (
        <div className="border p-4 rounded-lg space-y-2">
          <h3 className="text-lg font-semibold mb-4">
            {i18n.t('Invoicing and delivery address')}
          </h3>
          <div>
            <h5 className="font-bold text-xl">
              {deliveryAddress?.address?.addressl2}
            </h5>
            <h6>{deliveryAddress?.address?.addressl4}</h6>
            <h6>{deliveryAddress?.address?.addressl6}</h6>
            <h6>{deliveryAddress?.address?.country?.name}</h6>
          </div>
          <LinkButton>{i18n.t('Choose another address')}</LinkButton>
        </div>
      ) : (
        <div className="space-y-2 divide-y">
          {[
            {title: 'Delivery Address', address: deliveryAddress?.address},
            {title: 'Invoicing Address', address: invoicingAddress?.address},
          ].map(({title, address}) => (
            <div key={title} className="border p-4 rounded-lg space-y-2">
              <h3 className="text-lg font-semibold mb-4">{i18n.t(title)}</h3>
              {address ? (
                <>
                  <div>
                    <h5 className="font-bold text-xl">{address.addressl2}</h5>
                    <h6>{address.addressl4}</h6>
                    <h6>{address.addressl6}</h6>
                    <h6>{address.country?.name}</h6>
                  </div>
                  <LinkButton>{i18n.t('Choose another address')}</LinkButton>
                </>
              ) : (
                <LinkButton variant="default">
                  {i18n.t('Create or Select an address')}
                </LinkButton>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddressSelection;

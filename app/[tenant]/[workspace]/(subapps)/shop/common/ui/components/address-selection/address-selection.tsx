'use client';

import {useCallback, useEffect, useState} from 'react';

import {i18n} from '@/locale';
import {useCart} from '@/app/[tenant]/[workspace]/cart-context';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {
  findAddress,
  findDeliveryAddress,
  findInvoicingAddress,
} from '@/subapps/shop/common/actions/address';
import Link from 'next/link';
import {Button, Loader, Separator} from '@/ui/components';

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

  const {
    invoicingAddress: cartInvoicingAddress,
    deliveryAddress: cartDeliveryAddress,
  } = cart || {};

  const {workspaceURI} = useWorkspace();

  const handleFetchAddresses = useCallback(async () => {
    const [deliveryAddress, invoicingAddress] = await Promise.all([
      cartDeliveryAddress
        ? findAddress(cartDeliveryAddress)
        : findDeliveryAddress(),
      cartInvoicingAddress
        ? findAddress(cartInvoicingAddress)
        : findInvoicingAddress(),
    ]);

    if (invoicingAddress) {
      setInvoicingAddress(invoicingAddress);
      if (!cartInvoicingAddress) {
        updateAddress({addressType: 'invoicing', address: invoicingAddress.id});
      }
    }

    if (deliveryAddress) {
      setDeliveryAddress(deliveryAddress);
      if (!cartDeliveryAddress) {
        updateAddress({type: 'delivery', address: deliveryAddress.id});
      }
    }
  }, [cartInvoicingAddress, cartDeliveryAddress, updateAddress]);

  useEffect(() => {
    setLoading(true);
    handleFetchAddresses().finally(() => {
      setLoading(false);
    });
  }, [handleFetchAddresses]);

  const noaddress = !invoicingAddress && !deliveryAddress;

  const sameDeliveryAndInvoicingAddress =
    invoicingAddress &&
    deliveryAddress &&
    invoicingAddress.id === deliveryAddress.id;

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
      ) : noaddress ? (
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

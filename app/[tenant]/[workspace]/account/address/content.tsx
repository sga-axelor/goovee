'use client';

import {useRouter} from 'next/navigation';
import {useEffect, useState, useTransition} from 'react';

// ---- CORE IMPORTS ---- //
import {Button, Separator} from '@/ui/components';
import {i18n} from '@/i18n';
import {ADDRESS_TYPE, SUBAPP_CODES, SUBAPP_PAGE} from '@/constants';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {useToast} from '@/ui/hooks';

// ---- LOCAL IMPORTS ---- //
import {AddressesList} from '@/app/[tenant]/[workspace]/account/address/common/ui/components';
import {useCart} from '@/app/[tenant]/[workspace]/cart-context';
import {confirmAddresses} from '@/app/[tenant]/[workspace]/account/address/common/actions/action';

interface ContentProps {
  quotation: {
    id: string | number | null;
    invoicingAddress: {
      id: string | number;
    } | null;
    deliveryAddress: {
      id: string | number;
    } | null;
  };
  invoicingAddresses: any;
  deliveryAddresses: any;
  fromQuotation?: boolean;
  fromCheckout?: boolean;
  callbackURL?: string;
}

function Content({
  quotation,
  invoicingAddresses,
  deliveryAddresses,
  fromQuotation,
  fromCheckout,
}: ContentProps) {
  const [initiating, setInitiating] = useState(true);
  const [selectedAddresses, setSelectedAddresses] = useState({
    invoicing: null,
    delivery: null,
  });

  const [isPending, startTransition] = useTransition();

  const {workspaceURI, workspaceURL} = useWorkspace();
  const router = useRouter();
  const {toast} = useToast();
  const {cart, updateAddress} = useCart();

  const isSubAppActive = fromQuotation || fromCheckout;

  const handleCreate = (type: ADDRESS_TYPE) => {
    const queryParams: any = {};

    if (fromQuotation) {
      queryParams.quotation = quotation.id;
    } else if (fromCheckout) {
      queryParams.checkout = true;
    }

    const queryString = new URLSearchParams(queryParams).toString();

    router.push(
      `${workspaceURI}/${SUBAPP_PAGE.account}/${SUBAPP_PAGE.address}/${type}/${SUBAPP_PAGE.create}${queryString ? `?${queryString}` : ''}`,
    );
  };

  const handleEdit = (type: ADDRESS_TYPE, id: string | number) => {
    const queryParams: any = {};

    if (fromQuotation) {
      queryParams.quotation = quotation.id;
    } else if (fromCheckout) {
      queryParams.checkout = true;
    }

    const queryString = new URLSearchParams(queryParams).toString();

    router.push(
      `${workspaceURI}/${SUBAPP_PAGE.account}/${SUBAPP_PAGE.address}/${type}/${SUBAPP_PAGE.edit}/${id}${queryString ? `?${queryString}` : ''}`,
    );
  };

  const handleAddressSelection = (type: ADDRESS_TYPE, partnerAddress: any) => {
    if (fromCheckout) {
      updateAddress({addressType: type, address: partnerAddress?.id});
    }
    setSelectedAddresses(prev => ({...prev, [type]: partnerAddress.address}));
  };

  const handleQuotationConfirm = () => {
    startTransition(async () => {
      const payload = {
        invoicingAddress: selectedAddresses.invoicing,
        deliveryAddress: selectedAddresses.delivery,
      };

      try {
        const result = await confirmAddresses({
          workspaceURL,
          subAppCode: SUBAPP_CODES.quotations,
          record: {
            ...quotation,
            deliveryAddress: payload.deliveryAddress,
            mainInvoicingAddress: payload.invoicingAddress,
          },
        });

        if (result.error) {
          toast({
            variant: 'destructive',
            description: i18n.get(result?.message || ''),
          });
        } else {
          toast({
            variant: 'success',
            title: i18n.get('Address changes saved successfully!'),
          });
          router.refresh();
          router.push(
            `${workspaceURI}/${SUBAPP_CODES.quotations}/${quotation.id}`,
          );
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: i18n.get('Something went wrong while saving address!'),
        });
      }
    });
  };

  const handleConfirm = () => {
    if (fromCheckout) {
      router.refresh();
      router.push(`${workspaceURI}/${SUBAPP_PAGE.checkout}`);
    } else if (fromQuotation) {
      handleQuotationConfirm();
    }
  };

  useEffect(() => {
    let invoicingAddress: any, deliveryAddress: any;

    if (fromQuotation) {
      invoicingAddress = quotation?.invoicingAddress || null;
      deliveryAddress = quotation?.deliveryAddress || null;
    } else if (fromCheckout) {
      invoicingAddress = {id: cart?.invoicingAddress || null};
      deliveryAddress = {id: cart?.deliveryAddress || null};
    }

    setSelectedAddresses({
      invoicing: invoicingAddress,
      delivery: deliveryAddress,
    });
    setInitiating(false);
  }, [fromCheckout, fromQuotation, cart, quotation]);
  if (initiating) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="bg-white p-4 rounded-lg flex flex-col gap-4">
        {isSubAppActive && (
          <>
            <h4 className="text-xl font-medium mb-0">
              {i18n.get('Choose your address')}
            </h4>
            <Separator className="my-2" />
          </>
        )}

        <div className="border border-gray-400 p-4 rounded-lg flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="font-semibold text-xl">
              {i18n.get('Invoicing address')}
            </div>
            <AddressesList
              isFromQuotation={fromQuotation}
              currentAddress={selectedAddresses.invoicing}
              addresses={invoicingAddresses}
              type={ADDRESS_TYPE.invoicing}
              onCreate={handleCreate}
              onEdit={handleEdit}
              onSelect={isSubAppActive ? handleAddressSelection : undefined}
            />
          </div>

          <Separator className="my-2" />

          <div className="flex flex-col gap-4">
            <div className="font-semibold text-xl">
              {i18n.get('Delivery address')}
            </div>
            <AddressesList
              isFromQuotation={fromQuotation}
              currentAddress={selectedAddresses.delivery}
              addresses={deliveryAddresses}
              type={ADDRESS_TYPE.delivery}
              onCreate={handleCreate}
              onEdit={handleEdit}
              onSelect={isSubAppActive ? handleAddressSelection : undefined}
            />
          </div>
        </div>
      </div>
      {isSubAppActive && (
        <Button
          className="w-full bg-success hover:bg-success-dark py-1.5"
          onClick={handleConfirm}
          disabled={isPending}>
          {isPending ? i18n.get('Processing...') : i18n.get('Confirm address')}
        </Button>
      )}
    </>
  );
}

export default Content;

'use client';

import Link from 'next/link';
import {LuPlus, LuPencil} from 'react-icons/lu';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {Button, Separator} from '@/ui/components';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {useCart} from '@/app/[tenant]/[workspace]/cart-context';
import {SUBAPP_PAGE} from '@/constants';
import {useSearchParams} from '@/ui/hooks';
import type {PartnerAddress} from '@/types';

function AddressList({
  title,
  type,
  addresses,
  active,
  onClick,
}: {
  title: string;
  type: 'delivery' | 'invoicing';
  addresses: PartnerAddress[] | null;
  active?: PartnerAddress['id'];
  onClick?: any;
}) {
  const {workspaceURI} = useWorkspace();

  const {searchParams} = useSearchParams();
  const checkout = searchParams.get('checkout') === 'true';

  return (
    <>
      <h4 className="text-xl font-medium text-card-foreground mb-4">{title}</h4>
      {Boolean(addresses?.length) ? (
        <div className="my-4 grid gap-4 md:grid-cols-3">
          {addresses?.map(({id, address}) => {
            return (
              <div
                key={id}
                className={`rounded-md p-2 border flex flex-col justify-between cursor-pointer ${active === id ? 'bg-palette-purple' : ''}`}
                onClick={() => onClick?.({id, address})}>
                <div>
                  <h5 className="font-bold text-xl">{address.addressl2}</h5>
                  <h6>{address.addressl4}</h6>
                  <h6>{address.addressl6}</h6>
                  <h6>{address.country?.name}</h6>
                </div>
                <div className="text-right">
                  <Link
                    href={`${workspaceURI}/account/addresses/edit/${id}${checkout ? '?checkout=true' : ''}`}>
                    <Button
                      variant="outline-success"
                      onClick={e => {
                        e.stopPropagation();
                      }}>
                      <div className="flex items-center">
                        <LuPencil className="text-xl" />
                        <p className="mb-0 ml-1">{i18n.get('Edit')}</p>
                      </div>
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      <Link
        href={`${workspaceURI}/account/addresses/${type}/create${checkout ? '?checkout=true' : ''}`}>
        <Button variant="success">
          <LuPlus className="size-6" />
          {i18n.get('Create Address')}
        </Button>
      </Link>
    </>
  );
}

export default function Content({
  invoicingAddresses,
  deliveryAddresses,
}: {
  invoicingAddresses: PartnerAddress[] | null;
  deliveryAddresses: PartnerAddress[] | null;
}) {
  const {workspaceURI} = useWorkspace();
  const {cart, updateAddress} = useCart();

  const {searchParams} = useSearchParams();
  const checkout = searchParams.get('checkout') === 'true';

  const handleClick =
    (addressType: 'delivery' | 'invoicing') => (address: any) => {
      if (checkout) {
        updateAddress({addressType, address: address?.id});
      }
    };

  return (
    <>
      <div className="rounded-md flex flex-col gap-4 bg-card text-card-foreground">
        <div className="p-4 rounded-md border">
          <AddressList
            title={i18n.get('Invoicing Address')}
            addresses={invoicingAddresses}
            type="invoicing"
            active={checkout && cart?.invoicingAddress}
            onClick={handleClick('invoicing')}
          />
        </div>
        <Separator />
        <div className="p-4 rounded-md border">
          <AddressList
            title={i18n.get('Delivery Address')}
            addresses={deliveryAddresses}
            type="delivery"
            active={checkout && cart?.deliveryAddress}
            onClick={handleClick('delivery')}
          />
        </div>
        {checkout && (
          <Button variant="success" asChild>
            <Link href={`${workspaceURI}/${SUBAPP_PAGE.checkout}`}>
              {i18n.get('Confirm address')}
            </Link>
          </Button>
        )}
      </div>
    </>
  );
}

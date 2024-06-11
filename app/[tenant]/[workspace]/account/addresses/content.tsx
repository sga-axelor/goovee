'use client';

import Link from 'next/link';
import {LuPlus} from 'react-icons/lu';
import {LuPencil} from 'react-icons/lu';
import {Button} from '@ui/components/button';
import {Separator} from '@ui/components/separator';
// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import type {PartnerAddress} from '@/types';

function AddressList({
  title,
  type,
  addresses,
}: {
  title: string;
  type: 'delivery' | 'invoicing';
  addresses: PartnerAddress[] | null;
}) {
  const {workspaceURI} = useWorkspace();

  return (
    <>
      <h4 className="text-lg font-medium text-primary mb-4">{title}</h4>
      {Boolean(addresses?.length) ? (
        <div className="my-4 grid gap-4 grid-col-1 md:grid-col-3">
          {addresses?.map(({id, address}) => {
            return (
              <div
                key={id}
                className="rounded-md p-2 border flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-xl">{address.addressl2}</h5>
                  <h6 className="text-base">{address.addressl4}</h6>
                  <h6 className="text-base">{address.addressl6}</h6>
                  <h6 className="text-base">{address.addressl7country?.name}</h6>
                </div>
                <div className="text-right">
                  <Link href={`${workspaceURI}/account/addresses/edit/${id}`}>
                    <Button variant="outline" className="rounded-full">
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
      <Link href={`${workspaceURI}/account/addresses/${type}/create`}>
        <Button className="rounded-full flex items-center">
          <LuPlus className="text-xl" />
          <p className="mb-0 ml-2">{i18n.get('Create Address')}</p>
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
  return (
    <>
      <h4 className="text-lg font-medium text-primary mb-4">
        {i18n.get('Addresses')}
      </h4>
      <div className="p-4 rounded-md flex flex-col gap-4 bg-white">
        <div className="p-4 rounded-md border">
          <AddressList
            title={i18n.get('Invoicing Address')}
            addresses={invoicingAddresses}
            type="invoicing"
          />
        </div>
        <Separator />
        <div className="p-4 rounded-md border">
          <AddressList
            title={i18n.get('Delivery Address')}
            addresses={deliveryAddresses}
            type="delivery"
          />
        </div>
      </div>
    </>
  );
}

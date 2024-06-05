'use client';

import Link from 'next/link';
import {Box, Divider, Button} from '@axelor/ui';
import {MaterialIcon} from '@axelor/ui/icons/material-icon';

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
      <Box as="h4" mb={3} fontWeight="bold">
        {title}
      </Box>
      {Boolean(addresses?.length) ? (
        <Box
          my={3}
          d="grid"
          gap="1rem"
          gridTemplateColumns={{base: '1fr', md: '1fr 1fr 1fr'}}>
          {addresses?.map(({id, address}) => {
            return (
              <Box
                key={id}
                rounded={2}
                p={2}
                border
                d="flex"
                flexDirection="column"
                justifyContent="space-between">
                <Box>
                  <Box as="h5" fontWeight="bold">
                    {address.addressl2}
                  </Box>
                  <Box as="h6">{address.addressl4}</Box>
                  <Box as="h6">{address.addressl6}</Box>
                  <Box as="h6">{address.addressl7country?.name}</Box>
                </Box>
                <Box textAlign="end">
                  <Link href={`${workspaceURI}/account/addresses/edit/${id}`}>
                    <Button variant="primary" outline rounded="pill">
                      <Box d="flex" alignItems="center">
                        <MaterialIcon icon="edit" />
                        <Box as="p" mb={0} ms={1}>
                          {i18n.get('Edit')}
                        </Box>
                      </Box>
                    </Button>
                  </Link>
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : null}
      <Link href={`${workspaceURI}/account/addresses/${type}/create`}>
        <Button variant="primary" d="flex" alignItems="center" rounded="pill">
          <MaterialIcon icon="add" />
          <Box as="p" mb={0} ms={2}>
            {i18n.get('Create Address')}
          </Box>
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
      <Box as="h2" mb={3}>
        <b>{i18n.get('Addresses')}</b>
      </Box>
      <Box
        p={3}
        rounded={2}
        bg="white"
        d="flex"
        flexDirection="column"
        gap="1rem">
        <Box border p={2} rounded={2}>
          <AddressList
            title={i18n.get('Invoicing Address')}
            addresses={invoicingAddresses}
            type="invoicing"
          />
        </Box>
        <Divider />
        <Box border p={2} rounded={2}>
          <AddressList
            title={i18n.get('Delivery Address')}
            addresses={deliveryAddresses}
            type="delivery"
          />
        </Box>
      </Box>
    </>
  );
}

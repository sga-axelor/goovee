'use client';
import React from 'react';
import {Box, Button, Divider} from '@axelor/ui';

// ---- CORE IMPORTS ---- //
import {getCityName} from '@/utils';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import {PaymentMethod, Products} from '@/subapps/orders/common/ui/components';

export const Contact = ({
  clientPartner,
  company,
  mainInvoicingAddress,
  deliveryAddress,
  saleOrderLineList,
}: any) => {
  const billingAddressCity = getCityName(mainInvoicingAddress?.addressl6);
  const deliveryAddressCity = getCityName(deliveryAddress?.addressl6);
  return (
    <>
      <Box
        d="flex"
        flexDirection="column"
        gap="1rem"
        bg="white"
        p={4}
        rounded={3}>
        <Box as="h2">{i18n.get('Contact')}</Box>
        <Box
          d="flex"
          flexDirection="column"
          gap="1rem"
          border
          rounded={3}
          p={3}
          style={{borderColor: '#E6E7E7'}}>
          <Box d="flex" flexDirection="column" gap="1rem">
            <Box style={{fontSize: 20, fontWeight: 600}}>
              {i18n.get('Billing address')}
            </Box>
            <Box d="flex" flexDirection="column" gap="1rem">
              <Box style={{fontWeight: 600}}>
                {clientPartner?.fullName}, {company?.name}
              </Box>
              <Box>
                <Box>{mainInvoicingAddress?.addressl4}</Box>
                <Box>{billingAddressCity}</Box>
                <Box>{mainInvoicingAddress?.zip}</Box>
                <Box>{mainInvoicingAddress?.addressl7country?.name}</Box>
              </Box>
            </Box>
            <Box d="flex">
              <Button
                variant="dark"
                outline
                d="flex"
                alignItems="center"
                justifyContent="center"
                gap="10"
                rounded="pill"
                style={{fontWeight: 500}}
                flexBasis={{base: '100%', md: 'fit-content'}}>
                {i18n.get('Choose another adress')}
              </Button>
            </Box>
          </Box>
          <Divider />
          <Box d="flex" flexDirection="column" gap="1rem">
            <Box style={{fontSize: 20, fontWeight: 600}}>
              {i18n.get('Delivery address')}
            </Box>
            <Box d="flex" flexDirection="column" gap="1rem">
              <Box style={{fontWeight: 600}}>
                {clientPartner?.fullName}, {company?.name}
              </Box>
              <Box>
                <Box>{deliveryAddress?.addressl4}</Box>
                <Box>{deliveryAddressCity}</Box>
                <Box>{deliveryAddress.zip}</Box>
                <Box>{deliveryAddress?.addressl7country?.name}</Box>
              </Box>
            </Box>
            <Box d="flex">
              <Button
                variant="dark"
                outline
                d="flex"
                alignItems="center"
                justifyContent="center"
                gap="10"
                rounded="pill"
                style={{fontWeight: 500}}
                flexBasis={{base: '100%', md: 'fit-content'}}>
                {i18n.get('Choose another adress')}
              </Button>
            </Box>
          </Box>
        </Box>
        <Products saleOrderLineList={saleOrderLineList} />
        {false && <PaymentMethod />}
      </Box>
    </>
  );
};

export default Contact;

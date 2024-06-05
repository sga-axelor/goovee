'use client';

import React from 'react';
import {Box, Divider} from '@axelor/ui';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';

export const PaymentMethod = () => {
  return (
    <>
      <Box d="flex" flexDirection="column" gap="1rem">
        <Box as="h2">{i18n.get('Payment Method')}</Box>
        <Divider />
        <Box
          d="flex"
          flexDirection="column"
          gap="1rem"
          border
          rounded={3}
          p={3}
          style={{borderColor: '#E6E7E7'}}>
          <Box style={{fontSize: 20, fontWeight: 600}}>
            {i18n.get('Paid with')}...
          </Box>
          <Box d="flex" flexDirection="column" gap="0.5rem">
            <Box d="flex">
              <Box>{i18n.get('Card Number')}: </Box>
              <Box>7639************</Box>
            </Box>
            <Box d="flex">
              <Box>{i18n.get('Expiration date')}: </Box>
              <Box>**/**/27</Box>
            </Box>
            <Box d="flex">
              <Box>{i18n.get('Name')}: </Box>
              <Box>Hem********</Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PaymentMethod;

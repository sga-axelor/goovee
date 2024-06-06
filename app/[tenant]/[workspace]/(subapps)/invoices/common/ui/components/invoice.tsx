'use client';

import React from 'react';
import {Box, Button, Divider} from '@axelor/ui';
import {MaterialIcon} from '@axelor/ui/icons/material-icon';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import {InvoiceProps} from '@/subapps/invoices/common/types/invoices';
import {InvoiceContent} from '.';

export function Invoice({invoice, isUnpaid}: InvoiceProps) {
  return (
    <>
      <Box
        d="flex"
        flexDirection="column"
        bg="white"
        flexBasis={{base: '100%', md: isUnpaid ? '75%' : '100%'}}
        px={4}
        py={3}
        gap={'1rem'}>
        <Box as="h2">{i18n.get('Invoice')}</Box>

        <Divider />
        <Box d="flex" justifyContent="flex-end">
          <Button
            variant="dark"
            outline
            d="flex"
            alignItems="center"
            justifyContent="center"
            gap="10"
            rounded="pill"
            flexBasis={{base: '100%', md: 'fit-content'}}>
            <MaterialIcon icon="download" /> {i18n.get('Download Invoice')}
          </Button>
        </Box>
        <Box rounded={2} style={{border: '1px solid red !important'}}>
          <InvoiceContent invoice={invoice} />
        </Box>
      </Box>
    </>
  );
}

export default Invoice;

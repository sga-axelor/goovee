'use client';

import React from 'react';
import {Box, Divider} from '@axelor/ui';

// ---- CORE IMPORTS ---- //
import {parseDate} from '@/utils';
import {Tag} from '@/ui/components';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import {Invoice, Total} from '@/subapps/invoices/common/ui/components';
import {getStatus} from '@/subapps/invoices/common/utils/invoices';
import {INVOICE_TYPE} from '@/subapps/invoices/common/constants/invoices';

export default function Content({invoice}: any) {
  const {
    invoiceId,
    dueDate,
    invoiceDate,
    inTaxTotal,
    exTaxTotal,
    amountRemaining,
    invoiceLineList,
    currency: {numberOfDecimals},
  } = invoice;
  const {status, variant} = getStatus(amountRemaining.value);
  const isUnpaid = status === INVOICE_TYPE.UNPAID;

  return (
    <>
      <Box px={{base: 3, md: 5}} py={{base: 2, md: 3}}>
        <Box as="h2" mb={3}>
          {`${i18n.get('Invoice number')} ${invoiceId}`}
        </Box>
        <Box
          bg="white"
          d={{base: 'flex', md: 'block'}}
          flexDirection={{base: 'column', md: 'row'}}
          px={4}
          py={3}
          mb={4}
          rounded={3}>
          <Box as="h2">{i18n.get('Informations')}</Box>
          <Divider />
          <Box>
            <Box d="flex" alignItems="center" gap="1rem">
              <Box style={{fontSize: 18, fontWeight: 600}}>
                {i18n.get('Status')}:
              </Box>
              <Box>
                <Tag variant={variant}>{status}</Tag>
              </Box>
            </Box>
            <Box d="flex" alignItems="center" gap="0.1rem">
              <Box pe={1} style={{fontSize: 18, fontWeight: 600}}>
                {isUnpaid
                  ? `${i18n.get('Due date')}:`
                  : `${i18n.get('Paid on')}:`}
              </Box>
              <Box> {parseDate(isUnpaid ? dueDate : invoiceDate)}</Box>
            </Box>
          </Box>
        </Box>
        <Box d={{base: 'block', md: 'flex'}} mb={4} gap="1rem" rounded={3}>
          <Invoice invoice={invoice} isUnpaid={isUnpaid} />
          {isUnpaid && (
            <Total
              exTaxTotal={exTaxTotal}
              inTaxTotal={inTaxTotal}
              invoiceLineList={invoiceLineList}
              numberOfDecimals={numberOfDecimals}
            />
          )}
        </Box>
      </Box>
    </>
  );
}

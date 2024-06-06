'use client';

import React from 'react';
import {Box} from '@axelor/ui';

// ---- CORE IMPORTS ---- //
import {Container} from '@/ui/components';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import {
  Comments,
  History,
  Informations,
  Total,
  Contacts,
} from '@/subapps/quotations/common/ui/components';
import {QUOTATION_STATUS} from '@/subapps/quotations/common/constants/quotations';
import type {
  CommentsProps,
  Quotation,
} from '@/subapps/quotations/common/types/quotations';

type Props = {
  quotation: Quotation;
  comments: CommentsProps[];
};

const Content = ({quotation, comments}: Props) => {
  const {
    saleOrderSeq,
    exTaxTotal,
    inTaxTotal,
    endOfValidityDate,
    clientPartner,
    mainInvoicingAddress,
    deliveryAddress,
    company,
    saleOrderLineList,
    totalDiscount,
    statusSelect,
  } = quotation;

  return (
    <>
      <Container title={`${i18n.get('Quotation')} ${saleOrderSeq}`}>
        <Informations
          endOfValidityDate={endOfValidityDate}
          statusSelect={statusSelect}
        />
        <Box
          d={'flex'}
          flexFlow={{base: 'column-reverse', lg: 'row'}}
          gap="1rem">
          <Box
            d="flex"
            flexDirection="column"
            gap="1.5rem"
            flexBasis={{
              base: '100%',
              lg: `${
                statusSelect !== QUOTATION_STATUS.DRAFT_QUOTATION
                  ? '75%'
                  : '100%'
              }`,
            }}>
            <Contacts
              clientPartner={clientPartner}
              company={company}
              mainInvoicingAddress={mainInvoicingAddress}
              deliveryAddress={deliveryAddress}
              saleOrderLineList={saleOrderLineList}
            />
            <History />
            <Comments comments={comments} />
          </Box>

          {statusSelect !== QUOTATION_STATUS.DRAFT_QUOTATION && (
            <Box
              d="flex"
              flexDirection="column"
              gap="1.5rem"
              flexBasis={{
                base: '100%',
                lg: '25%',
              }}>
              <Total
                exTaxTotal={exTaxTotal}
                inTaxTotal={inTaxTotal}
                statusSelect={statusSelect}
                totalDiscount={totalDiscount}
              />
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Content;

'use client';

import React from 'react';
import {Box, Divider} from '@axelor/ui';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';

export type TotalProps = {
  inTaxTotal: string;
  exTaxTotal: number | string;
  totalDiscount: number;
};
export const Total = ({exTaxTotal, inTaxTotal, totalDiscount}: TotalProps) => {
  return (
    <>
      <Box
        d="flex"
        flexDirection="column"
        bg="white"
        px={4}
        py={3}
        rounded={2}
        flexBasis={{
          base: '100%',
          md: '25%',
        }}
        style={{height: 'fit-content'}}>
        <Box fontSize={2} style={{fontWeight: 500}}>
          {i18n.get('Total price')}
        </Box>
        <Divider />

        <Box d="flex" flexDirection="column" gap="1rem" mb={2}>
          <Box d="flex" flexDirection="column" gap={'0.5rem'}>
            <Box d="flex" alignItems="center" justifyContent="space-between">
              <Box>{i18n.get('Total WT')}:</Box>
              <Box>{exTaxTotal}</Box>
            </Box>
            <Box d="flex" alignItems="center" justifyContent="space-between">
              <Box>{i18n.get('Total ATI')}:</Box>
              <Box>{inTaxTotal}</Box>
            </Box>
            <Box d="flex" alignItems="center" justifyContent="space-between">
              <Box>{i18n.get('Discount')}:</Box>
              <Box>{totalDiscount}%</Box>
            </Box>
          </Box>

          <Box d="flex" alignItems="center" justifyContent="space-between">
            <Box fontWeight="bold">{i18n.get('Total price')}:</Box>
            <Box fontWeight="bolder" fontSize={4}>
              {inTaxTotal}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Total;

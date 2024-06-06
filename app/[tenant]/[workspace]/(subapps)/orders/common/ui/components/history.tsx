'use client';

import React from 'react';
import {Box, Divider} from '@axelor/ui';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';

export const History = () => {
  return (
    <>
      <Box
        d="flex"
        flexDirection="column"
        gap="1rem"
        bg="white"
        p={4}
        rounded={3}>
        <Box as="h2">{i18n.get('History')}</Box>
        <Divider />
        <Box>
          <Box
            d="flex"
            justifyContent="space-between"
            p={3}
            borderStart
            style={{borderColor: '#212323 !important'}}>
            <Box style={{fontWeight: 600}}>{i18n.get('History action')}</Box>
            <Box style={{color: '#464555'}}>23/11/2023</Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default History;

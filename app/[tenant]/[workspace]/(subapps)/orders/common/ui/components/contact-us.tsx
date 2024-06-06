'use client';

import React from 'react';
import {Box, Button, Divider} from '@axelor/ui';
import {MaterialIcon} from '@axelor/ui/icons/material-icon';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';

export const ContactUs = () => {
  return (
    <>
      <Box
        d="flex"
        flexDirection="column"
        gap="1rem"
        bg="white"
        p={4}
        rounded={3}>
        <Box as="h2">{i18n.get('ContactUs')}</Box>
        <Divider />
        <Button
          variant="dark"
          outline
          d="flex"
          alignItems="center"
          justifyContent="center"
          gap="10"
          rounded="pill"
          w={100}
          style={{fontWeight: 500}}>
          <MaterialIcon icon="keyboard_return" /> {i18n.get('Return product')}
        </Button>
        <Button
          variant="dark"
          outline
          d="flex"
          alignItems="center"
          justifyContent="center"
          gap="10"
          rounded="pill"
          w={100}
          style={{fontWeight: 500}}>
          <MaterialIcon icon="help" /> {i18n.get('Need help')}
        </Button>
      </Box>
    </>
  );
};

export default ContactUs;

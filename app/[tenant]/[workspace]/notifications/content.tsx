'use client';

import {Box} from '@axelor/ui';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';

export default function Content() {
  return (
    <Box px={{base: 3, md: 5}} py={{base: 2, md: 3}}>
      <Box as="h2" mb={3}>
        <b>{i18n.get('Notifications')}</b>
      </Box>
    </Box>
  );
}

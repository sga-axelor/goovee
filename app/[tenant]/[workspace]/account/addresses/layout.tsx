'use client';

import {Box} from '@axelor/ui';

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <Box px={{base: 3, md: 5}} py={{base: 2, md: 3}}>
      {children}
    </Box>
  );
}

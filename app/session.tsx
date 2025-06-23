'use client';

import React from 'react';
import {SessionProvider} from 'next-auth/react';
import {useEnvironment} from '@/environment';

export default function Session({children}: {children: React.ReactNode}) {
  const env = useEnvironment();

  const basePath = env.GOOVEE_PUBLIC_BASE_PATH;
  return (
    <SessionProvider {...(basePath ? {basePath: `${basePath}/api/auth`} : {})}>
      {children}
    </SessionProvider>
  );
}

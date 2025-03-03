'use client';

import React from 'react';
import {SessionProvider} from 'next-auth/react';

export default function Session({children}: {children: React.ReactNode}) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
  return (
    <SessionProvider {...(basePath ? {basePath: `${basePath}/api/auth`} : {})}>
      {children}
    </SessionProvider>
  );
}

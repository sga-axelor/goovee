import React from 'react';
import {redirect} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';

export default async function Layout({children}: {children: React.ReactNode}) {
  const session = await getSession();

  if (!session?.user) {
    redirect('/auth/login');
  }

  return <>{children}</>;
}

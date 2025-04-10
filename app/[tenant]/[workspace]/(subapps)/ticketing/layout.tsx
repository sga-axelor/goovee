import type {ReactNode} from 'react';

// ---- CORE IMPORTS ---- //
import {t} from '@/locale/server';

// ---- LOCAL IMPORTS ---- //

export async function generateMetadata() {
  return {
    title: await t('Ticketing'),
  };
}

export default async function Layout({
  params,
  children,
}: {
  params: {tenant: string; workspace: string};
  children: ReactNode;
}) {
  return <div className="mb-[72px] lg:mb-0">{children}</div>;
}

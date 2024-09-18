import {notFound} from 'next/navigation';
import type {Metadata} from 'next';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {i18n} from '@/i18n';

export const metadata: Metadata = {
  title: i18n.get('Addresses'),
};

export default async function Layout({children}: {children: React.ReactNode}) {
  const session = await getSession();

  if (!session) return notFound();

  return <div className="py-2 md:py-4 px-4 md:px-12">{children}</div>;
}

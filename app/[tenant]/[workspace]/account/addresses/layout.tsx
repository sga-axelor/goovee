import {notFound} from 'next/navigation';
import {getSession} from '@/orm/auth';

export default async function Layout({children}: {children: React.ReactNode}) {
  const session = await getSession();

  if (!session) return notFound();

  return <div className="py-2 md:py-4 px-4 md:px-12">{children}</div>;
}

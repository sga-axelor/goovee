import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {getSession} from '@/auth';

// ---- LOCAL IMPORTS ---- //
import Sidebar from './sidebar';

export default async function Layout({children}: {children: React.ReactNode}) {
  const session = await getSession();

  if (!session) return notFound();

  return (
    <div className="py-2 md:py-4 px-4 md:px-12 space-y-6">
      <h4 className="text-xl font-semibold">{i18n.get('Profile Settings')}</h4>
      <div className="grid grid-cols-[15%_1fr] bg-white rounded-md px-6 py-4 gap-4">
        <Sidebar />
        <div>{children}</div>
      </div>
    </div>
  );
}

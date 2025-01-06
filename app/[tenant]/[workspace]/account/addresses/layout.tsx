// ---- CORE IMPORTS ---- //
import {t} from '@/locale/server';

export async function generateMetadata() {
  return {
    title: await t('Address'),
  };
}

export default function Layout({children}: {children: React.ReactNode}) {
  return <div className="bg-white p-2 lg:p-0 lg:bg-inherit">{children}</div>;
}

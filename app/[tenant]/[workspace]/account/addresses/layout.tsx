// ---- CORE IMPORTS ---- //
import {getTranslation} from '@/i18n/server';

export async function generateMetadata() {
  return {
    title: await getTranslation('Address'),
  };
}

export default function Layout({children}: {children: React.ReactNode}) {
  return <>{children}</>;
}

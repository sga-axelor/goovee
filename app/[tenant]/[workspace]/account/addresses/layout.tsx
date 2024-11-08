import type {Metadata} from 'next';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';

export const metadata: Metadata = {
  title: i18n.get('Addresses'),
};

export default function Layout({children}: {children: React.ReactNode}) {
  return <>{children}</>;
}

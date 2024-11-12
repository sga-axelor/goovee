import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';

// ---- LOCAL IMPORTS ---- //
import Content from './content';

export default async function Page() {
  const session = await getSession();
  const user = session?.user;

  if (!user) return notFound();

  return <Content />;
}

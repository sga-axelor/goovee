import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';

// ---- LOCAL IMPORTS ---- //
import Content from './content';

export default async function Page() {
  const session = await getSession();
  const userId = session?.user?.id as string;

  if (!userId) {
    return notFound();
  }

  return (
    <div>
      <Content userId={userId} />
    </div>
  );
}

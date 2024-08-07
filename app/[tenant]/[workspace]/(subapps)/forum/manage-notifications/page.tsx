// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';

// ---- LOCAL IMPORTS ---- //
import Content from './content';

export default async function Page() {
  const session = await getSession();
  const userId = session?.user?.id as string;

  return (
    <div>
      <Content userId={userId} />
    </div>
  );
}

export const dynamic = 'force-dynamic';

import {fetchRootFolders} from '@/subapps/resources/common/orm/dms';
import {clone} from '@/utils';
import ResourceForm from './form';

export default async function Page() {
  const folders = await fetchRootFolders().then(clone);
  return (
    <main className="container mx-auto mt-4 p-4 md:p-8 bg-white rounded space-y-2">
      <h2 className="font-semibold text-lg">Create a resource</h2>
      <ResourceForm categories={folders} />
    </main>
  );
}

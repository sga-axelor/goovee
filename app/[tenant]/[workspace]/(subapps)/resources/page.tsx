export const dynamic = 'force-dynamic';

import {ResourceList} from '@/subapps/resources/common/ui/components';
import {
  fetchLatestFiles,
  fetchLatestFolders,
} from '@/subapps/resources/common/orm/dms';
import {clone} from '@/utils';

import Categories from './categories';
import Search from './search';

export default async function Page() {
  const files = await fetchLatestFiles().then(clone);
  const folders = await fetchLatestFolders().then(clone);

  return (
    <>
      <Search />
      <main className="container p-4 mx-auto space-y-6">
        <Categories items={folders} />
        <h2 className="font-semibold text-xl">New Resources</h2>
        <ResourceList resources={files} />
      </main>
    </>
  );
}

// ---- CORE IMPORTS ---- //
import {
  fetchLatestFiles,
  fetchLatestFolders,
} from '@/subapps/resources/common/orm/dms';
import {clone} from '@/utils';
import {Banner} from '@/ui/components';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import {ResourceList} from '@/subapps/resources/common/ui/components';
import {
  BANNER_DESCRIPTION,
  BANNER_TITLE,
} from '@/subapps/resources/common/constants';
import Categories from './categories';
import Search from './search';

export default async function Page() {
  const files = await fetchLatestFiles().then(clone);
  const folders = await fetchLatestFolders().then(clone);

  return (
    <>
      <Banner title={BANNER_TITLE} description={BANNER_DESCRIPTION}>
        <Search />
      </Banner>
      <main className="container p-4 mx-auto space-y-6">
        <Categories items={folders} />
        <h2 className="font-semibold text-xl">{i18n.get('New Resources')}</h2>
        <ResourceList resources={files} />
      </main>
    </>
  );
}

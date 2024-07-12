import Link from 'next/link';

// ---- CORE IMPORTS ---- //
import {Button} from '@/ui/components/button';
import {workspacePathname} from '@/utils/workspace';
import {clone} from '@/utils';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import {
  CategoryExplorer,
  ResourceList,
  SortBy,
} from '@/subapps/resources/common/ui/components';
import {
  fetchExplorerCategories,
  fetchFiles,
  fetchLatestFiles,
} from '@/subapps/resources/common/orm/dms';

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: {id: string};
  params: {tenant: string; workspace: string};
}) {
  const {id} = searchParams;

  let files;

  if (id) {
    files = await fetchFiles(id).then(clone);
  } else {
    files = await fetchLatestFiles().then(clone);
  }
  const categories = await fetchExplorerCategories().then(clone);

  const {workspaceURI} = workspacePathname(params);

  return (
    <main className="container p-4 mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xl leading-8 grow">
          {i18n.get('Resource Category')}
        </h2>
        <SortBy className="hidden sm:flex me-2" />
        <Link href={`${workspaceURI}/resources/create`}>
          <Button>{i18n.get('Add New')}</Button>
        </Link>
      </div>
      <p className="leading-5 text-sm">
        This is the folder description : Office ipsum you must be muted. Ground
        items back-end beforehand lets previous low-hanging eye create. On
        player-coach give six say. Synchronise note just one ask guys cost. Work
        after search production pulling involved paradigm chime. Would existing
        jumping meaningful pivot. Exploratory mint so hits boy site. Keywords
        key welcome panel downloaded we lean next group points. Before
        incentivization hits ui launch.
      </p>
      <div className="grid sm:grid-cols-4 gap-5">
        <div className="bg-white rounded-lg py-6 px-2">
          <CategoryExplorer categories={categories} />
        </div>
        <div className="sm:hidden">
          <SortBy />
        </div>
        <div className="sm:col-span-3 overflow-auto">
          <ResourceList resources={files} />
        </div>
      </div>
    </main>
  );
}

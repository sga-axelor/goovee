// ---- CORE IMPORTS ---- //
import {
  fetchColors,
  fetchIcons,
  fetchRootFolders,
} from '@/subapps/resources/common/orm/dms';
import {clone} from '@/utils';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import CategoryForm from './form';

export default async function Page() {
  const folders = await fetchRootFolders().then(clone);
  const colors = await fetchColors().then(clone);
  const icons = await fetchIcons().then(clone);

  return (
    <main className="container mx-auto mt-4 p-4 md:p-8 bg-white rounded space-y-2">
      <h2 className="font-semibold text-lg">{i18n.get('Create a category')}</h2>
      <CategoryForm categories={folders} colors={colors} icons={icons} />
    </main>
  );
}

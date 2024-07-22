'use client';

// ---- CORE IMPORTS ---- //
import {HeroSearch} from '@/ui/components';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import {ResourceList} from '@/subapps/resources/common/ui/components';
import {
  BANNER_DESCRIPTION,
  BANNER_TITLE,
} from '@/subapps/resources/common/constants';
import Categories from './categories';
import Search from './search';
import {IMAGE_URL} from '@/constants';

export const Content = ({
  folders,
  files,
  workspace,
}: {
  folders: any;
  files: any;
  workspace: any;
}) => {
  const renderSearch = () => <Search workspace={workspace} />;

  return (
    <>
      <HeroSearch
        title={BANNER_TITLE}
        description={BANNER_DESCRIPTION}
        image={IMAGE_URL}
        renderSearch={renderSearch}
      />
      <main className="container p-4 mx-auto space-y-6">
        <Categories items={folders} />
        <h2 className="font-semibold text-xl">{i18n.get('New Resources')}</h2>
        <ResourceList resources={files} />
      </main>
    </>
  );
};

export default Content;

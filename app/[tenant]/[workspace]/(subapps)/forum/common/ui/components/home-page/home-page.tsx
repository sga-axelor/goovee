'use client';

// ---- CORE IMPORTS ---- //
import {HeroSearch, Search as BannerSearch} from '@/ui/components';
import {BANNER_DESCRIPTION, BANNER_TITLES, IMAGE_URL} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {
  GroupActionList,
  Search as GroupSearch,
} from '@/subapps/forum/common/ui/components';
import {GROUPS, MEMBER, NOT_MEMBER} from '@/subapps/forum/common/constants';

export const HomePage = () => {
  const renderSearch = () => (
    <BannerSearch
      searchKey="title"
      findQuery={() => null}
      renderItem={<></>}
      onItemClick={() => null}
    />
  );

  return (
    <div>
      <HeroSearch
        title={BANNER_TITLES.forum}
        description={BANNER_DESCRIPTION}
        image={IMAGE_URL}
        renderSearch={renderSearch}
      />
      <div className="flex gap-5 px-[100px] py-6 w-full">
        <div className="w-1/5 min-w-[281px] flex flex-col gap-6 bg-white p-4 rounded-lg">
          <div>
            <h1 className="font-semibold text-xl leading-[30px]">{GROUPS}</h1>
          </div>
          <GroupSearch />
          <GroupActionList title={MEMBER} />
          <GroupActionList title={NOT_MEMBER} />
        </div>
        <div className="w-4/5">
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

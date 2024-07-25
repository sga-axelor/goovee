'use client';

import {useRouter} from 'next/navigation';
import {MdOutlineImage} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {
  HeroSearch,
  Search as BannerSearch,
  Avatar,
  Input,
  Button,
} from '@/ui/components';
import {BANNER_DESCRIPTION, BANNER_TITLES, IMAGE_URL} from '@/constants';
import {i18n} from '@/lib/i18n';
import {useSearchParams} from '@/ui/hooks';

// ---- LOCAL IMPORTS ---- //
import {
  GroupActionList,
  Search as GroupSearch,
  Tabs,
} from '@/subapps/forum/common/ui/components';
import {
  DISABLED_SEARCH_PLACEHOLDER,
  GROUPS,
  MEMBER,
  NOT_MEMBER,
  START_A_POST,
  TAB_TITLES,
} from '@/subapps/forum/common/constants';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

export const HomePage = () => {
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const {searchParams} = useSearchParams();
  const type = searchParams.get('type');

  const isLoggedIn = true;

  const renderSearch = () => (
    <BannerSearch
      searchKey="title"
      findQuery={() => null}
      renderItem={<></>}
      onItemClick={() => null}
    />
  );

  const handleTabClick = (type: string) => {
    router.push(`${workspaceURI}/forum?type=${type}`);
  };

  return (
    <div>
      <HeroSearch
        title={BANNER_TITLES.forum}
        description={BANNER_DESCRIPTION}
        image={IMAGE_URL}
        renderSearch={renderSearch}
      />
      <div className="flex gap-5 px-[100px] py-6 w-full">
        <div className="w-1/5 min-w-[281px] h-fit flex flex-col gap-6 bg-white p-4 rounded-lg">
          <div>
            <h1 className="font-semibold text-xl leading-[30px]">
              {i18n.get(GROUPS)}
            </h1>
          </div>
          <GroupSearch />
          {isLoggedIn && <GroupActionList title={MEMBER} />}
          <GroupActionList title={NOT_MEMBER} />
        </div>
        <div className="w-4/5">
          <div className="flex flex-col">
            <div className="bg-white px-4 pt-4 pb-2 rounded-t-lg flex items-center gap-[10px]">
              <Avatar
                className={`rounded-full h-8 w-8 ${isLoggedIn ? 'bg-red-400' : 'bg-black/20'}`}>
                {/*{isLoggedIn && <AvatarImage src="/images/user.png" />} */}
              </Avatar>
              <Input
                disabled={!isLoggedIn}
                className={`placeholder:text-sm placeholder:text-palette-mediumGray disabled:placeholder:text-gray-700 border ${isLoggedIn ? 'bg-white' : 'bg-black/20'}`}
                placeholder={
                  isLoggedIn
                    ? i18n.get(START_A_POST)
                    : i18n.get(DISABLED_SEARCH_PLACEHOLDER)
                }
              />
              <Button
                disabled={!isLoggedIn}
                className="bg-white hover:bg-white text-success hover:text-success-dark border-success hover:border-success-dark rounded-md border py-4 px-[11px]
                disabled:bg-black/20 disabled:border-gray-700 disabled:text-gray-700">
                <MdOutlineImage className="h-6 w-6" />
              </Button>
            </div>
            <Tabs tabs={TAB_TITLES} onClick={handleTabClick} activeTab={type} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

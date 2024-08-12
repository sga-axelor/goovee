'use client';

import {useRouter} from 'next/navigation';
import {MdOutlineImage} from 'react-icons/md';
import {useMemo, useEffect, useState} from 'react';

// ---- CORE IMPORTS ---- //
import {
  HeroSearch,
  Search as BannerSearch,
  Avatar,
  AvatarImage,
  Button,
} from '@/ui/components';
import {BANNER_DESCRIPTION, BANNER_TITLES, IMAGE_URL} from '@/constants';
import {i18n} from '@/lib/i18n';
import {useSearchParams} from '@/ui/hooks';
import {getImageURL} from '@/utils/image';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {
  GroupActionList,
  Search as GroupSearch,
  UploadPost,
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
import {Group} from '@/subapps/forum/common/types/forum';
import {findGroups} from '@/subapps/forum/common/action/action';

export const HomePage = ({
  memberGroups,
  nonMemberGroups,
  user,
  posts,
  pageInfo,
}: {
  memberGroups: Group[];
  nonMemberGroups: Group[];
  user: any;
  posts: any;
  pageInfo: any;
}) => {
  const [open, setOpen] = useState(false);
  const [memberGroupList, setMemberGroupList] = useState<Group[]>([]);
  const [nonMemeberGroupList, setNonMemberGroupList] = useState<Group[]>([]);
  const [searchKey, setSearchKey] = useState<string>('');
  const [initialType, setInitialType] = useState<string>('');

  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const {searchParams} = useSearchParams();
  const type = searchParams.get('type') ?? 'posts';

  const {id, picture}: any = user || {};

  const isLoggedIn = id ? true : false;

  useEffect(() => {
    setMemberGroupList(memberGroups);
    setNonMemberGroupList(nonMemberGroups);
  }, []);

  const groups = useMemo(
    () => memberGroups.map((group: any) => group.forumGroup),
    [memberGroups],
  );

  useEffect(() => {
    if (isLoggedIn) {
      findGroups({
        id: user?.id as string,
        isMember: true,
        searchKey,
      })
        .then(setMemberGroupList)
        .catch(err => console.log(err));
    }

    findGroups({
      id: user?.id,
      isMember: false,
      searchKey,
    })
      .then(setNonMemberGroupList)
      .catch(err => console.log(err));
  }, [searchKey]);

  const handleChangeSerachKey = (value: string) => {
    setSearchKey(value);
  };

  const hanldeDialogOpen = (initialType: string = '') => {
    setInitialType(initialType);
    setOpen(true);
  };
  const handleClose = () => {
    setInitialType('');
    setOpen(false);
  };

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
      <div className="flex flex-col md:flex-row gap-5 px-4 md:px-[50px] lg:px-[100px] py-6 w-full">
        <div className="w-full md:w-1/5 min-w-[281px] h-fit flex flex-col gap-6 bg-white p-4 rounded-lg">
          <div>
            <h1 className="font-semibold text-xl leading-[30px]">
              {i18n.get(GROUPS)}
            </h1>
          </div>
          <GroupSearch onChange={handleChangeSerachKey} />
          {isLoggedIn && (
            <GroupActionList
              title={MEMBER}
              groups={memberGroupList}
              userId={user.id}
            />
          )}
          <GroupActionList
            title={NOT_MEMBER}
            groups={nonMemeberGroupList}
            isMember={false}
            userId={user.id}
          />
        </div>
        <div className="w-full md:w-4/5 mb-16 lg:mb-0">
          <div className="bg-white px-4 pt-4 pb-1 rounded-t-lg flex items-center gap-[10px]">
            <Avatar
              className={`rounded-full h-8 w-8 ${isLoggedIn ? '' : 'bg-black/20'}`}>
              {isLoggedIn && <AvatarImage src={getImageURL(picture?.id)} />}
            </Avatar>
            <Button
              disabled={!isLoggedIn}
              onClick={() => hanldeDialogOpen()}
              variant="outline"
              className={`flex-1 text-sm justify-start text-palette-mediumGray disabled:placeholder:text-gray-700 border ${isLoggedIn ? 'bg-white' : 'bg-black/20'}`}>
              {isLoggedIn
                ? i18n.get(START_A_POST)
                : i18n.get(DISABLED_SEARCH_PLACEHOLDER)}
            </Button>
            {false && (
              <Button
                disabled={!isLoggedIn}
                onClick={() => hanldeDialogOpen('image')}
                className="bg-white hover:bg-white text-success hover:text-success-dark border-success hover:border-success-dark rounded-md border py-4 px-[11px]
              disabled:bg-black/20 disabled:border-gray-700 disabled:text-gray-700">
                <MdOutlineImage className="h-6 w-6" />
              </Button>
            )}
          </div>
          <Tabs
            tabs={TAB_TITLES}
            onClick={handleTabClick}
            activeTab={type}
            posts={posts}
            pageInfo={pageInfo}
          />
        </div>
      </div>
      <UploadPost
        open={open}
        groups={groups}
        onClose={handleClose}
        initialType={initialType}
      />
    </div>
  );
};

export default HomePage;

'use client';

import {useRouter} from 'next/navigation';
import {MdOutlineImage} from 'react-icons/md';
import {useMemo, useEffect, useState} from 'react';

// ---- CORE IMPORTS ---- //
import {HeroSearch, Search, Avatar, AvatarImage, Button} from '@/ui/components';
import {
  BANNER_DESCRIPTION,
  BANNER_TITLES,
  IMAGE_URL,
  URL_PARAMS,
} from '@/constants';
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
  SearchItem,
} from '@/subapps/forum/common/ui/components';
import {
  DISABLED_SEARCH_PLACEHOLDER,
  GROUPS,
  JOIN_GROUP_TO_POST,
  MEMBER,
  NOT_MEMBER,
  START_A_POST,
  TAB_TITLES,
} from '@/subapps/forum/common/constants';
import {ForumGroup, Group} from '@/subapps/forum/common/types/forum';
import {fetchPosts} from '@/subapps/forum/common/action/action';

export const HomePage = ({
  memberGroups,
  nonMemberGroups,
  user,
  posts,
  pageInfo,
  selectedGroup = null,
  isMember = true,
}: {
  memberGroups: Group[];
  nonMemberGroups: Group[];
  user: any;
  posts: any;
  pageInfo: any;
  selectedGroup?: ForumGroup | null;
  isMember?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [memberGroupList, setMemberGroupList] = useState<Group[]>(
    memberGroups || [],
  );

  const [nonMemberGroupList, setNonMemberGroupList] = useState<Group[]>(
    nonMemberGroups || [],
  );
  const [searchKey, setSearchKey] = useState<string>('');

  const router = useRouter();
  const {workspaceURI, workspaceURL} = useWorkspace();

  const {searchParams, update} = useSearchParams();
  const type = searchParams.get('type') ?? 'posts';

  const {id, picture}: any = user || {};

  const isLoggedIn = id ? true : false;

  const groups = useMemo(
    () => memberGroups?.map((group: any) => group.forumGroup),
    [memberGroups],
  );

  const handleGroupSearch = (value: string) => {
    setSearchKey(value);
  };

  const hanldeDialogOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = (term: string) => {
    update([{key: URL_PARAMS.search, value: term}]);
  };

  useEffect(() => {
    const getGroups = async () => {
      try {
        if (searchKey) {
          const searchKeyLower = searchKey.toLowerCase();

          if (isLoggedIn) {
            const filteredMemberGroups = memberGroups.filter(group =>
              group?.forumGroup?.name?.toLowerCase().includes(searchKeyLower),
            );
            setMemberGroupList(filteredMemberGroups);
          }
          const filteredNonMemberGroups = nonMemberGroups.filter(group =>
            group?.name?.toLowerCase().includes(searchKeyLower),
          );
          setNonMemberGroupList(filteredNonMemberGroups);
        } else {
          setMemberGroupList(memberGroups);
          setNonMemberGroupList(nonMemberGroups);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getGroups();
  }, [isLoggedIn, searchKey, memberGroups, nonMemberGroups]);

  const renderSearch = () => (
    <Search
      searchKey="title"
      findQuery={async () => {
        //
        const response = await fetchPosts({workspaceURL});
        if (response) {
          const {posts} = response;
          return posts;
        }
        return [];
      }}
      renderItem={SearchItem}
      onSearch={handleSearch}
    />
  );

  const handleTabClick = (type: string) => {
    router.push(`${workspaceURI}/forum?type=${type}`);
  };

  return (
    <div>
      <HeroSearch
        title={selectedGroup?.name ?? BANNER_TITLES.forum}
        description={
          selectedGroup ? selectedGroup?.description : BANNER_DESCRIPTION
        }
        image={IMAGE_URL}
        groupImg={selectedGroup?.image?.id}
        renderSearch={!selectedGroup && renderSearch}
      />
      <div className="flex flex-col md:flex-row gap-5 px-4 md:px-[50px] lg:px-[100px] py-6 w-full">
        <div className="w-full md:w-1/5 min-w-[281px] h-fit flex flex-col gap-6 bg-white p-4 rounded-lg">
          <div>
            <h1 className="font-semibold text-xl leading-[30px]">
              {i18n.get(GROUPS)}
            </h1>
          </div>
          <GroupSearch onChange={handleGroupSearch} />
          {isLoggedIn && (
            <GroupActionList
              title={MEMBER}
              groups={memberGroupList}
              isMember={true}
              userId={user.id}
              groupId={selectedGroup?.id}
            />
          )}
          <GroupActionList
            title={NOT_MEMBER}
            groups={nonMemberGroupList}
            isMember={false}
            userId={user?.id}
            groupId={selectedGroup?.id}
          />
        </div>
        <div className="w-full md:w-4/5 mb-16 lg:mb-0">
          <div className="bg-white px-4 pt-4 pb-1 rounded-t-lg flex items-center gap-[10px]">
            <Avatar
              className={`rounded-full h-8 w-8 ${!isLoggedIn ? 'bg-black/20' : ''}`}>
              {<AvatarImage src={getImageURL(picture?.id)} />}
            </Avatar>
            <Button
              disabled={!isLoggedIn || !isMember}
              onClick={() => hanldeDialogOpen()}
              variant="outline"
              className={`flex-1 text-sm justify-start text-palette-mediumGray disabled:placeholder:text-gray-700 border ${
                !isLoggedIn
                  ? 'bg-black/20'
                  : !isMember
                    ? 'bg-black/20'
                    : 'bg-white'
              }`}>
              {isLoggedIn
                ? isMember
                  ? i18n.get(START_A_POST)
                  : i18n.get(JOIN_GROUP_TO_POST)
                : i18n.get(DISABLED_SEARCH_PLACEHOLDER)}
            </Button>
            {false && (
              <Button
                disabled={!isLoggedIn}
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
            isMember={isMember}
          />
        </div>
      </div>
      <UploadPost
        open={open}
        groups={groups}
        selectedGroup={selectedGroup}
        onClose={handleClose}
      />
    </div>
  );
};

export default HomePage;

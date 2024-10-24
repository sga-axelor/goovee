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
  SUBAPP_CODES,
  URL_PARAMS,
} from '@/constants';
import {i18n} from '@/lib/i18n';
import {useSearchParams} from '@/ui/hooks';
import {getImageURL} from '@/utils/image';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {PortalWorkspace} from '@/types';

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
  OTHER_GROUPS,
  START_A_POST,
  TAB_TITLES,
} from '@/subapps/forum/common/constants';
import {ForumGroup, Group} from '@/subapps/forum/common/types/forum';
import {fetchPosts} from '@/subapps/forum/common/action/action';
import {useForum} from '@/subapps/forum/common/ui/context';

export const HomePage = ({workspace}: {workspace: PortalWorkspace}) => {
  const {memberGroups, nonMemberGroups, user, selectedGroup, isMember} =
    useForum();

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

  const isLoggedIn = !!id;

  const isDisabled = useMemo(() => {
    return isLoggedIn ? !isMember || memberGroups?.length === 0 : true;
  }, [isLoggedIn, isMember, memberGroups?.length]);

  const groups = useMemo(
    () => memberGroups?.map((group: any) => group.forumGroup),
    [memberGroups],
  );

  const imageURL = workspace?.config?.forumHeroBgImage?.id
    ? `url(${getImageURL(workspace.config.forumHeroBgImage.id)})`
    : IMAGE_URL;

  const handleGroupSearch = (value: string) => {
    setSearchKey(value);
  };

  const handleDialogOpen = () => {
    if (!isLoggedIn || !isMember) return;
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = (term: string) => {
    update([{key: URL_PARAMS.search, value: term}], {scroll: false});
  };

  useEffect(() => {
    const getGroups = async () => {
      try {
        if (searchKey) {
          const searchKeyLower = searchKey.toLowerCase();

          if (isLoggedIn) {
            const filteredMemberGroups = memberGroups.filter(
              (group: ForumGroup) =>
                group?.forumGroup?.name?.toLowerCase().includes(searchKeyLower),
            );
            setMemberGroupList(filteredMemberGroups);
          }
          const filteredNonMemberGroups = nonMemberGroups.filter(
            (group: ForumGroup) =>
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
        const response: any = await fetchPosts({workspaceURL});
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
    router.push(`${workspaceURI}/${SUBAPP_CODES.forum}?type=${type}`);
  };

  return (
    <div>
      <HeroSearch
        title={
          selectedGroup?.name ??
          (workspace?.config?.forumHeroTitle || i18n.get(BANNER_TITLES.forum))
        }
        description={
          selectedGroup?.description ??
          (workspace?.config?.forumHeroDescription ||
            i18n.get(BANNER_DESCRIPTION))
        }
        image={imageURL}
        groupImg={selectedGroup?.image?.id}
        background={workspace?.config?.forumHeroOverlayColorSelect || 'default'}
        blendMode={
          workspace?.config?.forumHeroOverlayColorSelect ? 'overlay' : 'normal'
        }
        renderSearch={!selectedGroup && renderSearch}
      />
      <div className="flex flex-col lg:flex-row gap-5 px-4 lg:px-[6.25rem] py-6 w-full">
        <div className="w-full lg:w-1/5 min-w-[17.563rem] h-fit flex flex-col gap-6 bg-white p-4 rounded-lg">
          <div>
            <h1 className="font-semibold text-xl leading-[1.875rem]">
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
            title={OTHER_GROUPS}
            groups={nonMemberGroupList}
            isMember={false}
            userId={user?.id}
            groupId={selectedGroup?.id}
          />
        </div>
        <div className="w-full lg:w-4/5 mb-16 lg:mb-0">
          <div className="bg-white px-4 py-4 rounded-t-lg flex items-center gap-[0.625rem]">
            <Avatar
              className={`rounded-full h-8 w-8 ${!isLoggedIn ? 'bg-gray-light' : ''}`}>
              {<AvatarImage src={getImageURL(picture?.id)} />}
            </Avatar>
            <Button
              onClick={handleDialogOpen}
              variant="outline"
              className={`flex-1 text-sm justify-start border font-normal ${
                isDisabled
                  ? 'bg-gray-light hover:bg-gray-light text-gray-dark hover:text-gray-dark cursor-default border-none'
                  : 'bg-white text-gray border-gray hover:bg-white hover:text-gray'
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
                className="bg-white hover:bg-white text-success hover:text-success-dark border-success hover:border-success-dark rounded-md border py-4 px-[0.688rem]
              disabled:bg-black/20 disabled:border-gray-700 disabled:text-gray-700">
                <MdOutlineImage className="h-6 w-6" />
              </Button>
            )}
          </div>
          <Tabs tabs={TAB_TITLES} activeTab={type} onClick={handleTabClick} />
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

'use client';

import {useRouter} from 'next/navigation';
import {MdOutlineImage} from 'react-icons/md';
import {useMemo, useEffect, useState, useCallback} from 'react';

// ---- CORE IMPORTS ---- //
import {HeroSearch, Search, Avatar, AvatarImage, Button} from '@/ui/components';
import {
  BANNER_DESCRIPTION,
  BANNER_TITLES,
  DEFAULT_LIMIT,
  IMAGE_URL,
  SUBAPP_CODES,
  URL_PARAMS,
} from '@/constants';
import {i18n} from '@/locale';
import {useSearchParams} from '@/ui/hooks';
import {getImageURL} from '@/utils/files';
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
  const {memberGroups, nonMemberGroups, user, selectedGroup} = useForum();

  const [open, setOpen] = useState(false);
  const [memberGroupList, setMemberGroupList] = useState<Group[]>(
    memberGroups || [],
  );

  const [nonMemberGroupList, setNonMemberGroupList] = useState<Group[]>(
    nonMemberGroups || [],
  );
  const [groupSearchValue, setGroupSearchKey] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [forceClose, setForceClose] = useState(false);

  const router = useRouter();
  const {workspaceURI, workspaceURL, tenant} = useWorkspace();

  const {searchParams, update} = useSearchParams();
  const type = searchParams.get('type') ?? 'posts';

  const {id, picture}: any = user || {};

  const isLoggedIn = !!id;

  const isAllowedToPost = selectedGroup
    ? memberGroups
        .map((group: any) => group.forumGroup.id)
        .includes(selectedGroup.id)
    : true;

  const isDisabled = useMemo(() => {
    return isLoggedIn ? !isAllowedToPost : true;
  }, [isLoggedIn, isAllowedToPost]);

  const groups = useMemo(
    () => memberGroups?.map((group: any) => group.forumGroup),
    [memberGroups],
  );

  const imageURL = workspace?.config?.forumHeroBgImage?.id
    ? `url(${`${workspaceURL}/${SUBAPP_CODES.forum}/api/hero/background`})`
    : IMAGE_URL;

  const handleGroupSearch = (value: string) => {
    setGroupSearchKey(value);
  };

  const handleDialogOpen = () => {
    if (!isLoggedIn || !isAllowedToPost) return;
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearchFocus = () => {
    setForceClose(false);
  };

  const handleSearchFilter = (value: string, search: string) => {
    const regex = /^(.*?)(?==[^=]*$)/;
    if (value.match(regex)?.[0].includes(search.toLowerCase())) return 1;
    return 0;
  };

  const handleSearch = (term: string) => {
    if (term.length === 0) {
      update(
        [
          {key: URL_PARAMS.searchid, value: null},
          {key: URL_PARAMS.search, value: null},
        ],
        {scroll: false},
      );
    } else {
      setSearchValue(term);
    }
  };

  const handleSearchItemClick = useCallback(
    (result: any) => {
      if (!result) return;
      update([{key: URL_PARAMS.searchid, value: result.id}], {scroll: false});
      setForceClose(true);
    },
    [update],
  );

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, term: string) => {
      if (e.key === 'Enter' && term.trim().length > 0) {
        update([{key: URL_PARAMS.search, value: term}], {scroll: false});
      }
    },
    [update],
  );

  useEffect(() => {
    const getGroups = async () => {
      try {
        if (groupSearchValue) {
          const searchKeyLower = groupSearchValue.toLowerCase();

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
  }, [isLoggedIn, groupSearchValue, memberGroups, nonMemberGroups]);

  const renderSearch = () => (
    <Search
      searchKey="label"
      forceClose={forceClose}
      findQuery={async ({query}: any) => {
        const response: any = await fetchPosts({
          workspaceURL,
          search: query,
          limit: DEFAULT_LIMIT,
        });
        if (response) {
          const {posts} = response;
          return posts.map((p: any) => ({
            ...p,
            label: `${p.title.toLowerCase()}=${p.id}`,
          }));
        }
        return [];
      }}
      renderItem={SearchItem}
      onSearch={handleSearch}
      onItemClick={handleSearchItemClick}
      onFilter={handleSearchFilter}
      onFocus={handleSearchFocus}
      onKeyDown={handleSearchKeyDown}
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
          (workspace?.config?.forumHeroTitle || i18n.t(BANNER_TITLES.forum))
        }
        description={
          selectedGroup?.description ??
          (workspace?.config?.forumHeroDescription ||
            i18n.t(BANNER_DESCRIPTION))
        }
        image={imageURL}
        groupImg={
          selectedGroup?.image?.id &&
          `${workspaceURL}/${SUBAPP_CODES.forum}/api/group/${selectedGroup?.id}/image`
        }
        background={workspace?.config?.forumHeroOverlayColorSelect || 'default'}
        blendMode={
          workspace?.config?.forumHeroOverlayColorSelect ? 'overlay' : 'normal'
        }
        renderSearch={!selectedGroup && renderSearch}
      />
      <div className="container py-6 mx-auto grid grid-cols-1 md:grid-cols-[17.563rem_1fr] gap-5">
        <div className="h-fit flex flex-col gap-6 bg-white p-4 rounded-lg">
          <div>
            <h1 className="font-semibold text-xl leading-[1.875rem]">
              {i18n.t(GROUPS)}
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
        <div className="w-full overflow-hidden mb-16 lg:mb-0">
          <div className="bg-white px-4 py-4 rounded-t-lg flex items-center gap-[0.625rem]">
            <Avatar
              className={`rounded-full h-8 w-8 ${!isLoggedIn ? 'bg-gray-light' : ''}`}>
              {<AvatarImage src={getImageURL(picture?.id, tenant)} />}
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
                ? isAllowedToPost
                  ? i18n.t(START_A_POST)
                  : i18n.t(JOIN_GROUP_TO_POST)
                : i18n.t(DISABLED_SEARCH_PLACEHOLDER)}
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

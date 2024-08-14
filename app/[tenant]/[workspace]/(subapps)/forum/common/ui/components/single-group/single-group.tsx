'use client';

import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {MdOutlineImage} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {IMAGE_URL} from '@/constants';
import {i18n} from '@/lib/i18n';
import {Avatar, AvatarImage, Button, HeroSearch} from '@/ui/components';
import {useSearchParams} from '@/ui/hooks';

// ---- LOCAL IMPORTS ---- //
import {
  DISABLED_SEARCH_PLACEHOLDER,
  GROUP,
  GROUPS,
  MEMBER,
  NOT_MEMBER,
  START_A_POST,
  TAB_TITLES,
} from '@/subapps/forum/common/constants';
import {
  GroupActionList,
  Search as GroupSearch,
  Tabs,
  UploadPost,
} from '@/subapps/forum/common/ui/components';
import type {ForumGroup, Group, Post} from '@/subapps/forum/common/types/forum';
import {findGroups} from '@/subapps/forum/common/action/action';
import {getImageURL} from '@/app/[tenant]/[workspace]/(subapps)/news/common/utils';

export const SingleGroup = ({
  memberGroups,
  nonMemberGroups,
  user,
  posts,
  selectedGroup,
  pageInfo,
}: {
  memberGroups: Group[];
  nonMemberGroups: Group[];
  user: any;
  posts: Post[];
  selectedGroup: ForumGroup;
  pageInfo: any;
}) => {
  const [open, setOpen] = useState(false);

  const [memberGroupList, setMemberGroupList] = useState<Group[]>([]);
  const [nonMemeberGroupList, setNonMemberGroupList] = useState<Group[]>([]);
  const [searchKey, setSearchKey] = useState<string>('');

  const [initialType, setInitialType] = useState<string>('');

  const router = useRouter();
  const {workspaceURI, workspaceID} = useWorkspace();

  const {searchParams} = useSearchParams();
  const type = searchParams.get('type') ?? 'posts';
  const isLoggedIn = user?.id ? true : false;

  useEffect(() => {
    setMemberGroupList(memberGroups);
    setNonMemberGroupList(nonMemberGroups);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      findGroups({
        id: user?.id as string,
        isMember: true,
        searchKey,
        workspaceID,
      })
        .then(setMemberGroupList)
        .catch(err => console.log(err));
    }

    findGroups({
      id: user?.id,
      isMember: false,
      searchKey,
      workspaceID,
    })
      .then(setNonMemberGroupList)
      .catch(err => console.log(err));
  }, [searchKey]);

  const handleChangeSerachKey = (value: string) => {
    setSearchKey(value);
  };

  const handleTabClick = (type: string) => {
    router.push(
      `${workspaceURI}/forum/group/${selectedGroup?.id}?type=${type}`,
    );
  };
  const hanldeDialogOpen = (initialType: string = '') => {
    setInitialType(initialType);
    setOpen(true);
  };
  const handleClose = () => {
    setInitialType('');
    setOpen(false);
  };

  return (
    <div>
      <HeroSearch
        groupImg={selectedGroup?.image?.id}
        title={selectedGroup?.name}
        description={selectedGroup?.description}
        image={IMAGE_URL}
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
              groupId={selectedGroup?.id}
            />
          )}
          <GroupActionList
            title={NOT_MEMBER}
            userId={user?.id}
            groups={nonMemeberGroupList}
            groupId={selectedGroup?.id}
          />
        </div>
        <div className="w-full md:w-4/5 mb-16 lg:mb-0">
          <div className="bg-white px-4 pt-4 pb-1 rounded-t-lg flex items-center gap-[10px]">
            <Avatar
              className={`rounded-full h-8 w-8 ${isLoggedIn ? '' : 'bg-black/20'}`}>
              {isLoggedIn && (
                <AvatarImage src={getImageURL(user?.picture?.id)} />
              )}
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
            <Button
              disabled={!isLoggedIn}
              onClick={() => hanldeDialogOpen('image')}
              className="bg-white hover:bg-white text-success hover:text-success-dark border-success hover:border-success-dark rounded-md border py-4 px-[11px]
              disabled:bg-black/20 disabled:border-gray-700 disabled:text-gray-700">
              <MdOutlineImage className="h-6 w-6" />
            </Button>
          </div>
          <Tabs
            tabs={TAB_TITLES}
            onClick={handleTabClick}
            activeTab={type}
            posts={posts}
            groupId={selectedGroup.id}
            pageInfo={pageInfo}
          />
        </div>
      </div>
      <UploadPost open={open} onClose={handleClose} initialType={initialType} />
    </div>
  );
};

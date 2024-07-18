'use client';

// ---- LOCAL IMPORTS ---- //
import {GroupActionList, Search} from '@/subapps/forum/common/ui/components';
import {GROUPS, MEMBER, NOT_MEMBER} from '@/subapps/forum/common/constants';

const Content = () => {
  return (
    <div className="flex gap-5 px-[100px] py-6 w-full">
      <div className="w-1/4 flex flex-col gap-6 bg-white p-4 rounded-lg">
        <div>
          <h1 className="font-semibold text-xl leading-[30px]">{GROUPS}</h1>
        </div>
        <Search />
        <GroupActionList title={MEMBER} />
        <GroupActionList title={NOT_MEMBER} />
      </div>
      <div className="w-3/4">
        <h1>Content</h1>
      </div>
    </div>
  );
};

export default Content;

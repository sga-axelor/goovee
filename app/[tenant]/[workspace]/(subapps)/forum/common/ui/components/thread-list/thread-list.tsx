'use client';

// ---- CORE IMPORTS ---- //
import {Separator} from '@/ui/components';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import {THREAD_SORT_BY_OPTIONS} from '@/subapps/forum/common/constants';
import {DropdownToggle, Thread} from '@/subapps/forum/common/ui/components';

export const ThreadList = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex gap-4 items-center">
        <div>{i18n.get('Thread')}</div>
        <Separator
          style={{
            flexShrink: 1,
          }}
        />
        <div className="flex gap-2 text-base flex-shrink-0">
          <div>{i18n.get('Sort by')}:</div>
          <DropdownToggle options={THREAD_SORT_BY_OPTIONS} />
        </div>
      </div>
      <Thread />
    </div>
  );
};

export default ThreadList;

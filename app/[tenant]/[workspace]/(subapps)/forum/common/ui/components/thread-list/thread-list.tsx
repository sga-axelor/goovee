'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {Separator} from '@/ui/components';
import {i18n} from '@/lib/i18n';
import {useSearchParams} from '@/ui/hooks';
import {URL_PARAMS} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {THREAD_SORT_BY_OPTIONS} from '@/subapps/forum/common/constants';
import {DropdownToggle, Thread} from '@/subapps/forum/common/ui/components';
import {Post} from '@/subapps/forum/common/types/forum';

export const ThreadList = ({posts}: {posts: Post[]}) => {
  const {update} = useSearchParams();

  const handleSortBy = (value: any) => {
    if (!value) {
      return;
    }
    update([{key: URL_PARAMS.sort, value}]);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex gap-4 items-center">
        <div>{i18n.get('Thread')}</div>
        <Separator
          style={{
            flexShrink: 1,
          }}
        />
        <div className="flex gap-2 text-base flex-shrink-0">
          <div>{i18n.get('Sort by')}:</div>
          <DropdownToggle
            options={THREAD_SORT_BY_OPTIONS}
            handleDropdown={handleSortBy}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {posts?.map(post => (
          <React.Fragment key={post.id}>
            <Thread post={post} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ThreadList;

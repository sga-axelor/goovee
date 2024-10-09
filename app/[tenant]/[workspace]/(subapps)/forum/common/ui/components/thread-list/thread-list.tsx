'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {DropdownToggle, Separator} from '@/ui/components';
import {i18n} from '@/lib/i18n';
import {useSearchParams} from '@/ui/hooks';
import {SORT_BY_OPTIONS, URL_PARAMS} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {InfiniteScroll} from '@/subapps/forum/common/ui/components';
import {useForum} from '@/subapps/forum/common/ui/context';

export const ThreadList = () => {
  const {update, searchParams} = useSearchParams();
  const sort = searchParams.get('sort') ?? 'new';

  const {posts, pageInfo} = useForum();

  const handleSortBy = (value: any) => {
    if (!value) {
      return;
    }
    update([{key: URL_PARAMS.sort, value}], {scroll: false});
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
            value={sort}
            options={SORT_BY_OPTIONS}
            handleDropdown={handleSortBy}
          />
        </div>
      </div>
      {!posts?.length ? (
        <div>{i18n.get('No posts available.')}</div>
      ) : (
        <div className="flex flex-col gap-4">
          <InfiniteScroll initialPosts={posts} pageInfo={pageInfo} />
        </div>
      )}
    </div>
  );
};

export default ThreadList;

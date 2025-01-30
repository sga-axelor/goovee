'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {DropdownToggle, Separator} from '@/ui/components';
import {i18n} from '@/locale';
import {useSearchParams} from '@/ui/hooks';
import {URL_PARAMS} from '@/constants';
import {SORT_BY_OPTIONS} from '@/comments';

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
        <div>{i18n.t('Thread')}</div>
        <Separator
          style={{
            flexShrink: 1,
          }}
        />
        <DropdownToggle
          title={i18n.t('Sort by')}
          value={sort}
          options={SORT_BY_OPTIONS}
          onSelect={handleSortBy}
        />
      </div>
      {!posts?.length ? (
        <div>{i18n.t('No posts available.')}</div>
      ) : (
        <div className="flex flex-col gap-4">
          <InfiniteScroll initialPosts={posts} pageInfo={pageInfo} />
        </div>
      )}
    </div>
  );
};

export default ThreadList;

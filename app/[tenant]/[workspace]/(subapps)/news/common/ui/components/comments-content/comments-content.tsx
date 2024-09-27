'use client';

import React from 'react';
import {useSession} from 'next-auth/react';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {Comments} from '@/ui/components';
import {COMMENTS, SORT_TYPE} from '@/constants';
import {ModelType} from '@/types';

export const CommentsContent = ({newsId}: {newsId: string | number}) => {
  const {data: session} = useSession();
  const isDisabled = !session ? true : false;
  return (
    <div className="p-4 bg-white flex flex-col gap-4 rounded-lg">
      <div>
        <div className="text-xl font-semibold">{i18n.get(COMMENTS)}</div>
      </div>

      <Comments
        record={{id: newsId}}
        modelType={ModelType.news}
        showCommentsByDefault={true}
        disabled={isDisabled}
        inputPosition="bottom"
        hideCommentsHeader={true}
        hideSortBy={true}
        showReactions={false}
        showTopBorder={false}
        hideCloseComments={true}
        sortByProp={SORT_TYPE.old}
      />
    </div>
  );
};

export default CommentsContent;

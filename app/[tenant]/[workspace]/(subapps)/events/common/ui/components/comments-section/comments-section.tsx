'use client';

// ---- CORE IMPORTS ---- //
import {Card} from '@/ui/components';
import {i18n} from '@/i18n';
import {Comments} from '@/ui/components';
import {ModelType} from '@/types';
import {SORT_TYPE} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import type {CommentSectionProps} from '@/subapps/events/common/ui/components';

export const CommentsSection = ({eventId}: CommentSectionProps) => {
  return (
    <Card className="rounded-2xl border-none shadow-none p-4 w-full space-y-4 ">
      <h2 className="text-xl font-semibold">{i18n.get('Comments')}</h2>

      <Comments
        record={{id: eventId}}
        modelType={ModelType.event}
        showCommentsByDefault={true}
        inputPosition="bottom"
        hideCommentsHeader={true}
        hideSortBy={true}
        showReactions={false}
        showTopBorder={false}
        hideCloseComments={true}
        sortByProp={SORT_TYPE.old}
      />
    </Card>
  );
};

'use client';

// ---- CORE IMPORTS ---- //
import {Card} from '@/ui/components';
import {i18n} from '@/locale';
import {Comments} from '@/ui/components';
import {SORT_TYPE, SUBAPP_CODES} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import type {CommentSectionProps} from '@/subapps/events/common/ui/components';

export const CommentsSection = ({eventId}: CommentSectionProps) => {
  return (
    <Card className="rounded-2xl border-none shadow-none p-4 w-full space-y-4 ">
      <h2 className="text-xl font-semibold">{i18n.t('Comments')}</h2>

      <Comments
        recordId={eventId}
        subapp={SUBAPP_CODES.events}
        inputPosition="bottom"
        sortBy={SORT_TYPE.old}
        showCommentsByDefault
        hideCommentsHeader
        hideSortBy
        hideTopBorder
        hideCloseComments
      />
    </Card>
  );
};

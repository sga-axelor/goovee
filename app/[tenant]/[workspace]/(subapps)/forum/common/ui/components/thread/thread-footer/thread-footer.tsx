'use client';

// ---- CORE IMPORTS ---- //
import {ModelType} from '@/types';

import {Comments} from '@/ui/components';

export const ThreadFooter = ({
  post,
  showCommentsByDefault,
  hideCloseComments = false,
  usePopUpStyles = false,
}: {
  post: any;
  showCommentsByDefault: boolean;
  hideCloseComments?: boolean;
  usePopUpStyles?: boolean;
}) => {
  return (
    <Comments
      record={post}
      modelType={ModelType.forum}
      showCommentsByDefault={showCommentsByDefault}
      hideCloseComments={hideCloseComments}
      inputPosition="top"
      usePopUpStyles={usePopUpStyles}
      seeMore={false}
    />
  );
};

export default ThreadFooter;

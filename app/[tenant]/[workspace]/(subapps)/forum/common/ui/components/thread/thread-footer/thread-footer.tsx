'use client';

import {MdOutlineThumbUp} from 'react-icons/md';
import {useSession} from 'next-auth/react';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {Input} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {
  COMMENT,
  DISABLED_COMMENT_PLACEHOLDER,
} from '@/subapps/forum/common/constants';
import {Comments} from '@/subapps/forum/common/ui/components';

export const ThreadFooter = ({
  comments,
  showComments,
  hideCloseComments = false,
  usePopUpStyles = false,

  toggleComments,
}: {
  comments: any;
  showComments: boolean;
  hideCloseComments?: boolean;
  usePopUpStyles?: boolean;

  toggleComments: () => void;
}) => {
  const {data: session} = useSession();

  const isLoggedIn = session?.user?.id;

  return (
    <div className="border-t">
      <div className="flex items-center gap-6 px-4 py-2">
        <div
          className={`${isLoggedIn ? 'cursor-pointer' : 'bg-black/20 text-gray-700 p-2 rounded-lg cursor-not-allowed'}`}>
          <MdOutlineThumbUp className="w-6 h-6 " />
        </div>
        <Input
          disabled={!isLoggedIn}
          className={`placeholder:text-sm placeholder:text-palette-mediumGray disabled:placeholder:text-gray-700 border ${isLoggedIn ? 'bg-white' : 'bg-black/20'}`}
          placeholder={
            isLoggedIn
              ? i18n.get(COMMENT)
              : i18n.get(DISABLED_COMMENT_PLACEHOLDER)
          }
        />
      </div>
      {showComments && (
        <Comments
          comments={comments}
          usePopUpStyles={usePopUpStyles}
          hideCloseComments={hideCloseComments}
          toggleComments={toggleComments}
        />
      )}
    </div>
  );
};

export default ThreadFooter;

'use client';

import {useState, KeyboardEvent} from 'react';
import {MdOutlineThumbUp} from 'react-icons/md';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {Input} from '@/ui/components';
import {useToast} from '@/ui/hooks';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {
  COMMENT,
  DISABLED_COMMENT_PLACEHOLDER,
} from '@/subapps/forum/common/constants';
import {Comments} from '@/subapps/forum/common/ui/components';
import {addComment} from '@/subapps/forum/common/action/action';
import {CommentResponse} from '@/subapps/forum/common/types/forum';

export const ThreadFooter = ({
  post,
  comments,
  showComments,
  hideCloseComments = false,
  usePopUpStyles = false,
  toggleComments,
}: {
  post: any;
  comments: any;
  showComments: boolean;
  hideCloseComments?: boolean;
  usePopUpStyles?: boolean;

  toggleComments: () => void;
}) => {
  const [comment, setComment] = useState<any>('');

  const {data: session} = useSession();
  const isLoggedIn = session?.user?.id;

  const {workspaceURL, workspaceURI} = useWorkspace();

  const {toast} = useToast();
  const router = useRouter();

  const handleComment = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      const response: CommentResponse = await addComment({
        workspaceURL,
        postId: post?.id,
        contentComment: comment,
      });

      if (response.success) {
        toast({
          variant: 'success',
          title: i18n.get('Comment added successfully.'),
        });
        setComment('');
        router.refresh();
        router.push(`${workspaceURI}/forum`, {scroll: false});
      } else {
        toast({
          variant: 'destructive',
          title: i18n.get(response.message || 'An error occurred'),
        });
      }
    }
  };

  return (
    <div className="border-t">
      <div className="flex items-center gap-6 px-4 py-2">
        <div
          className={`${isLoggedIn ? 'cursor-pointer' : 'bg-black/20 text-gray-700 p-2 rounded-lg cursor-not-allowed'}`}>
          <MdOutlineThumbUp className="w-6 h-6 " />
        </div>
        <Input
          id="comment"
          name="comment"
          disabled={!isLoggedIn}
          className={`placeholder:text-sm placeholder:text-palette-mediumGray disabled:placeholder:text-gray-700 border ${isLoggedIn ? 'bg-white' : 'bg-black/20'}`}
          placeholder={
            isLoggedIn
              ? i18n.get(COMMENT)
              : i18n.get(DISABLED_COMMENT_PLACEHOLDER)
          }
          onChange={event => setComment(event.target.value)}
          onKeyDown={e => handleComment(e)}
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

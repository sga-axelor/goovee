'use client';

import {MdOutlineModeComment, MdOutlineThumbUp} from 'react-icons/md';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {useToast} from '@/ui/hooks';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {Comment} from '@/ui/components/comment';
import {createComment} from '@/app/actions/comment';
import {ModelType} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {
  COMMENT,
  COMMENTS,
  DISABLED_COMMENT_PLACEHOLDER,
} from '@/subapps/forum/common/constants';
import {Comments} from '@/subapps/forum/common/ui/components';
import {CommentResponse} from '@/subapps/forum/common/types/forum';
import {useState} from 'react';

export const ThreadFooter = ({
  post,
  comments,
  showCommentsByDefault,
  hideCloseComments = false,
  usePopUpStyles = false,
}: {
  post: any;
  comments: any;
  showCommentsByDefault: boolean;
  hideCloseComments?: boolean;
  usePopUpStyles?: boolean;
}) => {
  const [showComments, setShowComments] = useState(
    showCommentsByDefault ?? false,
  );
  const toggleComments = () => {
    comments.length >= 1 &&
      setShowComments(prevShowComments => !prevShowComments);
  };

  const {data: session} = useSession();
  const isLoggedIn = session?.user?.id;

  const commentsLength = comments?.length;

  const {workspaceURL} = useWorkspace();

  const {toast} = useToast();
  const router = useRouter();

  const handleComment = async ({
    formData,
    values,
  }: {
    formData: any;
    values: any;
  }) => {
    try {
      const response = await createComment({
        formData,
        values,
        workspaceURL,
        modelID: post.id,
        parentId: null,
        type: ModelType.forum,
      });

      const {success, message}: CommentResponse = response;

      if (success) {
        toast({
          variant: 'success',
          title: i18n.get('Comment created successfully.'),
        });
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: i18n.get(message || 'Error creating comment'),
        });
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        variant: 'destructive',
        title: i18n.get(error?.message || 'An unexpected error occurred.'),
      });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between px-4 pb-4">
        <div></div>
        <div
          className={`flex gap-2 items-center ${commentsLength ? 'cursor-pointer' : 'cursor-default'} `}
          onClick={toggleComments}>
          <MdOutlineModeComment className="w-6 h-6" />
          <span className="text-sm">
            {commentsLength}{' '}
            {commentsLength > 1
              ? i18n.get(COMMENTS.toLowerCase())
              : i18n.get(COMMENT.toLowerCase())}
          </span>
        </div>
      </div>
      <div className="border-t">
        <div className="flex items-center gap-6 px-4 py-2">
          <div
            className={`${isLoggedIn ? 'cursor-pointer' : 'bg-black/20 text-gray-700 p-2 rounded-lg cursor-not-allowed'}`}>
            <MdOutlineThumbUp className="w-6 h-6 " />
          </div>
          <Comment
            disabled={!isLoggedIn}
            className={`placeholder:text-sm placeholder:text-palette-mediumGray disabled:placeholder:text-gray-700 border ${isLoggedIn ? 'bg-white' : 'bg-black/20'}`}
            placeholderText={
              isLoggedIn
                ? i18n.get(COMMENT)
                : i18n.get(DISABLED_COMMENT_PLACEHOLDER)
            }
            onSubmit={handleComment}
          />
        </div>
        {showComments && (
          <Comments
            model={post}
            usePopUpStyles={usePopUpStyles}
            hideCloseComments={hideCloseComments}
            toggleComments={toggleComments}
          />
        )}
      </div>
    </div>
  );
};

export default ThreadFooter;

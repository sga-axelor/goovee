'use client';

import {useState, useCallback, useEffect, memo} from 'react';
import {
  MdClose,
  MdAdd,
  MdOutlineModeComment,
  MdOutlineThumbUp,
  MdFavoriteBorder,
  MdOutlineMoreHoriz,
} from 'react-icons/md';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {
  Separator,
  Avatar,
  AvatarImage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/components';
import {i18n} from '@/lib/i18n';
import {parseDate} from '@/utils/date';
import {DATE_FORMATS, DEFAULT_PAGE} from '@/constants';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {useToast} from '@/ui/hooks';
import {createComment} from '@/app/actions/comment';
import {Comment} from '@/ui/components/comment';
import {ModelType} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {
  COMMENT,
  COMMENTS,
  DEFAULT_COMMENT_LIMIT,
  DISABLED_COMMENT_PLACEHOLDER,
  NOT_INTERESTED,
  REPORT,
  THREAD_SORT_BY_OPTIONS,
} from '@/subapps/forum/common/constants';
import {DropdownToggle} from '@/subapps/forum/common/ui/components';
import {getImageURL} from '@/app/[tenant]/[workspace]/(subapps)/news/common/utils';
import {CommentResponse} from '@/subapps/forum/common/types/forum';
import {fetchComments} from '@/subapps/forum/common/action/action';

export const CommentContent = memo(
  ({
    postId,
    parentCommentId,
    comment,
  }: {
    postId?: any;
    parentCommentId: string;
    comment?: any;
  }) => {
    const [showSubComments, setShowSubComments] = useState(false);

    const {data: session} = useSession();
    const {workspaceURL, workspaceURI} = useWorkspace();
    const {toast} = useToast();
    const router = useRouter();

    const isLoggedIn = Boolean(session?.user?.id);
    const {createdOn, mailMessage, childCommentList = [], id} = comment;

    const {messageContentHtml, author} = mailMessage;

    const handleSubComments = () => setShowSubComments(prev => !prev);

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
          modelID: postId,
          parentId: parentCommentId,
          type: ModelType.forum,
        });

        const {success, message}: CommentResponse = response;

        if (success) {
          toast({
            variant: 'success',
            title: i18n.get('Comment added successfully.'),
          });
          router.refresh();
        } else {
          toast({
            variant: 'destructive',
            title: i18n.get(
              message || 'An error occurred while creating comment',
            ),
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

    if (!comment) return null;

    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-between items-center">
          <div className="flex gap-2">
            <Avatar className="rounded-full h-6 w-6">
              <AvatarImage
                src={
                  getImageURL(author?.partner?.picture?.id) ??
                  '/images/no-image.png'
                }
              />
            </Avatar>
            <span className="font-semibold text-base">
              {author?.partner?.simpleFullName ?? ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs">
              {parseDate(createdOn, DATE_FORMATS.full_date)}
            </div>
            <Popover>
              <PopoverTrigger>
                <MdOutlineMoreHoriz className="w-6 h-6 cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent className="p-0 w-fit">
                <div className="flex flex-col gap-[10px] p-4 bg-white rounded-lg text-xs leading-[18px]">
                  <div className="cursor-pointer">{i18n.get(REPORT)}</div>
                  <div className="cursor-pointer">
                    {i18n.get(NOT_INTERESTED)}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div>
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html: messageContentHtml || '',
            }}></div>
          <div className="flex justify-end items-center gap-6 mt-1 mb-4">
            <div className="flex rounded-lg border h-8">
              <MdOutlineThumbUp className="w-8 h-full cursor-pointer p-2 border-r" />
              <div className="flex p-2">
                <MdOutlineThumbUp className="cursor-pointer" />
                <MdFavoriteBorder className="cursor-pointer" />
              </div>
            </div>
            <div
              className={`flex gap-2 items-center ${childCommentList.length ? 'cursor-pointer' : 'cursor-default'}`}
              onClick={handleSubComments}>
              <MdOutlineModeComment className="w-4 h-4" />
              {parentCommentId === id && (
                <span className="text-sm">
                  {childCommentList.length}{' '}
                  {i18n.get(
                    childCommentList.length > 1
                      ? COMMENTS.toLowerCase()
                      : COMMENT.toLowerCase(),
                  )}
                </span>
              )}
            </div>
          </div>
          {showSubComments && (
            <Comment
              className={`placeholder:text-sm placeholder:text-palette-mediumGray disabled:placeholder:text-gray-700 border ${isLoggedIn ? 'bg-white' : 'bg-black/20'}`}
              placeholderText={
                isLoggedIn
                  ? i18n.get(COMMENT)
                  : i18n.get(DISABLED_COMMENT_PLACEHOLDER)
              }
              onSubmit={handleComment}
            />
          )}
        </div>
        {showSubComments &&
          parentCommentId === id &&
          childCommentList.length > 0 && (
            <div className="ml-6 mt-2">
              {childCommentList.map((childComment: any) => (
                <CommentContent
                  key={childComment.id}
                  parentCommentId={parentCommentId}
                  comment={childComment}
                />
              ))}
            </div>
          )}
      </div>
    );
  },
);

CommentContent.displayName = 'Comment';

export const Comments = memo(
  ({
    post,
    comments,
    hideCloseComments = false,
    usePopUpStyles = false,
    toggleComments = () => {},
  }: {
    post: any;
    comments: any;
    usePopUpStyles?: boolean;
    hideCloseComments?: boolean;
    toggleComments?: () => void;
  }) => {
    console.log('comments >>>', comments);
    const [loading, setLoading] = useState(false);
    const [commentsList, setCommentsList] = useState<any[]>([]);
    const [sortBy, setSortBy] = useState('new');
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    const {toast} = useToast();

    const handleSortBy = useCallback(
      async (value: string) => {
        if (!value) return;

        try {
          const response = await fetchComments({
            postId: post.id,
            sort: value,
            limit: commentsList.length,
            page: DEFAULT_PAGE,
          });

          if (response.success) {
            setCommentsList(response.data);
            setSortBy(value);
          } else {
            toast({
              variant: 'destructive',
              title: i18n.get(response.message ?? 'Something went wrong!'),
            });
          }
        } catch (error) {
          toast({
            variant: 'destructive',
            title: i18n.get('An error occurred while fetching comments.'),
          });
        }
      },
      [post.id, commentsList.length],
    );

    const handleSeeMore = async () => {
      if (commentsList.length >= total) return;

      try {
        setLoading(true);
        const nextPage = page + 1;

        const response: any = await fetchComments({
          sort: sortBy,
          postId: post.id,
          limit: DEFAULT_COMMENT_LIMIT,
          page: nextPage,
        });

        if (response.success) {
          setCommentsList(prev => [...prev, ...response.data]);
          setTotal(response.total);
          setPage(nextPage);
        } else {
          toast({
            variant: 'destructive',
            title: i18n.get(response.message ?? 'Something went wrong!'),
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: i18n.get('An error occurred while fetching comments.'),
        });
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (comments?.length) {
        setCommentsList(comments.slice(0, DEFAULT_COMMENT_LIMIT));
        setTotal(comments.length);
      }
    }, []);

    return (
      <div
        className={`border-t flex flex-col gap-4 ${usePopUpStyles ? 'py-4 px-4 md:px-0' : 'p-4'}`}>
        <div className="w-full flex gap-4 items-center">
          <div className="flex gap-2 text-base flex-shrink-0">
            <div>{i18n.get('Sort by')}:</div>
            <DropdownToggle
              options={THREAD_SORT_BY_OPTIONS}
              handleDropdown={handleSortBy}
            />
          </div>
          <Separator style={{flexShrink: 1}} />
        </div>
        <div
          className={`flex flex-col gap-4 ${usePopUpStyles ? 'h-full overflow-auto px-2' : ''}`}>
          {commentsList.map((comment: any) => (
            <div key={comment.id} className="flex flex-col gap-4">
              <CommentContent
                postId={post.id}
                parentCommentId={comment.id}
                comment={comment}
              />
            </div>
          ))}
        </div>

        {loading && <p className="text-center text-sm">Loading...</p>}

        <div
          className={`flex items-center ${hideCloseComments ? 'justify-end' : 'justify-between'}`}>
          {!hideCloseComments && (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={toggleComments}>
              <MdClose className="w-4 h-4" />
              <span className="text-xs font-semibold leading-[18px]">
                {i18n.get('Close comments')}
              </span>
            </div>
          )}
          <div
            className={`flex items-center gap-2 ${total === commentsList.length ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={handleSeeMore}>
            <MdAdd className="w-4 h-4" />
            <span className="text-xs font-semibold leading-[18px]">
              {i18n.get('See more')}
            </span>
          </div>
        </div>
      </div>
    );
  },
);

Comments.displayName = 'Comments';

export default Comments;

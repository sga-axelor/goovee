'use client';

import React from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {useSession} from 'next-auth/react';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {COMMENTS, Comments, isCommentEnabled, SORT_TYPE} from '@/comments';
import {SUBAPP_CODES} from '@/constants';
import {PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {
  Breadcrumb,
  FeedList,
  NewsInfo,
  SocialMedia,
  AttachmentList,
} from '@/subapps/news/common/ui/components';
import {
  RECOMMENDED_NEWS,
  RELATED_NEWS,
  RELATED_FILES,
} from '@/subapps/news/common/constants';
import {
  createComment,
  fetchComments,
} from '@/subapps/news/common/actions/action';

interface ArticleProps {
  news: any;
  breadcrumbs: any;
  workspace: PortalWorkspace;
}

export const Article = ({news, breadcrumbs = [], workspace}: ArticleProps) => {
  const {
    title,
    categorySet,
    image,
    description,
    publicationDateTime,
    content,
    author,
    relatedNewsSet,
    recommendedNews,
    attachmentList,
    slug,
  } = news || {};
  const router = useRouter();
  const pathname = usePathname();
  const {workspaceURL} = useWorkspace();

  const {data: session} = useSession();
  const isDisabled = !session ? true : false;

  const enableSocialMediaSharing = workspace.config?.enableSocialMediaSharing;
  const availableSocials = workspace.config?.socialMediaSelect;
  const enableComment = isCommentEnabled({
    subapp: SUBAPP_CODES.news,
    workspace,
  });

  const handleClick = (slug: string) => {
    const urlRoute = pathname.split('/article/')[0];
    router.push(`${urlRoute}/article/${slug}`);
  };

  const directRoute = pathname.includes('/news/article/');

  return (
    <div className={`container mx-auto grid grid-cols-1 gap-6 mt-6`}>
      {!directRoute && (
        <div className="py-4">
          <Breadcrumb items={breadcrumbs} title={title} />
        </div>
      )}

      <div className=" grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NewsInfo
            title={title}
            categorySet={categorySet}
            image={image}
            description={description}
            publicationDateTime={publicationDateTime}
            content={content}
            author={author}
            slug={slug}
          />
        </div>

        <div className="w-full flex flex-col gap-6">
          {enableSocialMediaSharing && false && (
            <SocialMedia availableSocials={availableSocials} />
          )}
          {attachmentList?.length > 0 && (
            <AttachmentList
              title={i18n.t(RELATED_FILES)}
              items={attachmentList}
              width="w-full"
            />
          )}

          {relatedNewsSet?.length > 0 && (
            <FeedList
              title={i18n.t(RELATED_NEWS)}
              items={relatedNewsSet}
              width="w-full"
              onClick={handleClick}
            />
          )}
          {recommendedNews?.length > 0 && (
            <FeedList
              title={i18n.t(RECOMMENDED_NEWS)}
              items={recommendedNews}
              width="w-full"
              onClick={handleClick}
            />
          )}
        </div>
      </div>

      {enableComment && (
        <div className="w-full mb-24 lg:mb-4">
          <div className="p-4 bg-white flex flex-col gap-4 rounded-lg">
            <div>
              <div className="text-xl font-semibold">{i18n.t(COMMENTS)}</div>
            </div>

            <Comments
              recordId={news.id}
              subapp={SUBAPP_CODES.news}
              disabled={isDisabled}
              inputPosition="bottom"
              sortBy={SORT_TYPE.old}
              showCommentsByDefault
              hideCommentsHeader
              hideSortBy
              hideTopBorder
              hideCloseComments
              showRepliesInMainThread
              trackingField="publicBody"
              commentField="note"
              createComment={createComment}
              fetchComments={fetchComments}
              attachmentDownloadUrl={`${workspaceURL}/${SUBAPP_CODES.news}/api/comments/attachments/${news.id}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Article;

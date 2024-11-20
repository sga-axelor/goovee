'use client';

import React from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {useSession} from 'next-auth/react';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {COMMENTS, SORT_TYPE} from '@/constants';
import {Comments} from '@/ui/components';
import {ModelType, PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {
  Breadcrumb,
  FeedList,
  NewsInfo,
  SocialMedia,
} from '@/subapps/news/common/ui/components';
import {RELATED_NEWS} from '@/subapps/news/common/constants';
import styles from '@/subapps/news/common/ui/styles/news.module.scss';

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
  } = news || {};
  const router = useRouter();
  const pathname = usePathname();

  const {data: session} = useSession();
  const isDisabled = !session ? true : false;

  const enableSocialMediaSharing = workspace.config?.enableSocialMediaSharing;

  const handleClick = (slug: string) => {
    const urlRoute = pathname.split('/article/')[0];
    router.push(`${urlRoute}/article/${slug}`);
  };

  const directRoute = pathname.includes('/news/article/');

  return (
    <div
      className={`${styles['news-container']} flex-1 py-6 px-4 lg:px-[100px] flex flex-col gap-6`}>
      {!directRoute && (
        <div className="py-4">
          <Breadcrumb items={breadcrumbs} title={title} />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          <NewsInfo
            title={title}
            categorySet={categorySet}
            image={image}
            description={description}
            publicationDateTime={publicationDateTime}
            content={content}
            author={author}
          />
        </div>

        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          {enableSocialMediaSharing && <SocialMedia />}
          {relatedNewsSet?.length > 0 && (
            <FeedList
              title={i18n.get(RELATED_NEWS)}
              items={relatedNewsSet}
              width="w-full"
              onClick={handleClick}
            />
          )}
        </div>
      </div>

      <div className="w-full mb-16 lg:mb-4">
        <div className="p-4 bg-white flex flex-col gap-4 rounded-lg">
          <div>
            <div className="text-xl font-semibold">{i18n.get(COMMENTS)}</div>
          </div>

          <Comments
            record={{id: news.id}}
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
      </div>
    </div>
  );
};

export default Article;

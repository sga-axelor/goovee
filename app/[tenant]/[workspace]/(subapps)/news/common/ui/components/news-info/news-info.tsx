'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {Avatar, AvatarImage} from '@/ui/components/avatar';
import {Separator} from '@/ui/components/separator';
import {i18n} from '@/locale';
import {getPartnerImageURL} from '@/utils/files';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {formatDate} from '@/locale/formatters';
import {NO_IMAGE_URL, SUBAPP_CODES} from '@/constants';
import {BadgeList, Skeleton} from '@/ui/components';
import {PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {getFormatString} from '@/subapps/news/common/utils';
import {PUBLISHED_ON} from '@/subapps/news/common/constants';
import Image from 'next/image';

export const NewsInfo = ({
  title,
  slug,
  categorySet,
  image,
  description,
  publicationDateTime,
  content,
  author,
  workspace,
}: {
  title: string;
  slug: string;
  categorySet: any[];
  image: {id: string; fileName?: string};
  description: string;
  publicationDateTime: string;
  content: string;
  author: {
    id: string | number;
    simpleFullName: string;
    picture: {
      id: string;
    };
  };
  workspace: PortalWorkspace;
}) => {
  const {tenant, workspaceURI} = useWorkspace();
  const {
    isShowPublicationAuthor,
    isShowPublicationDate,
    isShowPublicationTime,
  } = workspace?.config || {};

  const shouldShowAuthor = isShowPublicationAuthor && !!author;
  const shouldShowDate = isShowPublicationDate && !!publicationDateTime;
  const shouldShowMetaSection =
    (shouldShowAuthor || shouldShowDate) && (author || publicationDateTime);

  return (
    <div className="bg-white rounded-lg p-4 font-normal text-sm text-zinc-500 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <BadgeList
          items={categorySet}
          labelClassName="rounded font-normal text-[0.5rem]"
          rootClassName="gap-2"
        />
        <div className="text-2xl font-semibold text-black">{title}</div>
        <div className="h-[300px] w-full relative rounded-lg">
          <Image
            src={
              image?.id
                ? `${workspaceURI}/${SUBAPP_CODES.news}/api/news/${slug}/image?isFullView=true`
                : NO_IMAGE_URL
            }
            alt={image?.fileName || 'News image'}
            fill
            className="object-cover rounded-lg"
            sizes="(min-width: 1024px) 750px, 100vw"
          />
        </div>
        {description && <p>{description}</p>}
      </div>

      {(shouldShowMetaSection || content) && (
        <div className="flex flex-col gap-5">
          {shouldShowMetaSection && (
            <div className="flex items-center gap-4">
              {shouldShowAuthor && (
                <Avatar className="rounded-full h-8 w-8">
                  <AvatarImage
                    src={getPartnerImageURL(author.picture?.id, tenant, {
                      noimage: true,
                    })}
                  />
                </Avatar>
              )}
              <div className="flex flex-col w-full">
                {shouldShowAuthor && (
                  <div className="text-sm font-semibold text-black leading-[21px]">
                    {author.simpleFullName}
                  </div>
                )}
                {shouldShowDate && (
                  <div className="text-xs font-normal text-palette-mediumGray leading-[18px]">
                    {i18n.t(PUBLISHED_ON)}{' '}
                    {formatDate(publicationDateTime, {
                      dateFormat: getFormatString({
                        dateString: publicationDateTime,
                        includeTime: isShowPublicationTime,
                      }),
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
          {content && (
            <>
              <Separator className="bg-zinc-300" />
              <div
                className="relative overflow-auto"
                dangerouslySetInnerHTML={{__html: content}}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export const NewsInfoSkeleton = () => {
  return (
    <div className="bg-white rounded-lg p-4 font-normal text-sm text-zinc-500 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Skeleton className="h-4 w-12 rounded" />
          <Skeleton className="h-4 w-10 rounded" />
          <Skeleton className="h-4 w-14 rounded" />
        </div>

        <Skeleton className="h-6 w-2/3 rounded" />

        <Skeleton className="h-[300px] w-full rounded" />

        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-4/6 rounded" />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <div className="flex items-center gap-4 pb-4">
            <Skeleton className="rounded-full h-8 w-8" />
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>

          <Skeleton className="h-px w-full bg-zinc-300" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
};

export default NewsInfo;

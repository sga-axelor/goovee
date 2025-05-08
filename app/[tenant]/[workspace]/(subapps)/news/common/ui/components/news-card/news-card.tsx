'use client';

import React from 'react';
import Link from 'next/link';

// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {formatRelativeTime} from '@/locale/formatters';
import {BadgeList, Skeleton} from '@/ui/components';
import {NO_IMAGE_URL, SUBAPP_CODES, SUBAPP_PAGE} from '@/constants';

export const NewsCard = ({
  news,
  id,
  navigatingPathFrom,
}: {
  news: any;
  id: string | number;
  navigatingPathFrom: string;
}) => {
  const {publicationDateTime, title, image, categorySet, slug} = news;
  const {workspaceURI, workspaceURL} = useWorkspace();

  return (
    <Link
      key={id}
      href={`${workspaceURL}/${navigatingPathFrom}/${SUBAPP_PAGE.article}/${slug}`}
      className="bg-white rounded-lg flex flex-col cursor-pointer">
      <div
        className="w-full h-[150px] bg-no-repeat bg-center bg-cover rounded-t-lg"
        style={{
          backgroundImage: image?.id
            ? `url(${workspaceURI}/${SUBAPP_CODES.news}/api/news/${slug}/image)`
            : `url(${NO_IMAGE_URL})`,
        }}></div>
      <div className="py-2 px-4 flex flex-col justify-between flex-grow">
        <div className="flex flex-col gap-1">
          <BadgeList
            items={categorySet}
            labelClassName="rounded font-normal text-[0.5rem]"
            rootClassName="gap-2"
          />
          <div className="font-semibold text-base mb-1 line-clamp-2">
            {title}
          </div>
        </div>
        <div className="font-medium text-[10px] text-zinc-500">
          {formatRelativeTime(publicationDateTime)}
        </div>
      </div>
    </Link>
  );
};

export const NewsCardSkeleton = ({count = 3}: {count?: number}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-5 !shadow-none">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg flex flex-col">
          <Skeleton className="w-full h-[150px] rounded-t-lg" />

          <div className="py-2 px-4 flex flex-col justify-between flex-grow gap-2">
            <div className="flex gap-2">
              <Skeleton className="h-3 w-10 rounded-full" />
              <Skeleton className="h-3 w-8 rounded-full" />
            </div>

            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />

            <Skeleton className="h-3 w-1/4 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsCard;

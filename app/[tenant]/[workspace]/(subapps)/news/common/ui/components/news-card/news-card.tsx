'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {formatRelativeTime} from '@/locale/formatters';
import {BadgeList} from '@/ui/components';
import {NO_IMAGE_URL, SUBAPP_CODES} from '@/constants';

export const NewsCard = ({
  news,
  id,
  onClick,
}: {
  news: any;
  id: string | number;
  onClick: (slug: string) => void;
}) => {
  const {publicationDateTime, title, image, categorySet, slug} = news;
  const {workspaceURI} = useWorkspace();

  return (
    <div
      key={id}
      className="bg-white rounded-lg flex flex-col cursor-pointer"
      onClick={() => onClick(slug)}>
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
    </div>
  );
};

export default NewsCard;

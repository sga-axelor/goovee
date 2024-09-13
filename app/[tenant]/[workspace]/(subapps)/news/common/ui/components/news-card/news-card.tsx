'use client';

import React from 'react';
import Image from 'next/image';

// ---- CORE IMPORTS ---- //
import {Badge} from '@/ui/components/badge';
import {getImageURL} from '@/utils/files';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {getPublishedLabel} from '@/subapps/news/common/utils';

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
  const {tenant} = useWorkspace();

  return (
    <div
      key={id}
      className="bg-white rounded-lg flex flex-col cursor-pointer"
      onClick={() => onClick(slug)}>
      <div
        className="w-full h-[150px] bg-no-repeat bg-center bg-cover rounded-t-lg"
        style={{
          backgroundImage: `url(${getImageURL(image?.id, tenant, {noimage: true})})`,
        }}></div>
      <div className="py-2 px-4 flex flex-col justify-between flex-grow">
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            {categorySet?.map(
              ({name, id}: {name: string; id: string | number}) => (
                <Badge
                  key={id}
                  className="px-2 p-1 rounded font-normal text-[8px]">
                  {name}
                </Badge>
              ),
            )}
          </div>
          <div className="font-semibold text-base mb-1 line-clamp-2">
            {title}
          </div>
        </div>
        <div className="font-medium text-[10px] text-zinc-500">
          {getPublishedLabel(publicationDateTime)}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;

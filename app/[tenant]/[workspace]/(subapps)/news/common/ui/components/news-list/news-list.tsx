'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {Badge} from '@/ui/components/badge';

// ---- LOCAL IMPORTS ---- //
import {getImageURL, getPublishedLabel} from '@/subapps/news/common/utils';

export const NewsList = ({
  news,
  id,
  onClick,
}: {
  news: any;
  id: string | number;
  onClick: (slug: string) => void;
}) => {
  const {publicationDateTime, title, image, categorySet, slug} = news;
  return (
    <div
      key={id}
      className="bg-white rounded-lg flex gap-4 w-full cursor-pointer p-4"
      onClick={() => onClick(slug)}>
      <div
        className="flex-shrink-0 w-[150px] h-[93px] bg-no-repeat bg-center bg-cover rounded-lg"
        style={{
          backgroundImage: `url(${getImageURL(image?.id)})`,
        }}></div>
      <div className="w-full flex flex-col gap-1 justify-between">
        <div>
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

export default NewsList;

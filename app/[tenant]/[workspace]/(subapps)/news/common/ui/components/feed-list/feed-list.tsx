'use client';

import React from 'react';
import {MdChevronRight} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Badge} from '@/ui/components/badge';
import {Separator} from '@/ui/components/separator';

// ---- LOCAL IMPORTS ---- //
import {getImageURL, getPublishedLabel} from '@/subapps/news/common/utils';

export const FeedList = ({
  title,
  items,
  width,
  onClick,
}: {
  title: string;
  items: any[];
  width?: string;
  onClick: (slug: string) => void;
}) => {
  return (
    <div
      className={`bg-white h-max p-4 rounded-lg ${
        width ? `lg-${width}` : 'lg:w-2/5'
      }`}>
      <div className="font-semibold text-xl mb-[6px]">{title}</div>
      <div>
        {items?.map(
          (
            {id, title, publicationDateTime, categorySet, image, slug},
            index,
          ) => {
            const imageUrl = getImageURL(image?.id);

            return (
              <React.Fragment key={id}>
                <div
                  className={`w-full flex gap-4 justify-between items-center flex-auto p-2 cursor-pointer`}
                  onClick={() => onClick(slug)}>
                  <div className="flex w-full gap-4">
                    <div
                      className="w-[97px] h-[97px] rounded-lg bg-center bg-cover flex-shrink-0"
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                      }}></div>
                    <div className="w-full flex flex-col justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2">
                          {categorySet?.map(
                            ({
                              name,
                              id,
                            }: {
                              name: string;
                              id: string | number;
                            }) => (
                              <Badge
                                key={id}
                                className="px-2 p-1 rounded font-normal text-[8px]">
                                {name}
                              </Badge>
                            ),
                          )}
                        </div>
                        <div className="font-semibold text-base mb-2 line-clamp-2">
                          {title}
                        </div>
                      </div>
                      <div className="font-medium text-[10px] text-zinc-500">
                        {getPublishedLabel(publicationDateTime)}
                      </div>
                    </div>
                  </div>
                  <div className="bg-success/10 rounded-lg w-8 h-8 flex items-center justify-center">
                    <MdChevronRight className="text-success text-2xl" />
                  </div>
                </div>
                {index < items.length - 1 && (
                  <Separator className="bg-zinc-300" />
                )}
              </React.Fragment>
            );
          },
        )}
      </div>
    </div>
  );
};

export default FeedList;

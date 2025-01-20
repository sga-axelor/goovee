'use client';

import React from 'react';
import {MdChevronRight} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {BadgeList, Separator} from '@/ui/components';
import {getImageURL} from '@/utils/files';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {formatRelativeTime} from '@/locale/formatters';

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
  const {tenant} = useWorkspace();
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
            const imageUrl = getImageURL(image?.id, tenant, {noimage: true});

            return (
              <React.Fragment key={id}>
                <div
                  className={`w-full flex gap-4 justify-between items-center flex-auto p-2 cursor-pointer`}
                  onClick={() => onClick(slug)}>
                  <div className="flex w-full gap-4 [overflow-wrap:anywhere]">
                    <div
                      className="w-[97px] h-[97px] rounded-lg bg-center bg-cover flex-shrink-0"
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                      }}></div>
                    <div className="w-full flex flex-col justify-between">
                      <div className="flex flex-col gap-1">
                        <BadgeList
                          items={categorySet}
                          labelClassName="rounded font-normal text-[0.5rem]"
                          rootClassName="gap-2"
                        />
                        <div className="font-semibold text-base mb-2 line-clamp-2">
                          {title}
                        </div>
                      </div>
                      <div className="font-medium text-[10px] text-zinc-500">
                        {formatRelativeTime(publicationDateTime)}
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

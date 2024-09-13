'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {Badge} from '@/ui/components/badge';
import {getImageURL} from '@/utils/files';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {getPublishedLabel} from '@/subapps/news/common/utils';

export const LeadStories = ({
  title,
  news,
  onClick,
}: {
  title?: string;
  news?: any[];
  onClick: (slug: string) => void;
}) => {
  const {tenant} = useWorkspace();
  return (
    <div className="flex flex-col gap-6">
      {title && <div className="font-semibold text-xl">{title}</div>}
      <div className="grid gap-5 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <div className="col-span-2">
          {news
            ?.slice(0, 1)
            .map(
              ({
                id,
                title,
                image,
                categorySet,
                description,
                publicationDateTime,
                slug,
              }) => (
                <div
                  key={id}
                  className={`relative lg:h-full p-4 bg-no-repeat bg-center bg-cover flex flex-col rounded-lg cursor-pointer`}
                  style={{
                    backgroundImage: `url(${getImageURL(image?.id, tenant, {noimage: true})})`,
                    height: '100%',
                  }}
                  onClick={() => onClick(slug)}>
                  <div
                    className="absolute inset-0 rounded-md"
                    style={{
                      background: `linear-gradient(76deg, rgba(0, 0, 0, 0.40) 1.1%, rgba(0, 0, 0, 0.08) 100%)`,
                    }}></div>
                  <div className="flex gap-2 z-10 h-[172px]">
                    {categorySet?.map(
                      ({name, id}: {name: string; id: string | number}) => (
                        <Badge
                          key={id}
                          className="px-2 p-1 rounded font-normal text-[8px] h-max">
                          {name}
                        </Badge>
                      ),
                    )}
                  </div>
                  <div className="flex flex-col flex-1 justify-between gap-2 text-white z-10">
                    <div className="flex flex-col justify-between flex-1">
                      <div className="font-semibold text-base line-clamp-3 h-[72px]">
                        {title}
                      </div>
                      <div className="font-medium text-xs line-clamp-3">
                        {description}
                      </div>
                    </div>
                    <div className="font-medium text-[10px]">
                      {getPublishedLabel(publicationDateTime)}
                    </div>
                  </div>
                </div>
              ),
            )}
        </div>

        {news
          ?.slice(1, 3)
          .map(
            ({
              id,
              title,
              image,
              categorySet,
              description,
              publicationDateTime,
              slug,
            }) => (
              <div
                key={id}
                className="flex flex-col col-span-2 md:col-span-1 cursor-pointer"
                onClick={() => onClick(slug)}>
                <div
                  className="w-full h-[150px] bg-no-repeat bg-center bg-cover rounded-t-lg"
                  style={{
                    backgroundImage: `url('${getImageURL(image?.id, tenant, {noimage: true})}')`,
                  }}
                />
                <div className="bg-white px-4 py-2 rounded-b-lg flex flex-col flex-1">
                  <div className="flex gap-2">
                    {categorySet.map(
                      ({name, id}: {name: string; id: string | number}) => (
                        <Badge
                          key={id}
                          className="px-2 p-1 rounded font-normal text-[8px]">
                          {name}
                        </Badge>
                      ),
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-2 mt-1">
                    <div className="font-semibold text-base line-clamp-3 h-[72px]">
                      {title}
                    </div>
                    <div className="font-medium text-xs line-clamp-3">
                      {description}
                    </div>
                    <div className="flex-1 content-end font-medium text-[10px] mt-1 text-zinc-500">
                      {getPublishedLabel(publicationDateTime)}
                    </div>
                  </div>
                </div>
              </div>
            ),
          )}
      </div>
    </div>
  );
};

export default LeadStories;

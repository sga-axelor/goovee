'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {getImageURL} from '@/utils/files';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {getPublishedLabel} from '@/utils/date';
import {BadgeList} from '@/ui/components';

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
  const {tenant} = useWorkspace();
  return (
    <div
      key={id}
      className="bg-white rounded-lg flex gap-4 w-full cursor-pointer p-4"
      onClick={() => onClick(slug)}>
      <div
        className="flex-shrink-0 w-[150px] h-[93px] bg-no-repeat bg-center bg-cover rounded-lg"
        style={{
          backgroundImage: `url(${getImageURL(image?.id, tenant, {noimage: true})})`,
        }}></div>
      <div className="w-full flex flex-col gap-1 justify-between">
        <div>
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
          {getPublishedLabel(publicationDateTime)}
        </div>
      </div>
    </div>
  );
};

export default NewsList;

'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {Badge} from '@/ui/components/badge';
import {Avatar, AvatarImage} from '@/ui/components/avatar';
import {Separator} from '@/ui/components/separator';
import {i18n} from '@/lib/i18n';
import {getImageURL} from '@/utils/files';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {parseDate} from '@/subapps/news/common/utils';
import {PUBLISHED_ON} from '@/subapps/news/common/constants';

export const NewsInfo = ({
  title,
  categorySet,
  image,
  description,
  publicationDateTime,
  content,
  author,
}: {
  title: string;
  categorySet: any[];
  image: {id: string};
  description: string;
  publicationDateTime: string;
  content: string;
  author: {
    simpleFullName: string;
    picture: {
      id: string;
    };
  };
}) => {
  const {tenant} = useWorkspace();
  return (
    <div className="bg-white rounded-lg p-4 font-normal text-sm text-zinc-500 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          {categorySet?.map(({id, name}) => (
            <Badge
              key={id}
              className="px-2 p-1 rounded font-normal text-[8px] leading-[12px]">
              {name}
            </Badge>
          ))}
        </div>
        <div className="text-2xl font-semibold text-black">{title}</div>
        <div
          className="h-[300px] w-full bg-no-repeat bg-center bg-cover"
          style={{
            backgroundImage: `url(${getImageURL(image?.id, tenant, {noimage: true})})`,
          }}></div>
        <p>{description}</p>
      </div>
      <div className="flex flex-col gap-5">
        <div>
          <div className="flex items-center gap-4 pb-4">
            <Avatar className="rounded-full h-8 w-8">
              <AvatarImage
                src={getImageURL(author?.picture?.id, tenant, {noimage: true})}
              />
            </Avatar>
            <div className="flex flex-col gap-2 w-full ">
              <div className=" w-full">
                <div className="text-sm font-semibold text-black leading-[21px]">
                  {author?.simpleFullName}
                </div>
                <div className="text-xs font-normal text-palette-mediumGray leading-[18px]">
                  {i18n.get(PUBLISHED_ON)} {parseDate(publicationDateTime)}
                </div>
              </div>
            </div>
          </div>
          <Separator className="bg-zinc-300" />
        </div>
        <div
          className="relative overflow-auto"
          dangerouslySetInnerHTML={{__html: content}}
        />
      </div>
    </div>
  );
};

export default NewsInfo;

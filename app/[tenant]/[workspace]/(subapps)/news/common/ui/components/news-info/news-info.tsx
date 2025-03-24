'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {Avatar, AvatarImage} from '@/ui/components/avatar';
import {Separator} from '@/ui/components/separator';
import {i18n} from '@/locale';
import {getImageURL, getPartnerImageURL} from '@/utils/files';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {formatDate} from '@/locale/formatters';

// ---- LOCAL IMPORTS ---- //
import {getFormatString} from '@/subapps/news/common/utils';
import {PUBLISHED_ON} from '@/subapps/news/common/constants';
import {BadgeList} from '@/ui/components';

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
    id: string | number;
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
        <BadgeList
          items={categorySet}
          labelClassName="rounded font-normal text-[0.5rem]"
          rootClassName="gap-2"
        />
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
                src={getPartnerImageURL(author?.picture?.id, tenant, {
                  noimage: true,
                })}
              />
            </Avatar>
            <div className="flex flex-col gap-2 w-full ">
              <div className=" w-full">
                <div className="text-sm font-semibold text-black leading-[21px]">
                  {author?.simpleFullName}
                </div>
                <div className="text-xs font-normal text-palette-mediumGray leading-[18px]">
                  {i18n.t(PUBLISHED_ON)}{' '}
                  {formatDate(publicationDateTime, {
                    dateFormat: getFormatString(publicationDateTime),
                  })}
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

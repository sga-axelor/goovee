'use client';

import React from 'react';

// ---- LOCAL IMPORTS ---- //
import {Search} from '@/subapps/news/common/ui/components';
import backgroundImage from '@/public/images/banner-mask.png';

export const Banner = ({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: any;
}) => {
  return (
    <div
      className={`text-white p-4 lg:p-0 flex flex-col justify-center items-center bg-secondary bg-[length:100%_100%] min-h-[353px]`}
      style={{backgroundImage: `url(${backgroundImage.src})`}}>
      <div className="w-full lg:w-1/2 relative">
        <div className="flex flex-col justify-center items-center gap-2 mb-8">
          <p className={`font-semibold text-[2rem] leading-[3rem]`}>{title}</p>
          <p className={`font-medium text-lg text-center leading-[1.6875rem]`}>
            {description}
          </p>
        </div>
        <Search items={items} />
      </div>
    </div>
  );
};

export default Banner;

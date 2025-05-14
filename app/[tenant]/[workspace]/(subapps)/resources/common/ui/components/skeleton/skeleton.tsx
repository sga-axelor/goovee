'use client';

import {Swiper, SwiperSlide} from 'swiper/react';
import {FreeMode, Pagination} from 'swiper/modules';
import {Skeleton} from '@/ui/components';
import {cn} from '@/utils/css';

export function CategoriesSkeleton() {
  const columns = Array.from({length: 5});
  return (
    <Swiper
      slidesPerView={'auto'}
      spaceBetween={30}
      modules={[FreeMode, Pagination]}
      className="space-y-6"
      wrapperClass="flex gap-4"
      pagination={{
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      }}>
      {columns.map((_, id) => (
        <SwiperSlide key={id} className="!mr-0 !w-[281px] cursor-pointer">
          <div className="space-y-2">
            <div className="!h-[144px] bg-white rounded-lg flex justify-center items-center">
              <Skeleton className="h-16 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </SwiperSlide>
      ))}
      <div className={'swiper-pagination !relative'}></div>
    </Swiper>
  );
}

export function ExplorerSkeleton() {
  const categories = Array.from({length: 5});

  return (
    <div className="flex flex-col gap-4 p-2 px-4 bg-white h-fit">
      {categories.map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full sm:ms-4 ms-8" />
          <Skeleton className="h-4 w-full sm:ms-4 ms-8" />
        </div>
      ))}
    </div>
  );
}

export function ResourceListSkeleton() {
  const resources = Array.from({length: 10});
  return (
    <div className="rounded-lg bg-white py-2">
      {resources?.map((_, index: number) => {
        const isLast = index === resources.length - 1;

        return (
          <div
            className={cn(
              'py-2 px-4 space-y-2 cursor-pointer overflow-hidden',
              {
                'border-b': !isLast,
              },
            )}
            key={index}>
            <div className="leading-5 text-sm space-y-2">
              <div className="grid grid-cols-[1fr_40%] items-center">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="grid sm:grid-cols-[1fr_1fr_1fr_20px] items-center gap-16 md:gap-12 lg:gap-16">
                  <Skeleton className="h-4 w-24 hidden sm:inline-block" />
                  <Skeleton className="h-4 w-24 hidden sm:inline-block" />
                  <Skeleton className="h-4 w-24 hidden sm:inline-block" />
                  <Skeleton className="h-6 w-6 ms-auto" />
                </div>
              </div>
              <div className="sm:hidden flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-40" />
          </div>
        );
      })}
    </div>
  );
}

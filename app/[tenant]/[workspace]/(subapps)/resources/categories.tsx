'use client';

import {useRouter} from 'next/navigation';
import {Swiper, SwiperSlide} from 'swiper/react';
import {FreeMode, Pagination} from 'swiper/modules';
import {MdOutlineCategory} from 'react-icons/md';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

export default function Categories({items}: any) {
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const handleRedirection = (id: string) => () => {
    router.push(`${workspaceURI}/resources/categories?id=${id}`);
  };

  return (
    <Swiper
      slidesPerView={'auto'}
      spaceBetween={30}
      modules={[FreeMode, Pagination]}
      className="space-y-6"
      wrapperClass="flex items-center gap-4"
      pagination={{
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      }}>
      {items.map(({fileName, id}: any) => (
        <SwiperSlide
          key={id}
          className="!mr-0 !w-[281px] cursor-pointer"
          onClick={handleRedirection(id)}>
          <div className="space-y-2">
            <div className="!h-[144px] bg-white rounded-lg flex justify-center items-center">
              <MdOutlineCategory className="h-16 w-16" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold leading-6 text-center">
                {fileName}
              </h3>
              <p className="leading-4 text-[0.625rem] px-4 text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur. Sodales vitae laoreet.
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}
      <div className={'swiper-pagination !relative'}></div>
    </Swiper>
  );
}

'use client';
import {Swiper, SwiperSlide} from 'swiper/react';
import {FreeMode, Pagination} from 'swiper/modules';
import {ReactNode} from 'react';
export function Swipe({items}: {items: ReactNode[]}) {
  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={24}
      modules={[FreeMode, Pagination]}
      className="space-y-6"
      wrapperClass="flex items-center"
      pagination={{
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      }}>
      {items.map((item, i) => (
        <SwiperSlide
          key={i}
          className="bg-card rounded-lg shrink-0 !w-[218px] !h-[120px] cursor-pointer">
          {item}
        </SwiperSlide>
      ))}
      <div className="swiper-pagination !relative"></div>
    </Swiper>
  );
}

export default Swipe;

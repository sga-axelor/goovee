'use client';
import {Swiper, SwiperSlide} from 'swiper/react';
import {FreeMode, Pagination} from 'swiper/modules';
import {ReactNode} from 'react';
export function Swipe({items}: {items: ReactNode[]}) {
  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={30}
      modules={[FreeMode, Pagination]}
      className="space-y-6"
      wrapperClass="flex items-center gap-6"
      pagination={{
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      }}>
      {items.map((item, i) => (
        <SwiperSlide
          key={i}
          className="bg-white py-6 rounded-lg shrink-0 !mr-0 !w-[217px] cursor-pointer">
          {item}
        </SwiperSlide>
      ))}
      <div className="swiper-pagination !relative"></div>
    </Swiper>
  );
}

export default Swipe;

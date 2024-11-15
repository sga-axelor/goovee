'use client';
import {Swiper, SwiperSlide} from 'swiper/react';
import {FreeMode, Pagination} from 'swiper/modules';
import {ReactNode} from 'react';
import {cn} from '@/utils/css';
type SwipeProps = {
  items: ReactNode[];
  className?: string;
};
export function Swipe({items, className}: SwipeProps) {
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
          className={cn(
            'bg-card rounded-lg shrink-0 !w-[218px] !h-[120px] cursor-pointer',
            className,
          )}>
          {item}
        </SwiperSlide>
      ))}
      <div className="swiper-pagination !relative"></div>
    </Swiper>
  );
}

export default Swipe;

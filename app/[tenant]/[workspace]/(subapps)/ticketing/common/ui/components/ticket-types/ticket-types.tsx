import {Swiper, SwiperSlide} from 'swiper/react';
import {FreeMode, Pagination} from 'swiper/modules';
import {
  MdAllInbox,
  MdCheckCircleOutline,
  MdListAlt,
  MdPending,
} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {cn} from '@/utils/css';

// ---- LOCAL IMPORTS ---- //
import styles from './ticket-types.module.scss';

export function TicketTypes() {
  return (
    <Swiper
      slidesPerView={'auto'}
      spaceBetween={30}
      modules={[FreeMode, Pagination]}
      className="space-y-6"
      wrapperClass="flex items-center gap-6"
      pagination={{
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      }}>
      {[
        {
          label: 'All',
          count: 331,
          icon: MdAllInbox,
        },
        {
          label: 'Assigned tickets',
          count: 27,
          icon: MdListAlt,
        },
        {
          label: 'Created tickets',
          count: 45,
          icon: MdPending,
        },
        {
          label: 'Resolved tickets',
          count: 212,
          icon: MdCheckCircleOutline,
        },
      ].map(({label, count, icon: Icon}, i) => (
        <SwiperSlide
          key={i}
          className={cn(
            'bg-white py-4 px-8 rounded-lg shrink-0',
            styles['swiper-slide'],
          )}>
          <div className="flex flex-col gap-[10px]">
            <div className="h-[56px] w-[56px] p-2 bg-muted rounded-full">
              {Icon && <Icon className="h-[40px] w-[40px]" />}
            </div>
            <div className="grow flex flex-col justify-between">
              <h3 className="text-[2rem] font-semibold">{count}</h3>
              <p className="font-semibold">{label}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
      <div
        className={cn('swiper-pagination', styles['swiper-pagination'])}></div>
    </Swiper>
  );
}

export default TicketTypes;

'use client';

import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';

// ---- CORE IMPORTS ---- //
import {Dialog, DialogContent} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {Thread} from '@/subapps/forum/common/ui/components';

export const ThreadPopup = ({
  open,
  images,
  onClose,
}: {
  open: boolean;
  images: any;
  onClose: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[74rem] p-0 border-none  rounded-l-xl flex items-center justify-center">
        <div className="w-full grid grid-cols-2 gap-4 relative">
          <div className="bg-black px-4 h-full rounded-l-lg">
            <Swiper
              style={{
                '--swiper-navigation-color': '#fff',
                '--swiper-navigation-size': '20px',
              }}
              lazy={true}
              centeredSlides={true}
              navigation={true}
              modules={[Navigation]}
              className="mySwiper h-full">
              {images.map((imageUrl: string, index: number) => (
                <SwiperSlide key={index}>
                  <div
                    className="w-full h-full bg-no-repeat bg-center bg-cover"
                    style={{backgroundImage: `url(${imageUrl})`}}></div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="pt-16 pr-4">
            <Thread
              showHeader={false}
              showCommentsByDefault={true}
              hideCloseComments={true}
              usePopUpStyles={true}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThreadPopup;

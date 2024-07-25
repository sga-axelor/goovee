'use client';

import {
  Dialog,
  DialogContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/ui/components';

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
      <DialogContent className="max-w-[74rem] flex items-center justify-center">
        <div className="w-full grid grid-cols-2 gap-4 relative">
          <div className="">
            <Carousel className="axel">
              <CarouselContent>
                {images.map((imageUrl: string, index: number) => (
                  <CarouselItem key={index}>
                    <div
                      className="w-full h-[500px] bg-no-repeat bg-center bg-cover"
                      style={{backgroundImage: `url(${imageUrl})`}}></div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <div className="mt-6">
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

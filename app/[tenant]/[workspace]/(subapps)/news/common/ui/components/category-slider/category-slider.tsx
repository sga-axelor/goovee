'use client';

import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import {usePathname, useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {Button} from '@/ui/components/button';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {NO_IMAGE_URL, SUBAPP_CODES} from '@/constants';

//---- LOCAL IMPORTS ---- //
import styles from '@/subapps/news/common/ui/styles/news.module.scss';

export const CategorySlider = ({
  title = '',
  showButton = false,
  buttonText = '',
  categories = [],
  buttonIcon: Icon,
  showTitle = true,
}: {
  title?: string;
  showButton?: boolean;
  buttonText?: string;
  categories: any[];
  buttonIcon?: any;
  showTitle?: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const {workspaceURI} = useWorkspace();

  const handleClick = (slug: string) => {
    router.push(`${pathname}/${slug}`);
  };

  if (!showTitle) {
    return null;
  }
  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="flex justify-between">
        <span className="font-semibold text-xl">{title}</span>
        {showButton && (
          <Button
            variant="success"
            className="flex gap-2 text-white px-3 py-[6px] rounded-md hover:bg-success-dark">
            <Icon className="w-6 h-6" />
            <span className="text-base font-medium"> {buttonText}</span>
          </Button>
        )}
      </div>

      {categories?.length ? (
        <div>
          <Swiper
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            wrapperClass={styles.wrapper}
            breakpoints={{
              320: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 4,
                spaceBetween: 20,
              },

              1024: {
                slidesPerView: 6,
                spaceBetween: 20,
              },
              1280: {
                slidesPerView: 8,
                spaceBetween: 20,
              },
            }}>
            {categories?.map(
              ({
                id,
                image,
                name,
                slug,
              }: {
                id: string | number;
                image: {id: string};
                name: string;
                slug: string;
              }) => (
                <SwiperSlide
                  key={id}
                  style={{
                    width: '154px',
                    marginRight: 20,
                  }}>
                  <div
                    className="relative flex w-full items-end justify-center cursor-pointer"
                    onClick={() => handleClick(slug)}>
                    <div
                      className="h-[120px] w-full bg-no-repeat bg-center bg-cover rounded-md flex items-end justify-center"
                      style={{
                        backgroundImage: image?.id
                          ? `url(${workspaceURI}/${SUBAPP_CODES.news}/api/category/${slug}/image)`
                          : `url(${NO_IMAGE_URL})`,
                      }}>
                      <div className="pb-4 text-center text-white font-semibold text-xs z-10">
                        {name}
                      </div>
                    </div>
                    <div
                      className="absolute inset-0 rounded-md"
                      style={{
                        background:
                          'linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)',
                      }}></div>
                  </div>
                </SwiperSlide>
              ),
            )}
          </Swiper>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CategorySlider;

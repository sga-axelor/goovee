'use client';
import React, {useEffect, useRef, useState} from 'react';
import {MdChevronLeft, MdChevronRight} from 'react-icons/md';
import {Swiper, SwiperSlide} from 'swiper/react';
import {FreeMode} from 'swiper/modules';
import {Swiper as SwiperType} from 'swiper';
import 'swiper/css';

// ---- CORE IMPORTS ---- //
import {useResponsive} from '@/ui/hooks';
import {i18n} from '@/locale';
import {Separator} from '@/ui/components';
import {cn} from '@/utils/css';
import type {Category} from '@/types';

export const NavbarCategoryMenu = ({
  categories = [],
  onClick,
  slugKey,
}: {
  categories?: Category[];
  onClick?: any;
  slugKey?: string | null;
}) => {
  const res: any = useResponsive();
  const large = ['lg', 'xl', 'xxl'].some(x => res[x]);
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState<boolean>(false);
  const [isEnd, setIsEnd] = useState<boolean>(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      categoriesRef.current &&
      !categoriesRef.current.contains(event.target as Node)
    ) {
      setActiveCategory(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    handleIndicator();
  }, []);

  const handleIndicator = () => {
    setIsBeginning(swiperRef.current?.isBeginning || false);
    setIsEnd(swiperRef.current?.isEnd || false);
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
    handleIndicator();
  };

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
    handleIndicator();
  };

  return large ? (
    <div
      ref={categoriesRef}
      className="px-6 flex items-center gap-5 mb-0  bg-background text-foreground"
      onMouseLeave={() => setActiveCategory(null)}>
      {!isBeginning && (
        <button onClick={handlePrev}>
          <MdChevronLeft />
        </button>
      )}
      <Swiper
        onSwiper={swiper => {
          swiperRef.current = swiper;
        }}
        slidesPerView="auto"
        modules={[FreeMode]}
        className="space-y-6 !ml-0"
        allowTouchMove={false}
        wrapperClass="flex items-center">
        {categories.map((category, index) => {
          return (
            <SwiperSlide key={index} className="!w-fit">
              <div key={index} className="flex items-center">
                {index !== 0 && (
                  <Separator
                    className="bg-black w-[2px] !h-8"
                    orientation="vertical"
                  />
                )}
                <div>
                  <div
                    className="px-6 py-4 cursor-pointer whitespace-nowrap"
                    onClick={() =>
                      onClick({
                        category,
                        url: slugKey
                          ? category[slugKey as keyof typeof category]
                          : null,
                      })
                    }
                    onMouseEnter={() => setActiveCategory(category)}>
                    {category.name}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {!isEnd && (
        <button onClick={handleNext}>
          <MdChevronRight />
        </button>
      )}
      {activeCategory && activeCategory.items.length > 0 && (
        <div className="w-full overflow-hidden absolute left-0 top-14 bg-background flex flex-row  gap-12 z-50 border-t">
          <Menu
            category={activeCategory}
            onClick={onClick}
            level={0}
            slugKey={slugKey}
            url={
              slugKey
                ? `${activeCategory[slugKey as keyof typeof activeCategory]}`
                : null
            }
          />
        </div>
      )}
    </div>
  ) : null;
};

const Menu = ({
  category,
  onClick,
  parentTitle = false,
  level,
  slugKey,
  url,
}: {
  category: Category | null;
  onClick?: any;
  parentTitle?: boolean;
  level: number;
  slugKey?: string | null;
  url?: string | null;
}) => {
  const [subMenu, setSubMenu] = useState<Category | null>(null);

  const handleClick = (item: any) => {
    setSubMenu(prev => (prev?.id === item.id ? null : item));
  };

  useEffect(() => {
    setSubMenu(null);
  }, [category]);

  return (
    <React.Fragment>
      <div
        className={cn(
          'flex flex-col gap-6 px-4 py-6 pl-10 ',
          level === 0 && 'w-full bg-gray-fog',
          !subMenu ? 'w-full' : 'w-fit',
        )}>
        {parentTitle && category && (
          <div className="font-medium text-base">{i18n.t(category.name)}</div>
        )}
        {category?.items?.map((item: any) => {
          const categoryLength = item.items.length;
          const urlPath = slugKey
            ? url
              ? `${url}/${item[slugKey as keyof typeof item]}`
              : item[slugKey as keyof typeof item]
            : null;
          return (
            <React.Fragment key={item.id}>
              <li className="z-20 flex ">
                <div className="w-[25rem] flex gap-12 items-center justify-between ">
                  <div
                    className="font-normal text-base cursor-pointer"
                    onClick={() => onClick({category: item, url: urlPath})}>
                    {i18n.t(item.name)}
                  </div>
                  {categoryLength > 0 && (
                    <MdChevronRight
                      className="text-2xl cursor-pointer"
                      onClick={() => handleClick(item)}
                    />
                  )}
                </div>
              </li>
            </React.Fragment>
          );
        })}
      </div>
      {subMenu?.items && subMenu.items.length > 0 && (
        <Menu
          category={subMenu}
          onClick={onClick}
          parentTitle={true}
          level={level + 1}
          slugKey={slugKey}
          url={
            slugKey
              ? url
                ? `${url}/${subMenu[slugKey as keyof typeof subMenu]}`
                : `${subMenu[slugKey as keyof typeof subMenu]}`
              : null
          }
        />
      )}
    </React.Fragment>
  );
};

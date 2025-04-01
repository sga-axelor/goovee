'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {MdChevronLeft, MdChevronRight} from 'react-icons/md';
import {Swiper, SwiperSlide} from 'swiper/react';
import {FreeMode} from 'swiper/modules';
import {Swiper as SwiperType} from 'swiper';
import 'swiper/css';

// ---- CORE IMPORTS ---- //
import {useResponsive} from '@/ui/hooks';
import {i18n} from '@/locale';
import {Button, Separator} from '@/ui/components';
import {cn} from '@/utils/css';
import type {Category} from '@/types';

export const NavbarCategoryMenu = ({
  categories = [],
  onClick,
  slugKey,
}: {
  categories?: Category[];
  onClick?: (data: {category: Category; url: any}) => void;
  slugKey?: string | null;
}) => {
  const res: any = useResponsive();
  const isLargeScreen = ['lg', 'xl', 'xxl'].some(x => res[x]);

  const [activeCategory, setActiveCategory] = useState<any>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (categoriesRef?.current) {
      setActiveCategory(null);
    }
  }, []);

  useEffect(() => {
    const element = categoriesRef?.current;
    if (!element) return;
    element.addEventListener('mouseleave', handleClickOutside);
    return () => element.removeEventListener('mouseleave', handleClickOutside);
  }, [handleClickOutside]);

  const handleIndicator = () => {
    if (swiperRef.current) {
      setIsBeginning(swiperRef.current.isBeginning);
      setIsEnd(swiperRef.current.isEnd);
    }
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
    handleIndicator();
  };

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
    handleIndicator();
  };

  if (!isLargeScreen) return null;

  if (!categories?.length) return null;

  return (
    <div
      ref={categoriesRef}
      className="px-6 flex items-center gap-5 mb-0 bg-background text-foreground">
      {!isBeginning && (
        <Button variant="ghost" onClick={handlePrev}>
          <MdChevronLeft size={24} />
        </Button>
      )}
      <Swiper
        onSwiper={swiper => {
          swiperRef.current = swiper;
          handleIndicator();
        }}
        slidesPerView="auto"
        modules={[FreeMode]}
        className="space-y-6 !ml-0"
        allowTouchMove={false}
        wrapperClass="flex items-center">
        {categories.map((category, index) => {
          const isActive = activeCategory?.id === category.id;
          const url = slugKey
            ? category[slugKey as keyof typeof category]
            : null;

          return (
            <SwiperSlide key={category.id} className="!w-fit">
              <div className="flex items-center">
                {index !== 0 && (
                  <Separator
                    className="bg-black w-[2px] !h-8"
                    orientation="vertical"
                  />
                )}
                <div
                  className={cn(
                    'px-6 py-4 cursor-pointer whitespace-nowrap',
                    isActive && 'text-success',
                  )}
                  onClick={() => onClick?.({category, url})}
                  onMouseEnter={() => setActiveCategory(category)}>
                  {category.name}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {!isEnd && (
        <Button variant="ghost" onClick={handleNext}>
          <MdChevronRight size={24} />
        </Button>
      )}

      {activeCategory && activeCategory?.items?.length > 0 && (
        <div className="w-full overflow-hidden absolute left-0 top-14 bg-background flex flex-row gap-12 z-50 border-t">
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
  );
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
  onClick?: (data: {category: Category; url: any}) => void;
  parentTitle?: boolean;
  level: number;
  slugKey?: string | null;
  url?: string | null;
}) => {
  const [subMenu, setSubMenu] = useState<Category | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSubMenu(null);
  }, [category]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current) {
        setSubMenu(null);
      }
    };
    const element = menuRef.current;
    if (!element || level !== 1) return;
    element.addEventListener('mouseleave', handleClickOutside);
    return () => element.removeEventListener('mouseleave', handleClickOutside);
  }, [menuRef, level]);

  const renderMenuItem = (
    item: Category,
    level: number,
    parentTitle: boolean,
  ) => {
    const isActive = item.id === subMenu?.id;
    const categoryLength = item?.items?.length || 0;
    const urlPath = slugKey
      ? url
        ? `${url}/${item[slugKey as keyof typeof item]}`
        : item[slugKey as keyof typeof item]
      : null;

    const handleMouseEnter = () => setSubMenu(item);
    const handleClickItem = () => onClick?.({category: item, url: urlPath});

    const containerClasses = cn(
      'w-[25rem] flex items-center justify-between pl-10 py-3 pr-2',
      {
        'text-success': isActive,
        'bg-success-light': isActive && level === 0,
        'pl-0': level === 1,
      },
    );

    const textClasses = cn('w-full py-2 font-normal cursor-pointer', {
      'text-sm': parentTitle,
      'text-base': !parentTitle,
    });

    return (
      <div
        key={item.id}
        className={containerClasses}
        onMouseEnter={handleMouseEnter}>
        <div className={textClasses} onClick={handleClickItem}>
          {i18n.t(item.name)}
        </div>
        {categoryLength > 0 && level < 1 && (
          <MdChevronRight className="text-2xl" />
        )}
      </div>
    );
  };

  if (level > 1) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          'flex-col z-20 flex',
          level === 0 && 'w-full bg-gray-fog',
          !subMenu ? 'w-full' : 'w-fit',
        )}>
        {parentTitle && category && (
          <div className="font-semibold text-base">{i18n.t(category.name)}</div>
        )}
        <div ref={menuRef}>
          {category?.items?.map(item =>
            renderMenuItem(item, level, parentTitle),
          )}
        </div>
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
    </>
  );
};

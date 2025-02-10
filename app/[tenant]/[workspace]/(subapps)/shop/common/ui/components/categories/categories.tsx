import React, {Fragment, useEffect, useRef, useState} from 'react';
import {MdChevronRight} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {useResponsive} from '@/ui/hooks';
import {i18n} from '@/locale';
import {Separator} from '@/ui/components';
import {cn} from '@/utils/css';
import type {Category} from '@/types';

export const Categories = ({
  items = [],
  onClick,
}: {
  items?: Category[];
  onClick?: any;
}) => {
  const res: any = useResponsive();
  const large = ['lg', 'xl', 'xxl'].some(x => res[x]);
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

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

  return large ? (
    <div
      ref={categoriesRef}
      className="px-6 flex items-center gap-5 mb-0  bg-background text-foreground"
      onMouseLeave={() => setActiveCategory(null)}>
      {items.map((category, index) => {
        return (
          <Fragment key={index}>
            {index !== 0 && (
              <Separator
                className="bg-black w-[2px] !h-8"
                orientation="vertical"
              />
            )}
            <div>
              <div
                className="px-4 py-4 cursor-pointer"
                onClick={() => onClick(category)}
                onMouseEnter={() => setActiveCategory(category)}>
                <span>{category.name}</span>
              </div>
            </div>
            {activeCategory && activeCategory.items.length > 0 && (
              <div className="w-full absolute left-0 top-14 bg-background flex flex-row  gap-12 z-50 border-t">
                <Menu category={activeCategory} onClick={onClick} level={0} />
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  ) : null;
};
export default Categories;

const Menu = ({
  category,
  onClick,
  parentTitle = false,
  level,
}: {
  category: Category | null;
  onClick?: any;
  parentTitle?: boolean;
  level: number;
}) => {
  const [childMenu, setChileMenu] = useState<Category | null>(null);

  const handleClick = (item: any) => {
    setChileMenu(prev => (prev?.id === item.id ? null : item));
  };

  useEffect(() => {
    setChileMenu(null);
  }, [category]);

  return (
    <React.Fragment>
      <div
        className={cn(
          'flex flex-col gap-6 px-4 py-6 pl-10 ',
          level === 0 && 'w-full bg-gray-50',
          !childMenu ? 'w-full' : 'w-fit',
        )}>
        {parentTitle && category && (
          <div className="font-medium text-base">{i18n.t(category.name)}</div>
        )}
        {category?.items?.map((child: any) => {
          const categoryLength = child.items.length;
          return (
            <React.Fragment key={child.id}>
              <li className="z-20 flex ">
                <div className="w-[25rem] flex gap-12 items-center justify-between ">
                  <div
                    className="font-normal text-base cursor-pointer"
                    onClick={() => onClick(child)}>
                    {i18n.t(child.name)}
                  </div>
                  {categoryLength > 0 && (
                    <MdChevronRight
                      className="text-2xl cursor-pointer"
                      onClick={() => handleClick(child)}
                    />
                  )}
                </div>
              </li>
            </React.Fragment>
          );
        })}
      </div>
      {childMenu?.items && childMenu.items.length > 0 && (
        <Menu
          category={childMenu}
          onClick={onClick}
          parentTitle={true}
          level={level + 1}
        />
      )}
    </React.Fragment>
  );
};

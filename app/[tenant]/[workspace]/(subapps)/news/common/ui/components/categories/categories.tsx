'use client';

import {MdChevronRight} from 'react-icons/md';
import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {Separator} from '@/ui/components/separator';
import {cn} from '@/utils/css';

// ---- LOCAL IMPORTS ---- //
import {Category} from '@/subapps/news/common/types';
import {transformCategories} from '@/subapps/news/common/utils';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

export const Categories = ({categories}: {categories: any[]}) => {
  const categoriesRef = useRef<HTMLDivElement>(null);

  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);
  const [openSubSubMenu, setOpenSubSubMenu] = useState<number | null>(null);

  const categoryHierarchy = transformCategories(categories);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      openSubMenu &&
      categoriesRef.current &&
      !categoriesRef.current.contains(event.target as Node)
    ) {
      setOpenSubMenu(null);
      setOpenSubSubMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!categories.length) {
    return null;
  }

  return (
    <div
      ref={categoriesRef}
      className="hidden md:flex justify-start gap-5 bg-white">
      <Menu
        items={categoryHierarchy}
        openSubMenu={openSubMenu}
        setOpenSubMenu={setOpenSubMenu}
        openSubSubMenu={openSubSubMenu}
        setOpenSubSubMenu={setOpenSubSubMenu}
      />
    </div>
  );
};

const MenuItem = ({
  item,
  isOpen,
  onHover,
  onLeave,
  openSubSubMenu,
  setOpenSubSubMenu,
  handleRoute,
}: {
  item: any;
  isOpen: boolean;
  onHover: (id: number) => void;
  onLeave: () => void;
  openSubSubMenu: number | null;
  setOpenSubSubMenu: (id: number | null) => void;
  handleRoute: (slug: string, parentSlug?: string) => void;
}) => {
  const itemRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={itemRef}
      onMouseEnter={() => onHover(item.id)}
      className="px-12 py-4"
      onMouseLeave={onLeave}>
      <span className="cursor-pointer " onClick={() => handleRoute(item.slug)}>
        {item.name}
      </span>
      {isOpen && item.items.length > 0 && (
        <SubMenu
          item={item}
          onHover={onHover}
          openSubSubMenu={openSubSubMenu}
          setOpenSubSubMenu={setOpenSubSubMenu}
          handleRoute={handleRoute}
        />
      )}
    </div>
  );
};

const Menu = ({
  items,
  openSubMenu,
  setOpenSubMenu,
  openSubSubMenu,
  setOpenSubSubMenu,
}: {
  items: Category[];
  openSubMenu: number | null;
  setOpenSubMenu: (id: number | null) => void;
  openSubSubMenu: number | null;
  setOpenSubSubMenu: (id: number | null) => void;
}) => {
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const onHover = (id: number) => {
    setOpenSubMenu(id);
  };

  const onLeave = () => {
    setOpenSubMenu(null);
  };

  const handleRoute = (
    slug: string,
    parentSlug?: string,
    topParentSlug?: string,
  ) => {
    const route = topParentSlug
      ? `/news/${topParentSlug}/${parentSlug ? parentSlug + '/' : ''}${slug}`
      : parentSlug
        ? `/news/${parentSlug}/${slug}`
        : `/news/${slug}`;
    router.push(`${workspaceURI}/${route}`);
  };

  return (
    <div className="flex items-center ">
      {items.map((item, i) => (
        <React.Fragment key={item.id}>
          <MenuItem
            item={item}
            isOpen={openSubMenu === item.id}
            onHover={onHover}
            onLeave={onLeave}
            openSubSubMenu={openSubSubMenu}
            setOpenSubSubMenu={setOpenSubSubMenu}
            handleRoute={handleRoute}
          />
          {i !== items.length - 1 && (
            <Separator
              className="bg-black w-[2px] !h-8"
              orientation="vertical"
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const SubMenu = ({
  item,
  openSubSubMenu,
  setOpenSubSubMenu,
  handleRoute,
  onHover,
}: {
  item: any;
  openSubSubMenu: number | null;
  setOpenSubSubMenu: (id: any) => void;
  handleRoute: (slug: string, parentSlug?: string) => void;
  onHover?: any;
}) => {
  const [child, setChild] = useState<any>(null);

  const handleClick = (child: any) => {
    onHover(item.id);
    setOpenSubSubMenu((prev: any) => (prev === child.id ? null : child.id));

    setChild(child);
  };

  useEffect(() => {
    setOpenSubSubMenu(null);
    setChild(null);
  }, [item]);

  return (
    <div className="w-full absolute left-0 top-14 bg-background flex flex-row  gap-12 z-50 border-t">
      <div
        className={cn(
          'flex flex-col gap-6 px-10 py-6 bg-gray-50',
          openSubSubMenu ? 'w-fit' : 'w-full',
        )}>
        {item.items.map((child: any) => {
          const categoryLength = child.items.length;
          return (
            <React.Fragment key={child.id}>
              <li className="z-20 flex w-[25rem]">
                <div className="w-full flex gap-12 items-center justify-between">
                  <div
                    className="font-normal text-base cursor-pointer"
                    onClick={() => handleRoute(child.slug, item.slug)}>
                    {child.name}
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
      {openSubSubMenu === child?.id && (
        <SubSubMenu
          item={child}
          topParentSlug={item.slug}
          handleRoute={handleRoute}
          setOpenSubSubMenu={setOpenSubSubMenu}
        />
      )}
    </div>
  );
};

const SubSubMenu = ({
  item,
  topParentSlug,
  handleRoute,
  setOpenSubSubMenu,
}: {
  item: any;
  topParentSlug: string;
  handleRoute: (slug: string, parentSlug?: string, topParentSLug?: any) => void;
  setOpenSubSubMenu: (id: number | null) => void;
}) => {
  return (
    <div
      className={'bg-white flex-1 flex flex-col gap-6 py-6 px-4'}
      onMouseEnter={() => setOpenSubSubMenu(item.id)}>
      <div className="font-medium text-base ">{item.name}</div>
      {item?.items?.map((subChild: any) => (
        <div
          key={subChild.id}
          className="flex gap-6 items-center justify-between relative">
          <div
            className="font-normal text-sm cursor-pointer"
            onClick={() =>
              handleRoute(subChild.slug, item.slug, topParentSlug)
            }>
            {subChild.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Categories;

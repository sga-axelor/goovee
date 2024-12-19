'use client';

import {MdChevronRight} from 'react-icons/md';
import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import ReactDOM from 'react-dom';

// ---- CORE IMPORTS ---- //
import {Separator} from '@/ui/components/separator';

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
      className="hidden md:flex justify-center gap-5 px-6 py-4 relative overflow-x-auto bg-white">
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
      className="relative"
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={onLeave}>
      <span className="cursor-pointer" onClick={() => handleRoute(item.slug)}>
        {item.name}
      </span>
      {isOpen && item.items.length > 0 && itemRef.current && (
        <SubMenu
          item={item}
          onHover={onHover}
          openSubSubMenu={openSubSubMenu}
          setOpenSubSubMenu={setOpenSubSubMenu}
          handleRoute={handleRoute}
          parentRect={itemRef.current.getBoundingClientRect()}
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
    <div className="menu flex gap-10 overflow-x-auto items-center">
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
            <Separator className="bg-black w-[2px]" orientation="vertical" />
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
  parentRect,
}: {
  item: any;
  openSubSubMenu: number | null;
  setOpenSubSubMenu: (id: any) => void;
  handleRoute: (slug: string, parentSlug?: string) => void;
  onHover?: any;
  parentRect: DOMRect;
}) => {
  const handleClick = (childId: number) => {
    onHover(item.id);
    setOpenSubSubMenu((prev: any) => (prev === childId ? null : childId));
  };

  return ReactDOM.createPortal(
    <div
      className="min-w-[295px] absolute z-10 bg-white flex flex-col gap-12 py-6 px-4"
      style={{top: `${parentRect.bottom}px`, left: `${parentRect.left}px`}}>
      {item.items.map((child: any) => {
        const categoryLength = child.items.length;
        return (
          <div key={child.id} className="flex w-full">
            <li className="z-20 flex w-full relative">
              <div className="w-full flex gap-12 items-center justify-between">
                <div
                  className="font-normal text-base cursor-pointer"
                  onClick={() => handleRoute(child.slug, item.slug)}>
                  {child.name}
                </div>
                {categoryLength > 0 && (
                  <MdChevronRight
                    className="text-2xl cursor-pointer"
                    onClick={() => handleClick(child.id)}
                  />
                )}
              </div>
            </li>
            {openSubSubMenu === child.id && categoryLength > 0 && (
              <div className="relative left-4 -top-6">
                <SubSubMenu
                  item={child}
                  topParentSlug={item.slug}
                  handleRoute={handleRoute}
                  setOpenSubSubMenu={setOpenSubSubMenu}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>,
    document.body,
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
      className="min-w-[200px] outline-1 outline-slate-800 bg-white absolute left-full top-0 z-10 flex flex-col gap-12 py-6 px-4 border border-slate-50"
      onMouseEnter={() => setOpenSubSubMenu(item.id)}
      onMouseLeave={() => setOpenSubSubMenu(null)}>
      {item.items.map((subChild: any) => (
        <div
          key={subChild.id}
          className="flex gap-12 items-center justify-between relative">
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

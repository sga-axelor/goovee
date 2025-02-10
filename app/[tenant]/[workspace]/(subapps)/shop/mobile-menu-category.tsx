'use client';

import {useCallback, useEffect, useState} from 'react';
import {
  MdChevronLeft,
  MdChevronRight,
  MdOutlineCalendarMonth,
} from 'react-icons/md';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {Sheet, SheetContent, Portal} from '@/ui/components';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import type {Category} from '@/types';

// ---- LOCAL IMPORTS ---- //
import styles from './styles.module.scss';

export function MobileCategories({
  categories = [],
  onClick,
}: {
  categories?: Category[];
  onClick?: any;
}) {
  const [open, setOpen] = useState(false);

  const openSidebar = useCallback(() => setOpen(true), []);
  const closeSidebar = useCallback(() => setOpen(false), []);

  const handleItemClick = (category: any) => {
    onClick && onClick(category);
    closeSidebar();
  };

  return (
    <>
      <MdOutlineCalendarMonth
        className="cursor-pointer h-6 w-6"
        onClick={openSidebar}
      />
      <Sheet open={open} onOpenChange={closeSidebar}>
        <SheetContent side="left" className="bg-white divide-y divide-grey-1">
          <RenderCategory
            category={categories}
            parent={null}
            onItemClick={handleItemClick}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}

export const RenderCategory = ({
  category,
  parent,
  handleBack = () => {},
  onItemClick,
}: {
  category: any[];
  parent: string | null;
  handleBack?: () => void;
  onItemClick: any;
}) => {
  const [activeCategories, setActiveCategories] = useState<any[]>([]);
  const [activeParent, setActiveParent] = useState(null);

  const handleClick = (category: any) => {
    setActiveParent(category.name);
    setActiveCategories(category.items);
  };

  const handleGoBack = () => {
    setActiveCategories([]);
    setActiveParent(null);
  };

  return (
    <>
      <div className="w-full h-full absolute left-0 top-0 my-10  z-10 bg-background border-none">
        <div className="flex flex-col">
          {parent && (
            <div
              onClick={handleBack}
              className="flex flex-row cursor-pointer border-b px-4 md:px-6 py-6">
              <div>
                <MdChevronLeft width={32} height={32} />
              </div>
              <p className="leading-4 line-clamp-1 ml-4 font-semibold text-start">
                {parent}
              </p>
            </div>
          )}
          {category?.map(item => (
            <div
              key={item.id}
              className="w-full flex justify-between py-6 px-4 md:px-6 border-b ">
              <div onClick={() => onItemClick(item)} className="cursor-pointer">
                <p className="leading-4 line-clamp-1 text-start">{item.name}</p>
              </div>
              {item?.items?.length > 0 && (
                <div
                  onClick={() => handleClick(item)}
                  className="cursor-pointer">
                  <MdChevronRight />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {activeCategories.length > 0 && (
        <RenderCategory
          category={activeCategories}
          parent={activeParent}
          handleBack={handleGoBack}
          onItemClick={onItemClick}
        />
      )}
    </>
  );
};

export default function MobileMenuCategory({categories}: any) {
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const [container, setContainer] = useState<any>(null);

  const handleCategoryClick = (category: any) => {
    router.push(
      `${workspaceURI}/shop/category/${category.name}-${category.id}`,
    );
  };
  useEffect(() => {
    let container = document.getElementById('subapp-menu');

    if (container) {
      container.classList.add(styles.container);
      setContainer(container);
    }

    return () => {
      container?.classList?.remove(styles.container);
    };
  }, []);

  return (
    container && (
      <Portal container={container}>
        <MobileCategories
          categories={categories}
          onClick={handleCategoryClick}
        />
      </Portal>
    )
  );
}

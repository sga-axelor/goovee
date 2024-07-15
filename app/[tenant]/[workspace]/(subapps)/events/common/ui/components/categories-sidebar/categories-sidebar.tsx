'use client';

import Link from 'next/link';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {MdOutlineCalendarMonth} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Sheet, SheetContent} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {useMobileCategoriesSidebar} from '@/subapps/events/common/ui/hooks';

const categories = [
  {label: 'All events', url: '/'},
  {label: 'Category 1', url: '/'},
  {label: 'Category 2', url: '/'},
  {label: 'Category 3', url: '/'},
];
export const CategoriesSidebar = () => {
  const pathname = usePathname();
  const onOpen = useMobileCategoriesSidebar(state => state.onOpen);
  const onClose = useMobileCategoriesSidebar(state => state.onClose);
  const isOpen = useMobileCategoriesSidebar(state => state.isOpen);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <>
      <MdOutlineCalendarMonth
        onClick={onOpen}
        className="cursor-pointer w-6 h-6"
      />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="left"
          className="bg-white px-0 pt-11 pb-6 divide-y divide-grey-1">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.url}
              className="flex items-center pt-8 px-6 py-2 font-normal"
              onClick={onClose}>
              <p
                className={`max-w-full whitespace-nowrap text-main-black text-base font-normal`}>
                {category.label}
              </p>
            </Link>
          ))}
        </SheetContent>
      </Sheet>
    </>
  );
};

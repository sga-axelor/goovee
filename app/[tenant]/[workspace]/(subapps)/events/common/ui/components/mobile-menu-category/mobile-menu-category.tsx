'use client';

import {useCallback, useEffect, useState} from 'react';
import {MdOutlineCalendarMonth} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ui/components/accordion';
import {Sheet, SheetContent} from '@/ui/components/sheet';
import {Portal} from '@/ui/components';
import {Category} from '@/types';
import {cn} from '@/utils/css';

// ---- LOCAL IMPORTS ---- //
import styles from '@/subapps/events/common/ui/components/mobile-menu-category/index.module.scss';

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

  const renderCategory = (category: any) => {
    const {items, id, name} = category;

    const leaf = !items?.length;
    const active = false;

    const handleClick = () => {
      onClick(category);
      if (!category?.items?.length) {
        closeSidebar();
      }
    };

    return (
      <AccordionItem
        value={String(id)}
        className={cn('border-b-0 space-y-2 m-0', styles['accordion-item'])}
        key={id}>
        <AccordionTrigger
          className={cn('hover:no-underline py-2 px-2 rounded-lg', {
            'bg-muted': active,
            'text-muted-foreground': active,
          })}
          icon={!leaf}
          onClick={handleClick}>
          <div className="flex grow gap-2 items-center cursor-pointer">
            <p className="leading-4 line-clamp-1 text-start">{name}</p>
          </div>
        </AccordionTrigger>
        {!leaf && (
          <AccordionContent className="py-2 pt-4">
            <div className="ps-6 space-y-4">{items.map(renderCategory)}</div>
          </AccordionContent>
        )}
      </AccordionItem>
    );
  };

  return (
    <>
      <MdOutlineCalendarMonth
        className="cursor-pointer h-6 w-6"
        onClick={openSidebar}
      />
      <Sheet open={open} onOpenChange={closeSidebar}>
        <SheetContent side="left" className="bg-white divide-y divide-grey-1">
          <Accordion type="multiple" className="w-full space-y-4 mt-4">
            {categories.map(renderCategory)}
          </Accordion>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function MobileMenuCategory({categories}: any) {
  const [container, setContainer] = useState<any>(null);

  const handleCategoryClick = (category: any) => {
    // router.push(`${workspaceURI}/events`);
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

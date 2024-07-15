'use client';

import Link from 'next/link';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {MdApps} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Sheet, SheetContent} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {sidebarLinks} from '@/subapps/events/common/ui/components';
import {useMobileSidebar} from '@/subapps/events/common/ui/hooks';

export const MobileSidebar = () => {
  const pathname = usePathname();
  const onOpen = useMobileSidebar(state => state.onOpen);
  const onClose = useMobileSidebar(state => state.onClose);
  const isOpen = useMobileSidebar(state => state.isOpen);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <>
      <MdApps onClick={onOpen} className="cursor-pointer w-6 h-6" />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="left"
          className="bg-white px-0 pt-11 pb-6 divide-y divide-grey-1">
          {sidebarLinks.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              className="flex items-center pt-8  px-6 py-2 font-normal gap-x-4"
              onClick={onClose}>
              <button className="min-w-6">{link.icon}</button>
              <p
                className={`max-w-full whitespace-nowrap text-main-black text-base font-normal`}>
                {link.label}
              </p>
            </Link>
          ))}
        </SheetContent>
      </Sheet>
    </>
  );
};

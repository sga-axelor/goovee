'use client';

import {useCallback, useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {usePathname, useRouter} from 'next/navigation';
import Link from 'next/link';
import {MdApps, MdNotificationsNone} from 'react-icons/md';
import {Sheet, SheetContent} from '@/ui/components/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ui/components/accordion';
import {MdOutlineCalendarMonth} from 'react-icons/md';
import {Category} from '@/types';
import Icons from '@/utils/Icons';
import {cn} from '@/lib/utils';
import {SUBAPP_PAGE} from '@/constants';
import {Account} from '@/ui/components';
import {useWorkspace} from './workspace-context';
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

function MobileSidebar({subapps, workspaces}: any) {
  const {data: session} = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const {workspaceURI, workspaceURL} = useWorkspace();
  const router = useRouter();

  const redirect = (value: any) => {
    router.push(value);
  };

  const openSidebar = useCallback(() => setOpen(true), []);
  const closeSidebar = useCallback(() => setOpen(false), []);

  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  if (!session?.user?.id) {
    return null;
  }

  return (
    <>
      <MdApps onClick={openSidebar} className="cursor-pointer h-6 w-6" />
      <Sheet open={open} onOpenChange={closeSidebar}>
        <SheetContent side="left" className="bg-white divide-y divide-grey-1">
          {Boolean(workspaces?.length) && (
            <Select defaultValue={workspaceURL} onValueChange={redirect}>
              <SelectTrigger className="grow max-w-100 overflow-hidden px-6 py-2 mt-4 bg-none! h-[auto]">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                {workspaces.map((workspace: any) => (
                  <SelectItem key={workspace.url} value={workspace.url}>
                    {workspace.url}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {subapps
            ?.filter((app: any) => app.installed && app.showInMySpace)
            .sort(
              (app1: any, app2: any) =>
                app1.orderForMySpaceMenu - app2.orderForMySpaceMenu,
            )
            .reverse()
            ?.map(({code, name, icon, color, background}: any) => {
              const page = SUBAPP_PAGE[code as keyof typeof SUBAPP_PAGE] || '';
              return (
                <Link
                  key={code}
                  href={`${workspaceURI}/${code}${page}`}
                  className="no-underline">
                  <div
                    className="flex items-center pt-8 px-6 py-2 font-normal gap-x-4"
                    key={code}>
                    <Icons
                      name={icon || 'app'}
                      className="h-6 w-6"
                      style={{color}}
                    />
                    <p className="max-w-full whitespace-nowrap text-main-black">
                      {name}
                    </p>
                  </div>
                </Link>
              );
            })}
        </SheetContent>
      </Sheet>
    </>
  );
}

export function MobileMenu({subapps, workspaces, categories}: any) {
  const {data: session} = useSession();
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const authenticated = session?.user?.id;

  const redirect = () => router.push('/notifications');

  const handleCategoryClick = (category: any) => {
    router.push(
      `${workspaceURI}/shop/category/${category.name}-${category.id}`,
    );
  };
  return (
    <nav className="flex items-center w-screen fixed left-0 bottom-0 h-[72px] bg-white z-50 lg:hidden dark:bg-secondary px-8 pt-4 pb-6">
      <div className="flex items-center justify-between w-full">
        <MobileSidebar subapps={subapps} workspaces={workspaces} />
        <MobileCategories
          categories={categories}
          onClick={handleCategoryClick}
        />
        <MdNotificationsNone
          className="cursor-pointer h-6 w-6"
          onClick={redirect}
        />
        <Account />
      </div>
    </nav>
  );
}

export default MobileMenu;

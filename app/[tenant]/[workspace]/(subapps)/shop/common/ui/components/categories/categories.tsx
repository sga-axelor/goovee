import {useRef, useState, useCallback} from 'react';
import {MdOutlineMenu} from 'react-icons/md';
import {MdOutlineCategory} from 'react-icons/md';
import {Sheet, SheetContent, SheetTrigger} from '@ui/components/sheet';
// ---- CORE IMPORTS ---- //
import {useResponsive} from '@/ui/hooks';
import {i18n} from '@/lib/i18n';
import type {Category} from '@/types';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface NavItem {
  id?: number | string;
  title: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconColor?: string;
  items?: NavItem[];
}
function RenderNavItem({items, onClick}: any) {
  return (
    <>
      {items?.map((a: NavItem, i: number) => {
        return (
          <>
            <Accordion
              key={i}
              asChild
              multiple
              collapsible
              className="w-fulls border-0">
              {a?.items?.length ? (
                <>
                  <AccordionItem value={a?.title}>
                    <AccordionTrigger className={'text-base'}>
                      {a?.title} {a?.icon && <a.icon color={a.iconColor} />}
                    </AccordionTrigger>
                    <AccordionContent>
                      {<RenderNavItem items={a?.items} onClick={onClick} />}
                    </AccordionContent>
                  </AccordionItem>
                </>
              ) : (
                <>
                  <AccordionContent
                    className={'text-base'}
                    onClick={() => {
                      onClick(a);
                    }}>
                    {a?.title}
                  </AccordionContent>
                </>
              )}
            </Accordion>
          </>
        );
      })}
    </>
  );
}
function MobileCategories({
  items = [],
  onClick,
}: {
  items?: Category[];
  onClick?: any;
}) {
  const [show, setShow] = useState<boolean>(false);

  const hideDrawer = useCallback(() => {
    setShow(false);
  }, []);

  const handleItemClick = useCallback(
    (item: any) => {
      if (item.root) return;
      onClick(item);
      if (!item?.items?.length) {
        hideDrawer();
      }
    },
    [hideDrawer, onClick],
  );

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <div className="px-6 bg-white p-4 border-t border-b">
            <div className="flex">
              <MdOutlineMenu className="cursor-pointer text-2xl" />
            </div>
          </div>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex bg-white flex-grow-1 pt-0">
            <RenderNavItem
              onClick={handleItemClick}
              items={[
                {
                  id: '1',
                  title: i18n.get('Categories'),
                  icon: () => <MdOutlineCategory className="text-xl" />,
                  iconColor: 'black',
                  items: items as any,
                },
              ]}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
export const Categories = ({
  items = [],
  onClick,
}: {
  items?: Category[];
  onClick?: any;
}) => {
  const level = 0;
  const res: any = useResponsive();
  const large = ['lg', 'xl', 'xxl'].some(x => res[x]);

  return large ? (
    <div className="mx-auto flex items-center gap-4 mb-0 px-6 py-4 bg-background border-t border-border border-solid subcategory">
      {items.map((category, index) => {
        return (
          <Category
            item={category}
            key={index}
            level={level}
            onClick={onClick}
          />
        );
      })}
    </div>
  ) : (
    <MobileCategories items={items} onClick={onClick} />
  );
};
export default Categories;
const Category = ({
  item,
  level,
  onClick,
}: {
  item: Category;
  level: number;
  onClick?: any;
}) => {
  const [open, setOpen] = useState(false);
  let ref = useRef();
  const [target, setTarget] = useState<any>(null);

  const toggleDropdown = () => {
    handleClick();
    setOpen(prev => !prev);
  };

  const handleDropdownClick = () => {
    toggleDropdown();
  };
  const handleClick = () => {
    onClick && onClick(item);
  };

  return (
    <div
      {...{ref: ref as any}}
      className="shrink-0 relative first-item flex items-center z-[9]">
      {item.items?.length ? (
        <>
          <NavigationMenu>
            <NavigationMenuList className="mb-0 px-0">
              <NavigationMenuItem>
                <div
                  onClick={handleDropdownClick}
                  ref={setTarget}
                  className="flex items-center justify-center cursor-pointer text-base font-medium text-primary">
                  <NavigationMenuTrigger className="px-0 hover:bg-transparent">
                    <p className="px-2 mb-0 text-base font-medium text-primary first-border border-l-2 border-primary border-solid">
                      {i18n.get(item.name)}
                    </p>
                  </NavigationMenuTrigger>
                </div>

                <Dropdown
                  level={level}
                  items={item.items}
                  open={open}
                  onClick={onClick}
                  target={target}
                />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </>
      ) : (
        <p
          className="cursor-pointer pl-4 mb-0 text-base font-medium text-primary border-l-2 border-primary border-solid first-border"
          onClick={handleClick}>
          {i18n.get(item.name)}
        </p>
      )}
    </div>
  );
};
const Dropdown = ({
  items,
  open,
  level,
  onClick,
  target,
}: {
  items: Category[];
  open: boolean;
  level: number;
  onClick: any;
  target: any;
}) => {
  level = level + 1;

  return (
    <NavigationMenuContent>
      <div className="!min-w-[12.5rem]">
        {items.map((category: Category, index: number) => (
          <Category
            item={category}
            key={index}
            level={level}
            onClick={onClick}
          />
        ))}
      </div>
    </NavigationMenuContent>
  );
};

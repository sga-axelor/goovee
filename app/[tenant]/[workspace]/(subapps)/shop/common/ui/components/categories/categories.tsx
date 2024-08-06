import {Fragment, useRef, useState} from 'react';

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
} from '@ui/components/navigation-menu';
import {Separator} from '@/ui/components';
import {cn} from '@/utils/css';

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
    <div className="mx-auto flex items-center gap-5 mb-0 px-6 py-4 bg-background text-foreground">
      {items.map((category, index) => {
        return (
          <Fragment key={index}>
            {index !== 0 && (
              <Separator
                className="bg-black w-[2px] shrink-0 h-auto self-stretch"
                orientation="vertical"
              />
            )}
            <Category item={category} level={level} onClick={onClick} />
          </Fragment>
        );
      })}
    </div>
  ) : null;
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
      className="shrink-0 relative flex items-center z-[9]">
      {item.items?.length ? (
        <>
          <NavigationMenu>
            <NavigationMenuList className="mb-0 px-0">
              <NavigationMenuItem>
                <div
                  onClick={handleDropdownClick}
                  ref={setTarget}
                  className="flex items-center justify-center cursor-pointer text-foreground font-medium">
                  <NavigationMenuTrigger
                    className={cn(
                      'text-base h-auto px-0 bg-transparent hover:bg-transparent',
                      {
                        'py-0': level === 0,
                      },
                    )}>
                    <p className="px-2 text-foreground border-foreground font-medium">
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
          className="cursor-pointer pl-4 text-foreground border-foreground border-solid first-border font-medium"
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

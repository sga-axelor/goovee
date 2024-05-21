import { useEffect, useRef, useState, useCallback } from "react";
import {
  Box,
  Grow,
  Popper,
  Drawer,
  useClassNames,
  clsx,
  NavMenu,
  ClickAwayListener,
} from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";

// ---- CORE IMPORTS ---- //
import { useResponsive } from "@/ui/hooks";
import { i18n } from "@/lib/i18n";
import type { Category } from "@/types";

function MobileCategories({
  items = [],
  onClick,
}: {
  items?: Category[];
  onClick?: any;
}) {
  const [show, setShow] = useState<boolean>(false);

  const showDrawer = () => {
    setShow(true);
  };

  const hideDrawer = useCallback(() => {
    setShow(false);
  }, []);

  const handleItemClick = useCallback((item: any) => {
    if (item.root) return;

    onClick(item);

    if (!item?.items?.length) {
      hideDrawer();
    }
  }, []);

  return (
    <>
      <Box px={4} bg="white" p={3} borderTop borderBottom>
        <Box d="flex">
          <MaterialIcon
            icon="menu"
            className="cursor-pointer"
            onClick={() => (show ? hideDrawer() : showDrawer())}
          />
        </Box>
      </Box>
      <Drawer
        d="flex"
        bgColor="white"
        placement="start"
        open={show}
        onClose={hideDrawer}
      >
        <ClickAwayListener onClickAway={hideDrawer}>
          <Box d="flex" border flexGrow={1} pt={3} bgColor="white">
            <NavMenu
              mode="accordion"
              show="inline"
              onItemClick={handleItemClick}
              items={[
                {
                  id: "1",
                  root: true,
                  title: i18n.get("Categories"),
                  icon: () => <MaterialIcon icon="category" />,
                  iconColor: "black",
                  items: items as any,
                } as any,
              ]}
            />
          </Box>
        </ClickAwayListener>
      </Drawer>
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
  const cs = useClassNames();
  const res: any = useResponsive();
  const large = ["lg", "xl", "xxl"].some((x) => res[x]);

  return large ? (
    <Box
      className="mx-auto flex items-center gap-4 mb-0 overflow-x-auto px-6 py-4 bg-background border-t border-border border-solid"
    >
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
    </Box>
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

  const onMouseEnter = () => {
    setOpen(true);
  };

  const onMouseLeave = () => {
    setOpen(false);
  };

  const toggleDropdown = () => {
    handleClick();
    setOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    open && setOpen(false);
  };

  const handleDropdownClick = () => {
    toggleDropdown();
  };

  const handleClick = () => {
    onClick && onClick(item);
  };

  useEffect(() => {
    const handler = (event: any) => {
      if (open && ref.current && !(ref.current as any).contains(event.target)) {
        // setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  return (
    <Box
      {...{ ref: ref as any }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={closeDropdown}
      className="shrink-0 relative"
    >
      {item.items?.length ? (
        <>
          <Box
            onClick={handleDropdownClick}
            ref={setTarget}
            className="flex items-center justify-center cursor-pointer text-base font-medium text-primary"
          >
            <Box as="p"className="px-2 mb-0">
              {i18n.get(item.name)}
            </Box>
            <MaterialIcon
              icon={level > 0 ? "arrow_right" : "keyboard_arrow_down"}
            />
          </Box>
          <Dropdown
            level={level}
            items={item.items}
            open={open}
            onClick={onClick}
            target={target}
          />
        </>
      ) : (
        <Box
          as="p"
          className="cursor-pointer pl-4 mb-0 text-base font-medium text-primary border-l-2 border-primary border-solid"
          onClick={handleClick}
        >
          {i18n.get(item.name)}
        </Box>
      )}
    </Box>
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
    <Popper
      open={open}
      target={target}
      offset={[0, 4]}
      transition={Grow}
      {...(level > 1
        ? { placement: "end-top" }
        : { placement: "bottom-start" })}
    >
      <Box style={{ minWidth: 200 }}>
        {items.map((category: Category, index: number) => (
          <Category
            item={category}
            key={index}
            level={level}
            onClick={onClick}
          />
        ))}
      </Box>
    </Popper>
  );
};

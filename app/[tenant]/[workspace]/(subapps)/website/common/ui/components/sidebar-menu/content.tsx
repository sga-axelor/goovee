'use client';

import React, {useEffect, useState} from 'react';
import {MdDoubleArrow} from 'react-icons/md';
import Link from 'next/link';
import {FaChevronDown, FaChevronRight} from 'react-icons/fa';
import {MdMenu} from 'react-icons/md';
import {TfiClose} from 'react-icons/tfi';

// ---- LOCAL IMPORTS ---- //
import {MenuItem} from '@/subapps/website/common/types';
import {Button} from '@/ui/components';

type SidebarMenuProps = {
  values?: {
    menuList?: MenuItem[];
  };
};
const BORDER_COLOR = '#dadde1';
const STYLES = {
  text: {
    primary: 'text-[#010165]',
    secondary: 'text-[#606770]',
    default: 'text-[#7a7a7a]',
    defaultHover: 'hover:text-[#7a7a7a]',
  },
  bg: {
    primary: 'bg-[#f5f5ff]',
    secondary: 'bg-[#ebebff]',
    secondaryHover: 'hover:bg-[#ebebff]',
  },
  border: {
    primaryColor: 'border-[#dadde1]',
  },
};

const FONTS = {
  poppins: '__Poppins_51684b',
};

export function SidebarMenuContent(props: SidebarMenuProps) {
  const {values} = props;
  const menuList = values?.menuList || [];
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const toggleMenu = (show: boolean) => setIsVisible(show);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsVisible(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobile && isVisible) {
        setIsVisible(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobile, isVisible]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile && isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isVisible]);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleMenu(true)}
          className="h-10 w-10 hover:bg-transparent">
          <MdMenu className="h-6 w-6 text-gray-600" />
        </Button>
      </div>

      {/* Desktop and Mobile Sidebar */}
      <div className="h-full flex z-10">
        {/* Mobile Backdrop */}
        {isMobile && isVisible && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => toggleMenu(false)}
          />
        )}

        {!isVisible && !isMobile ? (
          // Desktop collapsed state
          <div className={`hidden lg:flex h-full ${STYLES.bg.primary}`}>
            <Button
              variant="ghost"
              onClick={() => toggleMenu(true)}
              className={`h-full rounded-none border-r ${STYLES.bg.secondaryHover} ${STYLES.border.primaryColor} p-0`}>
              <MdDoubleArrow
                className={`h-5 w-6 ${STYLES.text.default} ${STYLES.text.defaultHover}`}
              />
            </Button>
          </div>
        ) : isVisible ? (
          // Expanded sidebar (both mobile and desktop)
          <div
            className={`
                ${STYLES.bg.primary} flex flex-col
                ${isMobile ? 'fixed top-0 left-0 h-full w-[83vw] z-50 shadow-xl' : 'min-w-72 relative'}
              `}>
            {/* Mobile Header with Close Button */}
            {isMobile && (
              <div
                className={`flex items-center justify-between px-4 py-2 bg-white border-b ${STYLES.border.primaryColor}`}>
                {/* LOGO */}
                <h2 className={`text-lg font-semibold ${STYLES.text.primary}`}>
                  Logo
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleMenu(false)}
                  className="h-8 w-8 hover:bg-transparent">
                  <TfiClose className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            )}

            <nav className="flex-1 overflow-y-auto py-2">
              {menuList.length > 0 ? (
                <div className="space-y-1">
                  {menuList.map(item => (
                    <MenuItemComponent
                      key={item.id}
                      item={item}
                      onItemClick={() => {
                        // Close mobile menu when item is clicked
                        if (isMobile) {
                          toggleMenu(false);
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  No menu items available
                </div>
              )}
            </nav>

            {/* Desktop Collapse Button */}
            <Button
              onClick={() => toggleMenu(false)}
              className={`hidden lg:flex h-8 w-full ${STYLES.bg.secondaryHover} p-4 ${STYLES.bg.primary}`}
              style={{border: `1px solid ${BORDER_COLOR}`}}>
              <MdDoubleArrow
                className={`h-5 w-5 rotate-180 ${STYLES.text.default} ${STYLES.text.defaultHover}`}
              />
            </Button>
          </div>
        ) : null}
      </div>
    </>
  );
}

const MenuItemComponent = ({
  item,
  level = 0,
  onItemClick,
}: {
  item: MenuItem;
  level?: number;
  onItemClick?: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubMenu = item.subMenuList && item.subMenuList.length > 0;
  const itemHref = item.page?.slug || item.externalPage || '#';

  const handleItemClick = () => {
    if (hasSubMenu) {
      setIsExpanded(!isExpanded);
    } else {
      onItemClick?.();
    }
  };

  const isSelected = isExpanded && hasSubMenu && level === 0;

  return (
    <div key={item.id}>
      <div
        className={`flex items-center justify-between mx-2 px-3 py-0 font-normal cursor-pointer rounded-md duration-150 ${
          isSelected ? STYLES.bg.secondary : STYLES.bg.secondaryHover
        }`}
        style={{
          marginLeft: `${Math.min(level * 16, 48)}px`,
          fontFamily: FONTS.poppins,
        }}>
        {hasSubMenu ? (
          <div
            className="flex-1 h-[32px] flex items-center"
            onClick={handleItemClick}>
            <span
              className={`flex-1 ${isSelected ? `${STYLES.text.primary}` : `${STYLES.text.secondary}`}`}>
              {item.title}
            </span>
          </div>
        ) : (
          <Link
            href={itemHref}
            className="flex-1 h-[32px] flex items-center"
            onClick={onItemClick}>
            <span
              className={`flex-1 ${isSelected ? `${STYLES.text.primary}` : `${STYLES.text.secondary}`}`}>
              {item.title}
            </span>
          </Link>
        )}

        {hasSubMenu && (
          <div className="ml-2" onClick={handleItemClick}>
            {isExpanded ? (
              <FaChevronDown className="h-[18px] w-4 text-gray-500" />
            ) : (
              <FaChevronRight className="h-[18px] w-4 text-gray-500" />
            )}
          </div>
        )}
      </div>

      {hasSubMenu && isExpanded && (
        <div className={`mt-1 flex flex-col gap-1`}>
          {item?.subMenuList?.map(subItem => (
            <MenuItemComponent
              key={subItem.id}
              item={subItem}
              level={level + 1}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarMenuContent;

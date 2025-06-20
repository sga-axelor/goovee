import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import {BiSolidChevronDown, BiSolidChevronUp} from 'react-icons/bi';

type MenuItemType = {
  label: string;
  href?: string;
  links?: MenuItemType[];
  external?: boolean;
};

type MenuItemProps = MenuItemType & {
  onClose: () => void;
};

const MenuItem = ({label, href, links, external, onClose}: MenuItemProps) => {
  const [open, setOpen] = useState(false);
  const hasChildren = links && links.length > 0;

  return (
    <li className="border-b border-[#00000008]">
      <div
        className={`flex justify-between items-center text-[#666] font-bold text-sm/7 py-2.5 ${
          hasChildren ? 'cursor-pointer bg-[#00000008]' : ''
        } hover:bg-[#F5F5FF] border-b border-white`}
        style={{paddingInline: '5%'}}>
        {href ? (
          <Link
            href={href}
            target={external ? '_blank' : '_self'}
            rel={external ? 'noopener noreferrer' : ''}
            onClick={onClose}>
            {label}
          </Link>
        ) : (
          <span onClick={onClose}>{label}</span>
        )}

        {hasChildren &&
          (open ? (
            <BiSolidChevronUp
              className="w-3 h-3"
              onClick={() => setOpen(!open)}
            />
          ) : (
            <BiSolidChevronDown
              className="w-3 h-3"
              onClick={() => setOpen(!open)}
            />
          ))}
      </div>

      {hasChildren && open && (
        <ul className="pl-6">
          {links.map((subItem, index) => (
            <MenuItem
              key={`${label}-${index}`}
              {...subItem}
              external={subItem.href?.startsWith('http')}
              onClose={onClose}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export function MobileMenu({
  menu,
}: {
  menu: {
    label: string;
    href: string;
  }[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClose = () => setMenuOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen]);

  return (
    <div className="flex flex-col">
      <div className="flex lg:hidden items-center py-3">
        <ul className="flex flex-row items-center">
          <li>
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="hamburger offcanvas-nav-btn">
              <span />
            </button>
          </li>
        </ul>
      </div>
      {menuOpen && (
        <div
          className="absolute top-full left-0 bg-white !border-success shadow-xl z-50"
          style={{
            borderTop: 3,
            borderStyle: 'solid',
            padding: '5%',
            width: '-webkit-fill-available',
          }}>
          <ul className="w-full rounded-lg !pl-0 !mb-0">
            {menu.map((item, index) => (
              <MenuItem
                key={`${item.label}-${index}`}
                {...item}
                external={item.href?.startsWith('http')}
                onClose={handleClose}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MobileMenu;

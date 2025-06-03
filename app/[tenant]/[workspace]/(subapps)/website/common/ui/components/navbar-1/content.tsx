'use client';

import {useEffect, useRef, useState} from 'react';

// ---- LOCAL IMPORTS ---- //
import ListItemLink from '@/subapps/website/common/components/reuseable/links/ListItemLink';
import {MenuItem} from '@/subapps/website/common/types';
import {DropdownToggleLink} from '../dropdown-toggle-link';

type NavbarProps = {
  values?: {
    menuList?: MenuItem[];
  };
};

type Link = {
  label: string;
  href: string;
  links: Link[];
};

export function NavbarContent(props: NavbarProps) {
  const {values} = props;
  const menuList = values?.menuList || [];
  const navbarRef = useRef<HTMLElement | null>(null);

  const [isLgUp, setIsLgUp] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth > 1024 : false,
  );

  const navClassName =
    'navbar navbar-expand-lg center-nav transparent navbar-light';

  const caretPosition = 'left';

  const transformMenuList = (menu: MenuItem): Link => {
    return {
      label: menu.title,
      href: menu.page?.slug || menu.externalPage || '#',
      links:
        menu.subMenuList?.filter(sub => !sub.archived).map(transformMenuList) ||
        [],
    };
  };

  useEffect(() => {
    const onResize = () => {
      setIsLgUp(window.innerWidth > 1024);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const $links: Link[] = menuList
    .filter(m => !m.archived)
    .map(transformMenuList);

  const renderMenuLinks = (items: Link[]) => {
    return items.map((item, index) => {
      const hasChildren = item.links.length > 0;
      const hasValidHref = item.href !== '#';

      return hasChildren ? (
        <li
          key={index}
          className={`dropdown dropdown-submenu ${isLgUp ? 'dropstart' : 'dropend'}`}>
          <DropdownToggleLink
            title={item.label}
            className="dropdown-item dropdown-toggle"
            href={item.href}
            caretPosition={caretPosition}
            {...(hasValidHref ? {'data-bs-toggle': ''} : {})}
          />
          <ul className="dropdown-menu">{renderMenuLinks(item.links)}</ul>
        </li>
      ) : (
        <ListItemLink
          href={item.href}
          title={item.label}
          linkClassName={`dropdown-item ${caretPosition === 'left' ? 'lg:!text-right' : ''}`}
          key={index}
        />
      );
    });
  };

  const headerContent = (
    <div className="flex justify-end items-center w-full">
      <div
        id="offcanvas-nav"
        data-bs-scroll="true"
        className="navbar-collapse offcanvas offcanvas-nav offcanvas-start">
        <div className="offcanvas-header d-lg-none justify-end">
          {/* LOGO for the company in mobile view */}
          {/* <h3 className="text-white fs-30 mb-0">Lighthouse</h3> */}
          <button
            type="button"
            aria-label="Close"
            data-bs-dismiss="offcanvas"
            className="btn-close btn-close-white"
          />
        </div>
        <div className="offcanvas-body ms-lg-auto d-flex flex-column h-100">
          <ul className="navbar-nav">
            {$links.map((link, i) => {
              const isDropDown = link.links.length > 0;

              return isDropDown ? (
                <li className="nav-item dropdown" key={i}>
                  <DropdownToggleLink
                    title={link.label}
                    className="nav-link dropdown-toggle"
                    href={link.href}
                  />
                  <ul className="dropdown-menu">
                    {renderMenuLinks(link.links)}
                  </ul>
                </li>
              ) : (
                <ListItemLink
                  key={i}
                  href={link.href}
                  title={link.label}
                  liClassName="nav-item dropdown"
                  linkClassName="nav-link"
                />
              );
            })}
          </ul>
        </div>
      </div>

      {/* Hamburger */}
      <div className="flex lg:hidden items-center py-6">
        <ul className="flex flex-row items-center">
          <li>
            <button
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvas-nav"
              className="hamburger offcanvas-nav-btn">
              <span />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="wrapper position-relative">
      <nav ref={navbarRef} className={navClassName}>
        <div className="container flex-lg-row flex-nowrap align-items-center">
          {headerContent}
        </div>
      </nav>
    </div>
  );
}

export default NavbarContent;

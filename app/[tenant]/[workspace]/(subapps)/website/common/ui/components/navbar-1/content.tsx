'use client';

import {useRef} from 'react';
import {Offcanvas} from 'bootstrap';

// ---- LOCAL IMPORTS ---- //
import ListItemLink from '@/subapps/website/common/components/reuseable/links/ListItemLink';
import {MenuItem} from '@/subapps/website/common/types';
import {DropdownToggleLink} from '../dropdown-toggle-link';
import MobileMenu from './mobile-menu';

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

  const navClassName =
    'navbar navbar-expand-lg center-nav transparent navbar-light';

  const transformMenuList = (menu: MenuItem): Link => {
    return {
      label: menu.title,
      href: menu.page?.slug || menu.externalPage || '#',
      links:
        menu.subMenuList?.filter(sub => !sub.archived).map(transformMenuList) ||
        [],
    };
  };

  const $links: Link[] = menuList
    .filter(m => !m.archived)
    .map(transformMenuList);

  const renderMenuLinks = (items: Link[]) => {
    return items.map((item, index) => {
      const hasChildren = item.links.length > 0;
      const hasValidHref = item.href !== '#';

      return hasChildren ? (
        <li key={index} className="dropdown dropdown-submenu dropend">
          <DropdownToggleLink
            title={item.label}
            className="dropdown-item dropdown-toggle"
            href={item.href}
            {...(hasValidHref ? {'data-bs-toggle': ''} : {})}
          />
          <ul className="dropdown-menu">{renderMenuLinks(item.links)}</ul>
        </li>
      ) : (
        <ListItemLink
          href={item.href}
          title={item.label}
          linkClassName="dropdown-item"
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
        <div className="offcanvas-body m-auto d-flex flex-column h-100">
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
                  onClick={() => {
                    const element = document.getElementById('offcanvas-nav');
                    if (element) {
                      const offcanvas = Offcanvas.getInstance(element);
                      offcanvas?.hide();
                    }
                  }}
                />
              );
            })}
          </ul>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <MobileMenu menu={$links} />
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

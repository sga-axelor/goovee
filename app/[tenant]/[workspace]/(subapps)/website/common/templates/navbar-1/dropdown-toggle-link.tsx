'use client';

import Link from 'next/link';
import {AnchorHTMLAttributes, DetailedHTMLProps, FC, useRef} from 'react';
// ==========================================================

interface DropdownToggleLinkProps
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  title: string;
  caretPosition?: 'left' | 'right'; // For desktop only
}
// ==========================================================

export const DropdownToggleLink: FC<DropdownToggleLinkProps> = props => {
  const {title, caretPosition = 'right', href = '#', ...others} = props;
  const linkRef = useRef<HTMLAnchorElement>(null);

  const isMobile = window.innerWidth < 1024;
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const anchor = e.currentTarget;
    const clickX = e.nativeEvent.offsetX;
    const anchorWidth = anchor.offsetWidth;

    // On mobile, caret is always on the right (last 40px)
    const isCaretClick = isMobile
      ? clickX > anchorWidth - 40
      : caretPosition === 'right'
        ? clickX > anchorWidth - 40
        : clickX < 40;

    if (isCaretClick) {
      e.preventDefault();
      e.stopPropagation();

      const parentLi = anchor.closest('li');
      if (!parentLi) return;

      const submenu = parentLi.querySelector(':scope > ul.dropdown-menu');
      if (submenu) {
        const isOpen = submenu.classList.contains('show');

        // Close all other menus at the same level
        const parentDropdown = parentLi.closest('ul.dropdown-menu');
        if (parentDropdown) {
          parentDropdown
            .querySelectorAll(':scope > li > ul.dropdown-menu')
            .forEach(menu => {
              if (menu !== submenu) menu.classList.remove('show');
            });
        } else {
          // For top-level menus
          document.querySelectorAll('ul.dropdown-menu').forEach(menu => {
            if (menu !== submenu && !menu.closest('li.show'))
              menu.classList.remove('show');
          });
        }

        submenu.classList.toggle('show', !isOpen);
        parentLi.classList.toggle('show', !isOpen);

        submenu.setAttribute(
          'style',
          'margin-left: var(--bs-dropdown-spacer);',
        );
      }
    } else {
      const closeBtn = document.querySelector(
        '.offcanvas.show .btn-close',
      ) as HTMLElement;
      closeBtn?.click();
    }
  };

  return (
    <Link
      href={href}
      ref={linkRef}
      onClick={handleClick}
      className={`dropdown-item dropdown-toggle d-flex align-items-center`}
      {...others}>
      <span
        className={`inline-block flex-grow-1 ${caretPosition === 'left' && !isMobile ? 'w-full text-right' : ''}`}>
        {title}
      </span>
      <span className="caret-indicator" aria-hidden="true" />
    </Link>
  );
};

export default DropdownToggleLink;

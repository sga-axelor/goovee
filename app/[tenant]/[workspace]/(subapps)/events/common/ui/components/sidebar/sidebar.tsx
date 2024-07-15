'use client';

import Link from 'next/link';
import {useState} from 'react';
import {ChevronDown} from 'lucide-react';
import {MdApps} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {sidebarLinks} from '@/app/events/common/ui/components';

export const Sidebar = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <aside
      className={`${
        expanded ? 'w-60' : 'w-14'
      } sticky hidden z-50 lg:block top-0 left-0 transition-all min-h-screen h-full py-3 px-4 text-white bg-primary`}>
      <div className="flex flex-col space-y-10">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-x-4">
          <MdApps className="min-w-6 w-6 h-6" />
          <div
            className={`${
              expanded ? 'max-w-full' : 'max-w-0'
            } whitespace-nowrap transition-all overflow-hidden duration-500  text-sm font-normal flex items-center gap-x-2`}>
            Workspace
            <ChevronDown />
          </div>
        </button>

        <div className="flex flex-col space-y-6">
          {sidebarLinks.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              className="flex items-center  font-normal gap-x-4"
              onClick={() => setExpanded(false)}>
              <button className="min-w-6">{link.icon}</button>
              <p
                className={`${
                  expanded ? 'max-w-full' : 'max-w-0'
                } whitespace-nowrap transition-all overflow-hidden duration-500`}>
                {link.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

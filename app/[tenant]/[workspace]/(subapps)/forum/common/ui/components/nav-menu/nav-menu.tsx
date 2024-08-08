'use client';

import React from 'react';
import {useSession} from 'next-auth/react';

// ---- CORE IMPORTS ---- //
import {Separator} from '@/ui/components/separator';

export const NavMenu = ({
  items,
  onClick,
}: {
  items: any;
  onClick: (link: string) => void;
}) => {
  const {data: session} = useSession();

  const filteredItems = session
    ? items
    : items.filter((item: any) => item.id === 1);

  return (
    <div className="bg-white flex items-center justify-center gap-5 px-6 py-4">
      {filteredItems.map((item: any, index: number) => (
        <React.Fragment key={item.id}>
          <div
            key={item.id}
            className="font-medium text-base cursor-pointer"
            onClick={() => onClick(item.link)}>
            {item.name}
          </div>
          {index !== filteredItems.length - 1 && (
            <Separator
              className="bg-black w-[2px] h-[22px]"
              orientation="vertical"
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default NavMenu;

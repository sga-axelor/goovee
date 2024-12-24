'use client';
import React from 'react';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {Separator} from '@/ui/components/separator';
import {SUBAPP_CODES} from '@/constants';
import {User} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {EVENTS_NAVBAR_LINKS} from '@/subapps/events/common/constants';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

type nav_link = {
  id: number;
  title: string;
  redirectTo: string;
  validate: boolean;
};

export const EventNavbar = ({user}: {user?: User}) => {
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const handleRoute = (redirectTo: string) => {
    router.push(`${workspaceURI}/${SUBAPP_CODES.events}${redirectTo}`);
  };

  const filteredLinks = EVENTS_NAVBAR_LINKS.filter(
    link => !(link.validate && !user?.email),
  );

  return (
    <div className="py-4 px-6 bg-white">
      <div className="h-8 flex gap-10 overflow-x-auto items-center justify-end">
        {filteredLinks.map((item: nav_link, i: number) => (
          <React.Fragment key={item.id}>
            <div
              onClick={() => handleRoute(item.redirectTo)}
              className="font-medium text-base cursor-pointer">
              {item.title}
            </div>
            {i !== filteredLinks.length - 1 && (
              <Separator className="bg-black w-[2px]" orientation="vertical" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

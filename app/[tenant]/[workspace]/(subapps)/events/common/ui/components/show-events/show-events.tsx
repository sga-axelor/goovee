'use client';
import Link from 'next/link';

// ---- CORE IMPORTS ---- //
import {PortalWorkspace} from '@/types';
import {SUBAPP_CODES} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import { EventCard} from '@/subapps/events/common/ui/components';
import type {Event} from '@/subapps/events/common/ui/components';

export const ShowEvents = ({
    events = [],
    title = '',
    workspaceURI,
    workspace,
  }: {
    events: Event[];
    title: String;
    workspaceURI: String;
    workspace: PortalWorkspace;
  }) => {
    return (
      <>
        {events.length > 0 && <p className="text-base font-semibold">{title}</p>}
        {events.map((event, i) => (
            <Link
              href={`${workspaceURI}/${SUBAPP_CODES.events}/${event.id}`}
              key={event.id}
              passHref>
              <EventCard event={event}  workspace={workspace} />
            </Link>
          
        ))}
      </>
    );
  };
  
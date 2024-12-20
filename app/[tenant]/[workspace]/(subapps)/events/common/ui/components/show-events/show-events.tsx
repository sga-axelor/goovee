'use client';
import Link from 'next/link';
import {useCallback, useEffect, useState} from 'react';

// ---- CORE IMPORTS ---- //
import {PortalWorkspace} from '@/types';
import {SUBAPP_CODES} from '@/constants';
import {i18n} from '@/lib/core/i18n';
import {useToast} from '@/ui/hooks';
import {Loader} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {EventCard} from '@/subapps/events/common/ui/components';
import type {Event} from '@/subapps/events/common/ui/components';
import {getAllEvents} from '@/subapps/events/common/actions/actions';
import {
  NO_EVENT,
  SEARCHING,
  SOME_WENT_WRONG,
} from '@/subapps/events/common/constants';

export const ShowEvents = ({
  events = [],
  title = '',
  dateOfEvent,
  category,
  searchQuery,
  workspaceURI,
  workspace,
  onlyRegisteredEvent = false,
  pastEvents = false,
  onGoingEvents = false,
  upComingEvents = false,
}: {
  events: Event[];
  title: String;
  dateOfEvent: string;
  category: any[];
  searchQuery: string;
  workspaceURI: String;
  workspace: PortalWorkspace;
  onlyRegisteredEvent?: boolean;
  pastEvents?: boolean;
  onGoingEvents?: boolean;
  upComingEvents?: boolean;
}) => {
  return (
    <>
      {events.length > 0 && <p className="text-base font-semibold">{title}</p>}
      {events.map((event, i) => (
        <Link
          href={`${workspaceURI}/${SUBAPP_CODES.events}/${event.id}`}
          key={event.id}
          passHref>
          <EventCard event={event} workspace={workspace} />
        </Link>
      ))}
    </>
  );
};

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
  const [events, setEvents] = useState<Event[]>([]);
  const [pending, setPending] = useState<boolean>(false);
  const {toast} = useToast();

  const findEvents = useCallback(async () => {
    try {
      setPending(true);
      const response: any = await getAllEvents({
        categories: category,
        search: searchQuery,
        day: new Date(dateOfEvent).getDate() || undefined,
        month: new Date(dateOfEvent).getMonth() + 1 || undefined,
        year: new Date(dateOfEvent).getFullYear() || undefined,
        workspace,
        onlyRegisteredEvent,
        pastEvents,
        onGoingEvents,
        upComingEvents,
      });
      if (response?.error) {
        toast({
          variant: 'destructive',
          description: i18n.get(response.error || SOME_WENT_WRONG),
        });
      }
      setEvents(response?.events || []);
    } catch (error) {
      toast({
        variant: 'destructive',
        description: i18n.get(SOME_WENT_WRONG),
      });
    } finally {
      setPending(false);
    }
  }, [searchQuery, category, dateOfEvent]);

  useEffect(() => {
    findEvents();
  }, [searchQuery, category, dateOfEvent]);

  return (
    <>
      <p className="text-base font-semibold">{title}</p>
      <div className="flex flex-col gap-4">
        {!pending ? (
          events.map((event, i) => (
            <Link
              href={`${workspaceURI}/${SUBAPP_CODES.events}/${event.id}`}
              key={event.id}
              passHref>
              <EventCard event={event} workspace={workspace} />
            </Link>
          ))
        ) : !searchQuery ? (
          <Loader />
        ) : (
          <p className="py-0">{i18n.get(SEARCHING)}</p>
        )}
        {!pending && events.length === 0 && <p>{i18n.get(NO_EVENT)}</p>}
      </div>
    </>
  );
};

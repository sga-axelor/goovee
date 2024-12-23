'use client';

import {useState, useEffect} from 'react';

// ---- CORE IMPORTS ---- //
import {convertDateToISO8601} from '@/utils/date';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {useSearchParams, useToast} from '@/ui/hooks';
import {i18n} from '@/i18n';
import {PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import type {Category, Event} from '@/subapps/events/common/ui/components';
import {
  EventSelector,
  ShowEvents,
  EventSearch,
} from '@/subapps/events/common/ui/components';
import {
  MY_REGISTRATIONS,
  UPCOMING_EVENTS,
  ONGOING_EVETNS,
  PAST_EVENTS,
  LIMIT,
  NO_RESULT_FOUND,
} from '@/subapps/events/common/constants';
import {Pagination} from '@/ui/components';
import {URL_PARAMS} from '@/constants';
import {
  SEARCHING,
  SOME_WENT_WRONG,
} from '@/subapps/events/common/constants';
import {getAllRegisteredEvents} from "@/subapps/events/common/actions/actions";

export const MyRegisteredEvents = ({
  categories,
  category,
  dateOfEvent,
  workspace,
  onlyRegisteredEvent,
  onGoingEvents,
  upcomingEvents,
  pastEvents,
  pageInfo,
  showPastEvents = false,
}: {
  categories: Category[];
  category: any[];
  dateOfEvent: string;
  workspace: PortalWorkspace;
  onlyRegisteredEvent: boolean;
  onGoingEvents: Event[];
  upcomingEvents: Event[];
  pastEvents: Event[];
  pageInfo: any;
  showPastEvents: boolean;
}) => {
  const [search, setSearch] = useState('');
  const [pending, setPending] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string[]>(category);
  const [date, setDate] = useState<Date | undefined>(
    dateOfEvent !== undefined ? new Date(dateOfEvent) : undefined,
  );
  const [page, setPage] = useState<number>(1);

  const [events, setEvents] = useState<any>({
    ongoing: [],
    upcoming: [],
    past: [],
  });
  const [eventPageInfo, setEventPageInfo] = useState<any>();
  const [enablePastEvents, setEnablePastEvents] =
    useState<boolean>(showPastEvents);
  const {update} = useSearchParams();
  const {workspaceURI} = useWorkspace();
  const {toast} = useToast();
  const updateCateg = (category: Category) => {
    const updatedCategories = selectedCategory.some(
      (c: string) => c === category.id,
    )
      ? selectedCategory.filter((i: string) => i !== category.id)
      : [...selectedCategory, category.id];
    update([
      {key: 'category', value: updatedCategories},
      {key: 'page', value: 1},
      {key: 'date', value: convertDateToISO8601(date) || ''},
      {key: 'pastevents', value: enablePastEvents},
    ]);

    setSelectedCategory(updatedCategories);
  };

  const updateDate = (d: Date | undefined) => {
    const newDate = d ? new Date(d) : undefined;
    setDate(newDate);
    update(
      [
        {key: 'category', value: selectedCategory},
        {key: 'page', value: 1},
        {key: 'date', value: convertDateToISO8601(d) || ''},
        {key: 'pastevents', value: enablePastEvents},
      ],
      {scroll: false},
    );
  };

  const handlePreviousPage = () => {
    if (!eventPageInfo?.hasPrev) return;
    if (!search)
      update([
        {
          key: URL_PARAMS.page,
          value: Math.max(Number(eventPageInfo?.page) - 1, 1),
        },
        {key: 'pastevents', value: enablePastEvents},
      ]);
    else setPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (!eventPageInfo?.hasNext) return;
    if (!search)
      update([
        {key: URL_PARAMS.page, value: Number(eventPageInfo?.page) + 1},
        {key: 'pastevents', value: enablePastEvents},
      ]);
    else setPage(prev => prev + 1);
  };

  const handlePage = (page: string | number) => {
    update([
      {key: URL_PARAMS.page, value: page},
      {key: 'pastevents', value: enablePastEvents},
    ]);
  };

  const handleSearch = (searchKey: string) => {
    setPage(1);
    setSearch(searchKey);
  };

  const handleTooglePastEvents = (checked: boolean) => {
    setEnablePastEvents(checked);
    update(
      [
        {key: 'category', value: selectedCategory},
        {key: 'page', value: 1},
        {key: 'date', value: convertDateToISO8601(date) || ''},
        {key: 'pastevents', value: checked},
      ],
      {scroll: false},
    );
  };

  useEffect(() => {
    const findEvents = async () => {
      try {
        setPending(true);
        const response: any = await getAllRegisteredEvents({
          limit: LIMIT,
          page,
          categories: category,
          search,
          day: new Date(dateOfEvent).getDate() || undefined,
          month: new Date(dateOfEvent).getMonth() + 1 || undefined,
          year: new Date(dateOfEvent).getFullYear() || undefined,
          workspace,
          showPastEvents,
        });
        if (response?.error) {
          toast({
            variant: 'destructive',
            description: i18n.get(response.error || SOME_WENT_WRONG),
          });
        }
        if(search){
          setEvents(response?.data?.events);
          setEventPageInfo(response?.data?.pageInfo);
        }else{
      setEvents({
        ongoing: onGoingEvents,
        past: pastEvents,
        upcoming: upcomingEvents,
      });
      setEventPageInfo(pageInfo);
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          description: i18n.get(SOME_WENT_WRONG),
        });
      } finally {
        setPending(false);
      }
    };
    if (search) findEvents();
    else {
      setEvents({
        ongoing: onGoingEvents,
        past: pastEvents,
        upcoming: upcomingEvents,
      });
      setEventPageInfo(pageInfo);
    }
  }, [search, category, dateOfEvent, showPastEvents, pageInfo, page]);

  return (
    <div>
      <div className="py-6 container mx-auto grid grid-cols-1 lg:grid-cols-[24rem_1fr] gap-4 lg:gap-6 mb-16">
        <div>
          <h2 className="text-lg font-semibold text-start mb-4 h-[54px]">
            {i18n.get(MY_REGISTRATIONS)}
          </h2>
          <EventSelector
            selectedCategories={selectedCategory}
            date={date}
            setDate={updateDate}
            updateCateg={updateCateg}
            categories={categories}
            workspace={workspace}
            onlyRegisteredEvent={onlyRegisteredEvent}
            enablePastEvents={enablePastEvents}
            handleToogle={handleTooglePastEvents}
          />
        </div>
        <div>
          <div className="mb-4 h-[54px]">
            <EventSearch handleSearch={handleSearch} />
          </div>
          {search && pending ? (
            <p>{i18n.get(SEARCHING)}</p>
          ) : (
            <div className="flex flex-col space-y-4 w-full">
              <ShowEvents
                title={ONGOING_EVETNS}
                events={events.ongoing}
                workspace={workspace}
                workspaceURI={workspaceURI}
              />
              <ShowEvents
                events={events.upcoming}
                title={UPCOMING_EVENTS}
                workspace={workspace}
                workspaceURI={workspaceURI}
              />
              {showPastEvents && (
                <ShowEvents
                  events={events.past}
                  title={PAST_EVENTS}
                  workspace={workspace}
                  workspaceURI={workspaceURI}
                />
              )}
              <div className="w-full mt-10 flex items-center justify-center ml-auto">
                {eventPageInfo?.pages > 1 && (
                  <Pagination
                    page={eventPageInfo.page}
                    pages={eventPageInfo.pages}
                    disablePrev={!eventPageInfo.hasPrev}
                    disableNext={!eventPageInfo?.hasNext}
                    onPrev={handlePreviousPage}
                    onNext={handleNextPage}
                    onPage={handlePage}
                  />
                )}
                {
                 !pending && eventPageInfo?.count ===0 && <p>{i18n.get(NO_RESULT_FOUND)}</p>
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

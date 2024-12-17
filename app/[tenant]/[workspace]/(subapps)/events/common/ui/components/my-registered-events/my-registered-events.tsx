'use client';

import {useState, useEffect, useCallback} from 'react';

// ---- CORE IMPORTS ---- //
import {convertDateToISO8601} from '@/utils/date';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {Pagination} from '@/ui/components';
import { URL_PARAMS} from '@/constants';
import {useSearchParams} from '@/ui/hooks';
import {i18n} from '@/i18n';
import {PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import type {Event, Category} from '@/subapps/events/common/ui/components';
import {EventSelector, ShowEvents,EventSearch} from '@/subapps/events/common/ui/components';
import {
  MY_REGISTRATIONS,
  SEARCHING,
  UPCOMING_EVENTS,
  ONGOING_EVETNS,
  PAST_EVENTS,
  NO_EVENT,
  NO_EVENT_FOUND_TODAY,
  NO_RESULT_FOUND
} from '@/subapps/events/common/constants';

type PartitionType = {
  upcoming: Event[];
  ongoing: Event[];
  past: Event[];
};

export const MyRegisteredEvents = ({
  categories,
  events,
  category,
  dateOfEvent,
  workspace,
  pageInfo: {page, pages, hasPrev, hasNext} = {},
  onlyRegisteredEvent,
}: {
  categories: Category[];
  events: Event[];
  category: any[];
  dateOfEvent: string;
  workspace: PortalWorkspace;
  pageInfo: any;
  onlyRegisteredEvent: boolean;
}) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searchPending, setSearchPending] = useState<boolean>(false);
  const [partition, setPartition] = useState<PartitionType>({
    upcoming: [],
    ongoing: [],
    past: [],
  });
  const [selectedCategory, setSelectedCategory] = useState<string[]>(category);
  const [date, setDate] = useState<Date | undefined>(
    dateOfEvent !== undefined ? new Date(dateOfEvent) : undefined,
  );
  const {update} = useSearchParams();
  const {workspaceURI} = useWorkspace();

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
      ],
      {scroll: false},
    );
  };

  const handlePreviousPage = () => {
    if (!hasPrev) return;
    update([{key: URL_PARAMS.page, value: Math.max(Number(page) - 1, 1)}]);
  };

  const handleNextPage = () => {
    if (!hasNext) return;
    update([{key: URL_PARAMS.page, value: Number(page) + 1}]);
  };

  const handlePage = (page: string | number) => {
    update([{key: URL_PARAMS.page, value: page}]);
  };

  const handleSearch = (searchKey: string) => {
    setSearch(searchKey);
  };

  const handleResult = (result: []) => {
    setResults(result);
  };
  const handleSearchStatus = (loading: boolean) => {
    setSearchPending(loading);
  };

  useEffect(() => {
    if (search !== '') {
      setPartition(classifyEvents(results));
    } else {
      setPartition(classifyEvents(events));
    }
  }, [search, results, events]);

  const classifyEvents = useCallback(
    (events: Event[]) => {
      const upcoming: Event[] = [];
      const ongoing: Event[] = [];
      const past: Event[] = [];
      const today = new Date();

      events.forEach(event => {
        const startDate = new Date(event.eventStartDateTime);
        const end_date = event.eventAllDay
          ? event.eventStartDateTime
          : event.eventEndDateTime;
        const endDate = new Date(end_date);
        if (startDate > today) {
          upcoming.push(event);
        } else if (startDate <= today && (!endDate || endDate >= today)) {
          ongoing.push(event);
        } else {
          past.push(event);
        }
      });

      return {upcoming, ongoing, past};
    },
    [events],
  );

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
          />
        </div>
        <div>
          <div className="mb-4 h-[54px]">
            <EventSearch
              workspace={workspace}
              search={search}
              handleSearch={handleSearch}
              handleResult={handleResult}
              handleSearchStatus={handleSearchStatus}
            />
          </div>
          <div className="flex flex-col space-y-4 w-full">
            <ShowEvents
              title={ONGOING_EVETNS}
              events={partition.ongoing}
              workspace={workspace}
              workspaceURI={workspaceURI}
            />
            <ShowEvents
              title={UPCOMING_EVENTS}
              events={partition.upcoming}
              workspace={workspace}
              workspaceURI={workspaceURI}
            />
            <ShowEvents
              title={PAST_EVENTS}
              events={partition.past}
              workspace={workspace}
              workspaceURI={workspaceURI}
            />

            {searchPending ? (
              <p>{i18n.get(SEARCHING)}</p>
            ) : (
              search &&
              results.length === 0 && <p>{i18n.get(NO_RESULT_FOUND)}</p>
            )}
            {events && events.length === 0 && (
              <>
                <h5 className="text-lg font-bold">{i18n.get(NO_EVENT)}</h5>
                <p>{i18n.get(NO_EVENT_FOUND_TODAY)}</p>
              </>
            )}
            <div className="w-full mt-10 flex items-center justify-center ml-auto">
              {pages > 1 && (
                <Pagination
                  page={page}
                  pages={pages}
                  disablePrev={!hasPrev}
                  disableNext={!hasNext}
                  onPrev={handlePreviousPage}
                  onNext={handleNextPage}
                  onPage={handlePage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

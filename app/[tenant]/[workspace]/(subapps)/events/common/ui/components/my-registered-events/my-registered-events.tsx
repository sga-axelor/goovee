'use client';

import {useState, useEffect} from 'react';

// ---- CORE IMPORTS ---- //
import {convertDateToISO8601} from '@/utils/date';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {useSearchParams} from '@/ui/hooks';
import {i18n} from '@/locale';
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
  NO_RESULT_FOUND,
} from '@/subapps/events/common/constants';
import {Pagination} from '@/ui/components';
import {URL_PARAMS, DEFAULT_PAGE, KEY} from '@/constants';

export const MyRegisteredEvents = ({
  categories,
  category,
  dateOfEvent,
  query = '',
  workspace,
  onlyRegisteredEvent,
  onGoingEvents,
  upcomingEvents,
  pastEvents,
  pageInfo: {page, pages, hasPrev, hasNext, count} = {},
  showPastEvents = false,
}: {
  categories: Category[];
  category: any[];
  dateOfEvent: string;
  query?: string;
  workspace: PortalWorkspace;
  onlyRegisteredEvent: boolean;
  onGoingEvents: Event[];
  upcomingEvents: Event[];
  pastEvents: Event[];
  pageInfo: any;
  showPastEvents: boolean;
}) => {
  const [search, setSearch] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState<string[]>(category);
  const [date, setDate] = useState<Date | undefined>(
    dateOfEvent !== undefined ? new Date(dateOfEvent) : undefined,
  );
  const [enablePastEvents, setEnablePastEvents] =
    useState<boolean>(showPastEvents);
  const {update} = useSearchParams();
  const {workspaceURI} = useWorkspace();
  const handleCategory = (category: Category) => {
    const updatedCategories = selectedCategory.some(
      (c: string) => c === category.id,
    )
      ? selectedCategory.filter((i: string) => i !== category.id)
      : [...selectedCategory, category.id];
    update([
      {key: URL_PARAMS.category, value: updatedCategories},
      {key: URL_PARAMS.page, value: DEFAULT_PAGE},
      {key: URL_PARAMS.date, value: convertDateToISO8601(date) || ''},
      {key: URL_PARAMS.pastevents, value: enablePastEvents},
      {key: URL_PARAMS.query, value: search},
    ]);

    setSelectedCategory(updatedCategories);
  };

  const updateDate = (d: Date | undefined) => {
    const newDate = d ? new Date(d) : undefined;
    setDate(newDate);
    update(
      [
        {key: URL_PARAMS.category, value: selectedCategory},
        {key: URL_PARAMS.page, value: DEFAULT_PAGE},
        {key: URL_PARAMS.date, value: convertDateToISO8601(d) || ''},
        {key: URL_PARAMS.pastevents, value: enablePastEvents},
        {key: URL_PARAMS.query, value: search},
      ],
      {scroll: false},
    );
  };

  const handlePreviousPage = () => {
    if (!hasPrev) return;
    update([
      {
        key: URL_PARAMS.page,
        value: Math.max(Number(page) - 1, 1),
      },
      {key: URL_PARAMS.pastevents, value: enablePastEvents},
      {key: URL_PARAMS.query, value: search},
    ]);
  };

  const handleNextPage = () => {
    if (!hasNext) return;
    update([
      {key: URL_PARAMS.page, value: Number(page) + 1},
      {key: URL_PARAMS.pastevents, value: enablePastEvents},
      {key: URL_PARAMS.query, value: search},
    ]);
  };

  const handlePage = (page: string | number) => {
    update([
      {key: URL_PARAMS.page, value: page},
      {key: URL_PARAMS.pastevents, value: enablePastEvents},
      {key: URL_PARAMS.query, value: search},
    ]);
  };

  const handleSearch = (searchKey: string) => {
    setSearch(searchKey);
  };

  const handleTooglePastEvents = (checked: boolean) => {
    setEnablePastEvents(checked);
    update(
      [
        {key: URL_PARAMS.category, value: selectedCategory},
        {key: URL_PARAMS.page, value: DEFAULT_PAGE},
        {key: URL_PARAMS.date, value: convertDateToISO8601(date) || ''},
        {key: URL_PARAMS.pastevents, value: checked},
        {key: URL_PARAMS.query, value: search},
      ],
      {scroll: false},
    );
  };

  const updateSearchQuery = () => {
    update(
      [
        {key: URL_PARAMS.category, value: selectedCategory},
        {key: URL_PARAMS.page, value: DEFAULT_PAGE},
        {key: URL_PARAMS.date, value: convertDateToISO8601(date) || ''},
        {key: URL_PARAMS.pastevents, value: enablePastEvents},
        {key: URL_PARAMS.query, value: search},
      ],
      {scroll: false},
    );
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KEY.enter) {
      updateSearchQuery();
    }
  };

  useEffect(() => {
    if (search.length === 0) {
      updateSearchQuery();
    }
  }, [search]);

  return (
    <div>
      <div className="py-6 container mx-auto grid grid-cols-1 lg:grid-cols-[24rem_1fr] gap-4 lg:gap-6 mb-16">
        <div>
          <h2 className="text-lg font-semibold text-start mb-4 h-[3.4rem]">
            {i18n.t(MY_REGISTRATIONS)}
          </h2>
          <EventSelector
            selectedCategories={selectedCategory}
            date={date}
            setDate={updateDate}
            updateCateg={handleCategory}
            categories={categories}
            workspace={workspace}
            onlyRegisteredEvent={onlyRegisteredEvent}
            enablePastEvents={enablePastEvents}
            handleToogle={handleTooglePastEvents}
          />
        </div>
        <div>
          <div className="mb-4 h-[3.4rem]">
            <EventSearch
              search={search}
              handleSearch={handleSearch}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
          <div className="flex flex-col space-y-4 w-full">
            <ShowEvents
              title={ONGOING_EVETNS}
              events={onGoingEvents}
              workspace={workspace}
              workspaceURI={workspaceURI}
            />
            <ShowEvents
              events={upcomingEvents}
              title={UPCOMING_EVENTS}
              workspace={workspace}
              workspaceURI={workspaceURI}
            />
            {showPastEvents && (
              <ShowEvents
                events={pastEvents}
                title={PAST_EVENTS}
                workspace={workspace}
                workspaceURI={workspaceURI}
              />
            )}
            <div className="w-full mt-10 flex items-center justify-center ml-auto">
              {pages > DEFAULT_PAGE && (
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
              {count === 0 && <p>{i18n.t(NO_RESULT_FOUND)}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

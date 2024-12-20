'use client';

import {useState} from 'react';

// ---- CORE IMPORTS ---- //
import {convertDateToISO8601} from '@/utils/date';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {useSearchParams} from '@/ui/hooks';
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
} from '@/subapps/events/common/constants';
import { Pagination } from '@/ui/components';
import { URL_PARAMS } from '@/constants';

export const MyRegisteredEvents = ({
  categories,
  category,
  dateOfEvent,
  workspace,
  onlyRegisteredEvent,
  onGoingEvents,
  upcomingEvents,
  pastEvents,
  pageInfo: {page, pages, hasPrev, hasNext} = {},
}: {
  categories: Category[];
  category: any[];
  dateOfEvent: string;
  workspace: PortalWorkspace;
  onlyRegisteredEvent: boolean;
  onGoingEvents:Event[]
  upcomingEvents:Event[]
  pastEvents:Event[],
  pageInfo: any;
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string[]>(category);
  const [date, setDate] = useState<Date | undefined>(
    dateOfEvent !== undefined ? new Date(dateOfEvent) : undefined,
  );
  const [showPastEvents, setShowPastEvents] = useState<boolean>(false);
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

  const handleTooglePastEvents = () => {
    setShowPastEvents(prev => !prev);
  };

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
            handleToogle={handleTooglePastEvents}
          />
        </div>
        <div>
          <div className="mb-4 h-[54px]">
            <EventSearch handleSearch={handleSearch} />
          </div>
          <div className="flex flex-col space-y-4 w-full">
          <ShowEvents
              title={ONGOING_EVETNS}
              events={onGoingEvents}
              dateOfEvent={dateOfEvent}
              category={category}
              searchQuery={search}
              workspace={workspace}
              workspaceURI={workspaceURI}
            />
          <ShowEvents
                        events={upcomingEvents}

              title={UPCOMING_EVENTS}
              dateOfEvent={dateOfEvent}
              category={category}
              searchQuery={search}
              workspace={workspace}
              workspaceURI={workspaceURI}
              onlyRegisteredEvent={true}
              upComingEvents={true}
            />
            {showPastEvents && (
              <ShowEvents
                events={pastEvents}
                title={PAST_EVENTS}
                dateOfEvent={dateOfEvent}
                category={category}
                searchQuery={search}
                workspace={workspace}
                workspaceURI={workspaceURI}
                onlyRegisteredEvent={true}
                pastEvents={true}
              />
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

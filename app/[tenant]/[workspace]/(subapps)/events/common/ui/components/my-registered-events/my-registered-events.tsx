'use client';

import {useState, useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useSession} from 'next-auth/react';

// ---- CORE IMPORTS ---- //
import {convertDateToISO8601} from '@/utils/date';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {Pagination} from '@/ui/components';
import {IMAGE_URL, SUBAPP_CODES, URL_PARAMS} from '@/constants';
import {useSearchParams, useToast} from '@/ui/hooks';
import {i18n} from '@/i18n';
import {PortalWorkspace} from '@/types';
import {getImageURL} from '@/utils/files';

// ---- LOCAL IMPORTS ---- //
import type {Event, Category} from '@/subapps/events/common/ui/components';
import {EventSelector, EventCard} from '@/subapps/events/common/ui/components';
import {
  MY_REGISTRATIONS,
  FINDING_SEARCH_RESULT,
} from '@/subapps/events/common/constants';
import {EventSearch} from '@/subapps/events/common/ui/components/event-search/event-search';

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
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [searchPending, setSearchPending] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<string[]>(category);
  const [date, setDate] = useState<Date | undefined>(
    dateOfEvent !== undefined ? new Date(dateOfEvent) : undefined,
  );
  const {update} = useSearchParams();
  const {workspaceURI, tenant} = useWorkspace();
  const router = useRouter();

  const {data: session} = useSession();
  const {user} = session || {};

  const imageURL = workspace?.config?.eventHeroBgImage?.id
    ? `url(${getImageURL(workspace.config.eventHeroBgImage.id, tenant)})`
    : IMAGE_URL;
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
      setRegisteredEvents(results);
    } else {
      setRegisteredEvents(events);
    }
  }, [search, results, events]);

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
        <div className="">
          <div className="mb-4 h-[54px]">
            <EventSearch
              workspace={workspace}
              searchKey={'title'}
              search={search}
              handleSearch={handleSearch}
              handleResult={handleResult}
              handleSearchStatus={handleSearchStatus}
            />
          </div>
          <div className="flex flex-col space-y-4 w-full">
            {registeredEvents && registeredEvents.length > 0 ? (
              registeredEvents.map(event => (
                <Link
                  href={`${workspaceURI}/${SUBAPP_CODES.events}/${event.id}`}
                  key={event.id}
                  passHref>
                  <EventCard
                    event={event}
                    key={event.id}
                    workspace={workspace}
                  />
                </Link>
              ))
            ) : searchPending ? (
              <p>{i18n.get(FINDING_SEARCH_RESULT)}</p>
            ) : (
              <>
                <h5 className="text-lg font-bold">{i18n.get('No events')}</h5>
                <p>{i18n.get('There are no events today')}</p>
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

'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {convertDateToISO8601} from '@/utils/date';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {HeroSearch, Search} from '@/ui/components';
import {BANNER_DESCRIPTION, BANNER_TITLES, IMAGE_URL} from '@/constants';
import {useSearchParams} from '@/ui/hooks';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import type {Event, Category} from '@/subapps/events/common/ui/components';
import {
  EventSelector,
  EventCard,
  PaginationControls,
} from '@/subapps/events/common/ui/components';
import {SearchItem} from '@/app/[tenant]/[workspace]/(subapps)/events/common/ui/components';
import {getAllEvents} from '@/subapps/events/common/actions/actions';
import {PortalWorkspace} from '@/types';

export const Events = ({
  limit,
  categories,
  page,
  events,
  category,
  dateOfEvent,
  workspace,
}: {
  limit: number;
  categories: Category[];
  page: number;
  events: Event[];
  category: any[];
  dateOfEvent: string;
  workspace: PortalWorkspace;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string[]>(category);
  const [date, setDate] = useState<Date | undefined>(
    dateOfEvent !== undefined ? new Date(dateOfEvent) : undefined,
  );
  const [currentPage, setCurrentPage] = useState<number>(page);
  const {update} = useSearchParams();
  const {workspaceURI} = useWorkspace();
  const router = useRouter();

  const updatePage = (index: number) => {
    update([{key: 'page', value: index.toString()}]);
    setCurrentPage(index);
  };

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
    setCurrentPage(1);
  };

  const updateDate = (d: Date | undefined) => {
    const newDate = d ? new Date(d) : undefined;
    setDate(newDate);
    update([
      {key: 'category', value: selectedCategory},
      {key: 'page', value: 1},
      {key: 'date', value: convertDateToISO8601(d) || ''},
    ]);
    setCurrentPage(1);
  };

  const hasPagination =
    events.length > 0 &&
    events[0]?._count !== undefined &&
    events[0]._count > limit;

  const handlClick = (id: string | number) => {
    router.push(`${workspaceURI}/events/${id}`);
  };

  const renderSearch = () => (
    <Search
      findQuery={() => getAllEvents({workspace})}
      renderItem={SearchItem}
      searchKey={'eventTitle'}
      onItemClick={handlClick}
    />
  );

  return (
    <>
      <HeroSearch
        title={BANNER_TITLES.events}
        description={BANNER_DESCRIPTION}
        image={IMAGE_URL}
        renderSearch={renderSearch}
      />
      <div className="container py-6 px-4 overflow-hidden flex lg:flex-row flex-col space-y-6 lg:space-y-0 lg:gap-x-6 ">
        <EventSelector
          date={date}
          setDate={updateDate}
          updateCateg={updateCateg}
          categories={categories}
          setCurrentPage={setCurrentPage}
          workspace={workspace}
        />
        <div className="flex flex-col space-y-4 w-full  xl:max-w-[48.938rem]">
          {events && events.length > 0 ? (
            events.map(event => (
              <Link
                href={`${workspaceURI}/events/${event.id}`}
                key={event.id}
                passHref>
                <EventCard event={event} key={event.id} />
              </Link>
            ))
          ) : (
            <>
              <h5 className="text-lg font-bold">{i18n.get('No events')}</h5>
              <p>{i18n.get('There are no events today')}</p>
            </>
          )}
          {hasPagination && (
            <div className="w-full mt-10 flex items-center justify-center ml-auto">
              <PaginationControls
                totalItems={events[0]._count}
                itemsPerPage={limit}
                currentPage={currentPage}
                setCurrentPage={updatePage}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

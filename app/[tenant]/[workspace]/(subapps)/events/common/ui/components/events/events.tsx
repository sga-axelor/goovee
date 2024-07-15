'use client';

import {useState} from 'react';
import Link from 'next/link';

// ---- CORE IMPORTS ---- //
import {convertDateToISO8601} from '@/utils/functions';

// ---- LOCAL IMPORTS ---- //
import type {Event, Category} from '@/app/events/common/ui/components';
import {
  EventSelector,
  EventCard,
  Hero,
  PaginationControls,
} from '@/app/events/common/ui/components';
import {useSearchParams} from '@/app/events/common/ui/hooks';

export const Events = ({
  limit,
  categories,
  page,
  events,
  category,
  dateOfEvent,
}: {
  limit: number;
  categories: Category[];
  page: number;
  events: Event[];
  category: any[];
  dateOfEvent: string;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string[]>(category);
  const [date, setDate] = useState<Date | undefined>(
    dateOfEvent !== undefined ? new Date(dateOfEvent) : undefined,
  );
  const [currentPage, setCurrentPage] = useState<number>(page);
  const {update} = useSearchParams();

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

  return (
    <>
      <Hero />
      <div className="container py-6 px-4 overflow-hidden flex lg:flex-row flex-col space-y-6 lg:space-y-0 lg:gap-x-6 ">
        <EventSelector
          date={date}
          setDate={updateDate}
          updateCateg={updateCateg}
          categories={categories}
          setCurrentPage={setCurrentPage}
        />
        <div className="flex flex-col space-y-4 w-full  xl:max-w-[48.938rem]">
          {events && events.length > 0 ? (
            events.map(event => (
              <Link href={`/events/${event.id}`} key={event.id} passHref>
                <EventCard event={event} key={event.id} />
              </Link>
            ))
          ) : (
            <>
              <h5 className="text-lg font-bold">No events</h5>
              <p>There are no events today</p>
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

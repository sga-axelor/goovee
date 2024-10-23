'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {convertDateToISO8601} from '@/utils/date';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {HeroSearch, Search, Pagination} from '@/ui/components';
import {
  BANNER_DESCRIPTION,
  BANNER_TITLES,
  IMAGE_URL,
  URL_PARAMS,
} from '@/constants';
import {useSearchParams} from '@/ui/hooks';
import {i18n} from '@/lib/i18n';
import {PortalWorkspace} from '@/types';
import {getImageURL} from '@/utils/image';

// ---- LOCAL IMPORTS ---- //
import type {Event, Category} from '@/subapps/events/common/ui/components';
import {EventSelector, EventCard} from '@/subapps/events/common/ui/components';
import {SearchItem} from '@/app/[tenant]/[workspace]/(subapps)/events/common/ui/components';
import {getAllEvents} from '@/subapps/events/common/actions/actions';

export const Events = ({
  limit,
  categories,
  events,
  category,
  dateOfEvent,
  workspace,
  pageInfo: {page, pages, hasPrev, hasNext} = {},
}: {
  limit: number;
  categories: Category[];
  events: Event[];
  category: any[];
  dateOfEvent: string;
  workspace: PortalWorkspace;
  pageInfo: any;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string[]>(category);
  const [date, setDate] = useState<Date | undefined>(
    dateOfEvent !== undefined ? new Date(dateOfEvent) : undefined,
  );
  const {update} = useSearchParams();
  const {workspaceURI} = useWorkspace();
  const router = useRouter();

  const imageURL = workspace?.config?.eventHeroBgImage?.id
    ? `url(${getImageURL(workspace.config.eventHeroBgImage.id)})`
    : IMAGE_URL;

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
    update([
      {key: 'category', value: selectedCategory},
      {key: 'page', value: 1},
      {key: 'date', value: convertDateToISO8601(d) || ''},
    ]);
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

  const handlClick = (id: string | number) => {
    router.push(`${workspaceURI}/events/${id}`);
  };

  const renderSearch = () => (
    <Search
      findQuery={async () => {
        const response = await getAllEvents({workspace});
        if (response) {
          const {events} = response;
          return events;
        }
        return [];
      }}
      renderItem={SearchItem}
      searchKey={'eventTitle'}
      onItemClick={handlClick}
    />
  );

  return (
    <>
      <HeroSearch
        title={
          workspace?.config?.eventHeroTitle || i18n.get(BANNER_TITLES.events)
        }
        description={
          workspace?.config?.eventHeroDescription ||
          i18n.get(BANNER_DESCRIPTION)
        }
        image={imageURL}
        background={workspace?.config?.eventHeroOverlayColorSelect || 'default'}
        blendMode={
          workspace?.config?.eventHeroOverlayColorSelect ? 'overlay' : 'normal'
        }
        renderSearch={renderSearch}
      />

      <div className="container py-6 px-4 overflow-hidden flex lg:flex-row flex-col space-y-6 lg:space-y-0 lg:gap-x-6 mb-16">
        <EventSelector
          date={date}
          setDate={updateDate}
          updateCateg={updateCateg}
          categories={categories}
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
          <div className="w-full mt-10 flex items-center justify-center ml-auto">
            <Pagination
              page={page}
              pages={pages}
              disablePrev={!hasPrev}
              disableNext={!hasNext}
              onPrev={handlePreviousPage}
              onNext={handleNextPage}
              onPage={handlePage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

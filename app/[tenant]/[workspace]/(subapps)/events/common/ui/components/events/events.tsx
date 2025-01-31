'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useSession} from 'next-auth/react';

// ---- CORE IMPORTS ---- //
import {convertDateToISO8601} from '@/utils/date';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {HeroSearch, Search, Pagination} from '@/ui/components';
import {
  BANNER_DESCRIPTION,
  BANNER_TITLES,
  IMAGE_URL,
  SUBAPP_CODES,
  URL_PARAMS,
} from '@/constants';
import {useSearchParams, useToast} from '@/ui/hooks';
import {i18n} from '@/locale';
import {PortalWorkspace} from '@/types';
import {getImageURL} from '@/utils/files';

// ---- LOCAL IMPORTS ---- //
import type {Event, Category} from '@/subapps/events/common/ui/components';
import {EventSelector, EventCard} from '@/subapps/events/common/ui/components';
import {SearchItem} from '@/app/[tenant]/[workspace]/(subapps)/events/common/ui/components';
import {getAllEvents} from '@/subapps/events/common/actions/actions';

export const Events = ({
  categories,
  events,
  category,
  dateOfEvent,
  workspace,
  pageInfo: {page, pages, hasPrev, hasNext} = {},
}: {
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
  const {workspaceURI, tenant} = useWorkspace();
  const router = useRouter();

  const {data: session} = useSession();
  const {user} = session || {};

  const imageURL = workspace?.config?.eventHeroBgImage?.id
    ? `url(${getImageURL(workspace.config.eventHeroBgImage.id, tenant, {noimage: true})})`
    : IMAGE_URL;
  const {toast} = useToast();

  const updateCateg = (category: Category) => {
    const updatedCategories = selectedCategory.some(
      (c: string) => c === category.id,
    )
      ? selectedCategory.filter((i: string) => i !== category.id)
      : [...selectedCategory, category.id];
    update(
      [
        {key: 'category', value: updatedCategories},
        {key: 'page', value: 1},
        {key: 'date', value: convertDateToISO8601(date) || ''},
      ],
      {scroll: false},
    );

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

  const handlClick = (slug: string | number) => {
    router.push(`${workspaceURI}/${SUBAPP_CODES.events}/${slug}`);
  };
  const renderSearch = () => (
    <Search
      findQuery={async () => {
        try {
          const response: any = await getAllEvents({workspace, user});
          if (response?.error) {
            toast({
              variant: 'destructive',
              description: i18n.t(
                response.error || 'Something went wrong while searching!',
              ),
            });
            return [];
          }

          return response.events || [];
        } catch (error) {
          toast({
            variant: 'destructive',
            description: i18n.t('Something went wrong while searching!'),
          });
          return [];
        }
      }}
      renderItem={SearchItem}
      searchKey="eventTitle"
      onItemClick={handlClick}
    />
  );

  return (
    <>
      <HeroSearch
        title={
          workspace?.config?.eventHeroTitle || i18n.t(BANNER_TITLES.events)
        }
        description={
          workspace?.config?.eventHeroDescription || i18n.t(BANNER_DESCRIPTION)
        }
        image={imageURL}
        background={workspace?.config?.eventHeroOverlayColorSelect || 'default'}
        blendMode={
          workspace?.config?.eventHeroOverlayColorSelect ? 'overlay' : 'normal'
        }
        renderSearch={renderSearch}
        tenantId={tenant}
      />
      <div className="py-6 container mx-auto grid grid-cols-1 lg:grid-cols-[24rem_1fr] gap-4 lg:gap-6 mb-16">
        <EventSelector
          selectedCategories={selectedCategory}
          date={date}
          setDate={updateDate}
          updateCateg={updateCateg}
          categories={categories}
          workspace={workspace}
        />
        <div className="flex flex-col space-y-4 w-full">
          {events && events.length > 0 ? (
            events.map(event => (
              <Link
                href={`${workspaceURI}/${SUBAPP_CODES.events}/${event.slug}`}
                key={event.slug}
                passHref>
                <EventCard event={event} key={event.id} workspace={workspace} />
              </Link>
            ))
          ) : (
            <>
              <h5 className="text-lg font-bold">{i18n.t('No events')}</h5>
              <p>{i18n.t('There are no events today')}</p>
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
    </>
  );
};

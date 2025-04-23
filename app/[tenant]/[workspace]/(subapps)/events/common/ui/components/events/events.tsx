'use client';

import {endOfDay, isPast, isToday} from 'date-fns';
import Link from 'next/link';
import {useMemo, useState} from 'react';

// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {SUBAPP_CODES, URL_PARAMS} from '@/constants';
import {i18n} from '@/locale';
import {PortalWorkspace} from '@/types';
import {Pagination} from '@/ui/components';
import {useResponsive, useSearchParams} from '@/ui/hooks';
import {convertDateToISO8601} from '@/utils/date';

// ---- LOCAL IMPORTS ---- //
import {EVENT_TAB_ITEMS, EVENT_TYPE} from '@/subapps/events/common/constants';
import type {Category, ListEvent} from '@/subapps/events/common/ui/components';
import {
  EventCard,
  EventSelector,
  TabsList,
} from '@/subapps/events/common/ui/components';
import {getTabItems} from '@/subapps/events/common/utils';

type TabItem = (typeof EVENT_TAB_ITEMS)[number];
export const EventCalendar = ({
  categories,
  category,
  dateOfEvent,
  workspace,
  onlyRegisteredEvent,
  tabs,
}: {
  categories: Category[];
  category: any[];
  dateOfEvent: string;
  workspace: PortalWorkspace;
  onlyRegisteredEvent?: boolean;
  tabs: {id: string; title: string; label: string}[];
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string[]>(category);
  const [date, setDate] = useState<Date | undefined>(
    dateOfEvent !== undefined ? new Date(dateOfEvent) : undefined,
  );
  const {update} = useSearchParams();

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
    const toUpdate = [
      {key: 'category', value: selectedCategory},
      {key: 'page', value: 1},
      {key: 'date', value: convertDateToISO8601(d) || ''},
    ];
    if (newDate) {
      toUpdate.push({
        key: 'type',
        value: isPast(endOfDay(newDate))
          ? EVENT_TYPE.PAST
          : tabs.find(t => t.label === EVENT_TYPE.ACTIVE)
            ? EVENT_TYPE.ACTIVE
            : isToday(newDate)
              ? EVENT_TYPE.ONGOING
              : EVENT_TYPE.UPCOMING,
      });
    }
    update(toUpdate, {scroll: false});
  };

  return (
    <EventSelector
      selectedCategories={selectedCategory}
      date={date}
      setDate={updateDate}
      updateCateg={updateCateg}
      categories={categories}
      workspace={workspace}
      onlyRegisteredEvent={onlyRegisteredEvent}
    />
  );
};

export function EventTabs({
  pageInfo: {page, pages, hasPrev, hasNext} = {},
  events,
  eventType,
  tabs,
}: {
  pageInfo: any;
  events: ListEvent[];
  eventType: string;
  tabs: {id: string; title: string; label: string}[];
}) {
  const res: any = useResponsive();
  const large = ['md', 'lg', 'xl', 'xxl'].some(x => res[x]);
  const {update} = useSearchParams();
  const {workspaceURI} = useWorkspace();

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

  const TAB_ITEMS = useMemo(() => getTabItems(tabs, large), [tabs, large]);

  const handleTabChange = (t: TabItem) => {
    update([{key: 'type', value: t.label}]);
  };
  return (
    <TabsList
      activeTab={TAB_ITEMS.find(item => item.label === eventType)!.id}
      items={TAB_ITEMS}
      onTabChange={handleTabChange}
      controlled>
      <>
        <div className="flex flex-col space-y-4 w-full">
          {events.length ? (
            events.map((event, i) => (
              <Link
                href={`${workspaceURI}/${SUBAPP_CODES.events}/${event.slug}`}
                key={event.slug}
                passHref>
                <EventCard event={event} key={event.id} />
              </Link>
            ))
          ) : (
            <>
              <h5 className="text-lg font-bold">{i18n.t('No events')}</h5>
              <p>{i18n.t('There are no events')}</p>
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
      </>
    </TabsList>
  );
}

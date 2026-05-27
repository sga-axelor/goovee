import {notFound} from 'next/navigation';
import type {Cloned} from '@/types/util';
import {Suspense} from 'react';

// ---- CORE IMPORTS ----//
import {getSession} from '@/auth';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {manager} from '@/tenant';
import type {Client} from '@/goovee/.generated/client';
import {User} from '@/types';
import {PortalWorkspace} from '@/orm/workspace';
import {Card} from '@/ui/components';
import {t} from '@/locale/server';
import type {PageInfo} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {
  EVENT_TYPE,
  LIMIT,
  MY_REGISTRATION_TAB_ITEMS,
  MY_REGISTRATIONS,
} from '@/subapps/events/common/constants';
import {findEvents} from '@/subapps/events/common/orm/event';
import {findEventCategories} from '@/subapps/events/common/orm/event-category';
import type {ListEvent, Category} from '@/subapps/events/common/types';
import {
  EventCalendar,
  EventCardSkeleton,
  EventCategoryList,
  EventCategorySkeleton,
  EventCollapsible,
  EventSearch,
  EventTabs,
  EventTabsContent,
} from '@/subapps/events/common/ui/components';

export default async function Page(props: {
  params: Promise<{tenant: string; workspace: string}>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const page = [searchParams?.page].flat()[0] || 1;
  const query = [searchParams?.query].flat()[0] || '';
  const categoryIds = searchParams?.category
    ? Array.isArray(searchParams.category)
      ? searchParams.category
      : [searchParams.category]
    : [];

  const date = [searchParams?.date].flat()[0];
  const type = [searchParams?.type].flat()[0] || EVENT_TYPE.UPCOMING;

  if (!MY_REGISTRATION_TAB_ITEMS.some(item => item.label === type)) {
    return notFound();
  }

  const {tenant: tenantId} = params;

  const session = await getSession();
  const user = session?.user;

  if (!user) return notFound();

  const {workspaceURL} = workspacePathname(params);

  const tenant = await manager.getTenant(tenantId);
  if (!tenant) return notFound();
  const {client} = tenant;

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    client,
  }).then(clone);

  if (!workspace) {
    return notFound();
  }

  return (
    <main className="w-full">
      <div className="py-6 container mx-auto grid grid-cols-1 lg:grid-cols-[24rem_1fr] gap-4 lg:gap-6 mb-16">
        <div>
          <h2 className="text-lg font-semibold text-start mb-4 h-[3.4rem]">
            {await t(MY_REGISTRATIONS)}
          </h2>
          <Card className="p-4 border-none shadow-none flex flex-col gap-2 md:flex-row lg:flex-col h-fit rounded-2xl">
            <EventCalendar
              dateOfEvent={date ?? ''}
              workspace={workspace}
              tabs={MY_REGISTRATION_TAB_ITEMS}
            />
            <EventCollapsible>
              <Suspense fallback={<EventCategorySkeleton />}>
                <Categories
                  user={user}
                  client={client}
                  workspace={workspace}
                  categoryIds={categoryIds}
                />
              </Suspense>
            </EventCollapsible>
          </Card>
        </div>
        <div>
          <div className="mb-4 h-[3.4rem]">
            <EventSearch query={query} />
          </div>
          <EventTabs eventType={type} tabs={MY_REGISTRATION_TAB_ITEMS}>
            <Suspense fallback={<EventCardSkeleton />}>
              <EventList
                user={user}
                workspace={workspace}
                client={client}
                type={type}
                page={page}
                date={date ?? ''}
                categoryIds={categoryIds}
                query={query}
              />
            </Suspense>
          </EventTabs>
        </div>
      </div>
    </main>
  );
}

async function Categories({
  workspace,
  user,
  client,
  categoryIds,
}: {
  user?: User;
  client: Client;
  workspace: PortalWorkspace | Cloned<PortalWorkspace>;
  categoryIds: string[];
}) {
  const categories: Cloned<Category>[] = await findEventCategories({
    workspaceURL: workspace.url,
    client,
    user,
  }).then(clone);

  return (
    <EventCategoryList
      categories={categories}
      selectedCategories={categoryIds}
    />
  );
}

async function EventList({
  user,
  workspace,
  client,
  type,
  page,
  date,
  categoryIds,
  query,
}: {
  date: string;
  categoryIds: string[];
  page: string | number;
  user?: User;
  workspace: PortalWorkspace | Cloned<PortalWorkspace>;
  client: Client;
  type: string;
  query: string;
}) {
  const {events, pageInfo}: {events: Cloned<ListEvent>[]; pageInfo: PageInfo} =
    await findEvents({
      limit: LIMIT,
      page: page,
      search: query,
      categoryids: categoryIds,
      day: new Date(date).getDate() || undefined,
      month: new Date(date).getMonth() + 1 || undefined,
      year: new Date(date).getFullYear() || undefined,
      eventType: type,
      workspaceURL: workspace.url,
      client,
      user,
      onlyRegisteredEvent: true,
    }).then(clone);

  return <EventTabsContent pageInfo={pageInfo} events={events} />;
}

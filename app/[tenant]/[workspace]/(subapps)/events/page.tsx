import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ----//
import {getSession} from '@/auth';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import type {PortalWorkspace, User} from '@/types';
import type {Tenant} from '@/lib/core/tenant';

// ---- LOCAL IMPORTS ---- //
import {
  EVENT_TAB_ITEMS,
  EVENT_TYPE,
  LIMIT,
} from '@/subapps/events/common/constants';
import {findEvents} from '@/subapps/events/common/orm/event';
import {findEventCategories} from '@/subapps/events/common/orm/event-category';
import {EventCalendar, EventTabs} from '@/subapps/events/common/ui/components';
import Hero from './hero';
import {Suspense} from 'react';
import {Skeleton} from '@/ui/components/skeleton';

export default async function Page(context: any) {
  const params = context?.params;
  const page = context?.searchParams?.page || 1;
  const category = context?.searchParams?.category
    ? Array.isArray(context?.searchParams?.category)
      ? context?.searchParams?.category
      : [context?.searchParams?.category]
    : [];

  const date = context?.searchParams?.date || undefined;
  const type = context?.searchParams?.type || EVENT_TYPE.ACTIVE;

  if (!EVENT_TAB_ITEMS.some(item => item.label === type)) {
    return notFound();
  }
  const {tenant} = params;

  const session = await getSession();
  const user = session?.user;

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) {
    return notFound();
  }

  return (
    <main className="h-full w-full">
      <Hero workspace={workspace} />
      <div className="py-6 container mx-auto grid grid-cols-1 lg:grid-cols-[24rem_1fr] gap-4 lg:gap-6 mb-16">
        <Suspense fallback={<Skeleton className="h-[437px]" />}>
          <Calendar
            date={date}
            user={user}
            tenant={tenant}
            workspace={workspace}
            category={category}
          />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-[437px]" />}>
          <EventList
            user={user}
            workspace={workspace}
            tenant={tenant}
            type={type}
            page={page}
            date={date}
            category={category}
          />
        </Suspense>
      </div>
    </main>
  );
}

async function Calendar({
  date,
  workspace,
  user,
  tenant,
  category,
}: {
  date: string;
  user?: User;
  tenant: Tenant['id'];
  workspace: PortalWorkspace;
  category: any[];
}) {
  const categories: any = await findEventCategories({
    workspace,
    tenantId: tenant,
    user,
  }).then(clone);

  return (
    <EventCalendar
      categories={categories}
      category={category}
      dateOfEvent={date}
      workspace={workspace}
    />
  );
}

async function EventList({
  user,
  workspace,
  tenant,
  type,
  page,
  date,
  category,
}: {
  date: string;
  category: any[];
  page: string | number;
  user?: User;
  workspace: PortalWorkspace;
  tenant: Tenant['id'];
  type: string;
}) {
  const {events, pageInfo}: any = await findEvents({
    limit: LIMIT,
    page: page,
    categoryids: category,
    ...(date
      ? {
          day: new Date(date).getDate() || undefined,
          month: new Date(date).getMonth() + 1 || undefined,
          year: new Date(date).getFullYear() || undefined,
        }
      : {eventType: type}),
    workspace,
    tenantId: tenant,
    user,
  }).then(clone);

  return <EventTabs pageInfo={pageInfo} events={events} eventType={type} />;
}

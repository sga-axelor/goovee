import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ----//
import {clone} from '@/utils';
import {getSession} from '@/auth';
import {findWorkspace} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';
import NotFound from '@/app/not-found';

// ---- LOCAL IMPORTS ---- //
import {LIMIT} from '@/subapps/events/common/constants';
import Content from '@/app/[tenant]/[workspace]/(subapps)/events/my-registrations/content';
import {findEventCategories} from '@/subapps/events/common/orm/event-category';
import {getAllRegisteredEvents} from '@/subapps/events/common/actions/actions';

export default async function Page(context: any) {
  const params = context?.params;
  const page = context?.searchParams?.page || 1;
  const showPastEvents = Boolean(context?.searchParams?.pastevents) || false;

  const {tenant} = params;

  const session = await getSession();
  const user = session?.user;

  if (!user?.email) {
    return <NotFound />;
  }

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) {
    return notFound();
  }

  const category = context?.searchParams?.category
    ? Array.isArray(context?.searchParams?.category)
      ? context?.searchParams?.category
      : [context?.searchParams?.category]
    : [];

  const date = context?.searchParams?.date || undefined;

  const categories: any = await findEventCategories({
    workspace,
    tenantId: tenant,
    user,
  }).then(clone);

  const {
    data: {events, pageInfo},
  }: any = await getAllRegisteredEvents({
    limit: LIMIT,
    page: page,
    categories: category,
    day: new Date(date).getDate() || undefined,
    month: new Date(date).getMonth() + 1 || undefined,
    year: new Date(date).getFullYear() || undefined,
    workspace,
    tenantId: tenant,
    showPastEvents,
  }).then(clone);

  return (
    <Content
      category={category}
      categories={categories}
      date={date}
      workspace={workspace}
      onGoingEvents={events.ongoing}
      upcomingEvents={events.upcoming}
      pastEvents={events.past}
      pageInfo={pageInfo}
      showPastEvents={showPastEvents}
    />
  );
}

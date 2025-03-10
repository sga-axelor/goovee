import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ----//
import {clone} from '@/utils';
import {getSession} from '@/auth';
import {findWorkspace} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';
import {DEFAULT_PAGE} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {
  MY_REGISTRATION_TAB_ITEMS,
  LIMIT,
} from '@/subapps/events/common/constants';
import Content from '@/app/[tenant]/[workspace]/(subapps)/events/my-registrations/[type]/content';
import {findEventCategories} from '@/subapps/events/common/orm/event-category';
import {findEvents} from '@/subapps/events/common/orm/event';

export default async function Page(context: any) {
  const params = context?.params;
  const {page = DEFAULT_PAGE, query = ''} = context?.searchParams || {};

  const {tenant, type} = params;

  if (!MY_REGISTRATION_TAB_ITEMS.some(item => item.label === type)) {
    return notFound();
  }

  const session = await getSession();
  const user = session?.user;

  if (!user?.email) {
    return notFound();
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

  const {events, pageInfo}: any = await findEvents({
    limit: LIMIT,
    page: page,
    categoryids: category,
    search: query,
    day: new Date(date).getDate() || undefined,
    month: new Date(date).getMonth() + 1 || undefined,
    year: new Date(date).getFullYear() || undefined,
    workspace,
    tenantId: tenant,
    onlyRegisteredEvent: true,
    eventType: type,
    user,
  }).then(clone);

  return (
    <Content
      category={category}
      categories={categories}
      date={date}
      query={query}
      events={events}
      workspace={workspace}
      pageInfo={pageInfo}
      eventType={type}
    />
  );
}

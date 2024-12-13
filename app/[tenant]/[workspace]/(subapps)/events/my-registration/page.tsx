import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ----//
import {clone} from '@/utils';
import {getSession} from '@/auth';
import {findWorkspace} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import {getAllEvents} from '@/subapps/events/common/actions/actions';
import Content from '@/subapps/events/my-registration/content';
import {LIMIT} from '@/subapps/events/common/constants';
import {findEventCategories} from '@/subapps/events/common/orm/event-category';

export default async function Page(context: any) {
  const params = context?.params;
  const page = context?.searchParams?.page || 1;

  const {tenant} = params;

  const session = await getSession();
  const user = session?.user;

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

  const {events, pageInfo}: any = await getAllEvents({
    limit: LIMIT,
    page: page,
    categories: category,
    day: new Date(date).getDate() || undefined,
    month: new Date(date).getMonth() + 1 || undefined,
    year: new Date(date).getFullYear() || undefined,
    workspace,
    tenantId: tenant,
    onlyRegisteredEvent: true,
  });

  const categories: any = await findEventCategories({
    workspace,
    tenantId: tenant,
    user,
  }).then(clone);

  return (
    <Content
      category={category}
      categories={categories}
      events={events}
      pageInfo={pageInfo}
      date={date}
      workspace={workspace}
    />
  );
}

// ---- CORE IMPORTS ----//
import {findEventCategories} from '@/subapps/events/common/orm/event-category';
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';
import {findWorkspace} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import {Category} from '@/subapps/events/common/ui/components';
import {getAllEvents} from '@/subapps/events/common/actions/actions';
import Content from '@/subapps/events/content';
import {LIMIT} from '@/subapps/events/common/constants';

export default async function Page(context: any) {
  const params = context?.params;
  const page = context?.searchParams?.page || 1;

  const session = await getSession();
  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

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
    workspaceURL,
  });

  const categories: Category[] = await findEventCategories({workspace}).then(
    clone,
  );

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

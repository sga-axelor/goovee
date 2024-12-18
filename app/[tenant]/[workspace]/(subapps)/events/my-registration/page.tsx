import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ----//
import {clone} from '@/utils';
import {getSession} from '@/auth';
import {findWorkspace} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';
import NotFound from '@/app/not-found';

// ---- LOCAL IMPORTS ---- //
import Content from '@/subapps/events/my-registration/content';
import {findEventCategories} from '@/subapps/events/common/orm/event-category';

export default async function Page(context: any) {
  const params = context?.params;

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

  return (
    <Content
      category={category}
      categories={categories}
      date={date}
      workspace={workspace}
    />
  );
}

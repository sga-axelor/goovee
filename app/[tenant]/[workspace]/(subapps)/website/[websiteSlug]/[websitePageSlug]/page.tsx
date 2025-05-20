// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import {findWebsitePageBySlug} from '@/subapps/website/common/orm/website';
import {NotFound} from '@/subapps/website/common/ui/components';
import {getWebsiteComponent} from '@/subapps/website/common/utils/component';
import {clone} from '@/utils';

export async function generateMetadata({
  params,
}: {
  params: {
    tenant: string;
    workspace: string;
    websiteSlug: string;
    websitePageSlug: string;
  };
}) {
  const {workspaceURL} = workspacePathname(params);
  const {tenant, websiteSlug, websitePageSlug} = params;

  const session = await getSession();
  const user = session?.user;

  const websitePage = await findWebsitePageBySlug({
    websiteSlug,
    websitePageSlug,
    workspaceURL,
    user,
    tenantId: tenant,
  });

  if (!websitePage) {
    return null;
  }

  return {
    title: websitePage.seoTitle,
    description: websitePage.seoDescription,
    keywords: websitePage?.seoKeyword?.split(','),
  };
}

export default async function Page({
  params,
}: {
  params: {
    tenant: string;
    workspace: string;
    websiteSlug: string;
    websitePageSlug: string;
  };
}) {
  const {workspaceURL} = workspacePathname(params);
  const {tenant, websiteSlug, websitePageSlug} = params;

  const session = await getSession();
  const user = session?.user;

  const websitePage = await findWebsitePageBySlug({
    websiteSlug,
    websitePageSlug,
    workspaceURL,
    user,
    tenantId: tenant,
  });

  if (!websitePage) {
    return <NotFound />;
  }

  const components = websitePage.contentLines.map(line => {
    if (!line?.content?.component) return;
    const Component = getWebsiteComponent(line.content.component);
    return <Component key={line.id} data={clone(line.content.attrs)} />;
  });

  return <div>{components}</div>;
}

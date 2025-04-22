// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import {findWebsitePageBySlug} from '@/subapps/website/common/orm/website';
import {NotFound} from '@/subapps/website/common/ui/components';

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

  return <div>This is {websitePage.title}</div>;
}

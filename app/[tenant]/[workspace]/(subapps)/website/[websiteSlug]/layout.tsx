import type {ReactNode} from 'react';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {t} from '@/locale/server';
import {workspacePathname} from '@/utils/workspace';
import {Website} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {findWebsiteBySlug} from '@/subapps/website/common/orm/website';
import {NotFound} from '@/subapps/website/common/ui/components';
import {getWebsiteComponent} from '@/subapps/website/common/utils/component';

export async function generateMetadata() {
  return {
    title: await t('Website'),
  };
}

export default async function Layout({
  params,
  children,
}: {
  params: {
    tenant: string;
    workspace: string;
    websiteSlug: Website['slug'];
  };
  children: ReactNode;
}) {
  const session = await getSession();
  const user = session?.user;

  const {tenant, websiteSlug} = params;
  const {workspaceURL} = workspacePathname(params);

  const website = await findWebsiteBySlug({
    websiteSlug,
    workspaceURL,
    user,
    tenantId: tenant,
  });

  if (!website) {
    return <NotFound />;
  }

  const Header = getWebsiteComponent(website.header?.component);
  const Footer = getWebsiteComponent(website.footer?.component);

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

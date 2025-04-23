import {redirect} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {workspacePathname} from '@/utils/workspace';
import {SUBAPP_CODES} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {findAllMainWebsites} from '@/subapps/website/common/orm/website';
import {NotFound} from '@/subapps/website/common/ui/components';
import {headers} from 'next/headers';
import Link from 'next/link';
import {Website} from '@/types';

export default async function Page({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  const {tenant} = params;

  const {workspaceURL} = workspacePathname(params);

  const session = await getSession();

  const user = session?.user;

  let locale = user?.locale;

  if (!locale) {
    const acceptLanguage = (await headers()).get('Accept-Language')!;
    const acceptLanguageLocale = acceptLanguage?.split(',')?.[0];

    if (acceptLanguageLocale) {
      locale = acceptLanguageLocale;
    }
  }

  const mainWebsites = await findAllMainWebsites({
    workspaceURL,
    user,
    tenantId: tenant,
    locale,
  });

  if (!mainWebsites?.length) return <NotFound />;

  const getWebsiteURL = (website: Website) =>
    `${workspaceURL}/${SUBAPP_CODES.website}/${website.slug}`;

  if (mainWebsites.length === 1) {
    return redirect(getWebsiteURL(mainWebsites?.[0]));
  }

  return (
    <>
      {mainWebsites.map((website: any) => (
        <Link key={website.slug} href={getWebsiteURL(website)}>
          <p key={website.slug}>{website.name}</p>
        </Link>
      ))}
    </>
  );
}

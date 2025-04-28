'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {TENANT_HEADER} from '@/middleware';
import {t} from '@/locale/server';
import type {PortalWorkspace, Website, WebsitePage} from '@/types';
import {findSubappAccess} from '@/orm/workspace';
import {SUBAPP_CODES} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {findAllMainWebsiteLanguages, findWebsiteBySlug} from '../orm/website';
import {manager} from '@/tenant';

export async function getLocaleRedirectionURL({
  workspaceURL,
  websiteSlug,
  websitePageSlug,
}: {
  workspaceURL: PortalWorkspace['url'];
  websiteSlug: Website['slug'];
  websitePageSlug: WebsitePage['slug'];
}) {
  const session = await getSession();
  const user = session?.user;

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('Bad request'),
    };
  }

  if (!(workspaceURL && websiteSlug)) {
    return {
      error: true,
      message: await t('Bad request'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.website,
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!subapp)
    return {
      error: true,
      message: await t('Bad request'),
    };

  const website = await findWebsiteBySlug({
    websiteSlug,
    workspaceURL,
    user,
    tenantId,
  });

  if (!website) {
    return {
      error: true,
      message: await t('Bad request'),
    };
  }

  const mainWebsiteLanguages = await findAllMainWebsiteLanguages({
    mainWebsiteId: website?.mainWebsite?.id,
    workspaceURL,
    user,
    tenantId,
  });

  if (!mainWebsiteLanguages?.length) {
    return {
      error: true,
      message: await t('Bad request'),
    };
  }

  const languageListItem = mainWebsiteLanguages?.find(
    (i: any) => i?.website?.slug === websiteSlug,
  );

  if (!languageListItem) {
    return {
      error: true,
      message: await t('Bad request'),
    };
  }

  const {language}: any = languageListItem;

  if (!language) {
    return {
      error: true,
      message: await t('Bad request'),
    };
  }

  const baseURL = `${workspaceURL}/${SUBAPP_CODES.website}/${websiteSlug}`;

  if (websitePageSlug) {
    const client = await manager.getClient(tenantId);
    const websitePage = await client.aOSPortalCmsPage.findOne({
      where: {
        slug: websitePageSlug,
        pageSet: {
          language: {
            code: language.code,
          },
        },
      },
      select: {
        pageSet: true,
      },
    });
    const relatedPage = websitePage?.pageSet?.[0];

    if (relatedPage) {
      return {
        success: true,
        data: {
          url: `${baseURL}/${relatedPage?.slug}`,
        },
      };
    }
  }

  return {
    success: true,
    data: {
      url: `${workspaceURL}/${SUBAPP_CODES.website}/${websiteSlug}`,
    },
  };
}

// ---- CORE IMPORTS ---- //
import {filterPrivate} from '@/orm/filter';
import {manager, type Tenant} from '@/tenant';
import type {PortalWorkspace, User, Website, WebsitePage} from '@/types';

export async function findAllMainWebsites({
  workspaceURL,
  user,
  tenantId,
  locale,
}: {
  workspaceURL: PortalWorkspace['url'];
  user?: User;
  tenantId: Tenant['id'];
  locale?: string;
}) {
  if (!(workspaceURL && tenantId)) {
    return [];
  }

  const client = await manager.getClient(tenantId);

  if (!client) {
    return [];
  }

  const mainWebsites = await client.aOSPortalCmsMainWebsite.find({
    where: {
      workspaceSet: {
        url: workspaceURL,
      },
      defaultWebsite: {
        ...(await filterPrivate({tenantId, user})),
      },
      AND: [{OR: [{archived: false}, {archived: null}]}],
    },
    select: {
      name: true,
      defaultWebsite: {
        slug: true,
      },
      languageList: {
        where: {
          ...(locale
            ? {
                language: {
                  code: locale,
                  isAvailableOnPortal: true,
                },
              }
            : {}),
          website: {
            ...(await filterPrivate({tenantId, user})),
          },
        },
        select: {
          language: true,
          website: {
            slug: true,
          },
        },
      },
    },
  });

  return mainWebsites
    .map((mainWebsite: any) => {
      let $website =
        mainWebsite?.languageList?.[0]?.website || mainWebsite?.defaultWebsite;

      if ($website) {
        $website.name = mainWebsite.name;
      }

      return $website;
    })
    .filter(Boolean);
}

export async function findAllWebsites({
  workspaceURL,
  user,
  tenantId,
}: {
  workspaceURL: PortalWorkspace['url'];
  user?: User;
  tenantId: Tenant['id'];
}) {
  if (!(workspaceURL && tenantId)) {
    return [];
  }

  const client = await manager.getClient(tenantId);

  if (!client) {
    return [];
  }

  const websites = await client.aOSPortalCmsSite.find({
    where: {
      mainWebsite: {
        workspaceSet: {
          url: workspaceURL,
        },
      },
      AND: [
        await filterPrivate({tenantId, user}),
        {OR: [{archived: false}, {archived: null}]},
      ],
    },
    select: {
      slug: true,
    },
  });

  return websites;
}

function buildMenuHierarchy(menulines: any) {
  const map = new Map();

  menulines.forEach((item: any) => {
    item.subMenuList = [];
    map.set(item.id, item);
  });

  // Link submenus to their parent
  menulines.forEach((item: any) => {
    if (item.parentMenu && map.has(item.parentMenu.id)) {
      map.get(item.parentMenu.id).subMenuList.push(item);
    }
  });

  // Filter top-level menu items (no parent)
  return menulines.filter((item: any) => !item.parentMenu);
}

export async function findWebsiteBySlug({
  websiteSlug,
  workspaceURL,
  user,
  tenantId,
}: {
  websiteSlug: Website['slug'];
  workspaceURL: PortalWorkspace['url'];
  user?: User;
  tenantId: Tenant['id'];
}) {
  if (!(websiteSlug && tenantId)) {
    return null;
  }

  const client = await manager.getClient(tenantId);

  if (!client) {
    return null;
  }

  const website = await client.aOSPortalCmsSite.findOne({
    where: {
      slug: websiteSlug,
      mainWebsite: {
        workspaceSet: {
          url: workspaceURL,
        },
      },
      AND: [
        await filterPrivate({tenantId, user}),
        {OR: [{archived: false}, {archived: null}]},
      ],
    },
    select: {
      name: true,
      slug: true,
      isGuestUserAllow: true,
      header: {
        component: true,
      },
      footer: {
        component: true,
      },
      homepage: {
        slug: true,
      },
      menu: {
        title: true,
        component: true,
        language: true,
        menuList: true,
      },
    },
  });

  const isGuest = !user;

  if (isGuest && !website?.isGuestUserAllow) {
    return null;
  }

  if (website?.menu) {
    const menuList = await client.aOSPortalCmsMenuLine.find({
      where: {
        menu: {
          id: website.menu.id,
        },
        page: {
          ...(await filterPrivate({tenantId, user})),
        },
      },
      select: {
        parentMenu: {
          id: true,
        },
      },
    });

    website.menu.menuList = buildMenuHierarchy(menuList);
  }

  return website;
}

export async function findAllWebsitePages({
  websiteSlug,
  workspaceURL,
  user,
  tenantId,
}: {
  websiteSlug: Website['slug'];
  workspaceURL: PortalWorkspace['url'];
  user?: User;
  tenantId: Tenant['id'];
}) {
  if (!(websiteSlug && workspaceURL && tenantId)) {
    return [];
  }

  const client = await manager.getClient(tenantId);

  if (!client) {
    return [];
  }

  const pages = await client.aOSPortalCmsPage.find({
    where: {
      website: {
        slug: websiteSlug,
      },
      AND: [
        await filterPrivate({tenantId, user}),
        {OR: [{archived: false}, {archived: null}]},
      ],
    },
    select: {
      slug: true,
    },
  });

  return pages;
}

export async function findWebsitePageBySlug({
  websiteSlug,
  websitePageSlug,
  workspaceURL,
  user,
  tenantId,
}: {
  websiteSlug: Website['slug'];
  websitePageSlug: WebsitePage['slug'];
  workspaceURL: PortalWorkspace['url'];
  user?: User;
  tenantId: Tenant['id'];
}) {
  if (!(websiteSlug && websitePageSlug && workspaceURL && tenantId)) {
    return null;
  }

  const client = await manager.getClient(tenantId);

  if (!client) {
    return null;
  }

  const page = await client.aOSPortalCmsPage.findOne({
    where: {
      slug: websitePageSlug,
      statusSelect: '1',
      website: {
        slug: websiteSlug,
        mainWebsite: {
          workspaceSet: {
            url: workspaceURL,
          },
        },
      },
      AND: [
        await filterPrivate({tenantId, user}),
        {OR: [{archived: false}, {archived: null}]},
      ],
    },
    select: {
      title: true,
      seoTitle: true,
      seoDescription: true,
      seoKeyword: true,
      contentLines: {
        select: {
          sequence: true,
          content: {
            title: true,
            component: true,
          },
        },
        orderBy: {
          sequence: 'ASC',
        },
      },
    },
  });

  return page;
}

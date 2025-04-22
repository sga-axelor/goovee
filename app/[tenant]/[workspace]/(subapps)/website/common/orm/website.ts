// ---- CORE IMPORTS ---- //
import {filterPrivate} from '@/orm/filter';
import {manager, type Tenant} from '@/tenant';
import type {PortalWorkspace, User, Website, WebsitePage} from '@/types';

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
      workspace: {
        url: workspaceURL,
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
      workspace: {
        url: workspaceURL,
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
    },
  });

  const isGuest = !user;

  if (isGuest && !website?.isGuestUserAllow) {
    return null;
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
        workspace: {
          url: workspaceURL,
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

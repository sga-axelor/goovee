import axios from 'axios';

// ---- CORE IMPORTS ---- //
import {filterPrivate} from '@/orm/filter';
import {manager, type Tenant} from '@/tenant';
import type {
  MainWebsite,
  PortalWorkspace,
  User,
  Website,
  WebsitePage,
} from '@/types';
import {clone} from '@/utils';
import {findModelFields} from '@/orm/model-fields';

type CacheValue = any;

export class Cache {
  private store = new Map<string, CacheValue>();

  set(key: string, value: CacheValue): void {
    this.store.set(key, value);
  }

  get(key: string): CacheValue | undefined {
    return this.store.get(key);
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  keys(): string[] {
    return Array.from(this.store.keys());
  }

  values(): CacheValue[] {
    return Array.from(this.store.values());
  }

  entries(): [string, CacheValue][] {
    return Array.from(this.store.entries());
  }
}

const CONTENT_MODEL = 'com.axelor.apps.portal.db.PortalCmsContent';
const CONTENT_FIELD_NAME = 'attrs';

const FieldType = {
  OneToMany: 'one-to-many',
  ManyToMany: 'many-to-many',
  ManyToOne: 'many-to-one',
  CustomOneToMany: 'json-one-to-many',
  CustomManyToMany: 'json-many-to-many',
  CustomManyToOne: 'json-many-to-one',
};

const RelationalFieldTypes = [
  FieldType.OneToMany,
  FieldType.ManyToMany,
  FieldType.ManyToOne,
];

const CustomRelationalFieldTypes = [
  FieldType.CustomOneToMany,
  FieldType.CustomManyToMany,
  FieldType.CustomManyToOne,
];

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
      mainWebsite: true,
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
            attrs: true,
          },
        },
        orderBy: {
          sequence: 'ASC',
        },
      },
    },
  });

  let contentLines = [];

  if ((page?.contentLines as any)?.length) {
    const fields = await findModelFields({
      tenantId,
      modelName: CONTENT_MODEL,
      modelField: CONTENT_FIELD_NAME,
    });

    contentLines = await populateContent(page?.contentLines, fields, tenantId);
  }

  return {
    ...page,
    contentLines,
  };
}

export async function findAllMainWebsiteLanguages({
  mainWebsiteId,
  workspaceURL,
  user,
  tenantId,
}: {
  mainWebsiteId: MainWebsite['id'];
  workspaceURL: PortalWorkspace['url'];
  user?: User;
  tenantId: Tenant['id'];
}) {
  if (!(mainWebsiteId && workspaceURL && tenantId)) {
    return [];
  }

  const client = await manager.getClient(tenantId);

  if (!client) {
    return [];
  }

  const mainWebsiteLanguages = await client.aOSPortalCmsMainWebsite
    .findOne({
      where: {
        id: mainWebsiteId,
        workspaceSet: {
          url: workspaceURL,
        },
        AND: [{OR: [{archived: false}, {archived: null}]}],
      },
      select: {
        languageList: {
          where: {
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
    })
    .then(clone);

  return mainWebsiteLanguages?.languageList;
}

async function getRelationalFieldTypeData({
  field,
  value,
  modelRecordCache,
  tenantId,
}: any) {
  const targetModel = field?.targetModel;

  if (!targetModel) {
    return value;
  }

  const isManyToOneRelation = value?.id;

  const isToManyRelation = Array.isArray(value);

  if (isToManyRelation || isManyToOneRelation) {
    const ids = isManyToOneRelation
      ? [value.id]
      : isToManyRelation
        ? value.map(({id}) => id)
        : [];

    if (!ids.length) return value;

    const cachedRecords = ids
      .map(id => modelRecordCache.get(`${targetModel}-${id}`))
      .filter(Boolean);

    const cachedIds = cachedRecords.map(r => r.id);

    const difference = (arr1: any, arr2: any) =>
      arr1.filter((item: any) => !arr2.includes(item));

    const uncachedIds = difference(ids, cachedIds);

    let records = await findModelRecords({
      tenantId,
      modelName: targetModel,
      ids: uncachedIds,
    });

    if (records?.length) {
      records.forEach((record: any) => {
        modelRecordCache.set(`${targetModel}-${record.id}`, record);
      });
    }

    records = [...cachedRecords, ...records];

    if (isManyToOneRelation) {
      return records?.[0];
    }

    if (isToManyRelation) {
      return value.map(
        item => records.find((r: any) => r.id == item.id) || item,
      );
    }
  } else {
    return value;
  }
}

async function getCustomRelationalFieldTypeData({
  field,
  value,
  fields,
  modelRecordCache,
  jsonModelCache,
  jsonModelRecordCache,
  tenantId,
}: any) {
  const targetJsonModelName = field?.targetJsonModel;

  if (!targetJsonModelName) {
    return value;
  }

  const isToOneRelation = value?.id;

  const isToManyRelation = Array.isArray(value);

  const client = await manager.getClient(tenantId);

  let targetJsonModel = jsonModelCache.get(targetJsonModelName);

  if (!targetJsonModel) {
    const $targetJsonModel = await client.aOSMetaJsonModel.findOne({
      where: {
        name: targetJsonModelName,
      },
    });

    if (!$targetJsonModel) {
      return value;
    }

    jsonModelCache.set(targetJsonModelName, $targetJsonModel);
    targetJsonModel = $targetJsonModel;
  }

  if (isToManyRelation || isToOneRelation) {
    const ids = isToOneRelation
      ? [value.id]
      : isToManyRelation
        ? value.map(({id}) => id)
        : [];

    if (!ids.length) return value;

    const cachedRecords = ids
      .map(id => jsonModelRecordCache.get(`${targetJsonModelName}-${id}`))
      .filter(Boolean);

    const cachedIds = cachedRecords.map(r => r.id);

    const difference = (arr1: any, arr2: any) =>
      arr1.filter((item: any) => !arr2.includes(item));

    const uncachedIds = difference(ids, cachedIds);

    let records = await client.aOSMetaJsonRecord
      .find({
        where: {
          jsonModel: targetJsonModelName,
          id: {in: uncachedIds},
        },
        select: {
          name: true,
          jsonModel: true,
          createdOn: true,
          updatedOn: true,
          attrs: true,
        },
      })
      .then(records =>
        Promise.all(records.map(async r => ({...r, attrs: await r.attrs}))),
      );

    if (records?.length) {
      records.forEach((record: any) => {
        modelRecordCache.set(`${targetJsonModelName}-${record.id}`, record);
      });
    }

    records = [...cachedRecords, ...records];

    if (isToOneRelation) {
      return records?.[0];
    }

    if (isToManyRelation) {
      return value.map(
        item => records.find((r: any) => r.id == item.id) || item,
      );
    }
  } else {
    return value;
  }
}

async function populateContent(
  contentLines: any,
  fields: any,
  tenantId: Tenant['id'],
) {
  const jsonModelCache = new Cache();
  const jsonModelRecordCache = new Cache();
  const modelRecordCache = new Cache();

  const getField = (fieldName: string) => {
    return fields.find((field: any) => field.name === fieldName);
  };

  const populate = async (line: any) => {
    const attrs = await line.content.attrs;

    if (!attrs) {
      return line;
    }

    const fieldNames = Object.keys(attrs);

    if (!fieldNames?.length) {
      return line;
    }

    const data: Record<string, any> = {};

    for (const fieldName of fieldNames) {
      const value = attrs[fieldName];

      const isPrimitiveType = typeof value !== 'object';

      if (isPrimitiveType) {
        data[fieldName] = value;
        continue;
      }

      const field = getField(fieldName);

      if (!field?.type) {
        data[fieldName] = value;
        continue;
      }

      const type = field.type;
      const isRelationalField = RelationalFieldTypes.includes(type);
      const isCustomRelationalField = CustomRelationalFieldTypes.includes(type);

      let handler;

      if (isRelationalField) {
        handler = getRelationalFieldTypeData;
      } else if (isCustomRelationalField) {
        handler = getCustomRelationalFieldTypeData;
      }

      if (!handler) {
        data[fieldName] = value;
        continue;
      }

      const $value = await handler({
        field,
        value,
        fields,
        modelRecordCache,
        jsonModelCache,
        jsonModelRecordCache,
        tenantId,
      });

      data[fieldName] = $value;
    }

    return data;
  };

  const populatedContentLines = await Promise.allSettled(
    contentLines.map(populate),
  ).then(results => results.map(({value}: any) => value));

  return populatedContentLines;
}

async function findModelRecords({
  tenantId,
  modelName,
  ids,
}: {
  tenantId: Tenant['id'];
  modelName: string;
  ids: string[];
}) {
  const tenant = await manager.getTenant(tenantId);
  const aos = tenant?.config?.aos;

  if (!aos?.url) return [];
  const res = await axios
    .post(
      `${aos.url}/ws/rest/${modelName}/search`,
      {
        data: {
          _domain: 'self.id in :ids',
          _domainContext: {ids},
        },
      },
      {auth: aos.auth},
    )
    .then(res => res?.data)
    .catch(() => console.log('Error with trying to fetch model fields'));

  if (res?.status !== 0 || !res.data) {
    return [];
  }

  return res.data;
}

export async function resolvePromisesDeep(obj: any): Promise<any> {
  if (obj instanceof Promise) {
    return resolvePromisesDeep(await obj);
  }

  if (Array.isArray(obj)) {
    return Promise.all(obj.map(resolvePromisesDeep));
  }

  if (obj && typeof obj === 'object') {
    const entries = await Promise.all(
      Object.entries(obj).map(async ([key, value]) => [
        key,
        await resolvePromisesDeep(value),
      ]),
    );
    return Object.fromEntries(entries);
  }

  return obj;
}

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
import {SUBAPP_CODES} from '@/constants';
import {
  JSON_MODEL_ATTRS,
  RelationalFieldTypes,
  JsonRelationalFieldTypes,
  CONTENT_MODEL,
  CONTENT_MODEL_ATTRS,
} from '../constants';

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
        component: {title: true, code: true},
      },
      footer: {
        component: {title: true, code: true},
      },
      homepage: {
        slug: true,
      },
      menu: {
        title: true,
        component: {title: true, code: true, typeSelect: true},
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
    const menuList = await client.aOSPortalCmsMenuLine
      .find({
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
          page: {
            slug: true,
          },
        },
      })
      .then(lines =>
        lines?.map(line => ({
          ...line,
          page: line?.page && {
            ...line?.page,
            url: `${workspaceURL}/${SUBAPP_CODES.website}/${websiteSlug}/${line?.page?.slug}`,
          },
        })),
      );

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
      isWiki: true,
      title: true,
      seoTitle: true,
      seoDescription: true,
      seoKeyword: true,
      contentLines: {
        select: {
          sequence: true,
          content: {
            title: true,
            component: {title: true, code: true},
            attrs: true,
          },
        },
        orderBy: {sequence: 'ASC'},
      } as {
        select: {
          sequence: true;
          content: {
            title: true;
            component: {title: true; code: true};
            attrs: true;
          };
        };
      },
    },
  });

  let contentLines: (ReplacedContentLine | undefined)[] = [];

  if (page?.contentLines?.length) {
    contentLines = await populateContent(page?.contentLines, tenantId);
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
  modelFieldCache,
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
        Promise.all(
          records.map(async r => {
            const attrs = await r.attrs;
            return {
              ...r,
              attrs: await populateAttributes({
                attributes: attrs,
                modelField: JSON_MODEL_ATTRS,
                jsonModelName: targetJsonModelName,
                tenantId,
                modelFieldCache,
                modelRecordCache,
                jsonModelCache,
                jsonModelRecordCache,
              }),
            };
          }),
        ),
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

type ContentLine = {
  id: string;
  version: number;
  sequence?: number;
  content?: {
    id: string;
    version: number;
    title?: string;
    attrs?: Promise<Record<string, any>>;
    component?: {
      id: string;
      version: number;
      title?: string;
      code?: string;
    };
  };
};

type ReplacedContentLine = {
  id: string;
  version: number;
  sequence?: number;
  content?: {
    attrs?: Record<string, any>;
    id: string;
    version: number;
    title?: string;
    component?: {
      id: string;
      version: number;
      title?: string;
      code?: string;
    };
  };
};

const getModelFields = async ({
  modelName,
  jsonModelName,
  modelField,
  modelFieldCache,
  tenantId,
}: {
  modelName?: string;
  jsonModelName?: string;
  modelField: string;
  modelFieldCache: Cache;
  tenantId: Tenant['id'];
}) => {
  const cacheKey = `${modelName || jsonModelName}-${modelField}`;
  if (modelFieldCache.has(cacheKey)) {
    return modelFieldCache.get(cacheKey);
  }

  const fields = await findModelFields({
    tenantId,
    jsonModelName,
    modelName,
    modelField,
  });

  modelFieldCache.set(cacheKey, fields);
  return fields;
};

const populateAttributes = async ({
  attributes,
  modelName,
  jsonModelName,
  modelField,
  tenantId,
  modelFieldCache,
  modelRecordCache,
  jsonModelCache,
  jsonModelRecordCache,
}: {
  attributes: Record<string, any> | undefined;
  modelName?: string;
  jsonModelName?: string;
  modelField: string;
  tenantId: Tenant['id'];
  modelFieldCache: Cache;
  modelRecordCache: Cache;
  jsonModelCache: Cache;
  jsonModelRecordCache: Cache;
}): Promise<Record<string, any>> => {
  if (!attributes) return {};
  const fieldNames = Object.keys(attributes);

  const data: Record<string, any> = {};

  for (const fieldName of fieldNames) {
    const value = attributes[fieldName];

    const isPrimitiveType = typeof value !== 'object';

    if (isPrimitiveType) {
      data[fieldName] = value;
      continue;
    }

    const fields = await getModelFields({
      modelName,
      jsonModelName,
      modelField,
      modelFieldCache,
      tenantId,
    });

    const field = fields.find((field: any) => field.name === fieldName);

    if (!field?.type) {
      data[fieldName] = value;
      continue;
    }

    const type = field.type;
    const isRelationalField = RelationalFieldTypes.includes(type);
    const isCustomRelationalField = JsonRelationalFieldTypes.includes(type);

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
      modelFieldCache,
      modelRecordCache,
      jsonModelCache,
      jsonModelRecordCache,
      tenantId,
    });

    data[fieldName] = $value;
  }

  return data;
};

async function populateContent(
  contentLines: ContentLine[],
  tenantId: Tenant['id'],
): Promise<(ReplacedContentLine | undefined)[]> {
  const jsonModelCache = new Cache();
  const jsonModelRecordCache = new Cache();
  const modelRecordCache = new Cache();
  const modelFieldCache = new Cache();

  const populatedContentLines = await Promise.allSettled(
    contentLines.map(async line => {
      if (!line.content) return line;
      const attrs = await line.content?.attrs;
      return {
        ...line,
        content: {
          ...line.content,
          attrs: await populateAttributes({
            attributes: attrs,
            modelName: CONTENT_MODEL,
            modelField: CONTENT_MODEL_ATTRS,
            tenantId,
            modelFieldCache,
            modelRecordCache,
            jsonModelCache,
            jsonModelRecordCache,
          }),
        },
      };
    }),
  ).then(results =>
    results.map((result, i) =>
      result.status === 'fulfilled' ? result.value : undefined,
    ),
  );

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

// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {clone} from '@/utils';
import {PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {COLORS, ICONS} from '@/subapps/resources/common/constants';

export async function fetchFolders({
  workspace,
  params,
}: {
  params?: any;
  workspace: PortalWorkspace;
}) {
  if (!workspace) return [];

  const client = await getClient();

  const folders = await client.aOSDMSFile.find({
    where: {
      isDirectory: true,
      workspaceSet: {
        id: workspace?.id,
      },
      ...params?.where,
    },
    select: {
      fileName: true,
      parent: true,
      contentType: true,
      description: true,
    },
    orderBy: {
      updatedOn: 'DESC',
    },
    take: params?.take,
  });

  return folders;
}

export async function fetchLatestFolders({
  workspace,
}: {
  workspace: PortalWorkspace;
}) {
  return fetchFolders({
    workspace,
    params: {
      take: 10,
    },
  });
}

export async function fetchSharedFolders({
  workspace,
  params,
}: {
  workspace: PortalWorkspace;
  params?: any;
}) {
  return fetchFolders({
    workspace,
    params: {
      ...params,
      where: {
        isSharedFolder: true,
        ...params?.where,
      },
    },
  });
}

export async function fetchFiles({
  id,
  workspace,
}: {
  id: string;
  workspace: PortalWorkspace;
}) {
  if (!workspace) {
    return [];
  }

  const client = await getClient();

  const files = await client.aOSDMSFile.find({
    where: {
      isDirectory: {
        ne: true,
      },
      parent: {id},
    },
    select: {
      fileName: true,
      createdBy: true,
      createdOn: true,
      metaFile: true,
    },
  });

  return files;
}

export async function fetchLatestFiles({
  workspace,
}: {
  workspace: PortalWorkspace;
}) {
  if (!workspace) return [];

  const client = await getClient();

  const files = await client.aOSDMSFile.find({
    where: {
      isDirectory: {
        ne: true,
      },
      workspaceSet: {
        id: workspace?.id,
      },
    },
    select: {
      fileName: true,
      createdBy: true,
      createdOn: true,
      metaFile: true,
    },
    orderBy: {
      updatedOn: 'DESC',
    },
    take: 10,
  });

  return files;
}

export async function fetchFile(id: string) {
  const client = await getClient();

  const file = await client.aOSDMSFile.findOne({
    where: {
      id,
    },
    select: {
      fileName: true,
      contentType: true,
      content: true,
      createdBy: true,
      createdOn: true,
      metaFile: true,
    },
  });

  return file;
}

export async function fetchColors() {
  return COLORS;
}

export async function fetchIcons() {
  return ICONS;
}

export async function fetchExplorerCategories({
  workspace,
}: {
  workspace: PortalWorkspace;
}) {
  if (!workspace) return [];

  const client = await getClient();

  const categories = await client.aOSDMSFile
    .find({
      where: {
        isDirectory: true,
        workspaceSet: {
          id: workspace.id,
        },
      },
      select: {
        parent: {
          id: true,
        },
        fileName: true,
      },
    })
    .then(clone);

  const hiearchy = (categories: any) => {
    const map: any = {};
    categories.forEach((category: any) => {
      category.children = [];
      map[category.id] = category;
    });

    categories.forEach((category: any) => {
      const {parent} = category;
      if (parent?.id) {
        map[parent.id].children.push(category);
      }
    });

    const _parent = (category: any, parents: any[] = []) => {
      if (!category._parent) {
        category._parent = [...parents];
      }

      category.children.forEach((child: any) => {
        _parent(child, [...parents, category.id]);
      });
    };

    Object.values(map).map(category => _parent(category));

    return Object.values(map);
  };

  return hiearchy(categories);
}

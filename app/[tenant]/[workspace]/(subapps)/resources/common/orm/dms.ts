import {getClient} from '@/goovee';
import {COLORS, ICONS} from '@/subapps/resources/common/constants';
import {clone} from '@/utils';

export async function fetchLatestFolders() {
  const client = await getClient();

  const latestFolders = await client.aOSDMSFile.find({
    where: {
      isDirectory: true,
    },
    select: {
      fileName: true,
      parent: true,
      contentType: true,
    },
    orderBy: {
      updatedOn: 'DESC',
    },
    take: 10,
  });

  return latestFolders;
}

export async function fetchRootFolders() {
  const client = await getClient();

  const rootFolders = await client.aOSDMSFile.find({
    where: {
      parent: {
        id: null,
      },
      isDirectory: true,
    },
    select: {
      fileName: true,
      parent: true,
      contentType: true,
      children: {
        where: {
          isDirectory: true,
        },
      },
    },
  });

  return rootFolders;
}

export async function fetchFiles(id: string) {
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

export async function fetchLatestFiles() {
  const client = await getClient();

  const files = await client.aOSDMSFile.find({
    where: {
      isDirectory: {
        ne: true,
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

export async function fetchExplorerCategories() {
  const client = await getClient();

  const categories = await client.aOSDMSFile
    .find({
      where: {
        isDirectory: true,
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

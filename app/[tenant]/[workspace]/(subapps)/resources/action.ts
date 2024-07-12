'use server';

// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {clone} from '@/utils';

export async function findDmsFiles({search = ''}: {search: string}) {
  const client = await getClient();

  return client.aOSDMSFile
    .find({
      where: {
        ...(search
          ? {
              fileName: {
                like: `%${search}%`,
              },
            }
          : {}),
      },
      select: {
        fileName: true,
        createdBy: true,
        createdOn: true,
        metaFile: true,
        parent: true,
        isDirectory: true,
      },
    })
    .then(clone);
}

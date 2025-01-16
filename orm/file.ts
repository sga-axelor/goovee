// ---- CORE IMPORTS ---- //
import {manager, type Tenant} from '@/tenant';
import {User} from '@/types';
import {clone} from '@/utils';
import {getTranslation} from '@/i18n/server';
import {filterPrivate} from '@/orm/filter';

export async function findFile({
  tenantId,
  user,
  relatedId,
  relatedModel,
  fileName,
}: {
  tenantId: Tenant['id'];
  relatedId: any;
  relatedModel: string;
  user: User;
  fileName: string;
}) {
  if (!tenantId || !user) {
    return null;
  }

  try {
    const client = await manager.getClient(tenantId);
    if (!client) {
      return null;
    }

    const file = await client.aOSDMSFile
      .findOne({
        where: {
          isDirectory: false,
          relatedId,
          relatedModel,
          parent: {relatedModel},
          fileName: {like: `%${fileName}%`},
          ...(await filterPrivate({tenantId, user})),
        },
        select: {
          fileName: true,
          createdBy: true,
          createdOn: true,
          metaFile: true,
        },
        orderBy: {
          updatedOn: 'DESC',
        } as any,
      })
      .then(clone);
    return {
      success: true,
      data: file,
    };
  } catch (error) {
    console.error('Error while fetching file:', error);

    return {
      error: true,
      message: await getTranslation('An unexpected error occurred'),
    };
  }
}

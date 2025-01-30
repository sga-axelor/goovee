'use server';

import fs from 'fs';
import {headers} from 'next/headers';
import path from 'path';
import {pipeline} from 'stream';
import {promisify} from 'util';
import {revalidatePath} from 'next/cache';

// ---- CORE IMPORTS ---- //
import {t} from '@/locale/server';
import {clone} from '@/utils';
import {ModelMap, SUBAPP_CODES} from '@/constants';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {ID, PortalWorkspace} from '@/types';
import {getSession} from '@/auth';
import {getFileSizeText} from '@/utils/files';
import {getCurrentDateTime} from '@/utils/date';
import {manager} from '@/tenant';
import {TENANT_HEADER} from '@/middleware';
import {filterPrivate} from '@/orm/filter';
import {
  CreateComment,
  CreateCommentPropsSchema,
  FetchComments,
  FetchCommentsPropsSchema,
  isCommentEnabled,
} from '@/comments';
import {zodParseFormData} from '@/utils/formdata';
import {addComment, findComments} from '@/comments/orm';

//----LOCAL IMPORTS -----//
import {
  findGroupById,
  findGroupsByMembers,
  findMemberGroupById,
  findPosts,
} from '@/subapps/forum/common/orm/forum';

interface FileMeta {
  fileName: string;
  filePath: string;
  id: number;
}

interface AttachmentResponse {
  title: string;
  metaFile: FileMeta;
}

const pump = promisify(pipeline);

const storage = process.env.DATA_STORAGE as string;

function extractFileValues(formData: FormData) {
  let values: any = [];

  for (let pair of formData.entries()) {
    let key = pair[0];
    let value = pair[1];

    let index: any = Number(key.match(/\[(\d+)\]/)?.[1]);

    if (Number.isNaN(index)) {
      continue;
    }

    if (!values[index]) {
      values[index] = {};
    }

    let field = key.substring(key.lastIndexOf('[') + 1, key.lastIndexOf(']'));

    if (field === 'title' || field === 'description') {
      values[index][field] = value;
    } else if (field === 'file') {
      values[index][field] =
        value instanceof File ? value : new File([value], 'filename');
    }
  }
  return values;
}

export async function pinGroup({
  isPin,
  id,
  groupID,
  workspaceURL,
}: {
  isPin: boolean;
  id: string;
  groupID: string;
  workspaceURL: string;
}) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required'),
    };
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return {error: true, message: await t('Unauthorized')};
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.forum,
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!subapp) {
    return {error: true, message: await t('Unauthorized')};
  }

  const workspace = await findWorkspace({user, url: workspaceURL, tenantId});

  if (!workspace) {
    return {error: true, message: await t('Invalid workspace')};
  }

  const memberGroup: any = await findMemberGroupById({
    id,
    groupID,
    workspaceID: workspace.id,
    tenantId,
    user,
  });

  if (!memberGroup) {
    return {
      error: true,
      message: await t(memberGroup.message || 'Member group not found.'),
    };
  }

  const client = await manager.getClient(tenantId);
  try {
    const result = await client.aOSPortalForumGroupMember
      .update({
        data: {
          id: memberGroup.id,
          version: memberGroup.version,
          forumGroup: {
            select: {
              id: memberGroup?.forumGroup?.id,
            },
          },
          isPin,
        },
      })
      .then(clone);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.log('error >>>', error);
    return {
      error: true,
      message: await t('Some error occurred'),
    };
  }
}

export async function exitGroup({
  id,
  groupID,
  workspaceURL,
}: {
  id: string;
  groupID: string;
  workspaceURL: string;
}) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required'),
    };
  }

  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return {error: true, message: await t('Unauthorized')};
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.forum,
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!subapp) {
    return {error: true, message: await t('Unauthorized')};
  }

  const workspace = await findWorkspace({user, url: workspaceURL, tenantId});

  if (!workspace) {
    return {error: true, message: await t('Invalid workspace')};
  }

  const memberGroup: any = await findMemberGroupById({
    id,
    groupID,
    workspaceID: workspace.id,
    tenantId,
    user,
  });

  if (!memberGroup) {
    return {
      error: true,
      message: await t(memberGroup.message || 'Member not part of the group'),
    };
  }

  const client = await manager.getClient(tenantId);

  try {
    const result = await client.aOSPortalForumGroupMember
      .delete({
        id: memberGroup.id,
        version: memberGroup.version,
      })
      .then(clone);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.log('error >>>', error);
    return {
      error: true,
      message: await t('Some error occurred'),
    };
  }
}

export async function joinGroup({
  groupID,
  userId,
  workspaceURL,
}: {
  groupID: any;
  userId: string;
  workspaceURL: string;
}) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required'),
    };
  }

  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return {error: true, message: await t('Unauthorized')};
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.forum,
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!subapp) {
    return {error: true, message: await t('Unauthorized')};
  }

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!workspace) {
    return {error: true, message: await t('Invalid workspace')};
  }

  const group = await findGroupById(groupID, workspace.id, tenantId, user);

  if (!group) {
    return {
      error: true,
      message: await t('Member not part of the group'),
    };
  }

  const client = await manager.getClient(tenantId);

  try {
    const result = await client.aOSPortalForumGroupMember
      .create({
        data: {
          forumGroup: {
            select: {
              id: group.id,
            },
          },
          member: {
            select: {id: userId},
          },
          isPin: false,
        },
      })
      .then(clone);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.log('error >>>', error);
    return {
      error: true,
      message: await t('Some error occurred'),
    };
  }
}

export async function addGroupNotification({
  id,
  groupID,
  notificationType,
  workspaceURL,
}: {
  id: string;
  groupID: string;
  notificationType: string;
  workspaceURL: string;
}) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required'),
    };
  }

  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return {error: true, message: await t('Unauthorized')};
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.forum,
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!subapp) {
    return {error: true, message: await t('Unauthorized')};
  }

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!workspace) {
    return {error: true, message: await t('Invalid workspace')};
  }

  const memberGroup: any = await findMemberGroupById({
    id,
    groupID,
    workspaceID: workspace.id,
    tenantId,
    user,
  });

  if (!memberGroup) {
    return {
      error: true,
      message: await t(memberGroup.messgae || 'Member not part of the group'),
    };
  }

  const client = await manager.getClient(tenantId);
  try {
    const response = await client.aOSPortalForumGroupMember
      .update({
        data: {
          id: memberGroup.id,
          version: memberGroup.version,
          notificationSelect: notificationType,
        },
      })
      .then(clone);

    return {success: true, data: response};
  } catch (error) {
    console.log('error >>>', error);
    return {
      error: true,
      message: await t('Some error occurred'),
    };
  }
}

export async function addPost({
  group,
  title,
  content,
  workspaceURL,
  formData,
}: any) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required'),
    };
  }

  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return {error: true, message: await t('Unauthorized')};
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.forum,
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!subapp) {
    return {error: true, message: await t('Unauthorized')};
  }

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!workspace) {
    return {error: true, message: await t('Invalid workspace')};
  }

  const client = await manager.getClient(tenantId);

  let attachmentListArray: {id: number; fileName: string; title: string}[] = [];

  if (formData) {
    if (!fs.existsSync(storage)) {
      fs.mkdirSync(storage, {recursive: true});
    }

    const attachmentResponse = await uploadAttachment(formData);

    if (attachmentResponse.some((item: any) => item.error)) {
      return {
        error: true,
        message: await t('Something went wrong while attachment upload!'),
      };
    }

    attachmentListArray = attachmentResponse.map(
      ({title, metaFile}: AttachmentResponse) => ({
        id: metaFile.id,
        fileName: metaFile.fileName,
        title,
      }),
    );
  }

  const publicationDateTime: any = getCurrentDateTime();

  try {
    const post = await client.aOSPortalForumPost.create({
      select: {
        attachmentList: {select: {metaFile: true}},
      },
      data: {
        postDateT: publicationDateTime,
        createdOn: publicationDateTime,
        forumGroup: {
          where: {
            ...(await filterPrivate({user, tenantId})),
          },
          select: {id: group.id},
        },
        title,
        content,
        author: {select: {id: user.id}},
        attachmentList:
          attachmentListArray.length > 0
            ? {
                create: attachmentListArray.map(item => ({
                  title: item.title,
                  metaFile: {select: {id: item.id}},
                })),
              }
            : [],
      },
    });

    revalidatePath(`${workspaceURL}/${SUBAPP_CODES.forum}`);
    return {success: true, data: clone(post)};
  } catch (error) {
    return {
      error: true,
      message: await t('Failed to create post'),
    };
  }
}

export async function findMedia({
  id,
  workspaceURL,
}: {
  id: ID;
  workspaceURL: string;
}) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required'),
    };
  }

  const session = await getSession();
  const user = session?.user;

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.forum,
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!subapp) {
    return {error: true, message: await t('Unauthorized')};
  }

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!workspace) {
    return {error: true, message: await t('Invalid workspace')};
  }

  const client = await manager.getClient(tenantId);

  return await client.aOSPortalForumPost
    .find({
      where: {
        ...(id
          ? {
              forumGroup: {
                id,
                ...(await filterPrivate({user, tenantId})),
              },
            }
          : {}),
      },
      select: {
        attachmentList: {
          select: {
            title: true,
            metaFile: {
              fileName: true,
              fileType: true,
            },
          },
        },
      },
    })
    .then(clone);
}

export async function fetchPosts({
  sort,
  limit,
  page,
  search = '',
  workspaceURL,
}: {
  sort?: any;
  limit?: number;
  page?: string | number;
  search?: string | undefined;
  workspaceURL: string;
}) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required'),
    };
  }

  const session = await getSession();

  const user = session?.user;

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!workspace) {
    return {error: true, message: await t('Invalid workspace')};
  }

  return await findPosts({
    sort,
    limit,
    page,
    search,
    workspaceID: workspace.id,
    tenantId,
    user,
  }).then(clone);
}

async function uploadAttachment(formData: FormData): Promise<any> {
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required'),
    };
  }

  const client = await manager.getClient(tenantId);

  const values = extractFileValues(formData);

  const getTimestampFilename = (name: string) =>
    `${new Date().getTime()}-${name}`;

  const create = async ({
    file,
    title,
  }: {
    file: any;
    title: string;
  }): Promise<AttachmentResponse> => {
    const name = file.name;
    const timestampFilename = getTimestampFilename(name);

    try {
      await pump(
        file.stream(),
        fs.createWriteStream(path.resolve(storage, timestampFilename)),
      );

      const metaFile: any = await client.aOSMetaFile.create({
        data: {
          fileName: name,
          filePath: timestampFilename,
          fileType: file.type,
          fileSize: file.size,
          sizeText: getFileSizeText(file.size),
        },
      });

      return {
        title,
        metaFile: {
          fileName: metaFile.fileName,
          filePath: metaFile.filePath,
          id: Number(metaFile.id),
        },
      };
    } catch (error) {
      throw new Error('Failed to create meta file');
    }
  };

  try {
    const responses = await Promise.all(
      values.map(({title, file}: any) => create({title, file})),
    );

    return responses;
  } catch (error) {
    console.error('Error processing files:', error);
    return [{error: 'Failed to upload attachments'}];
  }
}

export async function fetchGroupsByMembers({
  id,
  searchKey,
  orderBy,
  workspaceID,
}: {
  id: any;
  searchKey?: string;
  orderBy?: any;
  workspaceID: PortalWorkspace['id'];
}) {
  const tenantId = headers().get(TENANT_HEADER);

  const session = await getSession();

  const user = session?.user;

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required'),
    };
  }

  return await findGroupsByMembers({
    id,
    searchKey,
    orderBy,
    workspaceID,
    tenantId,
    user,
  });
}

export const createComment: CreateComment = async formData => {
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return {error: true, message: await t('Unauthorized')};
  }

  const tenantId = headers().get(TENANT_HEADER);
  if (!tenantId) {
    return {error: true, message: await t('TenantId is required.')};
  }

  const {workspaceURL, ...rest} = zodParseFormData(
    formData,
    CreateCommentPropsSchema,
  );

  const workspace = await findWorkspace({user, url: workspaceURL, tenantId});
  if (!workspace) {
    return {error: true, message: await t('Invalid workspace')};
  }

  const {workspaceUser} = workspace;
  if (!workspaceUser) {
    return {error: true, message: await t('Workspace user is missing')};
  }

  if (!isCommentEnabled({subapp: SUBAPP_CODES.forum, workspace})) {
    return {error: true, message: await t('Comments are not enabled')};
  }

  const modelName = ModelMap[SUBAPP_CODES.forum];
  if (!modelName) {
    return {error: true, message: await t('Invalid model type')};
  }

  const app = await findSubappAccess({
    code: SUBAPP_CODES.forum,
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!app?.installed) {
    return {error: true, message: await t('Unauthorized Access')};
  }

  const {posts = []}: any = await findPosts({
    whereClause: {id: rest.recordId},
    workspaceID: workspace.id,
    tenantId,
    user,
  });

  if (!posts.length) {
    return {error: true, message: await t('Record not found')};
  }

  try {
    const res = await addComment({
      modelName,
      userId: user.id,
      workspaceUserId: workspaceUser.id,
      tenantId,
      commentField: 'note',
      trackingField: 'publicBody',
      subject: `${user.simpleFullName || user.name} added a comment`,
      ...rest,
    });

    return {success: true, data: clone(res)};
  } catch (e) {
    return {
      error: true,
      message:
        e instanceof Error
          ? e.message
          : await t('An unexpected error occurred while fetching comments.'),
    };
  }
};

export const fetchComments: FetchComments = async props => {
  const {workspaceURL, ...rest} = FetchCommentsPropsSchema.parse(props);

  const session = await getSession();
  const user = session?.user;
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {error: true, message: await t('TenantId is required.')};
  }

  const workspace = await findWorkspace({user, url: workspaceURL, tenantId});
  if (!workspace) {
    return {error: true, message: await t('Invalid workspace')};
  }

  if (!isCommentEnabled({subapp: SUBAPP_CODES.forum, workspace})) {
    return {error: true, message: await t('Comments are not enabled')};
  }

  const modelName = ModelMap[SUBAPP_CODES.forum];
  if (!modelName) {
    return {error: true, message: await t('Invalid model type')};
  }

  const app = await findSubappAccess({
    code: SUBAPP_CODES.forum,
    user,
    url: workspaceURL,
    tenantId,
  });
  if (!app?.installed) {
    return {error: true, message: await t('Unauthorized Access')};
  }

  const {posts = []}: any = await findPosts({
    whereClause: {id: rest.recordId},
    workspaceID: workspace.id,
    tenantId,
    user,
  });
  if (!posts.length) {
    return {error: true, message: await t('Record not found')};
  }

  try {
    const data = await findComments({
      modelName,
      tenantId,
      commentField: 'note',
      trackingField: 'publicBody',
      ...rest,
    });
    return {success: true, data: clone(data)};
  } catch (e) {
    return {
      error: true,
      message:
        e instanceof Error
          ? e.message
          : await t('An unexpected error occurred while fetching comments.'),
    };
  }
};

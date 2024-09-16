'use server';

import fs from 'fs';
import path from 'path';
import {pipeline} from 'stream';
import {promisify} from 'util';

// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {i18n} from '@/lib/i18n';
import {clone, getSkipInfo} from '@/utils';
import {ORDER_BY, SUBAPP_CODES} from '@/constants';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {ID, PortalWorkspace} from '@/types';
import {getSession} from '@/orm/auth';
import {getCurrentDateTime} from '@/utils/date';
import {getFileSizeText} from '@/utils/files';

//----LOCAL IMPORTS -----//
import {
  findGroupById,
  findGroupsByMembers,
  findMemberGroupById,
  findPosts,
} from '@/subapps/forum/common/orm/forum';
import {SORT_TYPE} from '@/subapps/forum/common/constants';

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
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return {error: true, message: i18n.get('Unauthorized')};
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.forum,
    user,
    url: workspaceURL,
  });
  if (!subapp) {
    return {error: true, message: i18n.get('Unauthorized')};
  }

  const workspace = await findWorkspace({user, url: workspaceURL});
  if (!workspace) {
    return {error: true, message: i18n.get('Invalid workspace')};
  }

  const memberGroup: any = await findMemberGroupById({
    id,
    groupID,
    workspaceID: workspace.id,
  });
  if (!memberGroup) {
    return {
      error: true,
      message: i18n.get(memberGroup.message || 'Member group not found.'),
    };
  }

  const client = await getClient();
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
      message: 'Some error occurred',
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
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return {error: true, message: i18n.get('Unauthorized')};
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.forum,
    user,
    url: workspaceURL,
  });
  if (!subapp) {
    return {error: true, message: i18n.get('Unauthorized')};
  }

  const workspace = await findWorkspace({user, url: workspaceURL});
  if (!workspace) {
    return {error: true, message: i18n.get('Invalid workspace')};
  }
  const memberGroup: any = await findMemberGroupById({
    id,
    groupID,
    workspaceID: workspace.id,
  });

  if (!memberGroup) {
    return {
      error: true,
      message: i18n.get(memberGroup.message || 'Member not part of the group'),
    };
  }

  const client = await getClient();

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
      message: 'Some error occurred',
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
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return {error: true, message: i18n.get('Unauthorized')};
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.forum,
    user,
    url: workspaceURL,
  });
  if (!subapp) {
    return {error: true, message: i18n.get('Unauthorized')};
  }

  const workspace = await findWorkspace({user, url: workspaceURL});
  if (!workspace) {
    return {error: true, message: i18n.get('Invalid workspace')};
  }

  const group = await findGroupById(groupID, workspace.id);
  if (!group) {
    return {
      error: true,
      message: i18n.get('Member not part of the group'),
    };
  }

  const client = await getClient();

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
      message: 'Some error occurred',
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
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return {error: true, message: i18n.get('Unauthorized')};
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.forum,
    user,
    url: workspaceURL,
  });
  if (!subapp) {
    return {error: true, message: i18n.get('Unauthorized')};
  }

  const workspace = await findWorkspace({user, url: workspaceURL});
  if (!workspace) {
    return {error: true, message: i18n.get('Invalid workspace')};
  }
  const memberGroup: any = await findMemberGroupById({
    id,
    groupID,
    workspaceID: workspace.id,
  });
  if (!memberGroup) {
    return {
      error: true,
      message: i18n.get(memberGroup.messgae || 'Member not part of the group'),
    };
  }

  const client = await getClient();
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
      message: 'Some error occurred',
    };
  }
}

export async function addPost({
  postDateT,
  group,
  title,
  content,
  workspaceURL,
  formData,
}: any) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return {error: true, message: i18n.get('Unauthorized')};
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.forum,
    user,
    url: workspaceURL,
  });
  if (!subapp) {
    return {error: true, message: i18n.get('Unauthorized')};
  }

  const workspace = await findWorkspace({user, url: workspaceURL});
  if (!workspace) {
    return {error: true, message: i18n.get('Invalid workspace')};
  }

  const client = await getClient();

  let attachmentListArray: {id: number; fileName: string; title: string}[] = [];

  if (formData) {
    if (!fs.existsSync(storage)) {
      fs.mkdirSync(storage, {recursive: true});
    }

    const attachmentResponse = await uploadAttachment(formData);

    if (attachmentResponse.some((item: any) => item.error)) {
      return {
        error: true,
        message: i18n.get('Something went wrong while attachment upload!'),
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

  try {
    const post = await client.aOSPortalForumPost.create({
      select: {
        attachmentList: {select: {metaFile: true}},
      },
      data: {
        postDateT,
        createdOn: postDateT,
        forumGroup: {select: {id: group.id}},
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

    return {success: true, data: clone(post)};
  } catch (error) {
    return {error: true, message: i18n.get('Failed to create post')};
  }
}

export async function findMedia(id: ID) {
  const client = await getClient();

  return await client.aOSPortalForumPost
    .find({
      where: {
        ...(id
          ? {
              forumGroup: {
                id,
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
  const session = await getSession();
  const user = session?.user;
  const workspace = await findWorkspace({user, url: workspaceURL});

  if (!workspace) {
    return {error: true, message: i18n.get('Invalid workspace')};
  }

  return await findPosts({
    sort,
    limit,
    page,
    search,
    workspaceID: workspace.id,
  }).then(clone);
}

async function uploadAttachment(formData: FormData): Promise<any> {
  const client = await getClient();
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

async function authorizeAndValidate({appCode, workspaceURL}: any) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const subapp = await findSubappAccess({
    code: appCode,
    user,
    url: workspaceURL,
  });

  if (!subapp) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
  });

  if (!workspace) {
    return {
      error: true,
      message: i18n.get('Invalid workspace'),
    };
  }

  return {
    error: false,
  };
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
  return await findGroupsByMembers({
    id,
    searchKey,
    orderBy,
    workspaceID,
  });
}

export async function fetchComments({
  postId,
  limit,
  page,
  sort,
}: {
  postId: string;
  limit?: number;
  page?: number;
  sort?: any;
}) {
  const skip = getSkipInfo(limit, page);
  const client = await getClient();
  try {
    let orderBy: any = null;
    switch (sort) {
      case SORT_TYPE.old:
        orderBy = {
          publicationDateTime: ORDER_BY.ASC,
        };
        break;
      default:
        orderBy = {
          publicationDateTime: ORDER_BY.DESC,
        };
    }

    const comments = await client.aOSPortalComment.find({
      where: {
        forumPost: {
          id: postId,
        },
      },
      orderBy,
      take: limit,
      ...(skip ? {skip} : {}),
      select: {
        id: true,
        contentComment: true,
        publicationDateTime: true,
        author: {
          id: true,
          name: true,
        },
        image: {
          id: true,
        },
        childCommentList: {
          select: {
            contentComment: true,
            publicationDateTime: true,
            author: {
              id: true,
              name: true,
            },
            image: {
              id: true,
            },
          },
        },
      },
    });
    return {success: true, data: clone(comments), total: comments?.[0]?._count};
  } catch (error) {
    return {error: true, message: i18n.get('Something went wromng')};
  }
}

'use server';

import fs from 'fs';
import path from 'path';
import {pipeline} from 'stream';
import {promisify} from 'util';

// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {findWorkspace} from '@/orm/workspace';
import {getCurrentDateTime} from '@/utils/date';
import {getFileSizeText, parseFormData} from '@/utils/files';
import {clone, getSkipInfo} from '@/utils';
import {ID, ModelType, PortalWorkspace} from '@/types';
import {
  COMMENT_TRACKING,
  MAIL_MESSAGE_TYPE,
  ORDER_BY,
  SORT_TYPE,
} from '@/constants';
import {findUserForPartner} from '@/orm/partner';

// ---- LOCAL IMPORTS ---- //
import {findEventByID} from '@/app/[tenant]/[workspace]/(subapps)/events/common/orm/event';
import {findNews} from '@/app/[tenant]/[workspace]/(subapps)/news/common/orm/news';

const pump = promisify(pipeline);

const storage = process.env.DATA_STORAGE as string;

if (!fs.existsSync(storage)) {
  fs.mkdirSync(storage, {recursive: true});
}

const ModelMap: Record<ModelType, String> = {
  [ModelType.forum]: 'forumPost',
  [ModelType.news]: 'portalNews',
  [ModelType.event]: 'portalEvent',
  [ModelType.ticketing]: 'projectTask',
};

export async function upload(formData: FormData, workspaceURL: string) {
  if (!workspaceURL) {
    return {
      error: true,
      message: i18n.get('Workspace not provided.'),
    };
  }

  const client = await getClient();

  const text = formData.get('text');

  if (!text) {
    return {
      error: true,
      message: i18n.get('Text is required'),
    };
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
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

  const parsedFormData = parseFormData(formData);

  const getTimestampFilename = (name: string) => {
    return `${new Date().getTime()}-${name}`;
  };

  const create = async ({file, title, description}: any) => {
    try {
      const name = title || file.name;
      const timestampFilename = getTimestampFilename(name);

      await pump(
        file.stream(),
        fs.createWriteStream(path.resolve(storage, timestampFilename)),
      );

      const metaFile = await client.aOSMetaFile.create({
        data: {
          fileName: name,
          filePath: timestampFilename,
          fileType: file.type,
          fileSize: file.size,
          sizeText: getFileSizeText(file.size),
          description,
        },
      });

      return {
        id: Number(metaFile.id),
      };
    } catch (err) {
      console.error('Error creating file metadata:', err);
      return null;
    }
  };

  try {
    const response = await Promise.all(
      parsedFormData.map(({title, description, file}: any) =>
        create({
          title: title ? `${title}${path.extname(file.name)}` : file.name,
          description,
          file,
        }),
      ),
    );

    return {
      success: true,
      data: clone(response),
    };
  } catch (err) {
    console.error('Error processing attachments:', err);
    return {
      error: true,
      message: i18n.get('An error occurred while processing the attachments.'),
    };
  }
}

export async function addComment({
  type,
  model = null,
  note,
  workspaceURL,
  attachments = [],
  parentId = null,
  relatedModel,
  messageBody,
}: {
  type: ModelType;
  model: {id: string | number} | null;
  workspaceURL: string;
  note?: string;
  attachments?: any;
  parentId?: any;
  relatedModel?: string;
  messageBody?: {
    title: string;
    tracks: any[];
    tags: any[];
  };
}) {
  try {
    const session = await getSession();
    const user = session?.user;
    if (!user) {
      return {
        error: true,
        message: i18n.get('Unauthorized'),
      };
    }
    const aosUser = await findUserForPartner({partnerId: user.id});
    if (!aosUser) {
      return {
        error: true,
        message: i18n.get('Cannot create comment. Configuration Error.'),
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

    if (!model?.id) {
      return {
        error: true,
        message: i18n.get('Model is missing'),
      };
    }

    const {
      error,
      message,
      data: modelRecord,
    }: any = await findByID({
      type,
      id: model?.id,
      workspace,
    });

    if (error) {
      return {
        error: true,
        message: i18n.get(message || 'Record not found.'),
      };
    }

    const client = await getClient();

    let parentComment: any;
    if (parentId) {
      parentComment = await client.aOSComment.findOne({
        where: {
          id: {eq: parentId},
        },
        select: {id: true},
      });
      if (!parentComment) {
        return {
          error: true,
          message: i18n.get('Invalid parent comment Id.'),
        };
      }
    }

    const timestamp = getCurrentDateTime();
    const modelName = ModelMap[type];

    let sequence = 1;

    const highestSequence = await client.aOSComment.findOne({
      where: {
        [modelName as string]: {
          id: model.id,
        },
      },
      orderBy: {
        sequence: ORDER_BY.DESC,
      } as any,
      select: {
        sequence: true,
      },
    });

    if (highestSequence?.sequence) {
      sequence = highestSequence.sequence + 1;
    }

    const response = await client.aOSComment.create({
      data: {
        ...(modelRecord &&
        modelName &&
        (type === ModelType.ticketing ? true : !parentId)
          ? {
              [modelName as string]: {
                select: {
                  id: modelRecord.id,
                },
              },
            }
          : {}),
        ...(parentComment
          ? {parentComment: {select: {id: parentComment.id}}}
          : {}),
        note,
        ...(messageBody
          ? {
              mailMessage: {
                create: {
                  subject: messageBody?.title ?? COMMENT_TRACKING,
                  relatedId: modelRecord.id,
                  type: MAIL_MESSAGE_TYPE,
                  relatedModel,
                  ...(messageBody ? {body: JSON.stringify(messageBody)} : {}),
                  author: {
                    select: {
                      id: aosUser.id,
                    },
                  },
                  createdBy: {
                    select: {
                      id: aosUser.id,
                    },
                  },
                  createdOn: timestamp as unknown as Date,
                },
              },
            }
          : {}),
        ...(attachments?.length > 0 && {
          commentFileList: {
            create: attachments.map((attachment: any) => ({
              description: attachment?.description || '',
              attachmentFile: {
                select: {
                  id: attachment.id,
                },
              },
              createdOn: timestamp,
              updatedOn: timestamp,
            })),
          },
        }),
        isPrivateNote: false,
        sequence,
        createdBy: {
          select: {
            id: aosUser.id,
          },
        },
        createdOn: timestamp as unknown as Date,
        updatedOn: timestamp as unknown as Date,
      },
    });

    return {
      success: true,
      data: clone(response),
    };
  } catch (error) {
    console.log('error >>>', error);
    return {
      error: true,
      message: 'An unexpected error occurred.',
    };
  }
}

export async function findByID({
  type,
  id,
  workspace,
  withAuth = true,
}: {
  type: ModelType;
  id: string | number;
  workspace: PortalWorkspace;
  withAuth?: boolean;
}) {
  if (!type || !id) {
    return {
      error: true,
      message: i18n.get('Missing type or ID'),
    };
  }

  if (!workspace) {
    return {
      error: true,
      message: i18n.get('Invalid workspace'),
    };
  }

  const session = await getSession();
  const user = session?.user;
  if (withAuth) {
    if (!user) {
      return {
        error: true,
        message: i18n.get('Unauthorized'),
      };
    }
  }

  let response: any;

  switch (type) {
    case ModelType.event:
      response = await findEventByID(id);
      break;
    case ModelType.news:
      const {news}: any = await findNews({id, workspace});
      response = news;
      break;
    case ModelType.forum:
      response = {};
      break;
    default:
      return {
        error: true,
        message: i18n.get('Unknown type'),
      };
  }

  return {success: true, data: response};
}

export async function findComments({
  model,
  limit,
  page,
  sort,
  workspaceURL,
  type,
}: {
  model: {id: ID} | null;
  limit?: number;
  page?: number;
  sort?: any;
  workspaceURL: string;
  type: ModelType;
}) {
  const session = await getSession();

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  });

  if (!workspace) {
    return {
      error: true,
      message: i18n.get('Invalid workspace'),
    };
  }

  if (!model?.id) {
    return {
      error: true,
      message: i18n.get('Model is missing'),
    };
  }
  const {
    error,
    message,
    data: modelRecord,
  }: any = await findByID({
    type,
    id: model?.id,
    workspace,
    withAuth: type === ModelType.forum ? false : true,
  });
  if (error) {
    return {
      error: true,
      message: i18n.get(message || 'Record not found.'),
    };
  }

  const skip = getSkipInfo(limit, page);
  const client = await getClient();
  try {
    let orderBy: any = null;
    switch (sort) {
      case SORT_TYPE.old:
        orderBy = {
          createdOn: ORDER_BY.ASC,
        };
        break;
      default:
        orderBy = {
          createdOn: ORDER_BY.DESC,
        };
    }
    const modelName = ModelMap[type];

    const comments = await client.aOSComment.find({
      where: {
        ...(modelRecord && modelName
          ? {
              [modelName as string]: {
                id: modelRecord.id,
              },
            }
          : {}),
        isPrivateNote: false,
        parentComment: {
          id: {
            eq: null,
          },
        },
      },
      orderBy,
      take: limit,
      ...(skip ? {skip} : {}),
      select: {
        id: true,
        note: true,
        mailMessage: {
          body: true,
          relatedId: true,
          relatedModel: true,
          createdOn: true,
          messageContentHtml: true,
          author: {
            id: true,
            name: true,
            partner: {
              picture: true,
              simpleFullName: true,
            },
          },
        },
        childCommentList: {
          where: {
            isPrivateNote: false,
          },
          select: {
            id: true,
            note: true,
            mailMessage: {
              body: true,
              relatedId: true,
              relatedModel: true,
              messageContentHtml: true,
              author: {
                id: true,
                name: true,
                partner: {
                  picture: true,
                  simpleFullName: true,
                },
              },
            },
            createdOn: true,
            createdBy: {
              id: true,
              name: true,
              partner: {
                picture: true,
                simpleFullName: true,
              },
            },
            commentFileList: {
              select: {
                attachmentFile: {
                  id: true,
                  fileName: true,
                },
              },
            },
          },
        },
        commentFileList: {
          select: {
            attachmentFile: {
              id: true,
              fileName: true,
            },
          },
        },
        createdBy: {
          id: true,
          name: true,
          partner: {
            picture: true,
            simpleFullName: true,
          },
        },
      },
    });

    return {
      success: true,
      data: clone(comments),
      total: comments?.[0]?._count || comments?.length,
    };
  } catch (error) {
    return {error: true, message: i18n.get('Something went wromng')};
  }
}

export async function download(record: any, isMeta: boolean = false) {
  if (!record) return null;

  const html =
    record.contentType === 'html' || record?.metaFile?.fileType === 'text/html';

  const link = document.createElement('a');
  const name = record.fileName;

  link.innerHTML = name || 'File';
  link.download = name || 'download';
  link.href = html
    ? await getHTMLURL(record)
    : await getDownloadURL({id: record.id, isMeta});

  Object.assign(link.style, {
    position: 'absolute',
    visibility: 'hidden',
    zIndex: 1000000000,
  });

  document.body.appendChild(link);

  link.onclick = e => {
    setTimeout(() => {
      if (e.target) {
        document.body.removeChild(e.target as any);
      }
    }, 300);
  };

  setTimeout(() => link.click(), 100);
}

export async function getHTMLURL(record: any) {
  const dynamicContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Generated HTML Page</title>
    </head>
    <body>
      <main>
        ${record.content}
      </main>
    </body>
    </html>
  `;

  const blob = new Blob([dynamicContent], {type: 'text/html'});
  const url = URL.createObjectURL(blob);

  return url;
}

export async function getDownloadURL({
  id,
  isMeta = false,
}: {
  id: string;
  isMeta?: boolean;
}) {
  const metaParam = isMeta ? '?meta=true' : '';
  return `${process.env.NEXT_PUBLIC_HOST}/api/download/${id}${metaParam}`;
}

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
import {clone} from '@/utils';
import {ModelType, PortalWorkspace} from '@/types';
import {COMMENT_TRACKING} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {findEventByID} from '@/app/[tenant]/[workspace]/(subapps)/events/common/orm/event';
import {findNews} from '@/app/[tenant]/[workspace]/(subapps)/news/common/orm/news';

const pump = promisify(pipeline);

const storage = process.env.DATA_STORAGE as string;

if (!fs.existsSync(storage)) {
  fs.mkdirSync(storage, {recursive: true});
}

const timestamp = getCurrentDateTime();

const ModelMap: Record<ModelType, String> = {
  [ModelType.forum]: 'forumPost',
  [ModelType.news]: 'portalNews',
  [ModelType.event]: 'portalEvent',
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
  content,
  workspaceURL,
  attachments = [],
  parentId = null,
}: {
  type: ModelType;
  model: {id: string | number} | null;
  workspaceURL: string;
  content: any;
  attachments?: any;
  parentId?: any;
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

    if (!model) {
      return {
        error: true,
        message: i18n.get('Model is missing'),
      };
    }

    const modelRecord: any = await findByID({
      type,
      id: model?.id,
      workspace,
    });

    if (!modelRecord) {
      return {
        error: true,
        message: i18n.get(modelRecord?.message || 'Record not found.'),
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

    const modelName = ModelMap[type];

    const response = await client.aOSComment.create({
      data: {
        ...(modelRecord && modelName && !parentId
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
        mailMessage: {
          create: {
            subject: COMMENT_TRACKING,
            messageContentHtml: content,
            author: {
              select: {
                id: user?.id,
              },
            },
          },
        },
        commentFileList:
          attachments?.length > 0
            ? {
                create: attachments.map((attachment: any) => ({
                  description: attachments?.description || '',
                  attachmentFile: {
                    select: {
                      id: attachment.id,
                    },
                  },
                })),
              }
            : [],
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
}: {
  type: ModelType;
  id: string | number;
  workspace: PortalWorkspace;
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
  if (!user) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
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

  return response;
}

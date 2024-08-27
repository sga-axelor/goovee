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
import {getFileSizeText} from '@/utils/files';
import {clone, extractAttachments} from '@/utils';

const pump = promisify(pipeline);

const storage = process.env.DATA_STORAGE as string;

const timestamp = getCurrentDateTime();

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

  const folder = formData.get('folder');

  if (!folder) {
    return {
      error: true,
      message: i18n.get('Folder is required'),
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

  if (!fs.existsSync(storage)) {
    fs.mkdirSync(storage, {recursive: true});
  }

  const attachments = extractAttachments(formData);

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
      attachments.map(({title, description, file}: any) =>
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
  forumPost = null,
  portalNews = null,
  portalEvent = null,
  workspaceURL,
  subject,
  attachments = [],
}: {
  forumPost?: any;
  portalNews?: any;
  portalEvent?: any;
  workspaceURL: string;
  subject: any;
  attachments?: any;
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

    const client = await getClient();

    const response = await client.aOSComment.create({
      data: {
        ...(forumPost
          ? {
              forumPost: {
                select: {
                  id: forumPost.id,
                },
              },
            }
          : {}),
        ...(portalNews
          ? {
              portalNews: {
                select: {
                  id: portalNews.id,
                },
              },
            }
          : {}),
        ...(portalEvent
          ? {
              portalEvent: {
                select: {
                  id: portalEvent.id,
                },
              },
            }
          : {}),
        mailMessage: {
          create: {
            subject,
            author: {
              select: {
                id: user?.id,
              },
            },
            authorID: user?.id,
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

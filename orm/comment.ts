import fs from 'fs';
import path from 'path';
import {pipeline} from 'stream';
import {promisify} from 'util';

// ---- CORE IMPORTS ---- //
import {manager, type Tenant} from '@/tenant';
import {i18n} from '@/i18n';
import {getSession} from '@/auth';
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
import {findEventByID} from '@/app/[tenant]/[workspace]/(subapps)/events/common/orm/event';
import {findPosts} from '@/app/[tenant]/[workspace]/(subapps)/forum/common/orm/forum';
import {findNews} from '@/app/[tenant]/[workspace]/(subapps)/news/common/orm/news';
import {findTicketAccess} from '@/app/[tenant]/[workspace]/(subapps)/ticketing/common/orm/tickets';

const pump = promisify(pipeline);

const storage = process.env.DATA_STORAGE as string;

if (!fs.existsSync(storage)) {
  fs.mkdirSync(storage, {recursive: true});
}

const ModelMap: Record<ModelType, string> = {
  [ModelType.forum]: 'com.axelor.apps.portal.db.ForumPost',
  [ModelType.news]: 'com.axelor.apps.portal.db.PortalNews',
  [ModelType.event]: 'com.axelor.apps.portal.db.PortalEvent',
  [ModelType.ticketing]: 'com.axelor.apps.project.db.ProjectTask',
};

export async function getPopularCommentsBySorting({
  page,
  limit,
  workspace,
  modelRecord,
  tenantId,
  modelName,
  type,
}: {
  page?: string | number;
  limit?: number;
  workspace: PortalWorkspace;
  modelRecord: any;
  tenantId: Tenant['id'];
  type: ModelType;
  modelName: string;
}) {
  
  if (!workspace) {
    return {error: true, message: i18n.get('Invalid workspace')};
  }

  if (!tenantId) {
    return {error: true, message: i18n.get('TenantId is required.')};
  }

  const skip = getSkipInfo(limit, page);

  const client = await manager.getClient(tenantId);

  const comments: any = await client.$raw(
    `
 WITH mailMessageFileListData AS (
  SELECT 
    mailMessageFile.related_mail_message AS id,
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'id', mailMessageFile.id,
        'attachmentFile', JSON_BUILD_OBJECT(
          'id', metaFile.id,
          'fileName', metaFile.file_name
        )
      )
    ) AS mailMessageFileList
  FROM base_mail_message_file AS mailMessageFile
  LEFT JOIN meta_file AS metaFile
    ON mailMessageFile.attachment_file = metaFile.id
  GROUP BY mailMessageFile.related_mail_message
),
comments AS (
  SELECT 
    mail_message.id AS id,
    mail_message.note AS note,
    mail_message.public_body AS publicBody,
    mail_message.created_on AS createdOn,
    mail_message.is_public_note AS isPublicNote,
    mail_message.parent AS parentComment,
    JSON_BUILD_OBJECT(
      'id', author.id,
      'name', author.name,
      'partner', JSON_BUILD_OBJECT(
        'picture', JSON_BUILD_OBJECT(
          'id', partner.picture
        ),
        'simpleFullName', partner.simple_full_name
      )
    ) AS createdBy
  FROM mail_message
  LEFT JOIN auth_user AS author 
    ON mail_message.author = author.id
  LEFT JOIN base_partner AS partner 
    ON author.partner = partner.id
  WHERE 
    (mail_message.public_body IS NOT NULL OR mail_message.is_public_note = true) 
    AND mail_message.related_model = $4
    AND mail_message.related_id = $1
    ${type === ModelType.forum ? 'AND mail_message.parent_mail_message IS NULL' : ''}
),
childCommentsData AS (
  SELECT 
    childComment.parent_mail_message AS parentId,
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'id', childComment.id,
        'note', childComment.note,
        'publicBody', childComment.public_body,
        'createdOn', childComment.created_on,
        'createdBy', JSON_BUILD_OBJECT(
          'id', childAuthor.id,
          'name', childAuthor.name,
          'partner', JSON_BUILD_OBJECT(
            'picture', JSON_BUILD_OBJECT(
              'id', childPartner.picture
            ),
            'simpleFullName', childPartner.simple_full_name
          )
        ),
        'mailMessageFileList', COALESCE(mf.mailMessageFileList, '[]')
      ) ORDER BY childComment.created_on ASC
    ) AS childMailMessages,
    COUNT(childComment.id) AS childCommentCount
  FROM mail_message AS childComment
  LEFT JOIN auth_user AS childAuthor 
    ON childComment.author = childAuthor.id
  LEFT JOIN base_partner AS childPartner 
    ON childAuthor.partner = childPartner.id
  LEFT JOIN mailMessageFileListData AS mf
    ON childComment.id = mf.id
  WHERE 
    childComment.is_public_note = true 
    AND childComment.related_model = $4
    AND childComment.related_id = $1
  GROUP BY childComment.parent_mail_message
)
SELECT 
  c.id AS id,
  c.note,
  c.createdOn AS "createdOn",
  c.isPublicNote AS "isPublicNote",
  c.createdBy AS "createdBy", 
  COALESCE(mf.mailMessageFileList, '[]') AS "mailMessageFileList",
  COALESCE(cc.childMailMessages, '[]') AS "childMailMessages",
  COALESCE(cc.childCommentCount, 0) AS "childCommentCount",
  COUNT(*) OVER () AS "_count", 
  (SELECT COALESCE(SUM(cc.childCommentCount), 0) FROM childCommentsData cc) AS "_threadCount"
FROM comments AS c
LEFT JOIN childCommentsData AS cc 
  ON c.id = cc.parentId
LEFT JOIN mailMessageFileListData AS mf 
  ON c.id = mf.id
ORDER BY COALESCE(cc.childCommentCount, 0) DESC, c.createdOn DESC 
LIMIT $2
OFFSET $3
    `,
    modelRecord.id,
    limit,
    skip,
    modelName,
  );

  return {
    success: true,
    comments,
    total: Number(comments?.[0]?._count), // only parent comments counts
    totalCommentThreadCount: Number(comments?.[0]?._threadCount), // total count of comments ( parent + child comments )
  };
}

export async function upload(
  formData: FormData,
  workspaceURL: string,
  tenantId: Tenant['id'],
) {
  if (!workspaceURL) {
    return {
      error: true,
      message: i18n.get('Workspace not provided.'),
    };
  }

  if (!tenantId) {
    return {
      error: true,
      message: i18n.get('TenantId is required.'),
    };
  }

  const client = await manager.getClient(tenantId);

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
    tenantId,
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
        description: metaFile.description,
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
  messageBody,
  tenantId,
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
  tenantId: Tenant['id'];
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

    if (!tenantId) {
      return {
        error: true,
        message: i18n.get('TenantId is required.'),
      };
    }

    const aosUser = await findUserForPartner({partnerId: user.id, tenantId});

    if (!aosUser) {
      return {
        error: true,
        message: i18n.get('Cannot create comment. Configuration Error.'),
      };
    }

    const workspace = await findWorkspace({
      user,
      url: workspaceURL,
      tenantId,
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
      tenantId,
    });

    if (error) {
      return {
        error: true,
        message: i18n.get(message || 'Record not found.'),
      };
    }

    const client = await manager.getClient(tenantId);

    let parent;
    if (parentId) {
      parent = await client.aOSMailMessage.findOne({
        where: {
          id: {eq: parentId},
        },
        select: {id: true},
      });
      if (!parent) {
        return {
          error: true,
          message: i18n.get('Invalid parent comment Id.'),
        };
      }
    }

    const timestamp = getCurrentDateTime();
    const modelName = ModelMap[type];

    if (!modelName) {
      return {
        error: true,
        message: i18n.get('Invalid model type'),
      };
    }

    const body = JSON.stringify(messageBody);
    const response = await client.aOSMailMessage.create({
      data: {
        relatedId: modelRecord.id,
        relatedModel: modelName,
        note,
        isPublicNote: true,
        createdOn: timestamp as unknown as Date,
        updatedOn: timestamp as unknown as Date,
        type: MAIL_MESSAGE_TYPE, //TODO: check this later
        ...(parent && {parentMailMessage: {select: {id: parent.id}}}),
        ...(messageBody && {body, publicBody: body}),
        subject: messageBody?.title ?? COMMENT_TRACKING,
        author: {select: {id: aosUser.id}},
        createdBy: {select: {id: aosUser.id}},
        //relatedName: TODO: Add this later
        ...(attachments?.length > 0 && {
          mailMessageFileList: {
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
  tenantId,
}: {
  type: ModelType;
  id: string | number;
  workspace: PortalWorkspace;
  withAuth?: boolean;
  tenantId: Tenant['id'];
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

  if (!tenantId) {
    return {
      error: true,
      message: i18n.get('TenantId is required.'),
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
      response = await findEventByID({id, workspace, tenantId});
      break;
    case ModelType.news:
      const {news}: any = await findNews({id, workspace, tenantId});
      response = news?.[0] || {};
      break;
    case ModelType.forum:
      const {posts = []}: any = await findPosts({
        whereClause: {id},
        workspaceID: workspace.id,
        tenantId,
      });
      response = posts[0];
      break;
    case ModelType.ticketing:
      if (user) {
        response = await findTicketAccess({
          recordId: id,
          userId: user.id,
          workspaceId: workspace.id,
          tenantId,
        });
      }
      if (!response)
        return {
          error: true,
          message: i18n.get('Unauthorized'),
        };
      break;
    default:
      return {
        error: true,
        message: i18n.get('Unknown type'),
      };
  }

  return {success: true, data: response};
}

export type Comment = NonNullable<
  Awaited<ReturnType<typeof findComments>>['data']
>[number];

export async function findComments({
  model,
  limit,
  page,
  sort,
  workspaceURL,
  type,
  tenantId,
}: {
  model: {id: ID} | null;
  limit?: number;
  page?: number;
  sort?: any;
  workspaceURL: string;
  type: ModelType;
  tenantId: Tenant['id'];
}) {
  if (!tenantId) {
    return {
      error: true,
      message: i18n.get('TenantId is required'),
    };
  }

  const session = await getSession();

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId,
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

  const shouldUseAuth = (type: ModelType) =>
    ![ModelType.forum, ModelType.event, ModelType.news].includes(type);

  const {
    error,
    message,
    data: modelRecord,
  }: any = await findByID({
    type,
    id: model?.id,
    workspace,
    withAuth: shouldUseAuth(type),
    tenantId,
  });

  if (error) {
    return {
      error: true,
      message: i18n.get(message || 'Record not found.'),
    };
  }

  const modelName = ModelMap[type];

  if (!modelName) {
    return {
      error: true,
      message: i18n.get('Invalid model type'),
    };
  }

  const skip = getSkipInfo(limit, page);
  const client = await manager.getClient(tenantId);
  try {
    let orderBy: any = null;
    switch (sort) {
      case SORT_TYPE.old:
        orderBy = {
          createdOn: ORDER_BY.ASC,
        };
        break;
      case SORT_TYPE.popular:
        const results: any = await getPopularCommentsBySorting({
          page,
          limit,
          workspace,
          modelRecord,
          tenantId,
          modelName,
          type,
        });
        const {
          comments = [],
          total,
          totalCommentThreadCount,
          success,
        } = results;

        return {
          data: clone(comments),
          total,
          success,
          totalCommentThreadCount,
        };
      default:
        orderBy = {
          createdOn: ORDER_BY.DESC,
        };
    }

    const commentFields = {
      note: true,
      publicBody: true,
      createdOn: true,
      author: {
        id: true,
        name: true,
        partner: {
          picture: true,
          simpleFullName: true,
        },
      },
      mailMessageFileList: {
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
    } as const;

    let comments = await client.aOSMailMessage.find({
      where: {
        relatedId: modelRecord.id,
        relatedModel: modelName,
        OR: [{publicBody: {ne: null}}, {isPublicNote: true}],
        ...(type === ModelType.forum && {parentMailMessage: {id: {eq: null}}}),
      },
      orderBy,
      take: limit,
      ...(skip ? {skip} : {}),
      select: {
        ...commentFields,
        parentMailMessage: commentFields,
        isPublicNote: true,
        childMailMessages: {
          orderBy,
          where: {
            relatedId: modelRecord.id,
            relatedModel: modelName,
            isPublicNote: true,
          },
          select: commentFields,
        } as {select: typeof commentFields},
      },
    });

    comments = comments?.map(comment => {
      if (!comment.isPublicNote) return {...comment, note: undefined};
      return comment;
    });

    const totalCommentThreadCount = await client.aOSMailMessage.count({
      where: {
        relatedId: modelRecord.id,
        relatedModel: modelName,
        OR: [{publicBody: {ne: null}}, {isPublicNote: true}],
      },
    });

    return {
      success: true,
      data: clone(comments),
      total: comments?.[0]?._count || comments?.length,
      totalCommentThreadCount,
    };
  } catch (error) {
    console.log('error >>>', error);
    return {error: true, message: i18n.get('Something went wromng')};
  }
}

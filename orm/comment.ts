import fs from 'fs';
import path from 'path';
import {pipeline} from 'stream';
import {promisify} from 'util';

// ---- CORE IMPORTS ---- //
import {manager, type Tenant} from '@/tenant';
import {t} from '@/locale/server';
import {getSession} from '@/auth';
import {findWorkspace} from '@/orm/workspace';
import {getCurrentDateTime} from '@/utils/date';
import {getFileSizeText, parseFormData} from '@/utils/files';
import {clone, getSkipInfo} from '@/utils';
import {ID, PortalWorkspace} from '@/types';
import {
  MAIL_MESSAGE_TYPE,
  ORDER_BY,
  SORT_TYPE,
  SUBAPP_CODES,
} from '@/constants';
import {findByID} from '@/orm/record';

const pump = promisify(pipeline);

const storage = process.env.DATA_STORAGE as string;

if (!fs.existsSync(storage)) {
  fs.mkdirSync(storage, {recursive: true});
}

const ModelMap: Partial<Record<SUBAPP_CODES, string>> = {
  [SUBAPP_CODES.forum]: 'com.axelor.apps.portal.db.ForumPost',
  [SUBAPP_CODES.news]: 'com.axelor.apps.portal.db.PortalNews',
  [SUBAPP_CODES.events]: 'com.axelor.apps.portal.db.PortalEvent',
  [SUBAPP_CODES.ticketing]: 'com.axelor.apps.project.db.ProjectTask',
  [SUBAPP_CODES.quotations]: 'com.axelor.apps.sale.db.SaleOrder',
};

export async function getPopularCommentsBySorting({
  page,
  limit,
  workspace,
  modelRecord,
  tenantId,
  modelName,
  subapp,
}: {
  page?: string | number;
  limit?: number;
  workspace: PortalWorkspace;
  modelRecord: any;
  tenantId: Tenant['id'];
  subapp: SUBAPP_CODES;
  modelName: string;
}) {
  if (!workspace) {
    return {error: true, message: await t('Invalid workspace')};
  }

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required.'),
    };
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
    ${subapp === SUBAPP_CODES.forum ? 'AND mail_message.parent_mail_message IS NULL' : ''}
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
      message: await t('Workspace not provided.'),
    };
  }

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required.'),
    };
  }

  const client = await manager.getClient(tenantId);

  const text = formData.get('text');

  if (!text) {
    return {
      error: true,
      message: await t('Text is required'),
    };
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return {
      error: true,
      message: await t('Unauthorized'),
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
      message: await t('Invalid workspace'),
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
      message: await t('An error occurred while processing the attachments.'),
    };
  }
}

export async function addComment({
  subapp,
  model,
  note,
  workspaceURL,
  attachments = [],
  parentId = null,
  messageBody,
  tenantId,
  subject,
  messageType = MAIL_MESSAGE_TYPE.comment,
}: {
  subapp: SUBAPP_CODES;
  model: {id: string | number};
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
  subject?: string;
  messageType?: MAIL_MESSAGE_TYPE;
  tenantId: Tenant['id'];
}) {
  try {
    const session = await getSession();
    const user = session?.user;

    if (!user) {
      return {
        error: true,
        message: await t('Unauthorized'),
      };
    }

    if (!tenantId) {
      return {
        error: true,
        message: await t('TenantId is required.'),
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
        message: await t('Invalid workspace'),
      };
    }

    const {workspaceUser} = workspace;

    if (!workspaceUser) {
      return {
        error: true,
        message: await t('Workspace user is missing'),
      };
    }

    if (!model?.id) {
      return {
        error: true,
        message: await t('Model is missing'),
      };
    }

    const {
      error,
      message,
      data: modelRecord,
    }: any = await findByID({
      subapp,
      id: model.id,
      workspaceURL,
      workspace,
      tenantId,
    });

    if (error) {
      return {
        error: true,
        message: await t(message || 'Record not found.'),
      };
    }

    const client = await manager.getClient(tenantId);

    let parent;
    if (parentId) {
      parent = await client.aOSMailMessage.findOne({
        where: {id: {eq: parentId}},
        select: {id: true},
      });
      if (!parent) {
        return {
          error: true,
          message: await t('Invalid parent comment Id.'),
        };
      }
    }

    const timestamp = getCurrentDateTime();
    const modelName = ModelMap[subapp];

    if (!modelName) {
      return {
        error: true,
        message: await t('Invalid model type'),
      };
    }

    const body = JSON.stringify(messageBody);
    const response = await client.aOSMailMessage.create({
      data: {
        partner: {select: {id: user.id}},
        relatedId: modelRecord.id,
        relatedModel: modelName,
        ...(subapp === SUBAPP_CODES.quotations ? {body: note} : {note}),
        isPublicNote: true,
        createdOn: timestamp as unknown as Date,
        updatedOn: timestamp as unknown as Date,
        type: messageType,
        ...(parent && {parentMailMessage: {select: {id: parent.id}}}),
        ...(messageBody && {body, publicBody: body}),
        subject: subject ?? `${user.simpleFullName} added a comment`,
        author: {select: {id: workspaceUser.id}},
        createdBy: {select: {id: workspaceUser.id}},
        //relatedName: TODO: Add this later
        ...(attachments?.length > 0 && {
          mailMessageFileList: {
            create: attachments.map((attachment: any) => ({
              description: attachment?.description || '',
              attachmentFile: {select: {id: attachment.id}},
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

export type Comment = NonNullable<
  Awaited<ReturnType<typeof findComments>>['data']
>[number];

export async function findComments({
  model,
  limit,
  page,
  sort,
  workspaceURL,
  subapp,
  tenantId,
}: {
  model: {id: ID} | null;
  limit?: number;
  page?: number;
  sort?: any;
  workspaceURL: string;
  subapp: SUBAPP_CODES;
  tenantId: Tenant['id'];
}) {
  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required'),
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
      message: await t('Invalid workspace'),
    };
  }

  if (!model?.id) {
    return {
      error: true,
      message: await t('Model is missing'),
    };
  }

  const shouldUseAuth = (subapp: SUBAPP_CODES) =>
    ![
      SUBAPP_CODES.forum,
      SUBAPP_CODES.events,
      SUBAPP_CODES.news,
      SUBAPP_CODES.quotations,
    ].includes(subapp);

  const {
    error,
    message,
    data: modelRecord,
  }: any = await findByID({
    subapp,
    id: model?.id,
    workspaceURL,
    workspace,
    withAuth: shouldUseAuth(subapp),
    tenantId,
  });

  if (error) {
    return {
      error: true,
      message: await t(message || 'Record not found.'),
    };
  }

  const modelName = ModelMap[subapp];

  if (!modelName) {
    return {
      error: true,
      message: await t('Invalid model type'),
    };
  }

  const skip = getSkipInfo(limit, page);
  const client = await manager.getClient(tenantId);
  try {
    let orderBy: any = null;
    switch (sort) {
      case SORT_TYPE.old:
        orderBy = {createdOn: ORDER_BY.ASC};
        break;
      case SORT_TYPE.popular:
        const results: any = await getPopularCommentsBySorting({
          page,
          limit,
          workspace,
          modelRecord,
          tenantId,
          modelName,
          subapp,
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
        orderBy = {createdOn: ORDER_BY.DESC};
    }

    const commentFields = {
      note: true,
      publicBody: true,
      body: true,
      createdOn: true,
      partner: {picture: true, simpleFullName: true},
      mailMessageFileList: {
        select: {attachmentFile: {id: true, fileName: true}},
      },
      createdBy: {id: true, fullName: true},
    } as const;

    const getWhereConditions = () => {
      const baseConditions = {
        relatedId: modelRecord.id,
        relatedModel: modelName,
      };

      const subappConditions = {
        ...(subapp !== SUBAPP_CODES.quotations && {
          OR: [{publicBody: {ne: null}}, {isPublicNote: true}],
        }),
        ...(subapp === SUBAPP_CODES.forum && {
          parentMailMessage: {id: {eq: null}},
        }),
      };

      return {...baseConditions, ...subappConditions};
    };

    let comments = await client.aOSMailMessage.find({
      where: getWhereConditions(),
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
    return {
      error: true,
      message: await t('Something went wromng'),
    };
  }
}

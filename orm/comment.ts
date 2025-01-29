import fs from 'fs';
import path from 'path';
import {pipeline} from 'stream';
import {promisify} from 'util';
import {z} from 'zod';
import type {QueryOptions, WhereOptions} from '@goovee/orm';

// ---- CORE IMPORTS ---- //
import {
  MAIL_MESSAGE_TYPE,
  ORDER_BY,
  SORT_TYPE,
  SUBAPP_CODES,
} from '@/constants';
import {AOSMailMessage} from '@/goovee/.generated/models';
import {t} from '@/locale/server';
import {manager, type Tenant} from '@/tenant';
import {ID} from '@/types';
import {getCurrentDateTime} from '@/utils/date';
import {getFileSizeText, parseFormData} from '@/utils/files';
import {sql} from '@/utils/template-string';

const pump = promisify(pipeline);

const storage = process.env.DATA_STORAGE as string;

if (!fs.existsSync(storage)) {
  fs.mkdirSync(storage, {recursive: true});
}

export const ModelMap: Partial<Record<SUBAPP_CODES, string>> = {
  [SUBAPP_CODES.forum]: 'com.axelor.apps.portal.db.ForumPost',
  [SUBAPP_CODES.news]: 'com.axelor.apps.portal.db.PortalNews',
  [SUBAPP_CODES.events]: 'com.axelor.apps.portal.db.PortalEvent',
  [SUBAPP_CODES.ticketing]: 'com.axelor.apps.project.db.ProjectTask',
  [SUBAPP_CODES.quotations]: 'com.axelor.apps.sale.db.SaleOrder',
};

function getSelectFields(
  childConditions?: Omit<QueryOptions<AOSMailMessage>, 'select'>,
) {
  const commentFields = {
    note: true,
    publicBody: true,
    body: true,
    createdOn: true,
    partner: {picture: true, simpleFullName: true, name: true},
    mailMessageFileList: {
      select: {attachmentFile: {id: true, fileName: true}},
    },
    createdBy: {id: true, fullName: true},
  } as const;

  const select = {
    ...commentFields,
    parentMailMessage: commentFields,
    isPublicNote: true,
    childMailMessages: {
      ...childConditions,
      select: commentFields,
    } as {select: typeof commentFields},
  };
  return select;
}

export async function getPopularCommentsBySorting({
  skip = 0,
  limit,
  recordId,
  tenantId,
  modelName,
  subapp,
  exclude,
}: {
  recordId: ID;
  skip?: number;
  limit?: number;
  tenantId: Tenant['id'];
  subapp: SUBAPP_CODES;
  modelName: string;
  exclude?: ID[];
}): Promise<FindCommentsData> {
  if (!tenantId || !recordId) {
    throw new Error(await t('TenantId  and RecordId are required'));
  }

  const client = await manager.getClient(tenantId);

  const params = [
    recordId, // $1
    limit, // $2
    skip, // $3
    modelName, // $4
  ];
  let query = client.$raw.bind(
    null,
    sql`
      WITH
        mailMessageFileListData AS (
          SELECT
            mailMessageFile.related_mail_message AS id,
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id',
                mailMessageFile.id,
                'version',
                mailMessageFile.version,
                'attachmentFile',
                JSON_BUILD_OBJECT(
                  'id',
                  metaFile.id,
                  'version',
                  metaFile.version,
                  'fileName',
                  metaFile.file_name
                )
              )
            ) AS mailMessageFileList
          FROM
            base_mail_message_file AS mailMessageFile
            LEFT JOIN meta_file AS metaFile ON mailMessageFile.attachment_file = metaFile.id
          GROUP BY
            mailMessageFile.related_mail_message
        ),
        comments AS (
          SELECT
            mail_message.id AS id,
            mail_message.version AS VERSION,
            mail_message.note AS note,
            mail_message.public_body AS publicBody,
            mail_message.created_on AS createdOn,
            mail_message.is_public_note AS isPublicNote,
            mail_message.parent AS parentComment,
            JSON_BUILD_OBJECT(
              'id',
              author.id,
              'version',
              author.version,
              'fullName',
              author.full_name
            ) AS createdBy,
            JSON_BUILD_OBJECT(
              'id',
              partner.id,
              'version',
              partner.version,
              'picture',
              JSON_BUILD_OBJECT('id', picture.id, 'version', picture.version),
              'simpleFullName',
              partner.simple_full_name,
              'name',
              partner.name
            ) AS partner
          FROM
            mail_message
            LEFT JOIN auth_user AS author ON mail_message.created_by = author.id
            LEFT JOIN base_partner AS partner ON mail_message.partner = partner.id
            LEFT JOIN meta_file AS picture ON partner.picture = picture.id
          WHERE
            (
              mail_message.public_body IS NOT NULL
              OR mail_message.is_public_note = TRUE
            )
            AND mail_message.related_model = $4
            AND mail_message.related_id = $1 ${subapp === SUBAPP_CODES.forum
        ? 'AND mail_message.parent_mail_message IS NULL'
        : ''} ${exclude && exclude.length
        ? `AND mail_message.id NOT IN (${exclude.map((_, i) => '$' + (i + 1 + params.length)).join(',')})`
        : ''}
        ),
        childCommentsData AS (
          SELECT
            childComment.parent_mail_message AS parentId,
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id',
                childComment.id,
                'version',
                childComment.version,
                'note',
                childComment.note,
                'publicBody',
                childComment.public_body,
                'createdOn',
                childComment.created_on,
                'partner',
                JSON_BUILD_OBJECT(
                  'id',
                  childPartner.id,
                  'version',
                  childPartner.version,
                  'picture',
                  JSON_BUILD_OBJECT('id', picture.id, 'version', picture.version),
                  'simpleFullName',
                  childPartner.simple_full_name,
                  'name',
                  childPartner.name
                ),
                'createdBy',
                JSON_BUILD_OBJECT(
                  'id',
                  childAuthor.id,
                  'version',
                  childAuthor.version,
                  'fullName',
                  childAuthor.full_name
                ),
                'mailMessageFileList',
                COALESCE(mf.mailMessageFileList, '[]')
              )
              ORDER BY
                childComment.created_on ASC
            ) AS childMailMessages,
            COUNT(childComment.id) AS childCommentCount
          FROM
            mail_message AS childComment
            LEFT JOIN auth_user AS childAuthor ON childComment.created_by = childAuthor.id
            LEFT JOIN base_partner AS childPartner ON childComment.partner = childPartner.id
            LEFT JOIN meta_file AS picture ON childPartner.picture = picture.id
            LEFT JOIN mailMessageFileListData AS mf ON childComment.id = mf.id
          WHERE
            childComment.is_public_note = TRUE
            AND childComment.related_model = $4
            AND childComment.related_id = $1
          GROUP BY
            childComment.parent_mail_message
        )
      SELECT
        c.id AS id,
        c.version AS VERSION,
        c.note,
        c.createdOn AS "createdOn",
        c.isPublicNote AS "isPublicNote",
        c.createdBy AS "createdBy",
        c.partner AS "partner",
        COALESCE(mf.mailMessageFileList, '[]') AS "mailMessageFileList",
        COALESCE(cc.childMailMessages, '[]') AS "childMailMessages",
        COALESCE(cc.childCommentCount, 0) AS "childCommentCount",
        COUNT(*) OVER () AS "_count",
        (
          SELECT
            COALESCE(SUM(cc.childCommentCount), 0)
          FROM
            childCommentsData cc
        ) AS "_threadCount"
      FROM
        comments AS c
        LEFT JOIN childCommentsData AS cc ON c.id = cc.parentId
        LEFT JOIN mailMessageFileListData AS mf ON c.id = mf.id
      ORDER BY
        COALESCE(cc.childCommentCount, 0) DESC,
        c.createdOn DESC
      LIMIT
        $2
      OFFSET
        $3
    `,
    ...params,
  );

  if (exclude?.length) {
    query = query.bind(null, ...exclude);
  }

  const comments: any = await query();

  return {
    comments: CommentsSchema.parse(comments || []),
    total: Number(comments?.[0]?._count), // only parent comments counts
    totalCommentThreadCount: Number(comments?.[0]?._threadCount), // total count of comments ( parent + child comments )
  };
}

export async function upload(formData: FormData, tenantId: Tenant['id']) {
  if (!tenantId) {
    throw new Error(await t('TenantId is required.'));
  }

  const client = await manager.getClient(tenantId);

  //TODO: why to we need to check for text?
  // const text = formData.get('text');
  // if (!text) {
  //   return {
  //     error: true,
  //     message: await t('Text is required'),
  //   };
  // }

  const parsedFormData: any[] = parseFormData(formData);

  const getTimestampFilename = (name: string) => {
    return `${new Date().getTime()}-${name}`;
  };

  const create = async ({file, title, description}: any) => {
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
  };

  const data = await Promise.all(
    parsedFormData.map(({title, description, file}: any) =>
      create({
        title: title ? `${title}${path.extname(file.name)}` : file.name,
        description,
        file,
      }),
    ),
  );
  return data;
}

export async function addComment({
  subapp,
  recordId,
  modelName,
  userId,
  note,
  workspaceUserId,
  attachments = [],
  parentId = null,
  messageBody,
  tenantId,
  subject,
  messageType = MAIL_MESSAGE_TYPE.comment,
}: {
  subapp: SUBAPP_CODES;
  userId: ID;
  recordId: ID;
  workspaceUserId: ID;
  modelName: string;
  note?: string;
  attachments?: any;
  parentId?: any;
  messageBody?: {
    title: string;
    tracks: any[];
    tags: any[];
  };
  subject: string;
  messageType?: MAIL_MESSAGE_TYPE;
  tenantId: Tenant['id'];
}): Promise<[Comment, Comment | undefined]> {
  const client = await manager.getClient(tenantId);

  let parent;
  if (parentId) {
    parent = await client.aOSMailMessage.findOne({
      where: {id: {eq: parentId}, relatedId: Number(recordId)},
      select: {id: true},
    });
    if (!parent) {
      throw new Error(await t('Invalid parent'));
    }
  }

  const timestamp = getCurrentDateTime();

  const body = JSON.stringify(messageBody);
  const response = await client.aOSMailMessage.create({
    data: {
      partner: {select: {id: userId}},
      relatedId: Number(recordId),
      relatedModel: modelName,
      ...(subapp === SUBAPP_CODES.quotations ? {body: note} : {note}),
      isPublicNote: true,
      createdOn: timestamp as unknown as Date,
      updatedOn: timestamp as unknown as Date,
      type: messageType,
      ...(parent && {parentMailMessage: {select: {id: parent.id}}}),
      ...(messageBody && {body, publicBody: body}),
      subject: subject,
      author: {select: {id: workspaceUserId}},
      createdBy: {select: {id: workspaceUserId}},
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

  const data = await client.aOSMailMessage.find({
    where: {id: {in: [response.id].concat(parent ? [parent.id] : [])}},
    select: getSelectFields(),
  });

  const comment = CommentSchema.parse(data.find(d => d.id === response.id));
  const parentComment =
    parent && CommentSchema.parse(data.find(d => d.id === parent.id));

  return [comment, parentComment];
}

const PictureSchema = z.object({
  id: z.string().or(z.number()),
  version: z.number(),
});

const AttachmentFileSchema = z.object({
  id: z.string().or(z.number()),
  version: z.number(),
  fileName: z.string().nullish(),
});

const MailMessageFileSchema = z.object({
  id: z.string().or(z.number()),
  version: z.number(),
  attachmentFile: AttachmentFileSchema.nullish(),
});

const UserSchema = z.object({
  id: z.string().or(z.number()),
  version: z.number(),
  fullName: z.string().nullish(),
});

const PartnerSchema = z.object({
  id: z.string().or(z.number()),
  version: z.number(),
  picture: PictureSchema.nullish(),
  simpleFullName: z.string().nullish(),
});

const MailMessageSchema = z.object({
  id: z.string().or(z.number()),
  version: z.number(),
  body: z.string().nullish(),
  publicBody: z.string().nullish(),
  createdOn: z.union([z.date(), z.string()]).nullish(),
  partner: PartnerSchema.nullish(),
  createdBy: UserSchema.nullish(),
  note: z.string().nullish(),
  mailMessageFileList: z.array(MailMessageFileSchema).nullish(),
});

export const CommentSchema = MailMessageSchema.extend({
  isPublicNote: z.boolean().nullish(),
  parentMailMessage: MailMessageSchema.nullish(),
  childMailMessages: z.array(MailMessageSchema).nullish(),
  _count: z.string().nullish(),
  _cursor: z.string().nullish(),
  _hasNext: z.boolean().nullish(),
  _hasPrev: z.boolean().nullish(),
});

export type Comment = z.infer<typeof CommentSchema>;
export const CommentsSchema = z.array(CommentSchema);

export type FindCommentsData = {
  comments: Comment[];
  total: number;
  totalCommentThreadCount: number;
};
export async function findComments({
  recordId,
  modelName,
  limit,
  skip,
  sort,
  subapp,
  tenantId,
  exclude,
}: {
  recordId: ID;
  modelName: string;
  limit?: number;
  skip?: number;
  sort?: any;
  subapp: SUBAPP_CODES;
  tenantId: Tenant['id'];
  exclude?: ID[];
}): Promise<FindCommentsData> {
  if (!tenantId || !recordId) {
    throw new Error(await t('TenantId  and RecordId are required.'));
  }

  const client = await manager.getClient(tenantId);
  let orderBy: any = null;
  switch (sort) {
    case SORT_TYPE.old:
      orderBy = {createdOn: ORDER_BY.ASC};
      break;
    case SORT_TYPE.popular:
      const results = await getPopularCommentsBySorting({
        recordId,
        modelName,
        skip,
        limit,
        tenantId,
        subapp,
        exclude,
      });

      return results;
    default:
      orderBy = {createdOn: ORDER_BY.DESC};
  }

  const getWhereConditions = () => {
    const baseConditions: WhereOptions<AOSMailMessage> = {
      relatedId: Number(recordId),
      relatedModel: modelName,
      ...(exclude && exclude.length && {id: {notIn: exclude}}),
    };

    const subappConditions: WhereOptions<AOSMailMessage> = {
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
    select: getSelectFields({
      orderBy,
      where: {
        relatedId: Number(recordId),
        relatedModel: modelName,
        isPublicNote: true,
      },
    }),
  });

  comments = comments?.map(comment => {
    if (!comment.isPublicNote) return {...comment, note: undefined};
    return comment;
  });

  const totalCommentThreadCount = await client.aOSMailMessage.count({
    where: {
      relatedId: Number(recordId),
      relatedModel: modelName,
      OR: [{publicBody: {ne: null}}, {isPublicNote: true}],
    },
  });

  return {
    comments,
    total: Number(comments?.[0]?._count || comments?.length),
    totalCommentThreadCount: Number(totalCommentThreadCount),
  };
}

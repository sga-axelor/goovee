'use server';

// ---- CORE IMPORTS ---- //
import {manager, type Tenant} from '@/tenant';
import {i18n} from '@/i18n';
import {ModelType, PortalWorkspace} from '@/types';
import {getSkipInfo} from '@/utils';

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

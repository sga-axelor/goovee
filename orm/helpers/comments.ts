'use server';

// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {i18n} from '@/lib/i18n';
import {ModelType, PortalWorkspace} from '@/types';
import {getSkipInfo} from '@/utils';

const ModelMap: Record<ModelType, String> = {
  [ModelType.forum]: 'forum_post',
  [ModelType.news]: 'portal_news',
  [ModelType.event]: 'portal_event',
  [ModelType.ticketing]: 'project_task',
};

export async function getPopularCommentsBySorting({
  page,
  limit,
  workspace,
  modelRecord,
  type,
}: {
  page?: string | number;
  limit?: number;
  workspace: PortalWorkspace;
  modelRecord: any;
  type: ModelType;
}) {
  if (!workspace) {
    return {error: true, message: i18n.get('Invalid workspace')};
  }

  const modelName = ModelMap[type];

  const skip = getSkipInfo(limit, page);

  const client = await getClient();

  const joinTablesMap: Record<ModelType, string> = {
    [ModelType.forum]: `
      LEFT JOIN portal_forum_post AS forum_post 
        ON comment.forum_post = forum_post.id 
    `,
    [ModelType.news]: `
      LEFT JOIN portal_portal_news AS portal_news 
        ON comment.portal_news = portal_news.id
    `,
    [ModelType.event]: `
      LEFT JOIN portal_portal_event AS portal_event 
        ON comment.portal_event = portal_event.id
    `,
    [ModelType.ticketing]: `
      LEFT JOIN project_project_task AS project_task 
        ON comment.project_task = project_task.id 
    `,
  };

  const joinTables = joinTablesMap[type] || '';

  const comments: any = await client.$raw(
    `
 WITH comments AS (
  SELECT 
    comment.id AS id,
    comment.note AS note,
    comment.mail_message AS mailMessageId,
    comment.created_on AS createdOn,
    comment.is_private_note AS isPrivateNote,
    comment.forum_post AS forumPost,
    comment.portal_news AS portalNews,
    comment.portal_event AS portalEvent,
    comment.project_task AS projectTask,
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
  FROM base_comment AS comment
  LEFT JOIN auth_user AS author 
    ON comment.created_by = author.id
  LEFT JOIN base_partner AS partner 
    ON author.partner = partner.id
  ${joinTables}
  WHERE 
        is_private_note = false 
    AND 
        parent_comment IS NULL
    AND 
        ${modelName}.id = $1  
),
mailMessageData AS (
  SELECT 
    mail_message.id AS mailMessageId,
    mail_message.body AS mailMessageBody,
    mail_message.related_id AS relatedId,
    mail_message.related_model AS relatedModel,
    mail_message.created_on AS mailMessageCreatedOn,
    JSON_BUILD_OBJECT(
      'id', author.id,
      'name', author.name,
      'partner', JSON_BUILD_OBJECT(
        'picture', JSON_BUILD_OBJECT(
          'id', partner.picture
         ),
        'simpleFullName', partner.simple_full_name
      )
    ) AS mailMessageAuthor 
  FROM mail_message
  LEFT JOIN auth_user AS author 
    ON mail_message.author = author.id
  LEFT JOIN base_partner AS partner 
    ON author.partner = partner.id
),
childCommentsData AS (
  SELECT 
    childCommentList.parent_comment AS parentId,
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'id', childCommentList.id,
        'note', childCommentList.note,
        'createdOn', childCommentList.created_on,
        'createdBy', JSON_BUILD_OBJECT(
          'id', childAuthor.id,
          'name', childAuthor.name,
          'partner', JSON_BUILD_OBJECT(
            'picture', JSON_BUILD_OBJECT(
              'id', childPartner.picture
            ),
            'simpleFullName', childPartner.simple_full_name
          )
        )
      ) ORDER BY childCommentList.created_on ASC
    ) AS childCommentList,
    COUNT(childCommentList.id) AS childCommentCount 
  FROM base_comment AS childCommentList
  LEFT JOIN auth_user AS childAuthor 
    ON childCommentList.created_by = childAuthor.id
  LEFT JOIN base_partner AS childPartner 
    ON childAuthor.partner = childPartner.id
  WHERE childCommentList.is_private_note = FALSE
  GROUP BY childCommentList.parent_comment
),
commentFileData AS (
  SELECT 
    base_comment_file.related_comment AS id,
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'id', base_comment_file.id,
        'attachmentFile', JSON_BUILD_OBJECT(
          'id', file.id,
          'fileName', file.file_name
        )
      )
    ) AS commentFileList
  FROM base_comment_file
  LEFT JOIN meta_file AS file 
    ON base_comment_file.attachment_file = file.id
  GROUP BY base_comment_file.related_comment
),
parentCommentsCount AS (
  SELECT COUNT(*) AS totalParentCount
  FROM base_comment AS comment
  ${joinTables}
  WHERE 
        is_private_note = false 
    AND 
        parent_comment IS NULL
    AND 
        ${modelName}.id = $1  
    )
)
SELECT 
  c.id AS id,
  c.note,
  c.createdOn AS "createdOn",
  c.isPrivateNote AS "isPrivateNote",
  COALESCE(
    JSON_BUILD_OBJECT(
      'body', m.mailMessageBody,
      'relatedId', m.relatedId,
      'relatedModel', m.relatedModel,
      'createdOn', m.mailMessageCreatedOn,
      'author', m.mailMessageAuthor
    ), 
    '{}'
  ) AS "mailMessage", 
  c.createdBy AS "createdBy", 
  COALESCE(cc.childCommentList, '[]') AS "childCommentList",
  COALESCE(cf.commentFileList, '[]') AS "commentFileList",
  COALESCE(cc.childCommentCount, 0) AS "childCommentCount",
  pc.totalParentCount AS "_count"
FROM comments AS c
LEFT JOIN mailMessageData AS m 
  ON c.mailMessageId = m.mailMessageId 
LEFT JOIN childCommentsData AS cc 
  ON c.id = cc.parentId 
LEFT JOIN commentFileData AS cf 
  ON c.id = cf.id  
CROSS JOIN parentCommentsCount AS pc 
ORDER BY COALESCE(cc.childCommentCount, 0) DESC, c.createdOn DESC 
LIMIT $1
OFFSET $2
     `,
    modelRecord.id,
    limit,
    skip,
  );

  return {
    success: true,
    comments,
    total: comments?.[0]?._count || comments?.length,
  };
}

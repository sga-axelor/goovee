'use server';

import {getClient} from '@/goovee';
import {PortalWorkspace} from '@/types';
import {getPageInfo} from '@/utils';

export async function getPopularQuery({
  page,
  limit,
  workspaceID,
  groupIDs,
  search,
}: {
  page?: string | number;
  limit?: number;
  workspaceID: PortalWorkspace['id'];
  groupIDs?: any[];
  search?: string | undefined;
}) {
  const client = await getClient();

  const skip = Number(page) > 1 ? Number(page) * Number(limit) : 0;

  const whereClause = `WHERE forumGroup.workspace = ${workspaceID}
        ${groupIDs?.length ? `AND post.forum_group IN (${groupIDs.join(', ')})` : ''}
        ${search ? `AND post.title LIKE '%${search}%'` : ''}`;

  const posts: any = await client.$raw(
    `WITH 
    postData AS (
        SELECT 
            post.id AS postId, 
            post.title, 
            forumGroup.id AS forumGroupId, 
            forumGroup.name AS forumGroupName, 
            forumGroup.image AS forumGroupImage, 
            JSON_BUILD_OBJECT(
                'id', forumGroup.id,
                'name', forumGroup.name,
                'image', JSON_BUILD_OBJECT(  
                    'id', forumGroup.image
                )
            ) AS forumGroupJson,
            post.content, 
            post.created_on AS createdOn,
            post.author,
            author.simple_full_name AS authorSimpleFullName,
            author.picture AS authorPicture
        FROM portal_forum_post AS post
        LEFT JOIN portal_forum_group AS forumGroup 
            ON post.forum_group = forumGroup.id
        LEFT JOIN base_partner AS author 
            ON post.author = author.id
        LEFT JOIN meta_file AS metaFile 
            ON author.picture = metaFile.id
        ${whereClause}
    ),
    
    commentData AS (
        SELECT 
            commentList.forum_post AS postId,
            COUNT(commentList.id) AS commentCount,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', commentList.id,
                    'createdOn', commentList.created_on,
                    'mailMessage', JSON_BUILD_OBJECT(
                        'id', mailMessage.id,
                        'version', mailMessage.version,
                        'messageContentHtml', mailMessage.message_content_html,
                        'author', JSON_BUILD_OBJECT(
                            'id', author.id,
                            'version', author.version,
                            'name', author.name, 
                            'partner', JSON_BUILD_OBJECT(
                                'id', partner.id,
                                'simpleFullName', partner.simple_full_name,
                                'picture', JSON_BUILD_OBJECT(
                                    'id', picture.id
                                )
                            )
                        )
                    )
                )
            ORDER BY commentList.created_on DESC 
            ) AS commentListJson
        FROM base_comment AS commentList
        LEFT JOIN mail_message AS mailMessage 
            ON commentList.mail_message = mailMessage.id
        LEFT JOIN auth_user AS author 
            ON mailMessage.author = author.id
        LEFT JOIN base_partner AS partner 
            ON author.partner = partner.id
        LEFT JOIN meta_file AS picture 
            ON partner.picture = picture.id
        GROUP BY commentList.forum_post
    ), 
    
    attachmentData AS (
        SELECT 
            attachmentList.forum_post AS postId,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', attachmentList.id,
                    'title', attachmentList.title,
                    'metaFile', JSON_BUILD_OBJECT(
                        'id', metaFile.id,
                        'fileName', metaFile.file_name,
                        'fileType', metaFile.file_type
                    )
                )
            ) AS attachmentListJson
        FROM portal_post_attachment AS attachmentList
        LEFT JOIN meta_file AS metaFile 
            ON attachmentList.meta_file = metaFile.id
        GROUP BY attachmentList.forum_post
    ),

    authorData AS (
        SELECT 
            author.id AS id, 
            JSON_BUILD_OBJECT(
                'id', author.id,
                'simpleFullName', author.simple_full_name,
                'picture', JSON_BUILD_OBJECT(
                    'id', metaFile.id
                )
            ) AS authorJson
        FROM base_partner AS author
        LEFT JOIN meta_file AS metaFile 
            ON author.picture = metaFile.id
    ),
    
    totalCount AS (
        SELECT COUNT(*) AS _count
        FROM portal_forum_post AS post
        LEFT JOIN portal_forum_group AS forumGroup 
            ON post.forum_group = forumGroup.id
        LEFT JOIN base_partner AS author 
            ON post.author = author.id
        LEFT JOIN meta_file AS metaFile 
            ON author.picture = metaFile.id
        ${whereClause}
    )

    SELECT 
        pd.postId AS "id",
        pd.createdOn AS "createdOn",
        pd.title,
        pd.content,
        COALESCE(pd.forumGroupJson, '{}') AS "forumGroup",
        COALESCE(authorD.authorJson, '{}') AS author,
        COALESCE(ad.attachmentListJson, '[]') AS "attachmentList", 
        COALESCE(cd.commentListJson, '[]') AS "commentList", 
        COALESCE(cd.commentCount, 0) AS "commentCount",
        (SELECT _count FROM totalCount) AS "_count"
    FROM postData AS pd
    LEFT JOIN commentData AS cd 
        ON pd.postId = cd.postId
    LEFT JOIN attachmentData AS ad 
        ON pd.postId = ad.postId
    LEFT JOIN authorData AS authorD 
        ON pd.author = authorD.id
    ORDER BY commentCount ASC 
    LIMIT $1
    OFFSET $2`,
    limit,
    skip,
  );

  const pageInfo = getPageInfo({
    count: posts?.[0]?._count,
    page,
    limit,
  });

  return {posts, pageInfo};
}

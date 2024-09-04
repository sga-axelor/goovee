import {getClient} from '@/goovee';
import {clone} from '@/utils';
import {ID} from '@/types';
import {hash} from '@/utils/auth';
import {findDefaultPartnerWorkspaceConfig} from './workspace';

export async function findPartnerByEmail(email: string, tenantId: ID) {
  if (!email) return null;

  const client = await getClient(tenantId);

  const partner = await client.aOSPartner
    .findOne({
      where: {
        emailAddress: {
          address: {
            eq: email,
          },
        },
      },
      select: {
        firstName: true,
        fullName: true,
        isContact: true,
        password: true,
        emailAddress: true,
        mainPartner: {
          id: true,
        },
      },
    })
    .then(clone);

  return partner;
}

export async function findPosts() {
  const client = await getClient();

  const id = 1;
  const take = 25;
  const skip = 0;

  return client.$raw(
    `
      SELECT post.id, post.title,
      COUNT(comment.id) AS comment_count,
      COUNT(subcomment.id) AS subcomment_count 
      FROM post 
      LEFT JOIN comment ON comment.post_id = $1
      LEFT JOIN comment subcomment ON subcomment.parent_id = $comment.id
      GROUP BY post.id, post.title
      ORDER BY COUNT(comment.id) + COUNT(subcomment.id) DESC
      LIMIT $2
      OFFSET $3`,
    [id, take, skip],
  );
}

export async function registerPartner({
  firstName,
  name,
  password = '',
  email,
  workspaceURL,
  tenantId,
}: {
  firstName?: string;
  name: string;
  password?: string;
  email: string;
  workspaceURL?: string;
  tenantId: ID;
}) {
  const client = await getClient(tenantId);

  const hashedPassword = await hash(password);

  const data: any = {
    firstName,
    name,
    password: hashedPassword,
    isContact: false,
    isCustomer: true,
    fullName: `${name} ${firstName || ''}`,
    emailAddress: {
      create: {
        address: email,
        name: email,
      },
    },
  };

  if (workspaceURL) {
    const defaultPartnerWorkspaceConfig =
      await findDefaultPartnerWorkspaceConfig({url: workspaceURL, tenantId});

    const id = defaultPartnerWorkspaceConfig?.id;

    if (id) {
      data.partnerWorkspaceSet = {select: [{id}]};
      data.defaultWorkspace = {select: [{id}]};
    }
  }

  const partner = await client.aOSPartner.create({data}).then(clone);

  return partner;
}

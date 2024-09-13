import {getClient} from '@/goovee';
import {clone} from '@/utils';
import {hash} from '@/utils/auth';
import {findDefaultPartnerWorkspaceConfig} from './workspace';
import {ID} from '@/types';

export async function findPartnerByEmail(email: string) {
  if (!email) return null;

  const client = await getClient();

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

export async function registerPartner({
  firstName,
  name,
  password = '',
  email,
  workspaceURL,
}: {
  firstName?: string;
  name: string;
  password?: string;
  email: string;
  workspaceURL?: string;
}) {
  const client = await getClient();

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
      await findDefaultPartnerWorkspaceConfig({url: workspaceURL});

    const id = defaultPartnerWorkspaceConfig?.id;

    if (id) {
      data.partnerWorkspaceSet = {select: [{id}]};
      data.defaultWorkspace = {select: [{id}]};
    }
  }

  const partner = await client.aOSPartner.create({data}).then(clone);

  return partner;
}

export async function findUserForPartner({partnerId}: {partnerId: ID}) {
  if (!partnerId) return null;

  const client = await getClient();

  const user = await client.aOSUser.findOne({
    where: {
      partner: {
        id: partnerId,
      },
    },
  });

  return user;
}

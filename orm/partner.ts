import {manager, type Tenant} from '@/tenant';
import {clone} from '@/utils';
import {hash} from '@/auth/utils';
import {ID} from '@/types';
import {findDefaultPartnerWorkspaceConfig} from './workspace';

export async function findPartnerByEmail(
  email: string,
  tenantId: Tenant['id'],
) {
  if (!(email && tenantId)) return null;

  const client = await manager.getClient(tenantId);

  if (!client) return null;

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
        fixedPhone: true,
        isContact: true,
        name: true,
        password: true,
        emailAddress: true,
        mainPartner: {
          id: true,
        },
        partnerCategory: {
          name: true,
          code: true,
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
  tenantId,
}: {
  firstName?: string;
  name: string;
  password?: string;
  email: string;
  workspaceURL?: string;
  tenantId: Tenant['id'];
}) {
  const client = await manager.getClient(tenantId);

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

export async function findUserForPartner({
  partnerId,
  tenantId,
}: {
  partnerId: ID;
  tenantId: Tenant['id'];
}) {
  if (!(partnerId && tenantId)) return null;

  const client = await manager.getClient(tenantId);

  const user = await client.aOSUser.findOne({
    where: {
      partner: {
        id: partnerId,
      },
    },
  });

  return user;
}

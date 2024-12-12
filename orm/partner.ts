import {getSession} from '@/auth';
import {UserType} from '@/auth/types';
import {hash} from '@/auth/utils';
import {manager, type Tenant} from '@/tenant';
import {USER_CREATED_FROM} from '@/constants';
import {clone} from '@/utils';
import {ID, Partner, PortalWorkspace} from '@/types';
import {
  findContactWorkspaceConfig,
  findDefaultPartnerWorkspaceConfig,
} from './workspace';
import type {AOSPartner} from '@/goovee/.generated/models';

const partnerFields = {
  firstName: true,
  fullName: true,
  fixedPhone: true,
  isContact: true,
  name: true,
  password: true,
  emailAddress: true,
  picture: true,
  mainPartner: {
    id: true,
  },
  partnerCategory: {
    name: true,
    code: true,
  },
  defaultWorkspace: {
    workspace: {
      id: true,
    },
  },
  partnerWorkspaceSet: {
    select: {
      workspace: {
        id: true,
      },
    },
  },
  contactWorkspaceConfigSet: {
    select: {
      portalWorkspace: {
        id: true,
        url: true,
      },
    },
  },
  localization: {
    code: true,
    name: true,
  },
  partnerTypeSelect: true,
  registrationCode: true,
  isRegisteredOnPortal: true,
  isActivatedOnPortal: true,
  createdFromSelect: true,
};

export async function findPartnerById(id: ID, tenantId: Tenant['id']) {
  if (!(id && tenantId)) return null;

  const client = await manager.getClient(tenantId);

  if (!client) return null;

  const partner = await client.aOSPartner
    .findOne({
      where: {
        id,
      },
      select: partnerFields,
    })
    .then(clone);

  return partner;
}

export async function isPartner() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return false;
  }

  if (user.isContact) {
    return false;
  }

  return user;
}

export async function isAdminContact({
  workspaceURL,
  tenantId,
}: {
  workspaceURL: PortalWorkspace['url'];
  tenantId: Tenant['id'];
}) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return false;
  }

  if (!user?.isContact) {
    return false;
  }

  const contactWorkspaceConfig = await findContactWorkspaceConfig({
    tenantId,
    url: workspaceURL,
    contactId: user.id,
  });

  if (!contactWorkspaceConfig?.isAdmin) {
    return false;
  }

  return user;
}

export async function findEmailAddress(email: string, tenantId: Tenant['id']) {
  if (!(email && tenantId)) {
    return null;
  }

  const client = await manager.getClient(tenantId);

  if (!client) {
    return null;
  }

  return client.aOSEmailAddress.findOne({
    where: {
      address: email,
    },
  });
}

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
      select: partnerFields,
    })
    .then(clone);

  return partner;
}

export async function updatePartner({
  data,
  tenantId,
}: {
  data: {id: Partner['id']; version: Partner['version']} & Partial<AOSPartner>;
  tenantId: Tenant['id'];
}) {
  if (!(data && tenantId)) return null;

  const client = await manager.getClient(tenantId);

  if (!client) return null;

  if (!(data?.id && data?.version)) return null;

  const partner = await client.aOSPartner
    .update({
      data: {
        ...data,
        id: String(data.id),
      },
      select: {
        localization: true,
      },
    })
    .then(clone);

  return partner;
}

export async function registerContact({
  name,
  firstName,
  email,
  password,
  tenantId,
  contactConfig,
  partnerId,
}: {
  name: string;
  firstName?: string;
  email: string;
  password: string;
  tenantId: Tenant['id'];
  contactConfig?: any;
  partnerId: string;
}) {
  if (!(name && email && password && tenantId && partnerId)) {
    return null;
  }

  const client = await manager.getClient(tenantId);

  if (!client) return null;

  const hashedPassword = await hash(password);

  const data: any = {
    partnerTypeSelect: PartnerTypeMap[UserType.individual],
    firstName,
    name,
    mainPartner: {
      select: {
        id: partnerId,
      },
    },
    password: hashedPassword,
    isContact: true,
    isCustomer: true,
    fullName: `${name} ${firstName || ''}`,
    createdFromSelect: USER_CREATED_FROM,
    isRegisteredOnPortal: true,
    isActivatedOnPortal: true,
    emailAddress: {
      create: {
        address: email,
        name: email,
      },
    },
  };

  if (contactConfig?.id) {
    data.contactWorkspaceConfigSet = {select: [{id: contactConfig.id}]};
  }

  const contact = await client.aOSPartner.create({data}).then(clone);
  return contact;
}

export const PartnerTypeMap = {
  [UserType.company]: 1,
  [UserType.individual]: 2,
};

export async function registerPartner({
  type = UserType.individual,
  companyName,
  identificationNumber,
  companyNumber,
  firstName,
  name,
  password = '',
  email,
  workspaceURL,
  tenantId,
  isContact,
}: {
  type: UserType;
  companyName?: string;
  identificationNumber?: string;
  companyNumber?: string;
  firstName?: string;
  name: string;
  password?: string;
  email: string;
  workspaceURL?: string;
  tenantId: Tenant['id'];
  isContact?: boolean;
}) {
  const client = await manager.getClient(tenantId);

  const hashedPassword = await hash(password);

  const isCompany = type === UserType.company;
  const partnerTypeSelect =
    PartnerTypeMap[type] || PartnerTypeMap[UserType.individual];

  const data: any = {
    partnerTypeSelect,
    registrationCode: identificationNumber,
    fixedPhone: companyNumber,
    firstName,
    name: isCompany ? companyName : name,
    password: hashedPassword,
    isContact: isContact || false,
    isCustomer: true,
    fullName: `${name} ${firstName || ''}`,
    createdFromSelect: USER_CREATED_FROM,
    isRegisteredOnPortal: true,
    isActivatedOnPortal: true,
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

  const existingPartner = await findPartnerByEmail(email, tenantId);

  if (existingPartner && !existingPartner.isRegisteredOnPortal) {
    const {id, version} = existingPartner;
    const udpatedPartner = await client.aOSPartner.update({
      data: {
        ...data,
        id,
        version,
      },
    });

    return udpatedPartner;
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

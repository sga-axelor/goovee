import 'server-only';

import {getClient} from '@/goovee';
import type {User, Partner, PortalWorkspace} from '@/types';

export async function findDefaultWorkspace({
  url,
}: {
  url: string;
}): Promise<PortalWorkspace | null> {
  const client = await getClient();

  const workspace: any = await client.aOSPortalWorkspace.findOne({
    where: {
      url: {
        like: url,
      },
    },
    select: {
      defaultTheme: true,
      defaultPartnerWorkspace: {
        apps: true,
      },
      url: true,
      appConfig: {
        name: true,
        company: {
          id: true,
          name: true,
        },
        byNewest: true,
        byFeature: true,
        byAToZ: true,
        byZToA: true,
        byLessExpensive: true,
        byMostExpensive: true,
        displayPrices: true,
        mainPrice: true,
        displayTwoPrices: true,
        confirmOrder: true,
        requestQuotation: true,
        publicEshop: true,
      },
    },
  });

  if (workspace) {
    workspace.config = workspace.appConfig;
    workspace.appConfig = undefined;
  }

  return workspace;
}

export async function findPartnerWorkspace({
  id,
  url,
}: {
  id?: Partner['id'];
  url: string;
}) {
  if (!id) return null;

  const client = await getClient();

  const res: any = await client.aOSPartner.findOne({
    where: {
      id,
    },
    select: {
      partnerWorkspaceSet: {
        where: {
          workspace: {
            url: {
              like: `%${url}%`,
            },
          },
        },
        select: {
          workspace: {
            url,
            defaultTheme: true,
          },
          portalAppConfig: {
            name: true,
            company: {
              id: true,
              name: true,
            },
            byNewest: true,
            byFeature: true,
            byAToZ: true,
            byZToA: true,
            byLessExpensive: true,
            byMostExpensive: true,
            displayPrices: true,
            mainPrice: true,
            displayTwoPrices: true,
            confirmOrder: true,
            requestQuotation: true,
            publicEshop: true,
          },
        },
      },
    },
  });

  if (!res?.partnerWorkspaceSet?.length) {
    return null;
  }

  const {workspace, portalAppConfig} = res.partnerWorkspaceSet[0];

  workspace.config = portalAppConfig;
  workspace.portalAppConfig = undefined;

  return workspace;
}

export async function findWorkspace({user, url}: {user?: User; url: string}) {
  let workspace: PortalWorkspace | null | undefined;

  if (!url) return null;

  if (user) {
    workspace = await findPartnerWorkspace({
      id: user.isContact ? user.mainPartnerId : user.id,
      url,
    });
  }

  if (!workspace) {
    workspace = await findDefaultWorkspace({url});
  }

  return workspace;
}

export async function findWorkspaces({url}: {url?: string}) {
  if (!url) return [];

  const client = await getClient();

  const workspaces = await client.aOSPortalWorkspace.find({
    where: {
      url: {
        like: `${url}%`,
      },
    },
    select: {
      url: true,
      allowRegistrationSelect: true,
      appConfig: {
        publicEshop: true,
      },
    },
    orderBy: {updatedOn: 'DESC'},
  });

  return workspaces;
}

const defaultApps = [
  {
    name: 'Addresses',
    code: 'account/addresses',
    icon: 'storeFront',
    showInTopMenu: false,
    showInMySpace: true,
    installed: 'yes',
  },
];

export async function findWorkspaceApps({
  workspace,
  user,
}: {
  workspace?: PortalWorkspace;
  user?: User;
}) {
  if (!user) return [];

  const partnerId = user.isContact ? user.mainPartnerId : user.id;

  if (!(partnerId && workspace?.id)) {
    return [...defaultApps];
  }

  const client = await getClient();

  const partner = await client.aOSPartner.findOne({
    where: {
      id: partnerId,
    },
    select: {
      partnerWorkspaceSet: {
        where: {
          workspace: {
            id: workspace.id,
          },
        },
        select: {
          apps: true,
        },
      },
    },
  });

  let partnerWorkpace: any = partner?.partnerWorkspaceSet?.[0];

  if (!partnerWorkpace) {
    const defaultWorkspace: any = await findDefaultWorkspace({
      url: workspace?.url,
    });

    const defaultPartnerWorkspace = defaultWorkspace?.defaultPartnerWorkspace;

    if (!defaultPartnerWorkspace) {
      return [...defaultApps];
    }

    partnerWorkpace = defaultPartnerWorkspace;
  }

  const availableApps = [...defaultApps, ...(partnerWorkpace?.apps || [])];

  if (!user.isContact) {
    return availableApps;
  }

  const contact = await client.aOSPartner.findOne({
    where: {
      id: user.id,
    },
    select: {
      contactWorkspaceConfigSet: {
        where: {
          portalWorkspace: {
            id: workspace.id,
          },
        },
        select: {
          portalWorkspace: true,
          contactAppPermissionList: {
            select: {
              roleSelect: true,
              app: true,
            },
          },
        },
      },
    },
  });

  const contactWorkpace: any = contact?.contactWorkspaceConfigSet?.[0];

  const contactApps = contactWorkpace?.contactAppPermissionList?.map(
    (w: any) => ({
      ...w.app,
      role: w.roleSelect,
    }),
  );

  const available = (app: any) =>
    availableApps.some(a => a.code === app.code && a.installed === 'yes');

  const availableContactApps = (contactApps || [])?.filter(available);

  return [...defaultApps, ...availableContactApps];
}

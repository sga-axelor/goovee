import {getClient} from '@/goovee';
import {ID, User} from '@/types';
import {clone} from '@/utils';

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

const portalAppConfigFields = {
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
};

export async function findContactWorkspaceConfig({
  url,
  contactId,
}: {
  url?: string;
  contactId: ID;
}) {
  if (!(url && contactId)) return null;

  const client = await getClient();

  const contact = await client.aOSPartner.findOne({
    where: {
      id: contactId,
    },
    select: {
      contactWorkspaceConfigSet: {
        where: {
          portalWorkspace: {
            url,
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

  const apps = contactWorkpace?.contactAppPermissionList?.map((w: any) => ({
    ...w.app,
    role: w.roleSelect,
  }));

  return {
    apps,
  };
}

export async function findPartnerWorkspaceConfig({
  url,
  partnerId,
}: {
  url: string;
  partnerId?: ID;
}) {
  if (!(url && partnerId)) return null;

  const client = await getClient();

  const res: any = await client.aOSPartner.findOne({
    where: {
      id: partnerId,
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
          portalAppConfig: portalAppConfigFields,
          apps: true,
        },
      },
    },
  });

  if (!res?.partnerWorkspaceSet?.length) {
    return null;
  }

  const partnerWorkspaceConfig = res.partnerWorkspaceSet[0];

  if (!partnerWorkspaceConfig) return null;

  return {
    config: partnerWorkspaceConfig?.portalAppConfig,
    apps: partnerWorkspaceConfig?.apps,
  };
}

export async function findDefaultPartnerWorkspaceConfig({url}: {url: string}) {
  if (!url) return null;

  const client = await getClient();

  const workspace: any = await client.aOSPortalWorkspace.findOne({
    where: {
      url: {
        like: url,
      },
    },
    select: {
      defaultPartnerWorkspace: {
        apps: true,
        portalAppConfig: portalAppConfigFields,
      },
    },
  });

  const defaultPartnerWorkspaceConfig = workspace?.defaultPartnerWorkspace;

  if (!defaultPartnerWorkspaceConfig) return null;

  return {
    config: defaultPartnerWorkspaceConfig?.portalAppConfig,
    apps: defaultPartnerWorkspaceConfig?.apps,
  };
}

export async function findDefaultGuestWorkspaceConfig({url}: {url: string}) {
  if (!url) return null;

  const client = await getClient();

  const workspace: any = await client.aOSPortalWorkspace.findOne({
    where: {
      url: {
        like: url,
      },
    },
    select: {
      defaultGuestWorkspace: {
        apps: true,
        portalAppConfig: portalAppConfigFields,
      },
    },
  });

  const defaultGuestWorkspaceConfig = workspace?.defaultGuestWorkspace;

  if (!defaultGuestWorkspaceConfig) return null;

  return {
    config: defaultGuestWorkspaceConfig?.portalAppConfig,
    apps: defaultGuestWorkspaceConfig?.apps,
  };
}

export async function findWorkspace({
  url = '',
  user,
}: {
  url?: string;
  user?: User;
}) {
  if (!url) return null;

  const client = await getClient();

  const workspace = await client.aOSPortalWorkspace.findOne({
    where: {
      url: {
        like: url,
      },
    },
    select: {
      defaultTheme: true,
      appConfig: portalAppConfigFields,
      url: true,
    },
  });

  if (!workspace) return null;

  let workspaceConfig;

  if (user) {
    const partnerId = user.isContact ? user.mainPartnerId : user.id;

    const partnerWorkspaceConfig = await findPartnerWorkspaceConfig({
      partnerId,
      url,
    });

    if (partnerWorkspaceConfig?.config) {
      workspaceConfig = partnerWorkspaceConfig;
    } else {
      const defaultPartnerWorkspaceConfig =
        await findDefaultPartnerWorkspaceConfig({url});

      if (defaultPartnerWorkspaceConfig?.config) {
        workspaceConfig = defaultPartnerWorkspaceConfig;
      }
    }
  } else {
    const defaultGuestWorkspaceConfig = await findDefaultGuestWorkspaceConfig({
      url,
    });

    if (defaultGuestWorkspaceConfig?.config) {
      workspaceConfig = defaultGuestWorkspaceConfig;
    }
  }

  let config = workspaceConfig?.config;
  let apps: any[] = workspaceConfig?.apps;

  if (!config) {
    config = workspace?.appConfig;
  }

  apps = apps || [];

  apps = user ? [...defaultApps, ...apps] : apps;

  return {
    id: workspace.id,
    version: workspace.version,
    theme: workspace.defaultTheme,
    url: workspace.url,
    config,
    apps,
  };
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
    },
    orderBy: {updatedOn: 'DESC'},
  });

  return workspaces;
}

export async function findWorkspaceApps({
  url,
  user,
}: {
  url?: string;
  user?: User;
}) {
  const workspace = await findWorkspace({url, user});

  if (!workspace?.apps) {
    return [];
  }

  const {apps} = workspace;

  if (!user || !user.isContact) {
    return apps;
  }

  const contactWorkpaceConfig = await findContactWorkspaceConfig({
    url: workspace.url,
    contactId: user.id,
  });

  const available = (app: any) =>
    apps.some(a => a.code === app.code && a.installed === 'yes');

  const contactApps = (contactWorkpaceConfig?.apps || []).filter(available);

  return contactApps;
}

export async function findSubapps({url, user}: {url: string; user?: User}) {
  const apps = await findWorkspaceApps({
    url,
    user,
  })
    .then(clone)
    .then(subapps =>
      subapps.map((app: any) => ({
        ...app,
        installed: app?.installed === 'yes',
      })),
    );

  return apps;
}

export async function findSubapp({
  code,
  url,
  user,
}: {
  code: string;
  url: string;
  user?: User;
}) {
  const subapps = await findSubapps({url, user});

  return subapps.find((app: any) => app.code === code);
}

export async function findSubappAccess({
  code,
  user,
  url,
}: {
  code: string;
  user: any;
  url: string;
}) {
  if (!(code && url)) return null;

  const subapp = await findSubapp({code, url, user});

  if (!subapp?.installed) return null;

  return subapp;
}

import {manager, type Tenant} from '@/tenant';
import {AOSPortalAppConfig} from '@/goovee/.generated/models';
import {ID, User} from '@/types';
import {clone} from '@/utils';
import {SelectOptions} from '@goovee/orm';

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

const portalAppConfigFields: SelectOptions<AOSPortalAppConfig> = {
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
  priceAfterLogin: true,
  paymentOptionSet: {
    select: {
      name: true,
      typeSelect: true,
    },
  },
  ticketStatusChangeMethod: true,
  ticketHeroTitle: true,
  ticketHeroBgImage: {
    id: true,
    fileName: true,
  },
  ticketHeroDescription: true,
  ticketHeroOverlayColorSelect: true,
  forumHeroTitle: true,
  forumHeroDescription: true,
  forumHeroOverlayColorSelect: true,
  forumHeroBgImage: {id: true},
  eventHeroTitle: true,
  eventHeroDescription: true,
  eventHeroOverlayColorSelect: true,
  eventHeroBgImage: {id: true},
  newsHeroTitle: true,
  newsHeroDescription: true,
  newsHeroOverlayColorSelect: true,
  newsHeroBgImage: {id: true},
  resourcesHeroTitle: true,
  resourcesHeroDescription: true,
  resourcesHeroOverlayColorSelect: true,
  resourcesHeroBgImage: {id: true},
  allowOnlinePaymentForEcommerce: true,
  carouselList: {
    select: {
      title: true,
      subTitle: true,
      href: true,
      image: true,
    },
  },
  allowGuestEventRegistration: true,
  enableSocialMediaSharing: true,
  enableNewsComment: true,
  enableEventComment: true,
};

export async function findContactWorkspaceConfig({
  url,
  contactId,
  tenantId,
}: {
  url?: string;
  contactId: ID;
  tenantId: Tenant['id'];
}) {
  if (!(url && contactId && tenantId)) return null;

  const client = await manager.getClient(tenantId);

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
  tenantId,
}: {
  url: string;
  partnerId?: ID;
  tenantId: Tenant['id'];
}) {
  if (!(url && partnerId && tenantId)) return null;

  const client = await manager.getClient(tenantId);

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

export async function findDefaultPartnerWorkspaceConfig({
  url,
  tenantId,
}: {
  url: string;
  tenantId: Tenant['id'];
}) {
  if (!url) return null;

  const client = await manager.getClient(tenantId);

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

  return workspace?.defaultPartnerWorkspace;
}

export async function findDefaultPartnerWorkspace({
  partnerId,
  tenantId,
}: {
  partnerId?: ID;
  tenantId: Tenant['id'];
}) {
  if (!partnerId) return null;

  const client = await manager.getClient(tenantId);

  const res: any = await client.aOSPartner.findOne({
    where: {
      id: partnerId,
    },
    select: {
      defaultWorkspace: {
        workspace: {
          url: true,
        },
      },
    },
  });

  return res?.defaultWorkspace;
}

export async function findDefaultGuestWorkspaceConfig({
  url,
  tenantId,
}: {
  url: string;
  tenantId: Tenant['id'];
}) {
  if (!(url && tenantId)) return null;

  const client = await manager.getClient(tenantId);

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
  tenantId,
}: {
  url?: string;
  user?: User;
  tenantId: Tenant['id'];
}) {
  if (!(url && tenantId)) return null;

  const client = await manager.getClient(tenantId);

  const workspace = await client.aOSPortalWorkspace.findOne({
    where: {
      url: {
        like: url,
      },
    },
    select: {
      name: true,
      url: true,
      defaultTheme: true,
      navigationSelect: true,
    },
  });

  if (!workspace) return null;

  let workspaceConfig;

  if (user) {
    const partnerId = user.isContact ? user.mainPartnerId : user.id;

    const partnerWorkspaceConfig = await findPartnerWorkspaceConfig({
      partnerId,
      url,
      tenantId,
    });

    if (partnerWorkspaceConfig?.config) {
      workspaceConfig = partnerWorkspaceConfig;
    }
  } else {
    const defaultGuestWorkspaceConfig = await findDefaultGuestWorkspaceConfig({
      url,
      tenantId,
    });

    if (defaultGuestWorkspaceConfig?.config) {
      workspaceConfig = defaultGuestWorkspaceConfig;
    }
  }

  let config = workspaceConfig?.config;
  let apps: any[] = workspaceConfig?.apps;

  if (!config) {
    config = null;
  }

  apps = apps || [];

  apps = user ? [...defaultApps, ...apps] : apps;

  const {
    id,
    name,
    version,
    defaultTheme: theme,
    navigationSelect = 'leftSide',
  } = workspace;

  return {
    id,
    name,
    version,
    theme,
    url,
    config,
    apps,
    navigationSelect,
  };
}

export async function findOpenWorkspaces({
  url,
  tenantId,
}: {
  url?: string;
  tenantId: Tenant['id'];
}) {
  if (!tenantId) return [];

  const client = await manager.getClient(tenantId);

  const workspaces = await client.aOSPortalWorkspace
    .find({
      where: {
        url: {
          like: `${url}%`,
        },
      },
      select: {
        name: true,
        url: true,
        allowRegistrationSelect: true,
        defaultGuestWorkspace: {
          apps: true,
        },
      },
      orderBy: {updatedOn: 'DESC'} as any,
    })
    .then(workspaces => {
      return (workspaces || [])?.filter(
        workspace => workspace?.defaultGuestWorkspace?.apps?.length,
      );
    });

  return workspaces;
}

export async function findPartnerWorkspaces({
  url,
  partnerId,
  tenantId,
}: {
  url: string;
  partnerId: ID;
  tenantId: Tenant['id'];
}) {
  if (!(url && partnerId && tenantId)) return [];

  const client = await manager.getClient(tenantId);

  const res: any = await client.aOSPartner.findOne({
    where: {
      id: partnerId,
    },
    select: {
      partnerWorkspaceSet: {
        where: {
          workspace: {
            url: {
              like: `${url}%`,
            },
          },
        },
        select: {
          workspace: {
            id: true,
            name: true,
            url: true,
            allowRegistrationSelect: true,
          },
        },
      },
    },
  });

  if (!res?.partnerWorkspaceSet?.length) {
    return [];
  }

  return res?.partnerWorkspaceSet
    .map((item: any) => item.workspace)
    .filter(Boolean);
}
export async function findContactWorkspaces({
  url,
  partnerId,
  contactId,
  tenantId,
}: {
  url: string;
  partnerId: ID;
  contactId: ID;
  tenantId: Tenant['id'];
}) {
  if (!(url && partnerId && contactId)) return [];

  const client = await manager.getClient(tenantId);

  const partnerWorkspaces = await findPartnerWorkspaces({
    url,
    partnerId,
    tenantId,
  });

  if (!partnerWorkspaces?.length) return [];

  const res: any = await client.aOSPartner.findOne({
    where: {
      id: contactId,
    },
    select: {
      contactWorkspaceConfigSet: {
        where: {
          portalWorkspace: {
            url: {
              like: `${url}%`,
            },
          },
        },
        select: {
          portalWorkspace: {
            id: true,
            name: true,
            url: true,
            allowRegistrationSelect: true,
          },
        },
      },
    },
  });

  if (!res?.contactWorkspaceConfigSet?.length) {
    return [];
  }

  const partnerWorkspaceAccess = (workspace: any) => {
    return partnerWorkspaces.some((w: any) => w.id === workspace?.id);
  };

  return res?.contactWorkspaceConfigSet
    .map((item: any) => item.portalWorkspace)
    .filter(partnerWorkspaceAccess)
    .filter(Boolean);
}

export async function findWorkspaces({
  url,
  user,
  tenantId,
}: {
  url?: string;
  user?: User;
  tenantId: Tenant['id'];
}) {
  if (!(url && tenantId)) return [];

  if (!user) {
    return findOpenWorkspaces({url, tenantId});
  }

  if (!user.isContact) {
    return findPartnerWorkspaces({url, partnerId: user.id, tenantId});
  }

  if (user.isContact) {
    return findContactWorkspaces({
      url,
      contactId: user.id,
      partnerId: user.mainPartnerId!,
      tenantId,
    });
  }

  return [];
}

export async function findWorkspaceApps({
  url,
  user,
  tenantId,
}: {
  url?: string;
  user?: User;
  tenantId: Tenant['id'];
}) {
  const workspace = await findWorkspace({url, user, tenantId});

  const apps = workspace?.apps;

  if (!apps) {
    return [];
  }

  if (!user || !user.isContact) {
    return apps;
  }

  const contactWorkpaceConfig = await findContactWorkspaceConfig({
    url: workspace.url,
    contactId: user.id,
    tenantId,
  });

  const available = (app: any) =>
    apps.some(a => a.code === app.code && a.installed === 'yes');

  const contactApps = (contactWorkpaceConfig?.apps || []).filter(available);

  return [...defaultApps, ...contactApps];
}

export async function findSubapps({
  url,
  user,
  tenantId,
}: {
  url: string;
  user?: User;
  tenantId: Tenant['id'];
}) {
  if (!tenantId) return [];

  const apps = await findWorkspaceApps({
    url,
    user,
    tenantId,
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
  tenantId,
}: {
  code: string;
  url: string;
  user?: User;
  tenantId: Tenant['id'];
}) {
  if (!tenantId) return null;

  const subapps = await findSubapps({url, user, tenantId});

  return subapps.find((app: any) => app.code === code);
}

export async function findSubappAccess({
  code,
  user,
  url,
  tenantId,
}: {
  code: string;
  user: any;
  url: string;
  tenantId: Tenant['id'];
}) {
  if (!(code && url && tenantId)) return null;

  const subapp = await findSubapp({code, url, user, tenantId});

  if (!subapp?.installed) return null;

  return subapp;
}

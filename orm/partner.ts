import type {
  CreateArgs,
  Payload,
  SelectOptions,
  UpdateArgs,
  WhereOptions,
} from '@goovee/orm';
import {getSession} from '@/auth';
import {UserType} from '@/auth/types';
import {hash} from '@/auth/utils';
import type {Client} from '@/goovee/.generated/client';
import {USER_CREATED_FROM} from '@/constants';
import {clone} from '@/utils';
import {ID, Localization} from '@/types';
import {PortalWorkspace} from '@/orm/workspace';
import {
  findContactWorkspaceConfig,
  findDefaultPartnerWorkspaceConfig,
} from './workspace';
import type {AOSPartner} from '@/goovee/.generated/models';
import {Cloned} from '@/types/util';

const partnerFields = {
  firstName: true,
  fullName: true,
  simpleFullName: true,
  fixedPhone: true,
  mobilePhone: true,
  isContact: true,
  name: true,
  password: true,
  emailAddress: {address: true},
  picture: {id: true},
  linkedinLink: true,
  mainPartner: {
    id: true,
    version: true,
    simpleFullName: true,
    emailAddress: {address: true},
    isInDirectory: true,
    isEmailInDirectory: true,
    isPhoneInDirectory: true,
    isWebsiteInDirectory: true,
    isAddressInDirectory: true,
    directoryCompanyDescription: true,
    isFunctionInDirectory: true,
    isLinkedinInDirectory: true,
    picture: {id: true},
    partnerAddressList: {
      select: {
        isInvoicingAddr: true,
        isDefaultAddr: true,
        address: {formattedFullName: true},
      },
    },
  },
  partnerCategory: {
    name: true,
    code: true,
  },
  defaultWorkspace: {
    id: true,
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
      isAdmin: true,
      partner: {id: true, name: true},
    },
  },
  localization: {
    code: true,
    name: true,
  },
  partnerTypeSelect: true,
  registrationCode: true,
  isAllowedToRegister: true,
  isActivatedOnPortal: true,
  createdFromSelect: true,
  canSubscribeNoPublicEvent: true,
  isInDirectory: true,
  isEmailInDirectory: true,
  isPhoneInDirectory: true,
  isWebsiteInDirectory: true,
  isAddressInDirectory: true,
  directoryCompanyDescription: true,
  isFunctionInDirectory: true,
  isLinkedinInDirectory: true,
  partnerAddressList: {
    select: {
      isInvoicingAddr: true,
      isDefaultAddr: true,
      address: {formattedFullName: true},
    },
  },
} as const satisfies SelectOptions<AOSPartner>;

export type Partner = Cloned<
  Payload<AOSPartner, {select: typeof partnerFields}>
>;

export async function findPartnerById(id: ID, client: Client, params?: any) {
  if (!id) return null;

  const partner = await client.aOSPartner
    .findOne({
      where: {
        id,
        ...params?.where,
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
  client,
}: {
  workspaceURL: PortalWorkspace['url'];
  client: Client;
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
    client,
    url: workspaceURL,
    contactId: user.id,
    partnerId: user.mainPartnerId!,
  });

  if (!contactWorkspaceConfig?.isAdmin) {
    return false;
  }

  return user;
}

export async function findEmailAddress(email: string, client: Client) {
  if (!email) {
    return null;
  }

  return client.aOSEmailAddress.findOne({
    where: {
      address: email,
    },
    select: {id: true},
  });
}

export async function findGooveeUserByEmail(email: string, client: Client) {
  return findPartnerByEmail(email, client, {
    where: {
      isActivatedOnPortal: {
        eq: true,
      },
    },
  });
}

/* ------------------------------------------------------------------ *
 * Short-TTL cache for the session-enrichment hot path.
 *
 * `customSession` calls findGooveeUserByEmail on EVERY getSession — i.e. in
 * middleware, in generateMetadata, in the layout, AND for every speculative
 * <Link> prefetch. Uncached, an authenticated page view fires ~100 of these
 * partner queries (most for links never clicked). This caches that read with a
 * short TTL that bounds how stale auth/permission data can be.
 *
 * Scope/safety:
 * - Key MUST include tenantId (multi-tenant isolation). Never key by email alone.
 * - Use ONLY for the read/enrichment path. Auth & registration flows keep using
 *   the uncached findGooveeUserByEmail (they need a guaranteed-fresh read).
 * - Values are cloned in and out — never share a cached reference across requests.
 * - TTL bounds staleness; call invalidateGooveeUser() to bust eagerly on
 *   deactivation / profile / permission changes (see invalidation notes in the ticket).
 * ------------------------------------------------------------------ */
type CachedGooveeUser = Awaited<ReturnType<typeof findGooveeUserByEmail>>;

const GOOVEE_USER_TTL_MS = 10_000; // 10s — tune with security sign-off
const GOOVEE_USER_MAX = 2000;
// Stores the in-flight PROMISE, not the resolved value: concurrent misses on a
// cold/expired key share one DB query instead of stampeding (observed: 4-6
// parallel queries at startup and on every TTL expiry with value-caching).
const gooveeUserCache = new Map<
  string,
  {value: Promise<CachedGooveeUser>; expiresAt: number}
>();

const gooveeUserKey = (tenantId: string, email: string) =>
  `${tenantId}::${email.toLowerCase()}`;

/** Evict the cached partner for (tenant, email). Call on deactivation, profile/permission change, or registration. */
export function invalidateGooveeUser(
  tenantId: string | null | undefined,
  email: string | null | undefined,
) {
  if (!tenantId || !email) return;
  gooveeUserCache.delete(gooveeUserKey(tenantId, email));
}

/**
 * Tenant-scoped, short-TTL cached read of the portal user, for the
 * high-frequency session-enrichment path ONLY. Falls back to an uncached read
 * when tenantId is absent. Do not use where a guaranteed-fresh read is required.
 */
export async function findGooveeUserByEmailCached(
  email: string,
  client: Client,
  tenantId: string | null | undefined,
) {
  if (!email || !tenantId) {
    return findGooveeUserByEmail(email, client);
  }

  const key = gooveeUserKey(tenantId, email);
  const entry = gooveeUserCache.get(key);
  if (entry && entry.expiresAt > Date.now()) {
    return clone(await entry.value); // clone out — callers must not mutate the cached value
  }

  const promise = findGooveeUserByEmail(email, client).then(partner => {
    if (!partner) {
      // never cache null — customSession's !partner branch clears the user's
      // session cookies, so a stale null would force-logout for the whole TTL
      gooveeUserCache.delete(key);
    }
    return partner;
  });
  // a failed query must not stay cached; waiters still see the rejection
  promise.catch(() => gooveeUserCache.delete(key));

  if (gooveeUserCache.size >= GOOVEE_USER_MAX) {
    const oldest = gooveeUserCache.keys().next().value; // bound memory (FIFO eviction)
    if (oldest !== undefined) {
      gooveeUserCache.delete(oldest);
    }
  }
  // set BEFORE awaiting — this is what makes concurrent misses coalesce
  gooveeUserCache.set(key, {
    value: promise,
    expiresAt: Date.now() + GOOVEE_USER_TTL_MS,
  });

  return clone(await promise); // the cached copy is never handed out directly
}

export async function findContactByEmail(email: string, client: Client) {
  return findPartnerByEmail(email, client, {
    where: {
      isContact: {
        eq: true,
      },
    },
  });
}

export async function findContactById(id: Partner['id'], client: Client) {
  return findPartnerById(id, client, {
    where: {
      isContact: {
        eq: true,
      },
    },
  });
}

export async function findPartnerByEmail(
  email: string,
  client: Client,
  params?: {where: WhereOptions<AOSPartner>},
) {
  if (!email) return null;

  const partner = await client.aOSPartner
    .findOne({
      where: {
        emailAddress: {
          address: {
            eq: email,
          },
        },
        ...params?.where,
      },
      select: partnerFields,
    })
    .then(clone);

  return partner;
}

export async function findPartnerAllowedToRegister(
  email: string,
  client: Client,
) {
  if (!email) return null;

  return findPartnerByEmail(email, client, {
    where: {
      isAllowedToRegister: true,
    },
  });
}

export async function updatePartner({
  data,
  client,
  tenantId,
  email,
}: {
  data: UpdateArgs<AOSPartner>;
  client: Client;
  tenantId?: string | null;
  email?: string | null;
}) {
  if (!data) return null;

  if (!(data?.id && data?.version)) return null;

  const partner = await client.aOSPartner
    .update({
      data: {
        ...data,
        id: String(data.id),
      },
      select: {id: true},
    })
    .then(clone);

  if (tenantId && email) {
    invalidateGooveeUser(tenantId, email);
  }

  return partner;
}

export async function registerContact({
  name,
  firstName,
  email,
  password,
  client,
  contactConfig,
  partnerId,
  localizationId,
  existingRecord,
  tenantId,
}: {
  name: string;
  firstName?: string;
  email: string;
  password?: string;
  client: Client;
  contactConfig?: any;
  partnerId: string;
  localizationId?: Localization['id'];
  existingRecord?: {id: string; version: number} | null;
  tenantId?: string | null;
}) {
  if (!(name && email && partnerId)) {
    return null;
  }

  const hashedPassword = password && (await hash(password));

  const mainPartner = await client.aOSPartner.findOne({
    where: {id: partnerId},
    select: {
      id: true,
      version: true,
      companySet: {select: {id: true}},
      defaultWorkspace: {id: true},
    },
  });

  if (!mainPartner) {
    return null;
  }

  const companySet = mainPartner.companySet?.map(c => ({id: c.id}));

  const data: CreateArgs<AOSPartner> = {
    partnerTypeSelect: PartnerTypeMap[UserType.individual],
    firstName,
    name,
    mainPartner: {
      select: {
        id: partnerId,
      },
    },
    ...(!!companySet?.length && {
      companySet: {select: companySet},
    }),
    password: hashedPassword,
    isContact: true,
    isCustomer: true,
    fullName: `${name} ${firstName || ''}`,
    simpleFullName: `${name} ${firstName || ''}`,
    createdFromSelect: USER_CREATED_FROM,
    isActivatedOnPortal: true,
    emailAddress: {
      create: {
        address: email,
        name: email,
      },
    },
    localization: localizationId ? {select: {id: localizationId}} : undefined,
  };

  if (contactConfig?.id) {
    data.contactWorkspaceConfigSet = {select: [{id: contactConfig.id}]};
  }
  if (mainPartner.defaultWorkspace?.id) {
    data.defaultWorkspace = {select: {id: mainPartner.defaultWorkspace.id}};
  }

  let contact;
  if (existingRecord) {
    delete data.createdFromSelect;
    contact = await client.aOSPartner
      .update({
        data: {
          ...data,
          id: existingRecord.id,
          version: existingRecord.version,
        },
        select: {id: true},
      })
      .then(clone);
  } else {
    contact = await client.aOSPartner
      .create({data, select: {id: true}})
      .then(clone);
  }

  await client.aOSPartner.update({
    data: {
      id: mainPartner.id,
      version: mainPartner.version,
      contactPartnerSet: {select: {id: contact.id}},
    },
    select: {id: true},
  });

  if (tenantId) {
    invalidateGooveeUser(tenantId, email);
  }
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
  client,
  isContact,
  localizationId,
}: {
  type: UserType;
  companyName?: string;
  identificationNumber?: string;
  companyNumber?: string;
  firstName?: string;
  name?: string;
  password?: string;
  email: string;
  workspaceURL?: string;
  client: Client;
  isContact?: boolean;
  localizationId?: Localization['id'];
}) {
  const hashedPassword = await hash(password);

  const isCompany = type === UserType.company;
  const partnerTypeSelect =
    PartnerTypeMap[type] || PartnerTypeMap[UserType.individual];

  const $name = isCompany ? companyName : name;

  const data: any = {
    partnerTypeSelect,
    registrationCode: identificationNumber,
    fixedPhone: companyNumber,
    firstName,
    name: $name,
    password: hashedPassword,
    isContact: isContact || false,
    isCustomer: true,
    fullName: `${$name} ${firstName || ''}`,
    simpleFullName: `${$name} ${firstName || ''}`,
    createdFromSelect: USER_CREATED_FROM,
    isActivatedOnPortal: true,
    emailAddress: {
      create: {
        address: email,
        name: email,
      },
    },
    localization: localizationId ? {select: {id: localizationId}} : null,
  };

  if (workspaceURL) {
    const defaultPartnerWorkspaceConfig =
      await findDefaultPartnerWorkspaceConfig({url: workspaceURL, client});

    const id = defaultPartnerWorkspaceConfig?.id;

    if (id) {
      data.partnerWorkspaceSet = {select: [{id}]};
      data.defaultWorkspace = {select: [{id}]};
    }
  }

  const existingPartner = await findPartnerByEmail(email, client);

  if (existingPartner && !existingPartner.isActivatedOnPortal) {
    const {id, version} = existingPartner;
    const udpatedPartner = await client.aOSPartner.update({
      data: {
        ...data,
        id,
        version,
      },
      select: {id: true},
    });

    return udpatedPartner;
  }

  const partner = await client.aOSPartner
    .create({data, select: {id: true}})
    .then(clone);
  return partner;
}

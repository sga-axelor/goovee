'use server';

import {revalidatePath} from 'next/cache';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {UserType} from '@/auth/types';
import {
  findContactByEmail,
  findPartnerByEmail,
  findPartnerById,
  registerPartner,
} from '@/orm/partner';
import {
  findDefaultPartnerWorkspaceConfig,
  findWorkspaceByURL,
  findWorkspaces,
} from '@/orm/workspace';
import {getTranslation} from '@/locale/server';
import {manager, type Tenant} from '@/tenant';
import type {PortalWorkspace} from '@/types';
import {ALLOW_AOS_ONLY_REGISTRATION, ALLOW_NO_REGISTRATION} from '@/constants';
import {findOne, isValid} from '@/otp/orm';
import {Scope} from '@/otp/constants';
import {findRegistrationLocalization} from '@/orm/localizations';

function error(message: string) {
  return {
    error: true,
    message,
  };
}

export async function subscribe({
  workspace,
  tenantId,
}: {
  workspace: PortalWorkspace;
  tenantId?: Tenant['id'] | null;
}) {
  const session = await getSession();
  const user = session?.user;

  if (!(workspace && tenantId)) {
    return error(await getTranslation({}, 'Bad request'));
  }

  if (!user) {
    return error(await getTranslation({}, 'Unauthorized'));
  }

  const url = workspace?.url;

  const userWorkspaces = await findWorkspaces({url, user, tenantId});

  const existing = userWorkspaces?.find((w: any) => w.id === workspace?.id);

  if (existing) {
    return error(await getTranslation({}, 'Already subscribed'));
  }

  const defaultPartnerWorkspaceConfig = await findDefaultPartnerWorkspaceConfig(
    {url, tenantId},
  );

  if (!defaultPartnerWorkspaceConfig) {
    return error(
      await getTranslation(
        {},
        'Cannot subscribe, no default permissions available for the workspace',
      ),
    );
  }

  const client = await manager.getClient(tenantId);

  const $user = await client.aOSPartner.findOne({
    where: {
      id: user.id,
    },
    select: {
      isContact: true,
      mainPartner: {
        id: true,
      },
    },
  });

  if (!$user) {
    return error(await getTranslation({}, 'Bad request'));
  }

  if (!$user.isContact) {
    try {
      await client.aOSPartner.update({
        data: {
          id: $user.id,
          version: $user.version,
          partnerWorkspaceSet: {
            select: [
              {
                id: defaultPartnerWorkspaceConfig.id,
              },
            ],
          },
        },
      });

      revalidatePath('/', 'layout');

      return {
        success: true,
        message: await getTranslation({}, 'Successfully subscribed'),
      };
    } catch (err) {}
  } else {
    const {mainPartner} = $user;

    if (!mainPartner?.id) {
      return error(
        await getTranslation({}, 'Partner not available for the contact'),
      );
    }
    const partnerWorkspaces = await findWorkspaces({
      url,
      user: {
        id: $user.mainPartner.id!,
        isContact: false,
      } as any,
      tenantId,
    });

    const existsInPartner = partnerWorkspaces.find((w: any) => w.url === url);

    if (!existsInPartner) {
      return error(
        await getTranslation(
          {},
          `Partner didn't have access to workspace, cannot subscribe`,
        ),
      );
    } else {
      try {
        await client.aOSPartner.update({
          data: {
            id: $user.id,
            version: $user.version,
            contactWorkspaceConfigSet: {
              create: [
                {
                  name: `${user.name}-${url}`,
                  portalWorkspace: {
                    select: [
                      {
                        id: workspace.id,
                      },
                    ],
                  },
                },
              ],
            },
          },
        });

        revalidatePath('/', 'layout');

        return {
          success: true,
          message: await getTranslation({}, 'Successfully subscribed'),
        };
      } catch (err) {
        console.log(err);
      }
    }
  }

  return error(await getTranslation({}, 'Error subscribing, try again'));
}

type RegisterDTO = {
  type: UserType;
  companyName?: string;
  identificationNumber?: string;
  companyNumber?: string;
  firstName?: string;
  name: string;
  email: string;
  otp?: string;
  password?: string;
  confirmPassword?: string;
  workspaceURL?: string;
  tenantId: Tenant['id'];
  locale?: string;
};

export async function register({
  type,
  companyName,
  identificationNumber,
  companyNumber,
  firstName,
  name,
  email,
  password,
  workspaceURL,
  tenantId,
  locale,
}: RegisterDTO) {
  if (type === UserType.individual && !name) {
    return error(await getTranslation({tenant: tenantId}, 'Name is required.'));
  }

  if (type === UserType.company && !companyName) {
    return error(
      await getTranslation({tenant: tenantId}, 'Company name is required'),
    );
  }

  if (!tenantId) {
    return error(
      await getTranslation({tenant: tenantId}, 'Tenant is required.'),
    );
  }

  if (!workspaceURL) {
    return error(
      await getTranslation({tenant: tenantId}, 'Workspace is required.'),
    );
  }

  const workspace = await findWorkspaceByURL({url: workspaceURL, tenantId});

  if (!workspace) {
    return error(await getTranslation({tenant: tenantId}, 'Invalid workspace'));
  }

  if (workspace.allowRegistrationSelect === ALLOW_NO_REGISTRATION) {
    return error(
      await getTranslation({tenant: tenantId}, 'Registration not allowed'),
    );
  }

  const partner = await findPartnerByEmail(email, tenantId, {
    where: {
      isContact: {
        eq: false,
      },
    },
  });

  if (partner?.isActivatedOnPortal) {
    return {
      error: true,
      message: await getTranslation(
        {tenant: tenantId},
        'Account already exists',
      ),
    };
  }

  if (workspace.allowRegistrationSelect === ALLOW_AOS_ONLY_REGISTRATION) {
    if (partner) {
      if (!partner?.isAllowedToRegister) {
        return {
          error: true,
          message: await getTranslation(
            {tenant: tenantId},
            'Registration not allowed',
          ),
        };
      }
    } else {
      const result = await updatePartnerEmailByContact(email, tenantId);
      if (result?.error) {
        return result;
      }
    }
  }

  const localization = await findRegistrationLocalization({locale, tenantId});

  try {
    const partner = await registerPartner({
      type,
      companyName,
      identificationNumber,
      companyNumber,
      firstName,
      name,
      email,
      password,
      workspaceURL,
      tenantId,
      localizationId: localization?.id,
    });

    const $partner =
      partner?.id && (await findPartnerById(partner.id, tenantId));

    return {
      success: true,
      message: await getTranslation({}, 'Registered successfully'),
      data: $partner,
    };
  } catch (err) {}

  return {
    error: true,
    message: await getTranslation({}, 'Error registering, try again'),
  };
}

export async function registerByEmail(data: RegisterDTO) {
  const {email, password, confirmPassword, otp, tenantId} = data;

  if (!tenantId) {
    return error(await getTranslation({}, 'Bad request'));
  }

  if (!(email && password && confirmPassword)) {
    return error(
      await getTranslation(
        {tenant: tenantId},
        'Email and password are required.',
      ),
    );
  }

  if (password !== confirmPassword) {
    return error(
      await getTranslation(
        {tenant: tenantId},
        'Password and confirm password mismatch.',
      ),
    );
  }

  if (!otp) {
    return error(await getTranslation({tenant: tenantId}, 'OTP is required'));
  }

  const otpResult = await findOne({
    scope: Scope.Registration,
    entity: email,
    tenantId,
  });

  if (!otpResult) {
    return error(await getTranslation({tenant: tenantId}, 'Invalid OTP'));
  }

  if (!(await isValid({id: otpResult.id, value: otp, tenantId}))) {
    return error(await getTranslation({tenant: tenantId}, 'Invalid OTP'));
  }

  return register(data);
}

export async function registerByGoogle(
  data: Omit<RegisterDTO, 'password' | 'confirmPassword' | 'email' | 'otp'>,
) {
  const {tenantId} = data;

  if (!tenantId) {
    return error(await getTranslation({}, 'Bad request'));
  }

  const session = await getSession();
  const user = session?.user;

  if (!user?.email) {
    return error(
      await getTranslation(
        {tenant: tenantId},
        'Login using google and try again.',
      ),
    );
  }

  return register({...data, email: user.email});
}

async function updatePartnerEmailByContact(
  email: string,
  tenantId: Tenant['id'],
) {
  if (!(email && tenantId)) {
    return {
      error: true,
      message: await getTranslation(
        {tenant: tenantId},
        'Email & TenantId is required',
      ),
    };
  }

  const contact = await findContactByEmail(email, tenantId);

  if (!contact) {
    return {
      error: true,
      message: await getTranslation(
        {tenant: tenantId},
        'Registration not allowed',
      ),
    };
  }

  if (contact.isActivatedOnPortal) {
    return {
      error: true,
      message: await getTranslation(
        {tenant: tenantId},
        'Registration not allowed',
      ),
    };
  }

  if (!contact?.isAllowedToRegister) {
    return {
      error: true,
      message: await getTranslation(
        {tenant: tenantId},
        'Registration not allowed',
      ),
    };
  }

  const contactPartner =
    contact?.mainPartner &&
    (await findPartnerById(contact.mainPartner?.id, tenantId));

  if (!contactPartner) {
    return {
      error: true,
      message: await getTranslation(
        {tenant: tenantId},
        'Registration not allowed',
      ),
    };
  }

  if (contactPartner?.isActivatedOnPortal) {
    return {
      error: true,
      message: await getTranslation(
        {tenant: tenantId},
        'Registration not allowed',
      ),
    };
  }

  if (!contactPartner?.isAllowedToRegister) {
    return {
      error: true,
      message: await getTranslation(
        {tenant: tenantId},
        'Registration not allowed',
      ),
    };
  }

  try {
    const {id, version} = contactPartner?.emailAddress;
    const client = await manager.getClient(tenantId);

    /**
     * Update partner email by contact email when a valid contact
     * is trying to register on behalf of partner
     */
    await client.aOSEmailAddress.update({
      data: {
        id,
        version,
        name: email,
        address: email,
      },
    });
  } catch (err) {
    return {
      error: true,
      message: await getTranslation(
        {tenant: tenantId},
        'Registration not allowed',
      ),
    };
  }
}

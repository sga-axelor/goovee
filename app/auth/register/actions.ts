'use server';

import {revalidatePath} from 'next/cache';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {UserType} from '@/auth/types';
import {
  findPartnerByEmail,
  findPartnerById,
  registerPartner,
} from '@/orm/partner';
import {
  findDefaultPartnerWorkspaceConfig,
  findWorkspaceByURL,
  findWorkspaces,
} from '@/orm/workspace';
import {getTranslation} from '@/i18n/server';
import {manager, type Tenant} from '@/tenant';
import type {PortalWorkspace} from '@/types';
import {ALLOW_AOS_ONLY_REGISTRATION, ALLOW_NO_REGISTRATION} from '@/constants';

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
    return error(await getTranslation('Bad Request'));
  }

  if (!user) {
    return error(await getTranslation('Unauthorized'));
  }

  const url = workspace?.url;

  const userWorkspaces = await findWorkspaces({url, user, tenantId});

  const existing = userWorkspaces?.find((w: any) => w.id === workspace?.id);

  if (existing) {
    return error(await getTranslation('Already subscribed'));
  }

  const defaultPartnerWorkspaceConfig = await findDefaultPartnerWorkspaceConfig(
    {url, tenantId},
  );

  if (!defaultPartnerWorkspaceConfig) {
    return error(
      await getTranslation(
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
    return error(await getTranslation('Bad request'));
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
        message: await getTranslation('Successfully subscribed'),
      };
    } catch (err) {}
  } else {
    const {mainPartner} = $user;

    if (!mainPartner?.id) {
      return error(
        await getTranslation('Partner not available for the contact'),
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
          message: await getTranslation('Successfully subscribed'),
        };
      } catch (err) {
        console.log(err);
      }
    }
  }

  return error(await getTranslation('Error subscribing, try again.'));
}

type RegisterDTO = {
  type: UserType;
  companyName?: string;
  identificationNumber?: string;
  companyNumber?: string;
  firstName?: string;
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  workspaceURL?: string;
  tenantId: Tenant['id'];
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
}: RegisterDTO) {
  if (type === UserType.individual && !name) {
    return error(await getTranslation('Name is required.', {tenantId}));
  }

  if (type === UserType.company && !companyName) {
    return error(await getTranslation('Company name is required.', {tenantId}));
  }

  if (!tenantId) {
    return error(await getTranslation('Tenant is required.', {tenantId}));
  }

  if (!workspaceURL) {
    return error(await getTranslation('Workspace is required.', {tenantId}));
  }

  const workspace = await findWorkspaceByURL({url: workspaceURL, tenantId});

  if (!workspace) {
    return error(await getTranslation('Invalid workspace', {tenantId}));
  }

  if (workspace.allowRegistrationSelect === ALLOW_NO_REGISTRATION) {
    return error(await getTranslation('Registration not allowed', {tenantId}));
  }

  const $partner = await findPartnerByEmail(email, tenantId);

  if (
    workspace.allowRegistrationSelect === ALLOW_AOS_ONLY_REGISTRATION &&
    !$partner
  ) {
    return error(await getTranslation('Registration not allowed', {tenantId}));
  }

  if ($partner && $partner.isRegisteredOnPortal) {
    return {
      error: true,
      message: await getTranslation('Email already exists', {tenantId}),
    };
  }

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
    });

    const $partner =
      partner?.id && (await findPartnerById(partner.id, tenantId));

    return {
      success: true,
      message: await getTranslation('Registered successfully'),
      data: $partner,
    };
  } catch (err) {}

  return {
    error: true,
    message: await getTranslation('Error registering, try again'),
  };
}

export async function registerByEmail(data: RegisterDTO) {
  const {email, password, confirmPassword, tenantId} = data;

  if (!tenantId) {
    return error(await getTranslation('Bad Request'));
  }

  if (!(email && password && confirmPassword)) {
    return error(
      await getTranslation('Email and password are required.', {tenantId}),
    );
  }

  if (password !== confirmPassword) {
    return error(
      await getTranslation('Password and confirm password mismatch.', {
        tenantId,
      }),
    );
  }

  return register(data);
}

export async function registerByGoogle(
  data: Omit<RegisterDTO, 'password' | 'confirmPassword' | 'email'>,
) {
  const {tenantId} = data;

  if (!tenantId) {
    return error(await getTranslation('Bad Request'));
  }

  const session = await getSession();
  const user = session?.user;

  if (!user?.email) {
    return error(
      await getTranslation('Login using google and try again.', {tenantId}),
    );
  }

  return register({...data, email: user.email});
}

'use server';

import {revalidatePath} from 'next/cache';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {UserType} from '@/auth/types';
import {findPartnerByEmail, registerPartner} from '@/orm/partner';
import {
  findDefaultPartnerWorkspaceConfig,
  findWorkspaceByURL,
  findWorkspaceMembers,
  findWorkspaces,
} from '@/orm/workspace';
import {getTranslation} from '@/i18n/server';
import {manager, type Tenant} from '@/tenant';
import type {PortalWorkspace} from '@/types';
import {ALLOW_AOS_ONLY_REGISTRATION, ALLOW_NO_REGISTRATION} from '@/constants';

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
    return {
      error: true,
      message: await getTranslation('Bad Request'),
    };
  }

  if (!user) {
    return {
      error: true,
      message: await getTranslation('Unauthorized'),
    };
  }

  const url = workspace?.url;

  const userWorkspaces = await findWorkspaces({url, user, tenantId});

  const existing = userWorkspaces?.find((w: any) => w.id === workspace?.id);

  if (existing) {
    return {
      error: true,
      message: await getTranslation('Already subscribed'),
    };
  }

  const defaultPartnerWorkspaceConfig = await findDefaultPartnerWorkspaceConfig(
    {url, tenantId},
  );

  if (!defaultPartnerWorkspaceConfig) {
    return {
      error: true,
      message: await getTranslation(
        'Cannot subscribe, no default permissions available for the workspace',
      ),
    };
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
    return {
      error: true,
      message: await getTranslation('Bad request'),
    };
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
      return {
        error: true,
        message: await getTranslation('Partner not available for the contact'),
      };
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
      return {
        error: true,
        message: await getTranslation(
          `Partner didn't have access to workspace, cannot subscribe`,
        ),
      };
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

  return {
    error: true,
    message: await getTranslation('Error subscribing, try again.'),
  };
}

export async function register({
  type,
  companyName,
  identificationNumber,
  companyNumber,
  firstName,
  name,
  email,
  password,
  confirmPassword,
  workspaceURL,
  tenantId,
}: {
  type: UserType;
  companyName?: string;
  identificationNumber?: string;
  companyNumber?: string;
  firstName?: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  workspaceURL?: string;
  tenantId?: Tenant['id'] | null;
}) {
  if (!(email && password && confirmPassword)) {
    throw new Error('Email and password are required.');
  }

  if (password !== confirmPassword) {
    throw new Error('Password and confirm password mismatch.');
  }

  if (type === UserType.individual && !name) {
    throw new Error('Name is required.');
  }

  if (type === UserType.company && !companyName) {
    throw new Error('Company name is required.');
  }

  if (!tenantId) {
    throw new Error('Tenant is required.');
  }

  if (!workspaceURL) {
    throw new Error('Workspace is required.');
  }

  const workspace = await findWorkspaceByURL({url: workspaceURL, tenantId});

  if (!workspace) {
    throw new Error('Invalid workspace');
  }

  if (workspace.allowRegistrationSelect === ALLOW_NO_REGISTRATION) {
    throw new Error('Registration not allowed');
  }

  const $partner = await findPartnerByEmail(email, tenantId);

  if (
    workspace.allowRegistrationSelect === ALLOW_AOS_ONLY_REGISTRATION &&
    !$partner
  ) {
    throw new Error('Registration not allowed');
  }

  if ($partner && $partner.isRegisteredOnPortal) {
    return {
      error: true,
      message: await getTranslation('Email already exists'),
    };
  }

  const existingMembers = await findWorkspaceMembers({
    tenantId,
    url: workspaceURL,
  });

  const alreadyHasPartnerInWorkspace = existingMembers?.partners?.length;

  if (alreadyHasPartnerInWorkspace) {
    return {
      error: true,
      message: await getTranslation(
        'You cannot register, partner already exists for the workspace',
      ),
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

    return {
      success: true,
      message: await getTranslation('Registered successfully'),
    };
  } catch (err) {}

  return {
    error: true,
    message: await getTranslation('Error registering, try again'),
  };
}

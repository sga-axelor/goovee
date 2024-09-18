'use server';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {findPartnerByEmail, registerPartner} from '@/orm/partner';
import {
  findDefaultPartnerWorkspaceConfig,
  findWorkspaces,
} from '@/orm/workspace';
import {i18n} from '@/i18n';
import {manager, type Tenant} from '@/tenant';
import type {PortalWorkspace} from '@/types';
import {revalidatePath} from 'next/cache';

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
      message: i18n.get('Bad Request'),
    };
  }

  if (!user) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const url = workspace?.url;

  const userWorkspaces = await findWorkspaces({url, user, tenantId});

  const existing = userWorkspaces?.find((w: any) => w.id === workspace?.id);

  if (existing) {
    return {
      error: true,
      message: i18n.get('Already subscribed'),
    };
  }

  const defaultPartnerWorkspaceConfig = await findDefaultPartnerWorkspaceConfig(
    {url, tenantId},
  );

  if (!defaultPartnerWorkspaceConfig) {
    return {
      error: true,
      message: i18n.get(
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
      message: i18n.get('Bad request'),
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
        message: i18n.get('Successfully subscribed'),
      };
    } catch (err) {}
  } else {
    const {mainPartner} = $user;

    if (!mainPartner?.id) {
      return {
        error: true,
        message: i18n.get('Partner not available for the contact'),
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
        message: i18n.get(
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
          message: i18n.get('Successfully subscribed'),
        };
      } catch (err) {
        console.log(err);
      }
    }
  }

  return {
    error: true,
    message: i18n.get('Error subscribing, try again.'),
  };
}

export async function register({
  firstName,
  name,
  email,
  password,
  confirmPassword,
  workspaceURL,
  tenantId,
}: {
  firstName?: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  workspaceURL?: string;
  tenantId?: Tenant['id'] | null;
}) {
  if (!(name && email && password && confirmPassword)) {
    throw new Error('Name, email and password is required.');
  }

  if (password !== confirmPassword) {
    throw new Error('Password and confirm password mismatch.');
  }

  if (!tenantId) {
    throw new Error('Tenant is required.');
  }

  const existing = await findPartnerByEmail(email, tenantId);

  if (existing) {
    return {
      error: true,
      message: i18n.get('Email already exists'),
    };
  }

  try {
    const partner = await registerPartner({
      firstName,
      name,
      email,
      password,
      workspaceURL,
      tenantId,
    });

    return {
      success: true,
      message: i18n.get('Registered successfully'),
    };
  } catch (err) {}

  return {
    error: true,
    message: i18n.get('Error registering, try again'),
  };
}

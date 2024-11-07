// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {SUBAPP_CODES} from '@/constants';
import {manager, type Tenant} from '@/tenant';

// ---- LOCAL IMPORTS ---- //
import {
  validate,
  withSubapp,
  withWorkspace,
} from '@/subapps/events/common/actions/validation';

export async function findContact({
  search,
  workspaceURL,
  tenantId,
}: {
  search: string;
  workspaceURL: string;
  tenantId: Tenant['id'];
}) {
  const response = await validate([
    withWorkspace(workspaceURL, tenantId, {checkAuth: false}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);

  if (response.error) {
    return response;
  }

  const c = await manager.getClient(tenantId);

  const result = await c.aOSPartner.find({
    where: {
      AND: [
        {
          simpleFullName: {
            like: `%${search.toLowerCase()}%`,
          },
        },
        {
          isContact: {
            eq: true,
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      firstName: true,
      simpleFullName: true,
      emailAddress: true,
      fixedPhone: true,
      mainPartner: true,
    },
  });

  return result;
}

export async function findUser({
  userId,
  tenantId,
}: {
  userId: any;
  tenantId: Tenant['id'];
}) {
  console.log('userId || tenantId >>>', {userId, tenantId});
  if (!(userId && tenantId)) {
    return {};
  }

  const client = await manager.getClient(tenantId);

  const user = await client.aOSPartner.findOne({
    where: {
      id: userId,
    },
    select: {
      name: true,
      firstName: true,
      emailAddress: {
        address: true,
      },
      fixedPhone: true,
    },
  });
  return user;
}
